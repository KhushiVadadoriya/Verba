import React from 'react'
import {
  Dna,
  User,
  Sliders,
  Layers,
  Shield,
  ChevronRight,
} from 'lucide-react'
import type { ProfileSectionId } from '../../../types/profile'

export interface ProfileSidebarNavProps {
  activeSection: ProfileSectionId
  onSelectSection: (section: ProfileSectionId) => void
}

interface NavItemConfig {
  id: ProfileSectionId
  label: string
  icon: React.ReactNode
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'reading-dna',
    label: 'Reading DNA',
    icon: <Dna size={18} />,
  },
  {
    id: 'profile-info',
    label: 'Profile Information',
    icon: <User size={18} />,
  },
  {
    id: 'reading-preferences',
    label: 'Reading Preferences',
    icon: <Sliders size={18} />,
  },
  {
    id: 'connected-accounts',
    label: 'Connected Accounts',
    icon: <Layers size={18} />,
  },
  {
    id: 'account-privacy',
    label: 'Account & Privacy',
    icon: <Shield size={18} />,
  },
]

export const ProfileSidebarNav: React.FC<ProfileSidebarNavProps> = ({
  activeSection,
  onSelectSection,
}) => {
  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <nav
        className="profile-sidebar-nav"
        aria-label="Profile Sections"
        role="tablist"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`section-panel-${item.id}`}
              id={`tab-${item.id}`}
              className={`profile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectSection(item.id)}
            >
              <span className="profile-nav-item-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="profile-nav-item-label">{item.label}</span>
              {isActive && (
                <ChevronRight
                  size={14}
                  style={{ color: 'var(--color-secondary)', opacity: 0.8 }}
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Mobile Horizontal Scrollable Nav */}
      <div
        className="profile-mobile-nav"
        aria-label="Profile Sections Navigation"
        role="tablist"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`section-panel-${item.id}`}
              id={`tab-mobile-${item.id}`}
              className={`profile-mobile-nav-pill ${isActive ? 'active' : ''}`}
              onClick={() => onSelectSection(item.id)}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}
