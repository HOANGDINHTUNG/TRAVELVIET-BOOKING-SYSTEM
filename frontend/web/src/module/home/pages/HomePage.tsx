import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Footer } from "../../../components/Footer/Footer";
import { EmptyState } from "../../../components/common/ui/EmptyState";
import BannerHome, {
  type BannerSlide,
} from "../../../components/hero/BannerHome";
import { HomePageSkeleton } from "../../../components/ui/skeletons/HomeSkeletons";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { buildTourSlug } from "../../tours/utils/slug";
import { HomeSearchBar } from "../components/HomeSearchBar/HomeSearchBar";
import { HomeServicesRow } from "../components/HomeServicesRow/HomeServicesRow";
import { LastMinuteDealsSection } from "../components/LastMinuteDeals/LastMinuteDealsSection";
import { LatestPromotionsSection } from "../components/Promotions/LatestPromotionsSection";
import { TourHotSection } from "../components/TourHotSection/TourHotSection";
import { HomeTourRows } from "../components/HomeTourRows/HomeTourRows";
import { HomeLowerSections } from "../components/HomeLowerSections/HomeLowerSections";
import {
  fetchHomePublicData,
  selectHome,
} from "../store/homeSlice";
import { LazyWhenVisible } from "../../../components/common/ux/LazyWhenVisible";

function HomePage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    destinations,
    tours,
    toursDomesticBeach,
    toursInternationalHot,
    toursLastMinuteDeals,
    loading,
    error,
  } = useAppSelector(selectHome);

  const [stalled, setStalled] = useState(false);
  const stallTimer = useRef<number | null>(null);
  const notifiedStalled = useRef(false);
  const notifiedError = useRef(false);

  useEffect(() => {
    void dispatch(fetchHomePublicData());
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      setStalled(false);
      if (stallTimer.current) {
        window.clearTimeout(stallTimer.current);
        stallTimer.current = null;
      }
      return;
    }

    if (
      destinations.length > 0 ||
      tours.length > 0 ||
      toursDomesticBeach.length > 0 ||
      toursInternationalHot.length > 0 ||
      toursLastMinuteDeals.length > 0 ||
      error
    ) {
      return;
    }

    if (stallTimer.current) window.clearTimeout(stallTimer.current);
    stallTimer.current = window.setTimeout(() => setStalled(true), 3500);

    return () => {
      if (stallTimer.current) {
        window.clearTimeout(stallTimer.current);
        stallTimer.current = null;
      }
    };
  }, [
    destinations.length,
    error,
    loading,
    tours.length,
    toursDomesticBeach.length,
    toursInternationalHot.length,
    toursLastMinuteDeals.length,
  ]);

  useEffect(() => {
    if (!stalled) {
      notifiedStalled.current = false;
      return;
    }
    if (notifiedStalled.current) return;
    notifiedStalled.current = true;
    toast.warning(t("homePage.status.backendOfflineTitle"));
  }, [stalled, t]);

  useEffect(() => {
    const hasNoInitialData = destinations.length === 0 && tours.length === 0;
    if (!(error && hasNoInitialData)) {
      notifiedError.current = false;
      return;
    }
    if (notifiedError.current) return;
    notifiedError.current = true;
    toast.error(error);
  }, [destinations.length, error, tours.length]);

  const handleRetry = () => {
    setStalled(false);
    void dispatch(fetchHomePublicData());
  };

  const heroTours = useMemo(
    () => tours.filter((item) => Boolean(item.image)),
    [tours],
  );

  const firstHeroImage = heroTours[0]?.image;

  useEffect(() => {
    if (!firstHeroImage) return undefined;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = firstHeroImage;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [firstHeroImage]);

  const bannerSlides = useMemo<BannerSlide[]>(() => {
    return heroTours.slice(0, 6).map((tour) => {
      const destinationLabel = (tour.location || "").trim();
      const durationLabel = (tour.days || "").trim();
      const place = `${destinationLabel || "VIETNAM"}${
        durationLabel ? ` • ${durationLabel}` : ""
      }`;
      const slugSource = (tour.title || "").toLowerCase();
      const detailPath = `/tour/${buildTourSlug(slugSource, tour.id)}`;
      const teaserHighlights =
        Array.isArray(tour.highlights) && tour.highlights.length
          ? tour.highlights.slice(0, 3).join(" • ")
          : "";
      const short = (tour.shortDescription || "").trim();
      const longBody = (tour.description || "").trim();
      const description =
        short ||
        (longBody.length > 220
          ? teaserHighlights || `${longBody.slice(0, 200).trim()}…`
          : longBody) ||
        teaserHighlights ||
        t("homePage.defaultBannerTeaser");

      return {
        place,
        title: tour.title,
        subtitle: tour.category || tour.location || t("homePage.bannerSubtitleFallback"),
        description,
        image: tour.image,
        detailPath,
      };
    });
  }, [heroTours, t]);

  if ((loading && destinations.length === 0 && tours.length === 0) || (error && destinations.length === 0 && tours.length === 0)) {
    return (
      <>
        <HomePageSkeleton />
        <Footer />
      </>
    );
  }

  return (
    <>
      {heroTours.length > 0 ? (
        <BannerHome slides={bannerSlides} ctaLabel={t("homePage.bannerCta")} />
      ) : (
        <EmptyState
          title={t("homePage.status.emptyImagesTitle")}
          message={t("homePage.status.emptyImagesMessage")}
        />
      )}

      <HomeSearchBar />
      <HomeServicesRow />
      <LastMinuteDealsSection tours={toursLastMinuteDeals} loading={loading} />
      <LatestPromotionsSection />
      <TourHotSection
        destinations={destinations}
        tours={tours}
        loading={loading}
      />
      <HomeTourRows
        domesticTours={toursDomesticBeach}
        internationalTours={toursInternationalHot}
        loading={loading}
      />
      <LazyWhenVisible minHeight={420}>
        <HomeLowerSections destinations={destinations} />
      </LazyWhenVisible>
      <Footer />
    </>
  );
}

export default HomePage;
