import React from 'react'
import { Search } from 'lucide-react'

export interface GenreSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const GenreSearch: React.FC<GenreSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search within this genre...',
  className = '',
}) => {
  return (
    <div className={`genre-search-wrapper ${className}`} role="search">
      <span className="genre-search-icon" aria-hidden="true">
        <Search size={17} />
      </span>
      <input
        type="search"
        className="genre-search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  )
}

export default GenreSearch
