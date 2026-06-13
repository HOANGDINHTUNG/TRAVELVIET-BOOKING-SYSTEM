import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Baby,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleUserRound,
  Info,
  Clock,
  BedDouble,
  Receipt,
  ShieldCheck,
  Users,
  Copy,
  Building,
  CheckCircle2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { formatPriceVnd } from "@/utils/formatters";
import { FlightCheckoutStepper } from "@/module/flights/components/FlightCheckoutStepper";
import {
  clearHotelCheckoutSession,
  loadHotelCheckoutSession,
} from "../lib/hotelCheckoutStorage";
import type { HotelCheckoutSession } from "../types/hotelCheckout";
import { useCreateHotelBooking } from "../../bookings/hooks/useBookingMutation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import "@/module/flights/pages/FlightCheckoutPage.css"; // Reuse flight CSS patterns
import "./HotelCheckoutPage.css"; // Add custom hotel overrides

type PaymentMethod = "payoo" | "vnpay" | "momo" | "zalopay" | "visa";

function formatMoney(amount: number, locale: string): string {
  return formatPriceVnd(amount, locale).replace("₫", "đ");
}

export default function HotelCheckoutPage() {
  const locale = "vi";
  const navigate = useNavigate();

  const rawSession = useMemo(() => loadHotelCheckoutSession(), []);
  const [now, setNow] = useState(() => Date.now());
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [bookingId, setBookingId] = useState<number | null>(null);

  const createMutation = useCreateHotelBooking();

  // Modals
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [method, setMethod] = useState<PaymentMethod | null>(null);

  // Accordions
  const [hotelOpen, setHotelOpen] = useState(true);
  const [costOpen, setCostOpen] = useState(true);

  // Form State
  const [contact, setContact] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });
  const [invoiceRequested, setInvoiceRequested] = useState(false);
  const [specialRequest, setSpecialRequest] = useState("");
  const [checkinIntended, setCheckinIntended] = useState(false);
  const [checkinTime, setCheckinTime] = useState("14:00");
  const [checkoutTime, setCheckoutTime] = useState("12:00");
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!rawSession) {
      navigate("/hotels/search", { replace: true });
    }
  }, [navigate, rawSession]);

  if (!rawSession) return null;

  const session = rawSession;
  const remainMs = Math.max(0, session.holdExpiresAtMs - now);
  const mm = String(Math.floor(remainMs / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remainMs % 60000) / 1000)).padStart(2, "0");
  const expired = remainMs <= 0;

  const totalText = formatMoney(session.totalAmountVnd, locale);

  const contactValid =
    contact.fullName.trim().length >= 2 &&
    /^\+?[0-9\s-]{10,14}$/.test(contact.phone) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email);

  const canProceed = contactValid && termsAccepted && !expired;

  return (
    <div className="fc-page">
      <div className="fc-hold-banner">
        <span>
          Thời gian giữ chỗ -{" "}
          <strong>
            {mm}:{ss}
          </strong>
        </span>
        {expired ? (
          <span className="fc-hold-banner__expired">Hết thời gian giữ chỗ</span>
        ) : null}
      </div>

      <div className="fc-wrap">
        <header className="fc-page-head">
          <div className="fc-page-head__top">
            <div className="fc-page-head__intro">
              <h1 className="fc-page-head__title">Đơn hàng của bạn</h1>
              <p className="fc-page-head__sub">
                {checkoutStep === 1
                  ? "Hãy đảm bảo tất cả thông tin chi tiết trên trang này đã chính xác trước khi tiến hành thanh toán."
                  : "Hãy đảm bảo tất cả thông tin đều chính xác trước khi tiếp tục."}
              </p>
            </div>
            <FlightCheckoutStepper current={checkoutStep} />
          </div>
        </header>

        <div className="fc-inner">
          <main className="fc-main">
            {checkoutStep === 1 && (
              <>
                <section className="fc-card">
                  <h2 className="fc-card__title">Thông tin liên lạc</h2>
                  <div
                    className="fc-login-banner"
                    style={{
                      backgroundColor: "#eef8ff",
                      color: "#0066cc",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      padding: "12px 16px",
                      marginBottom: "16px",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    <Info
                      size={16}
                      style={{ marginRight: "8px", flexShrink: 0 }}
                    />
                    <span style={{ flex: 1 }}>
                      <Link
                        to="/login"
                        style={{
                          textDecoration: "underline",
                          color: "inherit",
                          marginRight: "4px",
                        }}
                      >
                        Đăng nhập
                      </Link>{" "}
                      để nhận ưu đãi, tích điểm và quản lý đơn hàng dễ dàng hơn!
                    </span>
                  </div>
                  <div className="fc-form-grid">
                    <label className="fc-field">
                      <span className="fc-label">
                        Họ tên <span className="fc-required">(*)</span>
                      </span>
                      <input
                        value={contact.fullName}
                        onChange={(e) =>
                          setContact((p) => ({
                            ...p,
                            fullName: e.target.value,
                          }))
                        }
                        placeholder="Ví dụ: Nguyễn Văn A"
                      />
                    </label>
                    <label className="fc-field">
                      <span className="fc-label">
                        Số điện thoại <span className="fc-required">(*)</span>
                      </span>
                      <input
                        value={contact.phone}
                        onChange={(e) =>
                          setContact((p) => ({ ...p, phone: e.target.value }))
                        }
                        placeholder="Ví dụ: 0901234567 / +84901234567"
                      />
                    </label>
                    <label className="fc-field">
                      <span className="fc-label">
                        Email <span className="fc-required">(*)</span>
                      </span>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) =>
                          setContact((p) => ({ ...p, email: e.target.value }))
                        }
                        placeholder="Ví dụ: email@example.com"
                      />
                    </label>
                    <label className="fc-field">
                      <span className="fc-label">Địa chỉ</span>
                      <input
                        value={contact.address}
                        onChange={(e) =>
                          setContact((p) => ({ ...p, address: e.target.value }))
                        }
                        placeholder="Ví dụ: 190 Pasteur, Phường Xuân Hòa, TP.HCM"
                      />
                    </label>
                  </div>
                </section>

                <section className="fc-card">
                  <h2 className="fc-card__title">Hóa đơn thanh toán</h2>
                  <label className="fc-check">
                    <input
                      type="checkbox"
                      checked={invoiceRequested}
                      onChange={(e) => setInvoiceRequested(e.target.checked)}
                    />
                    <span style={{ fontSize: "14px" }}>
                      Tôi muốn xuất hóa đơn điện tử
                    </span>
                  </label>
                </section>

                <section className="fc-card">
                  <h2 className="fc-card__title">Số lượng hành khách</h2>
                  <div className="fc-pax-counts">
                    <div className="fc-pax-pill">
                      <Users size={18} className="fc-pax-pill__icon" />
                      <div className="fc-pax-pill__label">
                        <span className="fc-pax-pill__title">Người lớn</span>
                        <span className="fc-pax-pill__hint">
                          Từ 12 tuổi trở lên
                        </span>
                      </div>
                      <span className="fc-pax-pill__value">
                        {session.guests.adults}
                      </span>
                    </div>
                    <div className="fc-pax-pill">
                      <Baby size={18} className="fc-pax-pill__icon" />
                      <div className="fc-pax-pill__label">
                        <span className="fc-pax-pill__title">Trẻ em</span>
                        <span className="fc-pax-pill__hint">
                          Từ 0 - 11 tuổi
                        </span>
                      </div>
                      <span className="fc-pax-pill__value">
                        {session.guests.children}
                      </span>
                    </div>
                  </div>
                </section>

                <section className="fc-card">
                  <h2 className="fc-card__title">Yêu cầu đặc biệt</h2>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#666",
                      marginBottom: "12px",
                      lineHeight: "1.4",
                    }}
                  >
                    Quý khách có yêu cầu đặc biệt? Gửi yêu cầu và khách sạn sẽ
                    cố gắng đáp ứng nguyện vọng của Quý khách. Xin lưu ý yêu cầu
                    đặc biệt không được bảo đảm trước và có thể thu phí
                  </p>
                  <textarea
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder="Ví dụ: Bữa ăn chay, đến muộn, ..."
                    style={{
                      width: "100%",
                      minHeight: "80px",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontFamily: "inherit",
                      fontSize: "14px",
                      resize: "vertical",
                      backgroundColor: "#f9fafb",
                    }}
                  />
                </section>

                <section className="fc-card">
                  <h2 className="fc-card__title">
                    Thời gian dự kiến đến nhận phòng
                  </h2>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#666",
                      marginBottom: "12px",
                    }}
                  >
                    Khách sạn hoặc chủ nhà sẽ được báo trước giờ đến dự kiến để
                    chuẩn bị đón tiếp
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <label className="fc-check" style={{ marginBottom: 0 }}>
                      <input
                        type="checkbox"
                        checked={checkinIntended}
                        onChange={(e) => setCheckinIntended(e.target.checked)}
                      />
                      <span style={{ fontSize: "14px", fontWeight: "500" }}>
                        Tôi đã có dự định nhận phòng
                      </span>
                    </label>
                    {checkinIntended && (
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                        }}
                      >
                        <select
                          value={checkinTime}
                          onChange={(e) => setCheckinTime(e.target.value)}
                          style={{
                            padding: "6px 12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            fontSize: "14px",
                          }}
                        >
                          <option value="12:00">12:00</option>
                          <option value="14:00">14:00</option>
                          <option value="16:00">16:00</option>
                        </select>
                        <span style={{ fontSize: "14px", fontWeight: "500" }}>
                          và trả phòng:
                        </span>
                        <select
                          value={checkoutTime}
                          onChange={(e) => setCheckoutTime(e.target.value)}
                          style={{
                            padding: "6px 12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            fontSize: "14px",
                          }}
                        >
                          <option value="12:00">12:00</option>
                          <option value="14:00">14:00</option>
                        </select>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      padding: "10px",
                      backgroundColor: "#fff5f5",
                      color: "#d93838",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  >
                    <span>
                      *Lưu ý: Yêu cầu nhận phòng dự kiến chỉ được đáp ứng tuỳ
                      tình trạng phòng của khách sạn.
                    </span>
                  </div>
                </section>
              </>
            )}

            {checkoutStep === 2 && (
              <>
                <section className="fc-card" style={{ padding: "16px 20px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "24px",
                      opacity: 0.7,
                      paddingBottom: "16px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#666",
                          marginBottom: "4px",
                        }}
                      >
                        Họ tên:
                      </div>
                      <div style={{ fontWeight: "600", fontSize: "14px" }}>
                        *** {contact.fullName.split(" ").pop()}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#666",
                          marginBottom: "4px",
                        }}
                      >
                        Email:
                      </div>
                      <div style={{ fontWeight: "600", fontSize: "14px" }}>
                        ***{contact.email.substring(contact.email.indexOf("@"))}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#666",
                          marginBottom: "4px",
                        }}
                      >
                        Điện thoại:
                      </div>
                      <div style={{ fontWeight: "600", fontSize: "14px" }}>
                        ***{contact.phone.slice(-3)}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="fc-card">
                  <h2 className="fc-card__title">Thông tin booking</h2>
                  <div
                    className="hc-booking-info-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "140px 1fr",
                      gap: "10px",
                      fontSize: "14px",
                    }}
                  >
                    <div style={{ color: "#666" }}>Mã đặt chỗ:</div>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <strong
                        style={{ color: "#d93838", letterSpacing: "1px" }}
                      >
                        {bookingId ? `HTL-${bookingId}` : "20260530V7DBDR"}
                      </strong>
                      <button
                        style={{
                          display: "flex",
                          gap: "4px",
                          backgroundColor: "#eef8ff",
                          color: "#0066cc",
                          border: "none",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          alignItems: "center",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        <Copy size={12} />
                        Sao chép
                      </button>
                    </div>

                    <div style={{ color: "#666" }}>Ngày tạo:</div>
                    <div style={{ fontWeight: "500" }}>30/05/2026</div>

                    <div style={{ color: "#666" }}>Tình trạng:</div>
                    <div style={{ fontWeight: "600" }}>Chờ thanh toán</div>

                    <div style={{ color: "#666" }}>Thời hạn thanh toán:</div>
                    <div>
                      <span style={{ color: "#d93838", fontWeight: "500" }}>
                        30/05/2026 10:34:51
                      </span>{" "}
                      - (Theo giờ Việt Nam. Booking sẽ tự động hủy nếu quá thời
                      hạn thanh toán trên) -{" "}
                      <span style={{ color: "#d93838", fontWeight: "600" }}>
                        00:{mm}:{ss}
                      </span>
                    </div>

                    <div style={{ color: "#666" }}>Ghi chú:</div>
                    <div>( Booking từ https://travel.com.vn )-</div>
                  </div>
                  <div
                    style={{
                      marginTop: "16px",
                      color: "#d93838",
                      fontSize: "12px",
                      fontStyle: "italic",
                    }}
                  >
                    *Vui lòng liên hệ hotline 1900 646 888 nếu không nhận được
                    email xác nhận sau khi thanh toán thành công.
                  </div>
                </section>

                <section className="fc-card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <h2 className="fc-card__title" style={{ margin: 0 }}>
                      Chi tiết booking
                    </h2>
                    <ChevronUp size={18} color="#999" />
                  </div>

                  <div style={{ padding: "0 0 16px 0", fontSize: "14px" }}>
                    Mã đặt chỗ:{" "}
                    <strong style={{ color: "var(--color-accent)" }}>
                      Đang chờ xác nhận
                    </strong>
                    <p
                      style={{
                        color: "#d93838",
                        fontSize: "12px",
                        marginTop: "8px",
                        lineHeight: "1.5",
                      }}
                    >
                      *Lưu ý: Trong trường hợp đối tác xác nhận không còn phòng
                      thì Vietravel sẽ hoàn trả lại số tiền quý khách đã thanh
                      toán trong vòng 48 giờ. Mọi chi tiết xin liên hệ tổng đài
                      1900 646 888.
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "16px",
                      border: "1px solid #eee",
                      borderRadius: "8px",
                      display: "flex",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        width: "160px",
                        height: "100px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        src={session.hotel.imageUrl || session.room.imageUrl}
                        alt={session.hotel.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          background: "rgba(0,0,0,0.6)",
                          color: "white",
                          fontSize: "10px",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        Your best bleisure stay
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          margin: "0 0 4px 0",
                        }}
                      >
                        {session.hotel.name}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          marginBottom: "12px",
                        }}
                      >
                        {Array.from({ length: session.hotel.starRating }).map(
                          (_, i) => (
                            <span
                              key={i}
                              style={{ color: "#fbbf24", fontSize: "14px" }}
                            >
                              ★
                            </span>
                          ),
                        )}
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#0066cc",
                            marginLeft: "4px",
                          }}
                        >
                          📍 {session.hotel.address}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          fontSize: "13px",
                          color: "#555",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <Clock size={14} /> Nhận phòng: {session.checkInDate}{" "}
                          - 14:00
                        </div>
                        <div
                          style={{
                            borderLeft: "1px solid #ddd",
                            height: "16px",
                          }}
                        ></div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <Clock size={14} /> Trả phòng: {session.checkOutDate}{" "}
                          - 12:00
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="fc-card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <h2 className="fc-card__title" style={{ margin: 0 }}>
                      Chi tiết phiếu thu
                    </h2>
                    <ChevronUp size={18} color="#999" />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        gap: "6px",
                        backgroundColor: "#eef8ff",
                        color: "#0066cc",
                        padding: "4px 12px",
                        borderRadius: "100px",
                        fontSize: "12px",
                        fontWeight: "600",
                        marginBottom: "12px",
                        alignItems: "center",
                      }}
                    >
                      <Building size={12} /> Khách sạn
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "14px",
                        fontWeight: "500",
                        padding: "8px 0",
                      }}
                    >
                      <span>• {session.hotel.name}:</span>
                      <span style={{ color: "#d93838" }}>
                        {formatMoney(
                          session.totalAmountVnd -
                            session.taxAmountVnd -
                            session.feeAmountVnd,
                          locale,
                        )}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 80px 80px 100px 100px",
                        fontSize: "13px",
                        color: "#555",
                        padding: "8px 0",
                      }}
                    >
                      <div>{session.room.name}</div>
                      <div style={{ textAlign: "center" }}>
                        {session.guests.rooms} phòng
                      </div>
                      <div style={{ textAlign: "center" }}>1 đêm</div>
                      <div style={{ textAlign: "right", color: "#111" }}>
                        {formatMoney(
                          session.totalAmountVnd -
                            session.taxAmountVnd -
                            session.feeAmountVnd,
                          locale,
                        )}
                      </div>
                      <div style={{ textAlign: "right", color: "#111" }}>
                        {formatMoney(
                          session.totalAmountVnd -
                            session.taxAmountVnd -
                            session.feeAmountVnd,
                          locale,
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      borderTop: "1px dashed #eee",
                      paddingTop: "16px",
                      paddingBottom: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        gap: "6px",
                        backgroundColor: "#eef8ff",
                        color: "#0066cc",
                        padding: "4px 12px",
                        borderRadius: "100px",
                        fontSize: "12px",
                        fontWeight: "600",
                        marginBottom: "12px",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "14px" }}>%</span> Thuế & phí
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "14px",
                        fontWeight: "500",
                        padding: "8px 0",
                      }}
                    >
                      <span>• Tổng chi phí phụ thu:</span>
                      <span style={{ color: "#d93838" }}>
                        {formatMoney(
                          session.taxAmountVnd + session.feeAmountVnd,
                          locale,
                        )}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "13px",
                        color: "#555",
                        padding: "4px 0 4px 16px",
                      }}
                    >
                      <span>Thuế GTGT</span>
                      <span style={{ color: "#111" }}>
                        {formatMoney(session.taxAmountVnd, locale)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "13px",
                        color: "#555",
                        padding: "4px 0 4px 16px",
                      }}
                    >
                      <span>Phụ thu quản trị</span>
                      <span style={{ color: "#111" }}>
                        {formatMoney(session.feeAmountVnd, locale)}
                      </span>
                    </div>
                  </div>
                </section>
              </>
            )}
          </main>

          <aside className="fc-side">
            <section className="fc-card fc-card--side">
              <h2 className="fc-card__title">Tóm tắt đơn hàng</h2>

              <button
                type="button"
                className="fc-accordion"
                onClick={() => setHotelOpen((o) => !o)}
                aria-expanded={hotelOpen}
              >
                <span className="fc-accordion__label">
                  <Building
                    size={16}
                    className="fc-accordion__icon fc-accordion__icon--blue"
                  />
                  Thông tin khách sạn
                </span>
                {hotelOpen ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
              {hotelOpen ? (
                <div className="fc-accordion__body">
                  <div className="fc-flight-line">
                    <strong style={{ fontSize: "14px" }}>
                      {session.hotel.name}
                    </strong>
                    <span style={{ color: "#555" }}>{session.room.name}</span>
                    <span
                      className="fc-flight-line__fare"
                      style={{ marginTop: "8px" }}
                    >
                      {session.ratePlan.title}
                    </span>
                  </div>
                </div>
              ) : null}

              <button
                type="button"
                className="fc-accordion"
                onClick={() => setCostOpen((o) => !o)}
                aria-expanded={costOpen}
              >
                <span className="fc-accordion__label">
                  <Receipt
                    size={16}
                    className="fc-accordion__icon fc-accordion__icon--blue"
                  />
                  Chi tiết chi phí
                </span>
                {costOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {costOpen ? (
                <div className="fc-accordion__body fc-accordion__body--costs">
                  <div className="fc-cost-row">
                    <span>Giá phòng:</span>
                    <span
                      className="fc-cost-row__qty"
                      style={{ width: "auto" }}
                    >
                      {session.guests.rooms} phòng x 1 đêm x
                    </span>
                    <span className="fc-cost-row__price">
                      {formatMoney(
                        session.totalAmountVnd -
                          session.taxAmountVnd -
                          session.feeAmountVnd,
                        locale,
                      )}
                    </span>
                  </div>
                  <div className="fc-cost-row" style={{ marginTop: "8px" }}>
                    <span>Thuế và các khoản phí:</span>
                    <span className="fc-cost-row__price">
                      {formatMoney(session.taxAmountVnd, locale)}
                    </span>
                  </div>
                  <div className="fc-cost-row" style={{ marginTop: "4px" }}>
                    <span>Phụ thu quản trị:</span>
                    <span className="fc-cost-row__price">
                      {formatMoney(session.feeAmountVnd, locale)}
                    </span>
                  </div>
                </div>
              ) : null}
            </section>

            <section
              className="fc-card fc-card--side fc-card--total"
              style={{ borderTop: "none" }}
            >
              <div className="fc-total-row">
                <span
                  className="fc-total-row__label"
                  style={{ fontSize: "16px" }}
                >
                  Tổng tiền
                </span>
                <strong
                  className="fc-total-row__value"
                  style={{ fontSize: "20px" }}
                >
                  {totalText}
                </strong>
              </div>

              {checkoutStep === 1 && (
                <>
                  <label className="fc-terms" style={{ marginTop: "20px" }}>
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <span>
                      Tôi đồng ý với{" "}
                      <Link to="/support" className="fc-terms__link">
                        Chính sách bảo vệ dữ liệu cá nhân
                      </Link>{" "}
                      và{" "}
                      <Link to="/support" className="fc-terms__link">
                        Các điều khoản
                      </Link>
                    </span>
                  </label>

                  <button
                    type="button"
                    className={cn(
                      "fc-submit",
                      canProceed && "fc-submit--ready",
                    )}
                    disabled={!canProceed || createMutation.isPending}
                    onClick={() => {
                      if (canProceed) {
                        createMutation.mutate(
                          {
                            hotelId: session.hotel.id,
                            roomTypeId: session.room.id,
                            checkinDate: session.checkInDate,
                            checkoutDate: session.checkOutDate,
                            rooms: session.guests.rooms,
                            adults: session.guests.adults,
                            children: session.guests.children,
                            contactName: contact.fullName,
                            contactPhone: contact.phone,
                            contactEmail: contact.email,
                            specialRequests: specialRequest,
                          },
                          {
                            onSuccess: (data) => {
                              setBookingId(data.bookingId);
                              setCheckoutStep(2);
                              window.scrollTo(0, 0);
                            },
                            onError: (err) => {
                              toast.error(
                                "Lỗi khi tạo đơn hàng khách sạn, vui lòng thử lại.",
                              );
                              console.error(err);
                            },
                          },
                        );
                      }
                    }}
                  >
                    {createMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin inline mr-2" />
                    ) : null}
                    {canProceed
                      ? "Tiếp tục thanh toán"
                      : "Chưa nhập đủ thông tin"}
                  </button>
                </>
              )}

              {checkoutStep === 2 && (
                <button
                  type="button"
                  className="fc-submit fc-submit--ready"
                  style={{ marginTop: "16px" }}
                  onClick={() => setPaymentOpen(true)}
                >
                  Thanh toán
                </button>
              )}
            </section>
          </aside>
        </div>
      </div>

      {paymentOpen && !expired ? (
        <div className="fc-modal-backdrop" role="dialog" aria-modal="true">
          <div
            className="fc-payment-modal"
            style={{ width: "600px", maxWidth: "90%" }}
          >
            <div className="fc-modal-head">
              <h3>Các hình thức thanh toán</h3>
              <button
                type="button"
                className="fc-modal-close"
                onClick={() => setPaymentOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="fc-payment-modal__body">
              <button
                className="fc-accordion"
                style={{ padding: "16px 0", borderBottom: "1px solid #eee" }}
              >
                <strong>Ví điện tử</strong>
                <ChevronDown size={16} />
              </button>
              <div style={{ paddingTop: "12px", paddingBottom: "12px" }}>
                {[
                  { id: "payoo", label: "Payoo", img: "Payoo" },
                  { id: "vnpay", label: "Thanh toán VNPAY", img: "VNPAY" },
                  { id: "momo", label: "Thanh toán bằng MoMo", img: "Momo" },
                  {
                    id: "zalopay",
                    label: "Thanh toán bằng ZaloPay",
                    img: "ZaloPay",
                  },
                ].map((m) => (
                  <label
                    key={m.id}
                    className="fc-payment-row"
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #f1f1f1",
                      display: "flex",
                      gap: "12px",
                      cursor: "pointer",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="radio"
                      name="pm"
                      checked={method === m.id}
                      onChange={() => setMethod(m.id as PaymentMethod)}
                      style={{
                        accentColor: "#0066cc",
                        transform: "scale(1.2)",
                      }}
                    />
                    <span style={{ fontSize: "14px", flex: 1 }}>{m.label}</span>
                    <span
                      style={{
                        opacity: 0.6,
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {m.img}
                    </span>
                  </label>
                ))}
              </div>

              <button
                className="fc-accordion"
                style={{
                  padding: "16px 0",
                  borderBottom: "1px solid #eee",
                  marginTop: "8px",
                }}
              >
                <strong>Thẻ tín dụng</strong>
                <ChevronDown size={16} />
              </button>
              <div style={{ paddingTop: "12px" }}>
                <label
                  className="fc-payment-row"
                  style={{
                    padding: "12px 16px",
                    display: "flex",
                    gap: "12px",
                    cursor: "pointer",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="radio"
                    name="pm"
                    checked={method === "visa"}
                    onChange={() => setMethod("visa")}
                    style={{ accentColor: "#0066cc", transform: "scale(1.2)" }}
                  />
                  <span style={{ fontSize: "14px", flex: 1 }}>
                    VISA / Master / JCB
                  </span>
                  <span
                    style={{
                      opacity: 0.6,
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    VISA
                  </span>
                </label>
              </div>
            </div>
            <div
              className="fc-payment-modal__footer"
              style={{
                borderTop: "none",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                className={cn("fc-btn-primary", !method && "is-disabled")}
                style={{
                  width: "160px",
                  padding: "12px 0",
                  borderRadius: "100px",
                  background: method ? "#0ea5e9" : "#e0e0e0",
                }}
                disabled={!method}
                onClick={() => {
                  setPaymentOpen(false);
                  if (method === "momo") {
                    setQrOpen(true);
                  } else {
                    // Logic for other methods
                    clearHotelCheckoutSession();
                    navigate("/hotels/success", { state: { bookingId } });
                  }
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {qrOpen && !expired ? (
        <div
          className="fc-modal-backdrop"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.8)" }}
        >
          <div
            style={{
              background: "#fff",
              width: "900px",
              maxWidth: "95vw",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "16px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #f1f1f1",
              }}
            >
              <div
                style={{
                  background: "#A50064",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                mo
                <br />
                mo
              </div>
              <div style={{ fontSize: "13px", fontWeight: "500" }}>
                Giao dịch hết hạn sau{" "}
                <span
                  style={{
                    background: "#111",
                    color: "#fff",
                    padding: "4px 6px",
                    borderRadius: "4px",
                    marginLeft: "8px",
                  }}
                >
                  08 : 20
                </span>
              </div>
            </div>
            <div
              style={{
                padding: "16px 24px",
                background: "#fff5f5",
                color: "#d93838",
                fontSize: "13px",
                borderBottom: "1px solid #f1f1f1",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Info size={16} /> Quý khách vui lòng không tắt trình duyệt hoặc
              làm mới trang trong quá trình thanh toán.
            </div>

            <div style={{ display: "flex", padding: "24px", gap: "40px" }}>
              <div
                style={{
                  flex: 1,
                  borderRight: "1px solid #f1f1f1",
                  paddingRight: "40px",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "20px",
                    borderBottom: "2px solid #e1e1e1",
                    paddingBottom: "12px",
                  }}
                >
                  Thông tin đơn hàng
                </h3>

                <div style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#666",
                      marginBottom: "4px",
                    }}
                  >
                    Thông tin người nhận:
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: "500" }}>
                    CÔNG TY CỔ PHẦN DU LỊCH VIETRAVEL
                  </div>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#666",
                      marginBottom: "4px",
                    }}
                  >
                    Giá trị đơn hàng:
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#0066cc",
                    }}
                  >
                    {totalText}
                  </div>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#666",
                      marginBottom: "4px",
                    }}
                  >
                    Số tiền thanh toán:
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: "600" }}>
                    {totalText}
                  </div>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#666",
                      marginBottom: "4px",
                    }}
                  >
                    Mã đơn hàng:
                  </div>
                  <div style={{ fontSize: "14px", fontFamily: "monospace" }}>
                    260530102044_
                    {bookingId ? `HTL-${bookingId}` : "20260530V7DBDR"}
                  </div>
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "20px",
                  }}
                >
                  Quét mã qua ứng dụng Ngân hàng / Ví điện tử
                </div>

                {/* Dummy QR Block */}
                <div
                  style={{
                    width: "260px",
                    height: "260px",
                    background: "#f8f9fa",
                    border: "12px solid #fff",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    display: "grid",
                    placeItems: "center",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background:
                        "repeating-linear-gradient(45deg, #000 0, #000 10px, #fff 10px, #fff 20px)",
                      opacity: 0.1,
                      position: "absolute",
                      borderRadius: "4px",
                    }}
                  ></div>
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=MoMoDummy&margin=0"
                    alt="QR"
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      zIndex: 1,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      zIndex: 2,
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      background: "#0ea5e9",
                      color: "#fff",
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: "bold",
                      fontSize: "24px",
                      border: "4px solid #fff",
                    }}
                  >
                    V
                  </div>
                </div>

                <button
                  style={{
                    marginTop: "32px",
                    padding: "12px 40px",
                    background: "#f8f9fa",
                    border: "1px solid #e1e1e1",
                    borderRadius: "100px",
                    color: "#666",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setQrOpen(false);
                    clearHotelCheckoutSession();
                    navigate("/hotels/search");
                  }}
                >
                  Hủy thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
