import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Footer } from "../../../components/Footer/Footer";
import { EmptyState } from "../../../components/common/ui/EmptyState";
import { ErrorBlock } from "../../../components/common/ui/ErrorBlock";
import { PageLoader } from "../../../components/common/ux/PageLoader";
import BannerHome, {
  type BannerSlide,
} from "../../../components/hero/BannerHome";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { buildTourSlug } from "../../tours/utils/slug";
import { HomeSearchBar } from "../components/HomeSearchBar/HomeSearchBar";
import { HomeServicesRow } from "../components/HomeServicesRow/HomeServicesRow";
import { LatestPromotionsSection } from "../components/Promotions/LatestPromotionsSection";
import { TourHotSection } from "../components/TourHotSection/TourHotSection";
import { HomeTourRows } from "../components/HomeTourRows/HomeTourRows";
import { HomeLowerSections } from "../components/HomeLowerSections/HomeLowerSections";
import {
  fetchHomePublicData,
  selectHome,
} from "../store/homeSlice";

function HomePage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    destinations,
    tours,
    toursDomesticBeach,
    toursInternationalHot,
    loading,
    error,
  } = useAppSelector(selectHome);

  const [stalled, setStalled] = useState(false);
  const stallTimer = useRef<number | null>(null);

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
  ]);

  const handleRetry = () => {
    setStalled(false);
    void dispatch(fetchHomePublicData());
  };

  const heroTours = useMemo(
    () => tours.filter((item) => Boolean(item.image)),
    [tours],
  );

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

  if (loading && destinations.length === 0 && tours.length === 0) {
    if (stalled) {
      return (
        <>
          <EmptyState
            title="Backend chưa mở hoặc API không phản hồi"
            message="Bạn hãy bật backend rồi bấm Thử lại. (Mặc định web gọi http://localhost:8088/api/v1)"
            actionLabel="Thử lại"
            onAction={handleRetry}
          />
          <Footer />
        </>
      );
    }

    return (
      <>
        <PageLoader />
        <Footer />
      </>
    );
  }

  if (error && destinations.length === 0 && tours.length === 0) {
    return (
      <>
        <ErrorBlock
          message={error}
          actionLabel="Thử lại"
          onAction={handleRetry}
        />
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
          title="Chưa có ảnh tour từ backend."
          message="Kiểm tra mediaUrl trong response GET /tours."
        />
      )}

      <HomeSearchBar />
      <HomeServicesRow />
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
      <HomeLowerSections destinations={destinations} />
      <Footer />
    </>
  );
}

export default HomePage;
