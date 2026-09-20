import React from 'react'
import { Search, Sparkles } from 'lucide-react'

export type SearchVariant = 'default' | 'mood'

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: SearchVariant
  icon?: React.ReactNode
}

export const SearchInput: React.FC<SearchInputProps> = ({
  variant = 'default',
  icon,
  placeholder,
  className = '',
  ...props
}) => {
  const isMood = variant === 'mood'
  const defaultIcon = isMood ? (
    <Sparkles size={18} aria-hidden="true" />
  ) : (
    <Search size={18} aria-hidden="true" />
  )
  const defaultPlaceholder = isMood
    ? 'Search mood, feeling, emotions...'
    : 'Search books, authors, topics...'

  return (
    <div className="input-search-wrapper">
      <span className="input-search-icon" aria-hidden="true">
        {icon || defaultIcon}
      </span>
      <input
        type="search"
        className={`input-search ${isMood ? 'input-mood-search' : ''} ${className}`}
        placeholder={placeholder || defaultPlaceholder}
        {...props}
      />
    </div>
  )
}

export default SearchInput
