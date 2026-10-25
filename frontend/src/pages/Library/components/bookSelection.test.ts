/**
 * Unit tests for the Add Book modal selection mapping.
 */
/// <reference types="node" />
import { describe, it } from 'vitest';
import assert from 'node:assert/strict';
import type { NormalizedBook } from '../../../types/bookCatalog';
import { UNKNOWN_AUTHOR, mapNormalizedBookToSelection } from './bookSelection';

function liveBook(overrides: Partial<NormalizedBook> = {}): NormalizedBook {
  return {
    id: 'gb:v1',
    title: 'Dune',
    authors: ['Frank Herbert'],
    genres: ['Science Fiction'],
    providerIds: { googleBooksId: 'v1' },
    coverUrl: 'https://books.google.com/v1.jpg',
    pageCount: 688,
    sourceProvenance: { provider: 'google_books', fetchedAt: '2024-01-01T00:00:00Z' },
    ...overrides,
  };
}

describe('mapNormalizedBookToSelection', () => {
  it('maps a fully populated live book', () => {
    const selection = mapNormalizedBookToSelection(liveBook());
    assert.deepEqual(selection, {
      title: 'Dune',
      author: 'Frank Herbert',
      coverUrl: 'https://books.google.com/v1.jpg',
      totalPages: 688,
      genres: ['Science Fiction'],
    });
  });

  it('joins multiple authors', () => {
    const selection = mapNormalizedBookToSelection(
      liveBook({ authors: ['Author One', 'Author Two'] }),
    );
    assert.equal(selection.author, 'Author One, Author Two');
  });

  it('falls back to Unknown Author when authors are missing', () => {
    const selection = mapNormalizedBookToSelection(liveBook({ authors: [] }));
    assert.equal(selection.author, UNKNOWN_AUTHOR);
  });

  it('leaves cover and page count undefined when missing', () => {
    const selection = mapNormalizedBookToSelection(
      liveBook({ coverUrl: undefined, pageCount: undefined }),
    );
    assert.equal(selection.coverUrl, undefined);
    assert.equal(selection.totalPages, undefined);
  });

  it('copies genres without sharing the source array', () => {
    const book = liveBook({ genres: [] });
    const selection = mapNormalizedBookToSelection(book);
    assert.deepEqual(selection.genres, []);
    assert.notEqual(selection.genres, book.genres);
  });
});
