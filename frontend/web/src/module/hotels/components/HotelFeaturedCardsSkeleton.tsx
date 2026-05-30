import { useTranslation } from 'react-i18next'
import { BrandCardsSkeleton } from '@/components/ui/BrandCardsSkeleton'

export function HotelFeaturedCardsSkeleton() {
  const { t } = useTranslation('translation', { keyPrefix: 'hotelsPage' })

  return (
    <BrandCardsSkeleton
      count={4}
      layout="flex"
      tallCards
      ariaLabel={t('featured.loadingAria')}
      tagline={t('hero.brandTagline')}
    />
  )
}
