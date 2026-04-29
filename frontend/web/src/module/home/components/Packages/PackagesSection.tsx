import { useTranslation } from "react-i18next";
import { CalendarDays, MapPin } from "lucide-react";
import { FiArrowUpRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import type { Tour } from "../../database/travelData";
import "./PackagesSection.css";

type PackagesSectionProps = {
  tours: Tour[];
  onSelectTour: (tourTitle: string) => void;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);

export function PackagesSection({ tours }: PackagesSectionProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const translateTourField = (
    tour: Tour,
    field: "title" | "description" | "days" | "location",
    fallback: string,
  ) => {
    if (!tour.translationKey) {
      return fallback;
    }

    const key = `data.tours.${tour.translationKey}.${field}`;
    return i18n.exists(key) ? t(key) : fallback;
  };

  return (
    <section className="section-shell package-section" id="packages">
      <div className="section-heading split">
        <div>
          <p className="eyebrow">{t("packages.eyebrow")}</p>
          <h2>{t("packages.title")}</h2>
        </div>
        <p>{t("packages.copy")}</p>
      </div>

      <div className="tour-grid">
        {tours.map((tour) => {
          const title = translateTourField(tour, "title", tour.title);
          const description = translateTourField(
            tour,
            "description",
            tour.description || tour.highlights.join(", ") || tour.category,
          );
          const days = translateTourField(tour, "days", tour.days);
          const location = translateTourField(tour, "location", tour.location);

          return (
            <article className="tour-card" key={tour.id}>
              <div className="tour-image">
                {tour.image ? (
                  <img data-motion-image src={tour.image} alt={title} />
                ) : (
                  <div className="tour-image-empty">No image</div>
                )}
              </div>
              <div className="tour-body">
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="tour-info-list">
                  <span>
                    <CalendarDays size={15} strokeWidth={1.8} />
                    {days}
                  </span>
                  <span>
                    <MapPin size={15} strokeWidth={1.8} />
                    {location}
                  </span>
                </div>
                <div className="tour-footer">
                  <div>
                    <strong>{formatPrice(tour.price)}</strong>
                    <span>{t("packages.perPerson")}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/tours/${tour.id}`)}
                  >
                    {t("packages.choose")}
                    <FiArrowUpRight aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
