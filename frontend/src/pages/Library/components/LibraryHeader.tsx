import React from 'react'
import { Plus } from 'lucide-react'

export interface LibraryHeaderProps {
  onAddBook: () => void
}

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({ onAddBook }) => {
  return (
    <header className="library-header" aria-label="Library Header">
      <div className="library-header-text">
        <h1 className="library-header-title">My Library</h1>
        <p className="library-header-subtitle">
          Your personal collection of books, thoughts, and memories.
        </p>
      </div>

      <div className="library-header-actions">
        <button
          type="button"
          className="btn-add-book"
          onClick={onAddBook}
          aria-label="Add Book to Library"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Add Book</span>
        </button>
      </div>
    </header>
  )
}

export default LibraryHeader
