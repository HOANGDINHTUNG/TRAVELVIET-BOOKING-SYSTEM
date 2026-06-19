import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  Eye,
  Grid3x3,
  Image,
  LayoutList,
  MapPin,
  Tag,
  Users,
} from "lucide-react";
import {
  catalogFiltersToServerParams,
  catalogHeroCopy,
  catalogDefaultFilters,
  buildTourCatalogUrl,
  parseTourCatalogFilters,
  type TourCatalogUiFilters,
} from "../utils/tourCatalogSearch";
import {
  buildTourLineFacets,
  priceBounds,
  resolveTourLineId,
  tourMatchesDeparture,
} from "../utils/tourCatalogFacets";
import {
  hasSustainabilityScores,
  resolveEsgScore,
  resolveLeiScore,
} from "../utils/tourSustainability";
import { tourApi } from "../../../api/server/Tour.api";
import { EmptyState } from "../../../components/common/ui/EmptyState";
import { PageLoader } from "../../../components/common/ux/PageLoader";
import { Footer } from "../../../components/Footer/Footer";
import {
  TourQuickViewDialog,
  type TourQuickViewPayload,
} from "../../../components/ui/TourCard/TourQuickViewDialog";
import type { Tour } from "../../home/database/interface/publicTravel";
import { ToursCatalogHero } from "../components/catalog/ToursCatalogHero";
import { ToursCatalogSkeleton } from "../components/catalog/ToursCatalogSkeleton";
import {
  ToursCatalogSearchBar,
  type ToursCatalogSearchBarHandle,
} from "../components/catalog/ToursCatalogSearchBar";
import { ToursCatalogStickySearch } from "../components/catalog/ToursCatalogStickySearch";
import { ToursCatalogSidebar } from "../components/catalog/ToursCatalogSidebar";
import { buildTourSlug } from "../utils/slug";
import { inclusionBadgeLabels } from "../utils/tourInclusionBadges";
import { GlassCard } from "../../../components/ui/GlassCard";
import {
  catalogDepartureCity,
  catalogRemainingSeats,
  formatCatalogDepartureDate,
  resolveCatalogListPrice,
} from "../utils/tourListingDisplay";
import "../styles/ToursCatalogCards.css";
import "../styles/ToursCatalogLayout.css";

import { formatCurrencyVnd } from "@/utils/currency";
import { OptimizedImage } from "../../../components/common/media/OptimizedImage";

const TOUR_PAGE_SIZE = 20;

function tourListingBadge(tour: Tour): {
  kind: "deal" | "standard" | "esg";
  label: string;
} {
  const lineId = resolveTourLineId(tour);
  if (lineId === "esg") return { kind: "esg", label: "ESG & LEI" };
  if (lineId === "cao_cap") return { kind: "standard", label: "Cao cấp" };
  if (lineId === "tieu_chuan") return { kind: "standard", label: "Tiêu chuẩn" };
  if (lineId === "tiet_kiem") return { kind: "deal", label: "Tiết kiệm" };
  return { kind: "deal", label: "Giá tốt" };
}

function ToursPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draftFilters, setDraftFilters] = useState<TourCatalogUiFilters>(() =>
    parseTourCatalogFilters(searchParams),
  );
  const [quickView, setQuickView] = useState<TourQuickViewPayload | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);
  const searchDockRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<ToursCatalogSearchBarHandle>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [searchDockInView, setSearchDockInView] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const stallNotifiedRef = useRef(false);
  const errorNotifiedRef = useRef(false);

  const appliedFilters = useMemo(
    () => parseTourCatalogFilters(searchParams),
    [searchParams],
  );
  const deferredAppliedFilters = useDeferredValue(appliedFilters);
  const [isNavigatingFilters, startFilterTransition] = useTransition();
  const isFilterStale = deferredAppliedFilters !== appliedFilters;

  useEffect(() => {
    const dock = searchDockRef.current;
    if (!dock) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setSearchDockInView(entry.isIntersecting),
      {
        threshold: 0,
        rootMargin: "-72px 0px 0px 0px",
      },
    );
    observer.observe(dock);
    return () => observer.disconnect();
  }, [loading, error]);

  const openSearchWithKeywordFocus = useCallback(() => {
    const focusKeyword = () => searchBarRef.current?.focusKeyword();

    if (searchDockInView) {
      focusKeyword();
      return;
    }

    searchDockRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    window.setTimeout(focusKeyword, 420);
  }, [searchDockInView]);

  useEffect(() => {
    if (!searchParams.toString()) {
      navigate("/tours?domesticOnly=true", { replace: true });
    }
  }, [navigate, searchParams]);

  useEffect(() => {
    setDraftFilters(appliedFilters);
  }, [appliedFilters]);

  const catalogSearchKey = searchParams.toString();

  useEffect(() => {
    let isActive = true;

    async function loadTours() {
      if (!catalogSearchKey) return;

      setLoading(true);
      setError(null);
      setLoadingMore(false);

      try {
        const serverFilter = catalogFiltersToServerParams(
          parseTourCatalogFilters(new URLSearchParams(catalogSearchKey)),
          { page: 0, size: TOUR_PAGE_SIZE },
        );
        const pageData = await tourApi.searchPublicToursPage(serverFilter);
        if (!isActive) return;
        setTours(pageData.items);
        setHasMore(!pageData.last);
        setNextPage(pageData.page + 1);
        setTotalResults(pageData.totalElements);
      } catch (loadError) {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Không thể tải danh sách tour.",
          );
        }
      } finally {
        if (isActive) setLoading(false);
      }
    }

    void loadTours();
    return () => {
      isActive = false;
    };
  }, [catalogSearchKey]);

  const loadMoreTours = useCallback(async () => {
    if (loading || loadingMore || !hasMore || !catalogSearchKey) return;
    setLoadingMore(true);
    try {
      const serverFilter = catalogFiltersToServerParams(
        parseTourCatalogFilters(new URLSearchParams(catalogSearchKey)),
        { page: nextPage, size: TOUR_PAGE_SIZE },
      );
      const pageData = await tourApi.searchPublicToursPage(serverFilter);
      setTours((prev) => [...prev, ...pageData.items]);
      setHasMore(!pageData.last);
      setNextPage(pageData.page + 1);
      setTotalResults(pageData.totalElements);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Không thể tải thêm danh sách tour.",
      );
    } finally {
      setLoadingMore(false);
    }
  }, [catalogSearchKey, hasMore, loading, loadingMore, nextPage]);

  useEffect(() => {
    if (!hasMore || loading) return undefined;
    const target = loadMoreRef.current;
    if (!target) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          void loadMoreTours();
        }
      },
      { rootMargin: "320px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadMoreTours, loading]);

  const translateTourField = useCallback(
    (tour: Tour, field: "title" | "days" | "location", fallback: string) => {
      if (!tour.translationKey) return fallback;
      const key = `data.tours.${tour.translationKey}.${field}`;
      return i18n.exists(key) ? t(key) : fallback;
    },
    [i18n, t],
  );

  const hero = useMemo(() => catalogHeroCopy(appliedFilters), [appliedFilters]);
  const displayTours = useMemo(() => {
    if (!deferredAppliedFilters.departure.trim()) return tours;
    return tours.filter((tour) =>
      tourMatchesDeparture(tour, deferredAppliedFilters.departure),
    );
  }, [deferredAppliedFilters.departure, tours]);
  const bounds = useMemo(() => priceBounds(displayTours), [displayTours]);
  const lineFacets = useMemo(
    () => buildTourLineFacets(displayTours),
    [displayTours],
  );

  const applyFilters = useCallback(
    (next: TourCatalogUiFilters) => {
      startFilterTransition(() => {
        navigate(buildTourCatalogUrl(next));
      });
    },
    [navigate],
  );

  const applySidebarFilters = useCallback(
    (patch: Partial<TourCatalogUiFilters>) => {
      const next = { ...draftFilters, ...patch };
      setDraftFilters(next);
      applyFilters(next);
    },
    [applyFilters, draftFilters],
  );

  const resetFilters = () => {
    applyFilters({
      ...catalogDefaultFilters,
      scope: appliedFilters.scope,
      sortBy: appliedFilters.sortBy,
      sortDir: appliedFilters.sortDir,
      view: appliedFilters.view,
    });
  };

  const openQuickView = (
    tour: Tour,
    title: string,
    days: string,
    location: string,
  ) => {
    const detailSlug = buildTourSlug(tour.title, tour.id);
    setQuickView({
      title,
      imageUrl: tour.image,
      location,
      duration: days,
      price: tour.price,
      programCode: `TV${String(tour.id).padStart(4, "0")}`,
      attractions: (tour.highlights ?? []).slice(0, 3).join(" · ") || "—",
      cuisine: "Ẩm thực địa phương",
      detailPath: `/tour/${detailSlug}`,
    });
    setQuickOpen(true);
  };

  const sortOptions = [
    { value: "createdAt:desc", label: "Mới nhất" },
    { value: "basePrice:asc", label: "Giá thấp → cao" },
    { value: "basePrice:desc", label: "Giá cao → thấp" },
    { value: "durationDays:asc", label: "Thời lượng ngắn" },
  ];

  const currentSort = `${appliedFilters.sortBy}:${appliedFilters.sortDir}`;
  const showFullPageSkeleton =
    loading || (Boolean(error) && tours.length === 0);

  useEffect(() => {
    if (!loading || tours.length > 0) {
      stallNotifiedRef.current = false;
      return undefined;
    }
    const timer = window.setTimeout(() => {
      if (stallNotifiedRef.current) return;
      stallNotifiedRef.current = true;
      toast.warning(
        "Không nhận được dữ liệu tour. Kiểm tra backend và thử lại.",
      );
    }, 4500);
    return () => window.clearTimeout(timer);
  }, [loading, tours.length]);

  useEffect(() => {
    if (!error || tours.length > 0) {
      errorNotifiedRef.current = false;
      return;
    }
    if (errorNotifiedRef.current) return;
    errorNotifiedRef.current = true;
    toast.error(error);
  }, [error, tours.length]);

  if (!catalogSearchKey) {
    return <PageLoader label="Đang mở danh sách tour..." />;
  }

  if (showFullPageSkeleton) {
    return (
      <>
        <ToursCatalogSkeleton view={appliedFilters.view} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <main
        className={`tours-vt-page tours-catalog-page${searchDockInView ? "" : " has-sticky-search-btn"}`}
      >
        <ToursCatalogHero title={hero.title} lead={hero.lead} />

        <div ref={searchDockRef} className="tours-vt-search-overlap">
          <ToursCatalogSearchBar
            ref={searchBarRef}
            filters={draftFilters}
            onChange={(patch) =>
              setDraftFilters((prev) => ({ ...prev, ...patch }))
            }
            onSubmit={() => applyFilters(draftFilters)}
          />
        </div>

        <ToursCatalogStickySearch
          visible={!searchDockInView}
          onOpenSearch={openSearchWithKeywordFocus}
        />

        <div className="tours-vt-body">
          <ToursCatalogSidebar
            filters={draftFilters}
            tourLines={lineFacets}
            priceBounds={bounds}
            onChange={applySidebarFilters}
            onReset={resetFilters}
          />

          <section aria-label="Kết quả tour">
            <div className="tours-vt-main-toolbar">
              <p
                className={`tours-vt-results-count${isFilterStale || isNavigatingFilters ? " is-pending" : ""}`}
              >
                Kết quả: <strong>{totalResults}</strong> chương trình tour
                {isFilterStale || isNavigatingFilters ? " …" : ""}
              </p>
              <div className="tours-vt-toolbar-actions">
                <label className="tours-vt-sort">
                  Sắp xếp theo
                  <select
                    value={currentSort}
                    onChange={(e) => {
                      const [sortBy, sortDir] = e.target.value.split(":") as [
                        TourCatalogUiFilters["sortBy"],
                        "asc" | "desc",
                      ];
                      const next = { ...appliedFilters, sortBy, sortDir };
                      applyFilters(next);
                    }}
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
                <div
                  className="tours-vt-view-toggle"
                  role="group"
                  aria-label="Chế độ xem"
                >
                  <button
                    type="button"
                    className={
                      appliedFilters.view === "grid" ? "is-active" : ""
                    }
                    aria-label="Lưới"
                    onClick={() =>
                      applyFilters({ ...appliedFilters, view: "grid" })
                    }
                  >
                    <Grid3x3 size={18} aria-hidden />
                  </button>
                  <button
                    type="button"
                    className={
                      appliedFilters.view === "list" ? "is-active" : ""
                    }
                    aria-label="Danh sách"
                    onClick={() =>
                      applyFilters({ ...appliedFilters, view: "list" })
                    }
                  >
                    <LayoutList size={18} aria-hidden />
                  </button>
                </div>
              </div>
            </div>

            {tours.length === 0 ? (
              <EmptyState title="Danh sách tour đang trống." />
            ) : displayTours.length === 0 && !hasMore && !loadingMore ? (
              <div className="catalog-empty">
                <Tag size={24} strokeWidth={1.8} aria-hidden />
                <div>
                  <h2>Không có tour phù hợp</h2>
                  <p>Thử đổi bộ lọc hoặc nhấn Đặt lại.</p>
                </div>
                <button type="button" onClick={resetFilters}>
                  Đặt lại
                </button>
              </div>
            ) : (
              <div
                className={`tours-vt-grid catalog-grid ${
                  appliedFilters.view === "list" ? "is-list" : "is-grid"
                }`}
              >
                {displayTours.map((tour) => {
                  const title = translateTourField(tour, "title", tour.title);
                  const days = translateTourField(tour, "days", tour.days);
                  const location = translateTourField(
                    tour,
                    "location",
                    tour.location,
                  );
                  const provinceLine =
                    tour.destinationProvince?.trim() || location || "—";
                  const departCity = catalogDepartureCity(tour, provinceLine);
                  const nextDepart = formatCatalogDepartureDate(tour);
                  const seatsLeft = catalogRemainingSeats(tour);
                  const inclusionBadges = inclusionBadgeLabels(
                    tour.inclusionFlags,
                  );
                  const listPrice = resolveCatalogListPrice(tour);
                  const badge = tourListingBadge(tour);
                  const esgScore = resolveEsgScore(tour);
                  const leiScore = resolveLeiScore(tour);
                  const showSustainability = hasSustainabilityScores(tour);
                  const detailSlug = buildTourSlug(tour.title, tour.id);

                  return (
                    <GlassCard
                      as="article"
                      variant="liquid"
                      className="tours-catalog-card"
                      key={tour.id}
                    >
                      <div className="tours-catalog-card__media">
                        {tour.image ? (
                          <OptimizedImage
                            src={tour.image}
                            alt={title}
                            width={480}
                            height={640}
                            cloudinaryWidth={640}
                            className="tours-catalog-card__cover"
                          />
                        ) : (
                          <div className="tours-catalog-card__empty">
                            <Image size={30} strokeWidth={1.8} aria-hidden />
                          </div>
                        )}

                        <span
                          className={`tours-catalog-card__tag tours-catalog-card__tag--${
                            badge.kind === "esg" ? "standard" : badge.kind
                          }`}
                        >
                          {badge.label}
                        </span>

                        {showSustainability ? (
                          <span
                            className="tours-vt-card-esg"
                            aria-label={`ESG ${esgScore ?? "—"}, LEI ${leiScore ?? "—"}`}
                          >
                            {esgScore != null ? `ESG ${esgScore}` : ""}
                            {esgScore != null && leiScore != null ? " | " : ""}
                            {leiScore != null ? `LEI ${leiScore}` : ""}
                          </span>
                        ) : null}
                      </div>

                      <div className="tours-catalog-card__foot-anchor">
                        <div className="tours-catalog-card__foot-anchor-inner">
                          <button
                            type="button"
                            className="tours-catalog-card__quick-btn"
                            onClick={() =>
                              openQuickView(tour, title, days, provinceLine)
                            }
                          >
                            <Eye size={16} strokeWidth={2.2} aria-hidden />
                            Xem nhanh
                          </button>

                          <div className="tours-catalog-card__panel">
                            <h2 className="tours-catalog-card__title">
                              {title}
                            </h2>
                            <div className="tours-catalog-card__row">
                              <span>
                                <MapPin size={15} strokeWidth={2} aria-hidden />
                                {provinceLine}
                              </span>
                              <span>
                                <Clock size={15} strokeWidth={2} aria-hidden />
                                {days}
                              </span>
                            </div>
                            <div className="tours-catalog-card__booking-meta">
                              <span title="Điểm khởi hành">
                                <MapPin size={14} strokeWidth={2} aria-hidden />
                                {departCity}
                              </span>
                              <span title="Lịch gần nhất">
                                <CalendarDays
                                  size={14}
                                  strokeWidth={2}
                                  aria-hidden
                                />
                                {nextDepart}
                              </span>
                              {seatsLeft != null ? (
                                <span title="Chỗ còn">
                                  <Users
                                    size={14}
                                    strokeWidth={2}
                                    aria-hidden
                                  />
                                  Còn {seatsLeft}
                                </span>
                              ) : null}
                            </div>
                            {inclusionBadges.length > 0 ? (
                              <div
                                className="tours-catalog-card__badges"
                                aria-label="Dịch vụ bao gồm"
                              >
                                {inclusionBadges.map((label) => (
                                  <span
                                    key={label}
                                    className="tours-catalog-card__badge"
                                  >
                                    {label}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                            <div className="tours-catalog-card__foot">
                              <div className="tours-catalog-card__price-block">
                                <span className="tours-catalog-card__price-label">
                                  Giá từ:
                                </span>
                                {listPrice != null ? (
                                  <span className="tours-catalog-card__price-old">
                                    {formatCurrencyVnd(listPrice)}
                                  </span>
                                ) : null}
                                <span className="tours-catalog-card__price-value">
                                  {formatCurrencyVnd(tour.price)}
                                </span>
                              </div>
                              <Link
                                className="tours-catalog-card__cta"
                                to={`/tour/${detailSlug}`}
                                state={{
                                  fromDestinationName:
                                    appliedFilters.keyword ||
                                    appliedFilters.destinationLabel,
                                }}
                              >
                                Xem chi tiết
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}
            {hasMore ? (
              <div
                ref={loadMoreRef}
                className="tours-vt-catalog-sentinel"
                aria-hidden
              />
            ) : null}
            {loadingMore ? (
              <p
                className="tours-vt-load-more"
                role="status"
                aria-live="polite"
              >
                Đang tải thêm tour...
              </p>
            ) : null}
          </section>
        </div>
      </main>

      <TourQuickViewDialog
        open={quickOpen}
        onOpenChange={setQuickOpen}
        tour={quickView}
      />
      <Footer />
    </>
  );
}

export default ToursPage;
