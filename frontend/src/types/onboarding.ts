/**
 * Verba Onboarding Types
 */

export type OnboardingStep = 0 | 1 | 2 | 3 | 4 | 5

export interface OnboardingAnswers {
  readingPurpose?: string
  favoriteGenres: string[]
  readingFrequency?: string
  currentReadingNeed?: string
  customReadingNeed?: string
  libraryImports: string[]
  connectedTools: string[]
}

export const READING_PURPOSES: string[] = [
  'Find books that match my mood',
  'Track my reading journey',
  'Discover books outside my comfort zone',
  'Reflect more deeply on what I read',
]

export const GENRES: string[] = [
  'Literary Fiction',
  'Sci-Fi & Fantasy',
  'Mystery & Thriller',
  'Historical Fiction',
  'Non-Fiction',
  'Memoir & Biography',
  'Philosophy',
  'Poetry',
]

export const READING_FREQUENCIES: string[] = [
  'I read every day',
  'A few times a week',
  'A couple of books a month',
  'I read occasionally',
  'Trying to build a reading habit',
]

export const READING_NEEDS: string[] = [
  'Something uplifting',
  'A comforting read',
  'A thought-provoking book',
  'A page-turner',
  'Escape into another world',
]

export const LIBRARY_IMPORT_OPTIONS = [
  { id: 'goodreads', name: 'Goodreads', label: 'goodreads' },
  { id: 'storygraph', name: 'The StoryGraph', label: 'THE STORYGRAPH' },
] as const

export const CONNECTED_TOOL_OPTIONS = [
  { id: 'google_books', name: 'Google Books', label: 'Google Books' },
  { id: 'notion', name: 'Notion', label: 'Notion' },
  { id: 'hardcover', name: 'Hardcover', label: 'Hardcover' },
] as const
