import React, { useState } from 'react'
import type {
  OnboardingStep,
  OnboardingAnswers,
} from '../../types/onboarding'
import { READING_PURPOSES, READING_FREQUENCIES } from '../../types/onboarding'
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout'
import { WelcomeStep } from '../../components/onboarding/WelcomeStep'
import { OnboardingOptionCard } from '../../components/onboarding/OnboardingOptionCard'
import { GenreSelector } from '../../components/onboarding/GenreSelector'
import { ReadingNeedStep } from '../../components/onboarding/ReadingNeedStep'
import { IntegrationStep } from '../../components/onboarding/IntegrationStep'

export interface OnboardingPageProps {
  onFinish?: (answers: OnboardingAnswers) => void
  onSkipToHome?: () => void
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  onFinish,
  onSkipToHome,
}) => {
  const [step, setStep] = useState<OnboardingStep>(0)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  const [answers, setAnswers] = useState<OnboardingAnswers>({
    readingPurpose: undefined,
    favoriteGenres: [],
    readingFrequency: undefined,
    currentReadingNeed: undefined,
    customReadingNeed: '',
    libraryImports: [],
    connectedTools: [],
  })

  // Validation according to step requirements
  const isCurrentStepValid = (): boolean => {
    switch (step) {
      case 1:
        return Boolean(answers.readingPurpose)
      case 2:
        return answers.favoriteGenres.length >= 1
      case 3:
        return Boolean(answers.readingFrequency)
      case 4:
        if (!answers.currentReadingNeed) return false
        if (answers.currentReadingNeed === 'Something else') {
          return Boolean(answers.customReadingNeed?.trim())
        }
        return true
      case 5:
        // Integration step is completely optional and skippable
        return true
      default:
        return true
    }
  }

  const handleNext = () => {
    if (!isCurrentStepValid()) {
      if (step === 1) {
        setErrorMessage('Please select what brings you to Verba to continue.')
      } else if (step === 2) {
        setErrorMessage('Please select at least one genre to continue.')
      } else if (step === 3) {
        setErrorMessage('Please select how reading fits into your life.')
      } else if (step === 4) {
        setErrorMessage(
          answers.currentReadingNeed === 'Something else'
            ? 'Please enter your custom reading need to continue.'
            : 'Please select what kind of book you need today.'
        )
      }
      return
    }

    setErrorMessage(undefined)
    if (step < 5) {
      setStep((prev) => (prev + 1) as OnboardingStep)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    setErrorMessage(undefined)
    if (step > 1) {
      setStep((prev) => (prev - 1) as OnboardingStep)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleComplete = () => {
    setErrorMessage(undefined)
    if (onFinish) {
      onFinish(answers)
    } else if (onSkipToHome) {
      onSkipToHome()
    }
  }

  // Question headers for steps 1-5
  const stepQuestions: Record<number, string> = {
    1: 'What brings you to Verba?',
    2: 'What genres do you enjoy reading?',
    3: 'How does reading fit into your life?',
    4: 'What kind of book do you need today?',
    5: 'Bring your reading history with you.',
  }

  // Screen 0: Welcome Screen
  if (step === 0) {
    return <WelcomeStep onStart={() => setStep(1)} onSkip={onSkipToHome} />
  }

  return (
    <OnboardingLayout
      currentStep={step}
      question={stepQuestions[step]}
      onBack={handleBack}
      onNext={handleNext}
      onSkip={handleComplete}
      onFinish={handleComplete}
      isNextDisabled={!isCurrentStepValid()}
      errorMessage={errorMessage}
    >
      {/* Step 1: Reading Purpose */}
      {step === 1 && (
        <div
          className="onboarding-options-list"
          role="radiogroup"
          aria-label="What brings you to Verba?"
        >
          {READING_PURPOSES.map((purpose) => (
            <OnboardingOptionCard
              key={purpose}
              label={purpose}
              selected={answers.readingPurpose === purpose}
              onClick={() => {
                setAnswers((prev) => ({ ...prev, readingPurpose: purpose }))
                setErrorMessage(undefined)
              }}
            />
          ))}
        </div>
      )}

      {/* Step 2: Genres */}
      {step === 2 && (
        <GenreSelector
          selectedGenres={answers.favoriteGenres}
          onToggleGenre={(genre) => {
            setAnswers((prev) => {
              const exists = prev.favoriteGenres.includes(genre)
              const updated = exists
                ? prev.favoriteGenres.filter((g) => g !== genre)
                : [...prev.favoriteGenres, genre]
              return { ...prev, favoriteGenres: updated }
            })
            setErrorMessage(undefined)
          }}
        />
      )}

      {/* Step 3: Reading Frequency */}
      {step === 3 && (
        <div
          className="onboarding-options-list"
          role="radiogroup"
          aria-label="How does reading fit into your life?"
        >
          {READING_FREQUENCIES.map((freq) => (
            <OnboardingOptionCard
              key={freq}
              label={freq}
              selected={answers.readingFrequency === freq}
              onClick={() => {
                setAnswers((prev) => ({ ...prev, readingFrequency: freq }))
                setErrorMessage(undefined)
              }}
            />
          ))}
        </div>
      )}

      {/* Step 4: Current Reading Need */}
      {step === 4 && (
        <ReadingNeedStep
          selectedNeed={answers.currentReadingNeed}
          customNeed={answers.customReadingNeed}
          onSelectNeed={(need) => {
            setAnswers((prev) => ({ ...prev, currentReadingNeed: need }))
            setErrorMessage(undefined)
          }}
          onChangeCustomNeed={(value) => {
            setAnswers((prev) => ({
              ...prev,
              customReadingNeed: value,
              currentReadingNeed: 'Something else',
            }))
            setErrorMessage(undefined)
          }}
        />
      )}

      {/* Step 5: Reading History & Tool Preferences */}
      {step === 5 && (
        <IntegrationStep
          libraryImports={answers.libraryImports}
          connectedTools={answers.connectedTools}
          onToggleLibrary={(id) => {
            setAnswers((prev) => {
              const exists = prev.libraryImports.includes(id)
              const updated = exists
                ? prev.libraryImports.filter((item) => item !== id)
                : [...prev.libraryImports, id]
              return { ...prev, libraryImports: updated }
            })
          }}
          onToggleTool={(id) => {
            setAnswers((prev) => {
              const exists = prev.connectedTools.includes(id)
              const updated = exists
                ? prev.connectedTools.filter((item) => item !== id)
                : [...prev.connectedTools, id]
              return { ...prev, connectedTools: updated }
            })
          }}
        />
      )}
    </OnboardingLayout>
  )
}

export default OnboardingPage
