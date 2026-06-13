import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  MapPin,
  Phone,
  ChevronDown,
  ChevronUp,
  Expand,
  Bus,
  Edit2,
} from "lucide-react";
import { tourApi } from "@/api/server/Tour.api";
import { comboApi, type ComboPackageResponse } from "@/api/server/Combo.api";
import { Footer } from "@/components/Footer/Footer";
import { OptimizedImage } from "@/components/common/media/OptimizedImage";
import { comboCheckoutStorage } from "../lib/comboCheckoutStorage";
import { selectIsAuthenticated, useAuthStore } from "../../../stores/authStore";
import { toast } from "sonner";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

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
          className="pb-4 text-sm text-slate-600 leading-relaxed overflow-hidden"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}

export default function ComboDetailPage() {
  const { id } = useParams<{ id: string }>();
  // The Combo entity
  const [combo, setCombo] = useState<ComboPackageResponse | null>(null);
  // The Tour mapped entity (if combo packs a tour)
  const [tour, setTour] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch the Combo itself
        const comboData = await comboApi.getById(id);
        setCombo(comboData);

        // 2. Find if this combo packs a Tour.
        const tourItem = comboData.items?.find(
          (i) => i.itemType?.toLowerCase() === "tour",
        );

        if (tourItem && tourItem.itemRefId) {
          // 3. Chain fetch Tour Details & Schedules
          const [tourData, schedulesData] = await Promise.all([
            tourApi.getTourById(String(tourItem.itemRefId)),
            tourApi.getTourSchedules(tourItem.itemRefId),
          ]);
          setTour(tourData);
          setSchedules(schedulesData || []);
        }
      } catch (error) {
        console.error("Error fetching combo detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="text-lg font-medium text-slate-500 animate-pulse">
          Đang tải dữ liệu Combo...
        </div>
      </div>
    );
  }

  if (!combo) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="text-lg font-medium text-red-500">
          Không tìm thấy thông tin Combo.
        </div>
      </div>
    );
  }

  // Find a cover image. Assuming tour.media is fetched or just use a dummy background if missing.
  // We notice from Tour.api.ts that getTourById returns BackendTour.
  const coverImage =
    tour?.media?.find((m: any) => m.mediaUrl)?.mediaUrl ||
    "https://images.unsplash.com/photo-1542314831-c6a4d14d8373?auto=format&fit=crop&q=80&w=800";

  const displayPrice = combo.finalPrice || combo.basePrice || 0;
  const title = combo.name || tour?.name;
  const description =
    tour?.description || combo.description || "Chưa có bài viết giới thiệu.";
  const destination =
    tour?.destinationName || combo?.destinationId?.toString() || "Ninh Thuận";

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để tiếp tục đặt vé");
      const from = `${window.location.pathname}${window.location.search}`;
      navigate("/login", { state: { from } });
      return;
    }

    comboCheckoutStorage.save({
      comboId: id!,
      comboTitle: title,
      scheduleId: selectedSchedule?.id,
      scheduleCode: selectedSchedule?.scheduleCode || tour?.code || "FESGN-###",
      coverImage: coverImage,
      adultPrice: displayPrice,
      childPrice: displayPrice * 0.75,
      infantPrice: displayPrice * 0.5,
      departureAt: selectedSchedule?.departureAt,
      primaryDepartureCity: tour?.primaryDepartureCity || "TP. Hồ Chí Minh",
    });
    navigate("/combos/checkout");
  };

  return (
    <div className="bg-[#f5f8fa] min-h-screen font-sans">
      <main className="max-w-[1240px] mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm font-medium text-slate-500 mb-6 whitespace-nowrap overflow-hidden">
          <Link to="/" className="hover:text-blue-600">
            Du lịch
          </Link>
          <ChevronRight size={14} className="mx-2 shrink-0" />
          <Link to="/combos" className="hover:text-blue-600">
            Combo tiết kiệm
          </Link>
          <ChevronRight size={14} className="mx-2 shrink-0" />
          <span className="text-blue-600 truncate">{title}</span>
        </nav>

        {/* Hero Image Section */}
        <section className="relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden shadow-sm mb-8 group">
          <OptimizedImage
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Transparent left gradient overlay */}
          <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
          {/* Expand icon bottom right */}
          <button className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full text-slate-700 hover:bg-white hover:text-blue-600 transition-colors shadow-md">
            <Expand size={20} />
          </button>
        </section>

        {/* Layout Container: Left (Info) vs Right (Sticky Box) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column */}
          <div className="flex-1 w-full space-y-8">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
              {title}
            </h1>
            {/* Giới thiệu & Vị trí - 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Giới thiệu */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col h-[350px]">
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                  Giới thiệu
                </h2>
                <div
                  className="flex-1 text-sm text-slate-600 leading-relaxed overflow-y-auto pr-2 custom-scrollbar"
                  dangerouslySetInnerHTML={{
                    __html: description,
                  }}
                />
              </div>

              {/* Vị trí */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col h-[350px]">
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                  Vị trí
                </h2>
                <div className="flex-1 relative bg-slate-200 rounded-xl overflow-hidden">
                  {/* Google Map Mockup */}
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
                  <button className="absolute bottom-3 right-3 bg-white p-1.5 rounded-full shadow-sm text-slate-500 hover:text-slate-800 pointer-events-auto">
                    <Expand size={16} />
                  </button>
                </div>
              </div>
            </div>
            {/* Lịch trình khởi hành (Schedules) */}
            <div className="bg-transparent">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Lịch trình khởi hành
              </h2>
              {schedules.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 shadow-sm text-center text-slate-500">
                  Hiện chưa có lịch trình khởi hành nào.
                </div>
              ) : (
                <div className="space-y-4">
                  {schedules.map((schedule, idx) => {
                    const isSelected = selectedSchedule?.id === schedule.id;
                    const schPrice = displayPrice; // Force sync with the Combo parent bundle price
                    const rawDate = schedule.departureAt
                      ? new Date(schedule.departureAt)
                      : null;
                    const dateStr = rawDate
                      ? rawDate.toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "Đang cập nhật";
                    const tourCode =
                      schedule.scheduleCode || tour?.code || "FESGN-###";

                    if (!isSelected) {
                      return (
                        <div
                          key={schedule.id || idx}
                          className="bg-white rounded-full px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm border border-slate-200 gap-4 cursor-pointer hover:border-blue-400 transition-colors"
                          onClick={() => setSelectedSchedule(schedule)}
                        >
                          <div className="flex items-center gap-6">
                            <div className="text-blue-500 font-bold whitespace-nowrap min-w-[90px]">
                              {dateStr}
                            </div>
                            <div className="text-sm text-slate-500 flex items-center gap-2 truncate">
                              <span className="text-slate-300">|</span>
                              <span className="truncate">
                                Mã tour: {tourCode}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                            <div className="font-bold text-slate-800 text-lg">
                              {formatMoney(schPrice)}
                            </div>
                            <button
                              className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium px-5 py-2 rounded-full transition-colors text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSchedule(schedule);
                              }}
                            >
                              Chọn
                            </button>
                          </div>
                        </div>
                      );
                    }

                    // Expanded View
                    return (
                      <div
                        key={schedule.id || idx}
                        className="bg-white rounded-[24px] p-6 shadow-md border-2 border-blue-500 flex flex-col gap-6"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                          <div className="flex items-center gap-6">
                            <div className="text-blue-500 font-bold whitespace-nowrap min-w-[90px]">
                              {dateStr}
                            </div>
                            <div className="text-sm text-slate-500 flex items-center gap-2 truncate">
                              <span className="text-slate-300">|</span>
                              <span className="truncate">Thông tin tour: </span>
                            </div>
                          </div>
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-full transition-colors text-sm"
                            onClick={() => setSelectedSchedule(null)}
                          >
                            Đang chọn
                          </button>
                        </div>

                        {/* Transport */}
                        <div>
                          <div className="text-center text-sm font-bold text-slate-700 mb-4">
                            Phương tiện di chuyển
                          </div>
                          <div className="flex flex-col sm:flex-row justify-between items-center text-sm gap-4">
                            <div className="w-full sm:w-1/3">
                              <div className="flex justify-between text-slate-500 mb-1">
                                <span>Ngày đi: {dateStr}</span>
                                <span className="text-accent flex items-center gap-1 font-medium">
                                  <Bus size={14} /> Xe khách
                                </span>
                              </div>
                              <div className="text-lg font-bold text-slate-800">
                                05:00
                              </div>
                              <div className="text-slate-500 mt-1">
                                TP. Hồ Chí Minh
                              </div>
                            </div>
                            {/* Dotted Line */}
                            <div className="w-full sm:w-1/3 flex items-center">
                              <div className="w-full border-t border-dashed border-slate-300"></div>
                            </div>
                            <div className="w-full sm:w-1/3 text-right">
                              <div className="flex justify-between text-slate-500 mb-1">
                                <span>
                                  Ngày về:{" "}
                                  {schedule.returnAt
                                    ? new Date(
                                        schedule.returnAt,
                                      ).toLocaleDateString("vi-VN")
                                    : dateStr}
                                </span>
                                <span className="text-accent flex items-center gap-1 font-medium">
                                  <Bus size={14} /> Xe khách
                                </span>
                              </div>
                              <div className="text-lg font-bold text-slate-800">
                                20:30
                              </div>
                              <div className="text-slate-500 mt-1">
                                Ninh Thuận
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Pricing Matrix */}
                        <div>
                          <div className="text-center text-sm font-bold text-slate-700 mb-4">
                            Giá combo
                          </div>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="font-bold text-slate-800">
                                Người lớn
                              </div>
                              <div className="text-slate-400 text-xs mb-1">
                                (Từ 12 tuổi trở lên)
                              </div>
                              <div className="text-[#e11d27] font-bold">
                                {formatMoney(schPrice)}
                              </div>
                            </div>
                            <div>
                              <div className="font-bold text-slate-800">
                                Em bé
                              </div>
                              <div className="text-slate-400 text-xs mb-1">
                                (Dưới 2 tuổi)
                              </div>
                              <div className="text-[#e11d27] font-bold">0đ</div>
                            </div>
                            <div>
                              <div className="font-bold text-slate-800">
                                Trẻ em
                              </div>
                              <div className="text-slate-400 text-xs mb-1">
                                (Từ 5 đến 11 tuổi)
                              </div>
                              <div className="text-[#e11d27] font-bold">
                                {formatMoney(schPrice * 0.75)}
                              </div>
                            </div>
                            <div>
                              <div className="font-bold text-slate-800">
                                Trẻ nhỏ
                              </div>
                              <div className="text-slate-400 text-xs mb-1">
                                (Từ 2 - 4 tuổi)
                              </div>
                              <div className="text-[#e11d27] font-bold">
                                {formatMoney(schPrice * 0.5)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Extra info */}
                        <div className="bg-accent/10 rounded-xl p-4 border border-accent/30 mt-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <div className="font-bold text-slate-800 mb-1">
                                Địa điểm tập trung:
                              </div>
                              <p className="text-slate-600 leading-relaxed">
                                {schedule.meetingAddress ||
                                  "00:00 Tập trung tại văn phòng..."}
                              </p>
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 mb-1">
                                Địa điểm khách sạn:
                              </div>
                              <p className="text-slate-600 leading-relaxed">
                                {destination}
                              </p>
                            </div>
                          </div>
                          <div className="text-xs text-accent bg-accent/20/40 p-3 rounded-lg leading-relaxed">
                            Combo không hoàn, hủy, không đổi. Giá áp dụng tối
                            thiểu cho 2 khách/ booking. Quý khách cần mang theo
                            CCCD/Passport gốc còn hạn để làm thủ tục nhận phòng.
                            Tổng đài tư vấn 1800.645.888 (Miễn phí) từ 8:00 -
                            23:00 hàng ngày.
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Những thông tin cần lưu ý (Accordions) */}
            <div className="pt-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">
                Những thông tin cần lưu ý
              </h2>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6">
                <Accordion
                  title="Thông tin dịch vụ"
                  content={
                    tour?.shortDescription ||
                    "<p>Dịch vụ trọn gói theo tiêu chuẩn.</p>"
                  }
                />
                <Accordion
                  title="Combo bao gồm"
                  content={
                    tour?.inclusions || "<p>Chưa có thông tin cập nhật.</p>"
                  }
                />
                <Accordion
                  title="Combo không bao gồm"
                  content={
                    tour?.exclusions || "<p>Chi phí cá nhân không đề cập.</p>"
                  }
                />
                <Accordion
                  title="Điều kiện áp dụng"
                  content={
                    tour?.notes || "<p>Áp dụng theo chính sách hiện hành.</p>"
                  }
                />
              </div>
            </div>
            <div className="h-12" /> {/* Bottom Padding */}
          </div>

          {/* Right Sticky Column */}
          <div className="w-full lg:w-[340px] shrink-0 sticky top-24">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
              {selectedSchedule ? (
                // --- Selected State Sidebar ---
                <>
                  <div className="flex justify-between items-center bg-blue-50/50 p-3 rounded-lg mb-4 text-sm font-medium border border-blue-50">
                    <span className="text-blue-600 bg-white px-3 py-1 rounded shadow-sm">
                      {selectedSchedule.departureAt
                        ? new Date(
                            selectedSchedule.departureAt,
                          ).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </span>
                    <button
                      className="text-blue-500 flex items-center gap-1 hover:underline"
                      onClick={() => setSelectedSchedule(null)}
                    >
                      Chọn ngày khác <Edit2 size={12} />
                    </button>
                  </div>

                  <div className="text-sm text-slate-500 mb-1">Giá:</div>
                  <div className="flex items-end gap-2 mb-6 border-b border-slate-100 pb-4">
                    <span className="text-2xl font-bold text-slate-800">
                      {formatMoney(displayPrice)}
                    </span>
                    <span className="text-sm text-slate-500 pb-1">/ khách</span>
                  </div>

                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex justify-between">
                      <span className="text-slate-500 flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px] text-slate-400">
                          M
                        </div>
                        Mã tour:
                      </span>
                      <span className="font-medium text-blue-500">
                        {selectedSchedule.scheduleCode ||
                          tour?.code ||
                          "FESGN-###"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 flex items-center gap-2">
                        <MapPin size={14} /> Khởi hành:
                      </span>
                      <span className="font-medium text-blue-500">
                        {tour?.primaryDepartureCity || "TP. Hồ Chí Minh"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-slate-300" />
                        Ngày khởi hành:
                      </span>
                      <span className="font-medium text-blue-500">
                        {selectedSchedule.departureAt
                          ? new Date(
                              selectedSchedule.departureAt,
                            ).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-slate-300" />
                        Thời gian:
                      </span>
                      <span className="font-medium text-blue-500">
                        {tour?.durationDays || 3} ngày{" "}
                        {tour?.durationNights || 2} đêm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-slate-300" />
                        Số chỗ còn:
                      </span>
                      <span className="font-medium text-blue-500">
                        Còn {selectedSchedule.remainingSeats ?? 6} chỗ
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shrink-0 shadow-sm border border-blue-600">
                      <Phone size={20} />
                    </button>
                    <button
                      className="flex-1 bg-[#e11d27] hover:bg-red-700 text-white font-bold h-12 rounded-full transition-colors shadow-sm text-[15px]"
                      onClick={handleCheckout}
                    >
                      Đặt ngay
                    </button>
                  </div>
                </>
              ) : (
                // --- Default Unselected State Sidebar ---
                <>
                  <div className="text-sm text-slate-500 mb-1">Giá từ:</div>
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-2xl font-bold text-slate-800">
                      {formatMoney(displayPrice)}
                    </span>
                    <span className="text-sm text-slate-500 pb-1">/ khách</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shrink-0 shadow-sm border border-blue-600">
                      <Phone size={20} />
                    </button>
                    <button
                      className="flex-1 bg-[#e11d27] hover:bg-red-700 text-white font-bold h-12 rounded-full transition-colors shadow-sm"
                      onClick={handleCheckout}
                    >
                      Chọn ngay
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
