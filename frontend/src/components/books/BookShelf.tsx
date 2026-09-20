import React from 'react'
import { BookCover, type BookItem } from './BookCover'

export type { BookItem }

export const SAMPLE_BOOKS: BookItem[] = [
  {
    id: 'renovation',
    title: 'The Renovation',
    author: 'Kenan Orhan',
    subtitle: 'A Novel of Memory',
    moodTag: 'Thought-Provoking',
    accentColor: '#16817A',
    bgGradient: 'linear-gradient(175deg, #1B998B 0%, #16697A 60%, #0F4C5C 100%)',
    textColor: '#FFFFFF',
    illustration: (
      <svg width="100" height="110" viewBox="0 0 100 110" fill="none">
        {/* Arched Window with Sunset Rays */}
        <defs>
          <linearGradient id="sunGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FB8B24" />
            <stop offset="50%" stopColor="#E36414" />
            <stop offset="100%" stopColor="#F48C06" />
          </linearGradient>
        </defs>
        <path
          d="M20 100 V 45 A 30 30 0 0 1 80 45 V 100"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M28 100 V 48 A 22 22 0 0 1 72 48 V 100"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="50" cy="55" r="18" fill="url(#sunGrad)" opacity="0.9" />
        <line x1="36" y1="100" x2="36" y2="48" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <line x1="50" y1="100" x2="50" y2="45" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <line x1="64" y1="100" x2="64" y2="48" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'book-lovers',
    title: 'Book Lovers',
    author: 'Emily Henry',
    subtitle: '#1 NYT Bestseller',
    moodTag: 'Comforting & Romantic',
    accentColor: '#F7B801',
    bgGradient: 'linear-gradient(180deg, #F9DC5C 0%, #F4A261 40%, #E76F51 75%, #9F3E76 100%)',
    textColor: '#FFFFFF',
    illustration: (
      <svg width="100" height="90" viewBox="0 0 100 90" fill="none">
        {/* Layered Mountain Sunset & Rowboat */}
        <polygon points="10,65 35,35 60,65" fill="#E63946" opacity="0.6" />
        <polygon points="40,65 65,28 90,65" fill="#9F3E76" opacity="0.75" />
        {/* Water Surface */}
        <path d="M0 65 Q 25 60 50 65 T 100 65 L 100 90 L 0 90 Z" fill="#48479E" opacity="0.85" />
        {/* Little Rowboat */}
        <path d="M35 68 L 65 68 L 58 75 L 42 75 Z" fill="#FFFFFF" />
        <circle cx="48" cy="64" r="3" fill="#FFFFFF" />
        <circle cx="54" cy="64" r="3" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: 'blue-sisters',
    title: 'Blue Sisters',
    author: 'Coco Mellors',
    subtitle: 'Sunday Times Bestseller',
    moodTag: 'Emotional & Deep',
    accentColor: '#4A6FA5',
    bgGradient: 'linear-gradient(165deg, #FAF7F2 0%, #E8EEF5 45%, #CBD8E8 100%)',
    textColor: '#2E384D',
    illustration: (
      <svg width="100" height="110" viewBox="0 0 100 110" fill="none">
        {/* Stylized Painted Face Silhouette */}
        <ellipse cx="50" cy="55" rx="30" ry="38" fill="#F0E5D8" stroke="#D1BEA8" strokeWidth="1.5" />
        {/* Gentle Eyes in Periwinkle Cobalt */}
        <path d="M36 50 Q 42 46 48 50" stroke="#48479E" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="42" cy="52" r="2.5" fill="#48479E" />
        <path d="M54 50 Q 60 46 66 50" stroke="#48479E" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="60" cy="52" r="2.5" fill="#48479E" />
        {/* Soft Watercolor Blush & Lips */}
        <ellipse cx="36" cy="64" rx="6" ry="3" fill="#ECA1A6" opacity="0.4" />
        <ellipse cx="64" cy="64" rx="6" ry="3" fill="#ECA1A6" opacity="0.4" />
        <path d="M44 74 Q 50 78 56 74" stroke="#C85A70" strokeWidth="2" strokeLinecap="round" />
        {/* Hair flow */}
        <path d="M22 45 Q 26 22 50 20 Q 74 22 78 45" stroke="#4A3B32" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'small-comfort',
    title: 'Small Comfort',
    author: 'Ia Genberg',
    subtitle: 'Booker Prize Shortlist',
    moodTag: 'Introspective & Soothing',
    accentColor: '#DDA15E',
    bgGradient: 'linear-gradient(170deg, #F6E2BB 0%, #E9C46A 40%, #DDA15E 100%)',
    textColor: '#4A3525',
    illustration: (
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        {/* Cutout Paper Collage Effect */}
        <polygon points="20,15 80,25 75,85 15,75" fill="#E76F51" opacity="0.3" />
        <polygon points="25,20 75,30 70,80 20,70" fill="#FDF0D5" />
        {/* Game board lines */}
        <line x1="30" y1="40" x2="65" y2="40" stroke="#BC6C25" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="30" y1="55" x2="65" y2="55" stroke="#BC6C25" strokeWidth="1" strokeDasharray="3 3" />
        {/* Green Figurine Pawn */}
        <circle cx="48" cy="46" r="4" fill="#2E7D32" />
        <path d="M44 58 L 52 58 L 50 50 L 46 50 Z" fill="#2E7D32" />
      </svg>
    ),
  },
  {
    id: 'imperfection',
    title: 'The Gifts of Imperfection',
    author: 'Brené Brown',
    subtitle: 'Over 2 Million Copies Sold',
    moodTag: 'Empowering & Growth',
    accentColor: '#2A9D8F',
    bgGradient: 'linear-gradient(160deg, #264653 0%, #2A9D8F 60%, #1D3557 100%)',
    textColor: '#FFFFFF',
    illustration: (
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        {/* Gold Woven Heart / Sunburst */}
        <circle cx="50" cy="50" r="28" stroke="#E9C46A" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
        <circle cx="50" cy="50" r="20" stroke="#E9C46A" strokeWidth="1.5" opacity="0.8" />
        <path
          d="M50 42 C 46 36, 38 38, 38 46 C 38 54, 50 62, 50 62 C 50 62, 62 54, 62 46 C 62 38, 54 36, 50 42 Z"
          fill="#E76F51"
          opacity="0.9"
        />
      </svg>
    ),
  },
  {
    id: 'tomorrow',
    title: 'Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    subtitle: 'National Bestseller',
    moodTag: 'Absorbing & Creative',
    accentColor: '#1D3557',
    bgGradient: 'linear-gradient(155deg, #F1FAEE 0%, #A8DADC 45%, #457B9D 100%)',
    textColor: '#1D3557',
    illustration: (
      <svg width="100" height="90" viewBox="0 0 100 90" fill="none">
        {/* The Great Wave Hokusai Motif */}
        <path
          d="M10 70 Q 30 35 50 50 Q 70 30 85 45 Q 90 25 95 30 L 95 80 L 10 80 Z"
          fill="#1D3557"
          opacity="0.8"
        />
        <path
          d="M15 75 Q 35 45 55 58 Q 75 42 90 55 L 90 85 L 15 85 Z"
          fill="#E63946"
          opacity="0.75"
        />
        {/* Spray Foam Dots */}
        <circle cx="48" cy="46" r="2" fill="#F1FAEE" />
        <circle cx="68" cy="28" r="2" fill="#F1FAEE" />
        <circle cx="86" cy="40" r="2.5" fill="#F1FAEE" />
      </svg>
    ),
  },
  {
    id: 'coffee',
    title: 'Before the Coffee Gets Cold',
    author: 'Toshikazu Kawaguchi',
    subtitle: 'Translated from Japanese',
    moodTag: 'Nostalgic & Tender',
    accentColor: '#6F4E37',
    bgGradient: 'linear-gradient(170deg, #FBF8F3 0%, #EFE5D8 50%, #D8C3A5 100%)',
    textColor: '#4A3B32',
    illustration: (
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        {/* Steaming Coffee Cup */}
        <path
          d="M32 50 C 32 68, 68 68, 68 50 L 32 50 Z"
          fill="#8E735B"
        />
        {/* Cup Handle */}
        <path
          d="M68 52 C 76 52, 76 60, 68 62"
          stroke="#8E735B"
          strokeWidth="3"
          fill="none"
        />
        {/* Saucer */}
        <ellipse cx="50" cy="72" rx="26" ry="4" fill="#D8C3A5" stroke="#8E735B" strokeWidth="1.5" />
        {/* Delicate Steam Wisps */}
        <path d="M44 42 Q 41 34 46 26" stroke="#B8977E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M52 40 Q 56 32 50 24" stroke="#B8977E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    id: 'habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    subtitle: 'Tiny Changes, Remarkable Results',
    moodTag: 'Intentional & Focused',
    accentColor: '#3D3A45',
    bgGradient: 'linear-gradient(175deg, #FFFFFF 0%, #F5F4F0 60%, #E8E5DD 100%)',
    textColor: '#1E1D24',
    illustration: (
      <svg width="100" height="90" viewBox="0 0 100 90" fill="none">
        {/* Atomic Orbit and Core */}
        <circle cx="50" cy="45" r="7" fill="#F4A261" />
        <ellipse cx="50" cy="45" rx="32" ry="12" stroke="#9A8C98" strokeWidth="1" strokeDasharray="3 3" transform="rotate(30 50 45)" />
        <ellipse cx="50" cy="45" rx="32" ry="12" stroke="#9A8C98" strokeWidth="1" strokeDasharray="3 3" transform="rotate(-30 50 45)" />
        <circle cx="28" cy="38" r="2.5" fill="#E76F51" />
        <circle cx="72" cy="52" r="2.5" fill="#E76F51" />
      </svg>
    ),
  },
]

export interface BookShelfProps {
  onBookClick?: (book: BookItem) => void
  className?: string
}

export const BookShelf: React.FC<BookShelfProps> = ({ onBookClick, className = '' }) => {
  // Duplicate the list within each track to ensure full coverage on ultra-wide screens
  const marqueeBooks = [...SAMPLE_BOOKS, ...SAMPLE_BOOKS]

  return (
    <section
      className={`bookshelf-showcase ${className}`}
      aria-label="Featured Reading Showcase"
    >
      <div className="bookshelf-marquee-container">
        {/* Track 1: Primary interactive track */}
        <div className="bookshelf-marquee-track">
          {marqueeBooks.map((book, idx) => (
            <BookCover
              key={`primary-${book.id}-${idx}`}
              book={book}
              size="md"
              onClick={() => onBookClick?.(book)}
              showMoodTag={true}
            />
          ))}
        </div>

        {/* Track 2: Seamless loop duplicate track */}
        <div className="bookshelf-marquee-track" aria-hidden="true">
          {marqueeBooks.map((book, idx) => (
            <BookCover
              key={`duplicate-${book.id}-${idx}`}
              book={book}
              size="md"
              onClick={() => onBookClick?.(book)}
              showMoodTag={true}
              isDuplicate={true}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default BookShelf

