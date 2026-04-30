import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarDays, MapPin, Search, Star, Tag } from "lucide-react";
import { FiArrowUpRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import type { Tour } from "../../database/travelData";
import "./PackagesSection.css";

type PackagesSectionProps = {
  tours: Tour[];
  onSelectTour: (tourTitle: string) => void;
};

type TourCardVariant = "featured" | "regular";

const ALL_CATEGORY = "Tat ca";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

export function PackagesSection({ tours, onSelectTour }: PackagesSectionProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);

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

  const categoryOptions = useMemo(() => {
    const categories = tours
      .map((tour) => tour.category)
      .filter((category): category is string => Boolean(category));

    return [ALL_CATEGORY, ...Array.from(new Set(categories))];
  }, [tours]);

  const normalizedSearchQuery = normalizeText(searchQuery);
  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const categoryMatch =
        selectedCategory === ALL_CATEGORY || tour.category === selectedCategory;
      const searchableText = normalizeText(
        [
          tour.title,
          tour.location,
          tour.category,
          tour.days,
          tour.description,
          ...tour.highlights,
        ]
          .filter(Boolean)
          .join(" "),
      );

      return (
        categoryMatch &&
        (!normalizedSearchQuery ||
          searchableText.includes(normalizedSearchQuery))
      );
    });
  }, [normalizedSearchQuery, selectedCategory, tours]);

  const featuredTours = filteredTours.slice(0, 2);
  const remainingTours = filteredTours.slice(2);
  const resultLabel = `${filteredTours.length}/${tours.length} tour`;

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(ALL_CATEGORY);
  };

  const renderTourCard = (tour: Tour, variant: TourCardVariant) => {
    const title = translateTourField(tour, "title", tour.title);
    const description = translateTourField(
      tour,
      "description",
      tour.description || tour.highlights.join(", ") || tour.category,
    );
    const days = translateTourField(tour, "days", tour.days);
    const location = translateTourField(tour, "location", tour.location);
    const isFeatured = variant === "featured";

    return (
      <article
        className={`tour-card${isFeatured ? " tour-card-featured" : ""}`}
        key={tour.id}
      >
        <div className="tour-image">
          {tour.image ? (
            <img data-motion-image src={tour.image} alt={title} />
          ) : (
            <div className="tour-image-empty">No image</div>
          )}
          <span className="tour-category-badge">{tour.category}</span>
          {tour.rating ? (
            <span className="tour-rating-badge">
              <Star size={14} fill="currentColor" strokeWidth={1.6} />
              {tour.rating.toFixed(1)}
              {tour.reviewCount ? ` (${tour.reviewCount})` : ""}
            </span>
          ) : null}
        </div>

        <div className="tour-body">
          {isFeatured ? (
            <div className="tour-card-heading">
              <h3>{title}</h3>
              <strong>{formatPrice(tour.price)}</strong>
            </div>
          ) : (
            <h3>{title}</h3>
          )}

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

          {isFeatured && tour.highlights.length > 0 ? (
            <div className="tour-highlight-chips">
              {tour.highlights.slice(0, 3).map((highlight) => (
                <span key={highlight}>{highlight}</span>
              ))}
            </div>
          ) : null}

          <div className="tour-footer">
            {isFeatured ? (
              <button
                className="tour-secondary-button"
                type="button"
                onClick={() => onSelectTour(title)}
              >
                Tu van nhanh
              </button>
            ) : (
              <div>
                <strong>{formatPrice(tour.price)}</strong>
                <span>{t("packages.perPerson")}</span>
              </div>
            )}
            <button
              className="tour-primary-button"
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

      <div className="tour-discovery-toolbar" aria-label="Tour filters">
        <label className="tour-search-box">
          <Search size={18} strokeWidth={2} />
          <span>Tim tour</span>
          <input
            type="search"
            value={searchQuery}
            placeholder="Ten tour, dia diem, trai nghiem..."
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
        <div className="tour-filter-row" aria-label="Tour categories">
          {categoryOptions.map((category) => (
            <button
              className={category === selectedCategory ? "is-active" : ""}
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <strong className="tour-result-count">{resultLabel}</strong>
      </div>

      {filteredTours.length === 0 ? (
        <div className="package-empty-state">
          <Tag size={22} strokeWidth={1.8} />
          <div>
            <h3>Khong co tour phu hop</h3>
            <p>Thu doi tu khoa hoac xoa bo loc de xem lai tat ca tour.</p>
          </div>
          <button type="button" onClick={resetFilters}>
            Xoa bo loc
          </button>
        </div>
      ) : (
        <>
          <div className="tour-featured-rail">
            {featuredTours.map((tour) => renderTourCard(tour, "featured"))}
          </div>

          {remainingTours.length > 0 && (
            <div className="tour-grid">
              {remainingTours.map((tour) => renderTourCard(tour, "regular"))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
