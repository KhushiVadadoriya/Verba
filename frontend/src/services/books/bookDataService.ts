/**
 * Verba BookDataService — Phase 2 orchestration layer.
 *
 * Single normalized search interface above the provider adapters:
 * - Google Books is the primary search provider.
 * - Open Library is a supplementary fallback when Google Books fails
 *   (including HTTP 429) or returns no useful results.
 * - Missing cover URLs are supplemented with deterministic Open Library
 *   cover URLs derived from a verified ISBN. No other fields are invented
 *   and provider provenance is never rewritten.
 * - Small bounded in-memory cache with configurable TTL. No persistence.
 *
 * Pure helpers (deduplicateBooks) are exported for unit testing.
 */

import type {
  BookMetadataProvider,
  BookSearchOptions,
  BookSearchResult,
  NormalizedBook,
} from '../../types/bookCatalog';
import { searchGoogleBooks, searchGoogleBooksByIsbn } from './adapters/googleBooksAdapter';
import {
  fetchOpenLibraryByIsbn,
  resolveOpenLibraryCoverUrl,
  searchOpenLibrary,
} from './adapters/openLibraryAdapter';
import { BookApiError } from './utils/bookUtils';

export type BookSearchProviderMode = 'auto' | BookMetadataProvider;

export interface BookDataSearchOptions extends BookSearchOptions {
  /** 'auto' (default): Google Books first, Open Library fallback. */
  provider?: BookSearchProviderMode;
  /** Fill missing covers from Open Library ISBN URLs. Default true. */
  supplementCovers?: boolean;
}

export interface BookDataIsbnLookupOptions {
  signal?: AbortSignal;
  supplementCovers?: boolean;
}

/** Injectable adapter surface; defaults to the real provider adapters. */
export interface BookDataServiceDeps {
  searchGoogleBooks?: typeof searchGoogleBooks;
  searchGoogleBooksByIsbn?: typeof searchGoogleBooksByIsbn;
  searchOpenLibrary?: typeof searchOpenLibrary;
  fetchOpenLibraryByIsbn?: typeof fetchOpenLibraryByIsbn;
}

export interface BookDataServiceConfig {
  /** Cache time-to-live in milliseconds. Default 5 minutes. */
  cacheTtlMs?: number;
  /** Maximum cached entries across search and ISBN lookups. Default 50. */
  cacheMaxEntries?: number;
}

const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000;
const DEFAULT_CACHE_MAX_ENTRIES = 50;

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

function isAbortError(error: unknown, signal?: AbortSignal): boolean {
  if (signal?.aborted) {
    return true;
  }
  return error instanceof DOMException && error.name === 'AbortError';
}

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new DOMException('The operation was aborted.', 'AbortError');
  }
}

/**
 * Dedupes normalized books. Key priority: ISBN-13, then ISBN-10, then
 * provider IDs, then the canonical id. Title-only matches are never merged.
 * First occurrence wins, so callers order preferred providers first.
 */
export function deduplicateBooks(books: NormalizedBook[]): NormalizedBook[] {
  const seen = new Set<string>();
  const deduped: NormalizedBook[] = [];
  for (const book of books) {
    const key = deduplicationKey(book);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push(book);
  }
  return deduped;
}

function deduplicationKey(book: NormalizedBook): string {
  if (book.isbn13) {
    return `isbn13:${book.isbn13}`;
  }
  if (book.isbn10) {
    return `isbn10:${book.isbn10}`;
  }
  const ids = book.providerIds;
  if (ids.googleBooksId) {
    return `gb:${ids.googleBooksId}`;
  }
  if (ids.openLibraryEditionId) {
    return `oled:${ids.openLibraryEditionId}`;
  }
  if (ids.openLibraryWorkId) {
    return `olw:${ids.openLibraryWorkId}`;
  }
  return `id:${book.id}`;
}

export class BookDataService {
  private readonly deps: Required<BookDataServiceDeps>;
  private readonly cacheTtlMs: number;
  private readonly cacheMaxEntries: number;
  private readonly searchCache = new Map<string, CacheEntry<BookSearchResult>>();
  private readonly isbnCache = new Map<string, CacheEntry<NormalizedBook>>();

  constructor(deps: BookDataServiceDeps = {}, config: BookDataServiceConfig = {}) {
    this.deps = {
      searchGoogleBooks: deps.searchGoogleBooks ?? searchGoogleBooks,
      searchGoogleBooksByIsbn: deps.searchGoogleBooksByIsbn ?? searchGoogleBooksByIsbn,
      searchOpenLibrary: deps.searchOpenLibrary ?? searchOpenLibrary,
      fetchOpenLibraryByIsbn: deps.fetchOpenLibraryByIsbn ?? fetchOpenLibraryByIsbn,
    };
    this.cacheTtlMs = config.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;
    this.cacheMaxEntries = config.cacheMaxEntries ?? DEFAULT_CACHE_MAX_ENTRIES;
  }

  /** Clears all cached search results and ISBN lookups. */
  public clearCache(): void {
    this.searchCache.clear();
    this.isbnCache.clear();
  }

  /**
   * Normalized book search. Google Books first; Open Library fallback when
   * Google Books fails or returns no items. Cancellation via AbortSignal
   * propagates without triggering fallback.
   */
  public async searchBooks(
    query: string,
    options: BookDataSearchOptions = {},
  ): Promise<BookSearchResult> {
    const trimmed = query.trim();
    if (!trimmed) {
      return { items: [], totalItems: 0, provider: 'google_books', page: 1 };
    }
    throwIfAborted(options.signal);

    const mode: BookSearchProviderMode = options.provider ?? 'auto';
    const cacheKey = `search:${mode}:${trimmed.toLowerCase()}|${options.maxResults ?? ''}|${options.page ?? ''}|${options.langRestrict ?? ''}|${options.supplementCovers ?? true}`;
    const cached = readCache(this.searchCache, cacheKey);
    if (cached) {
      return { ...cached, items: [...cached.items] };
    }

    let result: BookSearchResult;
    if (mode === 'open_library') {
      result = await this.deps.searchOpenLibrary(trimmed, options);
    } else if (mode === 'google_books') {
      result = await this.deps.searchGoogleBooks(trimmed, options);
    } else {
      result = await this.searchWithFallback(trimmed, options);
    }

    const finalized: BookSearchResult = {
      ...result,
      items: deduplicateBooks(this.applyCoverPolicy(result.items, options)),
    };
    writeCache(this.searchCache, cacheKey, finalized, this.cacheTtlMs, this.cacheMaxEntries);
    return { ...finalized, items: [...finalized.items] };
  }

  /**
   * ISBN lookup. Google Books first, Open Library fallback on miss or
   * failure. Returns null when neither provider has the ISBN. Both providers
   * failing throws the primary (Google Books) error.
   */
  public async getBookByIsbn(
    isbn: string,
    options: BookDataIsbnLookupOptions = {},
  ): Promise<NormalizedBook | null> {
    const trimmed = isbn.trim();
    if (!trimmed) {
      return null;
    }
    throwIfAborted(options.signal);

    const supplement = options.supplementCovers !== false;
    const cacheKey = `isbn:${trimmed.toLowerCase()}|${supplement}`;
    const cached = readCache(this.isbnCache, cacheKey);
    if (cached) {
      return { ...cached };
    }

    let primaryError: unknown = null;
    try {
      const found = await this.deps.searchGoogleBooksByIsbn(trimmed, {
        signal: options.signal,
      });
      if (found) {
        const book = supplement ? supplementCover(found) : found;
        writeCache(this.isbnCache, cacheKey, book, this.cacheTtlMs, this.cacheMaxEntries);
        return { ...book };
      }
    } catch (error) {
      if (isAbortError(error, options.signal)) {
        throw error;
      }
      primaryError = error;
    }

    throwIfAborted(options.signal);
    try {
      const found = await this.deps.fetchOpenLibraryByIsbn(trimmed, {
        signal: options.signal,
      });
      if (!found) {
        return null;
      }
      const book = supplement ? supplementCover(found) : found;
      writeCache(this.isbnCache, cacheKey, book, this.cacheTtlMs, this.cacheMaxEntries);
      return { ...book };
    } catch (fallbackError) {
      if (isAbortError(fallbackError, options.signal)) {
        throw fallbackError;
      }
      if (primaryError) {
        throw withFallbackCause(primaryError, fallbackError);
      }
      throw fallbackError;
    }
  }

  private async searchWithFallback(
    query: string,
    options: BookDataSearchOptions,
  ): Promise<BookSearchResult> {
    let primaryError: unknown = null;
    try {
      const primary = await this.deps.searchGoogleBooks(query, options);
      if (primary.items.length > 0) {
        return primary;
      }
    } catch (error) {
      if (isAbortError(error, options.signal)) {
        throw error;
      }
      primaryError = error;
    }

    throwIfAborted(options.signal);
    try {
      return await this.deps.searchOpenLibrary(query, options);
    } catch (fallbackError) {
      if (isAbortError(fallbackError, options.signal)) {
        throw fallbackError;
      }
      if (primaryError) {
        throw withFallbackCause(primaryError, fallbackError);
      }
      throw fallbackError;
    }
  }

  private applyCoverPolicy(
    books: NormalizedBook[],
    options: BookDataSearchOptions,
  ): NormalizedBook[] {
    if (options.supplementCovers === false) {
      return books;
    }
    return books.map(supplementCover);
  }
}

/**
 * Fills a missing coverUrl from a deterministic Open Library ISBN URL.
 * Existing covers are never overwritten and provenance is never rewritten.
 */
function supplementCover(book: NormalizedBook): NormalizedBook {
  if (book.coverUrl) {
    return book;
  }
  const isbn = book.isbn13 ?? book.isbn10;
  const coverUrl = resolveOpenLibraryCoverUrl(isbn ? { isbn } : {});
  if (!coverUrl) {
    return book;
  }
  return { ...book, coverUrl };
}

function withFallbackCause(primaryError: unknown, fallbackError: unknown): unknown {
  if (primaryError instanceof BookApiError && primaryError.cause === undefined) {
    primaryError.cause = fallbackError;
  }
  return primaryError;
}

function readCache<T>(cache: Map<string, CacheEntry<T>>, key: string): T | undefined {
  const entry = cache.get(key);
  if (!entry) {
    return undefined;
  }
  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return undefined;
  }
  return entry.value;
}

function writeCache<T>(
  cache: Map<string, CacheEntry<T>>,
  key: string,
  value: T,
  ttlMs: number,
  maxEntries: number,
): void {
  if (maxEntries <= 0 || ttlMs <= 0) {
    return;
  }
  if (!cache.has(key) && cache.size >= maxEntries) {
    const oldest = cache.keys().next();
    if (!oldest.done) {
      cache.delete(oldest.value);
    }
  }
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

/** Shared default instance backed by the real provider adapters. */
export const bookDataService = new BookDataService();
