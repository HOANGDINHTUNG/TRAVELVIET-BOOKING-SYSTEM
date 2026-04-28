import { CalendarDays, MapPin, Tag } from "lucide-react";
import type { BackendTour } from "../../home/database/interface/publicTravel";
import { buildAssetUrl } from "../../../utils/buildAssetUrl";

type TourDetailHeroProps = {
  tour: BackendTour;
};

function chooseHeroImage(tour: BackendTour) {
  const image = tour.media
    ?.filter((item) => item.isActive !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .find((item) => item.mediaType?.toLowerCase() !== "video" && item.mediaUrl);

  return buildAssetUrl(image?.mediaUrl);
}

function formatDuration(days?: number, nights?: number) {
  if (!days && !nights) return "Đang cập nhật";
  if (days && nights !== undefined) return `${days} ngày ${nights} đêm`;
  return `${days ?? nights} ngày`;
}

export function TourDetailHero({ tour }: TourDetailHeroProps) {
  const heroImage = chooseHeroImage(tour);
  const duration = formatDuration(tour.durationDays, tour.durationNights);

  return (
    <section className="tour-detail-hero">
      <div className="tour-detail-hero-media" aria-hidden="true">
        {heroImage ? (
          <img src={heroImage} alt="" />
        ) : (
          <span className="media-placeholder" />
        )}
      </div>

      <div className="tour-detail-hero-content">
        <div className="tour-detail-hero-copy">
          <p className="tour-detail-kicker">
            {tour.tripMode || "Signature Tour"}
          </p>
          <h1>{tour.name}</h1>
          <p className="tour-detail-short">{tour.shortDescription}</p>
        </div>

        <aside className="tour-detail-hero-stats">
          <div className="stat-item">
            <MapPin size={20} />
            <span>{tour.transportType || "Vận chuyển linh hoạt"}</span>
          </div>
          <div className="stat-item">
            <CalendarDays size={20} />
            <span>{duration}</span>
          </div>
          <div className="stat-item">
            <Tag size={20} />
            <span>
              {Number(tour.basePrice).toLocaleString()} {tour.currency || "VND"}
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}
