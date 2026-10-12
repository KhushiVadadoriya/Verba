import React, { useEffect } from 'react'
import { X, Sparkles, BookOpen, Star, Flame, Trophy, Share2 } from 'lucide-react'
import type { ReadingWrappedData } from '../../../types/insights'

export interface WrappedModalProps {
  isOpen: boolean
  onClose: () => void
  data: ReadingWrappedData
}

export const WrappedModal: React.FC<WrappedModalProps> = ({ isOpen, onClose, data }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
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

  return (
    <div
      className="insights-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wrapped-modal-title"
      onClick={onClose}
    >
      <div
        className="insights-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="insights-modal-close"
          onClick={onClose}
          aria-label="Close Reading Wrapped"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="insights-modal-header">
          <div className="insights-modal-badge">
            <Sparkles size={14} />
            <span>ANNUAL RETROSPECTIVE</span>
          </div>
          <h2 id="wrapped-modal-title" className="insights-modal-title">
            Your {data.year} Reading Wrapped
          </h2>
          <p className="insights-modal-subtitle">
            A celebration of every story, mood, and quiet literary hour.
          </p>
        </div>

        {/* Stats Highlight Grid */}
        <div className="insights-wrapped-stats-grid">
          <div className="insights-wrapped-stat-card">
            <div className="insights-wrapped-stat-icon">
              <BookOpen size={20} />
            </div>
            <span className="insights-wrapped-stat-value">{data.totalBooksRead}</span>
            <span className="insights-wrapped-stat-label">Books Completed</span>
          </div>

          <div className="insights-wrapped-stat-card">
            <div className="insights-wrapped-stat-icon">
              <Star size={20} />
            </div>
            <span className="insights-wrapped-stat-value">{data.avgRating.toFixed(1)} ★</span>
            <span className="insights-wrapped-stat-label">Avg. Book Rating</span>
          </div>

          <div className="insights-wrapped-stat-card">
            <div className="insights-wrapped-stat-icon">
              <Flame size={20} />
            </div>
            <span className="insights-wrapped-stat-value">{data.readingStreakDays} days</span>
            <span className="insights-wrapped-stat-label">Longest Streak</span>
          </div>

          <div className="insights-wrapped-stat-card">
            <div className="insights-wrapped-stat-icon">
              <Trophy size={20} />
            </div>
            <span className="insights-wrapped-stat-value">{data.topMood}</span>
            <span className="insights-wrapped-stat-label">Dominant Mood</span>
          </div>
        </div>

        {/* Favorite Literary Quote */}
        {data.favoriteQuote && (
          <div className="insights-wrapped-quote-box">
            <p className="insights-wrapped-quote-text">{data.favoriteQuote}</p>
            <span className="insights-wrapped-quote-author">— Highlighted in your reflections</span>
          </div>
        )}

        {/* Top Books Showcase Shelf */}
        <div className="insights-wrapped-showcase">
          <h3 className="insights-wrapped-showcase-title">Your Year in Books</h3>
          <div className="insights-wrapped-books-row">
            {data.showcaseBooks.slice(0, 4).map((book) => (
              <div key={book.id} className="insights-wrapped-book-item">
                <div className="insights-wrapped-book-cover">
                  <img src={book.coverUrl} alt={book.title} />
                </div>
                <div className="insights-wrapped-book-info">
                  <span className="insights-wrapped-book-title">{book.title}</span>
                  <span className="insights-wrapped-book-author">{book.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="insights-modal-actions">
          <button
            type="button"
            className="insights-btn-secondary"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `My Verba ${data.year} Reading Wrapped`,
                  text: `I completed ${data.totalBooksRead} books this year on Verba with an average rating of ${data.avgRating}!`,
                }).catch(() => {})
              } else {
                navigator.clipboard?.writeText(
                  `I read ${data.totalBooksRead} books on Verba in ${data.year}! #VerbaReadingWrapped`
                )
                alert('Wrapped summary copied to clipboard!')
              }
            }}
          >
            <Share2 size={16} />
            Share Wrapped
          </button>

          <button type="button" className="insights-btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default WrappedModal
