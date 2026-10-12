/**
 * Verba Insights Data Service
 * Provides reading analytics, genre & mood distributions, editorial insight generation,
 * and annual Wrapped calculations.
 */

import type {
  TimeRangeOption,
  TimeRangeConfig,
  InsightsData,
  ReadingOverviewStats,
  GenrePatternItem,
  MoodPatternItem,
  ReadingInsightItem,
  ReadingWrappedData,
} from '../../types/insights'

export const TIME_RANGE_CONFIGS: Record<TimeRangeOption, TimeRangeConfig> = {
  '3m': {
    id: '3m',
    label: 'Last 3 months',
    shortLabel: '3M',
    periodLabel: 'the last 3 months',
  },
  '6m': {
    id: '6m',
    label: '6 months',
    shortLabel: '6M',
    periodLabel: 'the last 6 months',
  },
  '1y': {
    id: '1y',
    label: '1 year',
    shortLabel: '1Y',
    periodLabel: 'the last year',
  },
}

// Curated book showcase for Wrapped and visual collages
const WRAPPED_SHOWCASE_BOOKS = [
  {
    id: 'wrap-1',
    title: 'The Renovation',
    author: 'Kenan Orhan',
    coverUrl: 'https://covers.openlibrary.org/b/id/12886416-L.jpg',
    genre: 'Fiction',
    accentColor: '#16817A',
    bgGradient: 'linear-gradient(175deg, #1B998B 0%, #16697A 60%, #0F4C5C 100%)',
    rating: 4.5,
  },
  {
    id: 'wrap-2',
    title: 'Normal People',
    author: 'Sally Rooney',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780571334650-L.jpg',
    genre: 'Contemporary',
    accentColor: '#E87A90',
    bgGradient: 'linear-gradient(165deg, #F8B4C0 0%, #E87A90 100%)',
    rating: 4.8,
  },
  {
    id: 'wrap-3',
    title: 'Blue Sisters',
    author: 'Coco Mellors',
    coverUrl: 'https://covers.openlibrary.org/b/id/14467000-L.jpg',
    genre: 'Literary Fiction',
    accentColor: '#4A6FA5',
    bgGradient: 'linear-gradient(165deg, #4A6FA5 0%, #2E384D 100%)',
    rating: 4.2,
  },
  {
    id: 'wrap-4',
    title: 'Small Comfort',
    author: 'Ia Genberg',
    coverUrl: 'https://covers.openlibrary.org/b/id/12547191-L.jpg',
    genre: 'Psychology',
    accentColor: '#DDA15E',
    bgGradient: 'linear-gradient(170deg, #F6E2BB 0%, #E9C46A 40%, #DDA15E 100%)',
    rating: 4.0,
  },
  {
    id: 'wrap-5',
    title: 'Book Lovers',
    author: 'Emily Henry',
    coverUrl: 'https://covers.openlibrary.org/b/id/12693825-L.jpg',
    genre: 'Romance',
    accentColor: '#F7B801',
    bgGradient: 'linear-gradient(180deg, #F9DC5C 0%, #F4A261 40%, #E76F51 75%, #9F3E76 100%)',
    rating: 4.3,
  },
]

const CURRENT_YEAR = new Date().getFullYear()

export const WRAPPED_MOCK_DATA: ReadingWrappedData = {
  year: CURRENT_YEAR,
  totalBooksRead: 28,
  totalPagesRead: 8420,
  avgRating: 4.2,
  topGenre: 'Fiction & Psychology',
  topMood: 'Thoughtful',
  readingStreakDays: 24,
  favoriteQuote:
    '“A story is a room with an infinite number of doorways, each opening into another human soul.”',
  showcaseBooks: WRAPPED_SHOWCASE_BOOKS,
}

// Datasets categorized by time range
const INSIGHTS_DATASET: Record<TimeRangeOption, {
  overview: ReadingOverviewStats
  genrePatterns: GenrePatternItem[]
  moodPatterns: MoodPatternItem[]
  insights: ReadingInsightItem[]
}> = {
  '3m': {
    overview: {
      booksRead: 8,
      avgRating: 4.1,
      genresExplored: 5,
      periodLabel: 'the last 3 months',
    },
    genrePatterns: [
      { id: 'g-fiction', genre: 'Fiction', percentage: 42, bookCount: 3, color: '#48479e' },
      { id: 'g-psychology', genre: 'Psychology', percentage: 24, bookCount: 2, color: '#6851a4' },
      { id: 'g-romance', genre: 'Romance', percentage: 15, bookCount: 1, color: '#9f3e76' },
      { id: 'g-contemporary', genre: 'Contemporary', percentage: 10, bookCount: 1, color: '#b34d85' },
      { id: 'g-fantasy', genre: 'Fantasy', percentage: 9, bookCount: 1, color: '#c7669a' },
    ],
    moodPatterns: [
      { id: 'm-thoughtful', mood: 'Thoughtful', percentage: 36, count: 5, color: '#48479e' },
      { id: 'm-comforting', mood: 'Comforting', percentage: 28, count: 4, color: '#6851a4' },
      { id: 'm-curious', mood: 'Curious', percentage: 18, count: 2, color: '#9f3e76' },
      { id: 'm-emotional', mood: 'Emotional', percentage: 12, count: 2, color: '#b34d85' },
      { id: 'm-escapist', mood: 'Escapist', percentage: 6, count: 1, color: '#c7669a' },
    ],
    insights: [
      {
        id: 'ins-1',
        iconType: 'heart',
        statement: 'You gravitate toward emotionally layered stories.',
        statementHighlight: 'emotionally layered',
        description: 'Your recent reading often explores relationships, identity and personal growth.',
        descriptionHighlight: 'personal growth',
      },
      {
        id: 'ins-2',
        iconType: 'sprout',
        statement: 'You’ve been exploring beyond your usual genres.',
        statementHighlight: 'beyond your usual genres',
        description: 'You read books from 5 different genres in the last 3 months, showing a more diverse reading journey.',
        descriptionHighlight: 'diverse reading journey',
      },
      {
        id: 'ins-3',
        iconType: 'sun',
        statement: 'You tend to choose thoughtful, comforting reads.',
        statementHighlight: 'thoughtful, comforting',
        description: 'Themes of self-discovery, human connection and everyday life appear frequently in your reading moods.',
        descriptionHighlight: 'human connection',
      },
    ],
  },
  '6m': {
    overview: {
      booksRead: 15,
      avgRating: 4.3,
      genresExplored: 7,
      periodLabel: 'the last 6 months',
    },
    genrePatterns: [
      { id: 'g-fiction', genre: 'Fiction', percentage: 38, bookCount: 6, color: '#48479e' },
      { id: 'g-psychology', genre: 'Psychology', percentage: 26, bookCount: 4, color: '#6851a4' },
      { id: 'g-litfic', genre: 'Literary Fiction', percentage: 16, bookCount: 2, color: '#9f3e76' },
      { id: 'g-romance', genre: 'Romance', percentage: 12, bookCount: 2, color: '#b34d85' },
      { id: 'g-memoir', genre: 'Memoir', percentage: 8, bookCount: 1, color: '#c7669a' },
    ],
    moodPatterns: [
      { id: 'm-thoughtful', mood: 'Thoughtful', percentage: 34, count: 8, color: '#48479e' },
      { id: 'm-reflective', mood: 'Reflective', percentage: 26, count: 6, color: '#6851a4' },
      { id: 'm-comforting', mood: 'Comforting', percentage: 20, count: 5, color: '#9f3e76' },
      { id: 'm-emotional', mood: 'Emotional', percentage: 14, count: 3, color: '#b34d85' },
      { id: 'm-inspiring', mood: 'Inspiring', percentage: 6, count: 2, color: '#c7669a' },
    ],
    insights: [
      {
        id: 'ins-1',
        iconType: 'heart',
        statement: 'A sustained rhythm of deep, introspective narratives.',
        statementHighlight: 'introspective narratives',
        description: 'Over the last 6 months, psychological depth and character memoirs have anchored your library.',
        descriptionHighlight: 'psychological depth',
      },
      {
        id: 'ins-2',
        iconType: 'sprout',
        statement: 'Consistent reading habit with broadening horizons.',
        statementHighlight: 'broadening horizons',
        description: 'You maintained a steady 2.5 books per month pace across 7 distinct literary genres.',
        descriptionHighlight: '7 distinct literary genres',
      },
      {
        id: 'ins-3',
        iconType: 'sun',
        statement: 'Reflective and uplifting reading balance.',
        statementHighlight: 'uplifting reading balance',
        description: 'You naturally balance heavier emotional inquiries with comforting, soul-stirring prose.',
        descriptionHighlight: 'soul-stirring prose',
      },
    ],
  },
  '1y': {
    overview: {
      booksRead: 28,
      avgRating: 4.2,
      genresExplored: 9,
      periodLabel: 'the last year',
    },
    genrePatterns: [
      { id: 'g-fiction', genre: 'Fiction', percentage: 40, bookCount: 11, color: '#48479e' },
      { id: 'g-psychology', genre: 'Psychology', percentage: 22, bookCount: 6, color: '#6851a4' },
      { id: 'g-memoir', genre: 'Memoir', percentage: 14, bookCount: 4, color: '#9f3e76' },
      { id: 'g-contemporary', genre: 'Contemporary', percentage: 12, bookCount: 4, color: '#b34d85' },
      { id: 'g-fantasy', genre: 'Sci-Fi / Fantasy', percentage: 12, bookCount: 3, color: '#c7669a' },
    ],
    moodPatterns: [
      { id: 'm-thoughtful', mood: 'Thoughtful', percentage: 32, count: 14, color: '#48479e' },
      { id: 'm-comforting', mood: 'Comforting', percentage: 25, count: 11, color: '#6851a4' },
      { id: 'm-inspiring', mood: 'Inspiring', percentage: 20, count: 9, color: '#9f3e76' },
      { id: 'm-emotional', mood: 'Emotional', percentage: 15, count: 7, color: '#b34d85' },
      { id: 'm-curious', mood: 'Curious', percentage: 8, count: 4, color: '#c7669a' },
    ],
    insights: [
      {
        id: 'ins-1',
        iconType: 'heart',
        statement: 'A prolific year of literary discovery and emotional resonance.',
        statementHighlight: 'literary discovery',
        description: '28 books completed with an exceptional 4.2 average rating highlight your discerning taste.',
        descriptionHighlight: 'discerning taste',
      },
      {
        id: 'ins-2',
        iconType: 'sprout',
        statement: 'Curiosity led you into 9 rich genres.',
        statementHighlight: '9 rich genres',
        description: 'From psychological inquiries to imaginative speculative fiction, your reading palette expanded.',
        descriptionHighlight: 'reading palette expanded',
      },
      {
        id: 'ins-3',
        iconType: 'sun',
        statement: 'Stories that kindle reflection and empathy.',
        statementHighlight: 'reflection and empathy',
        description: 'Thoughtful and comforting reads formed over 57% of your annual literary reflections.',
        descriptionHighlight: 'annual literary reflections',
      },
    ],
  },
}

export class InsightsService {
  /**
   * Fetch insights data for a specific time range.
   * Simulates a fast asynchronous fetch with clean fallback data.
   */
  public static async getInsights(timeRange: TimeRangeOption = '3m'): Promise<InsightsData> {
    // Brief async micro-delay for realistic interactive feel
    await new Promise((resolve) => setTimeout(resolve, 80))

    const dataset = INSIGHTS_DATASET[timeRange] || INSIGHTS_DATASET['3m']

    return {
      timeRange,
      overview: { ...dataset.overview },
      genrePatterns: [...dataset.genrePatterns],
      moodPatterns: [...dataset.moodPatterns],
      insights: [...dataset.insights],
      wrapped: { ...WRAPPED_MOCK_DATA },
    }
  }

  /**
   * Check if user has reading data or should see empty state
   */
  public static hasReadingData(data: InsightsData | null): boolean {
    if (!data) return false
    return data.overview.booksRead > 0
  }
}

export default InsightsService
