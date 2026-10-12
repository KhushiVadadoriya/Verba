/**
 * Verba Library & Reading Journal Types
 * Aligns with Supabase schema:
 * - public.books
 * - public.user_books
 * - public.reflections
 */

export type ReadingStatus = 'want_to_read' | 'reading' | 'completed'

export interface LibraryBook {
  id: string
  title: string
  author: string
  coverUrl: string
  status: ReadingStatus
  currentPage?: number
  totalPages?: number
  progressPercent?: number // 0-100
  rating?: number // 1-5 (e.g., 4.5, 5.0)
  addedAt: string // ISO date string
  finishedAt?: string
  notesCount?: number
  genres?: string[]
}

export type JournalEntryType = 'reflection' | 'review' | 'note' | 'highlight'

export interface JournalEntry {
  id: string
  bookId: string
  bookTitle: string
  bookAuthor: string
  bookCoverUrl: string
  type: JournalEntryType
  date: string // e.g. "Oct 8, 2024" or ISO string
  content: string
  rating?: number // For reviews (1-5)
  pageNumber?: number
  createdAt: string
}

export type BookshelfTab = 'all' | 'want_to_read' | 'reading' | 'completed'

export type SortOption =
  | 'recent'
  | 'title_asc'
  | 'title_desc'
  | 'author'
  | 'rating_desc'
  | 'progress'

export type JournalTab = 'all' | 'review' | 'reflection' | 'note' | 'highlight'
