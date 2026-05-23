import { useId } from 'react'

import type { LanguageMode } from '../../constants/preferences'

type LocaleLanguageIconProps = {
  language: LanguageMode
  size?: number
  className?: string
}

/** Biểu tượng tròn: cờ Việt Nam (đỏ–vàng) hoặc quả địa cầu (tiếng Anh). */
export function LocaleLanguageIcon({
  language,
  size = 20,
  className,
}: LocaleLanguageIconProps) {
  const clipId = useId()

  if (language === 'vi') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={className}
        aria-hidden
        role="presentation"
      >
        <defs>
          <clipPath id={clipId}>
            <circle cx="12" cy="12" r="12" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <rect width="24" height="24" fill="#DA251D" />
          <path
            fill="#FFCD00"
            d="M12 5.2l1.35 4.15h4.38l-3.54 2.57 1.35 4.15L12 13.5l-3.54 2.57 1.35-4.15-3.54-2.57h4.38L12 5.2z"
          />
        </g>
        <circle
          cx="12"
          cy="12"
          r="11.25"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="1.5"
        />
      </svg>
    )
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      role="presentation"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <circle cx="12" cy="12" r="12" fill="#1e4f8a" />
        <ellipse
          cx="12"
          cy="12"
          rx="9.5"
          ry="3.2"
          fill="none"
          stroke="#7ec8e8"
          strokeWidth="1.1"
          opacity="0.95"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="3.2"
          ry="9.5"
          fill="none"
          stroke="#7ec8e8"
          strokeWidth="1.1"
          opacity="0.95"
        />
        <path
          d="M3.5 12h17"
          stroke="#7ec8e8"
          strokeWidth="1"
          opacity="0.75"
        />
        <path
          d="M12 3.5v17"
          stroke="#7ec8e8"
          strokeWidth="1"
          opacity="0.55"
        />
      </g>
      <circle
        cx="12"
        cy="12"
        r="11.25"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth="1.5"
      />
    </svg>
  )
}
