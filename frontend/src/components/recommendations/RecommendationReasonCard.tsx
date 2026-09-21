import React from 'react'
import { Heart, BookOpen, Sparkles } from 'lucide-react'
import type { RecommendationReason } from '../../types/recommendations'

export interface RecommendationReasonCardProps {
  reason: RecommendationReason
  className?: string
}

export const RecommendationReasonCard: React.FC<RecommendationReasonCardProps> = ({
  reason,
  className = '',
}) => {
  const renderIcon = () => {
    switch (reason.icon) {
      case 'heart':
        return <Heart size={18} className="reason-icon" aria-hidden="true" />
      case 'book':
        return <BookOpen size={18} className="reason-icon" aria-hidden="true" />
      case 'sparkles':
        return <Sparkles size={18} className="reason-icon" aria-hidden="true" />
      default:
        return <Sparkles size={18} className="reason-icon" aria-hidden="true" />
    }
  }

  return (
    <div className={`reason-card ${className}`}>
      {renderIcon()}
      <p className="reason-text">
        {reason.segments.map((segment, index) =>
          segment.highlighted ? (
            <span key={index} className="reason-highlight">
              {segment.text}
            </span>
          ) : (
            <span key={index}>{segment.text}</span>
          )
        )}
      </p>
    </div>
  )
}

export default RecommendationReasonCard
