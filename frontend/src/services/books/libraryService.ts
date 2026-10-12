/**
 * Verba Library Service
 * Provides library bookshelf and reading journal data management.
 * Designed with a clean service boundary for future Supabase client binding
 * with local persistence and development fixtures.
 */

import type {
  LibraryBook,
  JournalEntry,
} from '../../types/library'

const STORAGE_KEY_BOOKS = 'verba_user_library_books_v1'
const STORAGE_KEY_JOURNAL = 'verba_user_reading_journal_v1'

export const DEFAULT_LIBRARY_BOOKS: LibraryBook[] = [
  {
    id: 'book-1',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
    status: 'want_to_read',
    totalPages: 320,
    addedAt: '2024-10-02T10:00:00Z',
    genres: ['Self-Help', 'Productivity'],
  },
  {
    id: 'book-2',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg',
    status: 'reading',
    currentPage: 186,
    totalPages: 300,
    progressPercent: 62,
    addedAt: '2024-09-28T14:30:00Z',
    genres: ['Fiction', 'Magical Realism'],
  },
  {
    id: 'book-3',
    title: 'Maybe You Should Talk to Someone',
    author: 'Lori Gottlieb',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781328662057-L.jpg',
    status: 'completed',
    rating: 4.5,
    totalPages: 415,
    currentPage: 415,
    progressPercent: 100,
    addedAt: '2024-09-15T09:15:00Z',
    finishedAt: '2024-09-25T18:00:00Z',
    genres: ['Memoir', 'Psychology'],
  },
  {
    id: 'book-4',
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781501161933-L.jpg',
    status: 'completed',
    rating: 4.5,
    totalPages: 400,
    currentPage: 400,
    progressPercent: 100,
    addedAt: '2024-09-10T11:00:00Z',
    finishedAt: '2024-09-22T21:45:00Z',
    genres: ['Historical Fiction', 'Drama'],
  },
  {
    id: 'book-5',
    title: 'Dune',
    author: 'Frank Herbert',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg',
    status: 'want_to_read',
    totalPages: 688,
    addedAt: '2024-09-05T08:00:00Z',
    genres: ['Science Fiction', 'Classic'],
  },
  {
    id: 'book-6',
    title: 'Normal People',
    author: 'Sally Rooney',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780571334650-L.jpg',
    status: 'reading',
    currentPage: 76,
    totalPages: 273,
    progressPercent: 28,
    addedAt: '2024-08-30T16:20:00Z',
    genres: ['Contemporary', 'Literary Fiction'],
  },
  {
    id: 'book-7',
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780062060624-L.jpg',
    status: 'completed',
    rating: 5.0,
    totalPages: 416,
    currentPage: 416,
    progressPercent: 100,
    addedAt: '2024-08-14T12:00:00Z',
    finishedAt: '2024-08-27T19:30:00Z',
    genres: ['Mythology', 'Historical Fiction'],
  },
  {
    id: 'book-8',
    title: 'Educated',
    author: 'Tara Westover',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg',
    status: 'want_to_read',
    totalPages: 352,
    addedAt: '2024-08-01T15:00:00Z',
    genres: ['Memoir', 'Biography'],
  },
]

export const DEFAULT_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'journal-1',
    bookId: 'book-2',
    bookTitle: 'The Midnight Library',
    bookAuthor: 'Matt Haig',
    bookCoverUrl: 'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg',
    type: 'reflection',
    date: 'Oct 8, 2024',
    content:
      '“A reminder that the life we have is still worth exploring. This book made me think about the what-ifs in the best way possible.”',
    createdAt: '2024-10-08T18:30:00Z',
  },
  {
    id: 'journal-2',
    bookId: 'book-4',
    bookTitle: 'The Seven Husbands of Evelyn Hugo',
    bookAuthor: 'Taylor Jenkins Reid',
    bookCoverUrl: 'https://covers.openlibrary.org/b/isbn/9781501161933-L.jpg',
    type: 'review',
    date: 'Oct 5, 2024',
    rating: 5,
    content: '“Beautifully written and completely captivating. I couldn\'t put it down.”',
    createdAt: '2024-10-05T21:15:00Z',
  },
  {
    id: 'journal-3',
    bookId: 'book-1',
    bookTitle: 'Atomic Habits',
    bookAuthor: 'James Clear',
    bookCoverUrl: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
    type: 'note',
    date: 'Oct 2, 2024',
    content:
      'Key idea: Small consistent changes compound over time. Habit identity matters more than motivation.',
    createdAt: '2024-10-02T09:40:00Z',
  },
  {
    id: 'journal-4',
    bookId: 'book-8',
    bookTitle: 'Educated',
    bookAuthor: 'Tara Westover',
    bookCoverUrl: 'https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg',
    type: 'highlight',
    date: 'Sep 27, 2024',
    content:
      '“You could call this self-knowledge; or whatever it is, I have it now. A sense of having arrived at a quiet center.”',
    createdAt: '2024-09-27T16:20:00Z',
  },
  {
    id: 'journal-5',
    bookId: 'book-6',
    bookTitle: 'Normal People',
    bookAuthor: 'Sally Rooney',
    bookCoverUrl: 'https://covers.openlibrary.org/b/isbn/9780571334650-L.jpg',
    type: 'reflection',
    date: 'Sep 19, 2024',
    content:
      '“Connell and Marianne\'s miscommunications felt so painfully real. The gap between what people feel and what they express.”',
    createdAt: '2024-09-19T22:10:00Z',
  },
]

// Catalog of discoverable books for Add Book search modal
export const SEARCHABLE_CATALOG = [
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
    totalPages: 320,
    genres: ['Self-Help', 'Productivity'],
  },
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg',
    totalPages: 300,
    genres: ['Fiction', 'Magical Realism'],
  },
  {
    title: 'Maybe You Should Talk to Someone',
    author: 'Lori Gottlieb',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781328662057-L.jpg',
    totalPages: 415,
    genres: ['Memoir', 'Psychology'],
  },
  {
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781501161933-L.jpg',
    totalPages: 400,
    genres: ['Historical Fiction', 'Drama'],
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg',
    totalPages: 688,
    genres: ['Science Fiction', 'Classic'],
  },
  {
    title: 'Normal People',
    author: 'Sally Rooney',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780571334650-L.jpg',
    totalPages: 273,
    genres: ['Contemporary', 'Literary Fiction'],
  },
  {
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780062060624-L.jpg',
    totalPages: 416,
    genres: ['Mythology', 'Historical Fiction'],
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg',
    totalPages: 352,
    genres: ['Memoir', 'Biography'],
  },
  {
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    coverUrl: 'https://covers.openlibrary.org/b/id/12886416-L.jpg',
    totalPages: 416,
    genres: ['Fiction', 'Contemporary'],
  },
  {
    title: 'Daisy Jones & The Six',
    author: 'Taylor Jenkins Reid',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781524798628-L.jpg',
    totalPages: 368,
    genres: ['Historical Fiction', 'Music'],
  },
  {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg',
    totalPages: 496,
    genres: ['Science Fiction'],
  },
  {
    title: 'Before the Coffee Gets Cold',
    author: 'Toshikazu Kawaguchi',
    coverUrl: 'https://covers.openlibrary.org/b/id/12693825-L.jpg',
    totalPages: 213,
    genres: ['Fantasy', 'Magical Realism'],
  },
]

class LibraryService {
  private getStoredBooks(): LibraryBook[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_BOOKS)
      if (data) {
        return JSON.parse(data)
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
    return DEFAULT_LIBRARY_BOOKS
  }

  private saveStoredBooks(books: LibraryBook[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books))
    } catch {
      // Storage unavailable
    }
  }

  private getStoredJournal(): JournalEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_JOURNAL)
      if (data) {
        return JSON.parse(data)
      }
    } catch {
      // Ignore storage errors
    }
    return DEFAULT_JOURNAL_ENTRIES
  }

  private saveStoredJournal(entries: JournalEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(entries))
    } catch {
      // Storage unavailable
    }
  }

  /**
   * Fetch all user library books
   */
  public async getBooks(): Promise<LibraryBook[]> {
    return this.getStoredBooks()
  }

  /**
   * Add a book to user library
   */
  public async addBook(newBook: Omit<LibraryBook, 'id' | 'addedAt'>): Promise<LibraryBook> {
    const books = this.getStoredBooks()
    const book: LibraryBook = {
      ...newBook,
      id: `book-${Date.now()}`,
      addedAt: new Date().toISOString(),
    }
    const updated = [book, ...books]
    this.saveStoredBooks(updated)
    return book
  }

  /**
   * Update book status, rating, or reading progress
   */
  public async updateBook(
    id: string,
    updates: Partial<Omit<LibraryBook, 'id'>>
  ): Promise<LibraryBook | null> {
    const books = this.getStoredBooks()
    const index = books.findIndex((b) => b.id === id)
    if (index === -1) return null

    const updatedBook: LibraryBook = {
      ...books[index],
      ...updates,
    }

    if (updates.status === 'completed' && !updatedBook.finishedAt) {
      updatedBook.finishedAt = new Date().toISOString()
      updatedBook.progressPercent = 100
      if (updatedBook.totalPages) {
        updatedBook.currentPage = updatedBook.totalPages
      }
    }

    books[index] = updatedBook
    this.saveStoredBooks(books)
    return updatedBook
  }

  /**
   * Remove a book from user's library
   */
  public async removeBook(id: string): Promise<boolean> {
    const books = this.getStoredBooks()
    const filtered = books.filter((b) => b.id !== id)
    this.saveStoredBooks(filtered)
    return true
  }

  /**
   * Fetch journal entries
   */
  public async getJournalEntries(): Promise<JournalEntry[]> {
    return this.getStoredJournal()
  }

  /**
   * Add a new journal entry
   */
  public async addJournalEntry(
    entry: Omit<JournalEntry, 'id' | 'createdAt' | 'date'> & { date?: string }
  ): Promise<JournalEntry> {
    const entries = this.getStoredJournal()
    const now = new Date()
    const dateFormatted =
      entry.date ||
      now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })

    const newEntry: JournalEntry = {
      ...entry,
      id: `journal-${Date.now()}`,
      date: dateFormatted,
      createdAt: now.toISOString(),
    }

    const updated = [newEntry, ...entries]
    this.saveStoredJournal(updated)
    return newEntry
  }

  /**
   * Delete a journal entry
   */
  public async deleteJournalEntry(id: string): Promise<boolean> {
    const entries = this.getStoredJournal()
    const filtered = entries.filter((e) => e.id !== id)
    this.saveStoredJournal(filtered)
    return true
  }

  /**
   * Search catalog for adding new books
   */
  public async searchCatalog(query: string) {
    const clean = query.trim().toLowerCase()
    if (!clean) return SEARCHABLE_CATALOG.slice(0, 6)

    return SEARCHABLE_CATALOG.filter(
      (b) =>
        b.title.toLowerCase().includes(clean) ||
        b.author.toLowerCase().includes(clean) ||
        b.genres.some((g) => g.toLowerCase().includes(clean))
    )
  }
}

export const libraryService = new LibraryService()
