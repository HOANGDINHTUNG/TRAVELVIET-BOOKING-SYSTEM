import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from 'react-i18next'
import './StorySection.css'

gsap.registerPlugin(ScrollTrigger)

const serviceImages = [
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=85',
]

function hasServiceAccess() {
  if (typeof window === 'undefined') {
    return false
  }

  return Boolean(
    window.localStorage.getItem('travelviet-auth-token') ||
      window.localStorage.getItem('travelviet-user') ||
      window.localStorage.getItem('auth-token') ||
      window.localStorage.getItem('token'),
  )
}

export function StorySection() {
  const { i18n, t } = useTranslation()
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [activeService, setActiveService] = useState<number | null>(null)
  const [notice, setNotice] = useState('')

  const services = useMemo(
    () =>
      serviceImages.map((image, index) => ({
        image,
        title: t(`services.items.${index}.title`),
        copy: t(`services.items.${index}.copy`),
        detail: t(`services.items.${index}.detail`),
      })),
    [i18n.language, t],
  )

  useEffect(() => {
    const section = sectionRef.current

    if (!section) {
      return undefined
    }

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.service-panel')
      const backgrounds = panels.map((panel) =>
        panel.querySelector<HTMLElement>('.service-panel-bg'),
      )
      const outerWrappers = panels.map((panel) =>
        panel.querySelector<HTMLElement>('.service-panel-outer'),
      )
      const innerWrappers = panels.map((panel) =>
        panel.querySelector<HTMLElement>('.service-panel-inner'),
      )
      const contents = panels.map((panel) =>
        panel.querySelector<HTMLElement>('.service-panel-content'),
      )

      if (panels.length === 0) {
        return
      }

      gsap.set(panels, {
        autoAlpha: 1,
        zIndex: (index) => index + 1,
        pointerEvents: 'none',
      })
      gsap.set(panels[0], { pointerEvents: 'auto' })
      gsap.set(outerWrappers[0], { yPercent: 0 })
      gsap.set(innerWrappers[0], { yPercent: 0 })
      gsap.set(backgrounds[0], { yPercent: 0, scale: 1 })
      gsap.set(contents[0], { autoAlpha: 1, yPercent: 0 })
      gsap.set(outerWrappers.slice(1), { yPercent: 100 })
      gsap.set(innerWrappers.slice(1), { yPercent: -100 })
      gsap.set(backgrounds.slice(1), { yPercent: 12, scale: 1.08 })
      gsap.set(contents.slice(1), { autoAlpha: 0, yPercent: 70 })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${Math.max(1, panels.length - 1) * 900}`,
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => {
            gsap.set(panels[0], { pointerEvents: 'auto' })
          },
        },
        defaults: { ease: 'none' },
      })

      panels.slice(1).forEach((panel, index) => {
        const panelIndex = index + 1
        const previousPanel = panels[panelIndex - 1]
        const startAt = index

        timeline
          .set(panel, { pointerEvents: 'auto' }, startAt)
          .set(previousPanel, { pointerEvents: 'none' }, startAt)
          .to(
            backgrounds[panelIndex - 1],
            { yPercent: -8, scale: 1.03, duration: 1 },
            startAt,
          )
          .to(
            [outerWrappers[panelIndex], innerWrappers[panelIndex]],
            { yPercent: 0, duration: 1 },
            startAt,
          )
          .to(
            backgrounds[panelIndex],
            { yPercent: 0, scale: 1, duration: 1 },
            startAt,
          )
          .to(
            contents[panelIndex],
            { autoAlpha: 1, yPercent: 0, duration: 0.42, ease: 'power2.out' },
            startAt + 0.38,
          )
      })

      ScrollTrigger.refresh()
    }, section)

    return () => {
      ctx.revert()
    }
  }, [i18n.language])

  const handleDetailClick = (index: number) => {
    if (!hasServiceAccess()) {
      setActiveService(null)
      setNotice(t('services.locked'))
      return
    }

    setNotice('')
    setActiveService(index)
  }

  return (
    <section className="services-wrap" id="guide">
      <div className="services-intro-panel">
        <p className="eyebrow">{t('services.eyebrow')}</p>
        <h2>{t('services.title')}</h2>
        <p>{t('services.copy')}</p>
      </div>

      <div className="services-section" ref={sectionRef}>
        <div className="services-panels">
          {services.map((service, index) => (
            <article
              className={`service-panel ${index === 0 ? 'is-active' : ''}`}
              key={service.title}
            >
              <div className="service-panel-outer">
                <div className="service-panel-inner">
                  <div
                    className="service-panel-bg"
                    style={{ backgroundImage: `url(${service.image})` }}
                    aria-hidden="true"
                  ></div>
                  <div className="service-panel-content">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <h3>{service.title}</h3>
                    <p>{service.copy}</p>
                    <button
                      type="button"
                      onClick={() => handleDetailClick(index)}
                    >
                      {t('services.detailButton')}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {(notice || activeService !== null) && (
          <div className="service-detail-panel" role="status">
            {notice || services[activeService ?? 0].detail}
          </div>
        )}
      </div>
    </section>
  )
}
