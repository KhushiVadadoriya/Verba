import { useState, useEffect } from 'react'
import { LandingPage } from './pages/Landing'
import { SignInPage, SignUpPage } from './pages/Auth'
import { OnboardingPage } from './pages/Onboarding'
import verbaLogo from './assets/verba-logo.png'
import type { OnboardingAnswers } from './types/onboarding'

export type AppView = 'landing' | 'signin' | 'signup' | 'onboarding' | 'home'

function App() {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const hash = window.location.hash.toLowerCase()
    if (hash === '#signin') return 'signin'
    if (hash === '#signup') return 'signup'
    if (hash === '#onboarding') return 'onboarding'
    if (hash === '#home') return 'home'
    return 'landing'
  })

  const [savedAnswers, setSavedAnswers] = useState<OnboardingAnswers | null>(null)

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase()
      if (hash === '#signin') setCurrentView('signin')
      else if (hash === '#signup') setCurrentView('signup')
      else if (hash === '#onboarding') setCurrentView('onboarding')
      else if (hash === '#home') setCurrentView('home')
      else if (
        hash === '#landing' ||
        hash === '' ||
        hash === '#about' ||
        hash === '#browse' ||
        hash === '#shelf'
      ) {
        setCurrentView('landing')
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigateTo = (view: AppView) => {
    setCurrentView(view)
    if (view === 'signin') window.location.hash = 'signin'
    else if (view === 'signup') window.location.hash = 'signup'
    else if (view === 'onboarding') window.location.hash = 'onboarding'
    else if (view === 'home') window.location.hash = 'home'
    else window.location.hash = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (currentView === 'signin') {
    return (
      <SignInPage
        onNavigateToSignUp={() => navigateTo('signup')}
        onBackToHome={() => navigateTo('landing')}
        onSignInSuccess={() => {
          navigateTo('home')
        }}
      />
    )
  }

  if (currentView === 'signup') {
    return (
      <SignUpPage
        onNavigateToSignIn={() => navigateTo('signin')}
        onBackToHome={() => navigateTo('landing')}
        onSignUpSuccess={() => {
          // Advance new sign-up directly to personalized onboarding
          navigateTo('onboarding')
        }}
      />
    )
  }

  if (currentView === 'onboarding') {
    return (
      <OnboardingPage
        onFinish={(answers) => {
          setSavedAnswers(answers)
          // Route completed onboarding directly to authenticated dashboard destination
          navigateTo('home')
        }}
        onSkipToHome={() => {
          navigateTo('home')
        }}
      />
    )
  }

  if (currentView === 'home') {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--color-bg-primary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-8) var(--space-4)',
          textAlign: 'center',
        }}
      >
        <div className="auth-logo-icon" style={{ marginBottom: 'var(--space-4)' }}>
          <img src={verbaLogo} alt="Verba Logo" />
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-roman, var(--font-serif))',
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 400,
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-3)',
          }}
        >
          Welcome to Your Sanctuary
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-secondary)',
            maxWidth: '520px',
            lineHeight: 1.6,
            marginBottom: 'var(--space-6)',
          }}
        >
          Your personalized reading intelligence profile has been configured.
          {savedAnswers && (
            <span style={{ display: 'block', marginTop: 'var(--space-2)' }}>
              Selected genres:{' '}
              <strong style={{ color: 'var(--color-primary)' }}>
                {savedAnswers.favoriteGenres.length > 0
                  ? savedAnswers.favoriteGenres.join(', ')
                  : 'None selected'}
              </strong>
            </span>
          )}
        </p>

        <div
          style={{
            padding: 'var(--space-3) var(--space-6)',
            backgroundColor: 'rgba(72, 71, 158, 0.08)',
            border: '1px solid rgba(72, 71, 158, 0.2)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-6)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-primary)',
          }}
        >
          Authenticated Dashboard Placeholder (Phase 5 / Library Feature)
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            type="button"
            className="welcome-start-btn"
            onClick={() => navigateTo('landing')}
            style={{ marginTop: 0 }}
          >
            Explore Landing Page
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={() => navigateTo('onboarding')}
            style={{
              padding: '12px 28px',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-base)',
            }}
          >
            Restart Onboarding
          </button>
        </div>
      </div>
    )
  }

  return (
    <LandingPage
      onGetStarted={() => navigateTo('signup')}
      onSignIn={() => navigateTo('signin')}
      onBrowse={() => {
        const shelf = document.querySelector('.bookshelf-showcase')
        shelf?.scrollIntoView({ behavior: 'smooth' })
      }}
      onShelf={() => {
        const shelf = document.querySelector('.bookshelf-showcase')
        shelf?.scrollIntoView({ behavior: 'smooth' })
      }}
      onAbout={() => {
        const about = document.getElementById('about')
        about?.scrollIntoView({ behavior: 'smooth' })
      }}
    />
  )
}

export default App
