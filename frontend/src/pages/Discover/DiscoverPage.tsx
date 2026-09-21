import React, { useState } from 'react'
import { SearchBar } from '../../components/common/SearchBar'
import { SectionHeader } from '../../components/common/SectionHeader'
import { GenreChips } from '../../components/common/GenreChips'
import { BookCarousel } from '../../components/books/BookCarousel'
import type { BookCardData } from '../../components/books/BookCard'

// Mock book dataset reflecting the mockup titles and authors
export const RECOMMENDED_BOOKS: BookCardData[] = [
  {
    id: 'rec-1',
    title: 'The Renovation',
    author: 'Kenan Orhan',
    coverUrl: 'https://covers.openlibrary.org/b/id/12886416-L.jpg',
    bgGradient: 'linear-gradient(175deg, #1B998B 0%, #16697A 60%, #0F4C5C 100%)',
    accentColor: '#16817A',
  },
  {
    id: 'rec-2',
    title: 'Book Lovers',
    author: 'Emily Henry',
    coverUrl: 'https://covers.openlibrary.org/b/id/12693825-L.jpg',
    bgGradient: 'linear-gradient(180deg, #F9DC5C 0%, #F4A261 40%, #E76F51 75%, #9F3E76 100%)',
    accentColor: '#F7B801',
  },
  {
    id: 'rec-3',
    title: 'Blue Sisters',
    author: 'Coco Mellors',
    coverUrl: 'https://covers.openlibrary.org/b/id/14467000-L.jpg',
    bgGradient: 'linear-gradient(165deg, #4A6FA5 0%, #2E384D 100%)',
    accentColor: '#4A6FA5',
  },
  {
    id: 'rec-4',
    title: 'Small Comfort',
    author: 'Ia Genberg',
    coverUrl: 'https://covers.openlibrary.org/b/id/12547191-L.jpg',
    bgGradient: 'linear-gradient(170deg, #F6E2BB 0%, #E9C46A 40%, #DDA15E 100%)',
    accentColor: '#DDA15E',
  },
  {
    id: 'rec-5',
    title: 'The Gifts of Imperfection',
    author: 'Brené Brown',
    coverUrl: 'https://covers.openlibrary.org/b/id/10523456-L.jpg',
    bgGradient: 'linear-gradient(160deg, #264653 0%, #2A9D8F 60%, #1D3557 100%)',
    accentColor: '#2A9D8F',
  },
  {
    id: 'rec-6',
    title: 'Book Lovers',
    author: 'Emily Henry',
    coverUrl: 'https://covers.openlibrary.org/b/id/12693825-L.jpg',
    bgGradient: 'linear-gradient(180deg, #F9DC5C 0%, #F4A261 40%, #E76F51 75%, #9F3E76 100%)',
    accentColor: '#F7B801',
  },
]

export const TRENDING_BOOKS: BookCardData[] = [
  {
    id: 'trend-1',
    title: 'The Renovation',
    author: 'Kenan Orhan',
    coverUrl: 'https://covers.openlibrary.org/b/id/12886416-L.jpg',
    bgGradient: 'linear-gradient(175deg, #1B998B 0%, #16697A 60%, #0F4C5C 100%)',
    accentColor: '#16817A',
  },
  {
    id: 'trend-2',
    title: 'Book Lovers',
    author: 'Emily Henry',
    coverUrl: 'https://covers.openlibrary.org/b/id/12693825-L.jpg',
    bgGradient: 'linear-gradient(180deg, #F9DC5C 0%, #F4A261 40%, #E76F51 75%, #9F3E76 100%)',
    accentColor: '#F7B801',
  },
  {
    id: 'trend-3',
    title: 'Blue Sisters',
    author: 'Coco Mellors',
    coverUrl: 'https://covers.openlibrary.org/b/id/14467000-L.jpg',
    bgGradient: 'linear-gradient(165deg, #4A6FA5 0%, #2E384D 100%)',
    accentColor: '#4A6FA5',
  },
  {
    id: 'trend-4',
    title: 'Small Comfort',
    author: 'Ia Genberg',
    coverUrl: 'https://covers.openlibrary.org/b/id/12547191-L.jpg',
    bgGradient: 'linear-gradient(170deg, #F6E2BB 0%, #E9C46A 40%, #DDA15E 100%)',
    accentColor: '#DDA15E',
  },
  {
    id: 'trend-5',
    title: 'The Gifts of Imperfection',
    author: 'Brené Brown',
    coverUrl: 'https://covers.openlibrary.org/b/id/10523456-L.jpg',
    bgGradient: 'linear-gradient(160deg, #264653 0%, #2A9D8F 60%, #1D3557 100%)',
    accentColor: '#2A9D8F',
  },
  {
    id: 'trend-6',
    title: 'Book Lovers',
    author: 'Emily Henry',
    coverUrl: 'https://covers.openlibrary.org/b/id/12693825-L.jpg',
    bgGradient: 'linear-gradient(180deg, #F9DC5C 0%, #F4A261 40%, #E76F51 75%, #9F3E76 100%)',
    accentColor: '#F7B801',
  },
]


export interface DiscoverPageProps {
  onBookSelect?: (book: BookCardData) => void
  onSeeAllRecommended?: () => void
  onSeeAllGenres?: () => void
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  onBookSelect,
  onSeeAllRecommended,
  onSeeAllGenres,
}) => {
  const [booksSearch, setBooksSearch] = useState('')
  const [moodSearch, setMoodSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

  const handleGenreToggle = (genre: string) => {
    setSelectedGenre((prev) => (prev === genre ? null : genre))
  }

  const handleSeeAllRec = () => {
    if (onSeeAllRecommended) {
      onSeeAllRecommended()
    } else {
      window.location.hash = 'discover/recommended'
    }
  }

  const handleSeeAllGenres = () => {
    if (onSeeAllGenres) {
      onSeeAllGenres()
    } else {
      window.location.hash = 'discover/genres'
    }
  }

  return (
    <div className="discover-page">
      {/* 1. Dual Search Bar: Books & Mood */}
      <SearchBar
        booksValue={booksSearch}
        moodValue={moodSearch}
        onBooksChange={(e) => setBooksSearch(e.target.value)}
        onMoodChange={(e) => setMoodSearch(e.target.value)}
      />

      {/* 2. Recommended for you Section */}
      <section aria-labelledby="recommended-heading">
        <SectionHeader
          title="Recommended for you"
          seeAllHref="#discover/recommended"
          onSeeAllClick={handleSeeAllRec}
        />
        <BookCarousel
          books={RECOMMENDED_BOOKS}
          onBookClick={onBookSelect}
          ariaLabel="Recommended for you books"
        />
      </section>

      {/* 3. Explore by genre Section */}
      <section aria-labelledby="genre-heading">
        <SectionHeader
          title="Explore by genre"
          seeAllHref="#discover/genres"
          onSeeAllClick={handleSeeAllGenres}
        />
        <GenreChips
          selectedGenre={selectedGenre}
          onSelectGenre={handleGenreToggle}
        />
      </section>

      {/* 4. Trending now Section */}
      <section aria-labelledby="trending-heading">
        <SectionHeader
          title="Trending now"
          showSeeAll={false}
        />
        <BookCarousel
          books={TRENDING_BOOKS}
          onBookClick={onBookSelect}
          ariaLabel="Trending now books"
        />
      </section>
    </div>
  )
}

export default DiscoverPage
