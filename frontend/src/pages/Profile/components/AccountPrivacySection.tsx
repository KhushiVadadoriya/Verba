import React, { useState } from 'react'
import {
  User,
  Bell,
  Eye,
  Download,
  LogOut,
  ChevronRight,
  Shield,
  Loader2,
  Check,
} from 'lucide-react'
import type {
  AccountPrivacySettings,
  ProfileSectionId,
} from '../../../types/profile'
import { profileService } from '../../../services/profile/profileService'

export interface AccountPrivacySectionProps {
  settings: AccountPrivacySettings
  onUpdateSettings: (
    updated: Partial<AccountPrivacySettings>
  ) => Promise<AccountPrivacySettings>
  onNavigateSection: (section: ProfileSectionId) => void
  onSignOut: () => void
}

export const AccountPrivacySection: React.FC<AccountPrivacySectionProps> = ({
  settings,
  onUpdateSettings,
  onNavigateSection,
  onSignOut,
}) => {
  const [currentSettings, setCurrentSettings] =
    useState<AccountPrivacySettings>(settings)
  const [isExporting, setIsExporting] = useState(false)
  const [exportNotice, setExportNotice] = useState<string | null>(null)
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)

  const handleToggleNotification = async (
    key: keyof AccountPrivacySettings['notifications']
  ) => {
    const updated = {
      ...currentSettings,
      notifications: {
        ...currentSettings.notifications,
        [key]: !currentSettings.notifications[key],
      },
    }
    setCurrentSettings(updated)
    await onUpdateSettings(updated)
  }

  const handleTogglePrivacyFlag = async (
    key: 'shareReadingActivity' | 'includeInReadingwrapped' | 'allowAIPersonalization'
  ) => {
    const updated = {
      ...currentSettings,
      [key]: !currentSettings[key],
    }
    setCurrentSettings(updated)
    await onUpdateSettings(updated)
  }

  const handleExportData = async () => {
    setIsExporting(true)
    setExportNotice(null)
    try {
      const dataStr = await profileService.exportUserData()
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `verba-reading-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setExportNotice('Your complete reading data archive was successfully exported.')
    } catch (err) {
      console.error('[Verba Profile] Export error:', err)
      setExportNotice('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div
      className="profile-section-panel"
      role="tabpanel"
      id="section-panel-account-privacy"
      aria-labelledby="tab-account-privacy"
    >
      <div className="profile-section-header">
        <div>
          <h2 className="profile-section-title">Account & Privacy</h2>
          <p className="profile-section-subtitle">
            Manage your account security, notification channels, data controls, and session.
          </p>
        </div>
      </div>

      {exportNotice && (
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: 'var(--color-success-bg)',
            border: '1px solid var(--color-success-border)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--color-success)',
            fontSize: 'var(--text-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
          role="status"
        >
          <Check size={16} />
          <span>{exportNotice}</span>
        </div>
      )}

      <div className="settings-rows-list">
        {/* Row 1: Edit Profile Shortcut */}
        <div
          className="settings-row"
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateSection('profile-info')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onNavigateSection('profile-info')
          }}
        >
          <div className="settings-row-left">
            <div className="settings-row-icon">
              <User size={18} />
            </div>
            <div>
              <div className="settings-row-title">Edit Profile Information</div>
              <div className="settings-row-desc">
                Update name, public handle, avatar, and personal reading statement.
              </div>
            </div>
          </div>
          <ChevronRight size={18} style={{ color: 'var(--color-text-tertiary)' }} />
        </div>

        {/* Row 2: Reading Reminders */}
        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-row-icon">
              <Bell size={18} />
            </div>
            <div>
              <div className="settings-row-title">Reading Pace Reminders</div>
              <div className="settings-row-desc">
                Receive thoughtful nudges when you’ve set aside evening reading time.
              </div>
            </div>
          </div>
          <label className="switch-control" aria-label="Toggle Reading Pace Reminders">
            <input
              type="checkbox"
              checked={currentSettings.notifications.readingReminders}
              onChange={() => handleToggleNotification('readingReminders')}
            />
            <span className="switch-slider" />
          </label>
        </div>

        {/* Row 3: Goal Milestones */}
        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-row-icon">
              <Bell size={18} />
            </div>
            <div>
              <div className="settings-row-title">Monthly Goal Milestones</div>
              <div className="settings-row-desc">
                Celebratory milestone notifications when completing books toward your goal.
              </div>
            </div>
          </div>
          <label className="switch-control" aria-label="Toggle Goal Milestones">
            <input
              type="checkbox"
              checked={currentSettings.notifications.goalReminders}
              onChange={() => handleToggleNotification('goalReminders')}
            />
            <span className="switch-slider" />
          </label>
        </div>

        {/* Row 4: Reading Activity Privacy */}
        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-row-icon plum">
              <Eye size={18} />
            </div>
            <div>
              <div className="settings-row-title">Share Reading Activity in Community</div>
              <div className="settings-row-desc">
                Allow your finished book ratings to contribute to community genre trends.
              </div>
            </div>
          </div>
          <label className="switch-control" aria-label="Toggle Reading Activity Privacy">
            <input
              type="checkbox"
              checked={currentSettings.shareReadingActivity}
              onChange={() => handleTogglePrivacyFlag('shareReadingActivity')}
            />
            <span className="switch-slider" />
          </label>
        </div>

        {/* Row 5: AI Personalization Engine */}
        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-row-icon">
              <Shield size={18} />
            </div>
            <div>
              <div className="settings-row-title">AI Personalization & Reading DNA</div>
              <div className="settings-row-desc">
                Allow Verba to synthesize your journal reflections to calibrate recommendations.
              </div>
            </div>
          </div>
          <label className="switch-control" aria-label="Toggle AI Personalization">
            <input
              type="checkbox"
              checked={currentSettings.allowAIPersonalization}
              onChange={() => handleTogglePrivacyFlag('allowAIPersonalization')}
            />
            <span className="switch-slider" />
          </label>
        </div>

        {/* Row 6: Reading Wrapped Inclusions */}
        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-row-icon plum">
              <Eye size={18} />
            </div>
            <div>
              <div className="settings-row-title">Include in Annual Reading Wrapped</div>
              <div className="settings-row-desc">
                Synthesize yearly reading statistics, top books, and memory collages.
              </div>
            </div>
          </div>
          <label className="switch-control" aria-label="Toggle Reading Wrapped Inclusions">
            <input
              type="checkbox"
              checked={currentSettings.includeInReadingwrapped}
              onChange={() => handleTogglePrivacyFlag('includeInReadingwrapped')}
            />
            <span className="switch-slider" />
          </label>
        </div>

        {/* Row 7: Data Export */}
        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-row-icon">
              <Download size={18} />
            </div>
            <div>
              <div className="settings-row-title">Download Reading Archive (JSON)</div>
              <div className="settings-row-desc">
                Export all books, personal journal reflections, ratings, and preferences.
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleExportData}
            disabled={isExporting}
            style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-2) var(--space-4)' }}
          >
            {isExporting ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              'Export Data'
            )}
          </button>
        </div>
      </div>

      {/* Sign Out Card */}
      <div className="danger-zone-card" style={{ marginTop: 'var(--space-4)' }}>
        <div>
          <h4
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: 2,
            }}
          >
            Account Session
          </h4>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            Signing out will end your current session on this device.
          </p>
        </div>

        {showSignOutConfirm ? (
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setShowSignOutConfirm(false)}
              style={{ fontSize: 'var(--text-xs)' }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn"
              onClick={onSignOut}
              style={{
                backgroundColor: 'var(--color-error)',
                color: '#fff',
                fontSize: 'var(--text-xs)',
                borderRadius: 'var(--radius-full)',
                padding: 'var(--space-2) var(--space-4)',
              }}
            >
              Confirm Sign Out
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setShowSignOutConfirm(true)}
            style={{
              fontSize: 'var(--text-xs)',
              borderColor: 'rgba(197, 48, 48, 0.4)',
              color: 'var(--color-error)',
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  )
}
