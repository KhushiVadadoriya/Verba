/**
 * Verba Design System - Insights Data Types
 * Strongly typed models for reading analytics, patterns, insights, and annual Wrapped.
 */

export type TimeRangeOption = '3m' | '6m' | '1y'

export interface TimeRangeConfig {
  id: TimeRangeOption
  label: string
  periodLabel: string
  shortLabel: string
}

export interface ReadingOverviewStats {
  booksRead: number
  avgRating: number
  genresExplored: number
  periodLabel: string
}

export interface GenrePatternItem {
  id: string
  genre: string
  percentage: number
  bookCount: number
  color?: string
}

export interface MoodPatternItem {
  id: string
  mood: string
  percentage: number
  count: number
  color?: string
}

export interface ReadingInsightItem {
  id: string
  iconType: 'heart' | 'sprout' | 'sun' | 'sparkles' | 'compass' | 'book'
  statement: string
  statementHighlight?: string
  description: string
  descriptionHighlight?: string
}

export interface WrappedBookHighlight {
  id: string
  title: string
  author: string
  coverUrl: string
  genre?: string
  accentColor?: string
  bgGradient?: string
  rating?: number
}

export interface ReadingWrappedData {
  year: number
  totalBooksRead: number
  totalPagesRead: number
  avgRating: number
  topGenre: string
  topMood: string
  readingStreakDays: number
  favoriteQuote?: string
  showcaseBooks: WrappedBookHighlight[]
}

export interface InsightsData {
  timeRange: TimeRangeOption
  overview: ReadingOverviewStats
  genrePatterns: GenrePatternItem[]
  moodPatterns: MoodPatternItem[]
  insights: ReadingInsightItem[]
  wrapped: ReadingWrappedData
}
