import React from 'react'
import { CircleCheck, AlertCircle, CircleX, Sparkles, Info } from 'lucide-react'

export type BadgeVariant = 'success' | 'warning' | 'error' | 'ai' | 'info'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  icon?: React.ReactNode
  children: React.ReactNode
}

const defaultIcons: Record<BadgeVariant, React.ReactNode> = {
  success: <CircleCheck aria-hidden="true" />,
  warning: <AlertCircle aria-hidden="true" />,
  error: <CircleX aria-hidden="true" />,
  ai: <Sparkles aria-hidden="true" />,
  info: <Info aria-hidden="true" />,
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'ai',
  icon,
  children,
  className = '',
  ...props
}) => {
  const iconToRender = icon !== undefined ? icon : defaultIcons[variant]

  return (
    <span className={`badge badge-${variant} ${className}`} {...props}>
      {iconToRender}
      <span>{children}</span>
    </span>
  )
}

export default Badge
