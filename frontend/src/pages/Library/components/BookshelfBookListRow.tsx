import React from 'react'
import { Star, Edit3, Trash2 } from 'lucide-react'
import type { LibraryBook, ReadingStatus } from '../../../types/library'

export interface BookshelfBookListRowProps {
  book: LibraryBook
  onSelect: (book: LibraryBook) => void
  onUpdateStatus: (bookId: string, status: ReadingStatus) => void
  onEditProgress: (book: LibraryBook) => void
  onRemove: (bookId: string) => void
}

export const BookshelfBookListRow: React.FC<BookshelfBookListRowProps> = ({
  book,
  onSelect,
  onEditProgress,
  onRemove,
}) => {
  return (
    <div className="bookshelf-list-row" role="article">
      <div className="bookshelf-list-info" onClick={() => onSelect(book)}>
        <img
          src={book.coverUrl}
          alt={book.title}
          className="bookshelf-list-thumb"
          loading="lazy"
        />
        <div className="bookshelf-list-text">
          <h4 className="bookshelf-list-title">{book.title}</h4>
          <span className="bookshelf-list-author">{book.author}</span>
        </div>
      </div>

      <div className="bookshelf-list-meta">
        {book.status === 'want_to_read' && (
          <span className="status-badge-want-to-read" style={{ width: 'auto', padding: '4px 12px' }}>
            Want to Read
          </span>
        )}

        {book.status === 'reading' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '110px' }}>
            <span className="status-badge-reading" style={{ width: 'auto', padding: '3px 10px' }}>
              Reading • {book.progressPercent ?? 0}%
            </span>
            <div className="reading-progress-track">
              <div
                className="reading-progress-fill"
                style={{ width: `${Math.min(100, Math.max(0, book.progressPercent ?? 0))}%` }}
              />
            </div>
          </div>
        )}

        {book.status === 'completed' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="status-badge-finished">Finished</span>
            {book.rating && (
              <span className="status-rating-pill">
                <Star size={12} fill="currentColor" />
                <span>{book.rating.toFixed(1)}</span>
              </span>
            )}
          </div>
        )}

        <button
          type="button"
          className="btn-ghost"
          style={{ padding: '6px' }}
          onClick={() => onEditProgress(book)}
          aria-label={`Edit ${book.title}`}
        >
          <Edit3 size={15} />
        </button>

        <button
          type="button"
          className="btn-ghost"
          style={{ padding: '6px', color: 'var(--color-error)' }}
          onClick={() => onRemove(book.id)}
          aria-label={`Remove ${book.title}`}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  )
}

export default BookshelfBookListRow
