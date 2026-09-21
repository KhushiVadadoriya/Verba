import React, { useRef } from 'react'
import { READING_NEEDS } from '../../types/onboarding'
import { OnboardingOptionCard } from './OnboardingOptionCard'

export interface ReadingNeedStepProps {
  selectedNeed?: string
  customNeed?: string
  onSelectNeed: (need: string) => void
  onChangeCustomNeed: (value: string) => void
}

export const ReadingNeedStep: React.FC<ReadingNeedStepProps> = ({
  selectedNeed,
  customNeed = '',
  onSelectNeed,
  onChangeCustomNeed,
}) => {
  const customInputRef = useRef<HTMLInputElement>(null)
  const isCustomSelected = selectedNeed === 'Something else'

  const handleCustomCardClick = () => {
    onSelectNeed('Something else')
    // Focus the underline input
    setTimeout(() => {
      customInputRef.current?.focus()
    }, 50)
  }

  return (
    <div
      className="onboarding-options-list"
      role="radiogroup"
      aria-label="What kind of book do you need today?"
    >
      {READING_NEEDS.map((need) => (
        <OnboardingOptionCard
          key={need}
          label={need}
          selected={selectedNeed === need}
          onClick={() => onSelectNeed(need)}
        />
      ))}

      {/* 6th Option: Something else with underline input */}
      <OnboardingOptionCard
        label="Something else"
        selected={isCustomSelected}
        onClick={handleCustomCardClick}
      >
        <div className="onboarding-custom-input-wrapper">
          <span>Something else:</span>
          <input
            ref={customInputRef}
            type="text"
            className="onboarding-custom-input"
            value={customNeed}
            onChange={(e) => {
              onChangeCustomNeed(e.target.value)
              if (selectedNeed !== 'Something else') {
                onSelectNeed('Something else')
              }
            }}
            onClick={(e) => {
              e.stopPropagation()
              onSelectNeed('Something else')
            }}
            placeholder="tell us here"
            aria-label="Specify custom book need"
          />
        </div>
      </OnboardingOptionCard>
    </div>
  )
}

export default ReadingNeedStep
