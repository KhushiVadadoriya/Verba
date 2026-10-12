import React, { useState, useEffect } from 'react'
import type { TimeRangeOption, InsightsData } from '../../types/insights'
import { InsightsService } from '../../services/insights/insightsService'
import { ReadingAtGlance } from './components/ReadingAtGlance'
import { ReadingPatterns } from './components/ReadingPatterns'
import { InsightSummary } from './components/InsightSummary'
import { ReadingWrappedBanner } from './components/ReadingWrappedBanner'
import { InsightsEmptyState } from './components/InsightsEmptyState'

export interface InsightsPageProps {
  onNavigate?: (view: string) => void
  initialRange?: TimeRangeOption
  initialData?: InsightsData
}

export const InsightsPage: React.FC<InsightsPageProps> = ({
  onNavigate,
  initialRange = '3m',
  initialData,
}) => {
  const [selectedRange, setSelectedRange] = useState<TimeRangeOption>(initialRange)
  const [data, setData] = useState<InsightsData | null>(initialData || null)
  const [isLoading, setIsLoading] = useState<boolean>(!initialData)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchInsights = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await InsightsService.getInsights(selectedRange)
        if (isMounted) {
          setData(result)
        }
      } catch (err) {
        if (isMounted) {
          console.error('[Verba Insights] Failed to fetch insights:', err)
          setError('Unable to load reading insights at this time. Please try again.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchInsights()

    return () => {
      isMounted = false
    }
  }, [selectedRange])

  const handleRangeChange = (newRange: TimeRangeOption) => {
    setSelectedRange(newRange)
  }

  const handleDiscover = () => {
    if (onNavigate) {
      onNavigate('discover')
    } else {
      window.location.hash = 'discover'
    }
  }

  return (
    <div className="insights-page">
      {/* ====================================================================
          Page Introduction & Editorial Heading
          ==================================================================== */}
      <header className="insights-header">
        <span className="insights-eyebrow" aria-hidden="true">
          INSIGHTS
        </span>
        <h1 className="insights-main-title">
          Your Reading <span className="insights-heading-accent">Journey</span>
        </h1>
        <p className="insights-main-subtitle">
          A little more about the stories you’ve been reading.
        </p>
      </header>

      {/* Error State */}
      {error && (
        <div className="insights-error-card" role="alert">
          <p className="insights-error-message">{error}</p>
          <button
            type="button"
            className="insights-btn-secondary"
            onClick={() => setSelectedRange(selectedRange)}
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {data && (
        <>
          {data.overview.booksRead === 0 ? (
            <InsightsEmptyState onDiscoverClick={handleDiscover} />
          ) : (
            <div className={`insights-content ${isLoading ? 'insights-loading-fade' : ''}`}>
              {/* Section 1: Reading at a Glance */}
              <ReadingAtGlance
                stats={data.overview}
                selectedRange={selectedRange}
                onRangeChange={handleRangeChange}
                isLoading={isLoading}
              />

              {/* Section 2: Your Reading Patterns */}
              <ReadingPatterns
                genres={data.genrePatterns}
                moods={data.moodPatterns}
              />

              {/* Section 3: What Your Reading Says */}
              <InsightSummary insights={data.insights} />

              {/* Section 4: Your Reading Wrapped */}
              <ReadingWrappedBanner data={data.wrapped} />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default InsightsPage
