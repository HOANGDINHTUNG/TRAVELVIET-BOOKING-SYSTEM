import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Calendar, ChevronRight, Clock } from "lucide-react";
import type { Destination } from "../../database/interface/publicTravel";
import type { homeLowerVi } from "../../locales/homeLower.vi";
import "./HomeLowerSections.css";

type HomeLowerBundle = typeof homeLowerVi;

// ============================================================
// Ảnh dự phòng – lưới Vi vu nước ngoài (khi destinations thiếu ảnh)
// ============================================================
const intlGridFallbackImages = [
  "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517154421773-e571b7295963?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80",
];

// ============================================================
// Logo doanh nghiệp (tên thương hiệu – không dịch)
// ============================================================
const corporateLogos = [
  { name: "HGS", color: "#c0392b" },
  { name: "de heus", color: "#27ae60" },
  { name: "CDN LAND", color: "#2980b9" },
  { name: "SunBet", color: "#e67e22" },
  { name: "SkyJec", color: "#8e44ad" },
  { name: "NUSET", color: "#e74c3c" },
  { name: "MB", color: "#2471a3" },
  { name: "LG Innotek", color: "#c0392b" },
];

function buildIntlGridCells(destinations: Destination[], rowLabels: string[]) {
  const urls = destinations.filter((d) => d.image).map((d) => d.image);
  const n = urls.length;
  return rowLabels.map((label, idx) => ({
    label,
    img: n > 0 ? urls[idx % n] : intlGridFallbackImages[idx],
  }));
}

function buildEuropeQuadImages(destinations: Destination[]) {
  const urls = destinations.filter((d) => d.image).map((d) => d.image);
  const n = urls.length;
  if (n >= 4) {
    return [urls[0], urls[1 % n], urls[2 % n], urls[3 % n]];
  }
  return intlGridFallbackImages.slice(2, 6);
}

function useHomeLowerBundle(): HomeLowerBundle {
  const { t, i18n } = useTranslation();

  return useMemo(
    () =>
      ({
        sections: {
          testimonialsTitle: t("homeLower.sections.testimonialsTitle"),
          galleryTitle: t("homeLower.sections.galleryTitle"),
          corporateTitle: t("homeLower.sections.corporateTitle"),
          exploreTitle: t("homeLower.sections.exploreTitle"),
          intlTitle: t("homeLower.sections.intlTitle"),
          handbookTitle: t("homeLower.sections.handbookTitle"),
          thdNewsTitle: t("homeLower.sections.thdNewsTitle"),
        },
        aria: {
          testimonialsPrev: t("homeLower.aria.testimonialsPrev"),
          testimonialsNext: t("homeLower.aria.testimonialsNext"),
          corporatePage: t("homeLower.aria.corporatePage"),
          intlMosaic: t("homeLower.aria.intlMosaic"),
        },
        links: {
          seeMore: t("homeLower.links.seeMore"),
        },
        testimonials: t("homeLower.testimonials", {
          returnObjects: true,
        }) as HomeLowerBundle["testimonials"],
        gallery: t("homeLower.gallery", { returnObjects: true }) as HomeLowerBundle["gallery"],
        exploreFallback: t("homeLower.exploreFallback", {
          returnObjects: true,
        }) as HomeLowerBundle["exploreFallback"],
        intl: {
          rowLabels: t("homeLower.intl.rowLabels", {
            returnObjects: true,
          }) as HomeLowerBundle["intl"]["rowLabels"],
          europe: t("homeLower.intl.europe"),
        },
        mockGuides: t("homeLower.mockGuides", {
          returnObjects: true,
        }) as HomeLowerBundle["mockGuides"],
        mockNews: t("homeLower.mockNews", {
          returnObjects: true,
        }) as HomeLowerBundle["mockNews"],
      }) satisfies HomeLowerBundle,
    [t, i18n.language],
  );
}

// ============================================================
// Sub-component: Testimonials Carousel
// ============================================================
function TestimonialsSection({ bundle }: { bundle: HomeLowerBundle }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: (dir === "next" ? 1 : -1) * 300, behavior: "smooth" });
  };

  return (
    <section className="hls-section hls-testimonials">
      <div className="hls-inner">
        <h2 className="hls-title">{bundle.sections.testimonialsTitle}</h2>
        <div className="hls-testi-wrap">
          <button
            type="button"
            className="hls-arrow hls-arrow-l"
            onClick={() => scroll("prev")}
            aria-label={bundle.aria.testimonialsPrev}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div ref={scrollerRef} className="hls-testi-scroller">
            {bundle.testimonials.map((item) => (
              <article key={item.id} className="hls-testi-card">
                <p className="hls-testi-text">{item.text}</p>
                <div className="hls-testi-stars">
                  {"★".repeat(item.stars)}
                </div>
                <div className="hls-testi-author">
                  <img src={item.avatar} alt={item.name} className="hls-testi-avatar" />
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.location}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <button
            type="button"
            className="hls-arrow hls-arrow-r"
            onClick={() => scroll("next")}
            aria-label={bundle.aria.testimonialsNext}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Sub-component: Thư viện hình ảnh (mosaic 5 ảnh)
// ============================================================
function GallerySection({ bundle }: { bundle: HomeLowerBundle }) {
  const g = bundle.gallery;

  return (
    <section className="hls-section hls-gallery">
      <div className="hls-inner">
        <h2 className="hls-title">{bundle.sections.galleryTitle}</h2>
        <div className="hls-gallery-mosaic">
          <div className="hls-gallery-col hls-gallery-col-side">
            <div className="hls-gallery-cell">
              <img src={g[0].img} alt={g[0].label} loading="lazy" />
              <span className="hls-gallery-label">{g[0].label}</span>
            </div>
            <div className="hls-gallery-cell">
              <img src={g[3].img} alt={g[3].label} loading="lazy" />
              <span className="hls-gallery-label">{g[3].label}</span>
            </div>
          </div>
          <div className="hls-gallery-col hls-gallery-col-center">
            <div className="hls-gallery-cell hls-gallery-cell-tall">
              <img src={g[1].img} alt={g[1].label} loading="lazy" />
              <span className="hls-gallery-label">{g[1].label}</span>
            </div>
          </div>
          <div className="hls-gallery-col hls-gallery-col-side">
            <div className="hls-gallery-cell">
              <img src={g[2].img} alt={g[2].label} loading="lazy" />
              <span className="hls-gallery-label">{g[2].label}</span>
            </div>
            <div className="hls-gallery-cell">
              <img src={g[4].img} alt={g[4].label} loading="lazy" />
              <span className="hls-gallery-label">{g[4].label}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Sub-component: Khách hàng doanh nghiệp tiêu biểu
// ============================================================
function CorporateSection({ title }: { title: string }) {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const pages = Math.ceil(corporateLogos.length / 8);

  return (
    <section className="hls-section hls-corporate">
      <div className="hls-inner">
        <h2 className="hls-title">{title}</h2>
        <div className="hls-logo-row">
          {corporateLogos.map((logo) => (
            <div key={logo.name} className="hls-logo-item">
              <span style={{ color: logo.color }}>{logo.name}</span>
            </div>
          ))}
        </div>
        <div className="hls-dots">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`hls-dot${i === active ? " hls-dot-active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={t("homeLower.aria.corporatePage", { page: i + 1 })}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Sub-component: Khám phá Việt Nam
// ============================================================
type ExploreVietnamProps = {
  destinations: Destination[];
  bundle: HomeLowerBundle;
};

function ExploreVietnamSection({ destinations, bundle }: ExploreVietnamProps) {
  const destImages = destinations
    .filter((d) => d.image && d.name)
    .slice(0, 7);

  const items =
    destImages.length >= 4
      ? destImages.map((d, i) => ({
          label: d.name,
          img: d.image!,
          size: i === 0 || i === 2 ? "large" : i === 1 ? "medium" : "small",
        }))
      : bundle.exploreFallback;

  const topRow = items.slice(0, 3);
  const bottomRow = items.slice(3, 7);

  return (
    <section className="hls-section hls-explore">
      <div className="hls-inner">
        <h2 className="hls-title">{bundle.sections.exploreTitle}</h2>
        <div className="hls-explore-grid">
          <div className="hls-explore-top">
            {topRow.map((item, idx) => (
              <div
                key={`explore-top-${idx}-${item.label}`}
                className={`hls-explore-cell hls-explore-${item.size}`}
              >
                <img src={item.img} alt={item.label} loading="lazy" />
                <span className="hls-explore-label">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="hls-explore-bottom">
            {bottomRow.map((item, idx) => (
              <div
                key={`explore-bot-${idx}-${item.label}`}
                className="hls-explore-cell hls-explore-small"
              >
                <img src={item.img} alt={item.label} loading="lazy" />
                <span className="hls-explore-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Sub-component: Vi vu nước ngoài + Cẩm nang + Bản tin THD
// ============================================================
function ViVuNuocNgoaiHandbookNewsSection({
  destinations,
  bundle,
}: ExploreVietnamProps) {
  const intlCells = buildIntlGridCells(destinations, [...bundle.intl.rowLabels]);
  const europeQuads = buildEuropeQuadImages(destinations);
  const th = intlCells[0];
  const sg = intlCells[1];
  const cn = intlCells[2];
  const jp = intlCells[3];
  const kr = intlCells[4];

  return (
    <section className="hls-section hls-intl-bundle">
      <div className="hls-inner">
        <h2 className="hls-title hls-title-accent">{bundle.sections.intlTitle}</h2>

        <div className="hls-intl-mosaic" aria-label={bundle.aria.intlMosaic}>
          <div className="hls-intl-col hls-intl-col-left">
            <div className="hls-intl-cell">
              <img src={th.img} alt={th.label} loading="lazy" />
              <span className="hls-intl-label">{th.label}</span>
            </div>
            <div className="hls-intl-cell">
              <img src={sg.img} alt={sg.label} loading="lazy" />
              <span className="hls-intl-label">{sg.label}</span>
            </div>
          </div>
          <div className="hls-intl-col hls-intl-col-center">
            <div className="hls-intl-cell hls-intl-cell-tall">
              <img src={cn.img} alt={cn.label} loading="lazy" />
              <span className="hls-intl-label">{cn.label}</span>
            </div>
          </div>
          <div className="hls-intl-col hls-intl-col-right">
            <div className="hls-intl-cell">
              <img src={jp.img} alt={jp.label} loading="lazy" />
              <span className="hls-intl-label">{jp.label}</span>
            </div>
            <div className="hls-intl-col-right-bottom">
              <div className="hls-intl-cell">
                <img src={kr.img} alt={kr.label} loading="lazy" />
                <span className="hls-intl-label">{kr.label}</span>
              </div>
              <div className="hls-intl-cell hls-intl-europe">
                <div className="hls-intl-europe-grid" aria-hidden>
                  {europeQuads.map((src, i) => (
                    <img key={i} src={src} alt="" loading="lazy" />
                  ))}
                </div>
                <span className="hls-intl-label">{bundle.intl.europe}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hls-intl-bottom">
          <div className="hls-handbook">
            <div className="hls-subsection-head">
              <h2 className="hls-title hls-title-accent hls-title-inline">
                {bundle.sections.handbookTitle}
              </h2>
              <Link to="/tours" className="hls-more-link">
                {bundle.links.seeMore}
                <span className="hls-more-icon" aria-hidden>
                  <ChevronRight size={16} strokeWidth={2.6} />
                </span>
              </Link>
            </div>
            <div className="hls-handbook-grid">
              {bundle.mockGuides.map((a) => (
                <article key={a.id} className="hls-article-card">
                  <div className="hls-article-media">
                    <img src={a.image} alt="" loading="lazy" />
                  </div>
                  <h3 className="hls-article-title">{a.title}</h3>
                  <div className="hls-article-meta">
                    <Calendar
                      size={16}
                      strokeWidth={2.2}
                      className="hls-meta-icon"
                      aria-hidden
                    />
                    <time dateTime={a.date}>{a.date}</time>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="hls-thd-news">
            <div className="hls-subsection-head">
              <h2 className="hls-title hls-title-accent hls-title-inline hls-title-tight">
                {bundle.sections.thdNewsTitle}
              </h2>
              <Link to="/tours" className="hls-more-link">
                {bundle.links.seeMore}
                <span className="hls-more-icon" aria-hidden>
                  <ChevronRight size={16} strokeWidth={2.6} />
                </span>
              </Link>
            </div>
            <ul className="hls-news-list">
              {bundle.mockNews.map((n) => (
                <li key={n.id} className="hls-news-row">
                  <div className="hls-news-thumb">
                    <img src={n.thumb} alt="" loading="lazy" />
                  </div>
                  <div className="hls-news-body">
                    <p className="hls-news-title">{n.title}</p>
                    <div className="hls-news-meta">
                      <Clock
                        size={15}
                        strokeWidth={2.2}
                        className="hls-meta-icon"
                        aria-hidden
                      />
                      <time dateTime={n.date}>{n.date}</time>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Export tổng hợp
// ============================================================
export function HomeLowerSections({ destinations }: { destinations: Destination[] }) {
  const bundle = useHomeLowerBundle();

  return (
    <>
      <TestimonialsSection bundle={bundle} />
      <GallerySection bundle={bundle} />
      <CorporateSection title={bundle.sections.corporateTitle} />
      <ExploreVietnamSection destinations={destinations} bundle={bundle} />
      <ViVuNuocNgoaiHandbookNewsSection destinations={destinations} bundle={bundle} />
    </>
  );
}
