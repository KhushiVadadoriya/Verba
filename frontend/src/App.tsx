import { useState, useEffect } from 'react'
import { LandingPage } from './pages/Landing'
import { SignInPage, SignUpPage } from './pages/Auth'
import { OnboardingPage } from './pages/Onboarding'
import { DiscoverPage } from './pages/Discover'
import { RecommendedPage } from './pages/Recommended'
import { GenresPage } from './pages/Genres'
import { HomePage } from './pages/Home'
import { AppLayout } from './layouts/AppLayout'
import type { NavItemKey } from './components/layout/Navbar'
import type { OnboardingAnswers } from './types/onboarding'
import { toGenreSlug } from './types/genres'

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

export const parseHashRoute = (rawHash: string): AppView => {
  const clean = rawHash.replace(/^#/, '')
  const [routePath] = clean.split('?')
  const path = routePath.toLowerCase()

  if (path === 'signin') return 'signin'
  if (path === 'signup') return 'signup'
  if (path === 'onboarding') return 'onboarding'
  if (path === 'home') return 'home'
  if (path === 'discover/recommended') return 'discover/recommended'
  if (path === 'discover/genres') return 'discover/genres'
  if (path === 'discover') return 'discover'
  if (path === 'insights') return 'insights'
  if (path === 'library') return 'library'
  if (path === 'profile') return 'profile'
  return 'landing'
}

function App() {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    return parseHashRoute(window.location.hash)
  })

  const [savedAnswers, setSavedAnswers] = useState<OnboardingAnswers | null>(null)

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentView(parseHashRoute(window.location.hash))
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigateTo = (view: AppView, queryParams?: Record<string, string>) => {
    setCurrentView(view)
    if (view === 'landing') {
      window.location.hash = ''
    } else {
      let hash = view
      if (queryParams && Object.keys(queryParams).length > 0) {
        const qs = new URLSearchParams(queryParams).toString()
        hash += `?${qs}`
      }
      window.location.hash = hash
    }
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
          onSelectGenre={(genre) => {
            const slug = toGenreSlug(genre)
            navigateTo('discover/genres', { genre: slug })
          }}
        />
      </AppLayout>
    )
  }

  // --- Authenticated App Shell: Home Dashboard Page ---

  if (currentView === 'home') {
    return (
      <AppLayout
        activeNav="home"
        onNavigate={(key: NavItemKey) => navigateTo(key as AppView)}
      >
        <HomePage
          userName={savedAnswers ? 'Khushi' : 'Khushi'}
          onNavigate={(view: AppView) => navigateTo(view)}
        />
      </AppLayout>
    )
  }

  // --- Authenticated App Shell: Placeholder Views (Insights, Library, Profile) ---

  const isPlaceholderAuthView = ['insights', 'library', 'profile'].includes(currentView)
  if (isPlaceholderAuthView) {
    const placeholderContent: Record<
      string,
      { title: string; subtitle: string; description: string }
    > = {
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

    const currentInfo = placeholderContent[currentView] || placeholderContent.insights

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
