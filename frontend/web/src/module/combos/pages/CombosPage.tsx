import { Footer } from '@/components/Footer/Footer'
import { ComboAboutContent } from '../components/ComboAboutContent'
import { ComboHotDealsSection } from '../components/ComboHotDealsSection'
import { ComboSearchHero } from '../components/ComboSearchHero'
import './CombosPage.css'

/**
 * Trang combo du lịch — `/combos`
 * Tìm kiếm → `/combos/search` (mock). Xem thêm → `/combos/all`.
 */
export default function CombosPage() {
  return (
    <div className="combos-page">
      <ComboSearchHero />
      <ComboHotDealsSection />
      <ComboAboutContent />
      <Footer />
    </div>
  )
}
