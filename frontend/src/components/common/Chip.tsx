import React from 'react'
import { Check } from 'lucide-react'

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  selected?: boolean
  icon?: React.ReactNode
  showCheckmark?: boolean
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  icon,
  showCheckmark = true,
  className = '',
  onClick,
  ...props
}) => {
  const classes = [
    'chip',
    'chip-interactive',
    selected ? 'chip-active' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={classes}
      aria-pressed={selected}
      onClick={onClick}
      {...props}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{label}</span>
      {selected && showCheckmark && (
        <Check size={14} strokeWidth={2.5} aria-hidden="true" />
      )}
    </button>
  )
}

export default Chip
