import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Destination } from '../../data/travelData'
import './DestinationsSection.css'

gsap.registerPlugin(ScrollTrigger)

type DestinationsSectionProps = {
  destinations: Destination[]
}

export function DestinationsSection({ destinations }: DestinationsSectionProps) {
  const { t } = useTranslation()
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const stripRef = useRef<HTMLDivElement | null>(null)

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
      </div>
      <div className="destination-gallery-wrapper" ref={wrapperRef}>
        <div className="destination-gallery-strip" ref={stripRef}>
          {destinations.map((item) => (
            <article className="destination-tile" key={item.name}>
              <img src={item.image} alt={item.name} />
              <div>
                <h3>{t(`data.destinations.${item.translationKey}`)}</h3>
                <span>{item.tours}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
