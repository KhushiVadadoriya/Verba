import React from 'react'
import { Check } from 'lucide-react'
import {
  LIBRARY_IMPORT_OPTIONS,
  CONNECTED_TOOL_OPTIONS,
} from '../../types/onboarding'

export interface IntegrationStepProps {
  libraryImports: string[]
  connectedTools: string[]
  onToggleLibrary: (id: string) => void
  onToggleTool: (id: string) => void
}

export const IntegrationStep: React.FC<IntegrationStepProps> = ({
  libraryImports,
  connectedTools,
  onToggleLibrary,
  onToggleTool,
}) => {
  return (
    <div className="integration-panel">
      {/* Section 1: IMPORT YOUR LIBRARY */}
      <h2 className="integration-section-title">IMPORT YOUR LIBRARY</h2>
      <div
        className="integration-row-two"
        role="group"
        aria-label="Select library services to import from later"
      >
        {LIBRARY_IMPORT_OPTIONS.map((item) => {
          const isSelected = libraryImports.includes(item.id)

          return (
            <button
              key={item.id}
              type="button"
              className="integration-card-btn"
              onClick={() => onToggleLibrary(item.id)}
              aria-pressed={isSelected}
              aria-label={`Select ${item.name} for future import`}
            >
              {isSelected && (
                <span className="integration-check-indicator" aria-hidden="true">
                  <Check size={14} strokeWidth={2.5} />
                </span>
              )}

              {item.id === 'goodreads' ? (
                <span
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontWeight: 600,
                    fontSize: '1.15rem',
                    color: '#382110',
                    letterSpacing: '-0.02em',
                  }}
                >
                  goodreads
                </span>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <svg width="22" height="18" viewBox="0 0 24 20" fill="currentColor">
                    <rect x="2" y="2" width="4" height="16" rx="1" fill="#111111" />
                    <rect x="8" y="2" width="4" height="16" rx="1" fill="#111111" />
                    <rect
                      x="14"
                      y="2"
                      width="4"
                      height="16"
                      rx="1"
                      fill="#111111"
                      transform="rotate(12 16 10)"
                    />
                  </svg>
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.55rem',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      color: '#111111',
                    }}
                  >
                    THE STORYGRAPH
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Decorative Divider Line */}
      <div className="integration-divider" aria-hidden="true" />

      {/* Section 2: CONNECT YOUR TOOLS */}
      <h2 className="integration-section-title">CONNECT YOUR TOOLS</h2>
      <div
        className="integration-col-one"
        role="group"
        aria-label="Select reading tools to connect later"
      >
        {CONNECTED_TOOL_OPTIONS.map((tool) => {
          const isSelected = connectedTools.includes(tool.id)

          return (
            <button
              key={tool.id}
              type="button"
              className="integration-card-btn"
              onClick={() => onToggleTool(tool.id)}
              aria-pressed={isSelected}
              aria-label={`Select ${tool.name} for future connection`}
            >
              {isSelected && (
                <span className="integration-check-indicator" aria-hidden="true">
                  <Check size={14} strokeWidth={2.5} />
                </span>
              )}

              {tool.id === 'google_books' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 500,
                    fontSize: '1rem',
                  }}
                >
                  <span style={{ color: '#4285F4' }}>G</span>
                  <span style={{ color: '#EA4335' }}>o</span>
                  <span style={{ color: '#FBBC05' }}>o</span>
                  <span style={{ color: '#4285F4' }}>g</span>
                  <span style={{ color: '#34A853' }}>l</span>
                  <span style={{ color: '#EA4335' }}>e</span>
                  <span style={{ color: '#5f6368', fontSize: '0.8rem', marginLeft: '2px' }}>
                    Books
                  </span>
                </div>
              )}

              {tool.id === 'notion' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: '#000000',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      border: '1.5px solid #000000',
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                    }}
                  >
                    N
                  </div>
                  <span>Notion</span>
                </div>
              )}

              {tool.id === 'hardcover' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: '#1a192b',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="4" fill="#5856D6" />
                    <path
                      d="M12 7L13.2 10.8H17L14 13L15.2 16.8L12 14.5L8.8 16.8L10 13L7 10.8H10.8L12 7Z"
                      fill="#FFFFFF"
                    />
                  </svg>
                  <span>Hardcover</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Explanatory note confirming preference-only recording */}
      <p className="integration-preference-hint">
        Selecting an integration saves your preference for future syncing.
        No external accounts are connected and no data is imported yet.
      </p>
    </div>
  )
}

export default IntegrationStep
