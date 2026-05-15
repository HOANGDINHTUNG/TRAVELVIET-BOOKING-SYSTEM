import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'

const MOCK = [
  { id: 101, title: 'Hạ Long · 2N1Đ', priceLabel: '4.990.000đ', slug: 'mock-ha-long-101' },
  { id: 102, title: 'Sapa trekking', priceLabel: '3.290.000đ', slug: 'mock-sapa-102' },
  { id: 103, title: 'Phú Quốc biển xanh', priceLabel: '5.590.000đ', slug: 'mock-phu-quoc-103' },
]

/**
 * 3 thẻ demo — thay bằng API related khi backend có.
 */
export function RelatedToursMock() {
  const { t } = useTranslation('tours')

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white/90 via-slate-50/40 to-teal-50/20 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-md md:p-7">
      <h2 className="font-serif text-xl font-bold text-slate-900 md:text-2xl">
        {String(t('detail.relatedTitle'))}
      </h2>
      <p className="mt-1 text-xs text-slate-500">{String(t('detail.relatedMockLead'))}</p>
      <ul className="mt-4 grid gap-4 sm:grid-cols-3">
        {MOCK.map((item) => (
          <li key={item.id}>
            <Link
              to={`/tour/${item.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/50 bg-white/80 shadow-md transition hover:-translate-y-0.5 hover:border-teal-300/70 hover:shadow-xl"
            >
              <div className="aspect-[16/10] bg-gradient-to-br from-teal-200/80 via-cyan-100/70 to-slate-100 transition group-hover:from-teal-300/90 group-hover:via-cyan-100/80" />
              <div className="flex flex-1 flex-col p-3">
                <p className="text-sm font-semibold text-slate-900 group-hover:text-teal-800">
                  {item.title}
                </p>
                <p className="mt-2 text-xs text-slate-500">{item.priceLabel}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold text-teal-700">
                  {String(t('detail.relatedCta'))}
                  <ArrowRight className="h-3 w-3" aria-hidden />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
