import React from 'react'

export interface MoodPromptProps {
  onExploreMood?: () => void
  className?: string
}

export const MoodPrompt: React.FC<MoodPromptProps> = ({
  onExploreMood,
  className = '',
}) => {
  return (
    <section className={`home-mood-card ${className}`} aria-labelledby="mood-prompt-heading">
      <h2 id="mood-prompt-heading" className="home-mood-title">
        WHAT ARE YOU IN THE MOOD FOR?
      </h2>
      <p className="home-mood-subtitle">
        Find a book that meets you where you are.
      </p>
      <button
        type="button"
        className="home-mood-btn"
        onClick={onExploreMood}
        aria-label="Explore books by mood"
      >
        <span>Explore by mood</span>
        <span aria-hidden="true">&rarr;</span>
      </button>
    </section>
  )
}

export default MoodPrompt
