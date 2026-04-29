import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { tourApi } from "../../../api/server/Tour.api";
import { PageLoader } from "../../../components/common/ux/PageLoader";
import { ErrorBlock } from "../../../components/common/ui/ErrorBlock";
import { Footer } from "../../../components/Footer/Footer";
import type {
  BackendTour,
  BackendTourSchedule,
} from "../../home/database/interface/publicTravel";
import { TourBookingCta } from "../components/TourBookingCta";
import { TourDetailHero } from "../components/TourDetailHero";
import { TourFactsSection } from "../components/TourFactsSection";
import { TourItinerarySection } from "../components/TourItinerarySection";
import { TourMediaSection } from "../components/TourMediaSection";
import { TourOverviewSection } from "../components/TourOverviewSection";
import { TourPolicySection } from "../components/TourPolicySection";
import { TourScheduleSection } from "../components/TourScheduleSection";
import {
  getTourDetailLocale,
  tourDetailCopyByLocale,
} from "../utils/tourDetailCopy";
import { getErrorMessage } from "../utils/tourDetailFormatters";
import { createTourDetailViewModel } from "../utils/tourDetailViewModel";
import "../styles/TourDetailPage.css";

export default function TourDetailPage() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const locale = getTourDetailLocale(i18n.language);
  const copy = tourDetailCopyByLocale[locale];
  const [tour, setTour] = useState<BackendTour | null>(null);
  const [schedules, setSchedules] = useState<BackendTourSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) {
        setError(copy.missingTour);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const numericId = Number(id);
        const tourData = await tourApi.getTourById(id);
        const scheduleData = Number.isFinite(numericId)
          ? await tourApi.getTourSchedules(numericId).catch((scheduleError) => {
              console.error("Error loading tour schedules:", scheduleError);
              return [];
            })
          : [];
        setTour(tourData);
        setSchedules(scheduleData);
      } catch (err) {
        console.error("Error loading tour data:", err);
        setError(getErrorMessage(err, copy.loadError));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [copy.loadError, copy.missingTour, id]);

  const viewModel = useMemo(() => {
    if (!tour) {
      return null;
    }

    return createTourDetailViewModel(tour, copy, locale);
  }, [copy, locale, tour]);

  if (loading) {
    return <PageLoader label={copy.loading} />;
  }

  if (error || !tour || !viewModel) {
    return (
      <div className="tour-detail-error p-8">
        <Link to="/" className="tour-detail-back-link">
          <ArrowLeft size={20} />
          {copy.backHome}
        </Link>
        <ErrorBlock
          title={copy.detailErrorTitle}
          message={error || copy.missingTour}
        />
      </div>
    );
  }

  return (
    <div className="tour-detail-page">
      <main className="tour-detail-container">
        <div className="tour-detail-nav-bar">
          <Link to="/" className="tour-detail-back-link">
            <ArrowLeft size={20} />
            <span>{copy.backHome}</span>
          </Link>
        </div>

        <TourDetailHero tour={tour} viewModel={viewModel} copy={copy} />

        <div className="tour-detail-content-wrap">
          <TourOverviewSection tour={tour} viewModel={viewModel} copy={copy} />
          <TourFactsSection viewModel={viewModel} copy={copy} />
          <TourScheduleSection
            schedules={schedules}
            copy={copy}
            locale={locale}
            currency={tour.currency}
          />
          <TourItinerarySection tour={tour} copy={copy} />
          <TourMediaSection viewModel={viewModel} copy={copy} />
          <TourPolicySection tour={tour} copy={copy} />
          <TourBookingCta tour={tour} copy={copy} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
