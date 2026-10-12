import React from 'react'
import { Heart, Sprout, Sun, Sparkles, Compass, BookOpen } from 'lucide-react'
import type { ReadingInsightItem } from '../../../types/insights'

export interface InsightSummaryProps {
  insights: ReadingInsightItem[]
}

const renderIcon = (type: ReadingInsightItem['iconType']) => {
  switch (type) {
    case 'heart':
      return <Heart size={20} strokeWidth={1.75} />
    case 'sprout':
      return <Sprout size={20} strokeWidth={1.75} />
    case 'sun':
      return <Sun size={20} strokeWidth={1.75} />
    case 'sparkles':
      return <Sparkles size={20} strokeWidth={1.75} />
    case 'compass':
      return <Compass size={20} strokeWidth={1.75} />
    default:
      return <BookOpen size={20} strokeWidth={1.75} />
  }
}

/**
 * Highlights specific phrase in statement or description with Verba berry accent
 */
const renderHighlightedText = (fullText: string, highlight?: string) => {
  if (!highlight || !fullText.includes(highlight)) {
    return fullText
  }

  const parts = fullText.split(highlight)
  return (
    <>
      {parts[0]}
      <span className="insights-text-highlight">{highlight}</span>
      {parts.slice(1).join(highlight)}
    </>
  )
}

export const InsightSummary: React.FC<InsightSummaryProps> = ({ insights }) => {
  return (
    <section
      className="insights-section insights-summary-section"
      aria-labelledby="what-reading-says-heading"
    >
      <div className="insights-summary-panel">
        <div className="insights-summary-header">
          <h2 id="what-reading-says-heading" className="insights-summary-title">
            What Your Reading Says
          </h2>
          <p className="insights-summary-subtitle">
            A closer look at the patterns behind your reading.
          </p>
        </div>

        {insights.length === 0 ? (
          <div className="insights-summary-fallback">
            <p className="insights-summary-fallback-text">
              Keep reading and reflecting. Your personalized insights will appear as your reading
              history grows.
            </p>
          </div>
        ) : (
          <div className="insights-cards-row">
            {insights.map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && <div className="insights-card-divider" aria-hidden="true" />}
                <article className="insights-card">
                  <div className="insights-card-icon-bubble" aria-hidden="true">
                    {renderIcon(item.iconType)}
                  </div>

                  <h3 className="insights-card-statement">
                    {renderHighlightedText(item.statement, item.statementHighlight)}
                  </h3>

                  <p className="insights-card-description">
                    {renderHighlightedText(item.description, item.descriptionHighlight)}
                  </p>
                </article>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default InsightSummary
