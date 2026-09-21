import { useState, useEffect } from 'react'
import { LandingPage } from './pages/Landing'
import { SignInPage, SignUpPage } from './pages/Auth'
import { OnboardingPage } from './pages/Onboarding'
import { DiscoverPage } from './pages/Discover'
import { RecommendedPage } from './pages/Recommended'
import { GenresPage } from './pages/Genres'
import { AppLayout } from './layouts/AppLayout'
import type { NavItemKey } from './components/layout/Navbar'
import type { OnboardingAnswers } from './types/onboarding'

export type AppView =
  | 'landing'
  | 'signin'
  | 'signup'
  | 'onboarding'
  | 'home'
  | 'discover'
  | 'discover/recommended'
  | 'discover/genres'
  | 'insights'
  | 'library'
  | 'profile'

function App() {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const hash = window.location.hash.toLowerCase()
    if (hash === '#signin') return 'signin'
    if (hash === '#signup') return 'signup'
    if (hash === '#onboarding') return 'onboarding'
    if (hash === '#home') return 'home'
    if (hash === '#discover/recommended') return 'discover/recommended'
    if (hash === '#discover/genres') return 'discover/genres'
    if (hash === '#discover') return 'discover'
    if (hash === '#insights') return 'insights'
    if (hash === '#library') return 'library'
    if (hash === '#profile') return 'profile'
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
      else if (hash === '#discover/recommended') setCurrentView('discover/recommended')
      else if (hash === '#discover/genres') setCurrentView('discover/genres')
      else if (hash === '#discover') setCurrentView('discover')
      else if (hash === '#insights') setCurrentView('insights')
      else if (hash === '#library') setCurrentView('library')
      else if (hash === '#profile') setCurrentView('profile')
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
    else if (view === 'discover/recommended') window.location.hash = 'discover/recommended'
    else if (view === 'discover/genres') window.location.hash = 'discover/genres'
    else if (view === 'discover') window.location.hash = 'discover'
    else if (view === 'insights') window.location.hash = 'insights'
    else if (view === 'library') window.location.hash = 'library'
    else if (view === 'profile') window.location.hash = 'profile'
    else window.location.hash = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // --- Auth & Onboarding Flows (Preserved) ---

  if (currentView === 'signin') {
    return (
      <SignInPage
        onNavigateToSignUp={() => navigateTo('signup')}
        onBackToHome={() => navigateTo('landing')}
        onSignInSuccess={() => {
          navigateTo('discover')
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
          // Redirect to #discover when onboarding is completed
          navigateTo('discover')
        }}
        onSkipToHome={() => {
          // Redirect to #discover when onboarding is skipped
          navigateTo('discover')
        }}
      />
    )
  }

  // --- Authenticated App Shell: Recommended for You Page ---

  if (currentView === 'discover/recommended') {
    return (
      <AppLayout
        activeNav="discover"
        onNavigate={(key: NavItemKey) => navigateTo(key as AppView)}
      >
        <RecommendedPage
          onBackToDiscover={() => navigateTo('discover')}
        />
      </AppLayout>
    )
  }

  // --- Authenticated App Shell: Explore by Genre Page ---

  if (currentView === 'discover/genres') {
    return (
      <AppLayout
        activeNav="discover"
        onNavigate={(key: NavItemKey) => navigateTo(key as AppView)}
      >
        <GenresPage
          onBackToDiscover={() => navigateTo('discover')}
        />
      </AppLayout>
    )
  }

  // --- Authenticated App Shell: Discover Page ---

  if (currentView === 'discover') {
    return (
      <AppLayout
        activeNav="discover"
        onNavigate={(key: NavItemKey) => navigateTo(key as AppView)}
      >
        <DiscoverPage
          onSeeAllRecommended={() => navigateTo('discover/recommended')}
          onSeeAllGenres={() => navigateTo('discover/genres')}
        />
      </AppLayout>
    )
  }

  // --- Authenticated App Shell: Placeholder Views (Home, Insights, Library, Profile) ---

  const isPlaceholderAuthView = ['home', 'insights', 'library', 'profile'].includes(currentView)
  if (isPlaceholderAuthView) {
    const placeholderContent: Record<
      string,
      { title: string; subtitle: string; description: string }
    > = {
      home: {
        title: 'Home Sanctuary',
        subtitle: 'Personalized Daily Literary Feed',
        description:
          'Your customized reading intelligence dashboard is in active development for Phase 5.',
      },
      insights: {
        title: 'Literary Insights',
        subtitle: 'Patterns, Themes & Emotional Journey',
        description:
          'Reading statistics, mood analytics, and reflection journals will be available here soon.',
      },
      library: {
        title: 'My Library',
        subtitle: 'Bookshelf & Reading Vault',
        description:
          'Track your current reads, organize thematic bookshelves, and review notes in Phase 5.',
      },
      profile: {
        title: 'Reader Profile',
        subtitle: 'Personalized Reading DNA',
        description:
          'Configure reading pace goals, aesthetic themes, and account preferences.',
      },
    }

    const currentInfo = placeholderContent[currentView] || placeholderContent.home

    return (
      <AppLayout
        activeNav={currentView as NavItemKey}
        onNavigate={(key: NavItemKey) => navigateTo(key as AppView)}
      >
        <div className="placeholder-page-card">
          <h1
            style={{
              fontFamily: 'var(--font-roman, var(--font-serif))',
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: 400,
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-2)',
            }}
          >
            {currentInfo.title}
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--color-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 'var(--space-4)',
            }}
          >
            {currentInfo.subtitle}
          </p>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)',
              maxWidth: '480px',
              margin: '0 auto var(--space-6)',
              lineHeight: 1.6,
            }}
          >
            {currentInfo.description}
            {currentView === 'home' && savedAnswers && (
              <span style={{ display: 'block', marginTop: 'var(--space-3)' }}>
                Onboarding Selected Genres:{' '}
                <strong style={{ color: 'var(--color-primary)' }}>
                  {savedAnswers.favoriteGenres.length > 0
                    ? savedAnswers.favoriteGenres.join(', ')
                    : 'None selected'}
                </strong>
              </span>
            )}
          </p>

          <button
            type="button"
            className="btn-primary"
            onClick={() => navigateTo('discover')}
          >
            Explore Discover Page
          </button>
        </div>
      </AppLayout>
    )
  }

  // --- Landing Page (Default Public Route) ---

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
