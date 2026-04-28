import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { tourApi } from "../../../api/server/Tour.api";
import { PageLoader } from "../../../components/common/ux/PageLoader";
import { ErrorBlock } from "../../../components/common/ui/ErrorBlock";
import { Footer } from "../../../components/Footer/Footer";
import type {
  BackendTour,
  BackendTourSchedule,
} from "../../home/database/interface/publicTravel";
import { useTranslation } from "react-i18next";
import { TourDetailHero } from "../components/TourDetailHero";
import { TourOverviewSection } from "../components/TourOverviewSection";
import { TourItinerarySection } from "../components/TourItinerarySection";
import { TourPolicySection } from "../components/TourPolicySection";
import { TourScheduleSection } from "../components/TourScheduleSection";
import "../styles/TourDetailPage.css";

export default function TourDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [tour, setTour] = useState<BackendTour | null>(null);
  const [schedules, setSchedules] = useState<BackendTourSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setLoading(true);
      try {
        const [tourData, scheduleData] = await Promise.all([
          tourApi.getTourById(id),
          tourApi.getTourSchedules(Number(id)),
        ]);
        setTour(tourData);
        setSchedules(scheduleData);
      } catch (err) {
        console.error("Error loading tour data:", err);
        setError("Không thể tải thông tin tour. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <PageLoader label="Đang tải thông tin tour..." />;

  if (error || !tour) {
    return (
      <div className="error-container p-8">
        <Link
          to="/"
          className="flex items-center gap-2 mb-4 text-emerald-600 font-medium"
        >
          <ArrowLeft size={20} />
          Quay lại trang chủ
        </Link>
        <ErrorBlock title="Lỗi" message={error || "Không tìm thấy tour"} />
      </div>
    );
  }

  return (
    <div className="tour-detail-page">
      <main className="tour-detail-container">
        <div className="tour-detail-nav-bar">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            <span>{t("common.backHome") || "Quay lại"}</span>
          </Link>
        </div>

        <TourDetailHero tour={tour} />

        <div className="tour-detail-content-wrap hover-garden-theme">
          <TourScheduleSection schedules={schedules} />
          <TourOverviewSection tour={tour} />
          <TourItinerarySection tour={tour} />
          <TourPolicySection tour={tour} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
