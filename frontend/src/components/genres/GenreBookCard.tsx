import React, { useState } from 'react'
import type { GenreBook } from '../../types/genres'

export interface GenreBookCardProps {
  book: GenreBook
  onClick?: (book: GenreBook) => void
  className?: string
}

export const GenreBookCard: React.FC<GenreBookCardProps> = ({
  book,
  onClick,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault()
      onClick(book)
    }
  }

  const defaultGradient =
    book.bgGradient ||
    'linear-gradient(175deg, #48479e 0%, #1e1d24 100%)'

  return (
    <article
      className={`genre-book-card ${onClick ? 'clickable' : ''} ${className}`}
      onClick={() => onClick?.(book)}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : 'article'}
      aria-label={`${book.title} by ${book.author}`}
    >
      {/* Book Cover */}
      <div
        className="genre-book-cover-container"
        style={{ background: defaultGradient }}
      >
        {/* Fallback author and title (shown only when image not loaded or error) */}
        {(!imageLoaded || imageError || !book.coverUrl) && (
          <div className="genre-book-cover-fallback">
            <span className="genre-book-fallback-title">{book.title}</span>
            <span className="genre-book-fallback-author">{book.author}</span>
          </div>
        )}

        {/* Real Book Cover Image */}
        {book.coverUrl && !imageError && (
          <img
            src={book.coverUrl}
            alt={`${book.title} cover`}
            className="genre-book-cover-img"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 2,
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 250ms ease-in-out',
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Tactile Book Spine Lighting Overlay */}
        <div className="book-cover-spine-highlight" style={{ zIndex: 3 }} aria-hidden="true" />
      </div>

      {/* Book Metadata */}
      <div className="genre-book-info">
        <h3 className="genre-book-title">{book.title}</h3>
        <p className="genre-book-author">{book.author}</p>
      </div>
    </article>
  )
}

export default GenreBookCard
