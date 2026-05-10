import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Footer } from "../../../components/Footer/Footer";
import { EmptyState } from "../../../components/common/ui/EmptyState";
import { ErrorBlock } from "../../../components/common/ui/ErrorBlock";
import { PageLoader } from "../../../components/common/ux/PageLoader";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { LoginWelcomeAnimation } from "../../auth/components/LoginWelcome/LoginWelcomeAnimation";
import { AboutSection } from "../components/About/AboutSection";
import { ContactSection } from "../components/Contact/ContactSection";
import { DestinationsSection } from "../components/Destinations/DestinationsSection";
import { Hero } from "../components/Hero/Hero";
import { PackagesSection } from "../components/Packages/PackagesSection";
import { PartnerMarquee } from "../components/PartnerMarquee/PartnerMarquee";
import { LatestPromotionsSection } from "../components/Promotions/LatestPromotionsSection";
import { HomeTourRows } from "../components/HomeTourRows/HomeTourRows";
import { TourHotSection } from "../components/TourHotSection/TourHotSection";
import { PersonalizedRecommendations } from "../components/Recommendations/PersonalizedRecommendations";
import { StorySection } from "../components/Story/StorySection";
import { CustomerTestimonialsSection } from "../components/Testimonials/CustomerTestimonialsSection";
import { TravelFilmSection } from "../components/TravelFilm/TravelFilmSection";
import {
  fetchHomePublicData,
  selectHome,
} from "../store/homeSlice";

function HomePage() {
  const dispatch = useAppDispatch();
  const {
    destinations,
    tours,
    toursDomesticBeach,
    toursInternationalHot,
    loading,
    error,
  } = useAppSelector(selectHome);
  const [selectedTour, setSelectedTour] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [stalled, setStalled] = useState(false);
  const stallTimer = useRef<number | null>(null);

  useEffect(() => {
    console.log(">>> HomePage Data:", { destinations, tours });
    destinations.forEach((d) => {
      if (d.image) console.log(`Destination ${d.name} image URL:`, d.image);
    });
    tours.forEach((t) => {
      if (t.image) console.log(`Tour ${t.title} image URL:`, t.image);
    });
  }, [destinations, tours]);

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

    if (stallTimer.current) {
      window.clearTimeout(stallTimer.current);
    }

    stallTimer.current = window.setTimeout(() => {
      setStalled(true);
    }, 3500);

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

  const selectedTourValue = useMemo(() => {
    if (tours.length === 0) {
      return "";
    }

    return selectedTour && tours.some((tour) => tour.title === selectedTour)
      ? selectedTour
      : tours[0].title;
  }, [selectedTour, tours]);

  const visibleTours = useMemo(() => {
    return tours.slice(0, 6);
  }, [tours]);

  const heroTours = useMemo(
    () => tours.filter((item) => Boolean(item.image)),
    [tours],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const handleSelectTour = (tourTitle: string) => {
    setSelectedTour(tourTitle);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

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
          <LoginWelcomeAnimation />
        </>
      );
    }

    return (
      <>
        <PageLoader />
        <Footer />
        <LoginWelcomeAnimation />
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
        <LoginWelcomeAnimation />
      </>
    );
  }

  return (
    <>
      {heroTours.length > 0 ? (
        <Hero tours={heroTours} />
      ) : (
        <EmptyState
          title="Chua co anh tour tu backend."
          message="Kiem tra mediaUrl trong response GET /tours."
        />
      )}
      <PartnerMarquee />
      <LatestPromotionsSection />
      <HomeTourRows
        domesticTours={toursDomesticBeach}
        internationalTours={toursInternationalHot}
        loading={loading}
      />
      <TourHotSection
        destinations={destinations}
        tours={tours}
        loading={loading}
      />
      <AboutSection />
      {destinations.length > 0 ? (
        <DestinationsSection destinations={destinations} />
      ) : (
        <EmptyState title="Danh sach diem den dang trong." />
      )}
      <TravelFilmSection />
      {visibleTours.length > 0 ? (
        <PackagesSection tours={visibleTours} onSelectTour={handleSelectTour} />
      ) : (
        <EmptyState
          title="Chua co tour phu hop."
          message="Kiem tra endpoint GET /tours hoac bo loc diem den hien tai."
        />
      )}
      <CustomerTestimonialsSection />
      <PersonalizedRecommendations />
      <StorySection />
      <ContactSection
        tours={tours}
        selectedTour={selectedTourValue}
        submitted={submitted}
        onTourChange={setSelectedTour}
        onSubmit={handleSubmit}
      />
      <Footer />
      <LoginWelcomeAnimation />
    </>
  );
}

export default HomePage;
