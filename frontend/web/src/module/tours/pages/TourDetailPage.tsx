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
import { TourBookingPanel } from "../components/TourBookingPanel";
import { TourDetailHero } from "../components/TourDetailHero";
import { TourEngagementPanel } from "../components/TourEngagementPanel";
import { TourFactsSection } from "../components/TourFactsSection";
import { TourItinerarySection } from "../components/TourItinerarySection";
import { TourMediaSection } from "../components/TourMediaSection";
import { TourOverviewSection } from "../components/TourOverviewSection";
import { TourPolicySection } from "../components/TourPolicySection";
import { TourReviewsSection } from "../components/TourReviewsSection";
import { TourScheduleDetailModal } from "../components/TourScheduleDetailModal";
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
  const [selectedSchedule, setSelectedSchedule] =
    useState<BackendTourSchedule | null>(null);
  const [bookingScheduleId, setBookingScheduleId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(false);
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

  const handleViewSchedule = async (schedule: BackendTourSchedule) => {
    if (!tour) {
      return;
    }

    setSelectedSchedule(schedule);
    setScheduleLoading(true);

    try {
      const detail = await tourApi.getTourSchedule(tour.id, schedule.id);
      setSelectedSchedule(detail);
    } catch (scheduleError) {
      console.error("Error loading schedule detail:", scheduleError);
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleSelectScheduleForBooking = (schedule: BackendTourSchedule) => {
    setBookingScheduleId(schedule.id);
    void handleViewSchedule(schedule);
  };

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
          <TourEngagementPanel tour={tour} copy={copy} />
          <TourOverviewSection tour={tour} viewModel={viewModel} copy={copy} />
          <TourFactsSection viewModel={viewModel} copy={copy} />
          <TourScheduleSection
            schedules={schedules}
            copy={copy}
            locale={locale}
            currency={tour.currency}
            onViewSchedule={handleSelectScheduleForBooking}
          />
          {schedules.length > 0 && (
            <TourBookingPanel
              tour={tour}
              schedules={schedules}
              selectedScheduleId={bookingScheduleId}
              copy={copy}
              locale={locale}
            />
          )}
          <TourItinerarySection tour={tour} copy={copy} />
          <TourReviewsSection tour={tour} copy={copy} />
          <TourMediaSection viewModel={viewModel} copy={copy} />
          <TourPolicySection tour={tour} copy={copy} />
          <TourBookingCta tour={tour} copy={copy} />
        </div>
        {selectedSchedule && (
          <TourScheduleDetailModal
            schedule={selectedSchedule}
            copy={{
              ...copy,
              scheduleDetailTitle: scheduleLoading
                ? copy.reviewsLoading
                : copy.scheduleDetailTitle,
            }}
            locale={locale}
            currency={tour.currency}
            onClose={() => setSelectedSchedule(null)}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
