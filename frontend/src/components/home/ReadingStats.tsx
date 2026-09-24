import React from 'react'
import { BookOpen, Flame, Target, ArrowRight } from 'lucide-react'
import type { MonthlyReadingStatsData } from '../../types/home'

export interface ReadingStatsProps {
  stats: MonthlyReadingStatsData
  onViewInsights?: () => void
  className?: string
}

export const ReadingStats: React.FC<ReadingStatsProps> = ({
  stats,
  onViewInsights,
  className = '',
}) => {
  return (
    <section className={`home-stats-section ${className}`} aria-labelledby="reading-stats-heading">
      <h2 id="reading-stats-heading" className="home-section-title">
        Your Reading This Month
      </h2>

      <div className="home-stats-card">
        <div className="home-stats-columns">
          {/* Column 1: Books read */}
          <div className="home-stats-col">
            <div className="home-stats-icon-wrapper" aria-hidden="true">
              <BookOpen size={24} strokeWidth={2} />
            </div>
            <span className="home-stats-label">Books read</span>
            <span className="home-stats-value">{stats.booksRead}</span>
          </div>

          <div className="home-stats-divider" aria-hidden="true" />

          {/* Column 2: Reading streak */}
          <div className="home-stats-col">
            <div className="home-stats-icon-wrapper" aria-hidden="true">
              <Flame size={24} strokeWidth={2} />
            </div>
            <span className="home-stats-label">Reading streak</span>
            <span className="home-stats-value">{stats.streakDays} days</span>
          </div>

          <div className="home-stats-divider" aria-hidden="true" />

          {/* Column 3: Goal */}
          <div className="home-stats-col">
            <div className="home-stats-icon-wrapper" aria-hidden="true">
              <Target size={24} strokeWidth={2} />
            </div>
            <span className="home-stats-label">Goal</span>
            <span className="home-stats-value">
              {stats.goalCurrent} / {stats.goalTarget}
            </span>
          </div>
        </div>

        {/* Action Link: View your insights */}
        <div className="home-stats-footer">
          <button
            type="button"
            className="home-stats-link"
            onClick={onViewInsights}
            aria-label="View your reading insights"
          >
            <span>View your insights</span>
            <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default ReadingStats
