/**
 * Verba Book Catalog Utilities
 * ISBN sanitization, date precision parsing, HTML stripping, and error models.
 */

import type {
  BookApiErrorInfo,
  BookMetadataProvider,
  GoogleBooksIndustryIdentifier,
  PublishedDatePrecision,
} from '../../../types/bookCatalog'

export class BookApiError extends Error implements BookApiErrorInfo {
  provider: BookMetadataProvider
  statusCode?: number
  statusText?: string
  isNetworkError: boolean
  details?: unknown

  constructor(params: {
    provider: BookMetadataProvider
    message: string
    statusCode?: number
    statusText?: string
    isNetworkError?: boolean
    details?: unknown
    cause?: unknown
  }) {
    super(params.message)
    this.name = 'BookApiError'
    this.provider = params.provider
    this.statusCode = params.statusCode
    this.statusText = params.statusText
    this.isNetworkError = Boolean(params.isNetworkError)
    this.details = params.details
    if (params.cause) {
      this.cause = params.cause
    }
  }
}

/**
 * Strips formatting (dashes, spaces) and standardizes check digit 'X' to uppercase.
 */
export function cleanIsbn(raw?: string | null): string {
  if (!raw) return ''
  return raw.replace(/[-\s]/g, '').trim().toUpperCase()
}

/**
 * Validates 10-digit ISBN format.
 */
export function isValidIsbn10(val: string): boolean {
  const cleaned = cleanIsbn(val)
  return /^[0-9]{9}[0-9X]$/.test(cleaned)
}

/**
 * Validates 13-digit ISBN format (starts with 978 or 979).
 */
export function isValidIsbn13(val: string): boolean {
  const cleaned = cleanIsbn(val)
  return /^(978|979)[0-9]{10}$/.test(cleaned)
}

/**
 * Extracts normalized 10-digit and 13-digit ISBNs from heterogeneous provider formats:
 * - Google Books: array of { type: string, identifier: string }
 * - Open Library: array of ISBN strings
 */
export function extractIsbns(
  identifiers?: Array<GoogleBooksIndustryIdentifier | string> | null,
): { isbn10?: string; isbn13?: string } {
  if (!identifiers || !Array.isArray(identifiers)) {
    return {}
  }

  let isbn10: string | undefined
  let isbn13: string | undefined

  for (const item of identifiers) {
    if (typeof item === 'string') {
      const cleaned = cleanIsbn(item)
      if (!isbn13 && isValidIsbn13(cleaned)) {
        isbn13 = cleaned
      } else if (!isbn10 && isValidIsbn10(cleaned)) {
        isbn10 = cleaned
      }
    } else if (item && typeof item === 'object') {
      const rawVal = cleanIsbn(item.identifier)
      const type = item.type?.toUpperCase()

      if (type === 'ISBN_13' || isValidIsbn13(rawVal)) {
        if (!isbn13 && isValidIsbn13(rawVal)) {
          isbn13 = rawVal
        }
      } else if (type === 'ISBN_10' || isValidIsbn10(rawVal)) {
        if (!isbn10 && isValidIsbn10(rawVal)) {
          isbn10 = rawVal
        }
      }
    }

    if (isbn10 && isbn13) break
  }

  return { isbn10, isbn13 }
}

/**
 * Parses published date string and determines granularity.
 * Examples:
 * - "2020-05-14" -> day
 * - "2020-05"    -> month
 * - "2020"       -> year
 */
export function parsePublishedDate(dateStr?: string | null): {
  publishedDate?: string
  precision?: PublishedDatePrecision
} {
  if (!dateStr || typeof dateStr !== 'string') {
    return {}
  }

  const trimmed = dateStr.trim()
  if (!trimmed) {
    return {}
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return { publishedDate: trimmed, precision: 'day' }
  }

  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    return { publishedDate: trimmed, precision: 'month' }
  }

  if (/^\d{4}$/.test(trimmed)) {
    return { publishedDate: trimmed, precision: 'year' }
  }

  // Fallback for non-standard formats (e.g. "October 2018", "May 14, 2020")
  const yearMatch = trimmed.match(/\b(18|19|20)\d{2}\b/)
  if (yearMatch) {
    return { publishedDate: trimmed, precision: 'unknown' }
  }

  return { publishedDate: trimmed, precision: 'unknown' }
}

/**
 * Strips HTML tags and decodes common HTML entities from provider descriptions.
 */
export function stripHtml(input?: string | null): string | undefined {
  if (!input || typeof input !== 'string') {
    return undefined
  }

  const withoutTags = input
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return withoutTags.length > 0 ? withoutTags : undefined
}

/**
 * Upgrades HTTP image links to HTTPS safely and trims whitespace.
 */
export function upgradeToHttps(url?: string | null): string | undefined {
  if (!url || typeof url !== 'string') {
    return undefined
  }

  const trimmed = url.trim()
  if (!trimmed) {
    return undefined
  }

  if (trimmed.startsWith('http://')) {
    return `https://${trimmed.slice(7)}`
  }

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`
  }

  return trimmed
}

/**
 * Safely resolves the Google Books API Key across Vite browser runtime and Node environments.
 */
export function getGoogleBooksApiKey(): string | undefined {
  try {
    // Vite client bundle replacement
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_BOOKS_API_KEY) {
      return import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
    }
  } catch {
    // Environment does not support import.meta
  }

  try {
    // Standalone Node / test runner fallback
    const globalObj = globalThis as unknown as {
      process?: { env?: Record<string, string | undefined> }
    }
    if (globalObj.process?.env?.VITE_GOOGLE_BOOKS_API_KEY) {
      return globalObj.process.env.VITE_GOOGLE_BOOKS_API_KEY
    }
  } catch {
    // Environment does not support process
  }

  return undefined
}
