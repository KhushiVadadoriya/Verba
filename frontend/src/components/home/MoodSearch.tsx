import React, { useState } from 'react'

export interface MoodSearchProps {
  onSearch?: (query: string) => void
  className?: string
  placeholder?: string
}

export const MoodSearch: React.FC<MoodSearchProps> = ({
  onSearch,
  className = '',
  placeholder = "e.g. I want something comforting and emotional, set in a small seaside town...",
}) => {
  const [query, setQuery] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  /**
   * Clearly isolated handler for AI book recommendations.
   * In future phases, this will connect:
   * User input -> AI recommendation service -> Interpret mood/intent -> Recommended books
   */
  const handleMoodSearch = (searchQuery: string) => {
    if (onSearch) {
      onSearch(searchQuery)
    } else {
      // Future AI integration hook
      console.info('[Verba AI Mood Search] Query ready for AI recommendation service:', searchQuery)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()

    if (!trimmed) {
      setValidationError('Please share a mood, theme, or feeling to find your next read.')
      return
    }

    setValidationError(null)
    handleMoodSearch(trimmed)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter without Shift; Shift+Enter creates a new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value)
    if (validationError) {
      setValidationError(null)
    }
  }

  return (
    <section
      className={`home-mood-card ${className}`}
      aria-labelledby="mood-search-heading"
    >
      <div className="home-mood-inner">
        <h2 id="mood-search-heading" className="home-mood-title">
          WHAT ARE YOU IN THE MOOD FOR?
        </h2>
        <p className="home-mood-subtitle">
          Find a book that meets you where you are.
        </p>

        <form className="home-mood-form" onSubmit={handleSubmit} noValidate>
          <div className="home-mood-input-wrapper">
            <textarea
              id="mood-search-input"
              className={`home-mood-textarea ${validationError ? 'has-error' : ''}`}
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={2}
              aria-label="Describe what you want to read"
              aria-describedby={validationError ? 'mood-search-error' : undefined}
            />
            {validationError && (
              <p
                id="mood-search-error"
                className="home-mood-validation"
                role="alert"
              >
                {validationError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="home-mood-submit-btn"
            aria-label="Find my next read"
          >
            <span>Find my next read</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </form>
      </div>
    </section>
  )
}

export default MoodSearch
