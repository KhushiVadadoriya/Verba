import React from 'react'
import { ChevronDown } from 'lucide-react'
import { SORT_OPTIONS, type SortOption } from '../../types/genres'

export interface SortSelectProps {
  value: SortOption
  onChange: (sort: SortOption) => void
  className?: string
}

export const SortSelect: React.FC<SortSelectProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`sort-select-container ${className}`}>
      <label htmlFor="genre-sort-select" className="sort-select-label">
        Sort by:
      </label>
      <div className="sort-select-wrapper">
        <select
          id="genre-sort-select"
          className="sort-select-native"
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          aria-label="Sort books by"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="sort-select-custom-pill" aria-hidden="true">
          <span>{value}</span>
          <ChevronDown size={15} className="sort-select-chevron" />
        </div>
      </div>
    </div>
  )
}

export default SortSelect
