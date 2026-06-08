import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BedDouble,
  Car,
  ChevronDown,
  ChevronUp,
  Coffee,
  GlassWater,
  MapPin,
  RotateCcw,
  Search,
  Settings2,
  SlidersHorizontal,
  Star,
  Wifi,
} from "lucide-react";

import { Footer } from "@/components/Footer/Footer";
import { OptimizedImage } from "@/components/common/media/OptimizedImage";
const HOTEL_RESULTS_BANNER_POOL =
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=1200";
const HOTEL_RESULTS_SIDEBAR_IMAGE =
  "https://images.unsplash.com/photo-1542314831-c6a4d14d8373?auto=format&fit=crop&q=80&w=400";
const HOTEL_PROPERTY_TYPES = ["hotel", "resort", "apartment", "villa"];
const MOCK_BUDGET_RANGE = { min: 0, max: 5000000 };

function destinationDisplayName(code: string): string {
  const m: Record<string, string> = {
    dalat: "Đà Lạt",
    nhatrang: "Nha Trang",
    phuquoc: "Phú Quốc",
    danang: "Đà Nẵng",
  };
  return m[code.toLowerCase()] || code;
}
import {
  useHotelResultsState,
  type HotelSortKey,
} from "../hooks/useHotelResultsState";
import { formatHotelPrice } from "../utils/formatHotelPrice";
import {
  buildHotelSearchQuery,
  parseHotelSearchParams,
  totalGuests,
} from "../utils/hotelSearchParams";
import { type HotelResponse } from "@/api/server/Hotel.api";
import "./HotelSearchResultsPage.css";

function formatStayDate(iso: string, locale: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

function StarRow({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <span className="hr-stars" aria-label={`${count}/${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={12}
          strokeWidth={0}
          fill={i < count ? "#f5b301" : "#cbd5e1"}
          aria-hidden
        />
      ))}
    </span>
  );
}

type HotelResultCardProps = {
  hotel: HotelResponse;
  locale: string;
  onViewDetail: () => void;
};

function SkeletonBlock({
  className,
  as: Tag = "span",
}: {
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  return (
    <Tag className={`hr-skeleton ${className ?? ""}`.trim()} aria-hidden />
  );
}

function HotelResultCardSkeleton() {
  return (
    <article className="hr-card hr-card--skeleton" aria-hidden>
      <div className="hr-card__media">
        <SkeletonBlock className="hr-card__img" as="div" />
      </div>
      <div className="hr-card__body">
        <div className="hr-card__head">
          <SkeletonBlock className="hr-skeleton--title" as="div" />
          <SkeletonBlock className="hr-skeleton--chip" as="div" />
        </div>
        <SkeletonBlock className="hr-skeleton--line" as="div" />
        <SkeletonBlock
          className="hr-skeleton--line hr-skeleton--line-short"
          as="div"
        />
        <SkeletonBlock className="hr-skeleton--promo" as="div" />
        <div className="hr-card__footer">
          <div className="hr-card__price-block">
            <SkeletonBlock
              className="hr-skeleton--line hr-skeleton--line-xs"
              as="div"
            />
            <SkeletonBlock className="hr-skeleton--price" as="div" />
          </div>
          <SkeletonBlock className="hr-skeleton--button" as="div" />
        </div>
      </div>
    </article>
  );
}

function HotelResultCard({
  hotel,
  locale,
  onViewDetail,
}: HotelResultCardProps) {
  const { t } = useTranslation("translation", { keyPrefix: "hotelsPage" });
  // Backend doesn't have ratingTextKey, returning Vietnamese strings directly
  const getRatingText = (score: number) => {
    if (score >= 9) return "Tuyệt vời";
    if (score >= 8) return "Rất tốt";
    if (score >= 7) return "Tốt";
    return "Trung bình";
  };

  const ratingLabel = getRatingText(hotel.reviewScore);
  // Placeholders for missing backend fields
  const mockImage = `https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=720`;
  const mockAmenities = [
    "results.amenityWifi",
    "results.amenityParking",
    "results.amenityBreakfast",
  ];

  const amenityItems = buildAmenityItems(mockAmenities, t);

  return (
    <article className="hr-card">
      <div className="hr-card__media">
        <OptimizedImage
          src={mockImage}
          alt={hotel.name}
          width={360}
          height={220}
          cloudinaryWidth={720}
          className="hr-card__img"
        />
        <div className="hr-card__stars-overlay">
          <StarRow count={Math.floor(hotel.starRating)} />
        </div>
      </div>

      <div className="hr-card__body">
        <div className="hr-card__head">
          <h2 className="hr-card__name">{hotel.name}</h2>
          <div className="hr-card__rating" title={ratingLabel}>
            <span className="hr-card__rating-score">{hotel.reviewScore}</span>
            <span className="hr-card__rating-text">{ratingLabel}</span>
          </div>
        </div>

        <p className="hr-card__address">
          <MapPin size={14} strokeWidth={2.2} aria-hidden />
          {hotel.address}, {hotel.district}, {hotel.province}
        </p>

        <div
          className="hr-card__amenities-line"
          aria-label={t("results.amenitiesAria")}
        >
          {amenityItems.map((item, idx) => (
            <span key={item.key} className="hr-card__amenity">
              <item.Icon size={14} aria-hidden />
              <span>{item.label}</span>
              {idx < amenityItems.length - 1 ? (
                <span className="hr-card__amenity-sep" aria-hidden />
              ) : null}
            </span>
          ))}
        </div>

        <div className="hr-card__footer">
          <div className="hr-card__price-block">
            <p className="hr-card__price-old">{t("results.priceFrom")}</p>
            <p className="hr-card__price">
              <strong>
                {formatHotelPrice(hotel.minRoomPrice, locale)}
                {t("results.perNight")}
              </strong>
              <span className="hr-card__price-note-inline">
                {t("results.taxNote")}
              </span>
            </p>
          </div>
          <button type="button" className="hr-card__cta" onClick={onViewDetail}>
            {t("results.viewDetail")}
          </button>
        </div>
      </div>
    </article>
  );
}

function buildAmenityItems(amenities: string[], t: (key: string) => string) {
  const iconByKey: Record<
    string,
    React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>
  > = {
    "results.amenityParking": Car,
    "results.amenityWifi": Wifi,
    "results.amenityBreakfast": Coffee,
    "results.amenityWelcomeDrink": GlassWater,
  };

  return amenities
    .filter((key) => iconByKey[key])
    .slice(0, 3)
    .map((key) => ({ key, label: t(key), Icon: iconByKey[key]! }));
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="hr-filter-section">
      <button
        type="button"
        className="hr-filter-section__head"
        onClick={onToggle}
      >
        <Settings2 size={14} aria-hidden className="hr-filter-section__icon" />
        <span>{title}</span>
        {open ? (
          <ChevronUp size={16} aria-hidden />
        ) : (
          <ChevronDown size={16} aria-hidden />
        )}
      </button>
      {open ? <div className="hr-filter-section__body">{children}</div> : null}
    </section>
  );
}

export default function HotelSearchResultsPage() {
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "hotelsPage",
  });
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const locale = i18n.language?.startsWith("en") ? "en" : "vi";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useMemo(
    () => parseHotelSearchParams(searchParams),
    [searchParams],
  );

  const {
    loading: apiLoading,
    loadingMore,
    hasMore,
    loadMore,
    sortKey,
    setSortKey,
    sorted,
    filteredCount,
    filters,
    resetFilters,
    togglePropertyType,
    toggleStar,
    setBudget,
  } = useHotelResultsState({
    destinationId: Number(params.destination) || undefined,
    checkinDate: params.checkIn,
    checkoutDate: params.checkOut,
    rooms: params.rooms,
    adults: params.adults,
    children: params.children,
  });

  const [openSections, setOpenSections] = useState({
    propertyType: true,
    stars: true,
    budget: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasMore || loading) return undefined;
    const target = loadMoreRef.current;
    if (!target) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "320px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  useEffect(() => {
    setLoading(apiLoading);
  }, [apiLoading]);

  const destLabel = destinationDisplayName(params.destination);
  const guestTotal = totalGuests(params);
  const dateLine = `${formatStayDate(params.checkIn, locale)} > ${formatStayDate(params.checkOut, locale)}`;

  const onViewDetail = (
    hotel: import("@/api/server/Hotel.api").HotelResponse,
  ) => {
    navigate(`/hotels/${hotel.id}`);
  };

  const sortOptions: { value: HotelSortKey; label: string }[] = [
    { value: "relevance", label: t("results.sortRelevance") },
    { value: "price-asc", label: t("results.sortPriceAsc") },
    { value: "price-desc", label: t("results.sortPriceDesc") },
    { value: "rating-desc", label: t("results.sortRating") },
  ];

  return (
    <div className={`hotel-results-page${loading ? " is-loading" : ""}`}>
      <div className="hotel-results-page__inner">
        <nav className="hr-breadcrumb" aria-label={t("results.breadcrumbAria")}>
          {loading ? (
            <SkeletonBlock className="hr-skeleton--breadcrumb" as="div" />
          ) : (
            <>
              <Link to="/">{t("results.breadcrumbHome")}</Link>
              <span aria-hidden>/</span>
              <Link to="/hotels">{t("results.breadcrumbHotels")}</Link>
              <span aria-hidden>/</span>
              <span className="hr-breadcrumb__current">{destLabel}</span>
            </>
          )}
        </nav>

        <div className="hr-layout">
          <aside className="hr-sidebar">
            <div className="hr-sidebar__dest">
              {loading ? (
                <>
                  <SkeletonBlock className="hr-sidebar__dest-img" as="div" />
                  <SkeletonBlock className="hr-skeleton--dest-label" as="div" />
                </>
              ) : (
                <>
                  <OptimizedImage
                    src={HOTEL_RESULTS_SIDEBAR_IMAGE}
                    alt=""
                    width={260}
                    height={160}
                    cloudinaryWidth={520}
                    className="hr-sidebar__dest-img"
                  />
                  <span className="hr-sidebar__dest-label">
                    {destLabel.toUpperCase()}
                  </span>
                </>
              )}
            </div>

            <div
              className="hr-sidebar__filters"
              aria-label={t("results.filtersAria")}
            >
              <header className="hr-sidebar__head">
                {loading ? (
                  <>
                    <SkeletonBlock className="hr-skeleton--title" as="div" />
                    <SkeletonBlock className="hr-skeleton--chip" as="div" />
                  </>
                ) : (
                  <>
                    <span className="hr-sidebar__title">
                      <SlidersHorizontal size={16} aria-hidden />
                      {t("results.filtersTitle")}
                    </span>
                    <button
                      type="button"
                      className="hr-sidebar__reset"
                      onClick={resetFilters}
                    >
                      <RotateCcw size={14} aria-hidden />
                      {t("results.reset")}
                    </button>
                  </>
                )}
              </header>

              {loading ? (
                <>
                  {Array.from({ length: 3 }, (_, idx) => (
                    <section className="hr-filter-section" key={idx}>
                      <div className="hr-filter-section__head">
                        <SkeletonBlock
                          className="hr-skeleton--line hr-skeleton--line-mid"
                          as="div"
                        />
                        <SkeletonBlock className="hr-skeleton--chip" as="div" />
                      </div>
                      <div className="hr-filter-section__body">
                        <div className="hr-check-list">
                          <SkeletonBlock
                            className="hr-skeleton--line"
                            as="div"
                          />
                          <SkeletonBlock
                            className="hr-skeleton--line hr-skeleton--line-short"
                            as="div"
                          />
                          <SkeletonBlock
                            className="hr-skeleton--line hr-skeleton--line-xs"
                            as="div"
                          />
                        </div>
                      </div>
                    </section>
                  ))}
                </>
              ) : (
                <>
                  <FilterSection
                    title={t("results.propertyTypeTitle")}
                    open={openSections.propertyType}
                    onToggle={() => toggleSection("propertyType")}
                  >
                    <ul className="hr-check-list">
                      {HOTEL_PROPERTY_TYPES.map((typeId) => (
                        <li key={typeId}>
                          <label className="hr-check">
                            <input
                              type="checkbox"
                              checked={filters.propertyTypes.has(typeId)}
                              onChange={() => togglePropertyType(typeId)}
                            />
                            <span>{t(`results.propertyType.${typeId}`)}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </FilterSection>

                  <FilterSection
                    title={t("results.starsTitle")}
                    open={openSections.stars}
                    onToggle={() => toggleSection("stars")}
                  >
                    <ul className="hr-check-list">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <li key={star}>
                          <label className="hr-check hr-check--stars">
                            <input
                              type="checkbox"
                              checked={filters.stars.has(star)}
                              onChange={() => toggleStar(star)}
                            />
                            <StarRow count={star} />
                          </label>
                        </li>
                      ))}
                    </ul>
                  </FilterSection>

                  <FilterSection
                    title={t("results.budgetTitle")}
                    open={openSections.budget}
                    onToggle={() => toggleSection("budget")}
                  >
                    <div className="hr-budget">
                      <input
                        type="range"
                        className="hr-budget__range"
                        min={MOCK_BUDGET_RANGE.min}
                        max={MOCK_BUDGET_RANGE.max}
                        value={filters.budgetMax}
                        onChange={(e) =>
                          setBudget(filters.budgetMin, Number(e.target.value))
                        }
                        aria-label={t("results.budgetTitle")}
                      />
                      <div className="hr-budget__labels">
                        <span>
                          {formatHotelPrice(filters.budgetMin, locale)}
                        </span>
                        <span>
                          {formatHotelPrice(filters.budgetMax, locale)}
                        </span>
                      </div>
                    </div>
                  </FilterSection>
                </>
              )}
            </div>
          </aside>

          <main className="hr-main">
            <div className="hr-summary">
              {loading ? (
                <>
                  <SkeletonBlock className="hr-summary__icon" as="div" />
                  <div className="hr-summary__text">
                    <SkeletonBlock className="hr-skeleton--title" as="div" />
                    <SkeletonBlock
                      className="hr-skeleton--line hr-skeleton--line-mid"
                      as="div"
                    />
                  </div>
                  <SkeletonBlock className="hr-skeleton--button" as="div" />
                  <SkeletonBlock className="hr-summary__deco" as="div" />
                </>
              ) : (
                <>
                  <div className="hr-summary__icon" aria-hidden>
                    <BedDouble size={22} strokeWidth={2.2} />
                  </div>
                  <div className="hr-summary__text">
                    <p className="hr-summary__dest">{destLabel}</p>
                    <p className="hr-summary__meta">
                      {dateLine} | {guestTotal} {t("results.guests")} |{" "}
                      {params.rooms} {t("results.roomsUnit")}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="hr-summary__change"
                    onClick={() =>
                      navigate(`/hotels?${buildHotelSearchQuery(params)}`)
                    }
                  >
                    <Search size={16} aria-hidden />
                    {t("results.changeSearch")}
                  </button>
                  <img
                    className="hr-summary__deco"
                    src={HOTEL_RESULTS_BANNER_POOL}
                    alt=""
                    width={280}
                    height={100}
                    loading="lazy"
                  />
                </>
              )}
            </div>

            <div className="hr-toolbar">
              {loading ? (
                <>
                  <SkeletonBlock
                    className="hr-skeleton--line hr-skeleton--line-mid"
                    as="div"
                  />
                  <SkeletonBlock className="hr-skeleton--button" as="div" />
                </>
              ) : (
                <>
                  <p className="hr-toolbar__count">
                    {t("results.allHotels")}{" "}
                    <span className="hr-toolbar__count-num">
                      {t("results.resultsCount", { count: filteredCount })}
                    </span>
                  </p>
                  <div className="hr-toolbar__sort">
                    <label htmlFor="hr-sort">{t("results.sortBy")}</label>
                    <div className="hr-toolbar__select-wrap">
                      <select
                        id="hr-sort"
                        value={sortKey}
                        onChange={(e) =>
                          setSortKey(e.target.value as HotelSortKey)
                        }
                      >
                        {sortOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} aria-hidden />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="hr-list">
              {loading ? (
                Array.from({ length: 6 }, (_, idx) => (
                  <HotelResultCardSkeleton key={idx} />
                ))
              ) : sorted.length === 0 ? (
                <p className="hr-empty">{t("results.noResults")}</p>
              ) : (
                sorted.map((hotel, idx) => (
                  <HotelResultCard
                    key={`${hotel.id}-${idx}`}
                    hotel={hotel}
                    locale={locale}
                    onViewDetail={() => onViewDetail(hotel)}
                  />
                ))
              )}

              {!loading && hasMore && (
                <div ref={loadMoreRef} style={{ height: "40px" }} aria-hidden />
              )}
              {loadingMore && (
                <div className="hr-list">
                  <HotelResultCardSkeleton />
                  <HotelResultCardSkeleton />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );

  function toggleSection(key: keyof typeof openSections) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }
}
