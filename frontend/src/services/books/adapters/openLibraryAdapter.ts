/**
 * Verba Open Library API Adapter
 * Supplementary metadata and high-resolution cover provider.
 * Implements search by query, lookup by ISBN, cover URL resolution,
 * and canonical normalization into Verba's NormalizedBook schema.
 */

import type {
  BookSearchOptions,
  BookSearchResult,
  NormalizedBook,
  OpenLibraryDoc,
  OpenLibraryEdition,
  OpenLibrarySearchResponse,
} from '../../../types/bookCatalog'
import {
  BookApiError,
  cleanIsbn,
  extractIsbns,
  parsePublishedDate,
  stripHtml,
} from '../utils/bookUtils'

const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org'
const OPEN_LIBRARY_COVERS_BASE_URL = 'https://covers.openlibrary.org/b'

export type OpenLibraryCoverSize = 'S' | 'M' | 'L'

/**
 * Resolves an Open Library cover image URL using cover ID, ISBN, or OLID.
 * Defaults to large size ('L').
 */
export function resolveOpenLibraryCoverUrl(options: {
  coverId?: number | null
  isbn?: string | null
  olid?: string | null
  size?: OpenLibraryCoverSize
}): string | undefined {
  const size = options.size || 'L'

  if (typeof options.coverId === 'number' && options.coverId > 0) {
    return `${OPEN_LIBRARY_COVERS_BASE_URL}/id/${options.coverId}-${size}.jpg`
  }

  const cleanedIsbn = cleanIsbn(options.isbn)
  if (cleanedIsbn) {
    return `${OPEN_LIBRARY_COVERS_BASE_URL}/isbn/${cleanedIsbn}-${size}.jpg`
  }

  if (options.olid) {
    const cleanOlid = options.olid.replace(/^\/(works|books)\//, '').trim()
    if (cleanOlid) {
      return `${OPEN_LIBRARY_COVERS_BASE_URL}/olid/${cleanOlid}-${size}.jpg`
    }
  }

  return undefined
}

/**
 * Normalizes an Open Library search document into Verba's canonical NormalizedBook.
 */
export function normalizeOpenLibraryDoc(doc: OpenLibraryDoc): NormalizedBook {
  if (!doc || typeof doc !== 'object') {
    throw new BookApiError({
      provider: 'open_library',
      message: 'Cannot normalize empty or invalid Open Library doc',
    })
  }

  const rawKey = doc.key || ''
  const workId = rawKey.replace(/^\/works\//, '').trim() || 'unknown'

  // 1. Title & Subtitle
  const title = (doc.title && doc.title.trim().length > 0) ? doc.title.trim() : 'Untitled'
  const subtitle = (doc.subtitle && doc.subtitle.trim().length > 0) ? doc.subtitle.trim() : undefined

  // 2. Authors
  const authors = Array.isArray(doc.author_name)
    ? doc.author_name.map((a) => (typeof a === 'string' ? a.trim() : '')).filter((a) => a.length > 0)
    : []

  // 3. Publisher
  const publisher =
    Array.isArray(doc.publisher) && doc.publisher.length > 0 && typeof doc.publisher[0] === 'string'
      ? doc.publisher[0].trim()
      : undefined

  // 4. Published Date and Precision
  const rawDateStr = doc.first_publish_year
    ? String(doc.first_publish_year)
    : Array.isArray(doc.publish_date) && doc.publish_date[0]
      ? doc.publish_date[0]
      : undefined
  const { publishedDate, precision: publishedDatePrecision } = parsePublishedDate(rawDateStr)

  // 5. Page Count (Open Library median page count)
  const pageCount =
    typeof doc.number_of_pages_median === 'number' && doc.number_of_pages_median > 0
      ? Math.floor(doc.number_of_pages_median)
      : undefined

  // 6. Language (first language code if present)
  const language =
    Array.isArray(doc.language) && doc.language.length > 0 && typeof doc.language[0] === 'string'
      ? doc.language[0].trim().toLowerCase()
      : undefined

  // 7. Genres / Subjects (first 5 subjects)
  const genres = Array.isArray(doc.subject)
    ? doc.subject
        .slice(0, 5)
        .map((s) => (typeof s === 'string' ? s.trim() : ''))
        .filter((s) => s.length > 0)
    : []

  // 8. ISBNs
  const { isbn10, isbn13 } = extractIsbns(doc.isbn)

  // 9. Cover URL
  let coverUrl: string | undefined
  if (typeof doc.cover_i === 'number' && doc.cover_i > 0) {
    coverUrl = resolveOpenLibraryCoverUrl({ coverId: doc.cover_i, size: 'L' })
  } else if (isbn13 || isbn10) {
    coverUrl = resolveOpenLibraryCoverUrl({ isbn: isbn13 || isbn10, size: 'L' })
  }

  return {
    id: `ol:${workId}`,
    title,
    subtitle,
    authors,
    // Open Library search documents do not supply full descriptions.
    // Preserving integrity: we do not pretend a missing field exists.
    description: undefined,
    publisher,
    publishedDate,
    publishedDatePrecision,
    pageCount,
    language,
    genres,
    isbn10,
    isbn13,
    providerIds: {
      openLibraryWorkId: workId,
      openLibraryEditionId: doc.cover_edition_key || undefined,
    },
    coverUrl,
    sourceProvenance: {
      provider: 'open_library',
      fetchedAt: new Date().toISOString(),
      rawId: rawKey,
    },
  }
}

/**
 * Normalizes an Open Library edition payload into Verba's canonical NormalizedBook.
 */
export function normalizeOpenLibraryEdition(
  edition: OpenLibraryEdition,
  rawRequestedIsbn?: string,
): NormalizedBook {
  if (!edition || typeof edition !== 'object') {
    throw new BookApiError({
      provider: 'open_library',
      message: 'Cannot normalize empty or invalid Open Library edition payload',
    })
  }

  const rawKey = edition.key || ''
  const editionId = rawKey.replace(/^\/books\//, '').trim() || 'unknown'
  const workKey = Array.isArray(edition.works) && edition.works[0]?.key
    ? edition.works[0].key.replace(/^\/works\//, '').trim()
    : undefined

  // 1. Title & Subtitle
  const title = (edition.title && edition.title.trim().length > 0) ? edition.title.trim() : 'Untitled'
  const subtitle = (edition.subtitle && edition.subtitle.trim().length > 0) ? edition.subtitle.trim() : undefined

  // 2. Authors
  // Open Library editions often have author references like { key: '/authors/OL...' }
  const authors: string[] = []
  if (Array.isArray(edition.authors)) {
    for (const author of edition.authors) {
      if (author?.name && author.name.trim()) {
        authors.push(author.name.trim())
      }
    }
  }

  // 3. Description
  let rawDesc: string | undefined
  if (typeof edition.description === 'string') {
    rawDesc = edition.description
  } else if (edition.description && typeof edition.description === 'object' && 'value' in edition.description) {
    rawDesc = edition.description.value
  }
  const description = stripHtml(rawDesc)

  // 4. Publisher
  const publisher =
    Array.isArray(edition.publishers) && edition.publishers.length > 0 && typeof edition.publishers[0] === 'string'
      ? edition.publishers[0].trim()
      : undefined

  // 5. Published Date and Precision
  const { publishedDate, precision: publishedDatePrecision } = parsePublishedDate(edition.publish_date)

  // 6. Page count
  const pageCount =
    typeof edition.number_of_pages === 'number' && edition.number_of_pages > 0
      ? Math.floor(edition.number_of_pages)
      : undefined

  // 7. Genres / Subjects
  const genres = Array.isArray(edition.subjects)
    ? edition.subjects
        .slice(0, 5)
        .map((s) => (typeof s === 'string' ? s.trim() : ''))
        .filter((s) => s.length > 0)
    : []

  // 8. ISBNs
  const { isbn10, isbn13 } = extractIsbns([
    ...(edition.isbn_13 || []),
    ...(edition.isbn_10 || []),
    ...(rawRequestedIsbn ? [rawRequestedIsbn] : []),
  ])

  // 9. Cover URL
  let coverUrl: string | undefined
  const firstCoverId = Array.isArray(edition.covers) ? edition.covers[0] : undefined
  if (typeof firstCoverId === 'number' && firstCoverId > 0) {
    coverUrl = resolveOpenLibraryCoverUrl({ coverId: firstCoverId, size: 'L' })
  } else if (isbn13 || isbn10 || rawRequestedIsbn) {
    coverUrl = resolveOpenLibraryCoverUrl({ isbn: isbn13 || isbn10 || rawRequestedIsbn, size: 'L' })
  }

  return {
    id: `ol:${editionId}`,
    title,
    subtitle,
    authors,
    description,
    publisher,
    publishedDate,
    publishedDatePrecision,
    pageCount,
    language: undefined,
    genres,
    isbn10,
    isbn13,
    providerIds: {
      openLibraryWorkId: workKey,
      openLibraryEditionId: editionId,
    },
    coverUrl,
    sourceProvenance: {
      provider: 'open_library',
      fetchedAt: new Date().toISOString(),
      rawId: rawKey,
    },
  }
}

/**
 * Searches Open Library by free-text query.
 */
export async function searchOpenLibrary(
  query: string,
  options: BookSearchOptions = {},
): Promise<BookSearchResult> {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) {
    return {
      items: [],
      totalItems: 0,
      provider: 'open_library',
      page: 1,
    }
  }

  const page = Math.max(1, options.page ?? 1)
  const limit = Math.min(100, Math.max(1, options.maxResults ?? 10))

  const params = new URLSearchParams({
    q: trimmedQuery,
    page: String(page),
    limit: String(limit),
  })

  if (options.langRestrict) {
    params.set('lang', options.langRestrict.trim().toLowerCase())
  }

  const url = `${OPEN_LIBRARY_BASE_URL}/search.json?${params.toString()}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: options.signal,
    })

    if (!response.ok) {
      throw new BookApiError({
        provider: 'open_library',
        statusCode: response.status,
        statusText: response.statusText,
        message: `Open Library search failed with HTTP status ${response.status}`,
      })
    }

    const data = (await response.json()) as OpenLibrarySearchResponse

    const items: NormalizedBook[] = []
    if (Array.isArray(data.docs)) {
      for (const doc of data.docs) {
        try {
          items.push(normalizeOpenLibraryDoc(doc))
        } catch {
          // Skip individual malformed doc without crashing the entire search
        }
      }
    }

    return {
      items,
      totalItems: typeof data.numFound === 'number' ? data.numFound : items.length,
      provider: 'open_library',
      page,
    }
  } catch (error) {
    if (error instanceof BookApiError) {
      throw error
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }

    throw new BookApiError({
      provider: 'open_library',
      isNetworkError: true,
      message: error instanceof Error ? error.message : 'Network error communicating with Open Library',
      cause: error,
    })
  }
}

/**
 * Fetches an edition from Open Library by ISBN-10 or ISBN-13.
 * Returns normalized book or null if not found.
 */
export async function fetchOpenLibraryByIsbn(
  isbn: string,
  options: { signal?: AbortSignal } = {},
): Promise<NormalizedBook | null> {
  const cleaned = cleanIsbn(isbn)
  if (!cleaned) {
    return null
  }

  const url = `${OPEN_LIBRARY_BASE_URL}/isbn/${encodeURIComponent(cleaned)}.json`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: options.signal,
    })

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new BookApiError({
        provider: 'open_library',
        statusCode: response.status,
        statusText: response.statusText,
        message: `Open Library ISBN lookup failed with HTTP ${response.status}`,
      })
    }

    const data = (await response.json()) as OpenLibraryEdition
    return normalizeOpenLibraryEdition(data, cleaned)
  } catch (error) {
    if (error instanceof BookApiError) {
      throw error
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }

    throw new BookApiError({
      provider: 'open_library',
      isNetworkError: true,
      message: error instanceof Error ? error.message : 'Network error fetching Open Library ISBN edition',
      cause: error,
    })
  }
}
