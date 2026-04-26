import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { SlidersHorizontal, SunMedium } from 'lucide-react'
import { MdTranslate } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import {
  toggleLanguage,
  toggleTheme,
} from '../../stores/slices/preferencesSlice'
import './FloatingUtilities.css'

type FloatingPosition = {
  x: number
  y: number
}

const STORAGE_KEY = 'travelviet-floating-utilities-position'
const BUTTON_SIZE = 64
const EDGE_GAP = 18

function getDefaultPosition() {
  if (typeof window === 'undefined') {
    return { x: 24, y: 240 }
  }

  return {
    x: window.innerWidth - BUTTON_SIZE - 24,
    y: Math.max(160, window.innerHeight * 0.48),
  }
}

function clampPosition(position: FloatingPosition) {
  if (typeof window === 'undefined') {
    return position
  }

  return {
    x: Math.min(
      Math.max(EDGE_GAP, position.x),
      window.innerWidth - BUTTON_SIZE - EDGE_GAP,
    ),
    y: Math.min(
      Math.max(EDGE_GAP, position.y),
      window.innerHeight - BUTTON_SIZE - EDGE_GAP,
    ),
  }
}

export function FloatingUtilities() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { language } = useAppSelector((state) => state.preferences)
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<FloatingPosition>(() => {
    if (typeof window === 'undefined') {
      return getDefaultPosition()
    }

    const savedPosition = window.localStorage.getItem(STORAGE_KEY)
    if (!savedPosition) {
      return getDefaultPosition()
    }

    try {
      return clampPosition(JSON.parse(savedPosition) as FloatingPosition)
    } catch {
      return getDefaultPosition()
    }
  })
  const dragState = useRef({
    active: false,
    dragged: false,
    offsetX: 0,
    offsetY: 0,
  })

  useEffect(() => {
    const handleResize = () => {
      setPosition((currentPosition) => clampPosition(currentPosition))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(position))
  }, [position])

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    const target = event.currentTarget
    target.setPointerCapture(event.pointerId)

    dragState.current = {
      active: true,
      dragged: false,
      offsetX: event.clientX - position.x,
      offsetY: event.clientY - position.y,
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dragState.current.active) {
      return
    }

    const nextPosition = clampPosition({
      x: event.clientX - dragState.current.offsetX,
      y: event.clientY - dragState.current.offsetY,
    })

    if (
      Math.abs(nextPosition.x - position.x) > 2 ||
      Math.abs(nextPosition.y - position.y) > 2
    ) {
      dragState.current.dragged = true
    }

    setPosition(nextPosition)
  }

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId)
    dragState.current.active = false

    if (!dragState.current.dragged) {
      setIsOpen((currentValue) => !currentValue)
    }
  }

  return (
    <div
      className={`floating-utilities ${isOpen ? 'is-open' : ''}`}
      style={{ left: position.x, top: position.y }}
    >
      <div className="floating-utilities-panel" aria-hidden={!isOpen}>
        <button
          className="floating-utility-action"
          type="button"
          aria-label={t('utilities.theme')}
          onClick={() => dispatch(toggleTheme())}
        >
          <SunMedium className="utility-action-icon" aria-hidden="true" />
        </button>
        <button
          className="floating-utility-action"
          type="button"
          aria-label={t('utilities.language')}
          onClick={() => dispatch(toggleLanguage())}
        >
          <MdTranslate className="utility-action-icon" aria-hidden="true" />
        </button>
      </div>

      <button
        className="floating-utilities-trigger"
        type="button"
        aria-label={isOpen ? t('utilities.close') : t('utilities.open')}
        aria-expanded={isOpen}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <SlidersHorizontal className="utility-trigger-icon" aria-hidden="true" />
      </button>
      <strong className="floating-language-indicator">
        {language.toUpperCase()}
      </strong>
    </div>
  )
}
