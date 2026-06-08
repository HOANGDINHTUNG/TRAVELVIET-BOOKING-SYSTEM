import { useTranslation } from "react-i18next";
import { OptimizedImage } from "@/components/common/media/OptimizedImage";
const HOTEL_DESTINATION_IMAGES = [
  "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1517154421773-e571b7295963?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1528127269322-539301976bce?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1583417319070-4a5221be547f?auto=format&fit=crop&w=640&q=80",
];
import "./HotelFeaturedDestinations.css";

export function HotelFeaturedDestinations() {
  const { t } = useTranslation("translation", { keyPrefix: "hotelsPage" });
  const destinations = t("featured.destinations", {
    returnObjects: true,
  }) as Array<{ name: string; alt: string }>;

  return (
    <section
      className="hotel-dest-featured"
      aria-labelledby="hotel-dest-featured-title"
    >
      <div className="hotel-dest-featured__inner">
        <h2
          id="hotel-dest-featured-title"
          className="hotel-dest-featured__title"
        >
          {t("featured.destinationsTitle")}
        </h2>
        <ul
          className="hotel-dest-featured__grid"
          aria-label={t("featured.destinationsAria")}
        >
          {destinations.map((dest, index) => (
            <li key={dest.name} className="hotel-dest-featured__item">
              <div className="hotel-dest-featured__pill">
                <OptimizedImage
                  src={
                    HOTEL_DESTINATION_IMAGES[index] ??
                    HOTEL_DESTINATION_IMAGES[0]
                  }
                  alt={dest.alt}
                  width={200}
                  height={400}
                  cloudinaryWidth={400}
                  priority={index === 0}
                  className="hotel-dest-featured__img"
                />
                <span className="hotel-dest-featured__caption">
                  {dest.name}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
