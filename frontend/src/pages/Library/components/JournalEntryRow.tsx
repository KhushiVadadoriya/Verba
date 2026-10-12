import React from 'react'
import { ChevronRight, Star } from 'lucide-react'
import type { JournalEntry } from '../../../types/library'

export interface JournalEntryRowProps {
  entry: JournalEntry
  onClick: (entry: JournalEntry) => void
}

export const JournalEntryRow: React.FC<JournalEntryRowProps> = ({
  entry,
  onClick,
}) => {
  return (
    <div
      className="journal-entry-row"
      onClick={() => onClick(entry)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(entry)
        }
      }}
      aria-label={`${entry.type} on ${entry.bookTitle} from ${entry.date}`}
    >
      {/* Book Cover Thumbnail */}
      {entry.bookCoverUrl ? (
        <img
          src={entry.bookCoverUrl}
          alt={entry.bookTitle}
          className="journal-entry-cover-thumb"
          loading="lazy"
        />
      ) : (
        <div
          className="journal-entry-cover-thumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#eee7f0',
            fontSize: '10px',
            color: '#716e82',
          }}
        >
          Book
        </div>
      )}

      {/* Entry Type Badge */}
      <span className={`journal-entry-type-badge ${entry.type}`}>
        {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
      </span>

      {/* Date */}
      <span className="journal-entry-date">{entry.date}</span>

      {/* Divider */}
      <div className="journal-entry-divider" aria-hidden="true" />

      {/* Content Area */}
      <div className="journal-entry-content-box">
        <div className="journal-entry-title-line">
          <span className="journal-entry-book-title">{entry.bookTitle}</span>

          {/* Star Rating for Reviews */}
          {entry.type === 'review' && entry.rating && (
            <div className="journal-entry-stars" aria-label={`Rating: ${entry.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  fill={i < Math.round(entry.rating || 0) ? '#E59819' : 'none'}
                  stroke={i < Math.round(entry.rating || 0) ? '#E59819' : '#D2CAD8'}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Snippet */}
        <p className="journal-entry-snippet">{entry.content}</p>
      </div>

      {/* Right Chevron */}
      <div className="journal-entry-chevron" aria-hidden="true">
        <ChevronRight size={18} />
      </div>
    </div>
  )
}

export default JournalEntryRow
