import React from 'react'
import { ArrowLeft } from 'lucide-react'
import verbaLogo from '../../assets/verba-logo.png'

export interface AuthLayoutProps {
  title?: string
  subtitle?: string
  onBackToHome?: () => void
  children: React.ReactNode
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  onBackToHome,
  children,
}) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg-primary)',
        padding: 'var(--space-6) var(--space-4)',
        position: 'relative',
      }}
    >
      {/* Back to Home Action */}
      {onBackToHome && (
        <button
          type="button"
          onClick={onBackToHome}
          className="btn-ghost"
          style={{
            position: 'absolute',
            top: 'var(--space-6)',
            left: 'var(--space-6)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-sans)',
            color: 'var(--color-text-secondary)',
          }}
          aria-label="Back to home"
        >
          <ArrowLeft size={16} strokeWidth={2} />
          <span>Back to Home</span>
        </button>
      )}

      {/* Centered Brand Header from Figma Mockup */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        {/* Official Brand Logo */}
        <div style={{ display: 'inline-block', marginBottom: 'var(--space-2)' }}>
          <img
            src={verbaLogo}
            alt="Verba Logo"
            style={{
              height: '48px',
              width: 'auto',
              maxWidth: '48px',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
            }}
          />
        </div>

        {/* Wordmark */}
        <h1
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-4xl)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--color-primary)',
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          Verba
        </h1>

        {subtitle && (
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)',
              marginTop: 'var(--space-1)',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Signature Mauve Container from Figma */}
      <div
        className="card-tinted"
        style={{
          width: '100%',
          maxWidth: '440px',
          boxShadow: 'var(--shadow-elevated)',
          padding: 'var(--space-8) var(--space-6)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
        }}
      >
        {title && (
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-2xl)',
              textAlign: 'center',
              marginBottom: 'var(--space-6)',
              color: 'var(--color-text-primary)',
            }}
          >
            {title}
          </h2>
        )}

        {children}
      </div>
    </div>
  )
}

export default AuthLayout
