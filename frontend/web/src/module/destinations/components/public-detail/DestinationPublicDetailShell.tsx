import { useMemo } from 'react'
import { DestinationEngagementSection } from '../DestinationEngagementSection'
import { DestinationWeatherSection } from '../DestinationWeatherSection'
import type { DestinationDetail } from '../../database/interface/destination'
import type {
  DestinationDetailCopy,
  DestinationDetailLocale,
} from '../../utils/destinationDetailCopy'
import type { DestinationDetailViewModel } from '../../utils/destinationDetailViewModel'
import type { DestinationDetailWeatherState } from '../../utils/destinationDetailWeather'
import '../../styles/DestinationDetailContent.css'
import '../../styles/DestinationDetailPage.css'
import '../../styles/DestinationDetailWeather.css'
import { buildToursKeywordHref } from './destinationPublicDetailUtils'
import { DestinationExperienceTabs } from './DestinationExperienceTabs'
import { DestinationHero } from './DestinationHero'
import { DestinationMediaGallery } from './DestinationMediaGallery'
import { DestinationMetaChips } from './DestinationMetaChips'
import { DestinationQuickStatsStrip } from './DestinationQuickStatsStrip'
import { DestinationTocSidebar, type TocItem } from './DestinationTocSidebar'
import { MapOrCoordinates } from './MapOrCoordinates'
import { ReadingProgress } from './ReadingProgress'
import { RichDescription } from './RichDescription'
import { StickyGlassCta } from './StickyGlassCta'

type DestinationPublicDetailShellProps = {
  detail: DestinationDetail
  viewModel: DestinationDetailViewModel
  copy: DestinationDetailCopy
  locale: DestinationDetailLocale
  weather: DestinationDetailWeatherState
}

export function DestinationPublicDetailShell({
  detail,
  viewModel,
  copy,
  locale,
  weather,
}: DestinationPublicDetailShellProps) {
  const toursHref = buildToursKeywordHref(detail.name)

  const hasExperience =
    (detail.foods?.length ?? 0) +
      (detail.specialties?.length ?? 0) +
      (detail.activities?.length ?? 0) +
      (detail.tips?.length ?? 0) +
      (detail.events?.length ?? 0) >
    0

  const tocItems: TocItem[] = useMemo(() => {
    const base: TocItem[] = [
      { id: 'section-overview', label: copy.detailTocOverview },
      { id: 'section-gallery', label: copy.detailTocGallery },
      { id: 'section-weather', label: copy.detailTocWeather },
    ]
    if (hasExperience) {
      base.push({ id: 'section-experience', label: copy.detailTocExperience })
    }
    base.push({ id: 'section-engagement', label: copy.detailTocCommunity })
    return base
  }, [
    copy.detailTocCommunity,
    copy.detailTocExperience,
    copy.detailTocGallery,
    copy.detailTocOverview,
    copy.detailTocWeather,
    hasExperience,
  ])

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-slate-100 pb-28 lg:pb-12">
      <ReadingProgress />

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="space-y-8 lg:col-span-7 xl:col-span-8">
            <DestinationHero copy={copy} detail={detail} viewModel={viewModel} />

            <div className="lg:hidden">
              <DestinationMetaChips detail={detail} viewModel={viewModel} />
            </div>

            <DestinationQuickStatsStrip stats={viewModel.stats} />

            <DestinationMediaGallery copy={copy} viewModel={viewModel} />

            <RichDescription copy={copy} detail={detail} viewModel={viewModel} />

            <div id="section-weather" className="scroll-mt-28">
              <DestinationWeatherSection copy={copy} detail={detail} weather={weather} />
            </div>

            {hasExperience ? (
              <DestinationExperienceTabs copy={copy} detail={detail} locale={locale} />
            ) : null}

            <div id="section-engagement" className="scroll-mt-28">
              <DestinationEngagementSection copy={copy} detail={detail} locale={locale} />
            </div>
          </div>

          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="hidden lg:block lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:space-y-6 lg:overflow-y-auto lg:pr-1">
              <DestinationMetaChips detail={detail} viewModel={viewModel} />
              <MapOrCoordinates copy={copy} detail={detail} />
              <DestinationTocSidebar copy={copy} items={tocItems} />
              <StickyGlassCta copy={copy} toursHref={toursHref} />
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
        <StickyGlassCta copy={copy} toursHref={toursHref} variant="bar" />
      </div>
    </main>
  )
}
