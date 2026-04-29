import { useEffect, useMemo, useState } from "react";
import { Calculator, CheckCircle2, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  bookingApi,
  type Booking,
  type BookingQuote,
} from "../../../api/server/Booking.api";
import { getStoredAuthUser } from "../../../utils/authSessionStorage";
import type {
  BackendTour,
  BackendTourSchedule,
} from "../../home/database/interface/publicTravel";
import type { TourDetailCopy, TourDetailLocale } from "../utils/tourDetailCopy";
import { formatTourDate, formatTourPrice } from "../utils/tourDetailFormatters";

type TourBookingPanelProps = {
  tour: BackendTour;
  schedules: BackendTourSchedule[];
  selectedScheduleId?: number;
  copy: TourDetailCopy;
  locale: TourDetailLocale;
};

type AlertState =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

function parseAmount(value: number | string | undefined) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

export function TourBookingPanel({
  tour,
  schedules,
  selectedScheduleId,
  copy,
  locale,
}: TourBookingPanelProps) {
  const navigate = useNavigate();
  const defaultScheduleId = selectedScheduleId ?? schedules[0]?.id ?? 0;
  const [scheduleId, setScheduleId] = useState(defaultScheduleId);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [seniors, setSeniors] = useState(0);
  const [voucherCode, setVoucherCode] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [quote, setQuote] = useState<BookingQuote | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [alert, setAlert] = useState<AlertState>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (selectedScheduleId) {
      setScheduleId(selectedScheduleId);
    }
  }, [selectedScheduleId]);

  useEffect(() => {
    const user = getStoredAuthUser();
    setContactName(user?.displayName || user?.fullName || "");
    setContactEmail(user?.email || "");
    setContactPhone(user?.phone || "");
  }, []);

  const selectedSchedule = useMemo(
    () => schedules.find((schedule) => schedule.id === scheduleId),
    [scheduleId, schedules],
  );

  const payload = useMemo(
    () => ({
      tourId: tour.id,
      scheduleId,
      adults,
      children,
      infants,
      seniors,
      voucherCode: voucherCode.trim() || undefined,
    }),
    [adults, children, infants, scheduleId, seniors, tour.id, voucherCode],
  );

  const canSubmit = Boolean(scheduleId && contactName.trim() && contactPhone.trim());

  const loadQuote = async () => {
    if (!scheduleId) {
      setAlert({ type: "error", message: copy.requiredField });
      return null;
    }

    setQuoteLoading(true);
    setAlert(null);

    try {
      const nextQuote = await bookingApi.quote(payload);
      setQuote(nextQuote);
      setAlert({ type: "success", message: copy.quoteSuccess });
      return nextQuote;
    } catch (error) {
      setAlert({
        type: "error",
        message: error instanceof Error ? error.message : copy.bookingError,
      });
      return null;
    } finally {
      setQuoteLoading(false);
    }
  };

  const createBooking = async () => {
    if (!canSubmit) {
      setAlert({ type: "error", message: copy.requiredField });
      return;
    }

    setBookingLoading(true);
    setAlert(null);

    try {
      const user = getStoredAuthUser();
      if (!quote) {
        const nextQuote = await loadQuote();
        if (!nextQuote) {
          return;
        }
      }

      const created = await bookingApi.create({
        ...payload,
        userId: user?.id,
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim() || undefined,
      });

      setBooking(created);
      setAlert({
        type: "success",
        message: copy.bookingSuccess(created.bookingCode || String(created.id)),
      });
      window.setTimeout(() => navigate(`/bookings/${created.id}`), 700);
    } catch (error) {
      setAlert({
        type: "error",
        message: error instanceof Error ? error.message : copy.bookingError,
      });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <section id="tour-booking-panel" className="tour-section tour-booking-panel">
      <div className="tour-section-heading">
        <p className="tour-section-kicker">{copy.bookingKicker}</p>
        <h2>{copy.bookingTitle}</h2>
        <p>{copy.bookingCopy}</p>
      </div>

      <div className="tour-booking-layout">
        <form className="tour-booking-form">
          <label className="tour-booking-field full">
            <span>{copy.selectSchedule}</span>
            <select
              value={scheduleId}
              onChange={(event) => {
                setScheduleId(Number(event.target.value));
                setQuote(null);
                setBooking(null);
              }}
            >
              {schedules.map((schedule) => (
                <option key={schedule.id} value={schedule.id}>
                  {schedule.scheduleCode} - {formatTourDate(schedule.departureAt, locale)}
                </option>
              ))}
            </select>
          </label>

          <div className="tour-booking-counter-grid" aria-label={copy.passengerCount}>
            {[
              [copy.adults, adults, setAdults, 1],
              [copy.children, children, setChildren, 0],
              [copy.infants, infants, setInfants, 0],
              [copy.seniors, seniors, setSeniors, 0],
            ].map(([label, value, setter, min]) => (
              <label className="tour-booking-field" key={String(label)}>
                <span>{String(label)}</span>
                <input
                  type="number"
                  min={Number(min)}
                  value={Number(value)}
                  onChange={(event) => {
                    const nextValue = Math.max(Number(min), Number(event.target.value));
                    (setter as (value: number) => void)(Number.isFinite(nextValue) ? nextValue : Number(min));
                    setQuote(null);
                  }}
                />
              </label>
            ))}
          </div>

          <label className="tour-booking-field">
            <span>{copy.voucherCode}</span>
            <input
              value={voucherCode}
              onChange={(event) => {
                setVoucherCode(event.target.value);
                setQuote(null);
              }}
              placeholder="TRAVELVIET"
            />
          </label>

          <label className="tour-booking-field">
            <span>{copy.contactName}</span>
            <input
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
            />
          </label>

          <label className="tour-booking-field">
            <span>{copy.contactPhone}</span>
            <input
              value={contactPhone}
              onChange={(event) => setContactPhone(event.target.value)}
            />
          </label>

          <label className="tour-booking-field">
            <span>{copy.contactEmail}</span>
            <input
              type="email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
            />
          </label>

          <div className="tour-booking-actions">
            <button type="button" onClick={loadQuote} disabled={quoteLoading}>
              <Calculator size={18} />
              {quoteLoading ? copy.reviewsLoading : copy.quoteAction}
            </button>
            <button
              type="button"
              className="primary"
              onClick={createBooking}
              disabled={bookingLoading || !schedules.length}
            >
              <Ticket size={18} />
              {bookingLoading ? copy.reviewsLoading : copy.createBookingAction}
            </button>
          </div>
        </form>

        <aside className="tour-booking-summary">
          <div className="tour-booking-summary-head">
            <strong>{selectedSchedule?.scheduleCode || copy.selectSchedule}</strong>
            <span>{selectedSchedule?.status || copy.status}</span>
          </div>

          {selectedSchedule && (
            <div className="tour-booking-summary-route">
              <span>{formatTourDate(selectedSchedule.departureAt, locale)}</span>
              <span>{formatTourDate(selectedSchedule.returnAt, locale)}</span>
            </div>
          )}

          <dl>
            <div>
              <dt>{copy.subtotal}</dt>
              <dd>
                {formatTourPrice(
                  quote?.subtotalAmount ?? selectedSchedule?.adultPrice,
                  tour.currency,
                  locale,
                )}
              </dd>
            </div>
            <div>
              <dt>{copy.discount}</dt>
              <dd>{formatTourPrice(quote?.discountAmount ?? 0, tour.currency, locale)}</dd>
            </div>
            <div>
              <dt>{copy.tax}</dt>
              <dd>{formatTourPrice(quote?.taxAmount ?? 0, tour.currency, locale)}</dd>
            </div>
            <div className="total">
              <dt>{copy.finalAmount}</dt>
              <dd>
                {formatTourPrice(
                  quote?.finalAmount ??
                    parseAmount(selectedSchedule?.adultPrice) * Math.max(1, adults),
                  tour.currency,
                  locale,
                )}
              </dd>
            </div>
          </dl>

          {quote?.appliedVoucher && (
            <p className="tour-booking-voucher">
              <CheckCircle2 size={16} />
              {copy.appliedVoucher}: {quote.appliedVoucher.voucherCode}
            </p>
          )}

          {booking && (
            <p className="tour-booking-created">
              <CheckCircle2 size={16} />
              {copy.bookingSuccess(booking.bookingCode || String(booking.id))}
            </p>
          )}

          {alert && (
            <p className={`tour-booking-alert ${alert.type}`}>{alert.message}</p>
          )}
        </aside>
      </div>
    </section>
  );
}
