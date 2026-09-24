import React, { useState } from 'react'

export interface BookCardData {
  id: string
  title: string
  author: string
  coverUrl?: string
  accentColor?: string
  bgGradient?: string
}

export interface BookCardProps {
  book: BookCardData
  onClick?: () => void
  className?: string
  isDuplicate?: boolean
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onClick,
  className = '',
  isDuplicate = false,
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick()
    }
  }

  const defaultGradient =
    book.bgGradient ||
    'linear-gradient(175deg, #3730a3 0%, #1e1b4b 100%)'

  return (
    <div
      className={`discover-book-card ${className}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick && !isDuplicate ? 0 : isDuplicate ? -1 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={isDuplicate ? undefined : `${book.title} by ${book.author}`}
      aria-hidden={isDuplicate ? true : undefined}
    >
      <div
        className="discover-book-cover-wrapper"
        style={{ background: defaultGradient }}
      >
        {/* Base Fallback Layout with Author and Title */}
        <div className="discover-book-cover-fallback">
          <span className="discover-book-cover-fallback-author">
            {book.author}
          </span>
          <span className="discover-book-cover-fallback-title">
            {book.title}
          </span>
          <div style={{ height: '14px' }} />
        </div>

        {/* Real Cover Image (when provided and loaded) */}
        {book.coverUrl && !imageError && (
          <img
            src={book.coverUrl}
            alt={`${book.title} cover`}
            className="discover-book-img"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 300ms ease-in-out',
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Tactile Book Spine Lighting Overlay */}
        <div className="book-cover-spine-highlight" aria-hidden="true" />
      </div>
    </div>
  )
}

export default BookCard
