import React, { useState } from 'react'
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookOpen,
  FileSpreadsheet,
  PlusCircle,
  ExternalLink,
} from 'lucide-react'
import type {
  ConnectedAccountItem,
  ConnectionProviderId,
  ImportSourceId,
  ImportValidationResult,
} from '../../../types/profile'
import { profileService } from '../../../services/profile/profileService'

export interface ConnectedAccountsSectionProps {
  accounts: ConnectedAccountItem[]
  onToggleConnection: (
    provider: ConnectionProviderId,
    targetState: boolean
  ) => Promise<ConnectedAccountItem>
  onImportCompleted?: () => void
}

export const ConnectedAccountsSection: React.FC<ConnectedAccountsSectionProps> = ({
  accounts,
  onToggleConnection,
  onImportCompleted,
}) => {
  const [toggleLoading, setToggleLoading] = useState<string | null>(null)

  // File import workflow state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importTarget, setImportTarget] = useState<ImportSourceId>('goodreads')
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] =
    useState<ImportValidationResult | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importSuccess, setImportSuccess] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Dedicated upload section visibility
  const [activeUploadSource, setActiveUploadSource] = useState<ImportSourceId | null>(null)

  const handleToggle = async (
    providerId: ConnectionProviderId,
    currentState: string
  ) => {
    setToggleLoading(providerId)
    setErrorMessage(null)
    setImportSuccess(null)
    try {
      const targetState = currentState !== 'connected'
      await onToggleConnection(providerId, targetState)
    } catch (err: any) {
      console.error('[Verba Profile] Connection error:', err)
      setErrorMessage(err?.message || `Failed to update ${providerId} status.`)
    } finally {
      setToggleLoading(null)
    }
  }

  const handleInitiateImport = (source: ImportSourceId) => {
    setErrorMessage(null)
    setImportSuccess(null)
    setValidationResult(null)
    setSelectedFile(null)

    if (source === 'manual') {
      setActiveUploadSource('manual')
      return
    }

    setImportTarget(source)
    setActiveUploadSource(source)
    const dropzone = document.getElementById('reading-history-import-dropzone')
    dropzone?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setErrorMessage(null)
    setImportSuccess(null)
    setSelectedFile(file)
    setIsValidating(true)

    try {
      const result = await profileService.validateImportFile(file, importTarget)
      setValidationResult(result)
    } catch (err) {
      console.error('[Verba Profile] File validation failed:', err)
      setErrorMessage('Could not validate CSV file format. Please check file structure.')
      setValidationResult(null)
    } finally {
      setIsValidating(false)
    }
  }

  const handleExecuteImport = async () => {
    if (!validationResult) return

    setIsImporting(true)
    setErrorMessage(null)
    try {
      const res = await profileService.executeImport(validationResult)
      setImportSuccess(
        `Successfully imported ${res.importedCount} books into your Verba library.`
      )
      setValidationResult(null)
      setSelectedFile(null)
      setActiveUploadSource(null)
      onImportCompleted?.()
    } catch (err) {
      console.error('[Verba Profile] Import execution failed:', err)
      setErrorMessage('Failed to complete import into library.')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div
      className="profile-section-panel"
      role="tabpanel"
      id="section-panel-connected-accounts"
      aria-labelledby="tab-connected-accounts"
    >
      {/* Section Header */}
      <div className="profile-section-header">
        <div>
          <h2 className="profile-section-title">Connected Accounts</h2>
          <p className="profile-section-subtitle">
            Bring your reading history together for a more personal Verba experience.
          </p>
        </div>
      </div>

      {importSuccess && (
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: 'var(--color-success-bg)',
            border: '1px solid var(--color-success-border)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--color-success)',
            fontSize: 'var(--text-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
          role="status"
        >
          <CheckCircle2 size={16} />
          <span>{importSuccess}</span>
        </div>
      )}

      {errorMessage && (
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: 'var(--color-error-bg)',
            border: '1px solid var(--color-error-border)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--color-error)',
            fontSize: 'var(--text-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
          role="alert"
        >
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ====================================================================
          SUBSECTION 1: Connect your accounts (Google Books, Notion, Hardcover)
          ==================================================================== */}
      <section aria-labelledby="connect-accounts-heading">
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <h3
            id="connect-accounts-heading"
            style={{
              fontFamily: 'var(--font-roman, var(--font-serif))',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-primary)',
              marginBottom: 2,
            }}
          >
            Connect your accounts
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            Link external reading platforms to synchronize book metadata and reading activities.
          </p>
        </div>

        <div className="integrations-list">
          {accounts.map((account) => {
            const isConnected = account.status === 'connected'
            const isComingSoon = account.status === 'coming_soon'
            const isLoading = toggleLoading === account.id

            return (
              <div key={account.id} className="integration-card">
                <div className="integration-card-left">
                  <div
                    className={`integration-card-icon ${
                      account.id === 'google_books' ? 'google' : ''
                    }`}
                    aria-hidden="true"
                  >
                    {account.id === 'google_books' ? (
                      'G'
                    ) : account.id === 'notion' ? (
                      'N'
                    ) : (
                      'H'
                    )}
                  </div>

                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                      }}
                    >
                      <h4 className="integration-card-title">{account.name}</h4>
                      {isComingSoon ? (
                        <span
                          className="integration-badge"
                          style={{
                            backgroundColor: 'var(--color-surface-muted)',
                            color: 'var(--color-text-secondary)',
                            border: '1px solid var(--color-border-subtle)',
                          }}
                        >
                          Coming soon
                        </span>
                      ) : (
                        <span
                          className={`integration-badge ${
                            isConnected ? 'connected' : 'disconnected'
                          }`}
                        >
                          {isConnected ? 'Connected' : 'Not Connected'}
                        </span>
                      )}
                    </div>
                    <p className="integration-card-tagline">{account.tagline}</p>
                    <p
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.4,
                      }}
                    >
                      {account.description}
                    </p>
                    {isConnected && account.lastSyncedAt && (
                      <span
                        style={{
                          display: 'block',
                          marginTop: 4,
                          fontSize: 'var(--text-xs)',
                          color: 'var(--color-text-tertiary)',
                        }}
                      >
                        Last synced: {new Date(account.lastSyncedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="integration-card-actions">
                  {isComingSoon ? (
                    <button
                      type="button"
                      className="btn btn-outline"
                      disabled
                      style={{
                        fontSize: 'var(--text-sm)',
                        minWidth: 120,
                        opacity: 0.6,
                        cursor: 'not-allowed',
                      }}
                    >
                      Coming soon
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`btn ${isConnected ? 'btn-outline' : 'btn-primary'}`}
                      disabled={isLoading}
                      onClick={() => handleToggle(account.id, account.status)}
                      style={{ fontSize: 'var(--text-sm)', minWidth: 120 }}
                    >
                      {isLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : isConnected ? (
                        'Disconnect'
                      ) : (
                        'Connect'
                      )}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ====================================================================
          SUBSECTION 2: Import Reading History (Goodreads, StoryGraph, Manual)
          ==================================================================== */}
      <section
        style={{ marginTop: 'var(--space-6)' }}
        aria-labelledby="import-history-heading"
      >
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <h3
            id="import-history-heading"
            style={{
              fontFamily: 'var(--font-roman, var(--font-serif))',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-primary)',
              marginBottom: 2,
            }}
          >
            Import Reading History
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            Bring your existing reading journey into Verba without starting from scratch.
          </p>
        </div>

        {/* Three Separate Import Option Cards */}
        <div className="integrations-list">
          {/* 1. Goodreads CSV Import */}
          <div className="integration-card">
            <div className="integration-card-left">
              <div
                className="integration-card-icon"
                style={{ backgroundColor: '#fcf2e9', color: '#8c4a1e' }}
                aria-hidden="true"
              >
                GR
              </div>
              <div>
                <h4 className="integration-card-title">Goodreads</h4>
                <p className="integration-card-tagline">CSV Library Export</p>
                <p
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.4,
                  }}
                >
                  Import your books, ratings, shelves, and reading history from a Goodreads CSV export.
                </p>
              </div>
            </div>

            <div className="integration-card-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => handleInitiateImport('goodreads')}
                style={{ fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }}
              >
                <FileSpreadsheet size={14} />
                <span>Import Goodreads History</span>
              </button>
            </div>
          </div>

          {/* 2. StoryGraph Import */}
          <div className="integration-card">
            <div className="integration-card-left">
              <div
                className="integration-card-icon"
                style={{ backgroundColor: '#e9f3fc', color: '#1a5fb4' }}
                aria-hidden="true"
              >
                SG
              </div>
              <div>
                <h4 className="integration-card-title">StoryGraph</h4>
                <p className="integration-card-tagline">Reading Journey & Mood Tags</p>
                <p
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.4,
                  }}
                >
                  Import supported reading history, ratings, and reading preferences from a StoryGraph export.
                </p>
              </div>
            </div>

            <div className="integration-card-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => handleInitiateImport('storygraph')}
                style={{ fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }}
              >
                <FileSpreadsheet size={14} />
                <span>Import StoryGraph History</span>
              </button>
            </div>
          </div>

          {/* 3. Manual Import */}
          <div className="integration-card">
            <div className="integration-card-left">
              <div
                className="integration-card-icon"
                style={{ backgroundColor: '#fbf0f6', color: 'var(--color-secondary)' }}
                aria-hidden="true"
              >
                <BookOpen size={20} />
              </div>
              <div>
                <h4 className="integration-card-title">Manual Import</h4>
                <p className="integration-card-tagline">Direct Book Log</p>
                <p
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.4,
                  }}
                >
                  Add books and reading records yourself when you don’t have an export file.
                </p>
              </div>
            </div>

            <div className="integration-card-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => handleInitiateImport('manual')}
                style={{ fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }}
              >
                <PlusCircle size={14} />
                <span>Add Books Manually</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Import Interface (Goodreads or StoryGraph CSV dropzone) */}
        {(activeUploadSource === 'goodreads' || activeUploadSource === 'storygraph') && (
          <div
            id="reading-history-import-dropzone"
            className="profile-card"
            style={{
              marginTop: 'var(--space-4)',
              border: '1px solid var(--color-border-medium)',
              backgroundColor: '#faf8fb',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 'var(--space-3)',
              }}
            >
              <div>
                <h4
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {importTarget === 'goodreads'
                    ? 'Upload Goodreads CSV Export'
                    : 'Upload StoryGraph CSV Export'}
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  Select the exported CSV file from your account to review and import into your library.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setActiveUploadSource(null)}
                style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-2)' }}
              >
                Close
              </button>
            </div>

            {/* Dropzone / File Picker */}
            <label className="csv-import-box" htmlFor="csv-file-input">
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: '#f7ebf2',
                  color: 'var(--color-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Upload size={22} />
              </div>
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-primary)',
                    display: 'block',
                  }}
                >
                  {selectedFile ? selectedFile.name : `Choose ${importTarget === 'goodreads' ? 'Goodreads' : 'StoryGraph'} CSV file`}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  Standard CSV export containing title, author, rating, and bookshelves columns
                </span>
              </div>
              <input
                id="csv-file-input"
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>

            {isValidating && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  marginTop: 'var(--space-4)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-primary)',
                }}
              >
                <Loader2 size={16} className="animate-spin" />
                <span>Validating file structure and deduplicating against your library...</span>
              </div>
            )}

            {/* Validation Result Preview Card */}
            {validationResult && (
              <div className="csv-preview-card">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  <h5
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                    }}
                  >
                    File Validated: {validationResult.fileName}
                  </h5>
                  <span
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-success)',
                      fontWeight: 600,
                    }}
                  >
                    ✓ {validationResult.validBooksCount} new books ready
                  </span>
                </div>

                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  Total rows found: {validationResult.totalRows} · Existing duplicates safely skipped:{' '}
                  {validationResult.skippedDuplicatesCount}
                </p>

                {validationResult.preview.length > 0 && (
                  <table className="csv-preview-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Shelved As</th>
                      </tr>
                    </thead>
                    <tbody>
                      {validationResult.preview.map((book, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 500 }}>{book.title}</td>
                          <td>{book.author}</td>
                          <td style={{ textTransform: 'capitalize' }}>
                            {book.status?.replace('_', ' ') || 'Completed'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 'var(--space-3)',
                    marginTop: 'var(--space-4)',
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setValidationResult(null)
                      setSelectedFile(null)
                    }}
                    disabled={isImporting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleExecuteImport}
                    disabled={isImporting}
                  >
                    {isImporting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Importing to Library...</span>
                      </>
                    ) : (
                      <span>Confirm Import ({validationResult.validBooksCount} Books)</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Manual Import Notice / Direction */}
        {activeUploadSource === 'manual' && (
          <div
            className="profile-card profile-card-blush"
            style={{ marginTop: 'var(--space-4)' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 'var(--space-2)',
              }}
            >
              <h4
                style={{
                  fontFamily: 'var(--font-roman, var(--font-serif))',
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-primary)',
                }}
              >
                Add Books Manually
              </h4>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setActiveUploadSource(null)}
                style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-2)' }}
              >
                Close
              </button>
            </div>
            <p
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5,
                marginBottom: 'var(--space-3)',
              }}
            >
              You can log books, ratings, and journal reflections directly to your bookshelf in the
              My Library tab.
            </p>
            <a
              href="#library"
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                fontSize: 'var(--text-xs)',
              }}
            >
              <span>Go to My Library to Add Books</span>
              <ExternalLink size={14} />
            </a>
          </div>
        )}
      </section>
    </div>
  )
}
