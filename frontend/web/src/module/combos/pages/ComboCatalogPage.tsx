import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Footer } from "@/components/Footer/Footer";
import { ComboCatalogDealCard } from "../components/ComboCatalogDealCard";
import { ComboCatalogFilters } from "../components/ComboCatalogFilters";
import {
  useComboCatalogFilters,
  type CatalogSortKey,
} from "../hooks/useComboCatalogFilters";
import { BrandCardsSkeleton } from "@/components/ui/BrandCardsSkeleton";
import "./ComboCatalogPage.css";

export default function ComboCatalogPage() {
  const { t } = useTranslation("translation", { keyPrefix: "combosPage" });
  const {
    loading,
    loadingMore,
    hasMore,
    loadMore,
    filters,
    filtered,
    reset,
    patch,
  } = useComboCatalogFilters();

  const loadMoreRef = useRef<HTMLDivElement>(null);

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
  }, [hasMore, loadMore, loading]);

  const navigate = useNavigate();

  const onViewDetail = (id: number) => {
    navigate(`/combos/${id}`);
  };

  const onApply = () => {
    toast.success(t("catalog.filters.applyToast", { count: filtered.length }));
  };

  return (
    <div className="combo-catalog-page">
      <div className="combo-catalog-page__body">
        <div className="combo-catalog-page__layout">
          <div className="combo-catalog-page__sidebar">
            <ComboCatalogFilters
              filters={filters}
              onPatch={patch}
              onReset={reset}
              onApply={onApply}
            />
          </div>

          <main className="cc-main">
            <div className="cc-main__toolbar">
              <p className="cc-main__count">
                {t("catalog.resultsPrefix")}{" "}
                <strong>
                  {loading
                    ? "..."
                    : t("catalog.resultsCount", { count: filtered.length })}
                </strong>
              </p>
              <label className="cc-main__sort">
                <span>{t("results.sortLabel")}</span>
                <span className="cc-main__sort-select">
                  <select
                    value={filters.sort}
                    onChange={(e) =>
                      patch({ sort: e.target.value as CatalogSortKey })
                    }
                    aria-label={t("results.sortLabel")}
                  >
                    <option value="price-asc">
                      {t("results.sortPriceAsc")}
                    </option>
                    <option value="price-desc">
                      {t("results.sortPriceDesc")}
                    </option>
                    <option value="rating-desc">
                      {t("results.sortRating")}
                    </option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="cc-main__sort-chevron"
                    aria-hidden
                  />
                </span>
              </label>
            </div>

            <div className="cc-main__grid">
              {loading ? (
                <BrandCardsSkeleton
                  count={9}
                  layout="grid"
                  columns={3}
                  spanParentGrid
                  tallCards
                  ariaLabel="Đang tải combo..."
                  tagline="YOUR JOURNEY - YOUR VALUE"
                />
              ) : filtered.length === 0 ? (
                <p className="cc-main__empty">{t("catalog.empty")}</p>
              ) : (
                filtered.map((deal) => (
                  <ComboCatalogDealCard
                    key={deal.id}
                    deal={deal}
                    onViewDetail={() => onViewDetail(deal.id)}
                  />
                ))
              )}
            </div>

            {!loading && hasMore && (
              <div
                ref={loadMoreRef}
                className="cc-main__sentinel"
                style={{ height: "40px" }}
                aria-hidden
              />
            )}

            {loadingMore && (
              <div className="cc-main__loading-more">
                <BrandCardsSkeleton
                  count={3}
                  layout="grid"
                  columns={3}
                  spanParentGrid
                  tallCards
                  ariaLabel="Đang tải thêm combo..."
                />
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
