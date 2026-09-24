import React from 'react'
import { CheckCircle2, Star, Bookmark } from 'lucide-react'
import type { RecentActivityItemData } from '../../types/home'

export interface RecentActivityProps {
  activities: RecentActivityItemData[]
  className?: string
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  className = '',
}) => {
  const getActivityIcon = (type: RecentActivityItemData['type']) => {
    switch (type) {
      case 'finished':
        return <CheckCircle2 size={16} strokeWidth={2.2} />
      case 'review':
        return <Star size={16} strokeWidth={2.2} />
      case 'library':
        return <Bookmark size={16} strokeWidth={2.2} />
      default:
        return <CheckCircle2 size={16} strokeWidth={2.2} />
    }
  }

  return (
    <section className={`home-activity-section ${className}`} aria-labelledby="recent-activity-heading">
      <h2 id="recent-activity-heading" className="home-section-title">
        Recent Activity
      </h2>

      <div className="home-activity-card">
        <ul className="home-activity-list" aria-label="Recent reading activities">
          {activities.map((item) => (
            <li key={item.id} className="home-activity-item">
              <div className={`home-activity-icon-badge badge-${item.type}`} aria-hidden="true">
                {getActivityIcon(item.type)}
              </div>
              <div className="home-activity-body">
                <p className="home-activity-description">
                  <span className="home-activity-action">{item.action} </span>
                  <strong className="home-activity-book">{item.bookTitle}</strong>
                </p>
                <span className="home-activity-time">{item.timestamp}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default RecentActivity
