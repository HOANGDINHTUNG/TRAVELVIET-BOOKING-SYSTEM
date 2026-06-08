import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { CheckCircle2, ChevronRight, MapPin, Star, User } from "lucide-react";
import { hotelApi, type HotelDetailResponse } from "@/api/server/Hotel.api";
import { Footer } from "@/components/Footer/Footer";
import { OptimizedImage } from "@/components/common/media/OptimizedImage";
import { saveHotelCheckoutSession } from "../lib/hotelCheckoutStorage";
import { useNavigate } from "react-router-dom";
import { useAuthStore, selectIsAuthenticated } from "../../../stores/authStore";
import { toast } from "sonner";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export default function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState<HotelDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await hotelApi.getDetail(Number(id), {
          checkinDate: searchParams.get("checkinDate") || undefined,
          checkoutDate: searchParams.get("checkoutDate") || undefined,
        });
        setData(res);
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="text-lg font-medium text-slate-500 animate-pulse">
          Đang tải dữ liệu khách sạn...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="text-lg font-medium text-red-500">
          Không tìm thấy thông tin khách sạn.
        </div>
      </div>
    );
  }

  const { basicInfo, images, amenities, roomTypes } = data;
  const coverImage =
    images.find((i) => i.isCover)?.mediaUrl ||
    images[0]?.mediaUrl ||
    "https://images.unsplash.com/photo-1542314831-c6a4d14d8373?auto=format&fit=crop&q=80&w=800";

  return (
    <div className="bg-[#f0f2f5] min-h-screen">
      {/* Container */}
      <main className="max-w-[1240px] mx-auto px-4 py-6 text-slate-800">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-slate-500 mb-4 whitespace-nowrap overflow-hidden">
          <span>Du lịch</span>
          <ChevronRight size={14} className="mx-1 shrink-0" />
          <span>Khách sạn</span>
          <ChevronRight size={14} className="mx-1 shrink-0" />
          <span>{basicInfo.province || "Vietnam"}</span>
          <ChevronRight size={14} className="mx-1 shrink-0" />
          <span className="font-semibold text-blue-600 truncate">
            {basicInfo.name}
          </span>
        </nav>

        {/* Top Header Card */}
        <section className="bg-white rounded-xl p-6 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2 flex flex-wrap items-center gap-3">
              {basicInfo.name}
            </h1>
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  size={16}
                  fill={
                    idx < (basicInfo.starRating || 0) ? "#f5b301" : "#e2e8f0"
                  }
                  strokeWidth={0}
                />
              ))}
            </div>
            <p className="text-slate-600 text-sm flex items-start gap-1">
              <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <span>{basicInfo.address}</span>
            </p>
          </div>
          <div className="flex flex-col items-end shrink-0 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="text-sm text-slate-500 mb-1">Giá từ:</div>
            <div className="text-xl font-bold text-blue-600 mb-3">
              {formatMoney(basicInfo.minRoomPrice)}{" "}
              <span className="text-sm font-normal text-slate-500">/ đêm</span>
            </div>
            <button className="bg-[#e11d27] text-white px-8 py-2.5 rounded-full font-medium hover:bg-red-700 transition-colors">
              Chọn phòng
            </button>
          </div>
        </section>

        {/* Big Cover Image */}
        <section className="mb-6 rounded-xl overflow-hidden shadow-sm h-[400px] md:h-[500px] relative">
          <OptimizedImage
            src={coverImage}
            alt={basicInfo.name}
            className="w-full h-full object-cover"
          />
        </section>

        {/* 3 Columns Info: Giới thiệu | Vị trí | Tiện nghi */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Giới thiệu */}
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
            <h2 className="text-lg font-bold mb-4">Giới thiệu</h2>
            <div
              className="text-sm text-slate-600 leading-relaxed max-h-48 overflow-y-auto pr-2"
              dangerouslySetInnerHTML={{
                __html:
                  basicInfo.description ||
                  "Khách sạn hiện chưa có bài viết giới thiệu.",
              }}
            />
          </div>
          {/* Vị trí */}
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
            <h2 className="text-lg font-bold mb-4">Vị trí</h2>
            <div className="relative flex-1 bg-slate-200 rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center min-h-[160px]">
              {/* Dummy Map Image placeholder simulating Google Maps */}
              <img
                src={
                  "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400"
                }
                className="w-full h-full object-cover opacity-60"
                alt="Bản đồ"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white px-4 py-2 rounded-full shadow-md text-sm font-medium flex items-center gap-2">
                  <MapPin size={16} className="text-red-500" /> Xem bản đồ
                </div>
              </div>
            </div>
          </div>
          {/* Tiện nghi */}
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Tiện nghi</h2>
              <button className="text-sm text-slate-500 hover:text-blue-600 flex items-center">
                Xem thêm <ChevronRight size={14} />
              </button>
            </div>
            <ul className="text-sm text-slate-600 space-y-3 flex-1 overflow-y-auto pr-2 max-h-48">
              {amenities && amenities.length > 0 ? (
                amenities.slice(0, 8).map((am, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0"
                    />
                    <span>{am}</span>
                  </li>
                ))
              ) : (
                <li className="italic text-slate-400">Đang cập nhật...</li>
              )}
            </ul>
          </div>
        </section>

        {/* Danh sách phòng */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-6">Danh sách phòng</h2>
          <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-4 rounded-xl shadow-sm">
            <span className="text-sm font-medium">Chọn lọc:</span>
            {[
              "Cà phê & trà",
              "Nhận phòng nhanh",
              "Vệ sinh phòng",
              "Wifi miễn phí",
            ].map((tag, i) => (
              <span
                key={i}
                className="px-4 py-1.5 border border-slate-200 rounded-full text-sm text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                {tag} ({i + 4})
              </span>
            ))}
            <button className="ml-auto text-sm text-red-500 hover:underline">
              Xoá hết
            </button>
          </div>

          <div className="space-y-6">
            {roomTypes.map((rt) => (
              <div
                key={rt.id}
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 text-lg font-bold text-slate-800">
                  {rt.name}
                </div>
                <div className="flex flex-col xl:flex-row">
                  {/* Left Column (Room Summary) */}
                  <div className="w-full xl:w-[320px] p-6 border-b xl:border-b-0 xl:border-r border-slate-100 shrink-0">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-slate-100 relative">
                      <OptimizedImage
                        src={
                          rt.imageUrl ||
                          "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=400"
                        }
                        alt={rt.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-4 border-b border-dashed border-slate-200 pb-4">
                      <span className="flex items-center gap-1">
                        <span className="font-semibold">{rt.roomAreaSize}</span>{" "}
                        m2
                      </span>
                      <span className="flex items-center gap-1">
                        Cảnh:{" "}
                        <span className="font-semibold">{rt.roomView}</span>
                      </span>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-2 mb-4">
                      <li className="flex gap-2 items-center">
                        <CheckCircle2 size={16} className="text-slate-400" /> Cà
                        phê & trà
                      </li>
                      <li className="flex gap-2 items-center">
                        <CheckCircle2 size={16} className="text-slate-400" />{" "}
                        Nhận phòng nhanh
                      </li>
                      <li className="flex gap-2 items-center">
                        <CheckCircle2 size={16} className="text-slate-400" />{" "}
                        {rt.bedType}
                      </li>
                    </ul>
                    <button className="text-sm text-blue-600 font-medium hover:underline">
                      Xem tiện ích khách sạn{" "}
                      <ChevronRight size={14} className="inline" />
                    </button>
                  </div>

                  {/* Right Column (Data Table) */}
                  <div className="flex-1 overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-sm text-slate-600 border-b border-slate-100">
                          <th className="font-medium p-4 border-r border-slate-100 w-[30%]">
                            Đề xuất cho bạn
                          </th>
                          <th className="font-medium p-4 border-r border-slate-100 text-center w-[15%]">
                            Số lượng
                          </th>
                          <th className="font-medium p-4 border-r border-slate-100 text-center w-[25%]">
                            Giá / Phòng / Đêm
                          </th>
                          <th className="font-medium p-4 border-r border-slate-100 text-center w-[12%]">
                            Phòng
                          </th>
                          <th className="font-medium p-4 text-center w-[18%]"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {rt.ratePlans.map((plan, idx) => (
                          <tr
                            key={plan.planId}
                            className={
                              idx !== rt.ratePlans.length - 1
                                ? "border-b border-slate-100"
                                : ""
                            }
                          >
                            <td className="p-4 border-r border-slate-100 align-top">
                              <ul className="space-y-2 text-sm">
                                {plan.inclusionTags.map((tag, tIdx) => (
                                  <li
                                    key={tIdx}
                                    className={`flex items-start gap-1.5 ${tag.includes("bữa sáng") ? "text-orange-600 font-medium" : "text-slate-600"}`}
                                  >
                                    {tag.includes("chưa") ||
                                    tag.includes("Không hoàn") ? (
                                      <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                                        &minus;
                                      </div>
                                    ) : (
                                      <CheckCircle2
                                        size={16}
                                        className={
                                          tag.includes("bữa sáng")
                                            ? "text-orange-500 shrink-0"
                                            : "text-green-500 shrink-0"
                                        }
                                      />
                                    )}
                                    <span>{tag}</span>
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td className="p-4 border-r border-slate-100 align-middle text-center">
                              <div className="flex justify-center items-center gap-1 text-slate-600">
                                <span className="font-semibold">
                                  {rt.maxAdults}
                                </span>
                                <User size={16} />
                              </div>
                            </td>
                            <td className="p-4 border-r border-slate-100 align-middle text-right">
                              {plan.promoTag && (
                                <div className="inline-block bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-0.5 rounded mb-2">
                                  {plan.promoTag}
                                </div>
                              )}
                              <div className="text-xl font-bold text-blue-600 mb-1 text-center">
                                {formatMoney(plan.discountPrice)}{" "}
                                <span className="text-sm font-normal text-slate-500">
                                  / đêm
                                </span>
                              </div>
                              {plan.originalPrice > plan.discountPrice && (
                                <div className="text-xs text-slate-400 text-center">
                                  Đã bao gồm thuế & phí:
                                  <br />
                                  <span className="line-through">
                                    {formatMoney(plan.originalPrice)}
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="p-4 border-r border-slate-100 align-middle text-center font-medium">
                              1
                            </td>
                            <td className="p-4 align-middle text-center">
                              <button
                                className="bg-[#e11d27] hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md w-full transition-colors mb-2"
                                onClick={() => {
                                  if (!isAuthenticated) {
                                    toast.info(
                                      "Vui lòng đăng nhập để tiếp tục đặt phòng",
                                    );
                                    const from = `${window.location.pathname}${window.location.search}`;
                                    navigate("/login", { state: { from } });
                                    return;
                                  }
                                  saveHotelCheckoutSession({
                                    hotel: {
                                      id: basicInfo.id,
                                      name: basicInfo.name,
                                      address: basicInfo.address,
                                      starRating: basicInfo.starRating || 0,
                                      score: 10,
                                    },
                                    room: {
                                      id: rt.id,
                                      name: rt.name,
                                      imageUrl:
                                        rt.imageUrl ||
                                        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=400",
                                    },
                                    ratePlan: {
                                      planId: plan.planId,
                                      title: plan.inclusionTags.join(" + "),
                                      priceVnd: plan.discountPrice,
                                      isRefundable: !plan.inclusionTags.some(
                                        (t) => t.includes("Không hoàn"),
                                      ),
                                      isBreakfastIncluded:
                                        plan.inclusionTags.some((t) =>
                                          t.includes("bữa sáng"),
                                        ),
                                    },
                                    checkInDate:
                                      searchParams.get("checkinDate") ||
                                      "2026-06-02",
                                    checkOutDate:
                                      searchParams.get("checkoutDate") ||
                                      "2026-06-03",
                                    guests: {
                                      adults: rt.maxAdults,
                                      children: 0,
                                      rooms: 1,
                                    },
                                    totalAmountVnd: Math.floor(
                                      plan.discountPrice * 1.265,
                                    ),
                                    taxAmountVnd: Math.floor(
                                      plan.discountPrice * 0.08,
                                    ),
                                    feeAmountVnd: Math.floor(
                                      plan.discountPrice * 0.185,
                                    ),
                                    holdExpiresAtMs:
                                      Date.now() + 15 * 60 * 1000,
                                  });
                                  navigate("/hotels/checkout");
                                }}
                              >
                                Đặt ngay
                              </button>
                              {plan.remainingRooms <= 3 && (
                                <div className="text-xs font-medium text-emerald-600">
                                  Chỉ còn {plan.remainingRooms} phòng!
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quy định chỗ nghỉ */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-slate-100">
          <h2 className="text-xl font-bold mb-6">Quy định chỗ nghỉ</h2>
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 text-sm text-slate-700">
            <div className="font-semibold">Trẻ em và giường phụ</div>
            <div>
              <ul className="list-disc pl-5 mb-6 space-y-1">
                <li>
                  Giường phụ tùy thuộc vào loại phòng bạn chọn, xin vui lòng
                  kiểm tra thông tin phòng để biết thêm chi tiết.
                </li>
                <li>Tất cả trẻ em đều được chào đón.</li>
              </ul>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="font-semibold mb-3 flex items-center gap-2 bg-blue-50 text-blue-700 p-2 text-xs rounded">
                    👶 Em bé: Từ 0 - 3 tuổi
                  </div>
                  <ul className="list-disc pl-4 space-y-2 text-xs text-slate-600">
                    <li>Ở miễn phí nếu sử dụng giường có sẵn.</li>
                    <li>Có thể yêu cầu nôi/cũi em bé trực tiếp tại lưu trú.</li>
                  </ul>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="font-semibold mb-3 flex items-center gap-2 text-xs bg-slate-50 p-2 rounded">
                    👦 Trẻ em: Từ 3 - 5 tuổi
                  </div>
                  <ul className="list-disc pl-4 space-y-2 text-xs text-slate-600">
                    <li>Ở miễn phí nếu sử dụng giường có sẵn.</li>
                    <li>Nếu cần một giường phụ thì sẽ phụ thu thêm.</li>
                  </ul>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="font-semibold mb-3 flex items-center gap-2 text-xs bg-slate-50 p-2 rounded">
                    🧑 Người lớn: Từ 6 tuổi trở lên
                  </div>
                  <ul className="list-disc pl-4 space-y-2 text-xs text-slate-600">
                    <li>Cần đặt thêm một giường phụ và sẽ phụ thu thêm.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="font-semibold pt-4 border-t border-slate-100">
              Quy định hủy phòng
            </div>
            <div className="pt-4 border-t border-slate-100">
              Bất kỳ việc hủy phòng nào ghi nhận được trong vòng 5 ngày trước
              ngày đến sẽ phải trả phí cho toàn bộ thời gian ở. Không đến khách
              sạn hoặc chỗ nghỉ sẽ được giải quyết như là Vắng Mặt và sẽ phải
              trả một khoản tiền là 100% giá trị đặt phòng.
            </div>

            <div className="font-semibold pt-4 border-t border-slate-100">
              Quy định khác
            </div>
            <div className="pt-4 border-t border-slate-100">
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Đối với đặt phòng trả tiền tại khách sạn, khách cần liên hệ
                  chỗ nghỉ trước để xác nhận thời gian nhận phòng. Khách không
                  đến, chỗ nghỉ có thể hủy bỏ việc đặt phòng.
                </li>
                <li>
                  Khi đặt trên 5 phòng, chính sách và điều khoản bổ sung có thể
                  được áp dụng.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
