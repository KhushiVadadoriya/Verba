import React, { useId } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  rightAction?: React.ReactNode
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  icon,
  iconPosition = 'left',
  rightAction,
  id,
  className = '',
  style: customStyle,
  ...restProps
}) => {
  const generatedId = useId()
  const inputId = id || generatedId

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <div className="input-search-wrapper" style={{ position: 'relative' }}>
        {icon && (
          <span
            className="input-search-icon"
            style={{
              left: iconPosition === 'left' ? 'var(--space-3)' : 'auto',
              right: iconPosition === 'right' ? 'var(--space-3)' : 'auto',
            }}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`input ${className}`}
          style={{
            ...customStyle,
            paddingLeft:
              icon && iconPosition === 'left' ? 'var(--space-10)' : customStyle?.paddingLeft,
            paddingRight:
              rightAction || (icon && iconPosition === 'right')
                ? 'var(--space-10)'
                : customStyle?.paddingRight,
            borderColor: error ? 'var(--color-error)' : customStyle?.borderColor,
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...restProps}
        />
        {rightAction && (
          <div
            style={{
              position: 'absolute',
              right: 'var(--space-3)',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-tertiary)',
            }}
          >
            {rightAction}
          </div>
        )}
      </div>
      {error && (
        <span
          id={`${inputId}-error`}
          className="text-xs"
          style={{ color: 'var(--color-error)' }}
          role="alert"
        >
          {error}
        </span>
      )}
      {!error && helperText && (
        <span
          id={`${inputId}-helper`}
          className="text-xs text-muted"
        >
          {helperText}
        </span>
      )}
    </div>
  )
}

export default Input
