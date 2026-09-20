import { useState, useEffect } from 'react'
import { LandingPage } from './pages/Landing'
import { SignInPage, SignUpPage } from './pages/Auth'

export type AppView = 'landing' | 'signin' | 'signup'

function App() {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const hash = window.location.hash.toLowerCase()
    if (hash === '#signin') return 'signin'
    if (hash === '#signup') return 'signup'
    return 'landing'
  })

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase()
      if (hash === '#signin') setCurrentView('signin')
      else if (hash === '#signup') setCurrentView('signup')
      else if (hash === '#landing' || hash === '' || hash === '#about' || hash === '#browse' || hash === '#shelf') {
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
    else window.location.hash = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (currentView === 'signin') {
    return (
      <SignInPage
        onNavigateToSignUp={() => navigateTo('signup')}
        onBackToHome={() => navigateTo('landing')}
        onSignInSuccess={() => {
          // Visual demonstration placeholder until Supabase auth phase
          alert('Sign in successful! (UI demo state)')
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
          // Visual demonstration placeholder until Supabase auth phase
          alert('Account created successfully! (UI demo state)')
        }}
      />
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
