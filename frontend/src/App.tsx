import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { LandingPage } from './pages/Landing'
import { SignInPage, SignUpPage } from './pages/Auth'
import { OnboardingPage } from './pages/Onboarding'
import { DiscoverPage } from './pages/Discover'
import { RecommendedPage } from './pages/Recommended'
import { GenresPage } from './pages/Genres'
import { HomePage } from './pages/Home'
import { InsightsPage } from './pages/Insights'
import { LibraryPage } from './pages/Library'
import { ProfilePage } from './pages/Profile'
import { AppLayout } from './layouts/AppLayout'
import type { NavItemKey } from './components/layout/Navbar'
import type { OnboardingAnswers } from './types/onboarding'
import { toGenreSlug } from './types/genres'
import { useAuth } from './hooks/useAuth'
import { supabase } from './services/supabase'

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
  const { session, loading } = useAuth()
  const [currentView, setCurrentView] = useState<AppView>(() => {
    return parseHashRoute(window.location.hash)
  })

  const [savedAnswers, setSavedAnswers] = useState<OnboardingAnswers | null>(null)

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

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentView(parseHashRoute(window.location.hash))
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const hasOauthError =
    typeof window !== 'undefined' &&
    (window.location.search.includes('error=') || window.location.hash.includes('error='))

  // Clean up stale OAuth intent if callback returned an error
  useEffect(() => {
    if (hasOauthError) {
      sessionStorage.removeItem('verba_auth_intent')
    }
  }, [hasOauthError])

  // Session routing effect: handles OAuth return and gates signin/signup
  useEffect(() => {
    if (loading) return

    const authIntent = sessionStorage.getItem('verba_auth_intent') as AppView | null

    // Always clear the intent once loading completes to avoid stale redirection
    if (authIntent) {
      sessionStorage.removeItem('verba_auth_intent')
      if (session) {
        navigateTo(authIntent)
        return
      }
    }

    // Redirect signed-in users away from signin/signup entry pages only
    if (session && (currentView === 'signin' || currentView === 'signup')) {
      navigateTo('discover')
    }
  }, [session, loading, currentView])

  // Targeted loading screen: only when resolving an active OAuth callback
  const hasPendingOAuth =
    !hasOauthError &&
    typeof window !== 'undefined' &&
    Boolean(sessionStorage.getItem('verba_auth_intent'))

  if (loading && hasPendingOAuth) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--color-bg-primary)',
          gap: 'var(--space-3)',
        }}
      >
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        <span
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Completing Google sign in...
        </span>
      </div>
    )
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

  // --- Authenticated App Shell: Insights Page ---

  if (currentView === 'insights') {
    return (
      <AppLayout
        activeNav="insights"
        onNavigate={(key: NavItemKey) => navigateTo(key as AppView)}
      >
        <InsightsPage
          onNavigate={(view) => navigateTo(view as AppView)}
        />
      </AppLayout>
    )
  }

  // --- Authenticated App Shell: My Library Page ---

  if (currentView === 'library') {
    return (
      <AppLayout
        activeNav="library"
        onNavigate={(key: NavItemKey) => navigateTo(key as AppView)}
      >
        <LibraryPage />
      </AppLayout>
    )
  }

  // --- Authenticated App Shell: Profile Page ---

  if (currentView === 'profile') {
    return (
      <AppLayout
        activeNav="profile"
        onNavigate={(key: NavItemKey) => navigateTo(key as AppView)}
      >
        <ProfilePage
          onNavigateToInsights={() => navigateTo('insights')}
          onSignOut={async () => {
            try {
              const { error } = await supabase.auth.signOut()
              if (error) {
                console.error('[Verba] Sign-out failed:', error)
                alert(`Sign-out failed: ${error.message || 'Please check your connection and try again.'}`)
                return
              }
              navigateTo('signin')
            } catch (err: any) {
              console.error('[Verba] Unexpected error during sign-out:', err)
              alert('An error occurred during sign-out. Please try again.')
            }
          }}
        />
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
