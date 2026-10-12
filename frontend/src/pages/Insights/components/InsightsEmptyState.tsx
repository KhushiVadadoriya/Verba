import React from 'react'
import { Sparkles, Compass } from 'lucide-react'

export interface InsightsEmptyStateProps {
  onDiscoverClick?: () => void
}

export const InsightsEmptyState: React.FC<InsightsEmptyStateProps> = ({ onDiscoverClick }) => {
  return (
    <div className="insights-empty-panel">
      <div className="insights-empty-icon-bubble" aria-hidden="true">
        <Sparkles size={28} />
      </div>

      <h2 className="insights-empty-title">Your Reading Story is Beginning</h2>

      <p className="insights-empty-description">
        As you complete books, log reading sessions, and reflect on themes and moods,
        personalized insights, genre charts, and your annual Wrapped will blossom here.
      </p>

      {onDiscoverClick && (
        <button
          type="button"
          className="insights-btn-primary"
          onClick={onDiscoverClick}
        >
          <Compass size={18} />
          <span>Explore Recommended Books</span>
        </button>
      )}
    </div>
  )
}

export default InsightsEmptyState
