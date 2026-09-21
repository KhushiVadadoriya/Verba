import React, { useState } from 'react'
import { Star, ArrowRight } from 'lucide-react'
import type { RecommendationBook } from '../../types/recommendations'
import { RecommendationReasonCard } from './RecommendationReasonCard'

export interface FeaturedRecommendationProps {
  book: RecommendationBook
  onViewDetails?: (book: RecommendationBook) => void
  className?: string
}

export const FeaturedRecommendation: React.FC<FeaturedRecommendationProps> = ({
  book,
  onViewDetails,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const defaultGradient =
    book.bgGradient ||
    'linear-gradient(175deg, #48479e 0%, #1e1d24 100%)'

  return (
    <section
      className={`featured-recommendation-panel ${className}`}
      aria-labelledby="featured-book-title"
    >
      {/* Column 1: Book Cover */}
      <div className="featured-cover-col">
        <div
          className="featured-cover-wrapper"
          style={{ background: defaultGradient }}
        >
          {/* Fallback author and title */}
          <div className="featured-cover-fallback">
            <span className="featured-cover-fallback-author">{book.author}</span>
            <span className="featured-cover-fallback-title">{book.title}</span>
            <div style={{ height: '10px' }} />
          </div>

          {/* Book Image */}
          {book.coverUrl && !imageError && (
            <img
              src={book.coverUrl}
              alt={`${book.title} cover`}
              className="featured-cover-img"
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

          {/* Spine Highlight */}
          <div className="book-cover-spine-highlight" aria-hidden="true" />
        </div>
      </div>

      {/* Column 2: Book Info */}
      <div className="featured-info-col">
        <span className="featured-badge">{book.badge}</span>
        <h2 id="featured-book-title" className="featured-title">
          {book.title}
        </h2>
        <p className="featured-author">{book.author}</p>

        <div className="featured-rating" aria-label={`Rated ${book.rating} out of 5 stars with ${book.ratingsCount}`}>
          <Star size={16} className="featured-star-icon" aria-hidden="true" />
          <span>
            <strong>{book.rating}</strong> ({book.ratingsCount})
          </span>
        </div>

        <button
          type="button"
          className="featured-details-btn"
          onClick={() => onViewDetails?.(book)}
          aria-label={`View details for ${book.title}`}
        >
          <span>View Details</span>
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Vertical Divider */}
      <div className="featured-divider" aria-hidden="true" />

      {/* Column 3: Why we recommended this */}
      <div className="featured-reasons-col">
        <h3 className="featured-reasons-title">Why we recommended this</h3>
        <div className="featured-reasons-list">
          {book.reasons.map((reason, idx) => (
            <RecommendationReasonCard key={idx} reason={reason} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedRecommendation
