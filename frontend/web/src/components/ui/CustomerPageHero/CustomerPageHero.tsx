import type { ReactNode } from 'react'
import { User } from 'lucide-react'
import './CustomerPageHero.css'

export type CustomerPageHeroVariant = 'teal' | 'ocean' | 'sunset' | 'neutral'

export type CustomerPageHeroMetric = {
  icon?: ReactNode
  value: ReactNode
  label: string
}

type CustomerPageHeroProps = {
  kicker?: string
  title: string
  lead?: string
  variant?: CustomerPageHeroVariant
  avatar?: string
  metrics?: CustomerPageHeroMetric[]
  actions?: ReactNode
}

export function CustomerPageHero({
  kicker,
  title,
  lead,
  variant = 'teal',
  avatar,
  metrics,
  actions,
}: CustomerPageHeroProps) {
  return (
    <section className={`cph cph--${variant}`} aria-label={title}>
      <div className="cph__inner">
        <div className="cph__text">
          {kicker ? <p className="cph__kicker">{kicker}</p> : null}
          <h1 className="cph__title">{title}</h1>
          {lead ? <p className="cph__lead">{lead}</p> : null}
        </div>

        {/* Avatar */}
        {(avatar !== undefined) ? (
          <div className="cph__avatar">
            {avatar ? (
              <img
                src={avatar}
                alt=""
                aria-hidden="true"
                className="cph__avatar-img"
                loading="eager"
                decoding="async"
              />
            ) : (
              <div className="cph__avatar-placeholder" aria-hidden="true">
                <User size={28} strokeWidth={1.8} />
              </div>
            )}
          </div>
        ) : null}

        {/* Actions */}
        {actions ? <div className="cph__actions">{actions}</div> : null}

        {/* Metrics */}
        {metrics && metrics.length > 0 ? (
          <div className="cph__metrics" aria-label="Thống kê">
            {metrics.map((m, i) => (
              <div key={i} className="cph-metric">
                {m.icon ? (
                  <span className="cph-metric__icon" aria-hidden="true">
                    {m.icon}
                  </span>
                ) : null}
                <span className="cph-metric__value">{m.value}</span>
                <span className="cph-metric__label">{m.label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
