import React, { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import type {
  ProfileSectionId,
  UserProfileData,
  ReadingPreferencesData,
  ConnectedAccountItem,
  ConnectionProviderId,
  ReadingDNAMetrics,
  AccountPrivacySettings,
} from '../../types/profile'
import { profileService } from '../../services/profile/profileService'
import { ProfileSidebarNav } from './components/ProfileSidebarNav'
import { ReadingDNASection } from './components/ReadingDNASection'
import { ProfileInformationSection } from './components/ProfileInformationSection'
import { ReadingPreferencesSection } from './components/ReadingPreferencesSection'
import { ConnectedAccountsSection } from './components/ConnectedAccountsSection'
import { AccountPrivacySection } from './components/AccountPrivacySection'

export interface ProfilePageProps {
  initialSection?: ProfileSectionId
  onNavigateToInsights?: () => void
  onSignOut?: () => void
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  initialSection = 'reading-dna',
  onNavigateToInsights,
  onSignOut,
}) => {
  const [activeSection, setActiveSection] = useState<ProfileSectionId>(() => {
    const hash = window.location.hash
    if (hash.includes('section=')) {
      const match = hash.match(/section=([a-z-]+)/)
      if (match && match[1]) {
        return match[1] as ProfileSectionId
      }
    }
    return initialSection
  })

  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfileData | null>(null)
  const [preferences, setPreferences] = useState<ReadingPreferencesData | null>(null)
  const [accounts, setAccounts] = useState<ConnectedAccountItem[]>([])
  const [dnaMetrics, setDnaMetrics] = useState<ReadingDNAMetrics | null>(null)
  const [privacy, setPrivacy] = useState<AccountPrivacySettings | null>(null)

  useEffect(() => {
    let isCancelled = false

    const fetchAllData = async () => {
      try {
        const [p, pref, acc, dna, priv] = await Promise.all([
          profileService.getProfile(),
          profileService.getPreferences(),
          profileService.getConnectedAccounts(),
          profileService.getReadingDNAMetrics(),
          profileService.getPrivacySettings(),
        ])
        if (!isCancelled) {
          setProfile(p)
          setPreferences(pref)
          setAccounts(acc)
          setDnaMetrics(dna)
          setPrivacy(priv)
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('[Verba Profile] Error loading data:', err)
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchAllData()

    return () => {
      isCancelled = true
    }
  }, [])

  const handleSelectSection = (section: ProfileSectionId) => {
    setActiveSection(section)
    window.location.hash = `profile?section=${section}`
  }

  const handleSaveProfile = async (updates: Partial<UserProfileData>) => {
    const updated = await profileService.updateProfile(updates)
    setProfile(updated)
    return updated
  }

  const handleSavePreferences = async (updates: Partial<ReadingPreferencesData>) => {
    const updated = await profileService.updatePreferences(updates)
    setPreferences(updated)
    return updated
  }

  const handleToggleConnection = async (
    provider: ConnectionProviderId,
    targetState: boolean
  ) => {
    const updated = await profileService.toggleAccountConnection(provider, targetState)
    const freshAccounts = await profileService.getConnectedAccounts()
    setAccounts(freshAccounts)
    return updated
  }

  const handleUpdatePrivacy = async (updates: Partial<AccountPrivacySettings>) => {
    const updated = await profileService.updatePrivacySettings(updates)
    setPrivacy(updated)
    return updated
  }

  const handleRefreshDNA = async () => {
    const updated = await profileService.getReadingDNAMetrics()
    setDnaMetrics(updated)
  }

  const handleImportCompleted = async () => {
    const [acc, dna] = await Promise.all([
      profileService.getConnectedAccounts(),
      profileService.getReadingDNAMetrics(),
    ])
    setAccounts(acc)
    setDnaMetrics(dna)
  }

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut()
    } else {
      window.location.hash = 'signin'
    }
  }

  if (isLoading || !profile || !preferences || !dnaMetrics || !privacy) {
    return (
      <div
        className="profile-page-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 'var(--space-3)',
        }}
      >
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          Loading your reading profile...
        </span>
      </div>
    )
  }

  return (
    <div className="profile-page-container">
      {/* 1. Page Heading and Subtitle */}
      <header className="profile-page-header">
        <span className="profile-eyebrow" aria-hidden="true">
          SETTINGS & PREFERENCES
        </span>
        <h1 className="profile-main-title">
          Your <span className="profile-title-accent">Profile</span>
        </h1>
        <p className="profile-main-subtitle">
          Your reading identity, preferences, and account, all in one place.
        </p>
      </header>

      {/* 2. Two-Column Settings Layout */}
      <div className="profile-layout-grid">
        {/* Left Column: Persistent Section Navigation */}
        <aside className="profile-sidebar-column">
          <ProfileSidebarNav
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
          />
        </aside>

        {/* Right Column: Selected Settings Section */}
        <main className="profile-content-area" id="profile-content-region">
          {activeSection === 'reading-dna' && (
            <ReadingDNASection
              metrics={dnaMetrics}
              onRefreshDNA={handleRefreshDNA}
              onViewInsights={onNavigateToInsights}
            />
          )}

          {activeSection === 'profile-info' && (
            <ProfileInformationSection
              initialProfile={profile}
              onSaveProfile={handleSaveProfile}
            />
          )}

          {activeSection === 'reading-preferences' && (
            <ReadingPreferencesSection
              initialPreferences={preferences}
              onSavePreferences={handleSavePreferences}
            />
          )}

          {activeSection === 'connected-accounts' && (
            <ConnectedAccountsSection
              accounts={accounts}
              onToggleConnection={handleToggleConnection}
              onImportCompleted={handleImportCompleted}
            />
          )}

          {activeSection === 'account-privacy' && (
            <AccountPrivacySection
              settings={privacy}
              onUpdateSettings={handleUpdatePrivacy}
              onNavigateSection={handleSelectSection}
              onSignOut={handleSignOut}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default ProfilePage
