import React from 'react'

export interface PatternRowItem {
  id: string
  label: string
  percentage: number
  detailCount?: number
  color?: string
}

export interface PatternCardProps {
  title: string
  items: PatternRowItem[]
  emptyMessage?: string
}

export const PatternCard: React.FC<PatternCardProps> = ({
  title,
  items,
  emptyMessage = 'No patterns recorded yet for this period.',
}) => {
  return (
    <div className="insights-pattern-card">
      <h3 className="insights-pattern-card-title">{title}</h3>

      {items.length === 0 ? (
        <p className="insights-pattern-empty">{emptyMessage}</p>
      ) : (
        <div className="insights-pattern-list" role="list">
          {items.map((item) => (
            <div key={item.id} className="insights-pattern-row" role="listitem">
              <span className="insights-pattern-label">{item.label}</span>

              <div
                className="insights-pattern-bar-track"
                role="progressbar"
                aria-valuenow={item.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${item.label}: ${item.percentage}%`}
              >
                <div
                  className="insights-pattern-bar-fill"
                  style={{
                    width: `${Math.min(100, Math.max(0, item.percentage))}%`,
                    backgroundColor: item.color || 'var(--color-primary)',
                  }}
                />
              </div>

              <span className="insights-pattern-percentage">{item.percentage}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PatternCard
