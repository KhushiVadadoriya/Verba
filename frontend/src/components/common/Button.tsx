import React from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  isFullWidth?: boolean
  children?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isFullWidth = false,
  children,
  className = '',
  type = 'button',
  ...props
}) => {
  const sizeClass = size === 'md' ? '' : `btn-${size}`
  const fullWidthClass = isFullWidth ? 'btn-block' : ''
  const classes = ['btn', `btn-${variant}`, sizeClass, fullWidthClass, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} {...props}>
      {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
      {children && <span>{children}</span>}
      {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
    </button>
  )
}

export default Button
