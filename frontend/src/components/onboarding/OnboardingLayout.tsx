import React from 'react'
import verbaLogo from '../../assets/verba-logo.png'
import type { OnboardingStep } from '../../types/onboarding'

export interface OnboardingLayoutProps {
  currentStep: OnboardingStep
  question?: string
  children: React.ReactNode
  onBack?: () => void
  onNext?: () => void
  onSkip?: () => void
  onFinish?: () => void
  isNextDisabled?: boolean
  nextLabel?: string
  skipLabel?: string
  errorMessage?: string
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  currentStep,
  question,
  children,
  onBack,
  onNext,
  onSkip,
  onFinish,
  isNextDisabled = false,
  nextLabel = 'Next →',
  skipLabel = 'Skip for now',
  errorMessage,
}) => {
  // Step 0 does not display dots or question within the layout (it has custom Welcome layout)
  const isNumberedStep = currentStep >= 1 && currentStep <= 5

  return (
    <div className="onboarding-page">
      <main className="onboarding-container" role="region" aria-label="Onboarding step">
        {/* Official Brand Logo using the established clipping wrapper */}
        <div
          className="auth-logo-icon"
          style={{ marginBottom: isNumberedStep ? 'var(--space-5)' : 'var(--space-6)' }}
        >
          <img src={verbaLogo} alt="Verba Logo" />
        </div>

        {/* 5-Dot Progress Indicator for numbered steps (1 to 5) */}
        {isNumberedStep && (
          <nav className="onboarding-progress" aria-label={`Step ${currentStep} of 5`}>
            {[1, 2, 3, 4, 5].map((stepNumber) => {
              const isActive = stepNumber === currentStep
              return (
                <div
                  key={stepNumber}
                  className={`onboarding-dot ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'step' : undefined}
                  role="presentation"
                />
              )
            })}
          </nav>
        )}

        {/* Question Heading */}
        {question && <h1 className="onboarding-question">{question}</h1>}

        {/* Interactive Step Content */}
        {children}

        {/* Validation Warning if attempted to continue */}
        {errorMessage && (
          <p className="onboarding-validation-notice" role="alert">
            {errorMessage}
          </p>
        )}

        {/* Bottom Navigation for Numbered Steps */}
        {isNumberedStep && (
          <nav className="onboarding-nav" aria-label="Step Navigation">
            {/* Left Action: Skip for now on step 5, or Back on steps 2-4 */}
            {currentStep === 5 ? (
              <button
                type="button"
                className="onboarding-nav-btn"
                onClick={onSkip}
                aria-label="Skip integrations step"
              >
                {skipLabel}
              </button>
            ) : currentStep > 1 ? (
              <button
                type="button"
                className="onboarding-nav-btn back"
                onClick={onBack}
                aria-label="Go to previous step"
              >
                ← Back
              </button>
            ) : (
              <div style={{ width: '40px' }} aria-hidden="true" />
            )}

            {/* Right Action: Finish on step 5, or Next on steps 1-4 */}
            {currentStep === 5 ? (
              <button
                type="button"
                className="onboarding-nav-btn"
                onClick={onFinish}
                aria-label="Finish onboarding"
              >
                Finish →
              </button>
            ) : (
              <button
                type="button"
                className="onboarding-nav-btn"
                onClick={onNext}
                disabled={isNextDisabled}
                aria-label="Go to next step"
              >
                {nextLabel}
              </button>
            )}
          </nav>
        )}
      </main>
    </div>
  )
}

export default OnboardingLayout
