import React, { useState, useEffect } from 'react'
import { X, Save, Trash2 } from 'lucide-react'
import type { LibraryBook, ReadingStatus } from '../../../types/library'

export interface EditBookModalProps {
  book: LibraryBook | null
  isOpen: boolean
  onClose: () => void
  onSave: (bookId: string, updates: Partial<LibraryBook>) => void
  onRemove: (bookId: string) => void
}

export const EditBookModal: React.FC<EditBookModalProps> = ({
  book,
  isOpen,
  onClose,
  onSave,
  onRemove,
}) => {
  if (!isOpen || !book) return null

  return (
    <EditBookModalContent
      key={book.id}
      book={book}
      onClose={onClose}
      onSave={onSave}
      onRemove={onRemove}
    />
  )
}

interface EditBookModalContentProps {
  book: LibraryBook
  onClose: () => void
  onSave: (bookId: string, updates: Partial<LibraryBook>) => void
  onRemove: (bookId: string) => void
}

const EditBookModalContent: React.FC<EditBookModalContentProps> = ({
  book,
  onClose,
  onSave,
  onRemove,
}) => {
  const [status, setStatus] = useState<ReadingStatus>(book.status)
  const [progressPercent, setProgressPercent] = useState<number>(book.progressPercent ?? 0)
  const [rating, setRating] = useState<number>(book.rating ?? 4.5)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(book.id, {
      status,
      progressPercent: status === 'reading' ? progressPercent : status === 'completed' ? 100 : 0,
      rating: status === 'completed' ? rating : undefined,
    })
    onClose()
  }

  return (
    <div
      className="library-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-book-modal-title"
      onClick={onClose}
    >
      <div className="library-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="library-modal-close"
          onClick={onClose}
          aria-label="Close edit book modal"
        >
          <X size={20} />
        </button>

        <div className="library-modal-header">
          <h2 id="edit-book-modal-title" className="library-modal-title">
            Edit Reading Progress
          </h2>
          <p className="library-modal-subtitle">
            Update status and reading milestones for <strong>{book.title}</strong>
          </p>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Status Selection */}
          <div className="library-form-group">
            <label htmlFor="edit-status-select" className="library-form-label">
              Reading Status
            </label>
            <select
              id="edit-status-select"
              className="library-form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as ReadingStatus)}
            >
              <option value="want_to_read">Want to Read</option>
              <option value="reading">Currently Reading</option>
              <option value="completed">Finished</option>
            </select>
          </div>

          {/* Reading Progress */}
          {status === 'reading' && (
            <div className="library-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="library-form-label">Progress</label>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)' }}>
                  {progressPercent}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progressPercent}
                onChange={(e) => setProgressPercent(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-primary)' }}
              />
            </div>
          )}

          {/* Rating */}
          {status === 'completed' && (
            <div className="library-form-group">
              <label htmlFor="edit-rating-select" className="library-form-label">
                Rating
              </label>
              <select
                id="edit-rating-select"
                className="library-form-select"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={5}>5.0 Stars (Masterpiece)</option>
                <option value={4.5}>4.5 Stars (Exceptional)</option>
                <option value={4}>4.0 Stars (Great)</option>
                <option value={3.5}>3.5 Stars (Good)</option>
                <option value={3}>3.0 Stars (Average)</option>
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="library-modal-footer" style={{ justifyContent: 'space-between' }}>
            <button
              type="button"
              className="btn-ghost"
              style={{ color: 'var(--color-error)' }}
              onClick={() => {
                onRemove(book.id)
                onClose()
              }}
            >
              <Trash2 size={16} />
              <span>Remove</span>
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-add-book">
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditBookModal
