import React from 'react'
import { LayoutGrid, List, ChevronDown, BookOpen } from 'lucide-react'
import type {
  LibraryBook,
  BookshelfTab,
  SortOption,
  ReadingStatus,
} from '../../../types/library'
import { BookshelfBookCard } from './BookshelfBookCard'
import { BookshelfBookListRow } from './BookshelfBookListRow'

export interface BookshelfSectionProps {
  books: LibraryBook[]
  activeTab: BookshelfTab
  onTabChange: (tab: BookshelfTab) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  onSelectBook: (book: LibraryBook) => void
  onUpdateStatus: (bookId: string, status: ReadingStatus) => void
  onEditProgress: (book: LibraryBook) => void
  onRemoveBook: (bookId: string) => void
  onAddBookClick: () => void
  counts: {
    all: number
    want_to_read: number
    reading: number
    completed: number
  }
}

export const BookshelfSection: React.FC<BookshelfSectionProps> = ({
  books,
  activeTab,
  onTabChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onSelectBook,
  onUpdateStatus,
  onEditProgress,
  onRemoveBook,
  onAddBookClick,
  counts,
}) => {
  return (
    <section className="bookshelf-section" aria-label="My Bookshelf">
      <div className="bookshelf-section-header">
        <h2 className="bookshelf-title">My Bookshelf</h2>
      </div>

      {/* Toolbar: Status Tabs on Left, Sort & View Mode on Right */}
      <div className="bookshelf-toolbar">
        <div className="bookshelf-tabs" role="tablist" aria-label="Filter by reading status">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'all'}
            className={`bookshelf-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => onTabChange('all')}
          >
            All Books ({counts.all})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'want_to_read'}
            className={`bookshelf-tab-btn ${activeTab === 'want_to_read' ? 'active' : ''}`}
            onClick={() => onTabChange('want_to_read')}
          >
            Want to Read ({counts.want_to_read})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'reading'}
            className={`bookshelf-tab-btn ${activeTab === 'reading' ? 'active' : ''}`}
            onClick={() => onTabChange('reading')}
          >
            Reading ({counts.reading})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'completed'}
            className={`bookshelf-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => onTabChange('completed')}
          >
            Finished ({counts.completed})
          </button>
        </div>

        <div className="bookshelf-controls">
          {/* Sort Dropdown */}
          <div className="bookshelf-sort-wrapper">
            <select
              className="bookshelf-sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              aria-label="Sort bookshelf books"
            >
              <option value="recent">Sort: Recently added</option>
              <option value="title_asc">Sort: Title (A-Z)</option>
              <option value="title_desc">Sort: Title (Z-A)</option>
              <option value="author">Sort: Author</option>
              <option value="rating_desc">Sort: Highest rated</option>
              <option value="progress">Sort: Reading progress</option>
            </select>
            <ChevronDown size={14} className="bookshelf-sort-chevron" />
          </div>

          {/* Grid / List View Switcher */}
          <div className="bookshelf-view-toggle" role="group" aria-label="View layout">
            <button
              type="button"
              className={`bookshelf-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              className={`bookshelf-view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => onViewModeChange('list')}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Books Content */}
      {books.length === 0 ? (
        <div className="library-empty-state">
          <BookOpen size={36} color="var(--color-secondary)" />
          <h3 className="library-empty-title">Your next favorite story starts here.</h3>
          <p className="library-empty-description">
            No books found matching your current filter. Add a new book to your sanctuary or reset your filters.
          </p>
          <button
            type="button"
            className="btn-add-book"
            onClick={onAddBookClick}
            style={{ marginTop: 'var(--space-2)' }}
          >
            + Add Book to Bookshelf
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="bookshelf-grid">
          {books.map((book) => (
            <BookshelfBookCard
              key={book.id}
              book={book}
              onSelect={onSelectBook}
              onUpdateStatus={onUpdateStatus}
              onEditProgress={onEditProgress}
              onRemove={onRemoveBook}
            />
          ))}
        </div>
      ) : (
        <div className="bookshelf-list">
          {books.map((book) => (
            <BookshelfBookListRow
              key={book.id}
              book={book}
              onSelect={onSelectBook}
              onUpdateStatus={onUpdateStatus}
              onEditProgress={onEditProgress}
              onRemove={onRemoveBook}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default BookshelfSection
