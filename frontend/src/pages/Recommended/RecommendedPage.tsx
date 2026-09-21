import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import {
  RECOMMENDED_DATASET,
  type RecommendationBook,
} from '../../types/recommendations'
import { FeaturedRecommendation } from '../../components/recommendations/FeaturedRecommendation'
import { RecommendationGrid } from '../../components/recommendations/RecommendationGrid'
import { RecommendationPagination } from '../../components/recommendations/RecommendationPagination'

export interface RecommendedPageProps {
  onBackToDiscover?: () => void
  onBookDetails?: (book: RecommendationBook) => void
}

export const RecommendedPage: React.FC<RecommendedPageProps> = ({
  onBackToDiscover,
  onBookDetails,
}) => {
  // Default featured book is 'Normal People' as required
  const [featuredBook, setFeaturedBook] = useState<RecommendationBook>(
    RECOMMENDED_DATASET[0]
  )

  const [currentPage, setCurrentPage] = useState(1)

  // 5 books displayed in the "More for you" section at a time
  // Page 1: Normal People, Coffee, Midnight Library, Daisy Jones, Atomic Habits
  // Page 2: Evelyn Hugo, Coffee, Midnight Library, Daisy Jones, Normal People
  const getPageBooks = (page: number): RecommendationBook[] => {
    if (page === 2) {
      // Page 2 includes Evelyn Hugo as the lead recommendation
      return [
        RECOMMENDED_DATASET[5], // Evelyn Hugo
        RECOMMENDED_DATASET[1], // Coffee
        RECOMMENDED_DATASET[2], // Midnight Library
        RECOMMENDED_DATASET[3], // Daisy Jones
        RECOMMENDED_DATASET[0], // Normal People
      ]
    }
    // Pages 1, 3, 4, 5 display the primary 5-book set
    return RECOMMENDED_DATASET.slice(0, 5)
  }

  const currentBooks = getPageBooks(currentPage)

  const handleSelectBook = (book: RecommendationBook) => {
    setFeaturedBook(book)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleViewDetails = (book: RecommendationBook) => {
    if (onBookDetails) {
      onBookDetails(book)
    } else {
      // Temporary notice until Book Details page is implemented in future phase
      console.log(`View Details clicked for: ${book.title}`)
    }
  }

  const handleBack = () => {
    if (onBackToDiscover) {
      onBackToDiscover()
    } else {
      window.location.hash = 'discover'
    }
  }

  return (
    <div className="recommended-page">
      {/* A. Back Navigation Control */}
      <button
        type="button"
        className="recommended-back-btn"
        onClick={handleBack}
        aria-label="Back to Discover"
      >
        <ArrowLeft className="recommended-back-icon" aria-hidden="true" />
        <span>Back</span>
      </button>

      {/* B. Page Header */}
      <header className="recommended-header">
        <h1 className="recommended-title">
          Recommended for <span className="recommended-title-accent">you</span>
        </h1>
        <p className="recommended-subtitle">
          Stories picked for your mood, interests and reading journey.
        </p>
      </header>

      {/* C. Main Featured Recommendation Panel */}
      <FeaturedRecommendation
        book={featuredBook}
        onViewDetails={handleViewDetails}
      />

      {/* D. "More for you" Recommendation Section */}
      <section className="more-for-you-section" aria-labelledby="more-for-you-heading">
        <div className="more-for-you-header">
          <h2 id="more-for-you-heading" className="more-for-you-title">
            More for you
          </h2>
          <p className="more-for-you-subtitle">
            Because you’ve shown interest in similar books and themes.
          </p>
        </div>

        <RecommendationGrid
          books={currentBooks}
          selectedBookId={featuredBook.id}
          onSelectBook={handleSelectBook}
        />
      </section>

      {/* E. Pagination Controls */}
      <RecommendationPagination
        currentPage={currentPage}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default RecommendedPage
