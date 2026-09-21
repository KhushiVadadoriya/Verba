import React from 'react'
import { BookCard, type BookCardData } from './BookCard'

export interface BookCarouselProps {
  books: BookCardData[]
  onBookClick?: (book: BookCardData) => void
  ariaLabel?: string
  className?: string
}

export const BookCarousel: React.FC<BookCarouselProps> = ({
  books,
  onBookClick,
  ariaLabel = 'Book collection',
  className = '',
}) => {
  return (
    <div
      className={`book-carousel-container ${className}`}
      role="region"
      aria-label={ariaLabel}
    >
      <div className="book-carousel-track">
        {books.map((book, index) => (
          <BookCard
            key={`${book.id}-${index}`}
            book={book}
            onClick={onBookClick ? () => onBookClick(book) : undefined}
          />
        ))}
      </div>
    </div>
  )
}

export default BookCarousel
