import { Footer } from '@/components/Footer/Footer'
import { FlightAboutContent } from '../components/FlightAboutContent'
import { FlightFeaturedDestinations } from '../components/FlightFeaturedDestinations'
import { FlightSearchHero } from '../components/FlightSearchHero'
import './FlightsPage.css'

/**
 * Trang đặt vé máy bay (UI only) — `/flights`
 * BE/DB sẽ gắn sau; hiện toast khi bấm Tìm kiếm.
 */
export default function FlightsPage() {
  return (
    <div className="flights-page">
      <FlightSearchHero />
      <FlightFeaturedDestinations />
      <FlightAboutContent />
      <Footer />
    </div>
  )
}
