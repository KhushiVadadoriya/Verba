import React from 'react'
import { BookOpen, Plus, Search, ChevronDown, PenLine } from 'lucide-react'
import type {
  JournalEntry,
  JournalTab,
} from '../../../types/library'
import { JournalEntryRow } from './JournalEntryRow'

export interface ReadingJournalSectionProps {
  entries: JournalEntry[]
  activeTab: JournalTab
  onTabChange: (tab: JournalTab) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedBookFilter: string
  onSelectedBookFilterChange: (bookId: string) => void
  selectedTypeFilter: string
  onSelectedTypeFilterChange: (type: string) => void
  selectedDateSort: 'newest' | 'oldest'
  onSelectedDateSortChange: (sort: 'newest' | 'oldest') => void
  availableBooks: { id: string; title: string }[]
  onNewEntryClick: () => void
  onSelectEntry: (entry: JournalEntry) => void
  counts: {
    all: number
    review: number
    reflection: number
    note: number
    highlight: number
  }
}

export const ReadingJournalSection: React.FC<ReadingJournalSectionProps> = ({
  entries,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  selectedBookFilter,
  onSelectedBookFilterChange,
  selectedTypeFilter,
  onSelectedTypeFilterChange,
  selectedDateSort,
  onSelectedDateSortChange,
  availableBooks,
  onNewEntryClick,
  onSelectEntry,
  counts,
}) => {
  return (
    <section className="reading-journal-section" aria-label="My Reading Journal">
      {/* Journal Header */}
      <div className="journal-header">
        <div className="journal-header-left">
          <div className="journal-header-icon" aria-hidden="true">
            <BookOpen size={28} />
          </div>
          <div>
            <h2 className="journal-header-title">My Reading Journal</h2>
            <p className="journal-header-subtitle">
              A place for everything a book made you think, feel, or remember.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn-new-entry"
          onClick={onNewEntryClick}
          aria-label="Create New Journal Entry"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Entry</span>
        </button>
      </div>

      {/* Journal Type Tabs */}
      <div className="journal-type-tabs" role="tablist" aria-label="Filter journal by type">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'all'}
          className={`journal-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => onTabChange('all')}
        >
          All Entries ({counts.all})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'review'}
          className={`journal-tab-btn ${activeTab === 'review' ? 'active' : ''}`}
          onClick={() => onTabChange('review')}
        >
          Reviews ({counts.review})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'reflection'}
          className={`journal-tab-btn ${activeTab === 'reflection' ? 'active' : ''}`}
          onClick={() => onTabChange('reflection')}
        >
          Reflections ({counts.reflection})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'note'}
          className={`journal-tab-btn ${activeTab === 'note' ? 'active' : ''}`}
          onClick={() => onTabChange('note')}
        >
          Notes ({counts.note})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'highlight'}
          className={`journal-tab-btn ${activeTab === 'highlight' ? 'active' : ''}`}
          onClick={() => onTabChange('highlight')}
        >
          Highlights ({counts.highlight})
        </button>
      </div>

      {/* Journal Search & Dropdown Filters Row */}
      <div className="journal-filter-row">
        <div className="journal-search-input-wrapper">
          <Search size={16} className="journal-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="journal-search-input"
            placeholder="Search your notes, reflections..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search journal entries"
          />
        </div>

        <div className="journal-dropdowns-group">
          {/* Book Filter Dropdown */}
          <div className="journal-filter-select-wrapper">
            <select
              className="journal-filter-select"
              value={selectedBookFilter}
              onChange={(e) => onSelectedBookFilterChange(e.target.value)}
              aria-label="Filter journal by book"
            >
              <option value="all">Book: All</option>
              {availableBooks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="journal-filter-chevron" />
          </div>

          {/* Type Filter Dropdown */}
          <div className="journal-filter-select-wrapper">
            <select
              className="journal-filter-select"
              value={selectedTypeFilter}
              onChange={(e) => onSelectedTypeFilterChange(e.target.value)}
              aria-label="Filter journal by type"
            >
              <option value="all">Type: All</option>
              <option value="reflection">Reflection</option>
              <option value="review">Review</option>
              <option value="note">Note</option>
              <option value="highlight">Highlight</option>
            </select>
            <ChevronDown size={14} className="journal-filter-chevron" />
          </div>

          {/* Date Sort Dropdown */}
          <div className="journal-filter-select-wrapper">
            <select
              className="journal-filter-select"
              value={selectedDateSort}
              onChange={(e) => onSelectedDateSortChange(e.target.value as 'newest' | 'oldest')}
              aria-label="Sort journal by date"
            >
              <option value="newest">Date: Newest</option>
              <option value="oldest">Date: Oldest</option>
            </select>
            <ChevronDown size={14} className="journal-filter-chevron" />
          </div>
        </div>
      </div>

      {/* Journal Entries List */}
      {entries.length === 0 ? (
        <div
          className="library-empty-state"
          style={{ backgroundColor: '#ffffff', borderColor: '#f0dfea' }}
        >
          <PenLine size={32} color="var(--color-secondary)" />
          <h3 className="library-empty-title">Your thoughts are waiting to be written.</h3>
          <p className="library-empty-description">
            Capture a quote, write a reflection, or leave a review for the stories shaping your world.
          </p>
          <button
            type="button"
            className="btn-new-entry"
            onClick={onNewEntryClick}
            style={{ marginTop: 'var(--space-2)' }}
          >
            + Create First Entry
          </button>
        </div>
      ) : (
        <div className="journal-entries-list">
          {entries.map((entry) => (
            <JournalEntryRow
              key={entry.id}
              entry={entry}
              onClick={onSelectEntry}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default ReadingJournalSection
