import { useMemo, useState } from "react";
import { type TourCheckoutSession } from "../../lib/TourCheckoutStorage";
import { Copy, ChevronDown, Bus } from "lucide-react";
import { OptimizedImage } from "@/components/common/media/OptimizedImage";
import PaymentMethodModal from "./PaymentMethodModal";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

function generateBookingCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

import { useQuery } from "@tanstack/react-query";
import { PublicBookingsApi } from "../../../bookings/api/publicBookings.api";

export default function TourPayment({
  session,
  bookingId,
  onBack,
  onSuccess,
}: {
  session: TourCheckoutSession;
  bookingId: number;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const { data: realBooking } = useQuery({
    queryKey: ["public-booking", bookingId],
    queryFn: () => PublicBookingsApi.detail(bookingId),
    enabled: !!bookingId,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const staticFakeCode = useMemo(() => generateBookingCode(), []);
  const staticFakeDate = useMemo(() => new Date(), []);

  const bookingCode = realBooking?.bookingCode || staticFakeCode;
  const creationDate = realBooking?.createdAt
    ? new Date(realBooking.createdAt)
    : staticFakeDate;

  const formatDate = (d: Date) => {
    const pad = (num: number) => num.toString().padStart(2, "0");
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    const hours = pad(d.getHours());
    const mins = pad(d.getMinutes());
    return `${day}/${month}/${year} ${hours}:${mins}`;
  };

  const deadlineDate = new Date(creationDate.getTime() + 15 * 60000); // 15 mins exact

  const dummyPrice = realBooking?.totalAmount ?? session.adultPrice; // Dummy total

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* LEFT COLUMN */}
      <div className="flex-1 w-full space-y-6">
        {/* Contact Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3 font-bold text-xl text-slate-800">
            Thông tin liên lạc
          </div>
          <div>
            <div className="text-slate-500 text-sm mb-1">Họ tên:</div>
            <div className="font-bold text-slate-800 text-sm">
              ********* Tung
            </div>
          </div>
          <div>
            <div className="text-slate-500 text-sm mb-1">Email:</div>
            <div className="font-bold text-slate-800 text-sm">
              *****@gmail.com
            </div>
          </div>
          <div>
            <div className="text-slate-500 text-sm mb-1">Điện thoại:</div>
            <div className="font-bold text-slate-800 text-sm">*******301</div>
          </div>
          <div className="md:col-span-3">
            <div className="text-slate-500 text-sm mb-1">Ghi chú:</div>
            <div className="font-bold text-slate-800 text-sm">
              scvbsdb (Booking từ Travel.com.vn)
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="font-bold text-xl text-slate-800 mb-6">
            Chi tiết booking
          </div>

          <div className="space-y-4">
            {/* Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-sm border-b border-slate-50 pb-4 border-dashed">
              <div className="sm:col-span-4 text-slate-600 font-medium">
                Mã đặt chỗ:
              </div>
              <div className="sm:col-span-8 flex items-center gap-3">
                <span className="font-bold text-[#e11d27]">{bookingCode}</span>
                <button className="flex items-center gap-1 text-slate-400 bg-slate-50 px-2 py-1 rounded text-xs hover:text-blue-500 hover:bg-blue-50 transition-colors">
                  <Copy className="w-3 h-3" /> Sao chép
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-sm border-b border-slate-50 pb-4 border-dashed">
              <div className="sm:col-span-4 text-slate-600 font-medium">
                Ngày tạo:
              </div>
              <div className="sm:col-span-8 font-bold text-slate-800">
                {formatDate(creationDate)}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-sm border-b border-slate-50 pb-4 border-dashed">
              <div className="sm:col-span-4 text-slate-600 font-medium">
                Trị giá booking:
              </div>
              <div className="sm:col-span-8 font-bold text-slate-800">
                {formatMoney(dummyPrice)}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-sm border-b border-slate-50 pb-4 border-dashed">
              <div className="sm:col-span-4 text-slate-600 font-medium">
                Số tiền đã thanh toán:
              </div>
              <div className="sm:col-span-8 font-bold text-slate-800">0đ</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-sm border-b border-slate-50 pb-4 border-dashed">
              <div className="sm:col-span-4 text-slate-600 font-medium">
                Số tiền còn lại:
              </div>
              <div className="sm:col-span-8 font-bold text-slate-800">
                {formatMoney(dummyPrice)}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-sm border-b border-slate-50 pb-4 border-dashed">
              <div className="sm:col-span-4 text-slate-600 font-medium">
                Tình trạng:
              </div>
              <div className="sm:col-span-8 font-bold text-slate-800">
                Booking của quý khách đã được chúng tôi xác nhận thành công
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-sm">
              <div className="sm:col-span-4 text-slate-600 font-medium">
                Thời hạn thanh toán:
              </div>
              <div className="sm:col-span-8 font-bold text-[#e11d27]">
                {formatDate(deadlineDate)} - (Theo giờ Việt Nam. Booking sẽ tự
                động hủy nếu quá thời hạn thanh toán trên)
              </div>
            </div>
          </div>
        </div>

        {/* Passenger List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-12">
          <div className="flex justify-between items-center mb-6">
            <div className="font-bold text-xl text-slate-800">
              Danh sách hành khách
            </div>
            <ChevronDown size={20} className="text-slate-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-200">
                <tr>
                  <th className="pb-3 font-semibold border-b-2 border-blue-500 w-10"></th>
                  <th className="pb-3 font-semibold pb-3 font-medium">
                    Họ tên
                  </th>
                  <th className="pb-3 font-semibold pb-3 font-medium text-center">
                    Ngày sinh
                  </th>
                  <th className="pb-3 font-semibold pb-3 font-medium text-center">
                    Giới tính
                  </th>
                  <th className="pb-3 font-semibold pb-3 font-medium text-center">
                    Độ tuổi
                  </th>
                  <th className="pb-3 font-semibold pb-3 font-medium text-center">
                    Phòng đơn
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-50 border-dashed">
                  <td className="py-4 font-mono text-slate-400">#1</td>
                  <td className="py-4 font-bold text-slate-800">**** tung</td>
                  <td className="py-4 text-center">*/*/*/2009</td>
                  <td className="py-4 text-center">Nam</td>
                  <td className="py-4 text-center">Người lớn</td>
                  <td className="py-4 text-center">Có</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN (STICKY SUMMARY) */}
      <div className="w-full lg:w-[400px] shrink-0 sticky top-24 space-y-6">
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col relative overflow-hidden">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Phiếu xác nhận booking
          </h2>
          <div className="flex gap-4 items-start mb-6 border-b border-slate-100 pb-6">
            <OptimizedImage
              src={session.coverImage}
              alt="Cover"
              className="w-24 h-24 object-cover rounded-xl shrink-0"
            />
            <div>
              <div className="font-bold text-slate-800 text-sm mb-2 leading-snug">
                {session.tourTitle.substring(0, 60)}...
              </div>
              <div className="text-xs text-blue-500 font-medium flex items-center gap-1 bg-blue-50 w-max px-2 py-1 rounded">
                Ticket <span className="text-blue-400">|</span>{" "}
                {session.scheduleCode}
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                <Bus size={16} /> Thông tin chuyển xe
              </div>
              <ChevronDown size={16} className="text-slate-400" />
            </div>

            <div className="space-y-4 mt-2">
              {/* Outbound */}
              <div>
                <div className="flex justify-between text-slate-500 text-sm mb-2">
                  <div>
                    Ngày đi:{" "}
                    <span className="font-bold text-slate-700">05/06/2026</span>
                  </div>
                  <div className="text-orange-500 font-bold flex items-center gap-1 text-xs">
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
                    <span className="font-bold text-slate-700">07/06/2026</span>
                  </div>
                  <div className="text-orange-500 font-bold flex items-center gap-1 text-xs">
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
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-bold text-slate-800">Tổng tiền</span>
            <span className="text-2xl font-bold text-[#e11d27]">
              {formatMoney(dummyPrice)}
            </span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-[#e11d27] hover:bg-red-700 text-white font-bold h-12 rounded-full transition-colors shadow-sm"
          >
            Thanh toán ngay
          </button>
        </section>
      </div>

      <PaymentMethodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={onSuccess}
      />
    </div>
  );
}
