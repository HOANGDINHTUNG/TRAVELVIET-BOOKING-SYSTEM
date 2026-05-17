import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'motion/react'
import { ChevronLeft } from 'lucide-react'
import { handleApiError } from '../../../lib/handleApiError'
import {
  usePublicTourSchedulesQuery,
  useTourDetailQuery,
} from '../hooks/usePublicTours'
import { extractTourIdFromSlug } from '../utils/slug'
import {
  isScheduleStillBookable,
  pickDefaultBookableSchedule,
} from '../utils/tourScheduleSelection'
import { Footer } from '../../../components/Footer/Footer'
import TourScheduleSelector from '../components/TourScheduleSelector'
import BookingPanel from '../components/BookingPanel'
import { TourPublicDetailShell } from '../components/public-detail/TourPublicDetailShell'
import type { TourScheduleResponse } from '../types/publicTour'
import '../styles/TourPublicDetailPage.css'

/**
 * Trang chi tiết Tour PUBLIC — layout tối ưu đặt tour + hình ảnh.
 * URL: `/tour/:slug`
 */
function TourPublicDetailPage() {
  const { t } = useTranslation('tours')
  const prefersReducedMotion = useReducedMotion()
  const params = useParams<{ slug: string }>()
  const tourId = extractTourIdFromSlug(params.slug)

  const tourQuery = useTourDetailQuery(tourId)
  const schedulesQuery = usePublicTourSchedulesQuery(tourId)

  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null,
  )

  useEffect(() => {
    setSelectedScheduleId(null)
  }, [tourId])

  useEffect(() => {
    if (schedulesQuery.isPending) return
    const schedules = schedulesQuery.data ?? []
    if (schedules.length === 0) {
      setSelectedScheduleId(null)
      return
    }
    setSelectedScheduleId((prev) => {
      if (prev != null && isScheduleStillBookable(prev, schedules)) {
        return prev
      }
      return pickDefaultBookableSchedule(schedules)?.id ?? null
    })
  }, [schedulesQuery.data, schedulesQuery.isPending])

  const selectedSchedule = useMemo<TourScheduleResponse | null>(() => {
    if (selectedScheduleId == null) return null
    return (
      (schedulesQuery.data ?? []).find((s) => s.id === selectedScheduleId) ??
      null
    )
  }, [schedulesQuery.data, selectedScheduleId])

  if (tourId == null) {
    return <Navigate to="/tours" replace />
  }

  if (tourQuery.isPending) {
    return (
      <div className="tour-public-shell">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="tour-public-skeleton" />
        </div>
      </div>
    )
  }

  if (tourQuery.error || !tourQuery.data) {
    const errorMessage = tourQuery.error
      ? handleApiError(
          tourQuery.error,
          String(t('detail.errorMessage')),
        )
      : String(t('detail.notFound'))
    return (
      <div className="tour-public-shell">
        <div className="tour-public-error mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">{String(t('detail.errorTitle'))}</h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">{errorMessage}</p>
          <Link
            to="/tours"
            className="tour-public-back mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            {String(t('detail.backToList'))}
          </Link>
        </div>
      </div>
    )
  }

  const tour = tourQuery.data

  const scheduleSelector = (
    <TourScheduleSelector
      schedules={schedulesQuery.data}
      isLoading={schedulesQuery.isPending}
      selectedId={selectedScheduleId}
      onSelect={(s) => setSelectedScheduleId(s.id)}
    />
  )

  return (
    <>
      <div className="tour-public-shell">
        <motion.section
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.32 }}
        >
          <TourPublicDetailShell
            tour={tour}
            hasSelectedSchedule={selectedScheduleId != null}
            bookingPanel={
              <BookingPanel
                tourId={tour.id}
                schedule={selectedSchedule}
                comboPackages={tour.comboPackages ?? undefined}
              />
            }
            scheduleSelector={scheduleSelector}
          />
        </motion.section>
      </div>
      <Footer />
    </>
  )
}

export default TourPublicDetailPage
