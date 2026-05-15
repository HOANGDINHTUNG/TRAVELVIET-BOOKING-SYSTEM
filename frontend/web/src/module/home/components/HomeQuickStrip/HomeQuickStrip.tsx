import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Compass, LifeBuoy, MapPin, Stamp } from 'lucide-react'
import './HomeQuickStrip.css'

const links = [
  { to: '/tours', labelKey: 'homeQuick.tours' as const, Icon: Compass },
  { to: '/destinations', labelKey: 'homeQuick.destinations' as const, Icon: MapPin },
  { to: '/support', labelKey: 'homeQuick.support' as const, Icon: LifeBuoy },
  { to: '/passport', labelKey: 'homeQuick.passport' as const, Icon: Stamp },
]

export function HomeQuickStrip() {
  const { t } = useTranslation()

  return (
    <nav className="home-quick-strip" aria-label={t('homeQuick.aria')}>
      <div className="home-quick-strip-inner">
        {links.map(({ to, labelKey, Icon }) => (
          <Link className="home-quick-link" key={to} to={to}>
            <span className="home-quick-link-icon" aria-hidden="true">
              <Icon size={22} strokeWidth={2.2} />
            </span>
            <span className="home-quick-link-label">{t(labelKey)}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
