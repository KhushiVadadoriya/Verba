import React, { useState, useEffect, useMemo } from 'react'
import type {
  LibraryBook,
  JournalEntry,
  BookshelfTab,
  SortOption,
  JournalTab,
  ReadingStatus,
} from '../../types/library'
import { libraryService } from '../../services/books/libraryService'
import { LibraryHeader } from './components/LibraryHeader'
import { LibrarySearch } from './components/LibrarySearch'
import type { LibraryFilterState } from './components/LibraryFilterPopover'
import { BookshelfSection } from './components/BookshelfSection'
import { ReadingJournalSection } from './components/ReadingJournalSection'
import { AddBookModal } from './components/AddBookModal'
import { EditBookModal } from './components/EditBookModal'
import { JournalEntryModal } from './components/JournalEntryModal'
import { JournalDetailModal } from './components/JournalDetailModal'

export interface LibraryPageProps {
  onSelectBook?: (book: LibraryBook) => void
}

export const LibraryPage: React.FC<LibraryPageProps> = ({ onSelectBook }) => {
  // Bookshelf state
  const [books, setBooks] = useState<LibraryBook[]>([])
  const [activeBookshelfTab, setActiveBookshelfTab] = useState<BookshelfTab>('all')
  const [bookshelfSort, setBookshelfSort] = useState<SortOption>('recent')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Global search & filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterState, setFilterState] = useState<LibraryFilterState>({
    status: 'all',
    genre: 'all',
    minRating: 0,
  })

  // Journal state
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [activeJournalTab, setActiveJournalTab] = useState<JournalTab>('all')
  const [journalSearchQuery, setJournalSearchQuery] = useState('')
  const [selectedBookFilter, setSelectedBookFilter] = useState('all')
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all')
  const [selectedDateSort, setSelectedDateSort] = useState<'newest' | 'oldest'>('newest')

  // Modal dialog states
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<LibraryBook | null>(null)
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false)
  const [selectedJournalDetail, setSelectedJournalDetail] = useState<JournalEntry | null>(null)

  // Initial load from service
  useEffect(() => {
    libraryService.getBooks().then((data) => setBooks(data))
    libraryService.getJournalEntries().then((data) => setJournalEntries(data))
  }, [])

  // Available unique genres for filter popover
  const availableGenres = useMemo(() => {
    const set = new Set<string>()
    books.forEach((b) => b.genres?.forEach((g) => set.add(g)))
    return Array.from(set).sort()
  }, [books])

  // Dynamic counts for bookshelf
  const bookshelfCounts = useMemo(() => {
    return {
      all: books.length,
      want_to_read: books.filter((b) => b.status === 'want_to_read').length,
      reading: books.filter((b) => b.status === 'reading').length,
      completed: books.filter((b) => b.status === 'completed').length,
    }
  }, [books])

  // Filtered & sorted bookshelf items
  const filteredBooks = useMemo(() => {
    let result = [...books]

    // 1. Text search across title & author
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.genres?.some((g) => g.toLowerCase().includes(q))
      )
    }

    // 2. Bookshelf status tab
    if (activeBookshelfTab !== 'all') {
      result = result.filter((b) => b.status === activeBookshelfTab)
    }

    // 3. Filter popover status
    if (filterState.status !== 'all') {
      result = result.filter((b) => b.status === filterState.status)
    }

    // 4. Filter popover genre
    if (filterState.genre !== 'all') {
      result = result.filter((b) => b.genres?.includes(filterState.genre))
    }

    // 5. Filter popover min rating
    if (filterState.minRating > 0) {
      result = result.filter((b) => (b.rating ?? 0) >= filterState.minRating)
    }

    // 6. Sorting
    result.sort((a, b) => {
      if (bookshelfSort === 'title_asc') return a.title.localeCompare(b.title)
      if (bookshelfSort === 'title_desc') return b.title.localeCompare(a.title)
      if (bookshelfSort === 'author') return a.author.localeCompare(b.author)
      if (bookshelfSort === 'rating_desc') return (b.rating ?? 0) - (a.rating ?? 0)
      if (bookshelfSort === 'progress') return (b.progressPercent ?? 0) - (a.progressPercent ?? 0)
      // Default: recently added
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    })

    return result
  }, [books, searchQuery, activeBookshelfTab, filterState, bookshelfSort])

  // Dynamic counts for journal tabs
  const journalCounts = useMemo(() => {
    return {
      all: journalEntries.length,
      review: journalEntries.filter((e) => e.type === 'review').length,
      reflection: journalEntries.filter((e) => e.type === 'reflection').length,
      note: journalEntries.filter((e) => e.type === 'note').length,
      highlight: journalEntries.filter((e) => e.type === 'highlight').length,
    }
  }, [journalEntries])

  // Filtered & sorted journal entries
  const filteredJournalEntries = useMemo(() => {
    let result = [...journalEntries]

    // 1. Text search inside journal (or global search query if journal search empty)
    const effectiveQuery = journalSearchQuery.trim() || searchQuery.trim()
    if (effectiveQuery) {
      const q = effectiveQuery.toLowerCase()
      result = result.filter(
        (e) =>
          e.content.toLowerCase().includes(q) ||
          e.bookTitle.toLowerCase().includes(q) ||
          e.bookAuthor.toLowerCase().includes(q)
      )
    }

    // 2. Journal type tab
    if (activeJournalTab !== 'all') {
      result = result.filter((e) => e.type === activeJournalTab)
    }

    // 3. Dropdown type filter
    if (selectedTypeFilter !== 'all') {
      result = result.filter((e) => e.type === selectedTypeFilter)
    }

    // 4. Dropdown book filter
    if (selectedBookFilter !== 'all') {
      result = result.filter((e) => e.bookId === selectedBookFilter)
    }

    // 5. Date sort
    result.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime()
      const timeB = new Date(b.createdAt).getTime()
      return selectedDateSort === 'newest' ? timeB - timeA : timeA - timeB
    })

    return result
  }, [
    journalEntries,
    journalSearchQuery,
    searchQuery,
    activeJournalTab,
    selectedTypeFilter,
    selectedBookFilter,
    selectedDateSort,
  ])

  // Books list for journal dropdown
  const availableBooksForJournal = useMemo(() => {
    return books.map((b) => ({ id: b.id, title: b.title }))
  }, [books])

  // --- Handlers ---

  const handleBookSelect = (book: LibraryBook) => {
    if (onSelectBook) {
      onSelectBook(book)
    } else {
      setEditingBook(book)
    }
  }

  const handleUpdateStatus = async (bookId: string, status: ReadingStatus) => {
    const updated = await libraryService.updateBook(bookId, { status })
    if (updated) {
      setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)))
    }
  }

  const handleSaveBookUpdates = async (bookId: string, updates: Partial<LibraryBook>) => {
    const updated = await libraryService.updateBook(bookId, updates)
    if (updated) {
      setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)))
    }
  }

  const handleRemoveBook = async (bookId: string) => {
    await libraryService.removeBook(bookId)
    setBooks((prev) => prev.filter((b) => b.id !== bookId))
  }

  const handleAddBookSuccess = (newBook: LibraryBook) => {
    setBooks((prev) => [newBook, ...prev])
  }

  const handleSaveJournalEntry = async (
    newEntryData: Omit<JournalEntry, 'id' | 'createdAt' | 'date'> & { date?: string }
  ) => {
    const created = await libraryService.addJournalEntry(newEntryData)
    setJournalEntries((prev) => [created, ...prev])
  }

  const handleDeleteJournalEntry = async (id: string) => {
    await libraryService.deleteJournalEntry(id)
    setJournalEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="library-page">
      {/* 1. Header with Title & Add Book Button */}
      <LibraryHeader onAddBook={() => setIsAddBookModalOpen(true)} />

      {/* 2. Global Library Search & Filter Bar */}
      <LibrarySearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filterState}
        availableGenres={availableGenres}
        onFilterChange={setFilterState}
        onResetFilters={() =>
          setFilterState({ status: 'all', genre: 'all', minRating: 0 })
        }
      />

      {/* 3. My Bookshelf Section */}
      <BookshelfSection
        books={filteredBooks}
        activeTab={activeBookshelfTab}
        onTabChange={setActiveBookshelfTab}
        sortBy={bookshelfSort}
        onSortChange={setBookshelfSort}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSelectBook={handleBookSelect}
        onUpdateStatus={handleUpdateStatus}
        onEditProgress={(b) => setEditingBook(b)}
        onRemoveBook={handleRemoveBook}
        onAddBookClick={() => setIsAddBookModalOpen(true)}
        counts={bookshelfCounts}
      />

      {/* 4. My Reading Journal Section */}
      <ReadingJournalSection
        entries={filteredJournalEntries}
        activeTab={activeJournalTab}
        onTabChange={setActiveJournalTab}
        searchQuery={journalSearchQuery}
        onSearchChange={setJournalSearchQuery}
        selectedBookFilter={selectedBookFilter}
        onSelectedBookFilterChange={setSelectedBookFilter}
        selectedTypeFilter={selectedTypeFilter}
        onSelectedTypeFilterChange={setSelectedTypeFilter}
        selectedDateSort={selectedDateSort}
        onSelectedDateSortChange={setSelectedDateSort}
        availableBooks={availableBooksForJournal}
        onNewEntryClick={() => setIsNewEntryModalOpen(true)}
        onSelectEntry={(entry) => setSelectedJournalDetail(entry)}
        counts={journalCounts}
      />

      {/* --- Dialogs & Modals --- */}

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
        onBookAdded={handleAddBookSuccess}
      />

      {/* Edit Book Details / Progress Modal */}
      <EditBookModal
        book={editingBook}
        isOpen={!!editingBook}
        onClose={() => setEditingBook(null)}
        onSave={handleSaveBookUpdates}
        onRemove={handleRemoveBook}
      />

      {/* New Journal Entry Modal */}
      <JournalEntryModal
        isOpen={isNewEntryModalOpen}
        onClose={() => setIsNewEntryModalOpen(false)}
        books={books}
        onSaveEntry={handleSaveJournalEntry}
      />

      {/* Journal Entry Detail Modal */}
      <JournalDetailModal
        entry={selectedJournalDetail}
        isOpen={!!selectedJournalDetail}
        onClose={() => setSelectedJournalDetail(null)}
        onDelete={handleDeleteJournalEntry}
      />
    </div>
  )
}

export default LibraryPage
