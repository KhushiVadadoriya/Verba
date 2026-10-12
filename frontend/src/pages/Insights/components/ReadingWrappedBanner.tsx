import React, { useState } from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import type { ReadingWrappedData } from '../../../types/insights'
import { WrappedModal } from './WrappedModal'

export interface ReadingWrappedBannerProps {
  data: ReadingWrappedData
  onViewWrapped?: () => void
}

export const ReadingWrappedBanner: React.FC<ReadingWrappedBannerProps> = ({
  data,
  onViewWrapped,
}) => {
  const [modalOpen, setModalOpen] = useState(false)

  const handleOpenWrapped = () => {
    if (onViewWrapped) {
      onViewWrapped()
    } else {
      setModalOpen(true)
    }
  }

  // Showcase covers for collage
  const collageBooks = data.showcaseBooks.slice(0, 3)

  return (
    <>
      <section
        className="insights-section insights-wrapped-section"
        aria-labelledby="reading-wrapped-heading"
      >
        <div className="insights-wrapped-card">
          {/* Subtle background decorative sparkles */}
          <div className="insights-wrapped-sparkle sparkle-tl" aria-hidden="true">
            <Sparkles size={18} />
          </div>
          <div className="insights-wrapped-sparkle sparkle-br" aria-hidden="true">
            <Sparkles size={22} />
          </div>

          <div className="insights-wrapped-inner">
            {/* Left Content Column */}
            <div className="insights-wrapped-content">
              <h2 id="reading-wrapped-heading" className="insights-wrapped-title">
                Your {data.year} Reading Wrapped
              </h2>
              <p className="insights-wrapped-subtitle">
                A year of stories, moods and discoveries.
              </p>

              <button
                type="button"
                className="insights-wrapped-cta-btn"
                onClick={handleOpenWrapped}
              >
                <span>View Your Wrapped</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Right Decorative Book Collage */}
            <div className="insights-wrapped-visual" aria-hidden="true">
              <div className="insights-book-collage">
                {collageBooks.map((book, index) => {
                  const tiltClass =
                    index === 0
                      ? 'collage-book-left'
                      : index === 1
                      ? 'collage-book-center'
                      : 'collage-book-right'

                  return (
                    <div key={book.id} className={`insights-collage-book ${tiltClass}`}>
                      <div className="insights-collage-cover">
                        <img
                          src={book.coverUrl}
                          alt=""
                          className="insights-collage-img"
                          loading="lazy"
                        />
                        <div className="insights-book-spine-highlight" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Wrapped Review Modal */}
      <WrappedModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={data}
      />
    </>
  )
}

export default ReadingWrappedBanner
