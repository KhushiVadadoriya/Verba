/**
 * Unit tests for Verba book catalog utilities (ISBN, dates, HTML, URLs, API key).
 * Runs on Node's built-in test runner; no network access.
 */
/// <reference types="node" />
import { describe, it } from 'vitest';
import assert from 'node:assert/strict';
import {
  BookApiError,
  cleanIsbn,
  extractIsbns,
  getGoogleBooksApiKey,
  isValidIsbn10,
  isValidIsbn13,
  parsePublishedDate,
  stripHtml,
  upgradeToHttps,
} from './bookUtils';

describe('cleanIsbn', () => {
  it('strips dashes and spaces', () => {
    assert.equal(cleanIsbn('978-0-14 312774-1'), '9780143127741');
  });

  it('uppercases a lowercase x check digit', () => {
    assert.equal(cleanIsbn('0-306-40615-x'), '030640615X');
  });

  it('returns empty string for empty, null, or undefined input', () => {
    assert.equal(cleanIsbn(''), '');
    assert.equal(cleanIsbn(null), '');
    assert.equal(cleanIsbn(undefined), '');
  });
});

describe('ISBN validation', () => {
  it('accepts valid ISBN-10 values', () => {
    assert.equal(isValidIsbn10('0306406152'), true);
    assert.equal(isValidIsbn10('030640615X'), true);
    assert.equal(isValidIsbn10('0-306-40615-2'), true);
  });

  it('rejects non-ISBN-10 values', () => {
    assert.equal(isValidIsbn10('9780143127741'), false);
    assert.equal(isValidIsbn10('123'), false);
    assert.equal(isValidIsbn10(''), false);
  });

  it('accepts valid ISBN-13 values with 978/979 prefixes', () => {
    assert.equal(isValidIsbn13('9780143127741'), true);
    assert.equal(isValidIsbn13('9791090636070'), true);
    assert.equal(isValidIsbn13('978-0-14-312774-1'), true);
  });

  it('rejects non-ISBN-13 values', () => {
    assert.equal(isValidIsbn13('978014312774'), false);
    assert.equal(isValidIsbn13('1234567890123'), false);
    assert.equal(isValidIsbn13('0306406152'), false);
  });
});

describe('extractIsbns', () => {
  it('extracts ISBNs from Google Books industry identifiers', () => {
    const result = extractIsbns([
      { type: 'ISBN_13', identifier: '9780143127741' },
      { type: 'ISBN_10', identifier: '0143127748' },
    ]);
    assert.deepEqual(result, { isbn10: '0143127748', isbn13: '9780143127741' });
  });

  it('extracts ISBNs from Open Library string arrays', () => {
    const result = extractIsbns(['9780441172719', '0441172717']);
    assert.deepEqual(result, { isbn10: '0441172717', isbn13: '9780441172719' });
  });

  it('keeps the first valid value and ignores junk', () => {
    const result = extractIsbns(['not-an-isbn', '9780143127741', '9780593135204']);
    assert.equal(result.isbn13, '9780143127741');
    assert.equal(result.isbn10, undefined);
  });

  it('returns no ISBNs for null, undefined, or empty input', () => {
    const results = [extractIsbns(null), extractIsbns(undefined), extractIsbns([])];
    for (const result of results) {
      assert.equal(result.isbn10, undefined);
      assert.equal(result.isbn13, undefined);
    }
  });
});

describe('parsePublishedDate', () => {
  it('detects day precision', () => {
    assert.deepEqual(parsePublishedDate('2020-05-14'), {
      publishedDate: '2020-05-14',
      precision: 'day',
    });
  });

  it('detects month precision', () => {
    assert.deepEqual(parsePublishedDate('2020-05'), {
      publishedDate: '2020-05',
      precision: 'month',
    });
  });

  it('detects year precision', () => {
    assert.deepEqual(parsePublishedDate('1965'), {
      publishedDate: '1965',
      precision: 'year',
    });
  });

  it('marks non-standard formats with unknown precision', () => {
    assert.deepEqual(parsePublishedDate('October 2018'), {
      publishedDate: 'October 2018',
      precision: 'unknown',
    });
  });

  it('returns empty result for missing input', () => {
    assert.deepEqual(parsePublishedDate(''), {});
    assert.deepEqual(parsePublishedDate(null), {});
    assert.deepEqual(parsePublishedDate(undefined), {});
  });
});

describe('stripHtml', () => {
  it('strips tags from descriptions', () => {
    assert.equal(stripHtml('<p>Hello <b>World</b></p>'), 'Hello World');
  });

  it('decodes common HTML entities', () => {
    assert.equal(stripHtml('Fish &amp; Chips &lt;3 &quot;yum&quot;'), 'Fish & Chips <3 "yum"');
  });

  it('converts line breaks to newlines', () => {
    assert.equal(stripHtml('a<br>b'), 'a\nb');
  });

  it('returns undefined for missing or tag-only input', () => {
    assert.equal(stripHtml(null), undefined);
    assert.equal(stripHtml(undefined), undefined);
    assert.equal(stripHtml(''), undefined);
    assert.equal(stripHtml('<p></p>'), undefined);
  });
});

describe('upgradeToHttps', () => {
  it('upgrades http URLs to https', () => {
    assert.equal(upgradeToHttps('http://books.google.com/a.jpg'), 'https://books.google.com/a.jpg');
  });

  it('leaves https URLs unchanged apart from trimming', () => {
    assert.equal(upgradeToHttps('  https://x.com/a.jpg  '), 'https://x.com/a.jpg');
  });

  it('handles protocol-relative URLs', () => {
    assert.equal(upgradeToHttps('//cdn.example.com/a.jpg'), 'https://cdn.example.com/a.jpg');
  });

  it('returns undefined for missing or blank input', () => {
    assert.equal(upgradeToHttps(null), undefined);
    assert.equal(upgradeToHttps(undefined), undefined);
    assert.equal(upgradeToHttps('   '), undefined);
  });
});

describe('getGoogleBooksApiKey', () => {
  const KEY = 'VITE_GOOGLE_BOOKS_API_KEY';

  function readEnv(): Record<string, string | undefined> {
    const holder = globalThis as unknown as {
      process?: { env?: Record<string, string | undefined> };
    };
    if (!holder.process?.env) {
      throw new Error('process.env is unavailable');
    }
    return holder.process.env;
  }

  it('returns undefined when no key is configured', () => {
    const env = readEnv();
    const saved = env[KEY];
    delete env[KEY];
    try {
      assert.equal(getGoogleBooksApiKey(), undefined);
    } finally {
      if (saved === undefined) {
        delete env[KEY];
      } else {
        env[KEY] = saved;
      }
    }
  });

  it('returns the configured key when present', () => {
    const env = readEnv();
    const saved = env[KEY];
    env[KEY] = 'test-key-123';
    try {
      assert.equal(getGoogleBooksApiKey(), 'test-key-123');
    } finally {
      if (saved === undefined) {
        delete env[KEY];
      } else {
        env[KEY] = saved;
      }
    }
  });
});

describe('BookApiError', () => {
  it('carries provider context with network errors defaulting to false', () => {
    const error = new BookApiError({ provider: 'google_books', message: 'boom' });
    assert.ok(error instanceof Error);
    assert.equal(error.name, 'BookApiError');
    assert.equal(error.provider, 'google_books');
    assert.equal(error.message, 'boom');
    assert.equal(error.isNetworkError, false);
    assert.equal(error.statusCode, undefined);
  });

  it('preserves status, network flag, and cause', () => {
    const cause = new Error('socket hangup');
    const error = new BookApiError({
      provider: 'open_library',
      message: 'net down',
      statusCode: 500,
      statusText: 'Server Error',
      isNetworkError: true,
      cause,
    });
    assert.equal(error.statusCode, 500);
    assert.equal(error.statusText, 'Server Error');
    assert.equal(error.isNetworkError, true);
    assert.equal(error.cause, cause);
  });
});
