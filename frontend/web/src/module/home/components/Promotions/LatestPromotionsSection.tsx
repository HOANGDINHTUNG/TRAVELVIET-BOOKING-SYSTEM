import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { SmoothCarouselTrack } from "../../../../components/ui/SmoothCarousel/SmoothCarouselTrack";
import { useSmoothInfiniteCarousel } from "../../../../components/ui/SmoothCarousel/useSmoothInfiniteCarousel";
import {
  promotionApi,
  type PromotionCampaign,
} from "../../../../api/server/Promotion.api";
import "./LatestPromotionsSection.css";

type PromotionCard = {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  imageAlt: string;
  ctaLabel: string;
  ctaUrl: string;
};

const MAX_PROMOS = 12;
const DESKTOP_VISIBLE = 3;
const MOBILE_BREAKPOINT = 980;

/** Generic image when API row exists but `image_url` is still empty (e.g. old rows before V7). */
const PLACEHOLDER_PROMO_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

function toPromotionCard(item: PromotionCampaign, t: TFunction): PromotionCard {
  const safeCtaUrl =
    item.ctaUrl?.startsWith("/") && !item.ctaUrl.startsWith("/promotions")
      ? item.ctaUrl
      : "/tours";

  return {
    id: item.id,
    title: item.displayTitle || item.name || item.code || "Promotion",
    subtitle:
      item.displaySubtitle ||
      item.description ||
      t("homePage.promotions.defaultSubtitle"),
    badge: item.badgeText || t("homePage.promotions.defaultBadge"),
    imageUrl: item.imageUrl?.trim() ? item.imageUrl : PLACEHOLDER_PROMO_IMAGE,
    imageAlt:
      item.imageAlt ||
      item.displayTitle ||
      item.name ||
      t("homePage.promotions.defaultBadge"),
    ctaLabel: item.ctaLabel || t("homePage.promotions.defaultCta"),
    ctaUrl: safeCtaUrl,
  };
}

function PromotionCardItem({ item }: { item: PromotionCard }) {
  return (
    <Link
      aria-label={`${item.title}. ${item.ctaLabel}`}
      className="latest-promotion-card"
      to={item.ctaUrl}
    >
      <motion.div
        className="latest-promotion-card-inner"
        whileHover={{ y: -3 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <img src={item.imageUrl} alt={item.imageAlt} loading="lazy" />
        <div className="latest-promotion-card-overlay" aria-hidden="true">
          <div className="latest-promotion-card-overlay-panel">
            <span className="latest-promotion-badge">{item.badge}</span>
            <h3 className="latest-promotion-title">{item.title}</h3>
            <p className="latest-promotion-sub">{item.subtitle}</p>
            <span className="latest-promotion-cta">{item.ctaLabel}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function useVisibleSlots() {
  const [visibleSlots, setVisibleSlots] = useState(DESKTOP_VISIBLE);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const sync = () => setVisibleSlots(mq.matches ? 1 : DESKTOP_VISIBLE);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return visibleSlots;
}

export function LatestPromotionsSection() {
  const { t, i18n } = useTranslation();
  const [promotions, setPromotions] = useState<PromotionCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const visibleSlots = useVisibleSlots();

  useEffect(() => {
    let isMounted = true;

    promotionApi
      .getPublicCampaigns()
      .then((response) => {
        if (isMounted) {
          setPromotions(response.content ?? []);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPromotions([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const fallbackCards = useMemo(() => {
    const raw = t("homePage.promotions.fallback", {
      returnObjects: true,
    });
    return Array.isArray(raw) ? (raw as PromotionCard[]) : [];
  }, [t, i18n.language]);

  const list = useMemo(() => {
    const activeCards = promotions
      .filter((item) => item.name || item.displayTitle || item.code)
      .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0))
      .slice(0, MAX_PROMOS)
      .map((item) => toPromotionCard(item, t));

    if (activeCards.length > 0) {
      return activeCards;
    }
    return fallbackCards;
  }, [promotions, t, fallbackCards]);

  const n = list.length;

  const carousel = useSmoothInfiniteCarousel({
    itemCount: n,
    visibleCount: visibleSlots,
    loop: true,
  });

  const trackItems = useMemo(() => {
    if (n === 0) return [];
    const clones =
      carousel.cloneCount > 0 ? list.slice(0, carousel.cloneCount) : [];
    return [...list, ...clones];
  }, [carousel.cloneCount, list, n]);

  const viewMoreTo = t("homePage.promotions.viewMoreTo", { defaultValue: "/tours" });

  return (
    <section className="section-shell latest-promotions-section" id="promotions">
      <div className="latest-promotions-head">
        <h2>{t("homePage.promotions.sectionTitle")}</h2>
        <div className="latest-promotions-head-actions">
          <Link className="latest-promotions-more" to={viewMoreTo}>
            {t("homePage.promotions.viewMore")}
          </Link>
          {carousel.canNavigate && (
            <div className="latest-promotions-nav">
              <button
                type="button"
                aria-label={t("homePage.promotions.prev")}
                onClick={carousel.goPrev}
                className="latest-promotions-arrow"
              >
                <ChevronLeft size={22} aria-hidden />
              </button>
              <button
                type="button"
                aria-label={t("homePage.promotions.next")}
                disabled={carousel.isMoving}
                onClick={carousel.goNext}
                className="latest-promotions-arrow"
              >
                <ChevronRight size={22} aria-hidden />
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={t("homePage.promotions.sectionTitle")}
        aria-busy={isLoading}
      >
        {isLoading && list.length === 0 ? (
          <div
            className="latest-promotions-track latest-promotions-track--skeleton"
            aria-hidden
          >
            {Array.from({ length: visibleSlots }).map((_, i) => (
              <div
                key={`promo-skel-${i}`}
                data-carousel-slide
                className="latest-promotions-slide"
              >
                <div className="latest-promotion-card latest-promotion-card--skeleton" />
              </div>
            ))}
          </div>
        ) : (
          <SmoothCarouselTrack
            viewportRef={carousel.viewportRef}
            offsetX={carousel.offsetX}
            durationSec={carousel.durationSec}
            onTransitionComplete={carousel.onTransitionComplete}
            className="latest-promotions-viewport"
            trackClassName="latest-promotions-track"
            style={
              {
                "--carousel-visible": visibleSlots,
              } as CSSProperties
            }
          >
            {trackItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                data-carousel-slide
                className="latest-promotions-slide"
              >
                <PromotionCardItem item={item} />
              </div>
            ))}
          </SmoothCarouselTrack>
        )}
      </div>
    </section>
  );
}
