import { Footer } from '@/components/Footer/Footer'
import { HotelAboutContent } from '../components/HotelAboutContent'
import { HotelFeaturedDestinations } from '../components/HotelFeaturedDestinations'
import { HotelFeaturedSections } from '../components/HotelFeaturedSections'
import { HotelSearchHero } from '../components/HotelSearchHero'
import './HotelsPage.css'

/**
 * Trang đặt khách sạn (UI only) — `/hotels`
 * BE/DB sẽ gắn sau; hiện toast khi bấm Tìm kiếm / Xem phòng.
 */
export default function HotelsPage() {
  return (
    <div className="hotels-page">
      <HotelSearchHero />
      <HotelFeaturedSections />
      <HotelFeaturedDestinations />
      <HotelAboutContent />
      <Footer />
    </div>
  )
}
