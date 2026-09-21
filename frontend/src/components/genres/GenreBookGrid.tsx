import React from 'react'
import type { GenreBook } from '../../types/genres'
import { GenreBookCard } from './GenreBookCard'

export interface GenreBookGridProps {
  books: GenreBook[]
  onBookClick?: (book: GenreBook) => void
  emptyMessage?: string
  className?: string
}

export const GenreBookGrid: React.FC<GenreBookGridProps> = ({
  books,
  onBookClick,
  emptyMessage = 'No books found matching your criteria in this genre.',
  className = '',
}) => {
  if (books.length === 0) {
    return (
      <div className="genre-grid-empty">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={`genre-book-grid ${className}`}>
      {books.map((book) => (
        <GenreBookCard
          key={book.id}
          book={book}
          onClick={onBookClick}
        />
      ))}
    </div>
  )
}

export default GenreBookGrid
