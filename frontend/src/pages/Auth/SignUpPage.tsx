import React, { useState } from 'react'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { AuthLayout } from './AuthLayout'
import { Input } from '../../components/common/Input'

export interface SignUpPageProps {
  onNavigateToSignIn?: () => void
  onBackToHome?: () => void
  onSignUpSuccess?: () => void
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onNavigateToSignIn,
  onBackToHome,
  onSignUpSuccess,
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    general?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!name.trim()) {
      newErrors.name = 'Please enter your name.'
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (!password) {
      newErrors.password = 'Please create a password.'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!validateForm()) {
      return
    }

    // Visual loading state simulation without connecting real backend
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onSignUpSuccess?.()
    }, 1200)
  }

  const handleGoogleSignUp = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onSignUpSuccess?.()
    }, 1200)
  }

  return (
    <AuthLayout
      subtitle="Begin your reading intelligence journey"
      onBackToHome={onBackToHome}
    >
      {/* Visual Error State */}
      {errors.general && (
        <div
          className="badge-error"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-4)',
            fontSize: 'var(--text-sm)',
            width: '100%',
          }}
          role="alert"
        >
          <AlertCircle size={16} strokeWidth={2} />
          <span>{errors.general}</span>
        </div>
      )}

      {/* Google Sign In / Sign Up Button */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={isLoading}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-3)',
          padding: 'var(--space-3) var(--space-4)',
          backgroundColor: '#ffffff',
          color: 'var(--color-text-primary)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-lg)',
          boxShadow: 'var(--shadow-sm)',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 150ms var(--ease-default)',
        }}
        onMouseEnter={(e) => {
          if (!isLoading) e.currentTarget.style.backgroundColor = '#fafafa'
        }}
        onMouseLeave={(e) => {
          if (!isLoading) e.currentTarget.style.backgroundColor = '#ffffff'
        }}
      >
        {/* Google G Logo SVG */}
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Decorative Divider Line */}
      <div
        style={{
          margin: 'var(--space-6) 0',
          height: '1px',
          backgroundColor: 'rgba(72, 71, 158, 0.25)',
          width: '100%',
        }}
      />

      {/* Registration Form */}
      <form onSubmit={handleSubmit} noValidate>
        <Input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
          }}
          error={errors.name}
          autoComplete="name"
          disabled={isLoading}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-base)',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
          }}
        />

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
          }}
          error={errors.email}
          autoComplete="email"
          disabled={isLoading}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-base)',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
          }}
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password (min. 8 characters)"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
          }}
          error={errors.password}
          autoComplete="new-password"
          disabled={isLoading}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-base)',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
          }}
          rightAction={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 'var(--space-1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-secondary)',
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff size={16} strokeWidth={2} />
              ) : (
                <Eye size={16} strokeWidth={2} />
              )}
            </button>
          }
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            if (errors.confirmPassword)
              setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
          }}
          error={errors.confirmPassword}
          autoComplete="new-password"
          disabled={isLoading}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-base)',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
          }}
        />

        {/* Create Account Primary Action Button */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-xl)',
              color: 'var(--color-text-primary)',
              backgroundColor: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-2) var(--space-8)',
              boxShadow: 'var(--shadow-sm)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-2)',
              minWidth: '180px',
              transition: 'all 150ms var(--ease-default)',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = '#fafafa'
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = '#ffffff'
            }}
          >
            {isLoading ? (
              <>
                <Loader2
                  size={18}
                  style={{
                    animation: 'spin 1s linear infinite',
                    color: 'var(--color-primary)',
                  }}
                />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </div>
      </form>

      {/* Or Divider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          margin: 'var(--space-6) 0 var(--space-4)',
        }}
      >
        <div
          style={{
            flex: 1,
            height: '1px',
            backgroundColor: 'rgba(72, 71, 158, 0.25)',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
          }}
        >
          Or
        </span>
        <div
          style={{
            flex: 1,
            height: '1px',
            backgroundColor: 'rgba(72, 71, 158, 0.25)',
          }}
        />
      </div>

      {/* Already have an account? Prompt & Sign In Button */}
      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-3)',
          }}
        >
          Already have an account?
        </p>
        <button
          type="button"
          onClick={onNavigateToSignIn}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-xl)',
            color: 'var(--color-text-primary)',
            backgroundColor: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-2) var(--space-8)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 150ms var(--ease-default)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fafafa'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff'
          }}
        >
          Sign In
        </button>
      </div>

      {/* Keyframe spinner animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </AuthLayout>
  )
}

export default SignUpPage
