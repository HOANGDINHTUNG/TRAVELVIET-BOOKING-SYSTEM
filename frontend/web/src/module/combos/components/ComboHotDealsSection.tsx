import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Percent } from "lucide-react";
import { BrandCardsSkeleton } from "@/components/ui/BrandCardsSkeleton";
import { fetchPublicCombos } from "@/api/server/Combo.api";
import type { ComboPackageResponse } from "@/api/server/Combo.api";
import { ComboDealCard } from "./ComboDealCard";
import "./ComboHotDealsSection.css";

type DealTabId = "all" | "flight-hotel" | "car-hotel" | string;

const TAB_LOADING_MS = 700;

export function ComboHotDealsSection() {
  const { t } = useTranslation("translation", { keyPrefix: "combosPage" });
  const { t: tHotels } = useTranslation("translation", {
    keyPrefix: "hotelsPage",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const skipFirstTabLoad = useRef(true);
  const tabs = useMemo(
    () =>
      t("hotDeals.tabs", { returnObjects: true }) as Array<{
        id: DealTabId;
        label: string;
      }>,
    [t],
  );
  const [activeTab, setActiveTab] = useState<DealTabId>("all");
  const [deals, setDeals] = useState<ComboPackageResponse[]>([]);

  useEffect(() => {
    let active = true;
    fetchPublicCombos({ isActive: true })
      .then((res) => {
        if (active) setDeals(res);
      })
      .catch(console.error)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredDeals = useMemo(() => {
    if (activeTab === "all") return deals;
    return deals.filter((deal) => {
      const type = deal.comboType?.toLowerCase();
      if (activeTab === "flight-hotel") return type === "hotel_flight";
      if (activeTab === "car-hotel") return type === "hotel_car";
      return type === activeTab.toLowerCase();
    });
  }, [activeTab, deals]);

  // Carousel refs and scroll handlers
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollCarousel = (dir: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300; // Scroll distance
      carouselRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (skipFirstTabLoad.current) {
      skipFirstTabLoad.current = false;
      return undefined;
    }
    const id = window.setTimeout(() => setTabLoading(false), TAB_LOADING_MS);
    return () => window.clearTimeout(id);
  }, [activeTab]);

  const showSkeleton = loading || tabLoading;

  const onViewMore = () => {
    navigate("/combos/all");
  };

  return (
    <section
      className="combo-hot-deals"
      aria-labelledby="combo-hot-deals-title"
    >
      <div className="combo-hot-deals__inner">
        <div className="combo-hot-deals__header">
          <div className="combo-hot-deals__title-row">
            <span className="combo-hot-deals__badge-icon" aria-hidden>
              <Percent size={14} />
            </span>
            <h2 id="combo-hot-deals-title" className="combo-hot-deals__title">
              {t("hotDeals.title")}
            </h2>
            <span className="combo-hot-deals__badge-icon" aria-hidden>
              <Percent size={14} />
            </span>
          </div>
          <p className="combo-hot-deals__subtitle">{t("hotDeals.subtitle")}</p>
        </div>

        <div className="combo-hot-deals__toolbar">
          <div className="combo-hot-deals__tabs" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`combo-hot-deals__tab${activeTab === tab.id ? " is-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="combo-hot-deals__more"
            onClick={onViewMore}
          >
            {t("hotDeals.viewMore")}
            <span className="combo-hot-deals__more-icon" aria-hidden>
              <ArrowRight size={16} />
            </span>
          </button>
        </div>

        <div className="combo-hot-deals__carousel-wrap">
          <button
            type="button"
            className="combo-hot-deals__btn combo-hot-deals__btn--prev"
            onClick={() => scrollCarousel("left")}
            aria-label="Previous"
          >
            ←
          </button>

          <div className="combo-hot-deals__grid" ref={carouselRef}>
            {showSkeleton ? (
              <BrandCardsSkeleton
                count={4}
                layout="grid"
                columns={4}
                spanParentGrid
                tallCards
                ariaLabel={t("hotDeals.loadingAria")}
                tagline={tHotels("hero.brandTagline")}
              />
            ) : filteredDeals.length === 0 ? (
              <p className="combo-hot-deals__empty">
                Không tìm thấy combo phù hợp.
              </p>
            ) : (
              filteredDeals.map((deal) => (
                <ComboDealCard key={deal.id} deal={deal} />
              ))
            )}
          </div>

          <button
            type="button"
            className="combo-hot-deals__btn combo-hot-deals__btn--next"
            onClick={() => scrollCarousel("right")}
            aria-label="Next"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
