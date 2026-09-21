import React from 'react'
import { Check } from 'lucide-react'
import { GENRE_OPTIONS, type GenreName } from '../../types/genres'

export interface GenreSidebarProps {
  selectedGenre: GenreName
  onSelectGenre: (genre: GenreName) => void
  className?: string
}

export const GenreSidebar: React.FC<GenreSidebarProps> = ({
  selectedGenre,
  onSelectGenre,
  className = '',
}) => {
  return (
    <aside
      className={`genre-sidebar ${className}`}
      aria-label="Filter books by genre"
    >
      <h2 className="genre-sidebar-title">Genres</h2>
      <ul className="genre-sidebar-list" role="group" aria-label="Genre list">
        {GENRE_OPTIONS.map((genre) => {
          const isSelected = genre === selectedGenre
          return (
            <li key={genre} className="genre-sidebar-item">
              <button
                type="button"
                className={`genre-sidebar-row ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectGenre(genre)}
                aria-pressed={isSelected}
                aria-label={`Genre ${genre}${isSelected ? ', selected' : ''}`}
              >
                <span
                  className={`genre-custom-checkbox ${isSelected ? 'checked' : ''}`}
                  aria-hidden="true"
                >
                  {isSelected && <Check size={13} strokeWidth={3} />}
                </span>
                <span className="genre-sidebar-name">{genre}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default GenreSidebar
