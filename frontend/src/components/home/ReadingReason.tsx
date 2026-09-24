import React from 'react'
import type { RecommendationReasonData } from '../../types/home'

export interface ReadingReasonProps {
  reason: RecommendationReasonData
  className?: string
}

export const ReadingReason: React.FC<ReadingReasonProps> = ({
  reason,
  className = '',
}) => {
  return (
    <div className={`home-reason-panel ${className}`} role="note" aria-label="Recommendation reasoning">
      <span className="home-reason-label">{reason.label}</span>
      <p className="home-reason-text">
        &ldquo;Because you enjoy character-driven stories with{' '}
        <span className="home-reason-highlight">emotional depth</span> and themes of{' '}
        <span className="home-reason-highlight">identity</span>.&rdquo;
      </p>
    </div>
  )
}

export default ReadingReason
