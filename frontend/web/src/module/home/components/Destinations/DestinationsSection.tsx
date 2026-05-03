import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Destination } from '../../database/travelData'
import './DestinationsSection.css'

gsap.registerPlugin(ScrollTrigger)

type DestinationsSectionProps = {
  destinations: Destination[]
}

export function DestinationsSection({ destinations }: DestinationsSectionProps) {
  const { t, i18n } = useTranslation()
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const stripRef = useRef<HTMLDivElement | null>(null)
  const resolveDestinationName = (item: Destination) => {
    const key = item.translationKey ? `data.destinations.${item.translationKey}` : ''

    return key && i18n.exists(key) ? t(key) : item.name
  }

  const renderTileContent = (item: Destination, destinationName: string) => {
    const badgeLabel = item.region || item.province || 'Vietnam'

    return (
      <>
        <div className="destination-image-frame">
          {item.image ? (
            <img src={item.image} alt={destinationName} />
          ) : (
            <div className="destination-image-empty">No image</div>
          )}
        </div>
        <span className="destination-badge">{badgeLabel}</span>
        <div className="destination-card-copy">
          <h3>{destinationName}</h3>
          <span>{item.tours}</span>
          <small>Xem chi tiet</small>
        </div>
      </>
    )
  }

  useEffect(() => {
    const wrapper = wrapperRef.current
    const strip = stripRef.current

    if (!wrapper || !strip) {
      return undefined
    }

    const ctx = gsap.context(() => {
      const getScrollDistance = () =>
        Math.max(0, strip.scrollWidth - window.innerWidth)

      gsap.to(strip, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          pin: true,
          scrub: 1,
          start: 'center center',
          end: () => `+=${strip.scrollWidth}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })

      window.setTimeout(() => ScrollTrigger.refresh(), 250)
    }, wrapper)

    return () => ctx.revert()
  }, [destinations.length])

  return (
    <section className="destination-section section-shell" id="destinations">
      <div className="section-heading destination-heading">
        <p className="eyebrow">{t('destinations.eyebrow')}</p>
        <h2>{t('destinations.title')}</h2>
        <p>{t('destinations.copy')}</p>
        <Link className="destination-more-link" to="/destinations">
          Xem thêm điểm đến
          <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      </div>
      <div className="destination-gallery-wrapper" ref={wrapperRef}>
        <div className="destination-gallery-strip" ref={stripRef}>
          {destinations.map((item) => {
            const destinationName = resolveDestinationName(item)
            const content = renderTileContent(item, destinationName)

            return item.uuid ? (
              <Link
                className="destination-tile"
                key={item.uuid}
                to={`/destinations/${item.uuid}`}
              >
                {content}
              </Link>
            ) : (
              <article className="destination-tile" key={item.name}>
                {content}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
