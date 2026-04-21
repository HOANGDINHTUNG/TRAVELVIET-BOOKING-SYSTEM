import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useTranslation } from 'react-i18next'
import { heroSlides } from '../../data/travelData'
import './Hero.css'

type Direction = 'leftToRight' | 'rightToLeft' | 'topDown' | 'bottomUp'

type DirectionConfig = {
  x: number
  y: number
  waveFrom: { xPercent: number; yPercent: number; rotate: number }
  waveTo: { xPercent: number; yPercent: number }
}

const directions: Direction[] = [
  'leftToRight',
  'rightToLeft',
  'topDown',
  'bottomUp',
]

const thumbnailCopies = [0, 1, 2]

const directionConfig: Record<Direction, DirectionConfig> = {
  leftToRight: {
    x: -100,
    y: 0,
    waveFrom: { xPercent: -130, yPercent: 0, rotate: 0 },
    waveTo: { xPercent: 130, yPercent: 0 },
  },
  rightToLeft: {
    x: 100,
    y: 0,
    waveFrom: { xPercent: 130, yPercent: 0, rotate: 0 },
    waveTo: { xPercent: -130, yPercent: 0 },
  },
  topDown: {
    x: 0,
    y: -100,
    waveFrom: { xPercent: 0, yPercent: -130, rotate: 90 },
    waveTo: { xPercent: 0, yPercent: 130 },
  },
  bottomUp: {
    x: 0,
    y: 100,
    waveFrom: { xPercent: 0, yPercent: 130, rotate: 90 },
    waveTo: { xPercent: 0, yPercent: -130 },
  },
}

function pickRandomDirection(lastDirection: Direction) {
  const pool = directions.filter((direction) => direction !== lastDirection)
  return pool[Math.floor(Math.random() * pool.length)]
}

export function Hero() {
  const { t } = useTranslation()
  const [activeSlide, setActiveSlide] = useState(0)
  const [previousSlide, setPreviousSlide] = useState<number | null>(null)
  const [transitionStep, setTransitionStep] = useState(0)

  const activeSlideRef = useRef(activeSlide)
  const directionRef = useRef<Direction>('leftToRight')
  const animatingRef = useRef(false)
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const copyRef = useRef<HTMLParagraphElement | null>(null)
  const ctaRef = useRef<HTMLAnchorElement | null>(null)
  const activeBgRef = useRef<HTMLImageElement | null>(null)
  const oldBgRef = useRef<HTMLImageElement | null>(null)
  const rippleRef = useRef<HTMLDivElement | null>(null)
  const thumbnailTrackRef = useRef<HTMLDivElement | null>(null)
  const thumbnailPositionRef = useRef(heroSlides.length)

  const activeHero = heroSlides[activeSlide]
  const oldHero = previousSlide === null ? null : heroSlides[previousSlide]

  useEffect(() => {
    activeSlideRef.current = activeSlide
  }, [activeSlide])

  const getThumbnailStep = useCallback(() => {
    const track = thumbnailTrackRef.current
    const firstThumb = track?.querySelector<HTMLButtonElement>('.hero-thumb')
    const secondThumb = firstThumb?.nextElementSibling as
      | HTMLButtonElement
      | null

    if (!firstThumb) {
      return 0
    }

    return secondThumb
      ? secondThumb.offsetLeft - firstThumb.offsetLeft
      : firstThumb.offsetWidth
  }, [])

  const syncThumbnailTrack = useCallback(() => {
    const track = thumbnailTrackRef.current
    const step = getThumbnailStep()

    if (!track || !step) {
      return
    }

    gsap.set(track, {
      x: -thumbnailPositionRef.current * step,
    })
  }, [getThumbnailStep])

  const changeHeroSlide = useCallback((nextSlide: number) => {
    const currentSlide = activeSlideRef.current

    if (animatingRef.current || nextSlide === currentSlide) {
      return
    }

    animatingRef.current = true
    directionRef.current = pickRandomDirection(directionRef.current)

    gsap
      .timeline({
        onComplete: () => {
          setPreviousSlide(currentSlide)
          setActiveSlide(nextSlide)
          setTransitionStep((step) => step + 1)
        },
      })
      .to(
        titleRef.current,
        {
          autoAlpha: 0,
          y: -72,
          duration: 0.62,
          ease: 'power3.in',
        },
        0,
      )
      .to(
        [copyRef.current, ctaRef.current],
        {
          autoAlpha: 0,
          duration: 0.62,
          ease: 'power2.out',
        },
        0,
      )
      .to(
        ctaRef.current,
        {
          y: -12,
          duration: 0.62,
          ease: 'power2.out',
        },
        0,
      )
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      changeHeroSlide((activeSlideRef.current + 1) % heroSlides.length)
    }, 5200)

    return () => window.clearTimeout(timer)
  }, [activeSlide, changeHeroSlide])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(activeBgRef.current, {
        autoAlpha: 1,
        scale: 1,
        xPercent: 0,
        yPercent: 0,
        clipPath: 'inset(0 0 0 0)',
      })
      syncThumbnailTrack()

      gsap
        .timeline()
        .fromTo(
          titleRef.current,
          { autoAlpha: 0, y: 52 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.05,
            ease: 'power3.out',
          },
          0,
        )
        .fromTo(
          [copyRef.current, ctaRef.current],
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 1.05,
            ease: 'power2.out',
          },
          0,
        )
    })

    return () => ctx.revert()
  }, [syncThumbnailTrack])

  useEffect(() => {
    window.addEventListener('resize', syncThumbnailTrack)

    return () => {
      window.removeEventListener('resize', syncThumbnailTrack)
    }
  }, [syncThumbnailTrack])

  useEffect(() => {
    const activeBg = activeBgRef.current
    const title = titleRef.current
    const copy = copyRef.current
    const cta = ctaRef.current
    const ripple = rippleRef.current
    const thumbnailTrack = thumbnailTrackRef.current

    if (!activeBg || !title || !copy || !cta) {
      return undefined
    }

    const oldBg = oldBgRef.current
    const config = directionConfig[directionRef.current]
    const hasOldBackground = Boolean(oldBg)
    const timeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        animatingRef.current = false
      },
    })

    if (oldBg) {
      gsap.set(oldBg, {
        zIndex: 1,
        xPercent: 0,
        yPercent: 0,
        scale: 1,
        autoAlpha: 1,
        clipPath: 'inset(0 0 0 0)',
      })

      timeline.to(
        oldBg,
        {
          scale: 1.025,
          autoAlpha: 1,
          duration: 1.45,
          ease: 'none',
        },
        0,
      )
    }

    if (ripple && hasOldBackground) {
      gsap.set(ripple, {
        ...config.waveFrom,
        autoAlpha: 0,
        scaleX: directionRef.current.includes('To') ? 1.2 : 0.7,
        scaleY: directionRef.current.includes('To') ? 0.78 : 1.28,
      })

      timeline
        .to(
          ripple,
          {
            autoAlpha: 0.48,
            duration: 0.22,
            ease: 'power2.out',
          },
          0.05,
        )
        .to(
          ripple,
          {
            ...config.waveTo,
            duration: 1,
            ease: 'sine.inOut',
          },
          0.05,
        )
        .to(
          ripple,
          {
            autoAlpha: 0,
            duration: 0.35,
            ease: 'power2.out',
          },
          0.74,
        )
    }

    const currentThumbnailPosition = thumbnailPositionRef.current
    const currentThumbnailSlide =
      ((Math.round(currentThumbnailPosition) % heroSlides.length) +
        heroSlides.length) %
      heroSlides.length
    let thumbnailDelta = activeSlide - currentThumbnailSlide

    if (thumbnailDelta > heroSlides.length / 2) {
      thumbnailDelta -= heroSlides.length
    }

    if (thumbnailDelta < -heroSlides.length / 2) {
      thumbnailDelta += heroSlides.length
    }

    const nextThumbnailPosition = currentThumbnailPosition + thumbnailDelta
    const thumbnailStep = getThumbnailStep()

    thumbnailPositionRef.current = nextThumbnailPosition

    timeline
      .fromTo(
        activeBg,
        {
          zIndex: 3,
          xPercent: hasOldBackground ? config.x : 0,
          yPercent: hasOldBackground ? config.y : 0,
          scale: hasOldBackground ? 1.02 : 1.03,
          autoAlpha: hasOldBackground ? 1 : 0,
          clipPath: 'inset(0 0 0 0)',
        },
        {
          xPercent: 0,
          yPercent: 0,
          scale: 1,
          autoAlpha: 1,
          clipPath: 'inset(0 0 0 0)',
          duration: hasOldBackground ? 1.45 : 0.76,
          ease: hasOldBackground ? 'power2.inOut' : 'expo.out',
        },
        0,
      )
      .fromTo(
        title,
        { autoAlpha: 0, y: 74 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.05,
          ease: 'power3.out',
        },
        0.22,
      )
      .fromTo(
        [copy, cta],
        { autoAlpha: 0, y: 0 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.05,
          ease: 'power2.out',
        },
        0.22,
      )

    if (thumbnailTrack && thumbnailStep) {
      timeline.to(
        thumbnailTrack,
        {
          x: -nextThumbnailPosition * thumbnailStep,
          duration: hasOldBackground ? 1.45 : 0,
          ease: 'sine.inOut',
          onComplete: () => {
            if (
              nextThumbnailPosition >= heroSlides.length &&
              nextThumbnailPosition < heroSlides.length * 2
            ) {
              return
            }

            thumbnailPositionRef.current = heroSlides.length + activeSlide
            syncThumbnailTrack()
          },
        },
        0.18,
      )
    }

    return () => {
      timeline.kill()
    }
  }, [activeSlide, getThumbnailStep, syncThumbnailTrack, transitionStep])

  return (
    <section className="hero-section" id="home">
      <div className="hero-background" aria-hidden="true">
        {oldHero && (
          <img
            key={`old-${transitionStep}`}
            ref={oldBgRef}
            className="hero-bg-image hero-bg-image-old"
            src={oldHero.image}
            alt=""
          />
        )}
        <img
          key={`active-${transitionStep}`}
          ref={activeBgRef}
          className="hero-bg-image hero-bg-image-active"
          src={activeHero.image}
          alt=""
        />
        <div className="hero-ripple-layer" ref={rippleRef}></div>
      </div>

      <div className="hero-content">
        <p className="eyebrow">{t(`hero.slides.${activeSlide}.kicker`)}</p>
        <h1 ref={titleRef}>
          <span>{t(`hero.slides.${activeSlide}.titleTop`)}</span>
          {t(`hero.slides.${activeSlide}.titleMain`)}
        </h1>
        <p className="hero-copy" ref={copyRef}>
          {t(`hero.slides.${activeSlide}.copy`)}
        </p>
        <a className="primary-button" ref={ctaRef} href="#destinations">
          {t('hero.cta')}
        </a>
      </div>

      <div
        className="hero-thumbnails"
        aria-label="Featured trip images"
      >
        <div className="hero-thumbnails-track" ref={thumbnailTrackRef}>
          {thumbnailCopies.map((copyIndex) =>
            heroSlides.map((slide, slideIndex) => (
              <button
                className={`hero-thumb ${
                  activeSlide === slideIndex ? 'is-active' : ''
                }`}
                key={`${copyIndex}-${slideIndex}`}
                onClick={() => changeHeroSlide(slideIndex)}
                type="button"
                aria-label={`Show ${t(`hero.slides.${slideIndex}.titleMain`)}`}
              >
                <img src={slide.image} alt="" />
              </button>
            )),
          )}
        </div>
      </div>
    </section>
  )
}
