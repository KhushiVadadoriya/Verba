import React from 'react'
import {
  ArrowRight,
  Sparkles,
  Compass,
  Heart,
  BookMarked,
  Library,
  Feather,
} from 'lucide-react'
import { Header } from '../../components/layout/Header'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { Card } from '../../components/common/Card'
import { BookShelf, type BookItem } from '../../components/books/BookShelf'

export interface LandingPageProps {
  onGetStarted?: () => void
  onSignIn?: () => void
  onBrowse?: () => void
  onShelf?: () => void
  onAbout?: () => void
  onBookSelect?: (book: BookItem) => void
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onSignIn,
  onBrowse,
  onShelf,
  onAbout,
  onBookSelect,
}) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg-primary)',
      }}
    >
      {/* 1. Top Navigation Bar */}
      <Header
        onBrowseClick={onBrowse}
        onShelfClick={onShelf}
        onAboutClick={onAbout}
        onSignInClick={onSignIn}
        onSignUpClick={onGetStarted}
      />

      <main style={{ flex: 1 }}>
        {/* 2. Hero Section */}
        <section
          style={{
            paddingTop: 'var(--space-12)',
            paddingBottom: 'var(--space-8)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 var(--space-4)',
            }}
          >
            {/* Prominent Gidugu Brand Wordmark */}
            <h2 className="hero-wordmark">Verba</h2>

            {/* Mockup-Inspired Single-Line Desktop Hero Heading */}
            <h1 className="hero-heading">
              You Deserve A Book That Matches Your Mood
            </h1>
          </div>
        </section>

        {/* 3. Horizontal Book Showcase Band (Continuous Infinitely Looping Marquee) */}
        <section style={{ margin: 'var(--space-4) 0 var(--space-10)' }}>
          <BookShelf onBookClick={onBookSelect} />
        </section>

        {/* 4. Action CTA & "Discover Your Next Read" Section */}
        <section
          style={{
            textAlign: 'center',
            padding: 'var(--space-6) 0 var(--space-16)',
          }}
        >
          <div className="container-narrow">
            {/* Framed Button Box from Figma Screen 1 Bottom */}
            <div
              style={{
                display: 'inline-block',
                position: 'relative',
                marginBottom: 'var(--space-6)',
              }}
            >
              <button
                type="button"
                onClick={onGetStarted}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                  color: 'var(--color-secondary)',
                  padding: 'var(--space-4) var(--space-8)',
                  backgroundColor: 'var(--color-bg-alt)',
                  border: '1.5px solid var(--color-surface-tinted)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow:
                    '0 6px 0 var(--color-secondary-subtle), 0 10px 24px rgba(159, 62, 118, 0.12)',
                  cursor: 'pointer',
                  transition: 'all 200ms var(--ease-default)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.borderColor = 'var(--color-secondary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'var(--color-surface-tinted)'
                }}
              >
                Discover Your Next Read
              </button>
            </div>

            {/* Primary Action Button */}
            <div>
              <Button
                variant="primary"
                size="lg"
                onClick={onGetStarted}
                icon={<ArrowRight size={18} strokeWidth={2} />}
                iconPosition="right"
                style={{
                  padding: 'var(--space-4) var(--space-10)',
                  fontSize: 'var(--text-lg)',
                }}
              >
                Get Started
              </Button>
            </div>
          </div>
        </section>

        {/* 5. Core Pillars (Reading Intelligence Features) */}
        <section
          id="about"
          style={{
            padding: 'var(--space-16) 0',
            backgroundColor: 'var(--color-bg-alt)',
            borderTop: '1px solid var(--color-border-subtle)',
          }}
        >
          <div className="container">
            <div className="text-center mb-12">
              <Badge variant="ai" icon={<Sparkles size={13} />}>
                Reading Intelligence Platform
              </Badge>
              <h2
                className="heading-2 mt-3"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Beyond Simple Cataloging
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'var(--space-8)',
              }}
            >
              {/* Feature 1: Mood-Based Discovery */}
              <Card variant="surface" className="card-interactive">
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-accent-light)',
                    color: 'var(--color-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  <Compass size={24} strokeWidth={2} />
                </div>
                <h3 className="heading-3 mb-2" style={{ fontSize: 'var(--text-xl)' }}>
                  Mood & Intent Discovery
                </h3>
                <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>
                  Search using how you feel: <em>“I need something comforting”</em> or{' '}
                  <em>“An inspiring biography for a quiet evening”</em>. Discover books that match
                  your emotional state.
                </p>
              </Card>

              {/* Feature 2: Emotional Reflections & Reading DNA */}
              <Card variant="surface" className="card-interactive">
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-primary-subtle)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  <Heart size={24} strokeWidth={2} />
                </div>
                <h3 className="heading-3 mb-2" style={{ fontSize: 'var(--text-xl)' }}>
                  Emotional Reflections
                </h3>
                <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>
                  Capture the emotional resonance of every completed book. Your reflections
                  continuously refine your personal Reading DNA and future recommendations.
                </p>
              </Card>

              {/* Feature 3: Unified Bookshelf & Import */}
              <Card variant="surface" className="card-interactive">
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-surface-subtle)',
                    color: 'var(--color-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  <Library size={24} strokeWidth={2} />
                </div>
                <h3 className="heading-3 mb-2" style={{ fontSize: 'var(--text-xl)' }}>
                  Unified Library Import
                </h3>
                <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>
                  Seamlessly import your history from Goodreads or StoryGraph CSV exports. Never
                  lose your reading milestones or start your library from scratch.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* 6. Literary Quote Banner */}
        <section
          style={{
            padding: 'var(--space-12) 0',
            backgroundColor: 'var(--color-bg-secondary)',
            textAlign: 'center',
          }}
        >
          <div className="container-reading">
            <Feather
              size={28}
              strokeWidth={1.5}
              style={{
                color: 'var(--color-secondary)',
                margin: '0 auto var(--space-4)',
                opacity: 0.85,
              }}
            />
            <blockquote
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.25rem, 3vw, 1.65rem)',
                fontStyle: 'italic',
                color: 'var(--color-text-primary)',
                lineHeight: 1.5,
                marginBottom: 'var(--space-3)',
              }}
            >
              “A book must be the axe for the frozen sea within us.”
            </blockquote>
            <cite
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                fontStyle: 'normal',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              — Franz Kafka
            </cite>
          </div>
        </section>
      </main>

      {/* 7. Refined Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border-subtle)',
          padding: 'var(--space-8) 0',
          backgroundColor: 'var(--color-bg-alt)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <BookMarked size={20} style={{ color: 'var(--color-primary)' }} />
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 'var(--weight-semibold)',
                fontSize: 'var(--text-lg)',
                color: 'var(--color-text-primary)',
              }}
            >
              Verba
            </span>
            <span className="text-xs text-muted">
              © {new Date().getFullYear()} Verba Reading Intelligence.
            </span>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
            <a href="#about" className="text-xs text-muted" onClick={onAbout}>
              About Verba
            </a>
            <a href="#privacy" className="text-xs text-muted">
              Privacy
            </a>
            <a href="#terms" className="text-xs text-muted">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
