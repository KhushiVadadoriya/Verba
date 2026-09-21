import React from 'react'
import verbaLogo from '../../assets/verba-logo.png'

export interface WelcomeStepProps {
  onStart: () => void
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onStart }) => {
  return (
    <div className="onboarding-page">
      <main className="onboarding-container" role="region" aria-label="Welcome to Verba">
        <div className="welcome-card">
          {/* Official Brand Logo using the established clipping wrapper */}
          <div className="auth-logo-icon">
            <img src={verbaLogo} alt="Verba Logo" />
          </div>

          {/* Heading: Welcome to Verba */}
          <h1 className="welcome-heading">
            Welcome to <span className="welcome-wordmark">Verba</span>
          </h1>

          {/* Subtitle */}
          <p className="welcome-subtitle">
            Help us personalize your reading experience.
          </p>

          {/* Primary Get Started Action */}
          <button
            type="button"
            className="welcome-start-btn"
            onClick={onStart}
            autoFocus
          >
            Get Started
          </button>
        </div>
      </main>
    </div>
  )
}

export default WelcomeStep
