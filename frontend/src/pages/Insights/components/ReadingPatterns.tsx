import React from 'react'
import type { GenrePatternItem, MoodPatternItem } from '../../../types/insights'
import { PatternCard } from './PatternCard'

export interface ReadingPatternsProps {
  genres: GenrePatternItem[]
  moods: MoodPatternItem[]
}

export const ReadingPatterns: React.FC<ReadingPatternsProps> = ({ genres, moods }) => {
  const genreItems = genres.map((g) => ({
    id: g.id,
    label: g.genre,
    percentage: g.percentage,
    detailCount: g.bookCount,
    color: g.color || 'var(--color-primary)',
  }))

  const moodItems = moods.map((m) => ({
    id: m.id,
    label: m.mood,
    percentage: m.percentage,
    detailCount: m.count,
    color: m.color || 'var(--color-primary)',
  }))

  return (
    <section
      className="insights-section insights-patterns-section"
      aria-labelledby="reading-patterns-heading"
    >
      <div className="insights-section-header">
        <h2 id="reading-patterns-heading" className="insights-section-title">
          Your Reading Patterns
        </h2>
        <p className="insights-section-subtitle">
          The kinds of stories and moods you’ve been drawn to lately.
        </p>
      </div>

      <div className="insights-patterns-grid">
        <PatternCard
          title="Genres you read most"
          items={genreItems}
          emptyMessage="No genre data available for this time range."
        />

        <PatternCard
          title="Reading moods"
          items={moodItems}
          emptyMessage="No mood reflections recorded for this time range."
        />
      </div>
    </section>
  )
}

export default ReadingPatterns
