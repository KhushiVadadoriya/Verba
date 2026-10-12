import React, { useState } from 'react'
import {
  Sparkles,
  BookOpen,
  Star,
  Compass,
  Bookmark,
  RefreshCw,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import type { ReadingDNAMetrics } from '../../../types/profile'

export interface ReadingDNASectionProps {
  metrics: ReadingDNAMetrics
  onRefreshDNA: () => Promise<void>
  onViewInsights?: () => void
}

export const ReadingDNASection: React.FC<ReadingDNASectionProps> = ({
  metrics,
  onRefreshDNA,
  onViewInsights,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await onRefreshDNA()
    } finally {
      setTimeout(() => setIsRefreshing(false), 500)
    }
  }

  const { archetype, tendencies, hasEnoughData } = metrics

  return (
    <div
      className="profile-section-panel"
      role="tabpanel"
      id="section-panel-reading-dna"
      aria-labelledby="tab-reading-dna"
    >
      {/* Section Header */}
      <div className="profile-section-header reading-dna-section-header">
        <div className="reading-dna-header-text">
          <h2 className="profile-section-title">Your Reading DNA</h2>
          <p className="profile-section-subtitle">
            A personalized profile of your reading mind, built from your books, moods,
            reflections, and preferences.
          </p>
        </div>
        <div className="reading-dna-header-action">
          <button
            type="button"
            className="btn btn-outline reading-dna-update-btn"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              size={14}
              style={{
                animation: isRefreshing ? 'spin 1s linear infinite' : undefined,
              }}
            />
            <span>{isRefreshing ? 'Updating DNA...' : 'Update DNA'}</span>
          </button>
        </div>
      </div>

      {!hasEnoughData || !archetype ? (
        <div className="reading-dna-empty-card">
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: '#fbf0f6',
              color: 'var(--color-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-4)',
            }}
          >
            <Compass size={28} />
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-roman, var(--font-serif))',
              fontSize: 'var(--text-xl)',
              marginBottom: 'var(--space-2)',
            }}
          >
            Discovering Your Reading Identity
          </h3>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              maxWidth: 480,
              margin: '0 auto var(--space-4)',
              lineHeight: 1.6,
            }}
          >
            {metrics.revealsSummary}
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onViewInsights}
            style={{ fontSize: 'var(--text-sm)' }}
          >
            Explore Library & Completed Books
          </button>
        </div>
      ) : (
        <>
          {/* Reader Archetype Card */}
          <section
            className="reading-dna-archetype-card"
            aria-labelledby="archetype-heading"
          >
            <div className="archetype-avatar-badge" aria-hidden="true">
              <Sparkles size={42} />
            </div>

            <div className="archetype-content">
              <span className="archetype-tagline">{archetype.badgeLabel}</span>
              <h3 id="archetype-heading" className="archetype-title">
                {archetype.title}
              </h3>
              <p className="archetype-summary">{archetype.summary}</p>

              <div
                className="archetype-traits-list"
                aria-label="Core Archetype Traits"
              >
                {archetype.coreTraits.map((trait, index) => (
                  <span key={index} className="archetype-trait-chip">
                    {trait}
                  </span>
                ))}
              </div>

              <blockquote className="archetype-quote">{archetype.quote}</blockquote>
            </div>
          </section>

          {/* Reading Summary Metrics */}
          <section
            className="reading-metrics-grid"
            aria-label="Reading Summary Metrics"
          >
            <div className="reading-metric-card">
              <div className="metric-card-top">
                <div className="metric-card-icon" aria-hidden="true">
                  <BookOpen size={18} />
                </div>
                <span className="metric-card-label">Books Read</span>
              </div>
              <span className="metric-card-value">{metrics.booksRead}</span>
            </div>

            <div className="reading-metric-card">
              <div className="metric-card-top">
                <div className="metric-card-icon" aria-hidden="true">
                  <Star size={18} />
                </div>
                <span className="metric-card-label">Average Rating</span>
              </div>
              <span className="metric-card-value">
                {metrics.avgRating > 0 ? `${metrics.avgRating} ★` : '—'}
              </span>
            </div>

            <div className="reading-metric-card">
              <div className="metric-card-top">
                <div className="metric-card-icon" aria-hidden="true">
                  <Bookmark size={18} />
                </div>
                <span className="metric-card-label">Top Genre</span>
              </div>
              <span className="metric-card-value">
                {metrics.topGenre}
              </span>
            </div>

            <div className="reading-metric-card">
              <div className="metric-card-top">
                <div className="metric-card-icon" aria-hidden="true">
                  <TrendingUp size={18} />
                </div>
                <span className="metric-card-label">Key Theme</span>
              </div>
              <span className="metric-card-value">
                {metrics.keyTheme}
              </span>
            </div>
          </section>

          {/* Tendencies & Reveals Split Layout */}
          <div className="reading-dna-split-grid">
            {/* Panel: Your Reading Tendencies */}
            <div className="profile-card">
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-roman, var(--font-serif))',
                    fontSize: 'var(--text-lg)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 4,
                  }}
                >
                  Your Reading Tendencies
                </h3>
                <p
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Calculated distribution across your completed library titles.
                </p>
              </div>

              <div
                className="tendencies-list"
                role="region"
                aria-label="Reading Tendencies Percentages"
              >
                {tendencies.map((tendency, idx) => (
                  <div key={idx} className="tendency-row">
                    <div className="tendency-header">
                      <span>{tendency.category}</span>
                      <span
                        style={{
                          fontWeight: 600,
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {tendency.percentage}%
                      </span>
                    </div>
                    <div
                      className="tendency-bar-track"
                      role="progressbar"
                      aria-valuenow={tendency.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="tendency-bar-fill"
                        style={{
                          width: `${tendency.percentage}%`,
                          backgroundColor: tendency.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel: What Your Reading Reveals */}
            <div className="profile-card profile-card-blush">
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-roman, var(--font-serif))',
                    fontSize: 'var(--text-lg)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 4,
                  }}
                >
                  What Your Reading Reveals
                </h3>
                <p
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Empirical synthesis from your book logs and reflections.
                </p>
              </div>

              <p className="reveals-card-text">{metrics.revealsSummary}</p>
              <p
                className="reveals-card-text"
                style={{ fontSize: 'var(--text-xs)', opacity: 0.9 }}
              >
                {archetype.description}
              </p>

              {onViewInsights && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={onViewInsights}
                  style={{
                    padding: 0,
                    color: 'var(--color-secondary)',
                    fontWeight: 600,
                    fontSize: 'var(--text-sm)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-1)',
                  }}
                >
                  View Full Insights & Analytics
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
