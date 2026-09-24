import React from 'react'
import type { AppView } from '../../App'
import { HOME_MOCK_DATA, type HomeData, type HomeRecommendedBookData } from '../../types/home'
import { SectionHeader } from '../../components/common/SectionHeader'
import {
  MoodPrompt,
  ContinueReadingCard,
  HomeBookCard,
  ReadingReason,
  ReadingStats,
  RecentActivity,
} from '../../components/home'

export interface HomePageProps {
  userName?: string
  data?: HomeData
  onNavigate?: (view: AppView) => void
  onBookSelect?: (book: HomeRecommendedBookData) => void
}

export const HomePage: React.FC<HomePageProps> = ({
  userName = 'Khushi',
  data = HOME_MOCK_DATA,
  onNavigate,
  onBookSelect,
}) => {
  const handleNavigate = (view: AppView) => {
    if (onNavigate) {
      onNavigate(view)
    } else {
      window.location.hash = view
    }
  }

  const handleBookClick = (book: HomeRecommendedBookData) => {
    if (onBookSelect) {
      onBookSelect(book)
    } else {
      handleNavigate('discover')
    }
  }

  return (
    <div className="home-page">
      {/* 1. Personalized Greeting Header */}
      <header className="home-greeting-section">
        <h1 className="home-greeting-title">
          Good morning, <span className="home-greeting-name">{userName}.</span>
        </h1>
        <p className="home-greeting-subtitle">
          {data.user.subtitle || 'A little time for yourself, and perhaps a good book.'}
        </p>
      </header>

      {/* 2. Mood / Intent Prompt */}
      <MoodPrompt onExploreMood={() => handleNavigate('discover')} />

      {/* 3. Continue Reading */}
      <section className="home-section" aria-labelledby="continue-reading-heading">
        <SectionHeader
          title="Continue Reading"
          seeAllHref="#library"
          onSeeAllClick={() => handleNavigate('library')}
        />
        <ContinueReadingCard
          readingData={data.currentlyReading}
          onContinueReading={() => handleNavigate('library')}
        />
      </section>

      {/* 4. Recommended for You */}
      <section className="home-section" aria-labelledby="recommended-heading">
        <SectionHeader
          title="Recommended for You"
          seeAllHref="#discover/recommended"
          onSeeAllClick={() => handleNavigate('discover/recommended')}
        />

        <div className="home-recommended-grid">
          {data.recommendedBooks.map((book) => (
            <HomeBookCard
              key={book.id}
              book={book}
              onClick={handleBookClick}
            />
          ))}
        </div>
      </section>

      {/* 5. Based on your reading */}
      <ReadingReason reason={data.recommendationReason} />

      {/* 6. Your Reading This Month */}
      <ReadingStats
        stats={data.readingStats}
        onViewInsights={() => handleNavigate('insights')}
      />

      {/* 7. Recent Activity */}
      <RecentActivity activities={data.recentActivity} />
    </div>
  )
}

export default HomePage
