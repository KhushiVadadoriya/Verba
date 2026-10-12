import React, { useState, useEffect } from 'react'
import { X, Search, Check, BookPlus } from 'lucide-react'
import type { LibraryBook, ReadingStatus } from '../../../types/library'
import { libraryService, SEARCHABLE_CATALOG } from '../../../services/books/libraryService'

export interface AddBookModalProps {
  isOpen: boolean
  onClose: () => void
  onBookAdded: (newBook: LibraryBook) => void
}

export const AddBookModal: React.FC<AddBookModalProps> = ({
  isOpen,
  onClose,
  onBookAdded,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(SEARCHABLE_CATALOG.slice(0, 6))
  const [selectedCatalogBook, setSelectedCatalogBook] = useState<(typeof SEARCHABLE_CATALOG)[0] | null>(
    SEARCHABLE_CATALOG[0]
  )
  const [customTitle, setCustomTitle] = useState('')
  const [customAuthor, setCustomAuthor] = useState('')
  const [customCoverUrl, setCustomCoverUrl] = useState('')
  const [status, setStatus] = useState<ReadingStatus>('want_to_read')
  const [progressPercent, setProgressPercent] = useState<number>(0)
  const [rating, setRating] = useState<number>(5)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
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

  useEffect(() => {
    let active = true
    libraryService.searchCatalog(searchQuery).then((res) => {
      if (active) {
        setSearchResults(res)
        if (res.length > 0 && !selectedCatalogBook) {
          setSelectedCatalogBook(res[0])
        }
      }
    })
    return () => {
      active = false
    }
  }, [searchQuery, selectedCatalogBook])

  if (!isOpen) return null

  const handleSelectResult = (book: (typeof SEARCHABLE_CATALOG)[0]) => {
    setSelectedCatalogBook(book)
    setCustomTitle(book.title)
    setCustomAuthor(book.author)
    setCustomCoverUrl(book.coverUrl)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const title = customTitle || selectedCatalogBook?.title || 'Untitled Book'
    const author = customAuthor || selectedCatalogBook?.author || 'Unknown Author'
    const coverUrl =
      customCoverUrl ||
      selectedCatalogBook?.coverUrl ||
      'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg'
    const totalPages = selectedCatalogBook?.totalPages || 320

    const newBook = await libraryService.addBook({
      title,
      author,
      coverUrl,
      status,
      totalPages,
      progressPercent: status === 'reading' ? progressPercent : status === 'completed' ? 100 : 0,
      currentPage:
        status === 'reading'
          ? Math.round((progressPercent / 100) * totalPages)
          : status === 'completed'
            ? totalPages
            : 0,
      rating: status === 'completed' ? rating : undefined,
      genres: selectedCatalogBook?.genres || ['Literature'],
    })

    setIsSubmitting(false)
    onBookAdded(newBook)
    onClose()
  }

  return (
    <div
      className="library-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-book-modal-title"
      onClick={onClose}
    >
      <div className="library-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="library-modal-close"
          onClick={onClose}
          aria-label="Close add book modal"
        >
          <X size={20} />
        </button>

        <div className="library-modal-header">
          <h2 id="add-book-modal-title" className="library-modal-title">
            Add to Bookshelf
          </h2>
          <p className="library-modal-subtitle">
            Search our curated literary catalog or enter a custom title.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Search Catalog Input */}
          <div className="library-form-group">
            <label className="library-form-label">Search Books & Authors</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '10px', color: 'var(--color-text-tertiary)' }}
              />
              <input
                type="text"
                className="library-form-input"
                style={{ paddingLeft: '32px' }}
                placeholder="Type to search (e.g. Dune, Sally Rooney)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Selection Results */}
          <div className="library-form-group">
            <span className="library-form-label">Catalog Suggestions</span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '8px',
                maxHeight: '160px',
                overflowY: 'auto',
                padding: '4px',
                backgroundColor: 'var(--color-surface-muted)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              {searchResults.map((b) => {
                const isSelected = selectedCatalogBook?.title === b.title
                return (
                  <div
                    key={b.title}
                    onClick={() => handleSelectResult(b)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      backgroundColor: isSelected ? '#f7ebf2' : '#ffffff',
                      border: isSelected ? '1px solid var(--color-secondary)' : '1px solid #ede8f0',
                      cursor: 'pointer',
                    }}
                  >
                    <img
                      src={b.coverUrl}
                      alt={b.title}
                      style={{ width: '24px', height: '34px', objectFit: 'cover', borderRadius: '2px' }}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          margin: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          color: isSelected ? 'var(--color-secondary)' : 'var(--color-text-primary)',
                        }}
                      >
                        {b.title}
                      </p>
                      <p
                        style={{
                          fontSize: '10px',
                          color: 'var(--color-text-tertiary)',
                          margin: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {b.author}
                      </p>
                    </div>
                    {isSelected && <Check size={14} color="var(--color-secondary)" />}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Reading Status Selector */}
          <div className="library-form-group">
            <label htmlFor="book-status-select" className="library-form-label">
              Reading Status
            </label>
            <select
              id="book-status-select"
              className="library-form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as ReadingStatus)}
            >
              <option value="want_to_read">Want to Read</option>
              <option value="reading">Currently Reading</option>
              <option value="completed">Finished</option>
            </select>
          </div>

          {/* Progress Slider if Reading */}
          {status === 'reading' && (
            <div className="library-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="library-form-label">Reading Progress</label>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)' }}>
                  {progressPercent}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progressPercent}
                onChange={(e) => setProgressPercent(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-primary)' }}
              />
            </div>
          )}

          {/* Rating if Completed */}
          {status === 'completed' && (
            <div className="library-form-group">
              <label htmlFor="book-rating-select" className="library-form-label">
                Your Rating
              </label>
              <select
                id="book-rating-select"
                className="library-form-select"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={5}>5.0 Stars (Masterpiece)</option>
                <option value={4.5}>4.5 Stars (Exceptional)</option>
                <option value={4}>4.0 Stars (Great)</option>
                <option value={3.5}>3.5 Stars (Good)</option>
                <option value={3}>3.0 Stars (Average)</option>
              </select>
            </div>
          )}

          {/* Footer Actions */}
          <div className="library-modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-add-book"
              disabled={isSubmitting}
            >
              <BookPlus size={16} />
              <span>{isSubmitting ? 'Adding...' : 'Add to Library'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBookModal
