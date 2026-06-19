import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  MapPin,
  Phone,
  ChevronDown,
  ChevronUp,
  Expand,
  Plane,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import type { ReactNode } from "react";
import type { TourResponse } from "../../types/publicTour";
import { OptimizedImage } from "@/components/common/media/OptimizedImage";
import { formatCurrencyVnd } from "@/utils/currency";
import { TOUR_SCHEDULES_ANCHOR_ID } from "./tourPublicDetailConstants";
import {
  resolveEsgScore,
  resolveLeiScore,
} from "../../utils/tourSustainability";
import TourItineraryTimeline from "../TourItineraryTimeline";

// Simple Accordion Component
function Accordion({
  title,
  content,
  titleClassName = "font-semibold text-[var(--color-heading)]",
}: {
  title: string;
  content?: string;
  titleClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!content || content.trim() === "") return null;

  return (
    <div className="border-b border-[var(--color-border)] last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left hover:opacity-80 transition-opacity"
      >
        <span className={titleClassName}>{title}</span>
        {isOpen ? (
          <ChevronUp size={20} className="text-[#00b2d6]" />
        ) : (
          <ChevronDown size={20} className="text-[#00b2d6]" />
        )}
      </button>
      {isOpen && (
        <div
          className="pb-4 text-sm text-[var(--color-text)] leading-relaxed overflow-hidden custom-scrollbar"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}

type TourPublicDetailShellProps = {
  tour: TourResponse;
  scheduleSelector: ReactNode;
  selectedDate?: string | null;
  selectedScheduleCode?: string | null;
  selectedRemainingSeats?: number | null;
  onClearDate?: () => void;
  onCheckout?: () => void;
};

export function TourPublicDetailShell({
  tour,
  scheduleSelector,
  selectedDate,
  selectedScheduleCode,
  selectedRemainingSeats,
  onClearDate,
  onCheckout,
}: TourPublicDetailShellProps) {
  const locationState =
    (useLocation().state as { fromDestinationName?: string }) || {};
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const mediaImages = (tour.media || [])
    .filter((m) => m.mediaUrl)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map((m) => m.mediaUrl!);

  if (mediaImages.length === 0) {
    mediaImages.push(
      "https://images.unsplash.com/photo-1542314831-c6a4d14d8373?auto=format&fit=crop&q=80&w=800",
    );
  }

  const displayPrice = tour.basePrice || 8990000;
  const title = tour.name || "—";
  const firstDest = tour.destinations?.[0];
  const destination = firstDest
    ? [firstDest.name, firstDest.province].filter(Boolean).join(", ")
    : "Vietnam";

  const esg = resolveEsgScore(tour);
  const lei = resolveLeiScore(tour);

  return (
    <div className=" min-h-screen font-sans">
      <main className="max-w-[1240px] mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-[13px] md:text-sm font-medium text-[var(--color-muted)] mb-6 overflow-hidden flex-wrap gap-y-2">
          <Link
            to="/"
            className="hover:text-[#00b2d6] transition-colors whitespace-nowrap"
          >
            Trang chủ
          </Link>
          <ChevronRight
            size={14}
            className="mx-1.5 md:mx-2 shrink-0 text-slate-400 dark:text-slate-600"
          />

          {(() => {
            const destinations = tour.destinations || [];
            const matchedDest = locationState.fromDestinationName
              ? destinations.find(
                  (d) => d.name === locationState.fromDestinationName,
                )
              : undefined;
            const displayDest = matchedDest || destinations[0];

            if (displayDest) {
              const bRootLabel =
                displayDest.countryCode === "VN" ? "Việt Nam" : "Quốc Tế";
              const scopeQuery =
                displayDest.countryCode === "VN"
                  ? "?domesticOnly=true"
                  : "?internationalOnly=true";
              const keywordQuery = displayDest.name
                ? `&keyword=${encodeURIComponent(displayDest.name)}`
                : "";
              return (
                <div className="contents">
                  <Link
                    to={`/tours${scopeQuery}`}
                    className="hover:text-[#00b2d6] transition-colors whitespace-nowrap"
                  >
                    {bRootLabel}
                  </Link>
                  <ChevronRight
                    size={14}
                    className="mx-1.5 md:mx-2 shrink-0 text-slate-400 dark:text-slate-600"
                  />
                  <Link
                    to={`/tours${scopeQuery}${keywordQuery}`}
                    className="hover:text-[#00b2d6] transition-colors whitespace-nowrap"
                  >
                    {displayDest.name}
                  </Link>
                  <ChevronRight
                    size={14}
                    className="mx-1.5 md:mx-2 shrink-0 text-slate-400 dark:text-slate-600"
                  />
                </div>
              );
            }
            return (
              <div className="contents">
                <Link
                  to="/tours"
                  className="hover:text-[#00b2d6] transition-colors whitespace-nowrap"
                >
                  Tour trọn gói
                </Link>
                <ChevronRight
                  size={14}
                  className="mx-1.5 md:mx-2 shrink-0 text-slate-400 dark:text-slate-600"
                />
              </div>
            );
          })()}

          <span
            className="text-[#00b2d6] truncate max-w-[200px] md:max-w-[400px]"
            title={title}
          >
            {title}
          </span>
        </nav>

        {/* Hero Image Section */}
        <section className="relative h-[250px] sm:h-[350px] md:h-[450px] rounded-[24px] overflow-hidden mb-8 group bg-slate-900">
          {mediaImages.length >= 3 ? (
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-full w-full">
              {mediaImages.slice(0, 3).map((url, idx) => {
                const isMain = idx === activeMediaIndex;
                return (
                  <motion.div
                    layout
                    key={url}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`relative overflow-hidden cursor-pointer ${
                      isMain
                        ? "col-span-3 row-span-2 order-first"
                        : "col-span-1 row-span-1"
                    }`}
                  >
                    <OptimizedImage
                      src={url}
                      alt={`${title} - Photo ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </motion.div>
                );
              })}
            </div>
          ) : mediaImages.length === 2 ? (
            <div className="grid grid-cols-2 gap-2 h-full w-full">
              <div className="relative h-full overflow-hidden">
                <OptimizedImage
                  src={mediaImages[0]}
                  alt={`${title} - Photo 1`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="relative h-full overflow-hidden">
                <OptimizedImage
                  src={mediaImages[1]}
                  alt={`${title} - Photo 2`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          ) : (
            <OptimizedImage
              src={mediaImages[0]}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          )}

          {/* Expand icon bottom right */}
          <button
            title="Xem thêm ảnh"
            className="absolute bottom-4 right-4 bg-[var(--glass-bg-solid)] backdrop-blur-md px-4 py-2.5 rounded-full text-[var(--color-heading)] hover:bg-[var(--glass-bg-solid)] hover:text-blue-600 transition-colors shadow-md flex items-center gap-2 font-bold text-sm"
          >
            <Expand size={18} />
            <span className="hidden sm:inline">
              Xem {mediaImages.length} ảnh
            </span>
          </button>
        </section>

        {/* Layout Container: Left (Info) vs Right (Sticky Box) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column */}
          <div className="flex-1 w-full space-y-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-heading)] leading-tight">
              {title}
            </h1>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)] font-medium -mt-4">
              {/* Rating Badge */}
              <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                <span className="bg-[#429E4C] text-white px-2 py-0.5 rounded text-[13px] font-bold">
                  {(tour.averageRating ?? 10.0).toFixed(1)}
                </span>
                <span className="text-[#429E4C] font-semibold">Tuyệt vời</span>
                <span className="text-[13.5px]">
                  {tour.totalReviews ?? 3} đánh giá
                </span>
                <ChevronDown className="w-4 h-4 ml-0.5 text-slate-400" />
              </div>

              <div className="hidden sm:block w-[1px] h-3.5 bg-slate-200"></div>

              {/* Departure */}
              {tour.primaryDepartureCity && (
                <>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Plane className="w-4 h-4 text-[#00b2d6]" />
                    <span>Khởi hành từ: {tour.primaryDepartureCity}</span>
                  </div>
                  <div className="hidden sm:block w-[1px] h-3.5 bg-slate-200"></div>
                </>
              )}

              {/* Tour Code */}
              <div className="flex items-center gap-1.5 text-slate-600">
                <Calendar className="w-4 h-4 text-[#00b2d6]" />
                <span>Mã Tour: {tour.code}</span>
              </div>
            </div>

            {/* Grid 4 cards like Image 1 - Thông tin thêm */}
            <div>
              <h2 className="text-xl font-bold text-[var(--color-heading)] mb-4 items-center">
                Thông tin thêm về chuyến đi
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[var(--glass-bg-solid)] p-4 rounded-2xl shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-[var(--color-border)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="text-blue-500 mb-2 flex items-center font-bold text-sm relative z-10">
                    <span className="mr-2 text-lg">📍</span> Điểm tham quan
                  </div>
                  <div
                    className="text-xs text-[var(--color-muted)] leading-relaxed font-medium relative z-10 truncate"
                    title={destination}
                  >
                    {destination}
                  </div>
                </div>
                <div className="bg-[var(--glass-bg-solid)] p-4 rounded-2xl shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-[var(--color-border)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="text-blue-500 mb-2 flex items-center font-bold text-sm relative z-10">
                    <span className="mr-2 text-lg">🍽️</span> Ẩm thực
                  </div>
                  <div className="text-xs text-[var(--color-muted)] leading-relaxed font-medium relative z-10">
                    Buffet sáng, Theo thực đơn
                  </div>
                </div>
                <div className="bg-[var(--glass-bg-solid)] p-4 rounded-2xl shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-[var(--color-border)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="text-blue-500 mb-2 flex items-center font-bold text-sm relative z-10">
                    <span className="mr-2 text-lg">📅</span> Thời gian lý tưởng
                  </div>
                  <div className="text-xs text-[var(--color-muted)] leading-relaxed font-medium relative z-10">
                    Quanh năm
                  </div>
                </div>
                <div className="bg-[var(--glass-bg-solid)] p-4 rounded-2xl shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-[var(--color-border)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="text-blue-500 mb-2 flex items-center font-bold text-sm relative z-10">
                    <span className="mr-2 text-lg">✈️</span> Phương tiện
                  </div>
                  <div className="text-xs text-[var(--color-muted)] leading-relaxed font-medium relative z-10">
                    {tour.transportType || "Máy bay, Xe du lịch"}
                  </div>
                </div>
                <div className="bg-[var(--glass-bg-solid)] p-4 rounded-2xl shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-[var(--color-border)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="text-blue-500 mb-2 flex items-center font-bold text-sm relative z-10">
                    <span className="mr-2 text-lg">🎁</span> Khuyến mãi
                  </div>
                  <div className="text-xs text-[var(--color-muted)] leading-relaxed font-medium relative z-10">
                    Đã bao gồm ưu đãi trong giá tour
                  </div>
                </div>
              </div>
            </div>

            {/* Highlights & Map */}
            <div className="flex flex-col gap-6">
              {/* Điểm Nổi Bật Tour */}
              <div className="bg-[var(--glass-bg-solid)] rounded-2xl p-6 shadow-sm border border-[var(--color-border)] flex flex-col">
                <h2 className="text-xl font-bold text-[#00b2d6] mb-5">
                  Điểm Nổi Bật Tour
                </h2>
                <div className="flex flex-col gap-3">
                  {(
                    tour.highlights ||
                    tour.description ||
                    "Chưa có bài viết giới thiệu."
                  )
                    .replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, "\n")
                    .split("\n")
                    .map((line) => line.trim())
                    .filter((line) => line.length > 0 && line !== "-")
                    .map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <CheckCircle2
                          className="w-[18px] h-[18px] text-[#00b2d6] shrink-0 mt-0.5"
                          strokeWidth={2.5}
                        />
                        <span className="text-[14.5px] text-slate-700 leading-relaxed font-medium">
                          {item}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Bản Đồ Lịch Trình */}
              <div className="bg-[var(--glass-bg-solid)] rounded-2xl p-6 shadow-sm border border-[var(--color-border)] flex flex-col">
                <h2 className="text-xl font-bold text-[#00b2d6] mb-5">
                  Bản Đồ Lịch Trình
                </h2>
                <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      tour.destinations && tour.destinations.length > 0
                        ? tour.destinations
                            .map((d) =>
                              [d.name, d.province].filter(Boolean).join(", "),
                            )
                            .join(" đi ")
                        : "Vietnam",
                    )}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen
                    aria-hidden="false"
                    tabIndex={0}
                  />
                </div>
                <div className="text-center mt-4 text-[13px] text-slate-500 font-medium">
                  Lộ trình tham quan chính của tour (có thể thay đổi linh hoạt
                  theo điều kiện thực tế)
                </div>
              </div>
            </div>

            {/* Chương trình tour (Itinerary) */}
            {Array.isArray(tour.itineraryDays) &&
              tour.itineraryDays.length > 0 && (
                <div className="pt-2">
                  <TourItineraryTimeline tour={tour} />
                </div>
              )}

            {/* Inclusions & Exclusions */}
            <div className="flex flex-col gap-6 pt-6">
              <div className="bg-[var(--glass-bg-solid)] rounded-2xl shadow-sm border border-[var(--color-border)] px-6">
                <Accordion
                  title="Giá Tour Bao Gồm"
                  titleClassName="text-xl font-bold text-[#00b2d6]"
                  content={
                    tour.inclusions || "<p>Chưa có thông tin cập nhật.</p>"
                  }
                />
              </div>
              <div className="bg-[var(--glass-bg-solid)] rounded-2xl shadow-sm border border-[var(--color-border)] px-6">
                <Accordion
                  title="Giá Tour Không Bao Gồm"
                  titleClassName="text-xl font-bold text-[#00b2d6]"
                  content={
                    tour.exclusions || "<p>Giặt ủi, chi phí cá nhân.</p>"
                  }
                />
              </div>
            </div>

            {/* Lịch trình khởi hành (Schedules) injected from wrapper */}
            <div id={TOUR_SCHEDULES_ANCHOR_ID} className="bg-transparent pt-10">
              <h2 className="text-xl font-bold text-[var(--color-heading)] mb-6">
                Lịch trình khởi hành
              </h2>
              {scheduleSelector}
            </div>

            {/* Những thông tin cần lưu ý (Accordions) */}
            <div className="pt-6 pb-20">
              <h2 className="text-xl font-bold text-[var(--color-heading)] mb-6">
                Những thông tin cần lưu ý
              </h2>
              <div className="bg-[var(--glass-bg-solid)] rounded-2xl shadow-sm border border-[var(--color-border)] px-6">
                <Accordion
                  title="Lưu ý giá trẻ em"
                  content="<p>Dưới 2 tuổi: Miễn phí. 5-11 tuổi: 75% giá gốc. Trên 12: 100%.</p>"
                />
                <Accordion
                  title="Điều kiện áp dụng & Thanh toán"
                  content={
                    tour.notes ||
                    "<p>Áp dụng theo chính sách hiện hành của công ty.</p>"
                  }
                />
              </div>
            </div>
          </div>

          {/* Right Sticky Column */}
          <div className="w-full lg:w-[360px] shrink-0 sticky top-24 z-10 pb-20">
            <div className="bg-[var(--glass-bg-solid)] rounded-[24px] shadow-sm border border-[var(--color-border)] p-6 flex flex-col">
              {!selectedDate ? (
                /* Unselected State (Hình 1) */
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-[15px] font-medium text-[var(--color-text)]">
                      <span className="flex items-center gap-2">
                        <span className="text-[var(--color-muted)]">🎫</span> Mã
                        chương trình:
                      </span>
                      <span className="text-blue-600">
                        {tour.code?.split("-")[0] || "NDDNG2640"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[15px] font-medium text-[var(--color-text)]">
                      <span className="flex items-center gap-2">
                        <span className="text-[var(--color-muted)]">⏱</span>{" "}
                        Thời gian:
                      </span>
                      <span className="text-blue-600">
                        {tour.durationDays} ngày {tour.durationNights} đêm
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-4 mt-2">
                    <div className="flex items-end gap-2 w-full">
                      <span className="text-[13px] text-[var(--color-muted)] mb-1">
                        Giá từ:
                      </span>
                      <span className="text-2xl font-bold text-blue-700">
                        {formatCurrencyVnd(displayPrice)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 w-full">
                      <button
                        title="Gọi điện"
                        className="w-12 h-12 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center transition-colors shrink-0 shadow-sm"
                      >
                        <Phone size={20} />
                      </button>
                      <button
                        className="bg-[#e11d27] hover:bg-red-700 text-white font-bold h-12 flex-1 text-base rounded-full transition-colors shadow-sm"
                        onClick={() =>
                          document
                            .getElementById(TOUR_SCHEDULES_ANCHOR_ID)
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            })
                        }
                      >
                        Chọn ngày
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Selected State (Hình 2) */
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[var(--color-muted)]">
                        Giá:
                      </span>
                      <span className="text-2xl font-bold text-blue-700">
                        {formatCurrencyVnd(displayPrice)}
                      </span>
                    </div>
                    <button
                      onClick={onClearDate}
                      title="Hủy chọn ngày"
                      className="bg-blue-100 hover:bg-blue-200 text-blue-600 text-[13px] px-4 py-2 rounded-full flex items-center font-bold transition-colors cursor-pointer"
                    >
                      {selectedDate}{" "}
                      <span className="ml-2 text-[var(--color-muted)]">✏️</span>
                    </button>
                  </div>

                  <div className="space-y-4 mb-6 pb-6 border-b border-t border-[var(--color-border)] py-6 text-[14px]">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[var(--color-text)] font-medium">
                      <span className="flex items-center gap-2">
                        <span className="text-[var(--color-muted)] font-serif">
                          🎫
                        </span>{" "}
                        Mã chuyến:
                      </span>
                      <span className="text-blue-600 sm:text-right mt-1 sm:mt-0 max-w-[200px] truncate">
                        {selectedScheduleCode || tour.code || "NDDNG2640-007"}
                      </span>
                    </div>
                    <div className="flex justify-between text-[var(--color-text)] font-medium">
                      <span className="flex items-center gap-2">
                        <MapPin
                          size={16}
                          className="text-[var(--color-muted)]"
                        />{" "}
                        Khởi hành:
                      </span>
                      <span className="text-blue-600 truncate max-w-[120px]">
                        {tour.primaryDepartureCity || "Đà Nẵng"}
                      </span>
                    </div>
                    <div className="flex justify-between text-[var(--color-text)] font-medium">
                      <span className="flex items-center gap-2">
                        <span className="text-[var(--color-muted)]">⏱</span>{" "}
                        Thời gian:
                      </span>
                      <span className="text-blue-600">
                        {tour.durationDays} ngày {tour.durationNights} đêm
                      </span>
                    </div>
                    {selectedRemainingSeats != null && (
                      <div className="flex justify-between text-[var(--color-text)] font-medium">
                        <span className="flex items-center gap-2">
                          <span className="text-[var(--color-muted)]">👤</span>{" "}
                          Số chỗ còn:
                        </span>
                        <span className="text-blue-600">
                          Còn {selectedRemainingSeats} chỗ
                        </span>
                      </div>
                    )}
                    {(esg != null || lei != null) && (
                      <div className="flex justify-between text-[var(--color-text)] font-medium">
                        <span className="flex items-center gap-2">
                          <span className="text-[var(--color-muted)]">♻️</span>{" "}
                          Chỉ số:
                        </span>
                        <span className="text-blue-700">
                          {lei != null ? `LEI: ${lei}/100` : ""}
                          {lei != null && esg != null ? " | " : ""}
                          {esg != null ? `ESG: ${esg}/100` : ""}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      title="Gọi điện"
                      className="w-12 h-12 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center transition-colors shrink-0 shadow-sm"
                    >
                      <Phone size={20} />
                    </button>
                    <button
                      className="flex-1 bg-[#e11d27] hover:bg-red-700 text-white font-bold h-12 rounded-full transition-colors shadow-sm text-base"
                      onClick={() => {
                        if (onCheckout) {
                          onCheckout();
                        } else {
                          document
                            .getElementById(TOUR_SCHEDULES_ANCHOR_ID)
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                        }
                      }}
                    >
                      Đặt ngay
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
