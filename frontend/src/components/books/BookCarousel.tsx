import React from 'react'
import { BookCard, type BookCardData } from './BookCard'

export interface BookCarouselProps {
  books: BookCardData[]
  onBookClick?: (book: BookCardData) => void
  ariaLabel?: string
  className?: string
  isMarquee?: boolean
}

export const BookCarousel: React.FC<BookCarouselProps> = ({
  books,
  onBookClick,
  ariaLabel = 'Book collection',
  className = '',
  isMarquee = false,
}) => {
  if (isMarquee) {
    // Duplicate the books list within each track to ensure full coverage on ultra-wide screens
    const marqueeBooks = [...books, ...books]

    return (
      <div
        className={`book-carousel-container marquee-mode ${className}`}
        role="region"
        aria-label={ariaLabel}
      >
        {/* Track 1: Primary interactive track */}
        <div className="book-carousel-track marquee-track">
          {marqueeBooks.map((book, index) => (
            <BookCard
              key={`primary-${book.id}-${index}`}
              book={book}
              onClick={onBookClick ? () => onBookClick(book) : undefined}
            />
          ))}
        </div>

        {/* Track 2: Seamless loop duplicate track */}
        <div className="book-carousel-track marquee-track" aria-hidden="true">
          {marqueeBooks.map((book, index) => (
            <BookCard
              key={`duplicate-${book.id}-${index}`}
              book={book}
              onClick={onBookClick ? () => onBookClick(book) : undefined}
              isDuplicate={true}
            />
          ))}
        </div>
      </div>
    )
  }

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
