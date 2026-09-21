import React from 'react'

export interface GenreChipsProps {
  genres?: string[]
  selectedGenre?: string | null
  onSelectGenre?: (genre: string) => void
  className?: string
}

export const DEFAULT_GENRES = [
  'Fiction',
  'Fantasy',
  'Mystery',
  'Romance',
  'Psychology',
  'Contemporary',
  'Horror',
]

export const GenreChips: React.FC<GenreChipsProps> = ({
  genres = DEFAULT_GENRES,
  selectedGenre = null,
  onSelectGenre,
  className = '',
}) => {
  return (
    <div className={`genre-chips-container ${className}`} role="region" aria-label="Explore by genre">
      <div className="genre-chips-track">
        {genres.map((genre) => {
          const isSelected = selectedGenre === genre
          return (
            <button
              key={genre}
              type="button"
              className={`genre-chip ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectGenre?.(genre)}
              aria-pressed={isSelected}
            >
              {genre.toLowerCase() === 'horror' ? 'horror ...' : genre}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default GenreChips
