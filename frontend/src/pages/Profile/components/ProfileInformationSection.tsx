import React, { useState } from 'react'
import {
  Upload,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import type { UserProfileData } from '../../../types/profile'

export interface ProfileInformationSectionProps {
  initialProfile: UserProfileData
  onSaveProfile: (updated: Partial<UserProfileData>) => Promise<UserProfileData>
}

export const ProfileInformationSection: React.FC<ProfileInformationSectionProps> = ({
  initialProfile,
  onSaveProfile,
}) => {
  const [name, setName] = useState(initialProfile.name || '')
  const [displayName, setDisplayName] = useState(initialProfile.displayName || '')
  const [email] = useState(initialProfile.email || '')
  const [bio, setBio] = useState(initialProfile.bio || '')
  const [readingIdentity, setReadingIdentity] = useState(
    initialProfile.readingIdentity || ''
  )
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    initialProfile.avatarUrl
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Character limits
  const BIO_LIMIT = 240
  const IDENTITY_LIMIT = 80

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP).')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Image size should be under 2MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setAvatarUrl(event.target?.result as string)
      setSuccessMessage('Photo selected. Click "Save Changes" to persist.')
      setErrorMessage(null)
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    setAvatarUrl(undefined)
    setSuccessMessage('Photo removed. Click "Save Changes" to persist.')
    setErrorMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage(null)
    setErrorMessage(null)

    if (!name.trim()) {
      setErrorMessage('Name cannot be empty.')
      return
    }

    setIsSubmitting(true)
    try {
      await onSaveProfile({
        name: name.trim(),
        displayName: displayName.trim(),
        bio: bio.trim(),
        readingIdentity: readingIdentity.trim(),
        avatarUrl,
      })
      setSuccessMessage('Your profile information was updated successfully.')
    } catch (err) {
      console.error('[Verba Profile] Error saving profile:', err)
      setErrorMessage('Failed to save profile changes. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="profile-section-panel"
      role="tabpanel"
      id="section-panel-profile-info"
      aria-labelledby="tab-profile-info"
    >
      <div className="profile-section-header">
        <div>
          <h2 className="profile-section-title">Profile Information</h2>
          <p className="profile-section-subtitle">
            Manage your personal details and how you present yourself on Verba.
          </p>
        </div>
      </div>

      <form className="profile-form-layout" onSubmit={handleSubmit}>
        {/* Status Feedbacks */}
        {successMessage && (
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
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div
            style={{
              padding: 'var(--space-3) var(--space-4)',
              backgroundColor: 'var(--color-error-bg)',
              border: '1px solid var(--color-error-border)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--color-error)',
              fontSize: 'var(--text-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
            role="alert"
          >
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Profile Avatar Row */}
        <div className="profile-photo-uploader">
          <div className="profile-avatar-display" aria-hidden="true">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name || 'User avatar'} />
            ) : (
              <span>{(name || 'V').charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div className="profile-photo-controls">
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}
            >
              Profile Photo
            </span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-1)',
              }}
            >
              Recommended format: PNG, JPG, or WEBP up to 2MB.
            </span>

            <div className="profile-photo-buttons">
              <label
                className="btn btn-outline"
                style={{
                  cursor: 'pointer',
                  fontSize: 'var(--text-xs)',
                  padding: 'var(--space-2) var(--space-3)',
                }}
              >
                <Upload size={14} />
                <span>Change Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFile}
                  style={{ display: 'none' }}
                />
              </label>

              {avatarUrl && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleRemovePhoto}
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-error)',
                    padding: 'var(--space-2) var(--space-3)',
                  }}
                >
                  <Trash2 size={14} />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Name & Display Name Fields */}
        <div className="profile-field-grid">
          <div className="profile-field-group">
            <label htmlFor="profile-name-input" className="profile-field-label">
              Full Name
            </label>
            <input
              id="profile-name-input"
              type="text"
              className="profile-field-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="profile-field-group">
            <label htmlFor="profile-display-name" className="profile-field-label">
              Display Name / Handle
            </label>
            <input
              id="profile-display-name"
              type="text"
              className="profile-field-input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Khushi Vadadoriya"
            />
          </div>
        </div>

        {/* Email Address (Read-only authentication attribute) */}
        <div className="profile-field-group">
          <label htmlFor="profile-email-input" className="profile-field-label">
            Email Address
          </label>
          <input
            id="profile-email-input"
            type="email"
            className="profile-field-input"
            value={email}
            disabled
            style={{
              backgroundColor: 'var(--color-surface-muted)',
              color: 'var(--color-text-secondary)',
              cursor: 'not-allowed',
            }}
          />
          <span className="profile-field-help">
            Used for authentication and security notifications. Contact support to change.
          </span>
        </div>

        {/* Reading Identity Headline */}
        <div className="profile-field-group">
          <div className="profile-field-label-row">
            <label htmlFor="profile-reading-id" className="profile-field-label">
              Reading Identity Tagline
            </label>
            <span className="profile-field-counter">
              {readingIdentity.length}/{IDENTITY_LIMIT}
            </span>
          </div>
          <input
            id="profile-reading-id"
            type="text"
            className="profile-field-input"
            maxLength={IDENTITY_LIMIT}
            value={readingIdentity}
            onChange={(e) => setReadingIdentity(e.target.value)}
            placeholder="e.g. The Introspective Explorer · Fiction & Psychology"
          />
          <span className="profile-field-help">
            A concise signature summarizing your reading focus across Verba.
          </span>
        </div>

        {/* Bio Textarea */}
        <div className="profile-field-group">
          <div className="profile-field-label-row">
            <label htmlFor="profile-bio-input" className="profile-field-label">
              Reader Bio
            </label>
            <span className="profile-field-counter">
              {bio.length}/{BIO_LIMIT}
            </span>
          </div>
          <textarea
            id="profile-bio-input"
            className="profile-field-textarea"
            maxLength={BIO_LIMIT}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell fellow readers about your favorite tropes, themes, or literary obsessions..."
          />
          <span className="profile-field-help">
            Brief overview of your personal reading journey.
          </span>
        </div>

        {/* Submit Actions */}
        <div className="profile-form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ minWidth: 140 }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
