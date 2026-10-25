/**
 * Boundary mapping between NormalizedBook (live catalog) and the Add Book
 * modal selection. LibraryBook remains the app-wide bookshelf type; this
 * selection shape covers both curated mock entries and live results so the
 * modal never needs NormalizedBook internally.
 */
import type { NormalizedBook } from '../../../types/bookCatalog';

export interface CatalogBookSelection {
  title: string;
  author: string;
  coverUrl?: string;
  totalPages?: number;
  genres: string[];
}

export const UNKNOWN_AUTHOR = 'Unknown Author';

export function mapNormalizedBookToSelection(book: NormalizedBook): CatalogBookSelection {
  return {
    title: book.title,
    author: book.authors.length > 0 ? book.authors.join(', ') : UNKNOWN_AUTHOR,
    coverUrl: book.coverUrl,
    totalPages: book.pageCount,
    genres: [...book.genres],
  };
}
