/**
 * Verba Book Catalog Types
 * Canonical domain models and provider-specific schemas for Google Books and Open Library.
 * Aligned with database schema:
 * - public.books
 * - public.book_identifiers
 * - public.book_sources
 * - public.source_field_policies
 */

export type BookMetadataProvider = 'google_books' | 'open_library'

export type PublishedDatePrecision = 'year' | 'month' | 'day' | 'unknown'

export type BookIdentifierType = 'isbn_10' | 'isbn_13'

export interface BookIdentifier {
  type: BookIdentifierType
  value: string
}

export interface ProviderIdentifiers {
  googleBooksId?: string
  openLibraryWorkId?: string
  openLibraryEditionId?: string
}

export interface BookSourceProvenance {
  provider: BookMetadataProvider
  fetchedAt: string // ISO-8601 timestamp
  rawId?: string
}

/**
 * Canonical Verba representation of an external book.
 * Decoupled from user-owned bookshelf state (user_books, progress, reflections).
 */
export interface NormalizedBook {
  /** Canonical identifier (e.g. "gb:zyTCAlFPjgYC" or "ol:OL45883W") */
  id: string

  /** Book title */
  title: string

  /** Subtitle if available */
  subtitle?: string

  /** Array of author names */
  authors: string[]

  /** Cleaned text description (HTML tags stripped) */
  description?: string

  /** Publisher name */
  publisher?: string

  /** Publication date string as reported by provider (e.g. "2018-08-28" or "2018") */
  publishedDate?: string

  /** Granularity of publishedDate */
  publishedDatePrecision?: PublishedDatePrecision

  /** Page count if known */
  pageCount?: number

  /** Primary language code (e.g. "en", "es") */
  language?: string

  /** Categories or genre tags */
  genres: string[]

  /** Sanitized 10-digit ISBN */
  isbn10?: string

  /** Sanitized 13-digit ISBN */
  isbn13?: string

  /** External provider identifiers */
  providerIds: ProviderIdentifiers

  /** High-resolution or best-available cover URL */
  coverUrl?: string

  /** Provenance of the metadata snapshot */
  sourceProvenance: BookSourceProvenance
}

// ============================================================================
// Google Books API Types
// ============================================================================

export interface GoogleBooksIndustryIdentifier {
  type: string // 'ISBN_10' | 'ISBN_13' | 'ISSN' | 'OTHER'
  identifier: string
}

export interface GoogleBooksImageLinks {
  smallThumbnail?: string
  thumbnail?: string
  small?: string
  medium?: string
  large?: string
  extraLarge?: string
}

export interface GoogleBooksVolumeInfo {
  title?: string
  subtitle?: string
  authors?: string[]
  publisher?: string
  publishedDate?: string
  description?: string
  industryIdentifiers?: GoogleBooksIndustryIdentifier[]
  pageCount?: number
  categories?: string[]
  averageRating?: number
  ratingsCount?: number
  imageLinks?: GoogleBooksImageLinks
  language?: string
  previewLink?: string
  infoLink?: string
  canonicalVolumeLink?: string
}

export interface GoogleBooksVolume {
  kind?: string
  id: string
  etag?: string
  selfLink?: string
  volumeInfo?: GoogleBooksVolumeInfo
}

export interface GoogleBooksSearchResponse {
  kind?: string
  totalItems?: number
  items?: GoogleBooksVolume[]
}

// ============================================================================
// Open Library API Types
// ============================================================================

export interface OpenLibraryDoc {
  key: string // e.g. "/works/OL45883W"
  title: string
  subtitle?: string
  author_name?: string[]
  first_publish_year?: number
  publish_date?: string[]
  publish_year?: number[]
  number_of_pages_median?: number
  isbn?: string[]
  cover_i?: number
  cover_edition_key?: string
  language?: string[]
  subject?: string[]
  publisher?: string[]
  edition_count?: number
}

export interface OpenLibrarySearchResponse {
  numFound: number
  start: number
  numFoundExact?: boolean
  docs: OpenLibraryDoc[]
}

export interface OpenLibraryAuthorRef {
  key: string
  name?: string
}

export interface OpenLibraryEdition {
  key?: string // e.g. "/books/OL7353617M"
  title?: string
  subtitle?: string
  authors?: OpenLibraryAuthorRef[]
  publishers?: string[]
  publish_date?: string
  number_of_pages?: number
  isbn_10?: string[]
  isbn_13?: string[]
  covers?: number[]
  works?: Array<{ key: string }>
  description?: string | { type: string; value: string }
  subjects?: string[]
  languages?: Array<{ key: string }>
}

// ============================================================================
// Search & Pagination Options
// ============================================================================

export interface BookSearchOptions {
  /** Maximum number of items to return (1-40 for Google Books, 1-100 for Open Library) */
  maxResults?: number

  /** 1-based page number */
  page?: number

  /** Optional language filter (e.g. "en") */
  langRestrict?: string

  /** AbortSignal for cancellation / debouncing */
  signal?: AbortSignal
}

export interface BookSearchResult {
  items: NormalizedBook[]
  totalItems: number
  provider: BookMetadataProvider
  page: number
}

// ============================================================================
// API Error Model
// ============================================================================

export interface BookApiErrorInfo {
  provider: BookMetadataProvider
  statusCode?: number
  statusText?: string
  isNetworkError: boolean
  message: string
  details?: unknown
}
