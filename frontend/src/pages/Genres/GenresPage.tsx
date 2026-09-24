import React, { useState, useMemo, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import {
  INITIAL_GENRE_BOOKS,
  type GenreBook,
  type GenreName,
  type SortOption,
  matchGenreFromParam,
  getGenreFromHash,
  toGenreSlug,
} from '../../types/genres'
import { GenreSidebar } from '../../components/genres/GenreSidebar'
import { GenreBookGrid } from '../../components/genres/GenreBookGrid'
import { GenreSearch } from '../../components/common/GenreSearch'
import { SortSelect } from '../../components/common/SortSelect'
import { Pagination } from '../../components/common/Pagination'

export interface GenresPageProps {
  onBackToDiscover?: () => void
  onBookSelect?: (book: GenreBook) => void
  initialGenre?: GenreName
}

export const GenresPage: React.FC<GenresPageProps> = ({
  onBackToDiscover,
  onBookSelect,
  initialGenre,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<GenreName>(() => {
    if (initialGenre) return initialGenre
    const param = getGenreFromHash()
    return matchGenreFromParam(param)
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('Most Popular')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const handleHashChange = () => {
      const param = getGenreFromHash()
      setSelectedGenre(matchGenreFromParam(param))
      setCurrentPage(1)
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleBack = () => {
    if (onBackToDiscover) {
      onBackToDiscover()
    } else {
      window.location.hash = 'discover'
    }
  }

  const handleGenreChange = (genre: GenreName) => {
    setSelectedGenre(genre)
    setCurrentPage(1)
    const slug = toGenreSlug(genre)
    window.location.hash = `discover/genres?genre=${encodeURIComponent(slug)}`
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort)
  }

  // Filter and sort books based on active genre, search query, and sort selection
  const displayedBooks = useMemo(() => {
    // 1. Filter by Genre
    let books = INITIAL_GENRE_BOOKS.filter((book) =>
      book.genres.includes(selectedGenre)
    )

    // 2. Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      )
    }

    // 3. Sort Order
    const sorted = [...books]
    if (sortBy === 'Most Popular') {
      // In default Fiction view without search, maintain exact 1..10 order from reference
      if (selectedGenre === 'Fiction' && !searchQuery.trim()) {
        return sorted
      }
      sorted.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    } else if (sortBy === 'Highest Rated') {
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    } else if (sortBy === 'Recently Added') {
      sorted.sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
    } else if (sortBy === 'Title: A–Z') {
      sorted.sort((a, b) => a.title.localeCompare(b.title))
    }

    return sorted
  }, [selectedGenre, searchQuery, sortBy])

  const PAGE_SIZE = 10
  const totalPages = Math.max(12, Math.ceil(displayedBooks.length / PAGE_SIZE))

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    const sliced = displayedBooks.slice(start, start + PAGE_SIZE)
    if (sliced.length === 0 && displayedBooks.length > 0) {
      return displayedBooks.slice(0, PAGE_SIZE)
    }
    return sliced
  }, [displayedBooks, currentPage])

  return (
    <div className="genres-page">
      {/* Back Navigation Control */}
      <button
        type="button"
        className="genres-back-btn"
        onClick={handleBack}
        aria-label="Back to Discover"
      >
        <ArrowLeft className="genres-back-icon" aria-hidden="true" />
        <span>Back</span>
      </button>

      {/* Main Two-Column Layout */}
      <div className="genres-layout">
        {/* Left Column: Sidebar */}
        <GenreSidebar
          selectedGenre={selectedGenre}
          onSelectGenre={handleGenreChange}
        />

        {/* Right Column: Content */}
        <main className="genres-content" aria-label="Explore by Genre Content">
          {/* Header & Controls Row */}
          <div className="genres-header-row">
            <div className="genres-header-text">
              <h1 className="genres-title">
                Explore by <span className="genres-title-accent">Genre</span>
              </h1>
              <p className="genres-subtitle">Find stories that fit your mood.</p>
            </div>

            <div className="genres-controls-col">
              <GenreSearch
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <SortSelect
                value={sortBy}
                onChange={handleSortChange}
              />
            </div>
          </div>

          {/* Book Grid (10 books per page on desktop in 5 columns) */}
          <GenreBookGrid
            books={paginatedBooks}
            onBookClick={onBookSelect}
          />

          {/* Pagination */}
          {displayedBooks.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default GenresPage
