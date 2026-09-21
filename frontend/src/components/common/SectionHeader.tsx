import React from 'react'

export interface SectionHeaderProps {
  title: string
  seeAllHref?: string
  onSeeAllClick?: () => void
  showSeeAll?: boolean
  className?: string
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  seeAllHref = '#',
  onSeeAllClick,
  showSeeAll = true,
  className = '',
}) => {
  return (
    <div className={`discover-section-header ${className}`}>
      <h2 className="discover-section-title">{title}</h2>
      {showSeeAll && (
        <a
          href={seeAllHref}
          className="discover-see-all"
          onClick={(e) => {
            if (onSeeAllClick) {
              e.preventDefault()
              onSeeAllClick()
            }
          }}
          aria-label={`See all for ${title}`}
        >
          <span>See all</span>
          <span aria-hidden="true">&rarr;</span>
        </a>
      )}
    </div>
  )
}

export default SectionHeader
