import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import verbaLogo from '../../assets/verba-logo.png'

export type NavItemKey = 'home' | 'discover' | 'insights' | 'library' | 'profile'

export interface NavbarProps {
  activeNav?: NavItemKey
  onNavigate?: (key: NavItemKey) => void
}

interface NavLinkItem {
  key: NavItemKey
  label: string
  href: string
}

const NAV_ITEMS: NavLinkItem[] = [
  { key: 'home', label: 'Home', href: '#home' },
  { key: 'discover', label: 'Discover', href: '#discover' },
  { key: 'insights', label: 'Insights', href: '#insights' },
  { key: 'library', label: 'My Library', href: '#library' },
  { key: 'profile', label: 'Profile', href: '#profile' },
]

export const Navbar: React.FC<NavbarProps> = ({
  activeNav = 'discover',
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (key: NavItemKey, e: React.MouseEvent) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    if (onNavigate) {
      onNavigate(key)
    } else {
      window.location.hash = key
    }
  }

  return (
    <header className="app-navbar" role="banner">
      <div className="app-navbar-inner">
        {/* Verba Official Brand Logo on Left */}
        <a
          href="#discover"
          className="app-navbar-brand"
          onClick={(e) => handleNavClick('discover', e)}
          aria-label="Verba Home"
        >
          <div className="app-navbar-logo-icon">
            <img src={verbaLogo} alt="Verba Logo" />
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="app-nav-links" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.key
            return (
              <a
                key={item.key}
                href={item.href}
                className={`app-nav-link ${isActive ? 'active' : ''}`}
                onClick={(e) => handleNavClick(item.key, e)}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className="app-mobile-nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="app-mobile-nav-drawer" role="navigation" aria-label="Mobile Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.key
            return (
              <button
                key={item.key}
                type="button"
                className={`app-mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={(e) => handleNavClick(item.key, e)}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      )}
    </header>
  )
}

export default Navbar
