import React from 'react'

export interface PaginationProps {
  currentPage: number
  totalPages?: number
  onPageChange: (page: number) => void
  className?: string
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages = 12,
  onPageChange,
  className = '',
}) => {
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

  // Generate pagination items matching reference: 1, 2, 3, 4, 5, ..., 12
  const getPageItems = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages]
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ]
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ]
  }

  const pageItems = getPageItems()

  return (
    <nav
      className={`verba-pagination ${className}`}
      aria-label="Pagination Navigation"
    >
      {/* Previous Arrow Button */}
      <button
        type="button"
        className="verba-pagination-btn pagination-arrow"
        onClick={handlePrev}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        &larr;
      </button>

      {/* Page Numbers and Ellipses */}
      {pageItems.map((item, index) => {
        if (typeof item === 'string') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="verba-pagination-ellipsis"
              aria-hidden="true"
            >
              {item}
            </span>
          )
        }

        const isActive = item === currentPage
        return (
          <button
            key={item}
            type="button"
            className={`verba-pagination-btn pagination-number ${
              isActive ? 'active' : ''
            }`}
            onClick={() => onPageChange(item)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`Page ${item}`}
          >
            {item}
          </button>
        )
      })}

      {/* Next Arrow Button */}
      <button
        type="button"
        className="verba-pagination-btn pagination-arrow"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        &rarr;
      </button>
    </nav>
  )
}

export default Pagination
