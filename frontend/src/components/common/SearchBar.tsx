import React from 'react'
import { Search } from 'lucide-react'

export interface SearchBarProps {
  booksPlaceholder?: string
  moodPlaceholder?: string
  booksValue?: string
  moodValue?: string
  onBooksChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onMoodChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBooksSubmit?: (value: string) => void
  onMoodSubmit?: (value: string) => void
  className?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  booksPlaceholder = 'Search books, authors, topics...',
  moodPlaceholder = 'Search mood, feeling, emotions...',
  booksValue,
  moodValue,
  onBooksChange,
  onMoodChange,
  onBooksSubmit,
  onMoodSubmit,
  className = '',
}) => {
  const handleBooksKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onBooksSubmit) {
      onBooksSubmit(e.currentTarget.value)
    }
  }

  const handleMoodKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onMoodSubmit) {
      onMoodSubmit(e.currentTarget.value)
    }
  }

  return (
    <div className={`discover-search-container ${className}`} role="search">
      {/* Field 1: Books, authors, topics search */}
      <div className="discover-search-box">
        <span className="discover-search-icon" aria-hidden="true">
          <Search size={18} />
        </span>
        <input
          type="search"
          className="discover-search-input"
          placeholder={booksPlaceholder}
          value={booksValue}
          onChange={onBooksChange}
          onKeyDown={handleBooksKeyDown}
          aria-label={booksPlaceholder}
        />
      </div>

      {/* Field 2: Mood, feelings, emotions search */}
      <div className="discover-search-box">
        <span className="discover-search-icon" aria-hidden="true">
          <Search size={18} />
        </span>
        <input
          type="search"
          className="discover-search-input"
          placeholder={moodPlaceholder}
          value={moodValue}
          onChange={onMoodChange}
          onKeyDown={handleMoodKeyDown}
          aria-label={moodPlaceholder}
        />
      </div>
    </div>
  )
}

export default SearchBar
