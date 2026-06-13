import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { handleApiError } from "../../../lib/handleApiError";
import { selectIsAuthenticated, useAuthStore } from "../../../stores/authStore";
import { toast } from "sonner";
import { tourCheckoutStorage } from "../lib/tourCheckoutStorage";
import {
  usePublicTourSchedulesQuery,
  useTourDetailQuery,
} from "../hooks/usePublicTours";
import { extractTourIdFromSlug } from "../utils/slug";
import {
  isScheduleStillBookable,
  pickDefaultBookableSchedule,
} from "../utils/tourScheduleSelection";
import { Footer } from "../../../components/Footer/Footer";
import TourScheduleSelector from "../components/TourScheduleSelector";
import BookingPanel from "../components/BookingPanel";
import { TourPublicDetailShell } from "../components/public-detail/TourPublicDetailShell";
import { TourPublicDetailSkeleton } from "../components/public-detail/TourPublicDetailSkeleton";
import type { TourScheduleResponse } from "../types/publicTour";
import "../styles/TourPublicDetailPage.css";

/**
 * Trang chi tiết Tour PUBLIC — layout tối ưu đặt tour + hình ảnh.
 * URL: `/tour/:slug`
 */
function TourPublicDetailPage() {
  const { t } = useTranslation("tours");
  const prefersReducedMotion = useReducedMotion();
  const params = useParams<{ slug: string }>();
  const tourId = extractTourIdFromSlug(params.slug);

  const tourQuery = useTourDetailQuery(tourId);
  const schedulesQuery = usePublicTourSchedulesQuery(tourId);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const navigate = useNavigate();

  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    setSelectedScheduleId(null);
  }, [tourId]);

  useEffect(() => {
    if (schedulesQuery.isPending) return;
    const schedules = schedulesQuery.data ?? [];
    if (schedules.length === 0) {
      setSelectedScheduleId(null);
      return;
    }
    setSelectedScheduleId((prev) => {
      if (prev != null && isScheduleStillBookable(prev, schedules)) {
        return prev;
      }
      return pickDefaultBookableSchedule(schedules)?.id ?? null;
    });
  }, [schedulesQuery.data, schedulesQuery.isPending]);

  const selectedSchedule = useMemo<TourScheduleResponse | null>(() => {
    if (selectedScheduleId == null) return null;
    return (
      (schedulesQuery.data ?? []).find((s) => s.id === selectedScheduleId) ??
      null
    );
  }, [schedulesQuery.data, selectedScheduleId]);

  if (tourId == null) {
    return <Navigate to="/tours" replace />;
  }

  if (tourQuery.isPending) {
    return (
      <>
        <TourPublicDetailSkeleton />
        <Footer />
      </>
    );
  }

  if (tourQuery.error || !tourQuery.data) {
    const errorMessage = tourQuery.error
      ? handleApiError(tourQuery.error, String(t("detail.errorMessage")))
      : String(t("detail.notFound"));
    return (
      <div className="tour-public-shell">
        <div className="tour-public-error mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">
            {String(t("detail.errorTitle"))}
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {errorMessage}
          </p>
          <Link
            to="/tours"
            className="tour-public-back mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            {String(t("detail.backToList"))}
          </Link>
        </div>
      </div>
    );
  }

  const tour = tourQuery.data;

  const selectedDateStr = selectedSchedule?.departureAt
    ? new Date(selectedSchedule.departureAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để đặt tour");
      const from = `${window.location.pathname}${window.location.search}`;
      navigate("/login", { state: { from } });
      return;
    }
    if (!selectedSchedule || !tour) return;

    tourCheckoutStorage.save({
      tourId: tour.id,
      tourTitle: tour.name || `Tour #${tour.id}`,
      scheduleId: selectedSchedule.id,
      scheduleCode: selectedSchedule.scheduleCode || tour.code || "TOUR-###",
      adultPrice: selectedSchedule.adultPrice || tour.basePrice || 0,
      childPrice: selectedSchedule.childPrice || 0,
      infantPrice: selectedSchedule.infantPrice || 0,
      departureAt: selectedSchedule.departureAt,
      primaryDepartureCity:
        selectedSchedule.meetingPointName ||
        tour.primaryDepartureCity ||
        "Hồ Chí Minh",
      adultCount: 1, // Start with default counts for the form
      childCount: 0,
      infantCount: 0,
      seniorCount: 0,
    });
    navigate("/tours/checkout");
  };

  const scheduleSelector = (
    <TourScheduleSelector
      schedules={schedulesQuery.data}
      isLoading={schedulesQuery.isPending}
      selectedId={selectedScheduleId}
      onSelect={(s) => setSelectedScheduleId(s.id)}
    />
  );

  return (
    <>
      <div className="tour-public-shell">
        <motion.section
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.32 }}
        >
          <TourPublicDetailShell
            tour={tour}
            scheduleSelector={scheduleSelector}
            selectedDate={selectedDateStr}
            selectedScheduleCode={selectedSchedule?.scheduleCode || null}
            onClearDate={() => setSelectedScheduleId(null)}
            onCheckout={handleCheckout}
          />
        </motion.section>
      </div>
      <Footer />
    </>
  );
}

export default TourPublicDetailPage;
