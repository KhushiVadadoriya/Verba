import React from 'react'
import type { RecommendationBook } from '../../types/recommendations'
import { RecommendationCard } from './RecommendationCard'

export interface RecommendationGridProps {
  books: RecommendationBook[]
  selectedBookId?: string
  onSelectBook?: (book: RecommendationBook) => void
  className?: string
}

export const RecommendationGrid: React.FC<RecommendationGridProps> = ({
  books,
  selectedBookId,
  onSelectBook,
  className = '',
}) => {
  return (
    <div
      className={`more-for-you-grid-container ${className}`}
      role="region"
      aria-label="More recommended books"
    >
      <div className="more-for-you-grid">
        {books.map((book) => (
          <RecommendationCard
            key={book.id}
            book={book}
            isSelected={book.id === selectedBookId}
            onSelect={onSelectBook}
          />
        ))}
      </div>
    </div>
  )
}

export default RecommendationGrid
