import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  MapPin,
  Phone,
  ChevronDown,
  ChevronUp,
  Expand,
} from "lucide-react";
import type { ReactNode } from "react";
import type { TourResponse, PublicItineraryDay } from "../../types/publicTour";
import { OptimizedImage } from "@/components/common/media/OptimizedImage";
import { formatCurrencyVnd } from "@/utils/currency";
import { TOUR_SCHEDULES_ANCHOR_ID } from "./tourPublicDetailConstants";
import {
  resolveEsgScore,
  resolveLeiScore,
} from "../../utils/tourSustainability";

// Simple Accordion Component
function Accordion({ title, content }: { title: string; content?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!content || content.trim() === "") return null;

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left font-semibold text-slate-800 hover:text-blue-600 transition-colors"
      >
        {title}
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div
          className="pb-4 text-sm text-slate-600 leading-relaxed overflow-hidden custom-scrollbar"
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
  onClearDate?: () => void;
  onCheckout?: () => void;
};

export function TourPublicDetailShell({
  tour,
  scheduleSelector,
  selectedDate,
  selectedScheduleCode,
  onClearDate,
  onCheckout,
}: TourPublicDetailShellProps) {
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
  const destination =
    tour.destinations && tour.destinations.length > 0
      ? tour.destinations.map((d) => d.name).join(", ")
      : "Hạ Long, Bái Đính, Tràng An";

  const esg = resolveEsgScore(tour);
  const lei = resolveLeiScore(tour);

  return (
    <div className="bg-[#f5f8fa] min-h-screen font-sans">
      <main className="max-w-[1240px] mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm font-medium text-slate-500 mb-6 whitespace-nowrap overflow-hidden">
          <Link to="/" className="hover:text-blue-600">
            Du lịch
          </Link>
          <ChevronRight size={14} className="mx-2 shrink-0" />
          <Link to="/tours" className="hover:text-blue-600">
            Tour trọn gói
          </Link>
          <ChevronRight size={14} className="mx-2 shrink-0" />
          <span className="text-blue-600 truncate">{title}</span>
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
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full text-slate-800 hover:bg-white hover:text-blue-600 transition-colors shadow-md flex items-center gap-2 font-bold text-sm"
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
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
              {title}
            </h1>

            {/* Grid 4 cards like Image 1 - Thông tin thêm */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4 items-center">
                Thông tin thêm về chuyến đi
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50/50 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="text-blue-500 mb-2 flex items-center font-bold text-sm relative z-10">
                    <span className="mr-2 text-lg">📍</span> Điểm tham quan
                  </div>
                  <div
                    className="text-xs text-slate-500 leading-relaxed font-medium relative z-10 truncate"
                    title={destination}
                  >
                    {destination}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50/50 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="text-blue-500 mb-2 flex items-center font-bold text-sm relative z-10">
                    <span className="mr-2 text-lg">🍽️</span> Ẩm thực
                  </div>
                  <div className="text-xs text-slate-500 leading-relaxed font-medium relative z-10">
                    Buffet sáng, Theo thực đơn
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50/50 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="text-blue-500 mb-2 flex items-center font-bold text-sm relative z-10">
                    <span className="mr-2 text-lg">📅</span> Thời gian lý tưởng
                  </div>
                  <div className="text-xs text-slate-500 leading-relaxed font-medium relative z-10">
                    Quanh năm
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50/50 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="text-blue-500 mb-2 flex items-center font-bold text-sm relative z-10">
                    <span className="mr-2 text-lg">✈️</span> Phương tiện
                  </div>
                  <div className="text-xs text-slate-500 leading-relaxed font-medium relative z-10">
                    {tour.transportType || "Máy bay, Xe du lịch"}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50/50 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="text-blue-500 mb-2 flex items-center font-bold text-sm relative z-10">
                    <span className="mr-2 text-lg">🎁</span> Khuyến mãi
                  </div>
                  <div className="text-xs text-slate-500 leading-relaxed font-medium relative z-10">
                    Đã bao gồm ưu đãi trong giá tour
                  </div>
                </div>
              </div>
            </div>

            {/* Giới thiệu & Vị trí - 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-50 flex flex-col h-[350px]">
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                  Điểm nhấn chương trình
                </h2>
                <div
                  className="flex-1 text-sm text-slate-600 leading-relaxed overflow-y-auto pr-2 custom-scrollbar"
                  dangerouslySetInnerHTML={{
                    __html:
                      tour.description ||
                      tour.shortDescription ||
                      "Chưa có bài viết giới thiệu.",
                  }}
                />
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-50 flex flex-col h-[350px]">
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                  Vị trí
                </h2>
                <div className="flex-1 relative bg-slate-200 rounded-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600"
                    alt="Map"
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <MapPin
                      size={32}
                      className="text-[#e11d27] mb-2 drop-shadow-md"
                    />
                    <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                      {destination}
                    </div>
                  </div>
                  <button
                    title="Phóng to ảnh"
                    className="absolute bottom-3 right-3 bg-white p-1.5 rounded-full shadow-sm text-slate-500 hover:text-slate-800 pointer-events-auto"
                  >
                    <Expand size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Lịch trình khởi hành (Schedules) injected from wrapper */}
            <div id={TOUR_SCHEDULES_ANCHOR_ID} className="bg-transparent pt-4">
              <h2 className="text-xl font-bold text-slate-800 mb-6">
                Lịch trình khởi hành
              </h2>
              {scheduleSelector}
            </div>

            {/* Chương trình tour (Itinerary) */}
            {Array.isArray(tour.itineraryDays) &&
              tour.itineraryDays.length > 0 && (
                <div className="pt-6 pb-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-6">
                    Chương trình tour
                  </h2>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-50 p-6 flex flex-col gap-6">
                    {(tour.itineraryDays as PublicItineraryDay[]).map(
                      (day, idx) => (
                        <div key={idx} className="flex gap-4 relative">
                          {/* Timeline Line */}
                          {idx !==
                            (tour.itineraryDays as PublicItineraryDay[])
                              .length -
                              1 && (
                            <div className="absolute left-6 top-10 bottom-[-24px] w-[2px] bg-blue-100" />
                          )}

                          {/* Timeline Dot & Day Header */}
                          <div className="w-12 h-12 rounded-full border-2 border-blue-500 bg-blue-50 text-blue-600 flex flex-col items-center justify-center shrink-0 z-10 p-1 font-bold">
                            <span className="text-[10px] leading-tight uppercase font-medium">
                              Ngày
                            </span>
                            <span className="text-base leading-none">
                              {day.dayNumber || idx + 1}
                            </span>
                          </div>

                          {/* Day Content */}
                          <div className="flex-1 pt-1 pb-4">
                            <h3 className="text-base font-bold text-slate-800 mb-2">
                              {day.title ||
                                `Lịch trình ngày ${day.dayNumber || idx + 1}`}
                            </h3>
                            <div
                              className="text-sm text-slate-600 leading-relaxed text-justify prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{
                                __html:
                                  day.description ||
                                  "<p>Chưa có chi tiết lịch trình cho ngày này.</p>",
                              }}
                            />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

            {/* Những thông tin cần lưu ý (Accordions) */}
            <div className="pt-6 pb-20">
              <h2 className="text-xl font-bold text-slate-800 mb-6">
                Những thông tin cần lưu ý
              </h2>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-50 px-6">
                <Accordion
                  title="Giá tour bao gồm"
                  content={
                    tour.inclusions || "<p>Chưa có thông tin cập nhật.</p>"
                  }
                />
                <Accordion
                  title="Giá tour không bao gồm"
                  content={
                    tour.exclusions || "<p>Giặt ủi, chi phí cá nhân.</p>"
                  }
                />
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
            <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-6 flex flex-col">
              {!selectedDate ? (
                /* Unselected State (Hình 1) */
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-[15px] font-medium text-slate-700">
                      <span className="flex items-center gap-2">
                        <span className="text-slate-400">🎫</span> Mã chương
                        trình:
                      </span>
                      <span className="text-blue-600">
                        {tour.code?.split("-")[0] || "NDDNG2640"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[15px] font-medium text-slate-700">
                      <span className="flex items-center gap-2">
                        <span className="text-slate-400">⏱</span> Thời gian:
                      </span>
                      <span className="text-blue-600">
                        {tour.durationDays} ngày {tour.durationNights} đêm
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-4 mt-2">
                    <div className="flex items-end gap-2 w-full">
                      <span className="text-[13px] text-slate-500 mb-1">
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
                      <span className="text-sm font-bold text-slate-500">
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
                      <span className="ml-2 text-slate-500">✏️</span>
                    </button>
                  </div>

                  <div className="space-y-4 mb-6 pb-6 border-b border-t border-slate-100 py-6 text-[14px]">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-slate-700 font-medium">
                      <span className="flex items-center gap-2">
                        <span className="text-slate-400 font-serif">🎫</span> Mã
                        chuyến:
                      </span>
                      <span className="text-blue-600 sm:text-right mt-1 sm:mt-0 max-w-[200px] truncate">
                        {selectedScheduleCode || tour.code || "NDDNG2640-007"}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-700 font-medium">
                      <span className="flex items-center gap-2">
                        <MapPin size={16} className="text-slate-400" /> Khởi
                        hành:
                      </span>
                      <span className="text-blue-600 truncate max-w-[120px]">
                        {tour.primaryDepartureCity || "Đà Nẵng"}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-700 font-medium">
                      <span className="flex items-center gap-2">
                        <span className="text-slate-400">⏱</span> Thời gian:
                      </span>
                      <span className="text-blue-600">
                        {tour.durationDays} ngày {tour.durationNights} đêm
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-700 font-medium">
                      <span className="flex items-center gap-2">
                        <span className="text-slate-400">👤</span> Số chỗ còn:
                      </span>
                      <span className="text-blue-600">Còn 5 chỗ</span>
                    </div>
                    {(esg != null || lei != null) && (
                      <div className="flex justify-between text-slate-700 font-medium">
                        <span className="flex items-center gap-2">
                          <span className="text-slate-400">♻️</span> Chỉ số:
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
