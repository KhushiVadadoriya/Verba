import React from 'react'
import { BookOpen, Star, Layers } from 'lucide-react'
import type { ReadingOverviewStats, TimeRangeOption } from '../../../types/insights'
import { TimeRangeSelector } from './TimeRangeSelector'

export interface ReadingAtGlanceProps {
  stats: ReadingOverviewStats
  selectedRange: TimeRangeOption
  onRangeChange: (range: TimeRangeOption) => void
  isLoading?: boolean
}

export const ReadingAtGlance: React.FC<ReadingAtGlanceProps> = ({
  stats,
  selectedRange,
  onRangeChange,
  isLoading = false,
}) => {
  return (
    <section
      className="insights-section insights-glance-section"
      aria-labelledby="reading-at-glance-heading"
    >
      <div className="insights-glance-panel">
        {/* Panel Header */}
        <div className="insights-glance-header">
          <div className="insights-glance-header-text">
            <h2 id="reading-at-glance-heading" className="insights-glance-title">
              Reading at a Glance
            </h2>
            <p className="insights-glance-subtitle">
              Your reading snapshot from {stats.periodLabel}.
            </p>
          </div>

          <div className="insights-glance-controls">
            <TimeRangeSelector
              selectedRange={selectedRange}
              onChange={onRangeChange}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="insights-stats-row" role="region" aria-label="Reading Statistics Overview">
          {/* Metric 1: Books read */}
          <div className="insights-stat-col">
            <div className="insights-stat-icon-wrapper" aria-hidden="true">
              <BookOpen size={24} strokeWidth={1.75} />
            </div>
            <span className="insights-stat-label">Books read</span>
            <span className="insights-stat-value" aria-live="polite">
              {stats.booksRead}
            </span>
          </div>

          <div className="insights-stat-divider" aria-hidden="true" />

          {/* Metric 2: Average rating */}
          <div className="insights-stat-col">
            <div className="insights-stat-icon-wrapper" aria-hidden="true">
              <Star size={24} strokeWidth={1.75} />
            </div>
            <span className="insights-stat-label">Avg. rating</span>
            <span className="insights-stat-value" aria-live="polite">
              {stats.avgRating.toFixed(1)}
            </span>
          </div>

          <div className="insights-stat-divider" aria-hidden="true" />

          {/* Metric 3: Genres explored */}
          <div className="insights-stat-col">
            <div className="insights-stat-icon-wrapper" aria-hidden="true">
              <Layers size={24} strokeWidth={1.75} />
            </div>
            <span className="insights-stat-label">Genres explored</span>
            <span className="insights-stat-value" aria-live="polite">
              {stats.genresExplored}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReadingAtGlance
