import React from 'react'

export type CardVariant = 'surface' | 'tinted' | 'interactive'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  as?: 'div' | 'section' | 'article'
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
  variant = 'surface',
  as: Component = 'div',
  children,
  className = '',
  ...props
}) => {
  const variantClasses: Record<CardVariant, string> = {
    surface: 'card',
    tinted: 'card-tinted',
    interactive: 'card card-interactive',
  }

  const classes = [variantClasses[variant], className].filter(Boolean).join(' ')

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  )
}

export default Card
