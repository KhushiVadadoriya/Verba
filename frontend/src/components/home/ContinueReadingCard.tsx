import React, { useState } from 'react'
import type { CurrentlyReadingData } from '../../types/home'

export interface ContinueReadingCardProps {
  readingData: CurrentlyReadingData
  onContinueReading?: () => void
  className?: string
}

export const ContinueReadingCard: React.FC<ContinueReadingCardProps> = ({
  readingData,
  onContinueReading,
  className = '',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const defaultGradient =
    readingData.bgGradient || 'linear-gradient(175deg, #1B998B 0%, #16697A 60%, #0F4C5C 100%)'

  return (
    <article
      className={`home-continue-card ${className}`}
      aria-label={`Currently reading ${readingData.title} by ${readingData.author}`}
    >
      {/* Left: Book Cover Image & Presentation */}
      <div
        className="home-continue-cover-wrapper"
        style={{ background: defaultGradient }}
      >
        {/* Cover Fallback Title/Author */}
        {(!imageLoaded || imageError || !readingData.coverUrl) && (
          <div className="home-continue-cover-fallback">
            <span className="home-continue-fallback-title">{readingData.title}</span>
            <span className="home-continue-fallback-author">{readingData.author}</span>
          </div>
        )}

        {/* Real Cover Image */}
        {readingData.coverUrl && !imageError && (
          <img
            src={readingData.coverUrl}
            alt={`${readingData.title} cover`}
            className="home-continue-cover-img"
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

      {/* Right: Book Details & Reading Progress */}
      <div className="home-continue-details">
        <div className="home-continue-badge-row">
          <span className="home-continue-badge">{readingData.badgeText}</span>
        </div>

        <h3 className="home-continue-title">{readingData.title}</h3>
        <p className="home-continue-author">{readingData.author}</p>

        <div className="home-continue-progress-block">
          <div className="home-continue-progress-meta">
            <span className="home-continue-progress-text">
              {readingData.progressPercent}% completed
            </span>
          </div>
          <div
            className="home-continue-progress-track"
            role="progressbar"
            aria-valuenow={readingData.progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Reading progress: ${readingData.progressPercent}%`}
          >
            <div
              className="home-continue-progress-fill"
              style={{ width: `${readingData.progressPercent}%` }}
            />
          </div>
        </div>

        <div className="home-continue-action-row">
          <button
            type="button"
            className="home-continue-btn"
            onClick={onContinueReading}
            aria-label={`Continue reading ${readingData.title}`}
          >
            <span>{readingData.ctaText}</span>
          </button>
        </div>
      </div>
    </article>
  )
}

export default ContinueReadingCard
