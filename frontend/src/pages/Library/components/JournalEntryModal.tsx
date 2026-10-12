import React, { useState, useEffect } from 'react'
import { X, PenTool, Star } from 'lucide-react'
import type {
  LibraryBook,
  JournalEntry,
  JournalEntryType,
} from '../../../types/library'

export interface JournalEntryModalProps {
  isOpen: boolean
  onClose: () => void
  books: LibraryBook[]
  onSaveEntry: (
    entry: Omit<JournalEntry, 'id' | 'createdAt' | 'date'> & { date?: string }
  ) => void
}

export const JournalEntryModal: React.FC<JournalEntryModalProps> = ({
  isOpen,
  onClose,
  books,
  onSaveEntry,
}) => {
  const [selectedBookId, setSelectedBookId] = useState<string>(
    books[0]?.id || ''
  )
  const [type, setType] = useState<JournalEntryType>('reflection')
  const [content, setContent] = useState('')
  const [rating, setRating] = useState<number>(5)
  const [isSubmitting, setIsSubmitting] = useState(false)


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const selectedBook = books.find((b) => b.id === selectedBookId) || books[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !selectedBook) return

    setIsSubmitting(true)
    onSaveEntry({
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      bookAuthor: selectedBook.author,
      bookCoverUrl: selectedBook.coverUrl,
      type,
      content: content.trim(),
      rating: type === 'review' ? rating : undefined,
    })
    setIsSubmitting(false)
    setContent('')
    onClose()
  }

  return (
    <div
      className="library-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-journal-entry-title"
      onClick={onClose}
    >
      <div className="library-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="library-modal-close"
          onClick={onClose}
          aria-label="Close journal modal"
        >
          <X size={20} />
        </button>

        <div className="library-modal-header">
          <h2 id="new-journal-entry-title" className="library-modal-title">
            New Journal Entry
          </h2>
          <p className="library-modal-subtitle">
            Pen your reflections, notes, reviews, or memorable passages.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Select Book */}
          <div className="library-form-group">
            <label htmlFor="journal-book-select" className="library-form-label">
              Select Book
            </label>
            <select
              id="journal-book-select"
              className="library-form-select"
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
            >
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} — {b.author}
                </option>
              ))}
            </select>
          </div>

          {/* Entry Type */}
          <div className="library-form-group">
            <label htmlFor="journal-type-select" className="library-form-label">
              Entry Type
            </label>
            <select
              id="journal-type-select"
              className="library-form-select"
              value={type}
              onChange={(e) => setType(e.target.value as JournalEntryType)}
            >
              <option value="reflection">Reflection (Emotional resonance & thoughts)</option>
              <option value="review">Review (Critical impressions & rating)</option>
              <option value="note">Note (Key takeaways & ideas)</option>
              <option value="highlight">Highlight (Favorite excerpt or quote)</option>
            </select>
          </div>

          {/* Star Rating if Review */}
          {type === 'review' && (
            <div className="library-form-group">
              <label className="library-form-label">Rating</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRating(starVal)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: starVal <= rating ? '#E59819' : '#D2CAD8',
                    }}
                    aria-label={`${starVal} stars`}
                  >
                    <Star
                      size={24}
                      fill={starVal <= rating ? '#E59819' : 'none'}
                      stroke="currentColor"
                    />
                  </button>
                ))}
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#5A5868', marginLeft: '6px' }}>
                  {rating}.0 / 5
                </span>
              </div>
            </div>
          )}

          {/* Content Textarea */}
          <div className="library-form-group">
            <label htmlFor="journal-content-input" className="library-form-label">
              Your Entry
            </label>
            <textarea
              id="journal-content-input"
              className="library-form-textarea"
              placeholder={
                type === 'review'
                  ? 'What captivated or challenged you about this book?'
                  : type === 'reflection'
                    ? 'What did this book make you think, feel, or remember?'
                    : type === 'highlight'
                      ? '“Type or paste your memorable quote here...”'
                      : 'Record your takeaway, idea, or concept...'
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {/* Footer */}
          <div className="library-modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-new-entry"
              disabled={isSubmitting || !content.trim()}
            >
              <PenTool size={16} />
              <span>{isSubmitting ? 'Saving...' : 'Save Entry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default JournalEntryModal
