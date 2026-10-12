import React, { useEffect } from 'react'
import { X, Trash2, Star, Calendar } from 'lucide-react'
import type { JournalEntry } from '../../../types/library'

export interface JournalDetailModalProps {
  entry: JournalEntry | null
  isOpen: boolean
  onClose: () => void
  onDelete: (id: string) => void
}

export const JournalDetailModal: React.FC<JournalDetailModalProps> = ({
  entry,
  isOpen,
  onClose,
  onDelete,
}) => {
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

  if (!isOpen || !entry) return null

  return (
    <div
      className="library-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="journal-detail-title"
      onClick={onClose}
    >
      <div className="library-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="library-modal-close"
          onClick={onClose}
          aria-label="Close entry details"
        >
          <X size={20} />
        </button>

        {/* Book Header Summary */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <img
            src={entry.bookCoverUrl}
            alt={entry.bookTitle}
            style={{ width: '48px', height: '68px', objectFit: 'cover', borderRadius: '4px' }}
          />
          <div>
            <span className={`journal-entry-type-badge ${entry.type}`}>
              {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
            </span>
            <h3
              id="journal-detail-title"
              style={{
                fontFamily: 'var(--font-roman, var(--font-serif))',
                fontSize: '1.25rem',
                margin: '6px 0 2px 0',
                color: 'var(--color-text-primary)',
              }}
            >
              {entry.bookTitle}
            </h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>
              by {entry.bookAuthor}
            </p>
          </div>
        </div>

        {/* Date and Rating Info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            backgroundColor: 'var(--color-surface-muted)',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)' }}>
            <Calendar size={14} />
            <span>{entry.date}</span>
          </div>

          {entry.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#E59819' }}>
              <Star size={14} fill="currentColor" />
              <span style={{ fontWeight: 600 }}>{entry.rating.toFixed(1)} / 5</span>
            </div>
          )}
        </div>

        {/* Body Text */}
        <div
          style={{
            padding: '16px',
            backgroundColor: '#faf8fa',
            border: '1px solid #f0dfea',
            borderRadius: 'var(--radius-md)',
            fontFamily: entry.type === 'reflection' || entry.type === 'highlight' ? 'var(--font-serif)' : 'var(--font-sans)',
            fontSize: '1rem',
            lineHeight: 1.6,
            color: 'var(--color-text-primary)',
            fontStyle: entry.type === 'highlight' ? 'italic' : 'normal',
          }}
        >
          {entry.content}
        </div>

        {/* Footer Actions */}
        <div className="library-modal-footer" style={{ justifyContent: 'space-between' }}>
          <button
            type="button"
            className="btn-ghost"
            style={{ color: 'var(--color-error)' }}
            onClick={() => {
              onDelete(entry.id)
              onClose()
            }}
          >
            <Trash2 size={16} />
            <span>Delete Entry</span>
          </button>

          <button type="button" className="btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default JournalDetailModal
