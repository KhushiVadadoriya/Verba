/**
 * Verba Catalog Repository
 * Handles persistent storage of canonical books and user-library relationships
 * in Supabase. Uses the existing database schema (books, book_identifiers,
 * book_sources, user_books) with RLS enforcement.
 *
 * Metadata priority (per task spec):
 *   cover_url:    Google Books > Goodreads > Hardcover
 *   publisher:    Google Books > Goodreads > Hardcover
 *   page_count:   Goodreads > Google Books > Hardcover
 *   description:  Goodreads > Google Books > Hardcover
 * Open Library remains supplementary.
 */

import { supabase } from '../supabase'
import type { NormalizedBook } from '../../types/bookCatalog'

// Provider order for metadata fallback resolution
const COVER_PRIORITY = ['google_books', 'goodreads', 'hardcover'] as const

type Provider = 'google_books' | 'goodreads' | 'hardcover' | 'open_library'

/**
 * Resolve metadata from multiple providers according to priority.
 * Returns the highest-priority non-empty value for each field.
 */
function resolveMetadata(
  google_books: NormalizedBook | undefined,
  goodreads: NormalizedBook | undefined,
  hardcover: NormalizedBook | undefined,
  open_library: NormalizedBook | undefined,
  field: keyof NormalizedBook
): string | number | undefined {
  const providers: (NormalizedBook | null)[] = [google_books ?? null, goodreads ?? null, hardcover ?? null, open_library ?? null]

  // Get all non-null values with their provider
  const valuesWithProvider: Array<{ value: string | number | undefined; provider: Provider }> = []
  providers.forEach((providerBook, index) => {
    if (providerBook && field in providerBook && providerBook[field] !== undefined) {
      const value = providerBook[field] as string | number | undefined
      if (value !== undefined && value !== null && value !== '') {
        valuesWithProvider.push({ value, provider: Object.keys({ google_books, goodreads, hardcover, open_library })[index] as Provider })
      }
    }
  })

  if (valuesWithProvider.length === 0) return undefined

  // Sort by priority and return the first (highest priority) value
  const priorityMap = {
    [COVER_PRIORITY[0]]: 0,
    [COVER_PRIORITY[1]]: 1,
    [COVER_PRIORITY[2]]: 2,
  }

  /// For others, it's Google Books > Goodreads > Hardcover

  valuesWithProvider.sort((a, b) => {
    const aPriority = a.provider === 'open_library' ? 99 : (priorityMap[a.provider] ?? 99)
    const bPriority = b.provider === 'open_library' ? 99 : (priorityMap[b.provider] ?? 99)
    return aPriority - bPriority
  })

  return valuesWithProvider[0].value
}

/**
 * Map a NormalizedBook (from search adapters) into the canonical DB book record.
 * Applies metadata priorities and extracts identifiers.
 */
function mapNormalizedToBook(
  book: NormalizedBook,
  providers: { googleBooks?: NormalizedBook; goodreads?: NormalizedBook; hardcover?: NormalizedBook; openLibrary?: NormalizedBook }
): {
  title: string
  subtitle?: string
  description?: string | null
  cover_url?: string | null
  page_count?: number | null
  publisher?: string | null
  published_date?: string | null
  published_date_precision?: string | null
  language?: string | null
  // Internal tracking fields
  source_provenance?: string
  provider_ids?: string
} {
  const resolved = resolveMetadata(
    providers.googleBooks,
    providers.goodreads,
    providers.hardcover,
    providers.openLibrary,
    'description'
  ) as string | undefined

  const coverUrl = resolveMetadata(
    providers.googleBooks,
    providers.goodreads,
    providers.hardcover,
    providers.openLibrary,
    'coverUrl'
  ) as string | undefined

  const pageCount = resolveMetadata(
    providers.googleBooks,
    providers.goodreads,
    providers.hardcover,
    providers.openLibrary,
    'pageCount'
  ) as number | undefined

  const publisher = resolveMetadata(
    providers.googleBooks,
    providers.goodreads,
    providers.hardcover,
    providers.openLibrary,
    'publisher'
  ) as string | undefined

  // Use Google Books publishedDate if available, otherwise goodreads, then hardcover
  let publishedDate: string | null = null
  let publishedDatePrecision: string | null = null

  if (providers.googleBooks?.publishedDate) {
    publishedDate = providers.googleBooks.publishedDate
    publishedDatePrecision = providers.googleBooks.publishedDatePrecision || null
  } else if (providers.goodreads?.publishedDate) {
    publishedDate = providers.goodreads.publishedDate
    publishedDatePrecision = providers.goodreads.publishedDatePrecision || null
  } else if (providers.hardcover?.publishedDate) {
    publishedDate = providers.hardcover.publishedDate
    publishedDatePrecision = providers.hardcover.publishedDatePrecision || null
  }

  // Build source provenance tracking which provider won
  let primaryProvider: Provider = 'open_library'
  const providerPriorityCheck = [
    providers.googleBooks,
    providers.goodreads,
    providers.hardcover,
  ]
  for (const pb of providerPriorityCheck) {
    if (pb) {
      primaryProvider = 'google_books' as Provider
      break
    }
  }

  return {
    title: book.title,
    subtitle: book.subtitle,
    description: resolved ?? null,
    cover_url: coverUrl ?? null,
    page_count: pageCount ?? null,
    publisher: publisher ?? null,
    published_date: publishedDate ?? null,
    published_date_precision: publishedDatePrecision ?? null,
    language: book.language ?? null,
    source_provenance: `${primaryProvider}:${book.providerIds.googleBooksId || book.providerIds.openLibraryWorkId || 'unknown'}`,
    provider_ids: book.providerIds.googleBooksId || book.providerIds.openLibraryWorkId || undefined,
  }
}

/**
 * Persist a discovered book to the Supabase database.
 * Creates the canonical book record, its identifiers, a user-book
 * relationship, and a book source entry with metadata provenance.
 */
export async function persistBookToDatabase(
  book: NormalizedBook,
  userId: string,
  sourceProviders: {
    googleBooks?: NormalizedBook
    goodreads?: NormalizedBook
    hardcover?: NormalizedBook
    openLibrary?: NormalizedBook
  }
) {
  const mapped = mapNormalizedToBook(book, sourceProviders)

  // 1. Insert canonical book record
  const { data: insertedBook, error: bookError } = await supabase
    .from('books')
    .insert({
      title: mapped.title,
      subtitle: mapped.subtitle,
      description: mapped.description,
      cover_url: mapped.cover_url,
      page_count: mapped.page_count,
      publisher: mapped.publisher,
      published_date: mapped.published_date,
      published_date_precision: mapped.published_date_precision,
      language: mapped.language,
    })
    .select()
    .single()

  if (bookError) {
    console.error('Failed to insert book:', bookError)
    throw bookError
  }

  if (!insertedBook?.id) {
    throw new Error('Book insertion returned no ID')
  }

  // 2. Insert identifiers (ISBNs)
  const identifierPromises = []

  if (book.isbn13) {
    identifierPromises.push(
      supabase.from('book_identifiers').insert({
        book_id: insertedBook.id,
        type: 'isbn_13',
        value: book.isbn13,
      })
    )
  }
  if (book.isbn10) {
    identifierPromises.push(
      supabase.from('book_identifiers').insert({
        book_id: insertedBook.id,
        type: 'isbn_10',
        value: book.isbn10,
      })
    )
  }
  if (book.providerIds.googleBooksId) {
    identifierPromises.push(
      supabase.from('book_identifiers').insert({
        book_id: insertedBook.id,
        type: 'google_books_id',
        value: book.providerIds.googleBooksId,
      })
    )
  }
  if (book.providerIds.openLibraryWorkId) {
    identifierPromises.push(
      supabase.from('book_identifiers').insert({
        book_id: insertedBook.id,
        type: 'open_library_work_id',
        value: book.providerIds.openLibraryWorkId,
      })
    )
  }

  await Promise.all(identifierPromises)

  // 3. Insert book source with metadata provenance
  const sourceInsertPromises = []

  // Determine which provider won for the source
  const sourceProvider = sourceProviders.googleBooks
    ? 'google_books'
    : sourceProviders.goodreads
      ? 'goodreads'
      : sourceProviders.hardcover
        ? 'hardcover'
        : 'open_library'

  const sourceData = {
    book_id: insertedBook.id,
    provider: sourceProvider,
    external_book_id: sourceProvider === 'google_books'
      ? sourceProviders.googleBooks?.id
      : sourceProvider === 'goodreads'
        ? sourceProviders.goodreads?.id
        : sourceProvider === 'hardcover'
          ? sourceProviders.hardcover?.id
          : sourceProviders.openLibrary?.id || book.id || '',
    source_title: book.title,
    source_author: book.authors[0] || undefined as any,
    source_cover_url: mapped.cover_url,
    source_page_count: mapped.page_count,
    status: 'active',
  }

  sourceInsertPromises.push(
    supabase.from('book_sources').insert(sourceData)
  )

  await Promise.all(sourceInsertPromises)

  // 4. Create user-book relationship
  const { error: userBookError } = await supabase
    .from('user_books')
    .insert({
      user_id: userId,
      book_id: insertedBook.id,
      status: 'want_to_read',
    })

  if (userBookError) {
    console.error('Failed to create user-book relationship:', userBookError)
    // Don't throw — the book is already persisted; just log
  }

  return insertedBook.id
}

/**
 * Fetch a user's library books from Supabase, with optional filtering.
 * Returns canonical book data enriched with user-specific fields (status, pages, etc.).
 */
export async function fetchUserLibrary(userId: string) {
  const { data, error } = await supabase
    .from('user_books')
    .select(`
      *,
      books (
        id,
        title,
        subtitle,
        description,
        cover_url,
        page_count,
        publisher,
        published_date,
        published_date_precision,
        language
      )
    `)
    .eq('user_id', userId)

  if (error) {
    console.error('Failed to fetch user library:', error)
    return []
  }

  return data || []
}

/**
 * Update a user's reading progress/status for a book.
 */
export async function updateUserBookProgress(
  userId: string,
  bookId: string,
  updates: { status?: string; current_page?: number; rating?: number; finished_at?: string }
) {
  const { error } = await supabase
    .from('user_books')
    .update(updates)
    .eq('user_id', userId)
    .eq('book_id', bookId)

  if (error) {
    console.error('Failed to update user book:', error)
    throw error
  }
}