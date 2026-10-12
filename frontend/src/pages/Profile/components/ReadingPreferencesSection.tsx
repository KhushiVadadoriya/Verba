import React, { useState } from 'react'
import { Check, AlertCircle, Loader2 } from 'lucide-react'
import type { ReadingPreferencesData, ReadingPace } from '../../../types/profile'
import { GENRE_OPTIONS } from '../../../types/genres'

export interface ReadingPreferencesSectionProps {
  initialPreferences: ReadingPreferencesData
  onSavePreferences: (
    updated: Partial<ReadingPreferencesData>
  ) => Promise<ReadingPreferencesData>
}

const SUPPORTED_MOODS = [
  'Reflective',
  'Thoughtful',
  'Comforting',
  'Curious',
  'Emotional',
  'Uplifting',
  'Escapist',
  'Atmospheric',
]

const READING_PACES: Array<{ id: ReadingPace; label: string; desc: string }> = [
  { id: 'casual', label: 'Casual', desc: '1 book/month · Relaxed reading' },
  { id: 'regular', label: 'Regular', desc: '2–3 books/month · Steady cadence' },
  { id: 'avid', label: 'Avid', desc: '4–5 books/month · High immersion' },
  { id: 'voracious', label: 'Voracious', desc: '6+ books/month · Daily devoted reader' },
]

export const ReadingPreferencesSection: React.FC<ReadingPreferencesSectionProps> = ({
  initialPreferences,
  onSavePreferences,
}) => {
  const [monthlyGoal, setMonthlyGoal] = useState<number>(
    initialPreferences.monthlyBookGoal || 3
  )
  const [readingPace, setReadingPace] = useState<ReadingPace>(
    initialPreferences.readingPace || 'regular'
  )
  const [selectedMoods, setSelectedMoods] = useState<string[]>(
    initialPreferences.preferredMoods || ['Reflective', 'Thoughtful']
  )
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    (initialPreferences.preferredGenres as string[]) || ['Fiction', 'Psychology']
  )
  const [primaryLanguage, setPrimaryLanguage] = useState<string>(
    initialPreferences.primaryLanguage || 'English'
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleToggleMood = (mood: string) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    )
  }

  const handleToggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage(null)
    setErrorMessage(null)

    if (selectedGenres.length === 0) {
      setErrorMessage('Please select at least one preferred genre.')
      return
    }

    setIsSubmitting(true)
    try {
      await onSavePreferences({
        monthlyBookGoal: Number(monthlyGoal),
        annualBookGoal: Number(monthlyGoal) * 12,
        readingPace,
        preferredMoods: selectedMoods,
        preferredGenres: selectedGenres,
        primaryLanguage,
      })
      setSuccessMessage('Your reading preferences were saved successfully.')
    } catch (err) {
      console.error('[Verba Profile] Error saving preferences:', err)
      setErrorMessage('Failed to save reading preferences. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="profile-section-panel"
      role="tabpanel"
      id="section-panel-reading-preferences"
      aria-labelledby="tab-reading-preferences"
    >
      <div className="profile-section-header">
        <div>
          <h2 className="profile-section-title">Reading Preferences</h2>
          <p className="profile-section-subtitle">
            Shape recommendations around your reading habits and the stories you want to discover.
          </p>
        </div>
      </div>

      <form className="preferences-container" onSubmit={handleSubmit}>
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

        {/* 1. Reading Goal & Pace */}
        <div className="preference-card-grid">
          <div className="profile-card">
            <h3
              style={{
                fontFamily: 'var(--font-roman, var(--font-serif))',
                fontSize: 'var(--text-base)',
                marginBottom: 'var(--space-1)',
              }}
            >
              Monthly Reading Target
            </h3>
            <p
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-3)',
              }}
            >
              How many books do you aim to finish each month?
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <input
                type="number"
                min={1}
                max={50}
                value={monthlyGoal}
                onChange={(e) => setMonthlyGoal(Math.max(1, parseInt(e.target.value) || 1))}
                className="profile-field-input"
                style={{ width: 100, textAlign: 'center', fontWeight: 600 }}
              />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                books / month ({monthlyGoal * 12} books annually)
              </span>
            </div>
          </div>

          <div className="profile-card">
            <h3
              style={{
                fontFamily: 'var(--font-roman, var(--font-serif))',
                fontSize: 'var(--text-base)',
                marginBottom: 'var(--space-1)',
              }}
            >
              Reading Pace
            </h3>
            <p
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-3)',
              }}
            >
              Your characteristic reading rhythm.
            </p>

            <select
              value={readingPace}
              onChange={(e) => setReadingPace(e.target.value as ReadingPace)}
              className="preference-select"
            >
              {READING_PACES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label} — {p.desc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Preferred Reading Moods */}
        <div className="profile-card">
          <h3
            style={{
              fontFamily: 'var(--font-roman, var(--font-serif))',
              fontSize: 'var(--text-base)',
              marginBottom: 'var(--space-1)',
            }}
          >
            Preferred Reading Moods
          </h3>
          <p
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-3)',
            }}
          >
            Select moods that best describe the emotional tone you seek in books.
          </p>

          <div className="mood-chips-container" role="group" aria-label="Reading Moods">
            {SUPPORTED_MOODS.map((mood) => {
              const isSelected = selectedMoods.includes(mood)
              return (
                <button
                  key={mood}
                  type="button"
                  aria-pressed={isSelected}
                  className={`preference-chip ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleToggleMood(mood)}
                >
                  {isSelected && <Check size={12} />}
                  <span>{mood}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 3. Genre Preferences */}
        <div className="profile-card">
          <h3
            style={{
              fontFamily: 'var(--font-roman, var(--font-serif))',
              fontSize: 'var(--text-base)',
              marginBottom: 'var(--space-1)',
            }}
          >
            Favorite Genres
          </h3>
          <p
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-3)',
            }}
          >
            Pick the genres you love most. Recommendations will prioritize these categories.
          </p>

          <div className="genre-chips-container" role="group" aria-label="Favorite Genres">
            {GENRE_OPTIONS.map((genre) => {
              const isSelected = selectedGenres.includes(genre)
              return (
                <button
                  key={genre}
                  type="button"
                  aria-pressed={isSelected}
                  className={`preference-chip ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleToggleGenre(genre)}
                >
                  {isSelected && <Check size={12} />}
                  <span>{genre}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 4. Language & Theme Settings */}
        <div className="preference-card-grid">
          <div className="profile-card">
            <h3
              style={{
                fontFamily: 'var(--font-roman, var(--font-serif))',
                fontSize: 'var(--text-base)',
                marginBottom: 'var(--space-1)',
              }}
            >
              Book Edition Language
            </h3>
            <p
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-3)',
              }}
            >
              Primary language for book recommendations and edition metadata.
            </p>

            <select
              value={primaryLanguage}
              onChange={(e) => setPrimaryLanguage(e.target.value)}
              className="preference-select"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="German">German (Deutsch)</option>
            </select>
          </div>

          <div className="profile-card">
            <h3
              style={{
                fontFamily: 'var(--font-roman, var(--font-serif))',
                fontSize: 'var(--text-base)',
                marginBottom: 'var(--space-1)',
              }}
            >
              Visual Aesthetic Theme
            </h3>
            <p
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-3)',
              }}
            >
              Verba uses an authentic editorial bookcloth aesthetic.
            </p>

            <select disabled className="preference-select" style={{ cursor: 'not-allowed' }}>
              <option value="light">Verba Literary Light (Active)</option>
            </select>
          </div>
        </div>

        {/* Actions */}
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
              <span>Save Preferences</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
