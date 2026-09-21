import React from 'react'

export interface RecommendationPaginationProps {
  currentPage: number
  totalPages?: number
  onPageChange: (page: number) => void
  className?: string
}

export const RecommendationPagination: React.FC<RecommendationPaginationProps> = ({
  currentPage,
  totalPages = 5,
  onPageChange,
  className = '',
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <nav
      className={`recommendations-pagination ${className}`}
      aria-label="Recommendations pagination"
    >
      {/* Previous Arrow Button */}
      <button
        type="button"
        className="pagination-btn"
        onClick={handlePrev}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        &larr;
      </button>

      {/* Page Numbers */}
      {pages.map((page) => {
        const isActive = page === currentPage
        return (
          <button
            key={page}
            type="button"
            className={`pagination-btn ${isActive ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        )
      })}

      {/* Next Arrow Button */}
      <button
        type="button"
        className="pagination-btn"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        &rarr;
      </button>
    </nav>
  )
}

export default RecommendationPagination
