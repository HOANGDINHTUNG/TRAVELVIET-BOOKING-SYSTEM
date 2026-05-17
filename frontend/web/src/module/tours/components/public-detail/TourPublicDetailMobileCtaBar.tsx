import { useTranslation } from 'react-i18next'
import { CalendarRange, ShoppingBag } from 'lucide-react'
import {
  TOUR_BOOKING_ANCHOR_ID,
  TOUR_SCHEDULES_ANCHOR_ID,
} from './tourPublicDetailConstants'

type TourPublicDetailMobileCtaBarProps = {
  hasSelectedSchedule?: boolean
}

function scrollToAnchor(anchorId: string) {
  document.getElementById(anchorId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

export function TourPublicDetailMobileCtaBar({
  hasSelectedSchedule = false,
}: TourPublicDetailMobileCtaBarProps) {
  const { t } = useTranslation('tours')

  const targetId = hasSelectedSchedule
    ? TOUR_BOOKING_ANCHOR_ID
    : TOUR_SCHEDULES_ANCHOR_ID
  const label = hasSelectedSchedule
    ? String(t('detail.cta.bookNow'))
    : String(t('detail.cta.pickSchedule'))

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/25 bg-white/55 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur-lg lg:hidden">
      <button
        type="button"
        onClick={() => scrollToAnchor(targetId)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:from-teal-500 hover:to-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:scale-[0.99]"
      >
        {hasSelectedSchedule ? (
          <ShoppingBag className="h-4 w-4" aria-hidden />
        ) : (
          <CalendarRange className="h-4 w-4" aria-hidden />
        )}
        {label}
      </button>
    </div>
  )
}
