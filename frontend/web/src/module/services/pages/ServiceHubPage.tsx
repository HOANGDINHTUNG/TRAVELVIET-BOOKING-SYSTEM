import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Plane, Car, Building2, FileText } from 'lucide-react'

import { Footer } from '@/components/Footer/Footer'
import { CustomerPageHero } from '@/components/ui/CustomerPageHero/CustomerPageHero'
import './ServiceHubPage.css'

type ServiceKey = 'flights' | 'hotels' | 'car-rental' | 'visa'

const SERVICE_META: Record<
  ServiceKey,
  { icon: typeof Plane; toursLink: string }
> = {
  flights: { icon: Plane, toursLink: '/tours?internationalOnly=true' },
  hotels: { icon: Building2, toursLink: '/tours?domesticOnly=true' },
  'car-rental': { icon: Car, toursLink: '/tours?domesticOnly=true' },
  visa: { icon: FileText, toursLink: '/support' },
}

function resolveServiceKey(pathname: string): ServiceKey | null {
  const segment = pathname.replace(/\/+$/, '').split('/').pop()
  if (
    segment === 'flights' ||
    segment === 'hotels' ||
    segment === 'car-rental' ||
    segment === 'visa'
  ) {
    return segment
  }
  return null
}

export default function ServiceHubPage() {
  const { pathname } = useLocation()
  const { t } = useTranslation('translation')
  const serviceKey = resolveServiceKey(pathname)

  if (!serviceKey) {
    return null
  }

  const meta = SERVICE_META[serviceKey]
  const Icon = meta.icon
  const title = t(`homePage.services.${serviceKey === 'car-rental' ? 'carRental' : serviceKey}`)

  return (
    <div className="service-hub-page">
      <CustomerPageHero
        variant="ocean"
        kicker="Travel Viet"
        title={title}
        lead={t(`serviceHub.${serviceKey}.lead`)}
        actions={
          <div className="service-hub-page__actions">
            <Link className="service-hub-page__btn service-hub-page__btn--primary" to={meta.toursLink}>
              {t(`serviceHub.${serviceKey}.primaryCta`)}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link className="service-hub-page__btn" to="/support">
              {t('serviceHub.contactSupport')}
            </Link>
          </div>
        }
        metrics={[
          {
            icon: <Icon className="h-4 w-4" aria-hidden />,
            value: title,
            label: t('serviceHub.serviceLabel'),
          },
        ]}
      />

      <section className="service-hub-page__body">
        <p>{t(`serviceHub.${serviceKey}.body`)}</p>
        <Link to="/tours" className="service-hub-page__link">
          {t('serviceHub.browseTours')}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </section>

      <Footer />
    </div>
  )
}
