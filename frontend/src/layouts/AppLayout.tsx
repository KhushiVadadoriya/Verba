import React from 'react'
import { Navbar, type NavItemKey } from '../components/layout/Navbar'

export interface AppLayoutProps {
  activeNav?: NavItemKey
  onNavigate?: (key: NavItemKey) => void
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeNav = 'discover',
  onNavigate,
  children,
}) => {
  return (
    <div className="app-layout">
      <Navbar activeNav={activeNav} onNavigate={onNavigate} />
      <main className="app-main-content">{children}</main>
    </div>
  )
}

export default AppLayout
