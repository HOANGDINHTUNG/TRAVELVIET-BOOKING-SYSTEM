import type { DestinationDetail } from '../../database/interface/destination'
import type { DestinationDetailCopy } from '../../utils/destinationDetailCopy'
import type { DestinationDetailViewModel } from '../../utils/destinationDetailViewModel'
import { looksLikeHtml } from './destinationPublicDetailUtils'

type RichDescriptionProps = {
  detail: DestinationDetail
  viewModel: DestinationDetailViewModel
  copy: DestinationDetailCopy
}

export function RichDescription({ detail, viewModel, copy }: RichDescriptionProps) {
  const raw = detail.description || detail.shortDescription || ''
  const html = looksLikeHtml(raw)

  return (
    <section
      id="section-overview"
      className="scroll-mt-28 rounded-2xl border border-white/30 bg-white/60 p-5 shadow-lg shadow-slate-900/5 ring-1 ring-slate-900/5 backdrop-blur-md md:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-teal-700/90">
        {copy.overviewKicker}
      </p>
      <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
        {copy.overviewTitle(detail.name)}
      </h2>

      <div className="prose-custom mt-6 max-w-none text-slate-800">
        {html ? (
          <div
            className="space-y-4 text-base leading-relaxed [&_a]:text-teal-700 [&_blockquote]:border-l-4 [&_blockquote]:border-teal-200 [&_blockquote]:pl-4 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-xl [&_img]:rounded-xl [&_p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: raw }}
          />
        ) : (
          <div className="space-y-4 text-base leading-relaxed md:text-lg">
            {viewModel.paragraphs.map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
