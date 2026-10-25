/**
 * Verba Google Books API Adapter
 * Primary book metadata provider.
 * Implements search by query, search by ISBN, volume lookup by ID,
 * and canonical normalization into Verba's NormalizedBook schema.
 */

import type {
  BookSearchOptions,
  BookSearchResult,
  GoogleBooksSearchResponse,
  GoogleBooksVolume,
  NormalizedBook,
} from '../../../types/bookCatalog'
import {
  BookApiError,
  cleanIsbn,
  extractIsbns,
  getGoogleBooksApiKey,
  parsePublishedDate,
  stripHtml,
  upgradeToHttps,
} from '../utils/bookUtils'

const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1/volumes'

/**
 * Normalizes a raw Google Books volume into Verba's canonical NormalizedBook.
 */
export function normalizeGoogleBook(volume: GoogleBooksVolume): NormalizedBook {
  if (!volume || typeof volume !== 'object') {
    throw new BookApiError({
      provider: 'google_books',
      message: 'Cannot normalize empty or invalid Google Books volume payload',
    })
  }

  const rawId = volume.id?.trim() || 'unknown'
  const info = volume.volumeInfo || {}

  // 1. Title & Subtitle
  const title = (info.title && info.title.trim().length > 0) ? info.title.trim() : 'Untitled'
  const subtitle = (info.subtitle && info.subtitle.trim().length > 0) ? info.subtitle.trim() : undefined

  // 2. Authors
  const authors = Array.isArray(info.authors)
    ? info.authors.map((a) => (typeof a === 'string' ? a.trim() : '')).filter((a) => a.length > 0)
    : []

  // 3. Description (HTML tags stripped and entities decoded)
  const description = stripHtml(info.description)

  // 4. Publisher
  const publisher = (info.publisher && info.publisher.trim().length > 0) ? info.publisher.trim() : undefined

  // 5. Published Date and Precision
  const { publishedDate, precision: publishedDatePrecision } = parsePublishedDate(info.publishedDate)

  // 6. Page Count (strictly positive integer)
  const pageCount =
    typeof info.pageCount === 'number' && Number.isFinite(info.pageCount) && info.pageCount > 0
      ? Math.floor(info.pageCount)
      : undefined

  // 7. Language
  const language = (info.language && info.language.trim().length > 0) ? info.language.trim().toLowerCase() : undefined

  // 8. Categories / Genres
  const genres = Array.isArray(info.categories)
    ? Array.from(
        new Set(
          info.categories
            .flatMap((cat) => (typeof cat === 'string' ? cat.split(/[/,]/) : []))
            .map((c) => c.trim())
            .filter((c) => c.length > 0),
        ),
      )
    : []

  // 9. Industry Identifiers (ISBN-10, ISBN-13)
  const { isbn10, isbn13 } = extractIsbns(info.industryIdentifiers)

  // 10. Cover URL resolution (safely select highest resolution available and upgrade to HTTPS)
  let rawCoverUrl: string | undefined
  if (info.imageLinks && typeof info.imageLinks === 'object') {
    rawCoverUrl =
      info.imageLinks.extraLarge ||
      info.imageLinks.large ||
      info.imageLinks.medium ||
      info.imageLinks.small ||
      info.imageLinks.thumbnail ||
      info.imageLinks.smallThumbnail
  }
  const coverUrl = upgradeToHttps(rawCoverUrl)

  return {
    id: `gb:${rawId}`,
    title,
    subtitle,
    authors,
    description,
    publisher,
    publishedDate,
    publishedDatePrecision,
    pageCount,
    language,
    genres,
    isbn10,
    isbn13,
    providerIds: {
      googleBooksId: rawId,
    },
    coverUrl,
    sourceProvenance: {
      provider: 'google_books',
      fetchedAt: new Date().toISOString(),
      rawId,
    },
  }
}

/**
 * Searches Google Books by free-text query.
 */
export async function searchGoogleBooks(
  query: string,
  options: BookSearchOptions = {},
): Promise<BookSearchResult> {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) {
    return {
      items: [],
      totalItems: 0,
      provider: 'google_books',
      page: 1,
    }
  }

  const page = Math.max(1, options.page ?? 1)
  const maxResults = Math.min(40, Math.max(1, options.maxResults ?? 10))
  const startIndex = (page - 1) * maxResults

  const params = new URLSearchParams({
    q: trimmedQuery,
    startIndex: String(startIndex),
    maxResults: String(maxResults),
  })

  if (options.langRestrict) {
    params.set('langRestrict', options.langRestrict.trim().toLowerCase())
  }

  const apiKey = getGoogleBooksApiKey()
  if (apiKey) {
    params.set('key', apiKey)
  }

  const url = `${GOOGLE_BOOKS_BASE_URL}?${params.toString()}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: options.signal,
    })

    if (!response.ok) {
      if (response.status === 429) {
        throw new BookApiError({
          provider: 'google_books',
          statusCode: 429,
          statusText: response.statusText,
          message: 'Google Books API rate limit exceeded. Please try again shortly.',
        })
      }

      throw new BookApiError({
        provider: 'google_books',
        statusCode: response.status,
        statusText: response.statusText,
        message: `Google Books search failed with HTTP status ${response.status}`,
      })
    }

    const data = (await response.json()) as GoogleBooksSearchResponse

    const items: NormalizedBook[] = []
    if (Array.isArray(data.items)) {
      for (const volume of data.items) {
        try {
          items.push(normalizeGoogleBook(volume))
        } catch {
          // Skip individual malformed volume without failing entire search
        }
      }
    }

    return {
      items,
      totalItems: typeof data.totalItems === 'number' ? data.totalItems : items.length,
      provider: 'google_books',
      page,
    }
  } catch (error) {
    if (error instanceof BookApiError) {
      throw error
    }

    // Abort errors should propagate directly
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }

    throw new BookApiError({
      provider: 'google_books',
      isNetworkError: true,
      message: error instanceof Error ? error.message : 'Network error communicating with Google Books',
      cause: error,
    })
  }
}

/**
 * Searches Google Books by ISBN-10 or ISBN-13.
 * Returns normalized book or null if not found.
 */
export async function searchGoogleBooksByIsbn(
  isbn: string,
  options: { signal?: AbortSignal } = {},
): Promise<NormalizedBook | null> {
  const cleaned = cleanIsbn(isbn)
  if (!cleaned) {
    return null
  }

  const result = await searchGoogleBooks(`isbn:${cleaned}`, {
    maxResults: 5,
    signal: options.signal,
  })

  if (result.items.length === 0) {
    return null
  }

  // Exact ISBN match preference
  const exactMatch = result.items.find(
    (item) => item.isbn13 === cleaned || item.isbn10 === cleaned,
  )

  return exactMatch || result.items[0] || null
}

/**
 * Fetches a single volume by its Google Books volume ID.
 * Returns normalized book or null if 404/not found.
 */
export async function fetchGoogleBookById(
  volumeId: string,
  options: { signal?: AbortSignal } = {},
): Promise<NormalizedBook | null> {
  const cleanId = volumeId.replace(/^gb:/, '').trim()
  if (!cleanId) {
    return null
  }

  const params = new URLSearchParams()
  const apiKey = getGoogleBooksApiKey()
  if (apiKey) {
    params.set('key', apiKey)
  }

  const queryString = params.toString()
  const url = `${GOOGLE_BOOKS_BASE_URL}/${encodeURIComponent(cleanId)}${queryString ? `?${queryString}` : ''}`

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
      if (response.status === 429) {
        throw new BookApiError({
          provider: 'google_books',
          statusCode: 429,
          statusText: response.statusText,
          message: 'Google Books API rate limit exceeded.',
        })
      }

      throw new BookApiError({
        provider: 'google_books',
        statusCode: response.status,
        statusText: response.statusText,
        message: `Google Books volume lookup failed with HTTP ${response.status}`,
      })
    }

    const data = (await response.json()) as GoogleBooksVolume
    return normalizeGoogleBook(data)
  } catch (error) {
    if (error instanceof BookApiError) {
      throw error
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }

    throw new BookApiError({
      provider: 'google_books',
      isNetworkError: true,
      message: error instanceof Error ? error.message : 'Network error fetching Google Books volume',
      cause: error,
    })
  }
}
