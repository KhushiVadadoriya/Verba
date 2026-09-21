import React, { useState } from 'react'
import { Star } from 'lucide-react'
import type { RecommendationBook } from '../../types/recommendations'

export interface RecommendationCardProps {
  book: RecommendationBook
  isSelected?: boolean
  onSelect?: (book: RecommendationBook) => void
  className?: string
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  book,
  isSelected = false,
  onSelect,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect?.(book)
    }
  }

  const defaultGradient =
    book.bgGradient ||
    'linear-gradient(175deg, #48479e 0%, #1e1d24 100%)'

  return (
    <div
      className={`more-card ${isSelected ? 'active' : ''} ${className}`}
      onClick={() => onSelect?.(book)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`${book.title} by ${book.author}`}
    >
      {/* Top Part: Thumbnail Cover + Metadata */}
      <div className="more-card-top">
        <div
          className="more-card-cover-wrapper"
          style={{ background: defaultGradient }}
        >
          {/* Fallback author and title */}
          <div className="more-card-cover-fallback">
            <span>{book.title}</span>
          </div>

          {book.coverUrl && !imageError && (
            <img
              src={book.coverUrl}
              alt={`${book.title} cover`}
              className="more-card-cover-img"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
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

        <div className="more-card-info">
          <h4 className="more-card-title">{book.title}</h4>
          <p className="more-card-author">{book.author}</p>
          <div className="more-card-rating">
            <Star size={13} className="featured-star-icon" aria-hidden="true" />
            <span>{book.rating}</span>
          </div>
        </div>
      </div>

      {/* Bottom Part: Soft Pink Reason Box */}
      <div className="more-card-reason-box">
        <p style={{ margin: 0 }}>
          {book.shortReason.segments.map((seg, idx) =>
            seg.highlighted ? (
              <span key={idx} className="reason-highlight">
                {seg.text}
              </span>
            ) : (
              <span key={idx}>{seg.text}</span>
            )
          )}
        </p>
      </div>
    </div>
  )
}

export default RecommendationCard
