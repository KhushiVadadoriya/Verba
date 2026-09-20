import React from 'react'

export interface BookItem {
  id: string
  title: string
  author: string
  moodTag?: string
  accentColor: string
  bgGradient: string
  textColor?: string
  subtitle?: string
  illustration?: React.ReactNode
}

export interface BookCoverProps {
  book: BookItem
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  showMoodTag?: boolean
  className?: string
  tabIndex?: number
  isDuplicate?: boolean
}

export const BookCover: React.FC<BookCoverProps> = ({
  book,
  size = 'md',
  onClick,
  showMoodTag = false,
  className = '',
  tabIndex,
  isDuplicate = false,
}) => {
  const widthMap = {
    sm: '140px',
    md: '185px',
    lg: '220px',
  }

  const width = widthMap[size]

  return (
    <div
      className={`book-card ${className}`}
      onClick={onClick}
      style={{
        width,
        flexShrink: 0,
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: 'var(--radius-md)',
        transition: 'all 250ms var(--ease-default)',
      }}
      role={onClick && !isDuplicate ? 'button' : undefined}
      tabIndex={isDuplicate ? -1 : (tabIndex ?? (onClick ? 0 : undefined))}
      aria-hidden={isDuplicate ? true : undefined}
      aria-label={isDuplicate ? undefined : `${book.title} by ${book.author}`}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {/* Physical Book Cover Surface with 3D Spine and Bevel */}
      <div
        className="book-cover"
        style={{
          aspectRatio: '2 / 3',
          background: book.bgGradient,
          color: book.textColor || '#ffffff',
          borderRadius: 'var(--radius-md)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'var(--space-4)',
          boxShadow:
            '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08), inset -2px 0 6px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Realistic Book Spine Shadow Highlight */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '12px',
            background:
              'linear-gradient(90deg, rgba(255, 255, 255, 0.25) 0%, rgba(0, 0, 0, 0.08) 50%, rgba(255, 255, 255, 0) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Book Header / Author */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span
            style={{
              display: 'block',
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              opacity: 0.9,
              fontWeight: 'var(--weight-semibold)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {book.author}
          </span>
          {book.subtitle && (
            <span
              style={{
                display: 'block',
                fontSize: '0.55rem',
                opacity: 0.75,
                marginTop: '2px',
                fontStyle: 'italic',
                fontFamily: 'var(--font-serif)',
              }}
            >
              {book.subtitle}
            </span>
          )}
        </div>

        {/* Cover Illustration Artwork (if present) */}
        {book.illustration ? (
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 'var(--space-2) 0',
            }}
          >
            {book.illustration}
          </div>
        ) : (
          <div style={{ flex: 1 }} />
        )}

        {/* Book Title */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: size === 'sm' ? '1.05rem' : '1.25rem',
              fontWeight: 'var(--weight-bold)',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
              color: 'inherit',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            }}
          >
            {book.title}
          </h3>
        </div>

        {/* Subtle Gloss / Lighting Overlay */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.1) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Optional Mood / Category Tag Below Book */}
      {showMoodTag && book.moodTag && (
        <div style={{ marginTop: 'var(--space-2)', textAlign: 'center' }}>
          <span
            className="chip"
            style={{
              fontSize: '0.7rem',
              padding: '0.15rem 0.5rem',
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {book.moodTag}
          </span>
        </div>
      )}
    </div>
  )
}

export default BookCover
