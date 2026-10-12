/**
 * Verba Profile & Settings Type Definitions
 * Models user profile, reading preferences, connected accounts, reading DNA, and account privacy.
 */

import type { GenreName } from './genres'

export type ProfileSectionId =
  | 'reading-dna'
  | 'profile-info'
  | 'reading-preferences'
  | 'connected-accounts'
  | 'account-privacy'

export interface UserProfileData {
  id: string
  name: string
  displayName?: string
  email: string
  avatarUrl?: string
  bio: string
  readingIdentity: string // Short description of reading interests / identity
  createdAt: string
  updatedAt: string
}

export type ReadingPace = 'casual' | 'regular' | 'avid' | 'voracious'

export interface ReadingPreferencesData {
  monthlyBookGoal: number
  annualBookGoal: number
  readingPace: ReadingPace
  preferredMoods: string[]
  preferredGenres: (GenreName | string)[]
  primaryLanguage: string
  themePreference: 'light' // Verba's signature literary aesthetic
  updatedAt: string
}

export type ConnectionProviderId = 'google_books' | 'notion' | 'hardcover'
export type ImportSourceId = 'goodreads' | 'storygraph' | 'manual'

// Kept for backward compatibility
export type IntegrationProviderId = ConnectionProviderId | 'goodreads' | 'storygraph'

export type ConnectionStatus = 'connected' | 'disconnected' | 'syncing' | 'error' | 'coming_soon'

export interface ConnectedAccountItem {
  id: ConnectionProviderId
  name: string
  tagline: string
  description: string
  status: ConnectionStatus
  connectedAt?: string
  lastSyncedAt?: string
  externalUsername?: string
}

export interface ReadingDNAArchetype {
  id: string
  title: string
  badgeLabel: string
  summary: string
  description: string
  coreTraits: string[]
  quote: string
  accentColor: string
}

export interface ReadingTendencyMetric {
  category: string
  percentage: number
  count: number
  color: string
}

export interface ReadingDNAMetrics {
  booksRead: number
  avgRating: number
  topGenre: string
  keyTheme: string
  archetype: ReadingDNAArchetype | null
  tendencies: ReadingTendencyMetric[]
  revealsSummary: string
  hasEnoughData: boolean
}

export interface AccountPrivacySettings {
  profileVisibility: 'public' | 'community' | 'private'
  shareReadingActivity: boolean
  includeInReadingwrapped: boolean
  allowAIPersonalization: boolean
  notifications: {
    readingReminders: boolean
    goalReminders: boolean
    productUpdates: boolean
    emailDigest: boolean
  }
}

export interface ImportedBookPreview {
  title: string
  author: string
  status?: string
  rating?: number
  finishedAt?: string
}

export interface ImportValidationResult {
  fileName: string
  fileSize: number
  provider: ImportSourceId
  totalRows: number
  validBooksCount: number
  skippedDuplicatesCount: number
  preview: ImportedBookPreview[]
}
