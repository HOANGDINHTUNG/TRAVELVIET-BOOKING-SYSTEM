import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Baby,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleUserRound,
  Info,
  Luggage,
  Plane,
  Receipt,
  ShieldCheck,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { formatPriceVnd } from "@/utils/formatters";
import {
  clearFlightCheckoutSession,
  loadFlightCheckoutSession,
} from "../lib/flightCheckoutStorage";
import { FlightCheckoutStepper } from "../components/FlightCheckoutStepper";
import { FlightHoldExpiredModal } from "../components/FlightHoldExpiredModal";
import { buildFlightSearchQuery } from "../utils/flightSearchParams";
import type { FlightCheckoutSession } from "../types/flightCheckout";
import { useCreateFlightBooking } from "../../../bookings/hooks/useBookingMutation";
import type { ExtendedBookingResponse } from "../../../bookings/types/publicBooking";
import { useAuthStore, selectIsAuthenticated } from "../../../stores/authStore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import "./FlightCheckoutPage.css";

type PaymentMethod = "payoo" | "vnpay" | "momo" | "zalopay" | "visa";

function formatMoney(amount: number, locale: string): string {
  return formatPriceVnd(amount, locale).replace("₫", "đ");
}

export default function FlightCheckoutPage() {
  const locale = "vi";
  const navigate = useNavigate();

  const rawSession = useMemo(() => loadFlightCheckoutSession(), []);
  const [now, setNow] = useState(() => Date.now());
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [bookingId, setBookingId] = useState<number | null>(null);

  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const createMutation = useCreateFlightBooking();

  const [passengerModalOpen, setPassengerModalOpen] = useState(false);
  const [baggageModalOpen, setBaggageModalOpen] = useState(false);
  const [baggageLeg, setBaggageLeg] = useState<"outbound" | "inbound">(
    "outbound",
  );

  const [flightOpen, setFlightOpen] = useState(false);
  const [costOpen, setCostOpen] = useState(true);

  const [contact, setContact] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });
  const [invoiceRequested, setInvoiceRequested] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passengersComplete, setPassengersComplete] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!rawSession) {
      navigate("/flights", { replace: true });
    } else if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để tiếp tục");
      navigate("/login", { state: { from: window.location.pathname } });
    }
  }, [navigate, rawSession, isAuthenticated]);

  const holdExpired = rawSession ? now >= rawSession.holdExpiresAtMs : false;

  useEffect(() => {
    if (!holdExpired) return;
    setPaymentOpen(false);
    setPassengerModalOpen(false);
    setBaggageModalOpen(false);
  }, [holdExpired]);

  useEffect(() => {
    if (!holdExpired) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [holdExpired]);

  if (!rawSession) return null;

  const session = rawSession;
  const { params } = session;

  const remainMs = Math.max(0, session.holdExpiresAtMs - now);
  const mm = String(Math.floor(remainMs / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remainMs % 60000) / 1000)).padStart(2, "0");
  const expired = remainMs <= 0;

  const outboundLegTotal = session.outbound.fare.priceVnd * params.adults;
  const inboundLegTotal = session.inbound
    ? session.inbound.fare.priceVnd * params.adults
    : 0;
  const totalText = formatMoney(session.totalAmountVnd, locale);

  const contactValid =
    contact.fullName.trim().length >= 2 &&
    /^\+?[0-9\s-]{10,14}$/.test(contact.phone) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email);

  const canPay =
    contactValid && termsAccepted && passengersComplete && !expired;
  const checkoutStep = paymentOpen ? 2 : 1;

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
                Hãy đảm bảo tất cả thông tin chi tiết trên trang này đã chính
                xác trước khi tiến hành thanh toán.
              </p>
            </div>
            <FlightCheckoutStepper current={checkoutStep} />
          </div>
        </header>

        <div className="fc-inner">
          <main className="fc-main">
            <section className="fc-card">
              <h2 className="fc-card__title">Thông tin liên lạc</h2>
              <div className="fc-login-banner">
                <Info size={18} className="fc-login-banner__icon" aria-hidden />
                <p>
                  <Link to="/login" className="fc-login-banner__link">
                    Đăng nhập
                  </Link>{" "}
                  để nhận ưu đãi, tích điểm và quản lý đơn hàng dễ dàng hơn!
                </p>
              </div>
              <div className="fc-form-grid">
                <label className="fc-field">
                  <span className="fc-label">
                    Họ tên <span className="fc-required">(*)</span>
                  </span>
                  <input
                    value={contact.fullName}
                    onChange={(e) =>
                      setContact((p) => ({ ...p, fullName: e.target.value }))
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
                <span>Tôi muốn xuất hóa đơn điện tử</span>
              </label>
            </section>

            <section className="fc-card">
              <h2 className="fc-card__title">Số lượng hành khách</h2>
              <div className="fc-pax-counts">
                <div className="fc-pax-pill">
                  <Users size={18} className="fc-pax-pill__icon" aria-hidden />
                  <div className="fc-pax-pill__label">
                    <span className="fc-pax-pill__title">Người lớn</span>
                    <span className="fc-pax-pill__hint">
                      Từ 12 tuổi trở lên
                    </span>
                  </div>
                  <span className="fc-pax-pill__value">{params.adults}</span>
                </div>
                <div className="fc-pax-pill">
                  <Baby size={18} className="fc-pax-pill__icon" aria-hidden />
                  <div className="fc-pax-pill__label">
                    <span className="fc-pax-pill__title">Trẻ em</span>
                    <span className="fc-pax-pill__hint">Từ 0 - 11 tuổi</span>
                  </div>
                  <span className="fc-pax-pill__value">{params.children}</span>
                </div>
              </div>
            </section>

            <section className="fc-card">
              <h2 className="fc-card__title">Thông tin hành khách</h2>
              <div className="fc-pax-category">
                <CircleUserRound size={16} aria-hidden />
                <span>Người lớn (Từ 12 tuổi trở lên)</span>
              </div>
              <div className="fc-pax-list">
                {Array.from({ length: params.adults }, (_, i) => (
                  <button
                    key={`adult-${i}`}
                    type="button"
                    className="fc-dash-row"
                    onClick={() => setPassengerModalOpen(true)}
                  >
                    <span className="fc-dash-row__left">
                      <span className="fc-dash-row__index">#{i + 1}</span>
                      <span className="fc-dash-row__label">Người lớn (*)</span>
                    </span>
                    <span className="fc-dash-row__action fc-dash-row__action--danger">
                      {passengersComplete
                        ? "Đã nhập thông tin"
                        : "Nhập thông tin"}
                      <ChevronRight size={16} aria-hidden />
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="fc-card">
              <h2 className="fc-card__title">Hành lý ký gửi</h2>
              <div className="fc-bag-list">
                <button
                  type="button"
                  className="fc-dash-row"
                  onClick={() => {
                    setBaggageLeg("outbound");
                    setBaggageModalOpen(true);
                  }}
                >
                  <span className="fc-dash-row__left">
                    <Luggage
                      size={16}
                      className="fc-dash-row__icon"
                      aria-hidden
                    />
                    <span className="fc-dash-row__label">Chiều đi</span>
                  </span>
                  <span className="fc-dash-row__action">
                    Thêm hành lý
                    <ChevronRight size={16} aria-hidden />
                  </span>
                </button>
                {session.inbound ? (
                  <button
                    type="button"
                    className="fc-dash-row"
                    onClick={() => {
                      setBaggageLeg("inbound");
                      setBaggageModalOpen(true);
                    }}
                  >
                    <span className="fc-dash-row__left">
                      <Luggage
                        size={16}
                        className="fc-dash-row__icon"
                        aria-hidden
                      />
                      <span className="fc-dash-row__label">Chiều về</span>
                    </span>
                    <span className="fc-dash-row__action">
                      Thêm hành lý
                      <ChevronRight size={16} aria-hidden />
                    </span>
                  </button>
                ) : null}
              </div>
            </section>
          </main>

          <aside className="fc-side">
            <section className="fc-card fc-card--side">
              <h2 className="fc-card__title">Tóm tắt đơn hàng</h2>

              <button
                type="button"
                className="fc-accordion"
                onClick={() => setFlightOpen((o) => !o)}
                aria-expanded={flightOpen}
              >
                <span className="fc-accordion__label">
                  <Plane
                    size={16}
                    className="fc-accordion__icon fc-accordion__icon--blue"
                    aria-hidden
                  />
                  Thông tin chuyến bay
                </span>
                {flightOpen ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
              {flightOpen ? (
                <div className="fc-accordion__body">
                  <div className="fc-flight-line">
                    <strong>Chiều đi</strong>
                    <span>
                      {session.outbound.fromIata} → {session.outbound.toIata} ·{" "}
                      {session.outbound.offer.departureTimeLocal} -{" "}
                      {session.outbound.offer.arrivalTimeLocal}
                    </span>
                    <span className="fc-flight-line__fare">
                      {session.outbound.fare.label}
                    </span>
                  </div>
                  {session.inbound ? (
                    <div className="fc-flight-line">
                      <strong>Chiều về</strong>
                      <span>
                        {session.inbound.fromIata} → {session.inbound.toIata} ·{" "}
                        {session.inbound.offer.departureTimeLocal} -{" "}
                        {session.inbound.offer.arrivalTimeLocal}
                      </span>
                      <span className="fc-flight-line__fare">
                        {session.inbound.fare.label}
                      </span>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <button
                type="button"
                className="fc-accordion"
                onClick={() => setCostOpen((o) => !o)}
                aria-expanded={costOpen}
              >
                <span className="fc-accordion__label">
                  <ShieldCheck
                    size={16}
                    className="fc-accordion__icon fc-accordion__icon--blue"
                    aria-hidden
                  />
                  Chi tiết chi phí
                </span>
                {costOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {costOpen ? (
                <div className="fc-accordion__body fc-accordion__body--costs">
                  <div className="fc-cost-row">
                    <span>Người lớn (Chiều đi)</span>
                    <span className="fc-cost-row__qty">{params.adults}x</span>
                    <span className="fc-cost-row__price">
                      {formatMoney(outboundLegTotal, locale)}
                    </span>
                    <ChevronDown
                      size={14}
                      className="fc-cost-row__chev"
                      aria-hidden
                    />
                  </div>
                  {session.inbound ? (
                    <div className="fc-cost-row">
                      <span>Người lớn (Chiều về)</span>
                      <span className="fc-cost-row__qty">{params.adults}x</span>
                      <span className="fc-cost-row__price">
                        {formatMoney(inboundLegTotal, locale)}
                      </span>
                      <ChevronDown
                        size={14}
                        className="fc-cost-row__chev"
                        aria-hidden
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}
            </section>

            <section className="fc-card fc-card--side fc-card--total">
              <div className="fc-total-row">
                <span className="fc-total-row__label">Tổng tiền</span>
                <strong className="fc-total-row__value">{totalText}</strong>
              </div>

              <label className="fc-terms">
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
                className={cn("fc-submit", canPay && "fc-submit--ready")}
                disabled={createMutation.isPending || expired}
                onClick={() => {
                  if (!contact.fullName || !contact.phone || !contact.email) {
                    toast.error("Vui lòng điền đầy đủ thông tin liên hệ");
                    return;
                  }
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
                    toast.error("Email không hợp lệ. Vui lòng thử lại!");
                    return;
                  }
                  if (!/^\+?[0-9\s-]{10,14}$/.test(contact.phone)) {
                    toast.error(
                      "Số điện thoại không hợp lệ. Cần tối thiểu 10 số.",
                    );
                    return;
                  }
                  if (!passengersComplete) {
                    toast.error("Vui lòng nhập đầy đủ thông tin hành khách!");
                    return;
                  }
                  if (!termsAccepted) {
                    toast.error("Vui lòng đồng ý với Các điều khoản");
                    return;
                  }
                  if (canPay) {
                    createMutation.mutate(
                      {
                        flightId: session.outbound.offer.id,
                        flightClassId:
                          parseInt(session.outbound.fare.id, 10) || 1,
                        departureDate: session.outbound.departDateIso,
                        tripType: session.inbound ? "round_trip" : "one_way",
                        returnFlightId: session.inbound?.offer.id,
                        returnDepartureDate: session.inbound?.departDateIso,
                        passengerCount: session.params.adults,
                        contactName: contact.fullName,
                        contactPhone: contact.phone,
                        contactEmail: contact.email,
                      },
                      {
                        onSuccess: (data: ExtendedBookingResponse) => {
                          setBookingId(data.bookingId);
                          setPaymentOpen(true);
                        },
                        onError: (err: unknown) => {
                          toast.error(
                            "Lỗi khi tạo đơn hàng vé máy bay, vui lòng thử lại.",
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
                {canPay ? "Thanh toán" : "Chưa nhập đủ thông tin"}
              </button>
            </section>
          </aside>
        </div>
      </div>

      {passengerModalOpen && !expired ? (
        <PassengerInfoModal
          session={session}
          onClose={() => setPassengerModalOpen(false)}
          onConfirm={() => {
            setPassengersComplete(true);
            setPassengerModalOpen(false);
          }}
        />
      ) : null}

      {baggageModalOpen && !expired ? (
        <BaggageModal
          session={session}
          activeLeg={baggageLeg}
          onChangeLeg={setBaggageLeg}
          onClose={() => setBaggageModalOpen(false)}
        />
      ) : null}

      {paymentOpen && !expired ? (
        <PaymentModal
          method={method}
          onSelectMethod={setMethod}
          onClose={() => setPaymentOpen(false)}
          onConfirm={() => {
            clearFlightCheckoutSession();
            navigate("/flights/success", { state: { bookingId } });
          }}
        />
      ) : null}

      {expired ? (
        <FlightHoldExpiredModal
          onSelectAgain={() => {
            const query = buildFlightSearchQuery(session.params);
            clearFlightCheckoutSession();
            navigate(`/flights/search?${query}`);
          }}
        />
      ) : null}
    </div>
  );
}

function PassengerInfoModal({
  session,
  onClose,
  onConfirm,
}: {
  session: FlightCheckoutSession;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const adults = session.params.adults;

  return (
    <div
      className="fc-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Thông tin hành khách"
    >
      <div className="fc-passenger-modal">
        <div className="fc-modal-head">
          <h3>Thông tin hành khách</h3>
          <button
            type="button"
            className="fc-modal-close"
            onClick={onClose}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
        <div className="fc-passenger-modal__body">
          {Array.from({ length: adults }, (_, i) => (
            <div key={`adult-form-${i}`} className="fc-passenger-form">
              <div className="fc-passenger-form__title">
                Người lớn {i + 1}{" "}
                <span className="fc-passenger-form__note">
                  (Người lớn sinh trước ngày 28/05/2014)
                </span>
              </div>
              <div className="fc-passenger-form__grid">
                <label className="fc-field">
                  <span className="fc-label">
                    Họ <span className="fc-required">*</span>
                  </span>
                  <input placeholder="VD: Nguyễn" />
                </label>
                <label className="fc-field">
                  <span className="fc-label">
                    Tên đệm và tên <span className="fc-required">*</span>
                  </span>
                  <input placeholder="VD: Văn A" />
                </label>
                <label className="fc-field">
                  <span className="fc-label">
                    Ngày sinh <span className="fc-required">*</span>
                  </span>
                  <input placeholder="dd / mm / yyyy" />
                </label>
                <label className="fc-field">
                  <span className="fc-label">
                    Giới tính <span className="fc-required">*</span>
                  </span>
                  <select defaultValue="male">
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </label>
              </div>
            </div>
          ))}
        </div>
        <div className="fc-passenger-modal__footer">
          <button type="button" className="fc-btn-outline" onClick={onClose}>
            Đặt lại
          </button>
          <button type="button" className="fc-btn-primary" onClick={onConfirm}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

function BaggageModal({
  session,
  activeLeg,
  onChangeLeg,
  onClose,
}: {
  session: FlightCheckoutSession;
  activeLeg: "outbound" | "inbound";
  onChangeLeg: (leg: "outbound" | "inbound") => void;
  onClose: () => void;
}) {
  const paxCount = session.params.adults;
  const hasReturn = !!session.inbound;

  return (
    <div
      className="fc-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Hành lý ký gửi"
    >
      <div className="fc-baggage-modal">
        <div className="fc-modal-head">
          <h3>Hành lý ký gửi</h3>
          <button
            type="button"
            className="fc-modal-close"
            onClick={onClose}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
        <div className="fc-baggage-modal__tabs">
          <button
            type="button"
            className={cn(
              "fc-baggage-tab",
              activeLeg === "outbound" && "is-active",
            )}
            onClick={() => onChangeLeg("outbound")}
          >
            <Plane size={14} aria-hidden />
            Chặng đi
          </button>
          {hasReturn ? (
            <button
              type="button"
              className={cn(
                "fc-baggage-tab",
                activeLeg === "inbound" && "is-active",
              )}
              onClick={() => onChangeLeg("inbound")}
            >
              <Plane size={14} aria-hidden />
              Chặng về
            </button>
          ) : null}
        </div>
        <div className="fc-baggage-modal__body">
          {Array.from({ length: paxCount }, (_, i) => (
            <div key={`bag-${i}`} className="fc-baggage-section">
              <div className="fc-baggage-section__title">Người lớn {i + 1}</div>
              <div className="fc-baggage-options">
                {[
                  { label: "Không mua thêm hành lý", price: "0đ" },
                  { label: "PREPAID BAGGAGE 15KGS/1P", price: "205.200đ" },
                  { label: "PREPAID BAGGAGE 23KGS/1P", price: "302.400đ" },
                  { label: "PREPAID BAGGAGE 32KGS/1P", price: "453.600đ" },
                ].map((opt, idx) => (
                  <label key={opt.label} className="fc-baggage-option">
                    <input
                      type="radio"
                      name={`bag-${activeLeg}-${i}`}
                      defaultChecked={idx === 0}
                    />
                    <span>{opt.label}</span>
                    <strong>{opt.price}</strong>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="fc-baggage-modal__footer">
          <div className="fc-baggage-total">
            <span>Tổng tiền:</span>
            <strong>0đ</strong>
          </div>
          <button type="button" className="fc-btn-primary" onClick={onClose}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

function PaymentModal({
  method,
  onSelectMethod,
  onClose,
  onConfirm,
}: {
  method: PaymentMethod | null;
  onSelectMethod: (m: PaymentMethod) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fc-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Các hình thức thanh toán"
    >
      <div className="fc-payment-modal">
        <div className="fc-modal-head">
          <h3>Các hình thức thanh toán</h3>
          <button
            type="button"
            className="fc-modal-close"
            onClick={onClose}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
        <div className="fc-payment-modal__body">
          <p className="fc-payment-modal__section">Ví điện tử</p>
          {(
            [
              { id: "payoo", label: "Payoo" },
              { id: "vnpay", label: "Thanh toán VNPAY" },
              { id: "momo", label: "Thanh toán bằng MoMo" },
              { id: "zalopay", label: "Thanh toán bằng ZaloPay" },
            ] as const
          ).map((m) => (
            <label key={m.id} className="fc-payment-row">
              <input
                type="radio"
                name="pm"
                checked={method === m.id}
                onChange={() => onSelectMethod(m.id)}
              />
              <Receipt size={16} aria-hidden />
              <span>{m.label}</span>
            </label>
          ))}
          <p className="fc-payment-modal__section">Thẻ tín dụng</p>
          <label className="fc-payment-row">
            <input
              type="radio"
              name="pm"
              checked={method === "visa"}
              onChange={() => onSelectMethod("visa")}
            />
            <Receipt size={16} aria-hidden />
            <span>VISA / Master / JCB</span>
          </label>
        </div>
        <div className="fc-payment-modal__footer">
          <button
            type="button"
            className={cn("fc-btn-primary", !method && "is-disabled")}
            disabled={!method}
            onClick={onConfirm}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
