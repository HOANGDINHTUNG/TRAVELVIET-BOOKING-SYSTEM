import React, { useState, useEffect } from "react";
import { type TourCheckoutSession } from "../../lib/TourCheckoutStorage";
import { useCreateBooking } from "../../../bookings/hooks/useBookingMutation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  UserCircle,
  Phone,
  Plane,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  X,
  Bus,
} from "lucide-react";
import { OptimizedImage } from "@/components/common/media/OptimizedImage";
import { useAuthStore } from "@/stores/authStore";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

type PassengerInput = {
  fullName: string;
  day: string;
  month: string;
  year: string;
  gender: string;
  phone: string;
};

export default function TourCheckoutForm({
  session,
  onNext,
}: {
  session: TourCheckoutSession;
  onNext: (bookingId: number) => void;
}) {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [adultSingleFlags, setAdultSingleFlags] = useState<boolean[]>([]);

  const [adultPassengers, setAdultPassengers] = useState<PassengerInput[]>([
    { fullName: "", day: "", month: "", year: "", gender: "Nam", phone: "" },
  ]);
  const [childPassengers, setChildPassengers] = useState<PassengerInput[]>([]);

  useEffect(() => {
    setAdultPassengers((prev) => {
      const next = [...prev];
      while (next.length < adults) {
        next.push({
          fullName: "",
          day: "",
          month: "",
          year: "",
          gender: "Nam",
          phone: "",
        });
      }
      return next.slice(0, adults);
    });
  }, [adults]);

  useEffect(() => {
    setChildPassengers((prev) => {
      const next = [...prev];
      while (next.length < children) {
        next.push({
          fullName: "",
          day: "",
          month: "",
          year: "",
          gender: "Nam",
          phone: "",
        });
      }
      return next.slice(0, children);
    });
  }, [children]);

  const isPassengerValid = (p: PassengerInput) => {
    if (!p) return false;
    return !!(p.fullName.trim() && p.day && p.month && p.year && p.gender);
  };

  const user = useAuthStore((s: any) => s.user);
  const [contactName, setContactName] = useState(user?.fullName || "");
  const [contactPhone, setContactPhone] = useState(user?.phoneNumber || "");
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [specialRequests, setSpecialRequests] = useState("");

  const toggleSingleRoom = (index: number) => {
    setAdultSingleFlags((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const createMutation = useCreateBooking({ disableRedirect: true });

  const handleNext = () => {
    if (!contactName || !contactPhone || !contactEmail) {
      toast.error("Vui lòng điền đầy đủ thông tin liên hệ");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      toast.error("Email không hợp lệ. Vui lòng thử lại!");
      return;
    }
    const phoneRegex = /^\+?[0-9\s-]{10,14}$/;
    if (!phoneRegex.test(contactPhone)) {
      toast.error("Số điện thoại không hợp lệ. Cần tối thiểu 10 số.");
      return;
    }

    let passengersValid = true;
    for (let i = 0; i < adults; i++) {
      if (!isPassengerValid(adultPassengers[i])) passengersValid = false;
    }
    for (let i = 0; i < children; i++) {
      if (!isPassengerValid(childPassengers[i])) passengersValid = false;
    }

    if (!passengersValid) {
      toast.error("Vui lòng nhập đầy đủ thông tin hành khách!");
      setIsModalOpen(true);
      return;
    }

    const finalPassengers: any[] = [];
    adultPassengers.forEach((p) => {
      finalPassengers.push({
        fullName: p.fullName,
        dateOfBirth: `${p.year}-${p.month.padStart(2, "0")}-${p.day.padStart(2, "0")}`,
        gender: p.gender === "Nam" ? "male" : "female",
        passengerType: "adult",
        phone: p.phone || undefined,
      });
    });
    childPassengers.forEach((p) => {
      finalPassengers.push({
        fullName: p.fullName,
        dateOfBirth: `${p.year}-${p.month.padStart(2, "0")}-${p.day.padStart(2, "0")}`,
        gender: p.gender === "Nam" ? "male" : "female",
        passengerType: "child",
        phone: p.phone || undefined,
      });
    });

    createMutation.mutate(
      {
        tourId: session.tourId || 1, // Fallback if tourId is zero for some reason
        scheduleId: session.scheduleId,
        TourId: session.tourId,
        adults,
        children: children,
        infants,
        contactName,
        contactPhone,
        contactEmail,
        specialRequests,
        bookingSource: "web",
        passengers: finalPassengers,
      },
      {
        onSuccess: (data) => {
          // We pass the actual booking ID to the next step
          onNext(data.id);
        },
        onError: (err) => {
          toast.error("Lỗi khi tạo đơn hàng, vui lòng thử lại.");
          console.error(err);
        },
      },
    );
  };

  const [flightInfoOpen, setFlightInfoOpen] = useState(true);
  const [costInfoOpen, setCostInfoOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Derive simple total costs
  const singleSupplementPrice = session.adultPrice * 0.25;
  const singleRoomsCount = adultSingleFlags
    .slice(0, adults)
    .filter(Boolean).length;

  const totalCost =
    adults * session.adultPrice +
    children * session.childPrice +
    singleRoomsCount * singleSupplementPrice; // infantPrice is usually 0

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* LEFT COLUMN */}
      <div className="flex-1 w-full space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Đặt tour của bạn
          </h1>
          <p className="text-slate-500 mt-1">
            Hãy đảm bảo tất cả thông tin chi tiết trên trang này đã chính xác
            trước khi tiến hành thanh toán.
          </p>
        </div>

        {/* Thông tin liên lạc */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Thông tin liên lạc
          </h2>
          <div className="bg-blue-50/50 text-blue-600 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
            <UserCircle size={18} />
            <span>
              <a href="#" className="font-bold hover:underline">
                Đăng nhập
              </a>{" "}
              để nhận ưu đãi, tích điểm và quản lý đơn hàng dễ dàng hơn!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Họ tên <span className="text-red-500">(*)</span>
              </label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 focus:ring-2 focus:ring-blue-100 outline-none font-medium text-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Số điện thoại <span className="text-red-500">(*)</span>
              </label>
              <input
                type="text"
                placeholder="0987654321"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 focus:ring-2 focus:ring-blue-100 outline-none font-medium text-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email <span className="text-red-500">(*)</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 focus:ring-2 focus:ring-blue-100 outline-none font-medium text-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Địa chỉ
              </label>
              <input
                type="text"
                placeholder="123 Đường ABC"
                className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 focus:ring-2 focus:ring-blue-100 outline-none font-medium text-slate-700"
              />
            </div>
          </div>
        </section>

        {/* Hành khách selector */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Hành khách</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
            {[
              {
                label: "Người lớn",
                sub: "Từ 12 tuổi trở lên",
                val: adults,
                setter: setAdults,
                min: 1,
              },
              {
                label: "Trẻ em",
                sub: "Từ 5 - 11 tuổi",
                val: children,
                setter: setChildren,
                min: 0,
              },

              {
                label: "Em bé",
                sub: "Dưới 4 tuổi",
                val: infants,
                setter: setInfants,
                min: 0,
              },
            ].map((p, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">{p.label}</div>
                  <div className="text-xs text-slate-500">{p.sub}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 disabled:opacity-50"
                    onClick={() => p.setter(Math.max(p.min, p.val - 1))}
                    disabled={p.val <= p.min}
                  >
                    -
                  </button>
                  <span className="w-4 text-center font-bold text-slate-700">
                    {p.val}
                  </span>
                  <button
                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600"
                    onClick={() => p.setter(p.val + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Thông tin hành khách chi tiết */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Thông tin hành khách
          </h2>

          <div className="space-y-8">
            {/* Người lớn */}
            {adults > 0 && (
              <div>
                <div className="font-bold text-blue-600 flex items-center gap-2 mb-2">
                  <UserCircle size={18} /> Người lớn{" "}
                  <span className="text-slate-400 font-normal text-sm">
                    {" "}
                    (Từ 12 tuổi trở lên)
                  </span>
                </div>
                <p className="text-blue-500 text-xs font-medium mb-4">
                  Phòng đơn dành cho khách hàng từ 12 tuổi trở lên, giá phòng
                  đơn là: {formatMoney(singleSupplementPrice)} / phòng
                </p>

                <div className="space-y-4">
                  {Array.from({ length: adults }).map((_, i) => (
                    <div
                      key={`adult-${i}`}
                      className="flex flex-col sm:flex-row justify-between sm:items-center py-2 border-b border-slate-50 border-dashed gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1 w-full relative">
                        <span className="font-mono text-slate-800 font-bold w-6">
                          #{i + 1}
                        </span>
                        <div
                          className="flex-1 max-w-[400px] border border-slate-200 rounded-full h-10 px-4 flex items-center justify-between bg-white overflow-hidden shadow-sm hover:border-blue-400 transition cursor-pointer"
                          onClick={() => setIsModalOpen(true)}
                        >
                          <span className="text-slate-400 text-sm">
                            Người lớn <span className="text-red-500">(*)</span>
                          </span>
                          {isPassengerValid(adultPassengers[i]) ? (
                            <span className="text-emerald-500 font-bold text-sm whitespace-nowrap">
                              ✓ Đã nhập
                            </span>
                          ) : (
                            <span className="text-[#e11d27] text-sm whitespace-nowrap">
                              Nhập thông tin &rarr;
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-10 sm:ml-0">
                        <span className="text-xs text-slate-600 font-bold whitespace-nowrap">
                          Phòng đơn:
                        </span>
                        <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                          <input
                            type="checkbox"
                            checked={!!adultSingleFlags[i]}
                            onChange={() => toggleSingleRoom(i)}
                            className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200"
                            style={{
                              top: "1px",
                              left: "1px",
                              borderColor: adultSingleFlags[i]
                                ? "#2563eb"
                                : "#cbd5e1",
                              transform: adultSingleFlags[i]
                                ? "translateX(100%)"
                                : "translateX(0)",
                            }}
                          />
                          <label
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                              adultSingleFlags[i]
                                ? "bg-blue-600"
                                : "bg-slate-300"
                            }`}
                            onClick={() => toggleSingleRoom(i)}
                          ></label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trẻ em */}
            {children > 0 && (
              <div>
                <div className="font-bold text-blue-600 flex items-center gap-2 mb-4">
                  <UserCircle size={18} /> Trẻ em{" "}
                  <span className="text-slate-400 font-normal text-sm">
                    {" "}
                    (Từ 5 - 11 tuổi)
                  </span>
                </div>
                <div className="space-y-4">
                  {Array.from({ length: children }).map((_, i) => (
                    <div
                      key={`child-${i}`}
                      className="flex flex-col sm:flex-row justify-between sm:items-center py-2 border-b border-slate-50 border-dashed gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1 w-full relative">
                        <span className="font-mono text-slate-800 font-bold w-6">
                          #{i + 1}
                        </span>
                        <div
                          className="flex-1 max-w-[400px] border border-slate-200 rounded-full h-10 px-4 flex items-center justify-between bg-white overflow-hidden shadow-sm hover:border-blue-400 transition cursor-pointer"
                          onClick={() => setIsModalOpen(true)}
                        >
                          <span className="text-slate-400 text-sm">
                            Trẻ em <span className="text-red-500">(*)</span>
                          </span>
                          {isPassengerValid(childPassengers[i]) ? (
                            <span className="text-emerald-500 font-bold text-sm whitespace-nowrap">
                              ✓ Đã nhập
                            </span>
                          ) : (
                            <span className="text-[#e11d27] text-sm whitespace-nowrap">
                              Nhập thông tin &rarr;
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trẻ nhỏ */}
            {false /* toddlers > 0 */ && (
              <div>
                <div className="font-bold text-blue-600 flex items-center gap-2 mb-4">
                  <UserCircle size={18} /> Trẻ nhỏ{" "}
                  <span className="text-slate-400 font-normal text-sm">
                    {" "}
                    (Từ 2 - 4 tuổi)
                  </span>
                </div>
                <div className="space-y-4">
                  {Array.from({ length: toddlers }).map((_, i) => (
                    <div
                      key={`toddler-${i}`}
                      className="flex flex-col sm:flex-row justify-between sm:items-center py-2 border-b border-slate-50 border-dashed gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1 w-full relative">
                        <span className="font-mono text-slate-800 font-bold w-6">
                          #{i + 1}
                        </span>
                        <div
                          className="flex-1 max-w-[400px] border border-slate-200 rounded-full h-10 px-4 flex items-center justify-between bg-white overflow-hidden shadow-sm hover:border-blue-400 transition cursor-pointer"
                          onClick={() => setIsModalOpen(true)}
                        >
                          <span className="text-slate-400 text-sm">
                            Trẻ nhỏ <span className="text-red-500">(*)</span>
                          </span>
                          <span className="text-[#e11d27] text-sm whitespace-nowrap">
                            Nhập thông tin &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Mã ưu đãi */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="font-bold text-slate-800 w-full md:w-auto">
            Mã ưu đãi
          </div>
          <div className="flex flex-1 w-full gap-2">
            <input
              type="text"
              placeholder="Ví dụ: VIETRAVEL100"
              className="flex-1 h-12 bg-slate-50 border-none rounded-xl px-4 outline-none text-slate-700 font-medium"
            />
            <button className="h-12 bg-slate-200 text-slate-500 font-bold px-6 rounded-xl whitespace-nowrap">
              Áp dụng
            </button>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="font-bold text-slate-800 mb-2">Ghi chú</div>
          <p className="text-slate-500 text-sm mb-4">
            Vui lòng cho chúng tôi biết nếu Quý khách có ghi chú hoặc yêu cầu
            đặc biệt.
          </p>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            className="w-full h-32 bg-slate-50 border-none rounded-xl p-4 outline-none text-slate-700 resize-none font-medium"
            placeholder="Nhập ghi chú..."
          ></textarea>
        </section>
      </div>

      {/* RIGHT COLUMN (STICKY SUMMARY) */}
      <div className="w-full lg:w-[400px] shrink-0 sticky top-24 space-y-6">
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Tóm tắt đơn hàng
          </h2>
          <div className="flex gap-4 items-start mb-6 border-b border-slate-100 pb-6">
            <OptimizedImage
              src={session.coverImage}
              alt="Cover"
              className="w-24 h-24 object-cover rounded-xl shrink-0"
            />
            <div>
              <div className="font-bold text-slate-800 text-sm mb-2 leading-snug">
                {session.tourTitle}
              </div>
              <div className="text-xs text-blue-500 font-medium flex items-center gap-1 bg-blue-50 w-max px-2 py-1 rounded">
                Ticket <span className="text-blue-400">|</span>{" "}
                {session.scheduleCode}
              </div>
            </div>
          </div>

          {/* Flights Expansion */}
          {session.tourTitle.includes("VMB") ||
          session.tourTitle.includes("Tour") ? (
            <div className="border-b border-slate-100 pb-4 mb-4">
              <div
                className="flex items-center justify-between cursor-pointer mb-4"
                onClick={() => setFlightInfoOpen(!flightInfoOpen)}
              >
                <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                  <Plane size={16} /> Thông tin chuyển xe
                </div>
                {flightInfoOpen ? (
                  <ChevronUp size={16} className="text-slate-400" />
                ) : (
                  <ChevronDown size={16} className="text-slate-400" />
                )}
              </div>

              {flightInfoOpen && (
                <div className="space-y-4 mt-2">
                  {/* Outbound */}
                  <div>
                    <div className="flex justify-between text-slate-500 text-sm mb-2">
                      <div>
                        Ngày đi:{" "}
                        <span className="font-bold text-slate-700">
                          05/06/2026
                        </span>
                      </div>
                      <div className="text-accent font-bold flex items-center gap-1 text-xs">
                        <Bus size={14} /> Xe khách
                      </div>
                    </div>
                    <div className="flex justify-between font-bold text-slate-800 text-sm">
                      <span>05:00</span>
                      <span className="text-right">15:00</span>
                    </div>
                    <div className="flex justify-between items-center my-1 relative">
                      <div className="h-[1px] w-full border-b border-dashed border-slate-300 absolute top-1/2 -z-10"></div>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>TP. Hồ Chí Minh</span>
                      <span className="text-right">Đang cập nhật</span>
                    </div>
                  </div>

                  {/* Inbound */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex justify-between text-slate-500 text-sm mb-2">
                      <div>
                        Ngày về:{" "}
                        <span className="font-bold text-slate-700">
                          07/06/2026
                        </span>
                      </div>
                      <div className="text-accent font-bold flex items-center gap-1 text-xs">
                        <Bus size={14} /> Xe khách
                      </div>
                    </div>
                    <div className="flex justify-between font-bold text-slate-800 text-sm">
                      <span>15:00</span>
                      <span className="text-right">05:00</span>
                    </div>
                    <div className="flex justify-between items-center my-1 relative">
                      <div className="h-[1px] w-full border-b border-dashed border-slate-300 absolute top-1/2 -z-10"></div>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Đang cập nhật</span>
                      <span className="text-right">TP. Hồ Chí Minh</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Cost Expansion */}
          <div className="border-b border-slate-100 pb-4 mb-4">
            <div
              className="flex items-center justify-between cursor-pointer mb-4"
              onClick={() => setCostInfoOpen(!costInfoOpen)}
            >
              <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                <MapPin size={16} /> Chi tiết chi phí
              </div>
              {costInfoOpen ? (
                <ChevronUp size={16} className="text-slate-400" />
              ) : (
                <ChevronDown size={16} className="text-slate-400" />
              )}
            </div>
            {costInfoOpen && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Người lớn</span>
                  <span className="text-slate-800">
                    <span className="text-slate-400 mr-2">{adults} x</span>{" "}
                    {formatMoney(session.adultPrice)}
                  </span>
                </div>
                {children > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Trẻ em</span>
                    <span className="text-slate-800">
                      <span className="text-slate-400 mr-2">{children} x</span>{" "}
                      {formatMoney(session.childPrice)}
                    </span>
                  </div>
                )}
                {false /* toddlers > 0 */ && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Trẻ nhỏ</span>
                    <span className="text-slate-800">
                      <span className="text-slate-400 mr-2">{0} x</span>{" "}
                      {formatMoney(session.infantPrice)}
                    </span>
                  </div>
                )}

                {singleRoomsCount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Phụ thu phòng đơn</span>
                    <span className="text-slate-800">
                      <span className="text-slate-400 mr-2">
                        {singleRoomsCount} x
                      </span>{" "}
                      {formatMoney(singleSupplementPrice)}
                    </span>
                  </div>
                )}
                {infants > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Em bé</span>
                    <span className="text-slate-800">
                      <span className="text-slate-400 mr-2">{infants} x</span>{" "}
                      0đ
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-bold text-slate-800">Tổng tiền</span>
            <span className="text-2xl font-bold text-[#e11d27]">
              {formatMoney(totalCost)}
            </span>
          </div>

          <label className="flex gap-3 mb-6 cursor-pointer items-start">
            <input
              type="checkbox"
              className="mt-1 flex-shrink-0 flex text-blue-500 rounded border-slate-300"
              defaultChecked
            />
            <span className="text-xs text-slate-600 leading-relaxed font-medium">
              Tôi đồng ý với{" "}
              <a href="#" className="text-blue-500 font-bold hover:underline">
                Chính sách bảo vệ dữ liệu cá nhân
              </a>{" "}
              và{" "}
              <a href="#" className="text-blue-500 font-bold hover:underline">
                Các điều khoản
              </a>
            </span>
          </label>

          <div className="flex items-center gap-3">
            <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shrink-0 shadow-sm border border-blue-600">
              <Phone size={20} />
            </button>
            <button
              className={`flex-1 font-bold h-12 rounded-full transition-colors shadow-sm flex items-center justify-center gap-2 ${
                !contactName || !contactPhone || !contactEmail
                  ? "bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed"
                  : "bg-[#e11d27] hover:bg-red-700 text-white disabled:opacity-50"
              }`}
              onClick={handleNext}
              disabled={
                createMutation.isPending ||
                !contactName ||
                !contactPhone ||
                !contactEmail
              }
            >
              {createMutation.isPending ? (
                <Loader2 size={20} className="animate-spin" />
              ) : !contactName || !contactPhone || !contactEmail ? (
                "Chưa nhập đủ thông tin"
              ) : (
                "Tiếp tục"
              )}
            </button>
          </div>
        </section>
      </div>

      {/* MODAL: NHẬP THÔNG TIN HÀNH KHÁCH */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 animate-in fade-in zoom-in-95 duration-200 scale-90 md:scale-100">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-xl font-bold text-slate-800">
                Thông tin hành khách
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 transition p-2 rounded-full hover:bg-slate-50"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto bg-[#f8f9fa] custom-scrollbar flex-1 space-y-6">
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 text-blue-500 text-sm mb-2">
                Phòng đơn dành cho khách hàng từ 12 tuổi trở lên, giá phòng đơn
                là:{" "}
                <a href="#" className="font-bold underline hover:text-blue-700">
                  {formatMoney(singleSupplementPrice)} / phòng
                </a>
              </div>

              {/* Người lớn */}
              {adults > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <div className="font-bold text-blue-600 flex items-center gap-2 mb-6">
                    <UserCircle size={18} /> Người lớn{" "}
                    <span className="text-slate-400 font-normal text-sm">
                      {" "}
                      (Người lớn sinh trước ngày 04/06/2014)
                    </span>
                  </div>

                  <div className="space-y-6">
                    {adultPassengers.map((p, i) => (
                      <div
                        key={`modal-ad-${i}`}
                        className="flex gap-4 border-b border-slate-100 pb-6 last:border-0 last:pb-0"
                      >
                        <div className="font-bold text-slate-800 w-6 shrink-0 mt-8">
                          #{i + 1}
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                              Họ tên <span className="text-red-500">(*)</span>
                            </label>
                            <input
                              type="text"
                              value={p.fullName}
                              onChange={(e) => {
                                const newP = [...adultPassengers];
                                newP[i].fullName = e.target.value;
                                setAdultPassengers(newP);
                              }}
                              placeholder="Ví dụ: Nguyễn Văn A"
                              className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 focus:ring-2 focus:ring-blue-100 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                              Ngày sinh{" "}
                              <span className="text-red-500">(*)</span>
                            </label>
                            <div
                              className="flex h-12 bg-slate-50 rounded-xl overflow-hidden px-2 gap-1"
                              style={{ border: "none" }}
                            >
                              <input
                                type="text"
                                value={p.day}
                                onChange={(e) => {
                                  const newP = [...adultPassengers];
                                  newP[i].day = e.target.value;
                                  setAdultPassengers(newP);
                                }}
                                placeholder="dd"
                                className="w-full bg-transparent outline-none text-center"
                                maxLength={2}
                              />
                              <span className="text-slate-300 self-center">
                                /
                              </span>
                              <input
                                type="text"
                                value={p.month}
                                onChange={(e) => {
                                  const newP = [...adultPassengers];
                                  newP[i].month = e.target.value;
                                  setAdultPassengers(newP);
                                }}
                                placeholder="mm"
                                className="w-full bg-transparent outline-none text-center"
                                maxLength={2}
                              />
                              <span className="text-slate-300 self-center">
                                /
                              </span>
                              <input
                                type="text"
                                value={p.year}
                                onChange={(e) => {
                                  const newP = [...adultPassengers];
                                  newP[i].year = e.target.value;
                                  setAdultPassengers(newP);
                                }}
                                placeholder="yyyy"
                                className="w-full bg-transparent outline-none text-center"
                                maxLength={4}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                              Giới tính{" "}
                              <span className="text-red-500">(*)</span>
                            </label>
                            <div className="relative">
                              <select
                                value={p.gender}
                                onChange={(e) => {
                                  const newP = [...adultPassengers];
                                  newP[i].gender = e.target.value;
                                  setAdultPassengers(newP);
                                }}
                                className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 appearance-none outline-none focus:ring-2 focus:ring-blue-100 pr-10"
                              >
                                <option>Nam</option>
                                <option>Nữ</option>
                              </select>
                              <ChevronDown
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                size={16}
                              />
                            </div>
                          </div>

                          <div className="md:col-span-2 flex items-center justify-between">
                            <div className="flex-1 mr-4">
                              <label className="block text-sm font-bold text-slate-700 mb-2">
                                Số điện thoại
                              </label>
                              <input
                                type="text"
                                value={p.phone}
                                onChange={(e) => {
                                  const newP = [...adultPassengers];
                                  newP[i].phone = e.target.value;
                                  setAdultPassengers(newP);
                                }}
                                placeholder="Ví dụ: 0901234567 / +84901234567"
                                className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 focus:ring-2 focus:ring-blue-100 outline-none"
                              />
                            </div>
                            <div className="flex flex-col items-center">
                              <label className="block text-sm font-bold text-slate-700 mb-2">
                                Phòng đơn
                              </label>
                              <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                                <input
                                  type="checkbox"
                                  checked={!!adultSingleFlags[i]}
                                  onChange={() => toggleSingleRoom(i)}
                                  className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300"
                                  style={{ top: "1px", left: "1px" }}
                                />
                                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer"></label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trẻ em */}
              {children > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-dashed">
                  <div className="font-bold text-blue-600 flex items-center gap-2 mb-6">
                    <UserCircle size={18} /> Trẻ em{" "}
                    <span className="text-slate-400 font-normal text-sm">
                      {" "}
                      (Trẻ em sinh từ 05/06/2014 đến 04/06/2021)
                    </span>
                  </div>

                  <div className="space-y-6">
                    {childPassengers.map((p, i) => (
                      <div
                        key={`modal-child-${i}`}
                        className="flex gap-4 border-b border-slate-100 pb-6 last:border-0 last:pb-0"
                      >
                        <div className="font-bold text-slate-800 w-6 shrink-0 mt-8">
                          #{i + 1}
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                              Họ tên <span className="text-red-500">(*)</span>
                            </label>
                            <input
                              type="text"
                              value={p.fullName}
                              onChange={(e) => {
                                const newP = [...childPassengers];
                                newP[i].fullName = e.target.value;
                                setChildPassengers(newP);
                              }}
                              placeholder="Ví dụ: Nguyễn Văn A"
                              className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 focus:ring-2 focus:ring-blue-100 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                              Ngày sinh{" "}
                              <span className="text-red-500">(*)</span>
                            </label>
                            <div
                              className="flex h-12 bg-slate-50 rounded-xl overflow-hidden px-2 gap-1"
                              style={{ border: "none" }}
                            >
                              <input
                                type="text"
                                value={p.day}
                                onChange={(e) => {
                                  const newP = [...childPassengers];
                                  newP[i].day = e.target.value;
                                  setChildPassengers(newP);
                                }}
                                placeholder="dd"
                                className="w-full bg-transparent outline-none text-center"
                                maxLength={2}
                              />
                              <span className="text-slate-300 self-center">
                                /
                              </span>
                              <input
                                type="text"
                                value={p.month}
                                onChange={(e) => {
                                  const newP = [...childPassengers];
                                  newP[i].month = e.target.value;
                                  setChildPassengers(newP);
                                }}
                                placeholder="mm"
                                className="w-full bg-transparent outline-none text-center"
                                maxLength={2}
                              />
                              <span className="text-slate-300 self-center">
                                /
                              </span>
                              <input
                                type="text"
                                value={p.year}
                                onChange={(e) => {
                                  const newP = [...childPassengers];
                                  newP[i].year = e.target.value;
                                  setChildPassengers(newP);
                                }}
                                placeholder="yyyy"
                                className="w-full bg-transparent outline-none text-center"
                                maxLength={4}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                              Giới tính{" "}
                              <span className="text-red-500">(*)</span>
                            </label>
                            <div className="relative">
                              <select
                                value={p.gender}
                                onChange={(e) => {
                                  const newP = [...childPassengers];
                                  newP[i].gender = e.target.value;
                                  setChildPassengers(newP);
                                }}
                                className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 appearance-none outline-none focus:ring-2 focus:ring-blue-100 pr-10"
                              >
                                <option>Nam</option>
                                <option>Nữ</option>
                              </select>
                              <ChevronDown
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                size={16}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trẻ nhỏ */}
              {false /* toddlers > 0 */ && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-dashed">
                  <div className="font-bold text-blue-600 flex items-center gap-2 mb-6">
                    <UserCircle size={18} /> Trẻ nhỏ{" "}
                    <span className="text-slate-400 font-normal text-sm">
                      {" "}
                      (Trẻ nhỏ sinh từ 05/06/2021 đến 04/06/2024)
                    </span>
                  </div>

                  <div className="space-y-6">
                    {([] as any[]).map((_, i) => (
                      <div
                        key={`modal-tod-${i}`}
                        className="flex gap-4 border-b border-slate-100 pb-6 last:border-0 last:pb-0"
                      >
                        <div className="font-bold text-slate-800 w-6 shrink-0 mt-8">
                          #{i + 1}
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                              Họ tên <span className="text-red-500">(*)</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Ví dụ: Nguyễn Văn A"
                              className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 focus:ring-2 focus:ring-blue-100 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                              Ngày sinh{" "}
                              <span className="text-red-500">(*)</span>
                            </label>
                            <div
                              className="flex h-12 bg-slate-50 rounded-xl overflow-hidden px-2 gap-1"
                              style={{ border: "none" }}
                            >
                              <input
                                type="text"
                                placeholder="dd"
                                className="w-full bg-transparent outline-none text-center"
                                maxLength={2}
                              />
                              <span className="text-slate-300 self-center">
                                /
                              </span>
                              <input
                                type="text"
                                placeholder="mm"
                                className="w-full bg-transparent outline-none text-center"
                                maxLength={2}
                              />
                              <span className="text-slate-300 self-center">
                                /
                              </span>
                              <input
                                type="text"
                                placeholder="yyyy"
                                className="w-full bg-transparent outline-none text-center"
                                maxLength={4}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                              Giới tính{" "}
                              <span className="text-red-500">(*)</span>
                            </label>
                            <div className="relative">
                              <select className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 appearance-none outline-none focus:ring-2 focus:ring-blue-100 pr-10">
                                <option>Nam</option>
                                <option>Nữ</option>
                              </select>
                              <ChevronDown
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                size={16}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 md:p-6 border-t border-slate-100 bg-white flex justify-center gap-4 shrink-0 shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)] z-20 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-8 h-12 rounded-full border border-slate-300 font-bold text-slate-600 hover:bg-slate-50 transition min-w-[140px]"
              >
                Đặt lại
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-8 h-12 rounded-full bg-blue-600 hover:bg-blue-700 font-bold text-white transition min-w-[140px] shadow-sm"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
