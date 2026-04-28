import { Camera, Video } from 'lucide-react'
import type { DestinationDetail } from '../database/interface/destination'
import type { DestinationDetailCopy } from '../utils/destinationDetailCopy'
import type { DestinationDetailViewModel } from '../utils/destinationDetailViewModel'
import { DestinationEmptyLine } from './DestinationEmptyLine'
import { DestinationSectionTitle } from './DestinationSectionTitle'

type DestinationMediaSectionProps = {
  copy: DestinationDetailCopy
  detail: DestinationDetail
  viewModel: DestinationDetailViewModel
}

export function DestinationMediaSection({
  copy,
  detail,
  viewModel,
}: DestinationMediaSectionProps) {
  return (
    <section className="destination-detail-section">
      <DestinationSectionTitle
        kicker={copy.galleryKicker}
        title={copy.galleryTitle}
      />

      {viewModel.activeMedia.length > 0 ? (
        <div className="destination-detail-media-grid">
          {viewModel.imageMedia.map((media) => (
            <figure key={media.id}>
              <img src={media.url} alt={media.altText || detail.name} />
              <figcaption>
                <Camera aria-hidden="true" />
                {media.altText || media.mediaType || copy.media}
              </figcaption>
            </figure>
          ))}
          {viewModel.videoMedia.map((media) => (
            <a
              className="destination-detail-video-card"
              href={media.url}
              key={media.id}
              rel="noreferrer"
              target="_blank"
            >
              <Video aria-hidden="true" />
              <span>{media.altText || copy.videoLabel}</span>
            </a>
          ))}
        </div>
      ) : (
        <DestinationEmptyLine label={copy.noMedia} />
      )}
    </section>
  )
}
