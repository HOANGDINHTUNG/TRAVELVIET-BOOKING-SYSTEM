import { catalogTourLinks } from '@/api/server/Tour.api'

/** Ảnh thumbnail dropdown (w≈300). */
export const HEADER_MEGA_IMAGES = {
  beachVn:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80',
  intlHot:
    'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=300&q=80',
  flashSale:
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=300&q=80',
  domestic:
    'https://images.unsplash.com/photo-1583417319070-4a540ac6e8a8?auto=format&fit=crop&w=300&q=80',
  destCentral:
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=300&q=80',
  destNorth:
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=300&q=80',
  destSouth:
    'https://images.unsplash.com/photo-1519046909882-ff08b4f4c1be?auto=format&fit=crop&w=300&q=80',
  destHighland:
    'https://images.unsplash.com/photo-1506905925340-21bda4d32df4?auto=format&fit=crop&w=300&q=80',
} as const

export const HEADER_MEGA_LINKS = {
  home: '/',
  toursDomestic: '/tours?domesticOnly=true',
  toursInternational: '/tours?internationalOnly=true',
  toursBeach: catalogTourLinks.domesticBeachFeatured,
  toursIntlHot: catalogTourLinks.internationalFeatured,
  toursFlash: catalogTourLinks.lastMinuteDeals,
  toursEsg: '/tours?domesticOnly=true&tourLine=esg',
  destinations: '/destinations',
  destDaNang: '/destinations/branch/da-nang',
  destHaLong: '/destinations/branch/vinh-ha-long',
  destPhuQuoc: '/destinations/branch/phu-quoc',
  destDaLat: '/destinations/branch/da-lat',
  support: '/support',
  passport: '/passport',
  account: '/account',
  login: '/login',
} as const
