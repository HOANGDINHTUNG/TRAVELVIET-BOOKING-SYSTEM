import { useEffect, useMemo, useState } from "react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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

export function LatestPromotionsSection() {
  const { t, i18n } = useTranslation();
  const [promotions, setPromotions] = useState<PromotionCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const fallbackCards = useMemo(
    () =>
      t("homePage.promotions.fallback", { returnObjects: true }) as PromotionCard[],
    [t, i18n.language],
  );

  const cards = useMemo(() => {
    const activeCards = promotions
      .filter((item) => item.name || item.displayTitle || item.code)
      .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0))
      .slice(0, 3)
      .map((item) => toPromotionCard(item, t));

    if (activeCards.length > 0) {
      return activeCards;
    }
    return fallbackCards;
  }, [promotions, t, fallbackCards]);

  return (
    <section className="section-shell latest-promotions-section" id="promotions">
      <div className="latest-promotions-heading">
        <h2>{t("homePage.promotions.sectionTitle")}</h2>
      </div>

      <div className="latest-promotions-grid" aria-busy={isLoading}>
        {cards.map((item) => (
          <Link
            aria-label={`${item.title}. ${item.ctaLabel}`}
            className="latest-promotion-card"
            to={item.ctaUrl}
            key={item.id}
          >
            <div className="latest-promotion-card-inner">
              <img src={item.imageUrl} alt={item.imageAlt} loading="lazy" />
              <div className="latest-promotion-card-overlay" aria-hidden="true">
                <div className="latest-promotion-card-overlay-panel">
                  <span className="latest-promotion-badge">{item.badge}</span>
                  <h3 className="latest-promotion-title">{item.title}</h3>
                  <p className="latest-promotion-sub">{item.subtitle}</p>
                  <span className="latest-promotion-cta">{item.ctaLabel}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
