import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { Destination, Tour } from "../../database/interface/publicTravel";
import { HotCardSkeleton } from "../../../../components/ui/skeletons/HomeSkeletons";
import { tourDetailPath } from "../../../tours/utils/slug";
import "./TourHotSection.css";

type HotCard = {
  key: string;
  label: string;
  image: string | null;
  backdropUrl: string | null;
  href: string;
};

const FALLBACK_BY_LABEL: Record<string, string> = {
  "Đông Tây Bắc":
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
  "Tâm Linh":
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
  "Hà Giang":
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80",
  "Biển Đảo":
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  "Hàn Quốc":
    "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800&q=80",
};

const FALLBACK_BACKDROP_BY_LABEL: Record<string, string> = {
  "Đông Tây Bắc":
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=55",
  "Tâm Linh":
    "https://images.unsplash.com/photo-1528181304800-2f140819ad1c?auto=format&fit=crop&w=1600&q=55",
  "Hà Giang":
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=55",
  "Biển Đảo":
    "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1600&q=55",
  "Hàn Quốc":
    "https://images.unsplash.com/photo-1538669715515-5e3a444bc991?auto=format&fit=crop&w=1600&q=55",
};

const DEFAULT_ORDER_VI = [
  "Đông Tây Bắc",
  "Tâm Linh",
  "Hà Giang",
  "Biển Đảo",
  "Hàn Quốc",
] as const;

const SLOT_I18N_KEYS: Record<string, string> = {
  "Đông Tây Bắc": "homePage.tourHot.slots.northWest",
  "Tâm Linh": "homePage.tourHot.slots.spiritual",
  "Hà Giang": "homePage.tourHot.slots.haGiang",
  "Biển Đảo": "homePage.tourHot.slots.islands",
  "Hàn Quốc": "homePage.tourHot.slots.korea",
};

type TourHotSectionProps = {
  destinations: Destination[];
  tours: Tour[];
  loading?: boolean;
};

type HotTranslate = {
  destLabel: (d: Destination) => string;
  tourLabel: (tour: Tour) => string;
  defaultSlot: (vnKey: string) => string;
};

function stripQuery(u: string) {
  const i = u.indexOf("?");
  return i === -1 ? u : u.slice(0, i);
}

function pickBackdropUrl(gallery: string[], thumb: string | null): string | null {
  const list = gallery.filter(Boolean);
  if (!list.length) return thumb;

  if (!thumb) {
    return list[1] ?? list[0] ?? null;
  }

  const t = stripQuery(thumb);
  const others = list.filter((u) => stripQuery(u) !== t);
  if (others.length) {
    return others[0];
  }

  return list[1] ?? list[0] ?? thumb;
}

function buildCards(
  destinations: Destination[],
  tours: Tour[],
  tr: HotTranslate,
): HotCard[] {
  const fromDest = destinations
    .filter((d) => d.name && (d.image || FALLBACK_BY_LABEL[d.name]))
    .slice(0, 5)
    .map((d, i) => ({
      key: `d-${d.uuid ?? i}`,
      label: tr.destLabel(d),
      image: d.image || FALLBACK_BY_LABEL[d.name] || null,
      backdropUrl:
        (d.image && FALLBACK_BACKDROP_BY_LABEL[d.name]
          ? pickBackdropUrl([d.image, FALLBACK_BACKDROP_BY_LABEL[d.name]], d.image)
          : d.image) || FALLBACK_BACKDROP_BY_LABEL[d.name] || null,
      href: d.uuid ? `/destinations/${d.uuid}` : "/tours",
    }));

  if (fromDest.length >= 5) {
    return fromDest;
  }

  const fromTours = tours
    .filter((t) => t.title && t.image)
    .slice(0, 5 - fromDest.length)
    .map((t, i) => {
      const gallery = t.mediaGalleryUrls?.length
        ? t.mediaGalleryUrls
        : t.image
          ? [t.image]
          : [];
      return {
        key: `t-${t.id ?? i}`,
        label: tr.tourLabel(t),
        image: t.image,
        backdropUrl: pickBackdropUrl(gallery, t.image) ?? t.image,
        href: t.id != null ? tourDetailPath(t.id, tr.tourLabel(t)) : "/tours",
      };
    });

  const merged: HotCard[] = [...fromDest, ...fromTours];

  while (merged.length < 5) {
    const idx = merged.length;
    const labelVi = DEFAULT_ORDER_VI[idx];
    merged.push({
      key: `default-${idx}`,
      label: tr.defaultSlot(labelVi),
      image: FALLBACK_BY_LABEL[labelVi] ?? null,
      backdropUrl:
        FALLBACK_BACKDROP_BY_LABEL[labelVi] ?? FALLBACK_BY_LABEL[labelVi] ?? null,
      href: "/tours",
    });
  }

  return merged.slice(0, 5);
}

type PillTab = "featured" | "fresh";

export function TourHotSection({
  destinations,
  tours,
  loading = false,
}: TourHotSectionProps) {
  const { t, i18n } = useTranslation();

  const tr = useMemo<HotTranslate>(
    () => ({
      destLabel: (d) => {
        if (d.translationKey) {
          const k = `data.destinations.${d.translationKey}.name`;
          if (i18n.exists(k)) return t(k);
        }
        return d.name;
      },
      tourLabel: (tour) => {
        if (tour.translationKey) {
          const k = `data.tours.${tour.translationKey}.title`;
          if (i18n.exists(k)) return t(k);
        }
        return tour.title;
      },
      defaultSlot: (vnKey) => {
        const path = SLOT_I18N_KEYS[vnKey];
        return path ? String(t(path)) : vnKey;
      },
    }),
    [i18n, t],
  );

  const cards = useMemo(
    () => buildCards(destinations, tours, tr),
    [destinations, tours, tr],
  );

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [pillTab, setPillTab] = useState<PillTab>("featured");

  const activeBackdropUrl = useMemo(() => {
    if (hoveredKey) {
      const c = cards.find((x) => x.key === hoveredKey);
      if (c?.backdropUrl) return c.backdropUrl;
      if (c?.image) return c.image;
    }
    const first = cards[0];
    return first?.backdropUrl ?? first?.image ?? null;
  }, [cards, hoveredKey]);

  const ctaLabel = t("homePage.tourHot.viewDetails");

  return (
    <section className="tour-hot-section" aria-labelledby="tour-hot-heading">
      {activeBackdropUrl ? (
        <div className="tour-hot-backdrop" aria-hidden>
          <img
            className="tour-hot-backdrop-img"
            src={activeBackdropUrl}
            alt=""
            decoding="async"
          />
        </div>
      ) : null}
      <div className="tour-hot-scrim" aria-hidden />

      <div className="tour-hot-inner">
        <header className="tour-hot-head">
          <div className="tour-hot-head-text">
            <h2 id="tour-hot-heading" className="tour-hot-title">
              <span className="tour-hot-title-dot" aria-hidden />
              {t("homePage.tourHot.title")}
            </h2>
            <p className="tour-hot-sub">{t("homePage.tourHot.subtitle")}</p>
          </div>
          <div
            className="tour-hot-pills"
            role="tablist"
            aria-label={t("homePage.tourHot.filterAria")}
          >
            <button
              type="button"
              role="tab"
              aria-selected={pillTab === "featured"}
              className={`tour-hot-pill${pillTab === "featured" ? " tour-hot-pill-active" : ""}`}
              onClick={() => setPillTab("featured")}
            >
              {t("homePage.tourHot.featured")}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={pillTab === "fresh"}
              className={`tour-hot-pill${pillTab === "fresh" ? " tour-hot-pill-active" : ""}`}
              onClick={() => setPillTab("fresh")}
            >
              {t("homePage.tourHot.newest")}
            </button>
          </div>
        </header>

        <div
          className="tour-hot-grid-wrap"
          onMouseLeave={() => setHoveredKey(null)}
        >
          <div className="tour-hot-grid">
            {loading && destinations.length === 0 && tours.length === 0
              ? Array.from({ length: 5 }).map((_, i) => (
                  <HotCardSkeleton
                    key={`hot-skeleton-${i}`}
                    className="tour-hot-card"
                  />
                ))
              : cards.map((card) => {
                  const showImg = Boolean(card.image);

                  return (
                    <Link
                      key={card.key}
                      to={card.href}
                      className="tour-hot-card"
                      onMouseEnter={() => setHoveredKey(card.key)}
                      aria-label={`${card.label}. ${ctaLabel}`}
                    >
                      {showImg ? (
                        <img src={card.image!} alt="" loading="lazy" />
                      ) : (
                        <span
                          className="tour-hot-card-placeholder"
                          aria-hidden
                        />
                      )}
                      <span className="tour-hot-card-menu" aria-hidden>
                        ···
                      </span>
                      <span className="tour-hot-card-cta">{ctaLabel}</span>
                      <span className="tour-hot-card-label">
                        {card.label}
                      </span>
                    </Link>
                  );
                })}
          </div>
        </div>
      </div>
    </section>
  );
}
