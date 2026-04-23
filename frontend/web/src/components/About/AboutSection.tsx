import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './AboutSection.css'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 83, labelKey: 'about.stats.0' },
  { value: 12, labelKey: 'about.stats.1' },
  { value: 67, labelKey: 'about.stats.2' },
  { value: 98, labelKey: 'about.stats.3' },
]

export function AboutSection() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement | null>(null)
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const numberElements = numberRefs.current.filter(
      (item): item is HTMLSpanElement => Boolean(item),
    )

    if (!section || numberElements.length === 0) {
      return undefined
    }

    const counterState = stats.map(() => ({ value: 0 }))

    const resetCounters = () => {
      counterState.forEach((counter) => {
        counter.value = 0
      })
      numberElements.forEach((element) => {
        element.textContent = '0'
      })
    }

    const ctx = gsap.context(() => {
      resetCounters()

      ScrollTrigger.create({
        trigger: section,
        start: 'top 68%',
        end: 'bottom 30%',
        onEnter: () => {
          resetCounters()
          gsap.to(counterState, {
            value: (index: number) => stats[index].value,
            duration: 1.55,
            ease: 'power3.out',
            onUpdate: () => {
              counterState.forEach((counter, index) => {
                numberElements[index].textContent = Math.round(
                  counter.value,
                ).toString()
              })
            },
          })
        },
        onLeave: resetCounters,
        onEnterBack: () => {
          resetCounters()
          gsap.to(counterState, {
            value: (index: number) => stats[index].value,
            duration: 1.55,
            ease: 'power3.out',
            onUpdate: () => {
              counterState.forEach((counter, index) => {
                numberElements[index].textContent = Math.round(
                  counter.value,
                ).toString()
              })
            },
          })
        },
        onLeaveBack: resetCounters,
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section className="about-section" ref={sectionRef}>
      <div className="about-inner">
        <div className="about-grid">
          <figure className="about-image-main">
            <img
              data-motion-image
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=85"
              alt=""
            />
          </figure>

          <div className="about-content">
            <p className="about-eyebrow">{t('about.eyebrow')}</p>
            <h2>{t('about.title')}</h2>
            <p>{t('about.copy')}</p>
            <ul>
              <li>{t('about.points.0')}</li>
              <li>{t('about.points.1')}</li>
              <li>{t('about.points.2')}</li>
            </ul>
            <a href="#packages">{t('about.cta')}</a>
          </div>

          <figure className="about-image-side">
            <img
              data-motion-image
              src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=85"
              alt=""
            />
          </figure>
        </div>

        <div className="about-stats-heading">
          <p className="about-eyebrow">{t('about.statsEyebrow')}</p>
          <h3>{t('about.statsTitle')}</h3>
        </div>

        <div className="about-stats">
          {stats.map((stat, index) => (
            <div className="about-stat" key={stat.labelKey}>
              <strong>
                <span
                  ref={(node) => {
                    numberRefs.current[index] = node
                  }}
                >
                  0
                </span>
              </strong>
              <p>{t(stat.labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
