import React, { useEffect, useRef } from 'react'
import type { ReadingStatus } from '../../../types/library'

export interface LibraryFilterState {
  status: 'all' | ReadingStatus
  genre: string
  minRating: number
}

export interface LibraryFilterPopoverProps {
  isOpen: boolean
  onClose: () => void
  filters: LibraryFilterState
  availableGenres: string[]
  onFilterChange: (filters: LibraryFilterState) => void
  onReset: () => void
}

export const LibraryFilterPopover: React.FC<LibraryFilterPopoverProps> = ({
  isOpen,
  onClose,
  filters,
  availableGenres,
  onFilterChange,
  onReset,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={popoverRef}
      className="library-filter-popover"
      role="dialog"
      aria-label="Library Filters"
    >
      <h3 className="library-filter-popover-title">Filter Bookshelf</h3>

      {/* Reading Status Filter */}
      <div className="library-filter-group">
        <label htmlFor="filter-status-select" className="library-filter-label">
          Reading Status
        </label>
        <select
          id="filter-status-select"
          className="library-filter-select"
          value={filters.status}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              status: e.target.value as 'all' | ReadingStatus,
            })
          }
        >
          <option value="all">All Statuses</option>
          <option value="want_to_read">Want to Read</option>
          <option value="reading">Currently Reading</option>
          <option value="completed">Finished</option>
        </select>
      </div>

      {/* Genre Filter */}
      <div className="library-filter-group">
        <label htmlFor="filter-genre-select" className="library-filter-label">
          Genre
        </label>
        <select
          id="filter-genre-select"
          className="library-filter-select"
          value={filters.genre}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              genre: e.target.value,
            })
          }
        >
          <option value="all">All Genres</option>
          {availableGenres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* Minimum Rating */}
      <div className="library-filter-group">
        <label htmlFor="filter-rating-select" className="library-filter-label">
          Minimum Rating
        </label>
        <select
          id="filter-rating-select"
          className="library-filter-select"
          value={filters.minRating}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              minRating: Number(e.target.value),
            })
          }
        >
          <option value={0}>Any Rating</option>
          <option value={4}>4.0+ Stars</option>
          <option value={4.5}>4.5+ Stars</option>
          <option value={5}>5.0 Stars Only</option>
        </select>
      </div>

      {/* Actions */}
      <div className="library-filter-actions">
        <button
          type="button"
          className="btn-ghost"
          style={{ fontSize: 'var(--text-xs)', padding: '4px 10px' }}
          onClick={() => {
            onReset()
            onClose()
          }}
        >
          Reset
        </button>
        <button
          type="button"
          className="btn-primary"
          style={{
            fontSize: 'var(--text-xs)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-md)',
          }}
          onClick={onClose}
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}

export default LibraryFilterPopover
