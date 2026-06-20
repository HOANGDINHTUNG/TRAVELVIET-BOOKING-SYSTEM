import { Link, useLocation } from "react-router-dom";
import { FlightCheckoutStepper } from "../components/FlightCheckoutStepper";
import { useQuery } from "@tanstack/react-query";
import { PublicBookingsApi } from "../../bookings/api/publicBookings.api";
import "./FlightPaymentSuccessPage.css";

export default function FlightPaymentSuccessPage() {
  const location = useLocation();
  const bookingId = location.state?.bookingId;

  const { data: realBooking } = useQuery({
    queryKey: ["public-booking", bookingId],
    queryFn: () => PublicBookingsApi.detail(bookingId as number),
    enabled: !!bookingId,
  });

  return (
    <div className="fps-page">
      <div className="fps-stepper-wrap">
        <FlightCheckoutStepper current={3} />
      </div>
      <div className="fps-card">
        <h1>Thanh toán thành công</h1>
        <p>Hệ thống đã ghi nhận giao dịch và tạo đơn hàng chuyến bay.</p>

        {realBooking ? (
          <div className="fps-receipt">
            <p>
              <strong>Mã đặt chỗ:</strong>{" "}
              {realBooking.bookingCode || `FLI-${realBooking.id}`}
            </p>
            <p>
              <strong>Trị giá:</strong>{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(realBooking.finalAmount || 0)}
            </p>
          </div>
        ) : null}

        <div className="fps-actions" style={{ marginTop: 24 }}>
          <Link className="fps-btn" to="/flights">
            Về trang Vé máy bay
          </Link>
          <Link className="fps-link" to="/">
            Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
