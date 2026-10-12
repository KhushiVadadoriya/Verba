import React, { useState, useEffect, useRef } from 'react'
import { MoreHorizontal, Star, Edit3, Trash2, CheckCircle2, BookOpen, Clock } from 'lucide-react'
import type { LibraryBook, ReadingStatus } from '../../../types/library'

export interface BookshelfBookCardProps {
  book: LibraryBook
  onSelect: (book: LibraryBook) => void
  onUpdateStatus: (bookId: string, status: ReadingStatus) => void
  onEditProgress: (book: LibraryBook) => void
  onRemove: (bookId: string) => void
}

export const BookshelfBookCard: React.FC<BookshelfBookCardProps> = ({
  book,
  onSelect,
  onUpdateStatus,
  onEditProgress,
  onRemove,
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  const handleCardClick = () => {
    if (!menuOpen) {
      onSelect(book)
    }
  }

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen((prev) => !prev)
  }

  return (
    <div
      className="bookshelf-card"
      ref={menuRef}
      role="article"
      aria-label={`${book.title} by ${book.author}`}
    >
      {/* Book Cover Container (2:3 Aspect Ratio) */}
      <div
        className="bookshelf-cover-wrapper"
        onClick={handleCardClick}
        tabIndex={0}
        role="button"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleCardClick()
          }
        }}
        aria-label={`View details for ${book.title}`}
      >
        {!imageError && book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`${book.title} cover`}
            className="bookshelf-cover-img"
            style={{
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 300ms ease-in-out',
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="bookshelf-cover-fallback">
            <span className="bookshelf-cover-fallback-title">{book.title}</span>
            <span
              style={{
                fontSize: '0.65rem',
                color: 'var(--color-text-secondary)',
                marginTop: '4px',
              }}
            >
              {book.author}
            </span>
          </div>
        )}

        {/* Tactile 3-Dots Overflow Menu Button */}
        <button
          type="button"
          className="bookshelf-card-menu-btn"
          onClick={handleMenuClick}
          aria-label={`Options for ${book.title}`}
          aria-haspopup="true"
          aria-expanded={menuOpen}
        >
          <MoreHorizontal size={14} />
        </button>

        {/* Overflow Dropdown Popup */}
        {menuOpen && (
          <div className="card-overflow-menu" role="menu" onClick={(e) => e.stopPropagation()}>
            {book.status !== 'want_to_read' && (
              <button
                type="button"
                className="card-overflow-menu-item"
                role="menuitem"
                onClick={() => {
                  onUpdateStatus(book.id, 'want_to_read')
                  setMenuOpen(false)
                }}
              >
                <Clock size={13} />
                <span>Mark Want to Read</span>
              </button>
            )}

            {book.status !== 'reading' && (
              <button
                type="button"
                className="card-overflow-menu-item"
                role="menuitem"
                onClick={() => {
                  onUpdateStatus(book.id, 'reading')
                  setMenuOpen(false)
                }}
              >
                <BookOpen size={13} />
                <span>Mark as Reading</span>
              </button>
            )}

            {book.status !== 'completed' && (
              <button
                type="button"
                className="card-overflow-menu-item"
                role="menuitem"
                onClick={() => {
                  onUpdateStatus(book.id, 'completed')
                  setMenuOpen(false)
                }}
              >
                <CheckCircle2 size={13} />
                <span>Mark as Finished</span>
              </button>
            )}

            <button
              type="button"
              className="card-overflow-menu-item"
              role="menuitem"
              onClick={() => {
                onEditProgress(book)
                setMenuOpen(false)
              }}
            >
              <Edit3 size={13} />
              <span>Edit Details / Progress</span>
            </button>

            <button
              type="button"
              className="card-overflow-menu-item danger"
              role="menuitem"
              onClick={() => {
                onRemove(book.id)
                setMenuOpen(false)
              }}
            >
              <Trash2 size={13} />
              <span>Remove from Library</span>
            </button>
          </div>
        )}
      </div>

      {/* Title & Author Metadata */}
      <div className="bookshelf-card-meta">
        <h4
          className="bookshelf-card-title"
          title={book.title}
          onClick={handleCardClick}
        >
          {book.title}
        </h4>
        <span className="bookshelf-card-author" title={book.author}>
          {book.author}
        </span>

        {/* Status Badge & Dynamic Indicators */}
        <div className="bookshelf-card-status-area">
          {book.status === 'want_to_read' && (
            <span className="status-badge-want-to-read">Want to Read</span>
          )}

          {book.status === 'reading' && (
            <>
              <span className="status-badge-reading">
                Reading • {book.progressPercent ?? 0}%
              </span>
              <div className="reading-progress-track">
                <div
                  className="reading-progress-fill"
                  style={{ width: `${Math.min(100, Math.max(0, book.progressPercent ?? 0))}%` }}
                />
              </div>
            </>
          )}

          {book.status === 'completed' && (
            <div className="status-badge-finished-row">
              <span className="status-badge-finished">Finished</span>
              {book.rating && (
                <span className="status-rating-pill">
                  <Star size={11} fill="currentColor" />
                  <span>{book.rating.toFixed(1)}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookshelfBookCard
