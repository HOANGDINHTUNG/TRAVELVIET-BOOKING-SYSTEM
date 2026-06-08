import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
const COMBO_HERO_IMAGE =
  "https://images.unsplash.com/photo-1571895249887-ef9e10e86593?auto=format&fit=crop&w=1920&q=85";

export function ComboCatalogHero() {
  const { t } = useTranslation("translation", { keyPrefix: "combosPage" });

  return (
    <section className="cc-hero" aria-labelledby="cc-hero-title">
      <img
        className="cc-hero__bg"
        src={COMBO_HERO_IMAGE}
        alt=""
        width={1920}
        height={400}
        loading="eager"
      />
      <div className="cc-hero__overlay" aria-hidden />
      <div className="cc-hero__content">
        <nav
          className="cc-hero__breadcrumb"
          aria-label={t("catalog.breadcrumbAria")}
        >
          <Link to="/">{t("catalog.heroBreadcrumbTravel")}</Link>
          <span aria-hidden>/</span>
          <span className="cc-hero__breadcrumb-current">
            {t("catalog.heroBreadcrumbCurrent")}
          </span>
        </nav>
        <h1 id="cc-hero-title" className="cc-hero__title">
          {t("catalog.heroTitle")}
        </h1>
      </div>
    </section>
  );
}
