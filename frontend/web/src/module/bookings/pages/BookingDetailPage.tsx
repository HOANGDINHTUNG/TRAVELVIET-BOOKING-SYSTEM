import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Flag,
  History,
  MessageCircle,
  ReceiptText,
  UserCheck,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  bookingApi,
  type Booking,
  type BookingStatusHistory,
} from "../../../api/server/Booking.api";
import { paymentApi, type Payment } from "../../../api/server/Payment.api";
import { formatCurrencyVnd } from "../../management/schedules/utils/currency";
import { PageLoader } from "../../../components/common/ux/PageLoader";
import { ErrorBlock } from "../../../components/common/ui/ErrorBlock";
import { Footer } from "../../../components/Footer/Footer";
import { CustomerPageHero } from "../../../components/ui/CustomerPageHero/CustomerPageHero";
import {
  getStoredAuthUser,
  hasManagerRole,
} from "../../auth/api/authApi";
import "./BookingDetailPage.css";

type BookingDetailLocale = "vi" | "en";

type BookingDetailCopy = {
  backHome: string;
  loading: string;
  errorTitle: string;
  missing: string;
  kicker: string;
  title: (code: string) => string;
  status: string;
  subtotal: string;
  discount: string;
  voucherDiscount: string;
  addon: string;
  finalAmount: string;
  paymentTitle: string;
  paymentCopy: string;
  paymentMethod: string;
  provider: string;
  transactionRef: string;
  payAction: string;
  paid: string;
  paymentSuccess: (code: string) => string;
  paymentError: string;
  actionsTitle: string;
  actionsCopy: string;
  chatTitle: string;
  chatCopy: string;
  openChat: string;
  reason: string;
  cancelAction: string;
  checkInAction: string;
  completeAction: string;
  lifecycleSuccess: string;
  lifecycleError: string;
  noActions: string;
  historyTitle: string;
  noHistory: string;
};

const copyByLocale: Record<BookingDetailLocale, BookingDetailCopy> = {
  vi: {
    backHome: "Về chuyến đi của tôi",
    loading: "Đang tải thông tin đặt tour...",
    errorTitle: "Không thể tải booking",
    missing: "Booking không tồn tại.",
    kicker: "Chi tiết đặt tour",
    title: (code) => `Booking ${code}`,
    status: "Trạng thái",
    subtotal: "Tạm tính",
    discount: "Giảm giá",
    voucherDiscount: "Voucher",
    addon: "Phụ thu",
    finalAmount: "Cần thanh toán",
    paymentTitle: "Thanh toán booking",
    paymentCopy:
      "Số tiền được lấy từ booking để đảm bảo khớp với backend khi ghi nhận thanh toán.",
    paymentMethod: "Phương thức",
    provider: "Nhà cung cấp",
    transactionRef: "Mã giao dịch",
    payAction: "Xác nhận thanh toán",
    paid: "Đã thanh toán",
    paymentSuccess: (code) => `Đã ghi nhận thanh toán ${code}.`,
    paymentError: "Không thể tạo thanh toán cho booking này.",
    actionsTitle: "Xử lý booking",
    actionsCopy: "Các thao tác này gọi trực tiếp booking lifecycle API và cập nhật lịch sử trạng thái.",
    chatTitle: "Nhóm chat lịch trình",
    chatCopy:
      "Trao đổi với các thành viên cùng lịch trình và đội ngũ TravelViet trước ngày khởi hành.",
    openChat: "Mở nhóm chat",
    reason: "Lý do / ghi chú",
    cancelAction: "Hủy booking",
    checkInAction: "Check-in khách",
    completeAction: "Hoàn tất booking",
    lifecycleSuccess: "Đã cập nhật trạng thái booking.",
    lifecycleError: "Không thể cập nhật booking.",
    noActions: "Không có thao tác khả dụng với trạng thái hiện tại.",
    historyTitle: "Lịch sử trạng thái",
    noHistory: "Chưa có lịch sử trạng thái.",
  },
  en: {
    backHome: "Back to home",
    loading: "Loading booking...",
    errorTitle: "Could not load booking",
    missing: "Booking does not exist.",
    kicker: "Booking",
    title: (code) => `Booking ${code}`,
    status: "Status",
    subtotal: "Subtotal",
    discount: "Discount",
    voucherDiscount: "Voucher",
    addon: "Addon",
    finalAmount: "Amount due",
    paymentTitle: "Pay booking",
    paymentCopy:
      "The amount is locked to the booking final amount so it matches backend validation.",
    paymentMethod: "Method",
    provider: "Provider",
    transactionRef: "Transaction ref",
    payAction: "Confirm payment",
    paid: "Paid",
    paymentSuccess: (code) => `Payment ${code} has been recorded.`,
    paymentError: "Could not create payment for this booking.",
    actionsTitle: "Booking actions",
    actionsCopy: "These actions call the booking lifecycle API and refresh the status history.",
    chatTitle: "Schedule group chat",
    chatCopy:
      "Coordinate with travelers on the same schedule and the TravelViet team before departure.",
    openChat: "Open group chat",
    reason: "Reason / note",
    cancelAction: "Cancel booking",
    checkInAction: "Check in guest",
    completeAction: "Complete booking",
    lifecycleSuccess: "Booking status updated.",
    lifecycleError: "Could not update booking.",
    noActions: "No actions are available for the current status.",
    historyTitle: "Status history",
    noHistory: "No status history yet.",
  },
};

function getLocale(language: string): BookingDetailLocale {
  return language === "en" ? "en" : "vi";
}

function formatDate(value: string | undefined, locale: BookingDetailLocale) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function isPaidBooking(booking: Booking | null) {
  return (
    booking?.paymentStatus === "paid" ||
    booking?.status === "confirmed" ||
    booking?.status === "checked_in" ||
    booking?.status === "completed"
  );
}

function canCancelBooking(booking: Booking | null) {
  return booking?.status === "pending_payment" || booking?.status === "confirmed";
}

function canCheckInBooking(booking: Booking | null) {
  return booking?.status === "confirmed" && booking?.paymentStatus === "paid";
}

function canCompleteBooking(booking: Booking | null) {
  return booking?.status === "checked_in";
}

function canOpenScheduleChat(booking: Booking | null) {
  return Boolean(
    booking?.scheduleId &&
      booking.status !== "cancelled" &&
      booking.status !== "expired" &&
      booking.status !== "refunded",
  );
}

export default function BookingDetailPage() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const locale = getLocale(i18n.language);
  const copy = copyByLocale[locale];
  const [booking, setBooking] = useState<Booking | null>(null);
  const [history, setHistory] = useState<BookingStatusHistory[]>([]);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [provider, setProvider] = useState("TravelViet");
  const [transactionRef, setTransactionRef] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [statusReason, setStatusReason] = useState("");

  const bookingId = useMemo(() => Number(id), [id]);
  const isManager = hasManagerRole(getStoredAuthUser());

  useEffect(() => {
    let mounted = true;

    async function loadBooking() {
      if (!Number.isFinite(bookingId)) {
        setError(copy.missing);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [bookingData, historyData] = await Promise.all([
          bookingApi.getById(bookingId),
          bookingApi.getStatusHistory(bookingId).catch(() => []),
        ]);

        if (mounted) {
          setBooking(bookingData);
          setHistory(historyData);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : copy.missing);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadBooking();

    return () => {
      mounted = false;
    };
  }, [bookingId, copy.missing]);

  const createPayment = async () => {
    if (!booking?.id || !booking.finalAmount) {
      return;
    }

    setPaymentLoading(true);
    setPaymentMessage("");

    try {
      const created = await paymentApi.create({
        bookingId: booking.id,
        paymentMethod,
        provider: provider.trim() || undefined,
        transactionRef: transactionRef.trim() || undefined,
        amount: booking.finalAmount,
      });
      const [nextBooking, nextHistory] = await Promise.all([
        bookingApi.getById(booking.id),
        bookingApi.getStatusHistory(booking.id).catch(() => history),
      ]);
      setPayment(created);
      setBooking(nextBooking);
      setHistory(nextHistory);
      setPaymentMessage(copy.paymentSuccess(created.paymentCode || String(created.id)));
    } catch (paymentError) {
      setPaymentMessage(
        paymentError instanceof Error ? paymentError.message : copy.paymentError,
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const runBookingAction = async (
    action: "cancel" | "checkIn" | "complete",
  ) => {
    if (!booking?.id || actionLoading) {
      return;
    }

    setActionLoading(true);
    setActionMessage("");

    try {
      const payload = { reason: statusReason.trim() || undefined };
      const nextBooking =
        action === "cancel"
          ? await bookingApi.cancel(booking.id, payload)
          : action === "checkIn"
            ? await bookingApi.checkIn(booking.id, payload)
            : await bookingApi.complete(booking.id, payload);
      const nextHistory = await bookingApi
        .getStatusHistory(booking.id)
        .catch(() => history);

      setBooking(nextBooking);
      setHistory(nextHistory);
      setStatusReason("");
      setActionMessage(copy.lifecycleSuccess);
    } catch (actionError) {
      setActionMessage(
        actionError instanceof Error ? actionError.message : copy.lifecycleError,
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <PageLoader label={copy.loading} />;
  }

  if (error || !booking) {
    return (
      <div className="booking-detail-error">
        <Link to="/my-bookings" className="booking-back-link">
          <ArrowLeft size={16} />
          {copy.backHome}
        </Link>
        <ErrorBlock title={copy.errorTitle} message={error || copy.missing} />
      </div>
    );
  }

  const bookingCode = booking.bookingCode || String(booking.id);
  const paid = isPaidBooking(booking);
  const canCancel = canCancelBooking(booking);
  const canCheckIn = isManager && canCheckInBooking(booking);
  const canComplete = isManager && canCompleteBooking(booking);
  const canChat = canOpenScheduleChat(booking);
  const hasAnyAction = canCancel || canCheckIn || canComplete;

  return (
    <>
      <CustomerPageHero
        variant="teal"
        kicker={copy.kicker}
        title={copy.title(bookingCode)}
        metrics={[
          { icon: <ReceiptText size={13} />, value: bookingCode, label: "Mã booking" },
          { icon: <Flag size={13} />, value: booking.status ?? "—", label: copy.status },
          { icon: <CreditCard size={13} />, value: formatCurrencyVnd(booking.finalAmount), label: copy.finalAmount },
        ]}
      />

      <div className="booking-detail-page">
        <main className="booking-detail-container">
          <Link to="/my-bookings" className="booking-back-link">
            <ArrowLeft size={16} />
            {copy.backHome}
          </Link>

          <div className="booking-detail-grid">
          <section className="booking-card">
            <header>
              <ReceiptText size={22} />
              <h2>{copy.finalAmount}</h2>
            </header>
            <dl className="booking-money-list">
              <div>
                <dt>{copy.subtotal}</dt>
                <dd>{formatCurrencyVnd(booking.subtotalAmount)}</dd>
              </div>
              <div>
                <dt>{copy.discount}</dt>
                <dd>{formatCurrencyVnd(booking.discountAmount)}</dd>
              </div>
              <div>
                <dt>{copy.voucherDiscount}</dt>
                <dd>{formatCurrencyVnd(booking.voucherDiscountAmount)}</dd>
              </div>
              <div>
                <dt>{copy.addon}</dt>
                <dd>{formatCurrencyVnd(booking.addonAmount)}</dd>
              </div>
              <div className="total">
                <dt>{copy.finalAmount}</dt>
                <dd>{formatCurrencyVnd(booking.finalAmount)}</dd>
              </div>
            </dl>
          </section>

          <section className="booking-card booking-payment-card">
            <header>
              <CreditCard size={22} />
              <h2>{copy.paymentTitle}</h2>
            </header>
            <p>{paid ? copy.paid : copy.paymentCopy}</p>

            <div className="booking-payment-form">
              <label>
                <span>{copy.paymentMethod}</span>
                <select
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                  disabled={paid || paymentLoading}
                >
                  <option value="bank_transfer">Bank transfer</option>
                  <option value="cash">Cash</option>
                  <option value="momo">Momo</option>
                  <option value="vnpay">VNPAY</option>
                </select>
              </label>
              <label>
                <span>{copy.provider}</span>
                <input
                  value={provider}
                  onChange={(event) => setProvider(event.target.value)}
                  disabled={paid || paymentLoading}
                />
              </label>
              <label>
                <span>{copy.transactionRef}</span>
                <input
                  value={transactionRef}
                  onChange={(event) => setTransactionRef(event.target.value)}
                  disabled={paid || paymentLoading}
                />
              </label>
              <button
                type="button"
                onClick={createPayment}
                disabled={paid || paymentLoading}
              >
                <CheckCircle2 size={18} />
                {paid ? copy.paid : copy.payAction}
              </button>
            </div>

            {(paymentMessage || payment) && (
              <p className={payment ? "booking-payment-message success" : "booking-payment-message"}>
                {paymentMessage || copy.paymentSuccess(payment?.paymentCode || "")}
              </p>
            )}
          </section>
        </div>

        {canChat && (
          <section className="booking-card booking-chat-card">
            <header>
              <MessageCircle size={22} />
              <h2>{copy.chatTitle}</h2>
            </header>
            <p>{copy.chatCopy}</p>
            <Link
              className="booking-chat-link"
              to={`/schedules/${booking.scheduleId}/chat`}
            >
              <MessageCircle size={18} />
              {copy.openChat}
            </Link>
          </section>
        )}

        <section className="booking-card booking-actions-card">
          <header>
            <Flag size={22} />
            <h2>{copy.actionsTitle}</h2>
          </header>
          <p>{hasAnyAction ? copy.actionsCopy : copy.noActions}</p>

          <label className="booking-action-reason">
            <span>{copy.reason}</span>
            <textarea
              rows={3}
              value={statusReason}
              onChange={(event) => setStatusReason(event.target.value)}
              disabled={!hasAnyAction || actionLoading}
            />
          </label>

          <div className="booking-action-buttons">
            {canCancel && (
              <button
                className="danger"
                type="button"
                onClick={() => void runBookingAction("cancel")}
                disabled={actionLoading}
              >
                <XCircle size={18} />
                {copy.cancelAction}
              </button>
            )}
            {canCheckIn && (
              <button
                type="button"
                onClick={() => void runBookingAction("checkIn")}
                disabled={actionLoading}
              >
                <UserCheck size={18} />
                {copy.checkInAction}
              </button>
            )}
            {canComplete && (
              <button
                type="button"
                onClick={() => void runBookingAction("complete")}
                disabled={actionLoading}
              >
                <CheckCircle2 size={18} />
                {copy.completeAction}
              </button>
            )}
          </div>

          {actionMessage && <p className="booking-action-message">{actionMessage}</p>}
        </section>

        <section className="booking-card booking-history-card">
          <header>
            <History size={22} />
            <h2>{copy.historyTitle}</h2>
          </header>
          {history.length === 0 ? (
            <p>{copy.noHistory}</p>
          ) : (
            <ol>
              {history.map((item) => (
                <li key={item.id}>
                  <span>{item.oldStatus || "-"}</span>
                  <strong>{item.newStatus}</strong>
                  <small>{formatDate(item.createdAt, locale)}</small>
                  {item.changeReason && <p>{item.changeReason}</p>}
                </li>
              ))}
            </ol>
          )}
        </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
