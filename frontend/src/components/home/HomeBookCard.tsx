import React, { useState } from 'react'
import type { HomeRecommendedBookData } from '../../types/home'

export interface HomeBookCardProps {
  book: HomeRecommendedBookData
  onClick?: (book: HomeRecommendedBookData) => void
  className?: string
}

export const HomeBookCard: React.FC<HomeBookCardProps> = ({
  book,
  onClick,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const defaultGradient =
    book.bgGradient || 'linear-gradient(175deg, #48479e 0%, #1e1d24 100%)'

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault()
      onClick(book)
    }
  }

  return (
    <article
      className={`home-book-card ${onClick ? 'clickable' : ''} ${className}`}
      onClick={() => onClick?.(book)}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : 'article'}
      aria-label={`${book.title} by ${book.author}`}
    >
      {/* Book Cover Container */}
      <div
        className="home-book-cover-container"
        style={{ background: defaultGradient }}
      >
        {/* Cover Fallback */}
        {(!imageLoaded || imageError || !book.coverUrl) && (
          <div className="home-book-cover-fallback">
            <span className="home-book-fallback-title">{book.title}</span>
            <span className="home-book-fallback-author">{book.author}</span>
          </div>
        )}

        {/* Real Cover Image */}
        {book.coverUrl && !imageError && (
          <img
            src={book.coverUrl}
            alt={`${book.title} cover`}
            className="home-book-cover-img"
            style={{
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 250ms ease-in-out',
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Tactile Book Spine Lighting Overlay */}
        <div className="book-cover-spine-highlight" aria-hidden="true" />
      </div>

      {/* Book Metadata */}
      <div className="home-book-info">
        <h4 className="home-book-title">{book.title}</h4>
        <p className="home-book-author">{book.author}</p>
      </div>
    </article>
  )
}

export default HomeBookCard
