import React from 'react'

export interface StepIndicatorProps {
  totalSteps: number
  currentStep: number
  onStepClick?: (step: number) => void
  className?: string
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  totalSteps,
  currentStep,
  onStepClick,
  className = '',
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)

  return (
    <nav
      className={`step-indicator ${className}`}
      aria-label="Onboarding Progress"
    >
      {steps.map((step) => {
        const isActive = step === currentStep
        const isClickable = Boolean(onStepClick)

        return (
          <button
            key={step}
            type="button"
            className={`step-dot ${isActive ? 'active' : ''}`}
            onClick={() => onStepClick?.(step)}
            disabled={!isClickable}
            aria-label={`Step ${step} of ${totalSteps}`}
            aria-current={isActive ? 'step' : undefined}
            style={{ cursor: isClickable ? 'pointer' : 'default' }}
          />
        )
      })}
    </nav>
  )
}

export default StepIndicator
