import React from 'react'

export interface OnboardingOptionCardProps {
  label: string
  selected: boolean
  onClick: () => void
  children?: React.ReactNode
}

export const OnboardingOptionCard: React.FC<OnboardingOptionCardProps> = ({
  label,
  selected,
  onClick,
  children,
}) => {
  return (
    <button
      type="button"
      className="onboarding-option-card"
      onClick={onClick}
      aria-pressed={selected}
    >
      {children || <span>{label}</span>}
    </button>
  )
}

export default OnboardingOptionCard
