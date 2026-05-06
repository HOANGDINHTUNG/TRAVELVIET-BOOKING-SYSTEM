import { useEffect, useMemo, useState } from "react";
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

const fallbackPromotions: PromotionCard[] = [
  {
    id: -1,
    title: "Du lich - Teambuilding - Gala",
    subtitle: "Chuong trinh he tron goi cho doanh nghiep tu 30 khach.",
    badge: "Uu dai doanh nghiep",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Doan khach tham gia hoat dong team building ngoai troi",
    ctaLabel: "Xem uu dai",
    ctaUrl: "/tours",
  },
  {
    id: -2,
    title: "Ca cong ty cung di",
    subtitle: "Goi tour tron goi cho doan 50 den 1000 khach.",
    badge: "Tour doan lon",
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Nhom nhan vien cong ty cung tham gia chuyen di",
    ctaLabel: "Nhan tu van",
    ctaUrl: "/tours",
  },
  {
    id: -3,
    title: "Hanh trinh gan ket",
    subtitle: "Giam gia cho nhom gia dinh tu 6 khach tro len.",
    badge: "Gia dinh",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Gia dinh nghi duong tren bai bien",
    ctaLabel: "Dat tour ngay",
    ctaUrl: "/tours",
  },
];

function toPromotionCard(item: PromotionCampaign): PromotionCard {
  const safeCtaUrl =
    item.ctaUrl?.startsWith("/") && !item.ctaUrl.startsWith("/promotions")
      ? item.ctaUrl
      : "/tours";

  return {
    id: item.id,
    title: item.displayTitle || item.name || item.code || "Promotion",
    subtitle: item.displaySubtitle || item.description || "Uu dai tour moi nhat",
    badge: item.badgeText || "Promotion",
    imageUrl: item.imageUrl || fallbackPromotions[0].imageUrl,
    imageAlt:
      item.imageAlt ||
      item.displayTitle ||
      item.name ||
      "TravelViet promotion",
    ctaLabel: item.ctaLabel || "Xem uu dai",
    ctaUrl: safeCtaUrl,
  };
}

export function LatestPromotionsSection() {
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

  const cards = useMemo(() => {
    const activeCards = promotions
      .filter((item) => item.imageUrl || item.displayTitle || item.name)
      .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0))
      .slice(0, 3)
      .map(toPromotionCard);

    return activeCards.length > 0 ? activeCards : fallbackPromotions;
  }, [promotions]);

  return (
    <section className="section-shell latest-promotions-section" id="promotions">
      <div className="latest-promotions-heading">
        <h2>Chương trình khuyến mãi mới nhất</h2>
      </div>

      <div className="latest-promotions-grid" aria-busy={isLoading}>
        {cards.map((item) => (
          <Link
            aria-label={`${item.title}. ${item.ctaLabel}`}
            className="latest-promotion-card"
            to={item.ctaUrl}
            key={item.id}
          >
            <img src={item.imageUrl} alt={item.imageAlt} loading="lazy" />
          </Link>
        ))}
      </div>
    </section>
  );
}
