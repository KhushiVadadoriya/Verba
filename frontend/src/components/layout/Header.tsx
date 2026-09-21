import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '../common/Button'
import verbaLogo from '../../assets/verba-logo.png'

export interface HeaderProps {
  onBrowseClick?: () => void
  onShelfClick?: () => void
  onSignUpClick?: () => void
  onSignInClick?: () => void
  onAboutClick?: () => void
}

export const Header: React.FC<HeaderProps> = ({
  onBrowseClick: _onBrowseClick,
  onShelfClick: _onShelfClick,
  onSignUpClick,
  onSignInClick,
  onAboutClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="navbar" role="banner">
      <div className="navbar-inner">
        {/* Official Brand Logo */}
        <a href="#" className="brand-logo" aria-label="Verba Home">
          <div className="brand-logo-icon">
            <img src={verbaLogo} alt="Verba Logo" />
          </div>
          <span>Verba</span>
        </a>

        {/* Desktop Navigation Links (Strictly: About Verba, Sign In, Sign Up) */}
        <nav className="nav-links" aria-label="Primary Navigation">
          <a
            href="#about"
            className="nav-link"
            onClick={(e) => {
              if (onAboutClick) {
                e.preventDefault()
                onAboutClick()
              }
            }}
          >
            About Verba
          </a>
          <a
            href="#signin"
            className="nav-link"
            onClick={(e) => {
              if (onSignInClick) {
                e.preventDefault()
                onSignInClick()
              }
            }}
          >
            Sign In
          </a>
          <Button variant="primary" size="sm" onClick={onSignUpClick}>
            Sign Up
          </Button>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="btn-ghost mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          style={{ display: 'none' }}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer (Strictly: About Verba, Sign In, Sign Up) */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-drawer"
          style={{
            position: 'absolute',
            top: 'var(--header-height)',
            left: 0,
            right: 0,
            backgroundColor: 'var(--color-bg-alt)',
            borderBottom: '1px solid var(--color-border-subtle)',
            padding: 'var(--space-6)',
            boxShadow: 'var(--shadow-dropdown)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          <a
            href="#about"
            className="nav-link"
            onClick={() => {
              setMobileMenuOpen(false)
              onAboutClick?.()
            }}
          >
            About Verba
          </a>
          <a
            href="#signin"
            className="nav-link"
            onClick={() => {
              setMobileMenuOpen(false)
              onSignInClick?.()
            }}
          >
            Sign In
          </a>
          <Button
            variant="primary"
            size="md"
            isFullWidth
            onClick={() => {
              setMobileMenuOpen(false)
              onSignUpClick?.()
            }}
          >
            Sign Up
          </Button>
        </div>
      )}
    </header>
  )
}

export default Header
