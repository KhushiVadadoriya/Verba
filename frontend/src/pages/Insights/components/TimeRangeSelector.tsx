import React from 'react'
import type { TimeRangeOption } from '../../../types/insights'
import { TIME_RANGE_CONFIGS } from '../../../services/insights/insightsService'

export interface TimeRangeSelectorProps {
  selectedRange: TimeRangeOption
  onChange: (range: TimeRangeOption) => void
  disabled?: boolean
}

const RANGES: TimeRangeOption[] = ['3m', '6m', '1y']

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedRange,
  onChange,
  disabled = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      nextIndex = (index + 1) % RANGES.length
      onChange(RANGES[nextIndex])
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      nextIndex = (index - 1 + RANGES.length) % RANGES.length
      onChange(RANGES[nextIndex])
    }
  }

  return (
    <div
      className="insights-time-selector"
      role="radiogroup"
      aria-label="Filter reading insights by time range"
    >
      {RANGES.map((range, index) => {
        const config = TIME_RANGE_CONFIGS[range]
        const isSelected = selectedRange === range

        return (
          <button
            key={range}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            disabled={disabled}
            className={`insights-time-pill ${isSelected ? 'active' : ''}`}
            onClick={() => onChange(range)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {config.label}
          </button>
        )
      })}
    </div>
  )
}

export default TimeRangeSelector
