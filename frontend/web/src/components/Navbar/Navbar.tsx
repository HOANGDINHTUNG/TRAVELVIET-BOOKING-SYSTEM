import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Navbar.css'

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

const navItems = [
  { href: '#home', labelKey: 'nav.home' },
  { href: '#destinations', labelKey: 'nav.about' },
  { href: '#packages', labelKey: 'nav.pages' },
  { href: '#guide', labelKey: 'nav.blog' },
  { href: '#contact', labelKey: 'nav.contact' },
]

export function Navbar() {
  const { t } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const navRef = useRef<HTMLElement | null>(null)
  const scrolledRef = useRef(false)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) {
      return undefined
    }

    gsap.set(nav, {
      clearProps: 'backgroundColor,color',
      backdropFilter: 'blur(0px)',
      boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
    })

    const handleScroll = () => {
      const shouldPin = window.scrollY > 48

      if (shouldPin === scrolledRef.current) {
        return
      }

      scrolledRef.current = shouldPin
      setIsScrolled(shouldPin)
      gsap.to(nav, {
        backdropFilter: shouldPin ? 'blur(18px)' : 'blur(0px)',
        boxShadow: shouldPin
          ? '0 18px 48px rgba(0, 0, 0, 0.26)'
          : '0 0 0 rgba(0, 0, 0, 0)',
        paddingTop: shouldPin ? 12 : 0,
        paddingBottom: shouldPin ? 12 : 0,
        duration: 0.38,
        ease: 'power2.out',
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    target: string,
  ) => {
    event.preventDefault()
    ScrollTrigger.refresh()

    gsap.to(window, {
      duration: 1,
      ease: 'power3.inOut',
      scrollTo: {
        y: target,
        offsetY: 96,
      },
    })
  }

  return (
    <nav
      className={`site-nav ${isScrolled ? 'is-scrolled' : ''}`}
      ref={navRef}
      aria-label="Main navigation"
    >
      <a
        className="brand"
        href="#home"
        aria-label="TravelViet"
        onClick={(event) => handleNavClick(event, '#home')}
      >
        <span className="brand-mark"></span>
        TravelViet
      </a>
      <div className="nav-links">
        {navItems.map((item) => (
          <a
            href={item.href}
            key={item.href}
            onClick={(event) => handleNavClick(event, item.href)}
          >
            {t(item.labelKey)}
          </a>
        ))}
      </div>
      <a
        className="nav-action"
        href="#contact"
        onClick={(event) => handleNavClick(event, '#contact')}
      >
        {t('nav.plan')}
      </a>
    </nav>
  )
}
