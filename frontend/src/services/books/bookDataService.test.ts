/**
 * Unit tests for Verba BookDataService orchestration.
 * Provider adapters are mocked via constructor injection; no live API access.
 */
/// <reference types="node" />
import { describe, it } from 'vitest';
import assert from 'node:assert/strict';
import type {
  BookSearchResult,
  NormalizedBook,
} from '../../types/bookCatalog';
import { BookApiError } from './utils/bookUtils';
import {
  BookDataService,
  deduplicateBooks,
} from './bookDataService';

function makeBook(overrides: Partial<NormalizedBook> & { id: string }): NormalizedBook {
  return {
    title: 'Dune',
    authors: ['Frank Herbert'],
    genres: ['Science Fiction'],
    providerIds: {},
    sourceProvenance: { provider: 'google_books', fetchedAt: '2024-01-01T00:00:00Z' },
    ...overrides,
  };
}

function gbBook(id: string, isbn13 = '9780441172719'): NormalizedBook {
  return makeBook({
    id: `gb:${id}`,
    providerIds: { googleBooksId: id },
    isbn13,
    coverUrl: `https://books.google.com/${id}.jpg`,
    sourceProvenance: { provider: 'google_books', fetchedAt: '2024-01-01T00:00:00Z', rawId: id },
  });
}

function olBook(workId: string, isbn13 = '9780441172719'): NormalizedBook {
  return makeBook({
    id: `ol:${workId}`,
    providerIds: { openLibraryWorkId: workId },
    isbn13,
    sourceProvenance: { provider: 'open_library', fetchedAt: '2024-01-01T00:00:00Z', rawId: workId },
  });
}

function searchResult(provider: 'google_books' | 'open_library', items: NormalizedBook[]): BookSearchResult {
  return { items, totalItems: items.length, provider, page: 1 };
}

function gb429(): BookApiError {
  return new BookApiError({
    provider: 'google_books',
    statusCode: 429,
    message: 'Google Books API rate limit exceeded. Please try again shortly.',
  });
}

function abortError(): DOMException {
  return new DOMException('The operation was aborted.', 'AbortError');
}

function abortedSignal(): AbortSignal {
  const controller = new AbortController();
  controller.abort();
  return controller.signal;
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe('searchBooks primary path', () => {
  it('uses Google Books and does not call Open Library on success', async () => {
    let gbCalls = 0;
    let olCalls = 0;
    const service = new BookDataService({
      searchGoogleBooks: (async () => {
        gbCalls += 1;
        return searchResult('google_books', [gbBook('v1')]);
      }) as typeof import('./adapters/googleBooksAdapter').searchGoogleBooks,
      searchOpenLibrary: (async () => {
        olCalls += 1;
        return searchResult('open_library', []);
      }) as typeof import('./adapters/openLibraryAdapter').searchOpenLibrary,
    });
    const result = await service.searchBooks('Dune');
    assert.equal(result.provider, 'google_books');
    assert.equal(result.items.length, 1);
    assert.equal(gbCalls, 1);
    assert.equal(olCalls, 0);
  });

  it('returns empty results without provider calls for blank queries', async () => {
    let calls = 0;
    const service = new BookDataService({
      searchGoogleBooks: (async () => {
        calls += 1;
        return searchResult('google_books', []);
      }) as typeof import('./adapters/googleBooksAdapter').searchGoogleBooks,
    });
    const result = await service.searchBooks('   ');
    assert.deepEqual(result.items, []);
    assert.equal(calls, 0);
  });

  it('honours a forced single-provider mode', async () => {
    let gbCalls = 0;
    let olCalls = 0;
    const service = new BookDataService({
      searchGoogleBooks: (async () => {
        gbCalls += 1;
        return searchResult('google_books', []);
      }) as typeof import('./adapters/googleBooksAdapter').searchGoogleBooks,
      searchOpenLibrary: (async () => {
        olCalls += 1;
        return searchResult('open_library', [olBook('OL1W')]);
      }) as typeof import('./adapters/openLibraryAdapter').searchOpenLibrary,
    });
    const result = await service.searchBooks('Dune', { provider: 'open_library' });
    assert.equal(result.provider, 'open_library');
    assert.equal(gbCalls, 0);
    assert.equal(olCalls, 1);
  });
});

describe('searchBooks fallback', () => {
  it('falls back to Open Library when Google Books returns 429', async () => {
    const service = new BookDataService({
      searchGoogleBooks: (() => Promise.reject(gb429())) as typeof import('./adapters/googleBooksAdapter').searchGoogleBooks,
      searchOpenLibrary: ((async () => searchResult('open_library', [olBook('OL1W')]))) as typeof import('./adapters/openLibraryAdapter').searchOpenLibrary,
    });
    const result = await service.searchBooks('Dune');
    assert.equal(result.provider, 'open_library');
    assert.equal(result.items[0]?.id, 'ol:OL1W');
  });

  it('falls back to Open Library when Google Books returns no items', async () => {
    const service = new BookDataService({
      searchGoogleBooks: ((async () => searchResult('google_books', []))) as typeof import('./adapters/googleBooksAdapter').searchGoogleBooks,
      searchOpenLibrary: ((async () => searchResult('open_library', [olBook('OL2W')]))) as typeof import('./adapters/openLibraryAdapter').searchOpenLibrary,
    });
    const result = await service.searchBooks('Dune');
    assert.equal(result.provider, 'open_library');
    assert.equal(result.items.length, 1);
  });

  it('throws the primary error with fallback cause when both providers fail', async () => {
    const fallback = new BookApiError({ provider: 'open_library', statusCode: 500, message: 'down' });
    const service = new BookDataService({
      searchGoogleBooks: (() => Promise.reject(gb429())) as typeof import('./adapters/googleBooksAdapter').searchGoogleBooks,
      searchOpenLibrary: (() => Promise.reject(fallback)) as typeof import('./adapters/openLibraryAdapter').searchOpenLibrary,
    });
    try {
      await service.searchBooks('Dune');
      assert.fail('should have thrown');
    } catch (error) {
      if (!(error instanceof BookApiError)) {
        assert.fail('expected BookApiError');
      }
      assert.equal(error.provider, 'google_books');
      assert.equal(error.statusCode, 429);
      assert.equal(error.cause, fallback);
    }
  });

  it('propagates cancellation without falling back', async () => {
    let olCalls = 0;
    const service = new BookDataService({
      searchGoogleBooks: (() => Promise.reject(abortError())) as typeof import('./adapters/googleBooksAdapter').searchGoogleBooks,
      searchOpenLibrary: (async () => {
        olCalls += 1;
        return searchResult('open_library', []);
      }) as typeof import('./adapters/openLibraryAdapter').searchOpenLibrary,
    });
    try {
      await service.searchBooks('Dune', { signal: abortedSignal() });
      assert.fail('should have thrown');
    } catch (error) {
      assert.ok(error instanceof DOMException);
      assert.equal(olCalls, 0);
    }
  });
});

describe('searchBooks covers and dedup', () => {
  it('supplements missing covers from Open Library ISBN URLs', async () => {
    const service = new BookDataService({
      searchGoogleBooks: ((async () => searchResult('google_books', [
        makeBook({ id: 'gb:v9', providerIds: { googleBooksId: 'v9' }, isbn13: '9780441172719' }),
      ]))) as typeof import('./adapters/googleBooksAdapter').searchGoogleBooks,
    });
    const result = await service.searchBooks('Dune');
    assert.equal(
      result.items[0]?.coverUrl,
      'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg',
    );
    assert.equal(result.items[0]?.sourceProvenance.provider, 'google_books');
  });

  it('leaves existing covers and coverless ISBN-less books untouched', async () => {
    const withCover = gbBook('v1');
    const withoutIsbn = makeBook({ id: 'gb:v2', providerIds: { googleBooksId: 'v2' } });
    const service = new BookDataService({
      searchGoogleBooks: ((async () => searchResult('google_books', [withCover, withoutIsbn]))) as typeof import('./adapters/googleBooksAdapter').searchGoogleBooks,
    });
    const result = await service.searchBooks('Dune');
    assert.equal(result.items[0]?.coverUrl, withCover.coverUrl);
    assert.equal(result.items[1]?.coverUrl, undefined);
  });

  it('skips supplementation when disabled', async () => {
    const service = new BookDataService({
      searchGoogleBooks: ((async () => searchResult('google_books', [
        makeBook({ id: 'gb:v9', providerIds: { googleBooksId: 'v9' }, isbn13: '9780441172719' }),
      ]))) as typeof import('./adapters/googleBooksAdapter').searchGoogleBooks,
    });
    const result = await service.searchBooks('Dune', { supplementCovers: false });
    assert.equal(result.items[0]?.coverUrl, undefined);
  });

  it('deduplicates same-ISBN results within a response', async () => {
    const service = new BookDataService({
      searchGoogleBooks: ((async () => searchResult('google_books', [
        gbBook('v1', '9780441172719'),
        gbBook('v2', '9780441172719'),
      ]))) as typeof import('./adapters/googleBooksAdapter').searchGoogleBooks,
    });
    const result = await service.searchBooks('Dune');
    assert.equal(result.items.length, 1);
    assert.equal(result.items[0]?.providerIds.googleBooksId, 'v1');
  });
});

describe('searchBooks cache', () => {
  it('serves repeat queries from cache without new provider calls', async () => {
    let calls = 0;
    const service = new BookDataService({
      searchGoogleBooks: (async () => {
        calls += 1;
        return searchResult('google_books', [gbBook('v1', '9780000000001')]);
      }) as typeof import('./adapters/googleBooksAdapter').searchGoogleBooks,
    });
    const first = await service.searchBooks('Dune');
    const second = await service.searchBooks('Dune');
    assert.equal(calls, 1);
    assert.deepEqual(second, first);
  });

  it('expires entries after the configured TTL', async () => {
    let calls = 0;
    const service = new BookDataService(
      {
        searchGoogleBooks: (async () => {
          calls += 1;
          return searchResult('google_books', [gbBook('v1', '9780000000002')]);
        }) as typeof import('./adapters/googleBooksAdapter').searchGoogleBooks,
      },
      { cacheTtlMs: 30 },
    );
    await service.searchBooks('Dune');
    await sleep(60);
    await service.searchBooks('Dune');
    assert.equal(calls, 2);
  });

  it('evicts the oldest entry when the cache is full', async () => {
    const seen: string[] = [];
    const service = new BookDataService(
      {
        searchGoogleBooks: ((async (query: string) => {
          seen.push(query);
          return searchResult('google_books', []);
        })) as typeof import('./adapters/googleBooksAdapter').searchGoogleBooks,
        searchOpenLibrary: ((async () => searchResult('open_library', []))) as typeof import('./adapters/openLibraryAdapter').searchOpenLibrary,
      },
      { cacheMaxEntries: 2 },
    );
    await service.searchBooks('aaa');
    await service.searchBooks('bbb');
    await service.searchBooks('ccc');
    await service.searchBooks('aaa');
    assert.deepEqual(seen, ['aaa', 'bbb', 'ccc', 'aaa']);
  });

  it('clearCache forces fresh provider calls', async () => {
    let calls = 0;
    const service = new BookDataService({
      searchGoogleBooks: (async () => {
        calls += 1;
        return searchResult('google_books', [gbBook('v1', '9780000000003')]);
      }) as typeof import('./adapters/googleBooksAdapter').searchGoogleBooks,
    });
    await service.searchBooks('Dune');
    service.clearCache();
    await service.searchBooks('Dune');
    assert.equal(calls, 2);
  });
});

describe('getBookByIsbn', () => {
  it('returns the Google Books match without calling Open Library', async () => {
    let olCalls = 0;
    const service = new BookDataService({
      searchGoogleBooksByIsbn: ((async () => gbBook('v1'))) as typeof import('./adapters/googleBooksAdapter').searchGoogleBooksByIsbn,
      fetchOpenLibraryByIsbn: (async () => {
        olCalls += 1;
        return null;
      }) as typeof import('./adapters/openLibraryAdapter').fetchOpenLibraryByIsbn,
    });
    const book = await service.getBookByIsbn('9780441172719');
    assert.equal(book?.id, 'gb:v1');
    assert.equal(olCalls, 0);
  });

  it('falls back to Open Library when Google Books misses', async () => {
    const service = new BookDataService({
      searchGoogleBooksByIsbn: ((async () => null)) as typeof import('./adapters/googleBooksAdapter').searchGoogleBooksByIsbn,
      fetchOpenLibraryByIsbn: ((async () => olBook('OL3W'))) as typeof import('./adapters/openLibraryAdapter').fetchOpenLibraryByIsbn,
    });
    const book = await service.getBookByIsbn('9780441172719');
    assert.equal(book?.id, 'ol:OL3W');
  });

  it('falls back to Open Library when Google Books fails', async () => {
    const service = new BookDataService({
      searchGoogleBooksByIsbn: ((() => Promise.reject(gb429()))) as typeof import('./adapters/googleBooksAdapter').searchGoogleBooksByIsbn,
      fetchOpenLibraryByIsbn: ((async () => olBook('OL4W'))) as typeof import('./adapters/openLibraryAdapter').fetchOpenLibraryByIsbn,
    });
    const book = await service.getBookByIsbn('9780441172719');
    assert.equal(book?.id, 'ol:OL4W');
  });

  it('returns null when neither provider has the ISBN', async () => {
    const service = new BookDataService({
      searchGoogleBooksByIsbn: ((async () => null)) as typeof import('./adapters/googleBooksAdapter').searchGoogleBooksByIsbn,
      fetchOpenLibraryByIsbn: ((async () => null)) as typeof import('./adapters/openLibraryAdapter').fetchOpenLibraryByIsbn,
    });
    assert.equal(await service.getBookByIsbn('9780000000000'), null);
  });

  it('returns null without provider calls for blank ISBNs', async () => {
    let calls = 0;
    const service = new BookDataService({
      searchGoogleBooksByIsbn: (async () => {
        calls += 1;
        return null;
      }) as typeof import('./adapters/googleBooksAdapter').searchGoogleBooksByIsbn,
    });
    assert.equal(await service.getBookByIsbn('  '), null);
    assert.equal(calls, 0);
  });

  it('caches ISBN lookups', async () => {
    let calls = 0;
    const service = new BookDataService({
      searchGoogleBooksByIsbn: (async () => {
        calls += 1;
        return gbBook('v5', '9780000000005');
      }) as typeof import('./adapters/googleBooksAdapter').searchGoogleBooksByIsbn,
    });
    await service.getBookByIsbn('9780000000005');
    await service.getBookByIsbn('9780000000005');
    assert.equal(calls, 1);
  });
});

describe('deduplicateBooks', () => {
  it('prefers ISBN-13, then ISBN-10, then provider ids', () => {
    const books = [
      gbBook('v1', '9780441172719'),
      olBook('OL1W', '9780441172719'),
      makeBook({ id: 'gb:v2', providerIds: { googleBooksId: 'v2' }, isbn10: '0441172717' }),
      makeBook({ id: 'ol:x', providerIds: { openLibraryWorkId: 'OLX' }, isbn10: '0441172717' }),
      makeBook({ id: 'gb:v3', providerIds: { googleBooksId: 'v3' } }),
      makeBook({ id: 'gb:v3-dup', providerIds: { googleBooksId: 'v3' } }),
    ];
    const deduped = deduplicateBooks(books);
    assert.deepEqual(
      deduped.map((book) => book.id),
      ['gb:v1', 'gb:v2', 'gb:v3'],
    );
  });

  it('never merges title-only matches', () => {
    const books = [
      makeBook({ id: 'gb:a', title: 'Dune' }),
      makeBook({ id: 'ol:b', title: 'Dune' }),
    ];
    assert.equal(deduplicateBooks(books).length, 2);
  });
});
