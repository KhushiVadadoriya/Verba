export interface HomeUserData {
  name: string
  subtitle: string
}

export interface CurrentlyReadingData {
  id: string
  title: string
  author: string
  coverUrl: string
  accentColor?: string
  bgGradient?: string
  badgeText: string
  progressPercent: number
  ctaText: string
}

export interface HomeRecommendedBookData {
  id: string
  title: string
  author: string
  coverUrl: string
  bgGradient?: string
  accentColor?: string
}

export interface RecommendationReasonData {
  label: string
  text: string
  highlightedKeywords: string[]
}

export interface MonthlyReadingStatsData {
  booksRead: number
  streakDays: number
  goalCurrent: number
  goalTarget: number
}

export interface RecentActivityItemData {
  id: string
  type: 'finished' | 'review' | 'library'
  action: string
  bookTitle: string
  timestamp: string
}

export interface HomeData {
  user: HomeUserData
  currentlyReading: CurrentlyReadingData
  recommendedBooks: HomeRecommendedBookData[]
  recommendationReason: RecommendationReasonData
  readingStats: MonthlyReadingStatsData
  recentActivity: RecentActivityItemData[]
}

export const HOME_MOCK_DATA: HomeData = {
  user: {
    name: 'Khushi',
    subtitle: 'A little time for yourself, and perhaps a good book.',
  },
  currentlyReading: {
    id: 'reading-renovation',
    title: 'The Renovation',
    author: 'Kenan Orhan',
    coverUrl: 'https://covers.openlibrary.org/b/id/12886416-L.jpg',
    bgGradient: 'linear-gradient(175deg, #1B998B 0%, #16697A 60%, #0F4C5C 100%)',
    accentColor: '#16817A',
    badgeText: 'Currently reading',
    progressPercent: 62,
    ctaText: 'Continue Reading →',
  },
  recommendedBooks: [
    {
      id: 'rec-normal-people',
      title: 'Normal People',
      author: 'Sally Rooney',
      coverUrl: 'https://covers.openlibrary.org/b/isbn/9780571334650-L.jpg',
      bgGradient: 'linear-gradient(165deg, #F8B4C0 0%, #E87A90 100%)',
      accentColor: '#E87A90',
    },
    {
      id: 'rec-blue-sisters',
      title: 'Blue Sisters',
      author: 'Coco Mellors',
      coverUrl: 'https://covers.openlibrary.org/b/id/14467000-L.jpg',
      bgGradient: 'linear-gradient(165deg, #4A6FA5 0%, #2E384D 100%)',
      accentColor: '#4A6FA5',
    },
    {
      id: 'rec-small-comfort',
      title: 'Small Comfort',
      author: 'I.A. Genberg',
      coverUrl: 'https://covers.openlibrary.org/b/id/12547191-L.jpg',
      bgGradient: 'linear-gradient(170deg, #F6E2BB 0%, #E9C46A 40%, #DDA15E 100%)',
      accentColor: '#DDA15E',
    },
    {
      id: 'rec-book-lovers',
      title: 'Book Lovers',
      author: 'Emily Henry',
      coverUrl: 'https://covers.openlibrary.org/b/id/12693825-L.jpg',
      bgGradient: 'linear-gradient(180deg, #F9DC5C 0%, #F4A261 40%, #E76F51 75%, #9F3E76 100%)',
      accentColor: '#F7B801',
    },
  ],
  recommendationReason: {
    label: 'BASED ON YOUR READING',
    text: '“Because you enjoy character-driven stories with emotional depth and themes of identity.”',
    highlightedKeywords: ['emotional depth', 'identity'],
  },
  readingStats: {
    booksRead: 3,
    streakDays: 7,
    goalCurrent: 5,
    goalTarget: 6,
  },
  recentActivity: [
    {
      id: 'act-1',
      type: 'finished',
      action: 'Finished reading',
      bookTitle: 'The Midnight Library',
      timestamp: 'Yesterday',
    },
    {
      id: 'act-2',
      type: 'review',
      action: 'Added a review for',
      bookTitle: 'Normal People',
      timestamp: '3 days ago',
    },
    {
      id: 'act-3',
      type: 'library',
      action: 'Added to your library',
      bookTitle: 'Circe',
      timestamp: '5 days ago',
    },
  ],
}
