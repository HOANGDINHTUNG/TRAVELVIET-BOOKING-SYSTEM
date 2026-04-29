import { ImageIcon } from "lucide-react";
import type { TourDetailCopy } from "../utils/tourDetailCopy";
import { isVideoMedia } from "../utils/tourDetailFormatters";
import type { TourDetailViewModel } from "../utils/tourDetailViewModel";

type TourMediaSectionProps = {
  viewModel: TourDetailViewModel;
  copy: TourDetailCopy;
};

export function TourMediaSection({ viewModel, copy }: TourMediaSectionProps) {
  return (
    <section className="tour-section tour-media-section">
      <div className="tour-section-heading">
        <p className="tour-section-kicker">{copy.mediaKicker}</p>
        <h2>{copy.mediaTitle}</h2>
      </div>

      {viewModel.media.length === 0 ? (
        <div className="tour-empty-state">{copy.noMedia}</div>
      ) : (
        <div className="tour-media-grid">
          {viewModel.media.map((media, index) => (
            <figure
              key={`${media.mediaUrl}-${index}`}
              className={index === 0 ? "tour-media-item featured" : "tour-media-item"}
            >
              {isVideoMedia(media) ? (
                <video src={media.url} controls preload="metadata" />
              ) : media.url ? (
                <img src={media.url} alt={media.altText || copy.mediaTitle} />
              ) : (
                <span className="tour-media-fallback">
                  <ImageIcon size={24} />
                </span>
              )}
              {media.altText && <figcaption>{media.altText}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
