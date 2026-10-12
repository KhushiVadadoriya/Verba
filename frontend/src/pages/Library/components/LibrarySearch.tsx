import React, { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import {
  LibraryFilterPopover,
  type LibraryFilterState,
} from './LibraryFilterPopover'

export interface LibrarySearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: LibraryFilterState
  availableGenres: string[]
  onFilterChange: (filters: LibraryFilterState) => void
  onResetFilters: () => void
}

export const LibrarySearch: React.FC<LibrarySearchProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  availableGenres,
  onFilterChange,
  onResetFilters,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const hasActiveFilters =
    filters.status !== 'all' || filters.genre !== 'all' || filters.minRating > 0

  return (
    <div className="library-search-bar-row">
      <div className="library-search-input-wrapper">
        <span className="library-search-icon" aria-hidden="true">
          <Search size={18} />
        </span>
        <input
          type="text"
          className="library-search-input"
          placeholder="Search books, authors, or your notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search library"
        />
        {searchQuery && (
          <button
            type="button"
            className="library-search-clear-btn"
            onClick={() => onSearchChange('')}
            aria-label="Clear search query"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <button
        type="button"
        className={`library-filter-trigger-btn ${hasActiveFilters ? 'active' : ''}`}
        onClick={() => setIsFilterOpen((prev) => !prev)}
        aria-label="Toggle Library Filters"
        aria-expanded={isFilterOpen}
      >
        <SlidersHorizontal size={18} />
        {hasActiveFilters && <span className="library-filter-indicator" />}
      </button>

      <LibraryFilterPopover
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        availableGenres={availableGenres}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />
    </div>
  )
}

export default LibrarySearch
