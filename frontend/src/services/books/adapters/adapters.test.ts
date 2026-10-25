/**
 * Unit tests for Verba Google Books and Open Library adapters.
 * Network calls are mocked with deterministic fixtures; no live API access.
 */
/// <reference types="node" />
import { afterEach, describe, it } from 'vitest';
import assert from 'node:assert/strict';
import type {
  GoogleBooksVolume,
  OpenLibraryDoc,
  OpenLibraryEdition,
} from '../../../types/bookCatalog';
import {
  fetchGoogleBookById,
  normalizeGoogleBook,
  searchGoogleBooks,
  searchGoogleBooksByIsbn,
} from './googleBooksAdapter';
import {
  fetchOpenLibraryByIsbn,
  normalizeOpenLibraryDoc,
  normalizeOpenLibraryEdition,
  resolveOpenLibraryCoverUrl,
  searchOpenLibrary,
} from './openLibraryAdapter';
import { BookApiError } from '../utils/bookUtils';

const originalFetch = globalThis.fetch;

function jsonResponse(data: unknown, status = 200, statusText = 'OK'): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    json: async () => data,
  } as unknown as Response;
}

function stubFetch(handler: (url: string) => Response | Promise<Response>): void {
  globalThis.fetch = ((input: unknown) => handler(String(input))) as typeof fetch;
}

function forbidFetch(): void {
  stubFetch(() => {
    throw new Error('fetch should not be called');
  });
}

afterEach(() => {
  globalThis.fetch = originalFetch;
});

// ---------------------------------------------------------------------------
// Google Books
// ---------------------------------------------------------------------------

const gbVolume: GoogleBooksVolume = {
  id: 'zyTCAlFPjgYC',
  volumeInfo: {
    title: 'Dune',
    subtitle: 'Deluxe Edition',
    authors: ['Frank Herbert'],
    publisher: 'Ace Books',
    publishedDate: '2019-10-01',
    description: '<p>A sweeping <b>epic</b> &amp; more.</p>',
    industryIdentifiers: [
      { type: 'ISBN_13', identifier: '9780441172719' },
      { type: 'ISBN_10', identifier: '0441172717' },
    ],
    pageCount: 688,
    categories: ['Fiction / Science Fiction', 'Classics'],
    language: 'EN',
    imageLinks: {
      smallThumbnail: 'http://books.google.com/small.jpg',
      thumbnail: 'http://books.google.com/thumb.jpg',
      extraLarge: 'http://books.google.com/xl.jpg',
    },
  },
};

describe('normalizeGoogleBook', () => {
  it('normalizes a valid volume into the canonical shape', () => {
    const book = normalizeGoogleBook(gbVolume);
    assert.equal(book.id, 'gb:zyTCAlFPjgYC');
    assert.equal(book.title, 'Dune');
    assert.equal(book.subtitle, 'Deluxe Edition');
    assert.deepEqual(book.authors, ['Frank Herbert']);
    assert.equal(book.description, 'A sweeping epic & more.');
    assert.equal(book.publisher, 'Ace Books');
    assert.equal(book.publishedDate, '2019-10-01');
    assert.equal(book.publishedDatePrecision, 'day');
    assert.equal(book.pageCount, 688);
    assert.equal(book.language, 'en');
    assert.ok(book.genres.includes('Science Fiction'));
    assert.ok(book.genres.includes('Classics'));
    assert.equal(book.isbn13, '9780441172719');
    assert.equal(book.isbn10, '0441172717');
    assert.equal(book.coverUrl, 'https://books.google.com/xl.jpg');
    assert.equal(book.providerIds.googleBooksId, 'zyTCAlFPjgYC');
    assert.equal(book.sourceProvenance.provider, 'google_books');
  });

  it('applies safe defaults when metadata is missing', () => {
    const book = normalizeGoogleBook({ id: 'vol-1' } as GoogleBooksVolume);
    assert.equal(book.id, 'gb:vol-1');
    assert.equal(book.title, 'Untitled');
    assert.deepEqual(book.authors, []);
    assert.deepEqual(book.genres, []);
    assert.equal(book.description, undefined);
    assert.equal(book.publisher, undefined);
    assert.equal(book.publishedDate, undefined);
    assert.equal(book.publishedDatePrecision, undefined);
    assert.equal(book.pageCount, undefined);
    assert.equal(book.coverUrl, undefined);
  });

  it('leaves coverUrl undefined when no image links exist', () => {
    const book = normalizeGoogleBook({
      id: 'vol-2',
      volumeInfo: { title: 'No Cover', imageLinks: {} },
    });
    assert.equal(book.coverUrl, undefined);
  });

  it('drops non-positive page counts', () => {
    const book = normalizeGoogleBook({
      id: 'vol-3',
      volumeInfo: { title: 'Zero Pages', pageCount: 0 },
    });
    assert.equal(book.pageCount, undefined);
  });

  it('throws BookApiError for null or non-object payloads', () => {
    assert.throws(() => normalizeGoogleBook(null as unknown as GoogleBooksVolume), BookApiError);
  });
});

describe('searchGoogleBooks', () => {
  it('returns empty results without calling fetch for blank queries', async () => {
    forbidFetch();
    const result = await searchGoogleBooks('   ');
    assert.deepEqual(result.items, []);
    assert.equal(result.totalItems, 0);
    assert.equal(result.provider, 'google_books');
  });

  it('normalizes items and skips malformed volumes', async () => {
    stubFetch(() => jsonResponse({ totalItems: 2, items: [gbVolume, null] }));
    const result = await searchGoogleBooks('Dune');
    assert.equal(result.items.length, 1);
    assert.equal(result.items[0]?.title, 'Dune');
    assert.equal(result.totalItems, 2);
  });

  it('handles empty result sets', async () => {
    stubFetch(() => jsonResponse({ totalItems: 0 }));
    const result = await searchGoogleBooks('no-such-book-xyz');
    assert.deepEqual(result.items, []);
    assert.equal(result.totalItems, 0);
  });

  it('paginates with startIndex derived from page and maxResults', async () => {
    let captured = '';
    stubFetch((url) => {
      captured = url;
      return jsonResponse({ totalItems: 0 });
    });
    await searchGoogleBooks('Dune', { page: 2, maxResults: 5 });
    assert.ok(captured.includes('startIndex=5'));
    assert.ok(captured.includes('maxResults=5'));
  });

  it('throws BookApiError with status on HTTP failures', async () => {
    stubFetch(() => jsonResponse({ error: 'x' }, 500, 'Server Error'));
    try {
      await searchGoogleBooks('Dune');
      assert.fail('should have thrown');
    } catch (error) {
      if (!(error instanceof BookApiError)) {
        assert.fail('expected BookApiError');
      }
      assert.equal(error.statusCode, 500);
      assert.equal(error.provider, 'google_books');
    }
  });

  it('wraps transport failures as network errors', async () => {
    stubFetch(() => Promise.reject(new Error('socket hangup')));
    try {
      await searchGoogleBooks('Dune');
      assert.fail('should have thrown');
    } catch (error) {
      if (!(error instanceof BookApiError)) {
        assert.fail('expected BookApiError');
      }
      assert.equal(error.isNetworkError, true);
    }
  });
});

describe('searchGoogleBooksByIsbn', () => {
  it('returns null without fetch for blank ISBNs', async () => {
    forbidFetch();
    assert.equal(await searchGoogleBooksByIsbn('   '), null);
  });

  it('prefers the exact ISBN match among results', async () => {
    const other: GoogleBooksVolume = {
      id: 'other',
      volumeInfo: {
        title: 'Other',
        industryIdentifiers: [{ type: 'ISBN_13', identifier: '9780593135204' }],
      },
    };
    const exact: GoogleBooksVolume = {
      id: 'exact',
      volumeInfo: {
        title: 'Exact',
        industryIdentifiers: [{ type: 'ISBN_13', identifier: '9780441172719' }],
      },
    };
    stubFetch(() => jsonResponse({ totalItems: 2, items: [other, exact] }));
    const book = await searchGoogleBooksByIsbn('978-0-441-17271-9');
    assert.equal(book?.providerIds.googleBooksId, 'exact');
  });

  it('returns null when nothing is found', async () => {
    stubFetch(() => jsonResponse({ totalItems: 0 }));
    assert.equal(await searchGoogleBooksByIsbn('9780000000000'), null);
  });
});

describe('fetchGoogleBookById', () => {
  it('returns null for blank ids and 404 responses', async () => {
    forbidFetch();
    assert.equal(await fetchGoogleBookById('  '), null);
    stubFetch(() => jsonResponse({}, 404, 'Not Found'));
    assert.equal(await fetchGoogleBookById('missing-id'), null);
  });

  it('strips the gb: prefix and normalizes the payload', async () => {
    let captured = '';
    stubFetch((url) => {
      captured = url;
      return jsonResponse(gbVolume);
    });
    const book = await fetchGoogleBookById('gb:zyTCAlFPjgYC');
    assert.equal(book?.title, 'Dune');
    assert.ok(captured.includes('/zyTCAlFPjgYC'));
    assert.ok(!captured.includes('gb%3A'));
  });
});

// ---------------------------------------------------------------------------
// Open Library
// ---------------------------------------------------------------------------

const olDoc: OpenLibraryDoc = {
  key: '/works/OL893414W',
  title: 'Dune',
  author_name: ['Frank Herbert'],
  first_publish_year: 1965,
  number_of_pages_median: 412,
  isbn: ['9780441172719'],
  cover_i: 12345,
  cover_edition_key: 'OL7353617M',
  language: ['eng'],
  subject: ['Science Fiction', 'Fiction', 'Classics', 'Space', 'Adventure', 'Extra'],
  publisher: ['Ace Books', 'Chilton'],
};

const olEdition: OpenLibraryEdition = {
  key: '/books/OL7353617M',
  title: 'Dune',
  subtitle: 'Dune Chronicles',
  authors: [{ key: '/authors/OL1A', name: 'Frank Herbert' }],
  publishers: ['Ace Books'],
  publish_date: '1990',
  number_of_pages: 412,
  isbn_10: ['0441172717'],
  isbn_13: ['9780441172719'],
  covers: [12345],
  works: [{ key: '/works/OL893414W' }],
  description: { type: 'text', value: '<p>Desert <b>planet</b>.</p>' },
  subjects: ['Science Fiction'],
};

describe('normalizeOpenLibraryDoc', () => {
  it('normalizes a valid search document', () => {
    const book = normalizeOpenLibraryDoc(olDoc);
    assert.equal(book.id, 'ol:OL893414W');
    assert.equal(book.title, 'Dune');
    assert.deepEqual(book.authors, ['Frank Herbert']);
    assert.equal(book.publisher, 'Ace Books');
    assert.equal(book.publishedDate, '1965');
    assert.equal(book.publishedDatePrecision, 'year');
    assert.equal(book.pageCount, 412);
    assert.equal(book.language, 'eng');
    assert.equal(book.genres.length, 5);
    assert.equal(book.isbn13, '9780441172719');
    assert.equal(book.coverUrl, 'https://covers.openlibrary.org/b/id/12345-L.jpg');
    assert.equal(book.providerIds.openLibraryWorkId, 'OL893414W');
    assert.equal(book.providerIds.openLibraryEditionId, 'OL7353617M');
    assert.equal(book.sourceProvenance.provider, 'open_library');
  });

  it('applies safe defaults when fields are missing', () => {
    const book = normalizeOpenLibraryDoc({ key: '/works/OL1W', title: '' } as OpenLibraryDoc);
    assert.equal(book.title, 'Untitled');
    assert.deepEqual(book.authors, []);
    assert.deepEqual(book.genres, []);
    assert.equal(book.coverUrl, undefined);
    assert.equal(book.description, undefined);
  });

  it('falls back to ISBN-based covers when no cover id exists', () => {
    const book = normalizeOpenLibraryDoc({
      key: '/works/OL2W',
      title: 'Isbn Cover',
      isbn: ['9780441172719'],
    } as OpenLibraryDoc);
    assert.equal(book.coverUrl, 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg');
  });

  it('throws BookApiError for null payloads', () => {
    assert.throws(() => normalizeOpenLibraryDoc(null as unknown as OpenLibraryDoc), BookApiError);
  });
});

describe('normalizeOpenLibraryEdition', () => {
  it('normalizes a valid edition payload', () => {
    const book = normalizeOpenLibraryEdition(olEdition, '9780441172719');
    assert.equal(book.id, 'ol:OL7353617M');
    assert.equal(book.title, 'Dune');
    assert.deepEqual(book.authors, ['Frank Herbert']);
    assert.equal(book.description, 'Desert planet.');
    assert.equal(book.publisher, 'Ace Books');
    assert.equal(book.publishedDate, '1990');
    assert.equal(book.pageCount, 412);
    assert.equal(book.isbn13, '9780441172719');
    assert.equal(book.isbn10, '0441172717');
    assert.equal(book.coverUrl, 'https://covers.openlibrary.org/b/id/12345-L.jpg');
    assert.equal(book.providerIds.openLibraryWorkId, 'OL893414W');
  });

  it('yields empty authors for key-only author references', () => {
    const book = normalizeOpenLibraryEdition({
      key: '/books/OL9M',
      title: 'Key Only',
      authors: [{ key: '/authors/OL1A' }],
    });
    assert.deepEqual(book.authors, []);
  });

  it('handles string descriptions and missing covers', () => {
    const withString = normalizeOpenLibraryEdition({
      key: '/books/OL10M',
      title: 'String Desc',
      description: '<i>Plain</i> text',
    });
    assert.equal(withString.description, 'Plain text');
    assert.equal(withString.coverUrl, undefined);
  });

  it('throws BookApiError for null payloads', () => {
    assert.throws(
      () => normalizeOpenLibraryEdition(null as unknown as OpenLibraryEdition),
      BookApiError,
    );
  });
});

describe('resolveOpenLibraryCoverUrl', () => {
  it('prefers cover ids over ISBN and OLID', () => {
    assert.equal(
      resolveOpenLibraryCoverUrl({ coverId: 1, isbn: '9780441172719', olid: 'OL1M' }),
      'https://covers.openlibrary.org/b/id/1-L.jpg',
    );
  });

  it('resolves ISBN and OLID covers and cleans inputs', () => {
    assert.equal(
      resolveOpenLibraryCoverUrl({ isbn: '978-0-441-17271-9' }),
      'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg',
    );
    assert.equal(
      resolveOpenLibraryCoverUrl({ olid: '/books/OL1M', size: 'S' }),
      'https://covers.openlibrary.org/b/olid/OL1M-S.jpg',
    );
  });

  it('returns undefined when nothing usable is provided', () => {
    assert.equal(resolveOpenLibraryCoverUrl({}), undefined);
    assert.equal(resolveOpenLibraryCoverUrl({ coverId: 0 }), undefined);
  });
});

describe('searchOpenLibrary', () => {
  it('returns empty results without calling fetch for blank queries', async () => {
    forbidFetch();
    const result = await searchOpenLibrary('');
    assert.deepEqual(result.items, []);
    assert.equal(result.provider, 'open_library');
  });

  it('maps numFound to totalItems and normalizes docs', async () => {
    stubFetch(() => jsonResponse({ numFound: 10, start: 0, docs: [olDoc] }));
    const result = await searchOpenLibrary('Dune');
    assert.equal(result.totalItems, 10);
    assert.equal(result.items.length, 1);
    assert.equal(result.items[0]?.id, 'ol:OL893414W');
  });

  it('skips malformed docs without failing the search', async () => {
    stubFetch(() => jsonResponse({ numFound: 2, start: 0, docs: [olDoc, null] }));
    const result = await searchOpenLibrary('Dune');
    assert.equal(result.items.length, 1);
  });

  it('throws BookApiError with provider context on HTTP failures', async () => {
    stubFetch(() => jsonResponse({}, 500, 'Server Error'));
    try {
      await searchOpenLibrary('Dune');
      assert.fail('should have thrown');
    } catch (error) {
      if (!(error instanceof BookApiError)) {
        assert.fail('expected BookApiError');
      }
      assert.equal(error.provider, 'open_library');
      assert.equal(error.statusCode, 500);
    }
  });

  it('wraps transport failures as network errors', async () => {
    stubFetch(() => Promise.reject(new Error('dns failure')));
    try {
      await searchOpenLibrary('Dune');
      assert.fail('should have thrown');
    } catch (error) {
      if (!(error instanceof BookApiError)) {
        assert.fail('expected BookApiError');
      }
      assert.equal(error.isNetworkError, true);
    }
  });
});

describe('fetchOpenLibraryByIsbn', () => {
  it('returns null without fetch for blank ISBNs', async () => {
    forbidFetch();
    assert.equal(await fetchOpenLibraryByIsbn('  '), null);
  });

  it('returns null on 404 responses', async () => {
    stubFetch(() => jsonResponse({}, 404, 'Not Found'));
    assert.equal(await fetchOpenLibraryByIsbn('9780000000000'), null);
  });

  it('normalizes the edition payload on success', async () => {
    stubFetch(() => jsonResponse(olEdition));
    const book = await fetchOpenLibraryByIsbn('9780441172719');
    assert.equal(book?.id, 'ol:OL7353617M');
    assert.equal(book?.title, 'Dune');
  });
});
