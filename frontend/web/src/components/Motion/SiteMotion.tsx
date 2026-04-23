import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import './SiteMotion.css'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText)

const splitHeadingSelector = [
  '.stats-strip strong',
  '.section-heading h2',
  '.about-content h2',
  '.about-stats-heading h3',
  '.travel-film-copy h2',
  '.weather-alert-copy h2',
  '.weather-main-card h3',
  '.tour-card h3',
  '.contact-section > div h2',
  '.footer-hero h2',
  '.footer-links h3',
].join(', ')

const revealSelector = [
  '.site-nav .brand',
  '.site-nav .nav-links a',
  '.site-nav .nav-actions > *',
  '.booking-bar label',
  '.booking-bar button',
  '.stats-strip > div',
  '.stats-strip span',
  '.about-image-main',
  '.about-image-side',
  '.about-eyebrow',
  '.about-content > p',
  '.about-content li',
  '.about-content a',
  '.about-stat',
  '.destination-heading .eyebrow',
  '.destination-heading > p',
  '.destination-tile',
  '.travel-film-copy .eyebrow',
  '.travel-film-copy > p',
  '.travel-film-route article',
  '.travel-video-toolbar',
  '.travel-video-frame',
  '.travel-video-caption',
  '.weather-alert-copy .eyebrow',
  '.weather-alert-copy > p',
  '.weather-main-card',
  '.weather-route-note',
  '.weather-metrics article',
  '.weather-alert-item',
  '.weather-timeline article',
  '.weather-detail-button',
  '.package-section .section-heading .eyebrow',
  '.package-section .section-heading > p',
  '.tour-card',
  '.tour-body > p',
  '.tour-info-list span',
  '.tour-footer',
  '.travel-video-shell',
  '.contact-section > div > p',
  '.contact-form label',
  '.contact-form button',
  '.footer-subscribe',
  '.footer-links > *',
  '.footer-bottom',
].join(', ')

const hoverSelector = [
  '.booking-bar button',
  '.about-content a',
  '.tour-card button',
  '.weather-detail-button',
  '.contact-form button',
  '.footer-subscribe button',
  '.nav-action',
  '.nav-auth-link',
].join(', ')

const hoverCardSelector = [
  '.tour-card',
  '.destination-tile',
  '.travel-video-shell',
  '.weather-alert-item',
  '.weather-metrics article',
  '.contact-form',
  '.about-stat',
].join(', ')

const imageFrameSelector = [
  '.about-image-main',
  '.about-image-side',
  '.tour-image',
].join(', ')

function isReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function SiteMotion() {
  const location = useLocation()
  const { i18n } = useTranslation()

  useEffect(() => {
    const smoother = ScrollSmoother.get()

    if (location.pathname !== '/') {
      smoother?.kill()
    }
  }, [location.pathname])

  useEffect(() => {
    if (location.pathname !== '/' || typeof window === 'undefined') {
      return undefined
    }

    const reduceMotion = isReducedMotion()
    const wrapper = document.querySelector<HTMLElement>('#smooth-wrapper')
    const content = document.querySelector<HTMLElement>('#smooth-content')

    if (!wrapper || !content) {
      return undefined
    }

    const ctx = gsap.context(() => {
      let smoother: ScrollSmoother | undefined
      let hoverCleanups: Array<() => void> = []

      if (!reduceMotion && window.innerWidth > 900) {
        ScrollSmoother.get()?.kill()
        smoother = ScrollSmoother.create({
          wrapper,
          content,
          smooth: 1.05,
          smoothTouch: 0.12,
          effects: true,
          normalizeScroll: true,
          ignoreMobileResize: true,
        })
      }

      const splitTargets = gsap.utils.toArray<HTMLElement>(splitHeadingSelector)
      const splits = reduceMotion
        ? []
        : splitTargets.map((target) =>
            SplitText.create(target, {
              type: 'lines,words,chars',
              mask: 'lines',
              linesClass: 'motion-line',
              wordsClass: 'motion-word',
              charsClass: 'motion-char',
              aria: 'auto',
            }),
          )

      splits.forEach((split) => {
        gsap.set(split.words, {
          yPercent: 135,
          autoAlpha: 0,
          rotateX: -28,
          filter: 'blur(10px)',
          transformPerspective: 700,
        })

        gsap.to(split.words, {
          yPercent: 0,
          autoAlpha: 1,
          rotateX: 0,
          filter: 'blur(0px)',
          duration: 1.05,
          ease: 'expo.out',
          stagger: {
            amount: 0.34,
            from: 'start',
          },
          scrollTrigger: {
            trigger: split.elements[0],
            start: 'top 84%',
            once: true,
          },
        })
      })

      const revealItems = gsap.utils.toArray<HTMLElement>(revealSelector)
      const imageFrames = gsap.utils.toArray<HTMLElement>(imageFrameSelector)

      if (reduceMotion) {
        gsap.set([...splitTargets, ...revealItems, ...imageFrames], {
          clearProps: 'all',
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          clipPath: 'inset(0% 0% 0% 0%)',
        })
      } else {
        gsap.set(revealItems, {
          autoAlpha: 0,
          y: 76,
          scale: 0.965,
          rotateX: -8,
          filter: 'blur(14px)',
          transformPerspective: 900,
          transformOrigin: '50% 100%',
        })

        ScrollTrigger.batch(revealItems, {
          start: 'top 88%',
          once: true,
          interval: 0.08,
          batchMax: 8,
          onEnter: (batch) => {
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              filter: 'blur(0px)',
              duration: 0.95,
              ease: 'expo.out',
              stagger: {
                each: 0.055,
                from: 'start',
              },
              overwrite: 'auto',
            })
          },
        })

        imageFrames.forEach((frame, index) => {
          const image = frame.querySelector<HTMLElement>('img')
          const horizontalDrift = index % 2 === 0 ? 2.4 : -2.4

          gsap.fromTo(
            frame,
            {
              clipPath: 'inset(16% 12% 16% 12%)',
              filter: 'blur(8px)',
            },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              filter: 'blur(0px)',
              duration: 1.15,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: frame,
                start: 'top 86%',
                once: true,
              },
            },
          )

          if (image) {
            gsap.fromTo(
              image,
              {
                scale: 1.16,
                xPercent: horizontalDrift,
                yPercent: -8,
              },
              {
                scale: 1.04,
                xPercent: -horizontalDrift,
                yPercent: 8,
                ease: 'none',
                scrollTrigger: {
                  trigger: frame,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.9,
                },
              },
            )
          }
        })

        gsap.utils.toArray<HTMLElement>('[data-motion-float]').forEach((item, index) => {
          gsap.to(item, {
            y: index % 2 === 0 ? -16 : 14,
            x: index % 2 === 0 ? 7 : -7,
            rotate: index % 2 === 0 ? 1.5 : -1.5,
            duration: 3 + index * 0.18,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          })
        })

        const hoverButtons = gsap.utils.toArray<HTMLElement>(hoverSelector)
        const hoverCards = gsap.utils.toArray<HTMLElement>(hoverCardSelector)

        hoverCleanups = hoverButtons.map((item) => {
          const enter = () => {
            gsap.to(item, {
              y: -5,
              scale: 1.035,
              duration: 0.24,
              ease: 'power2.out',
              overwrite: 'auto',
            })
          }
          const leave = () => {
            gsap.to(item, {
              y: 0,
              scale: 1,
              duration: 0.28,
              ease: 'power2.out',
              overwrite: 'auto',
            })
          }

          item.addEventListener('pointerenter', enter)
          item.addEventListener('pointerleave', leave)
          item.addEventListener('blur', leave)

          return () => {
            item.removeEventListener('pointerenter', enter)
            item.removeEventListener('pointerleave', leave)
            item.removeEventListener('blur', leave)
          }
        })

        hoverCleanups.push(
          ...hoverCards.map((item) => {
            const enter = () => {
              gsap.to(item, {
                y: -8,
                rotateX: 1.2,
                rotateY: -1.2,
                scale: 1.012,
                duration: 0.32,
                ease: 'power2.out',
                overwrite: 'auto',
              })
            }
            const leave = () => {
              gsap.to(item, {
                y: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.38,
                ease: 'power2.out',
                overwrite: 'auto',
              })
            }

            item.addEventListener('pointerenter', enter)
            item.addEventListener('pointerleave', leave)
            item.addEventListener('blur', leave)

            return () => {
              item.removeEventListener('pointerenter', enter)
              item.removeEventListener('pointerleave', leave)
              item.removeEventListener('blur', leave)
            }
          }),
        )
      }

      window.setTimeout(() => {
        ScrollTrigger.refresh()
        smoother?.refresh()
      }, 260)

      return () => {
        hoverCleanups.forEach((cleanup) => cleanup())
        splits.forEach((split) => split.revert())
        smoother?.kill()
      }
    }, document.body)

    return () => ctx.revert()
  }, [i18n.language, location.pathname])

  return null
}
