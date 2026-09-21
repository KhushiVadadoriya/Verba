import React from 'react'
import { Check } from 'lucide-react'
import { GENRES } from '../../types/onboarding'

export interface GenreSelectorProps {
  selectedGenres: string[]
  onToggleGenre: (genre: string) => void
}

export const GenreSelector: React.FC<GenreSelectorProps> = ({
  selectedGenres,
  onToggleGenre,
}) => {
  return (
    <div
      className="genre-scroll-panel"
      role="group"
      aria-label="Select one or more preferred genres"
    >
      {GENRES.map((genre) => {
        const isSelected = selectedGenres.includes(genre)

        return (
          <button
            key={genre}
            type="button"
            role="checkbox"
            aria-checked={isSelected}
            className="genre-item-btn"
            onClick={() => onToggleGenre(genre)}
          >
            <div className="genre-checkbox" aria-hidden="true">
              {isSelected && (
                <Check
                  size={14}
                  strokeWidth={2.5}
                  color="var(--color-primary)"
                />
              )}
            </div>
            <span className="genre-label">{genre}</span>
          </button>
        )
      })}
    </div>
  )
}

export default GenreSelector
