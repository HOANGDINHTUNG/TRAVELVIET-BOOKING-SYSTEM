import { catalogTourLinks } from '@/api/server/Tour.api'

/** Liên kết chính trên header (desktop + mobile). */
export const HEADER_NAV_LINKS = {
  home: '/',
  packageTour: '/tours?domesticOnly=true',
  flights: '/flights',
  hotels: '/hotels',
  combos: '/combos',
  travelCombo: '/combos',
  carRental: '/car-rental',
  visa: '/visa',
  support: '/support',
  passport: '/passport',
  account: '/account',
  login: '/login',
  myBookings: '/my-bookings',
  destinations: '/destinations',
  toursDomestic: '/tours?domesticOnly=true',
  toursInternational: '/tours?internationalOnly=true',
  toursBeach: catalogTourLinks.domesticBeachFeatured,
  toursIntlHot: catalogTourLinks.internationalFeatured,
  toursFlash: catalogTourLinks.lastMinuteDeals,
  toursEsg: '/tours?domesticOnly=true&tourLine=esg',
  destDaNang: '/destinations/branch/da-nang',
  destHaLong: '/destinations/branch/vinh-ha-long',
  destPhuQuoc: '/destinations/branch/phu-quoc',
  destDaLat: '/destinations/branch/da-lat',
} as const
