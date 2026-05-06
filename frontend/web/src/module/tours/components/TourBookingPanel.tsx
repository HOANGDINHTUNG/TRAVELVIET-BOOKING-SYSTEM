import { useEffect, useMemo, useState } from "react";
import { Calculator, CheckCircle2, Info, LogIn, Ticket } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  bookingApi,
  type Booking,
  type BookingQuote,
} from "../../../api/server/Booking.api";
import {
  getStoredAccessToken,
  getStoredAuthUser,
} from "../../../utils/authSessionStorage";
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
  | { type: "info"; message: string }
  | null;

type CountControl = {
  label: string;
  value: number;
  min: number;
  setter: (value: number) => void;
};

const MAX_TRAVELLERS = 20;

function parseAmount(value: number | string | undefined) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

function parseDate(value: string | undefined) {
  if (!value) {
    return null;
  }

  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

function getRemainingSeats(schedule: BackendTourSchedule | undefined) {
  if (!schedule) {
    return 0;
  }

  if (Number.isFinite(schedule.remainingSeats)) {
    return Math.max(0, Number(schedule.remainingSeats));
  }

  const capacity = Number(schedule.capacityTotal);
  if (!Number.isFinite(capacity) || capacity <= 0) {
    return Number.POSITIVE_INFINITY;
  }

  const bookedSeats = Number(schedule.bookedSeats);
  return Math.max(0, capacity - (Number.isFinite(bookedSeats) ? bookedSeats : 0));
}

function isScheduleBookable(schedule: BackendTourSchedule | undefined) {
  if (!schedule || schedule.status?.toLowerCase() !== "open") {
    return false;
  }

  const now = Date.now();
  const bookingOpenAt = parseDate(schedule.bookingOpenAt);
  const bookingCloseAt = parseDate(schedule.bookingCloseAt);

  if (bookingOpenAt !== null && now < bookingOpenAt) {
    return false;
  }
  if (bookingCloseAt !== null && now > bookingCloseAt) {
    return false;
  }

  return getRemainingSeats(schedule) > 0;
}

function isValidEmail(value: string) {
  if (!value.trim()) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function normalizeCount(rawValue: string, min: number) {
  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed)) {
    return min;
  }

  return Math.max(min, Math.floor(parsed));
}

export function TourBookingPanel({
  tour,
  schedules,
  selectedScheduleId,
  copy,
  locale,
}: TourBookingPanelProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const bookableSchedules = useMemo(
    () => schedules.filter(isScheduleBookable),
    [schedules],
  );
  const [scheduleId, setScheduleId] = useState(bookableSchedules[0]?.id ?? 0);
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
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(getStoredAccessToken() && getStoredAuthUser()),
  );

  useEffect(() => {
    const syncAuthState = () => {
      const user = getStoredAuthUser();
      setIsAuthenticated(Boolean(getStoredAccessToken() && user));
      setContactName((current) => current || user?.displayName || user?.fullName || "");
      setContactEmail((current) => current || user?.email || "");
      setContactPhone((current) => current || user?.phone || "");
    };

    syncAuthState();
    window.addEventListener("travelviet:login", syncAuthState);
    window.addEventListener("travelviet:logout", syncAuthState);
    window.addEventListener("travelviet:token-refresh", syncAuthState);

    return () => {
      window.removeEventListener("travelviet:login", syncAuthState);
      window.removeEventListener("travelviet:logout", syncAuthState);
      window.removeEventListener("travelviet:token-refresh", syncAuthState);
    };
  }, []);

  useEffect(() => {
    const selectedBookableSchedule = selectedScheduleId
      ? bookableSchedules.find((schedule) => schedule.id === selectedScheduleId)
      : undefined;

    if (selectedBookableSchedule) {
      setScheduleId(selectedBookableSchedule.id);
    }
  }, [bookableSchedules, selectedScheduleId]);

  useEffect(() => {
    if (
      selectedScheduleId &&
      bookableSchedules.some((schedule) => schedule.id === selectedScheduleId)
    ) {
      return;
    }

    if (!bookableSchedules.some((schedule) => schedule.id === scheduleId)) {
      setScheduleId(bookableSchedules[0]?.id ?? 0);
    }
  }, [bookableSchedules, scheduleId, selectedScheduleId]);

  useEffect(() => {
    setQuote(null);
    setBooking(null);
  }, [adults, children, infants, scheduleId, seniors, voucherCode]);

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

  const seatTakingCount = adults + children + seniors;
  const travellerCount = seatTakingCount + infants;
  const remainingSeats = getRemainingSeats(selectedSchedule);
  const hasEnoughSeats =
    Number.isFinite(remainingSeats) ? seatTakingCount <= remainingSeats : true;
  const hasValidEmail = isValidEmail(contactEmail);
  const hasBookableSchedule = Boolean(selectedSchedule && isScheduleBookable(selectedSchedule));
  const canQuote =
    hasBookableSchedule &&
    hasEnoughSeats &&
    hasValidEmail &&
    travellerCount <= MAX_TRAVELLERS;
  const canSubmit =
    canQuote && Boolean(contactName.trim() && contactPhone.trim());

  const countControls: CountControl[] = [
    { label: copy.adults, value: adults, setter: setAdults, min: 1 },
    { label: copy.children, value: children, setter: setChildren, min: 0 },
    { label: copy.infants, value: infants, setter: setInfants, min: 0 },
    { label: copy.seniors, value: seniors, setter: setSeniors, min: 0 },
  ];

  const redirectToLogin = () => {
    navigate("/login", {
      state: { from: `${location.pathname}${location.search}` },
    });
  };

  const getValidationMessage = (requireContact: boolean) => {
    if (!isAuthenticated) {
      return copy.loginRequired;
    }
    if (!hasBookableSchedule) {
      return copy.noBookableSchedules;
    }
    if (!hasEnoughSeats) {
      return copy.seatLimitExceeded(
        Number.isFinite(remainingSeats) ? remainingSeats : 0,
      );
    }
    if (travellerCount > MAX_TRAVELLERS) {
      return copy.travellerLimitExceeded(MAX_TRAVELLERS);
    }
    if (!hasValidEmail) {
      return copy.invalidEmail;
    }
    if (requireContact && (!contactName.trim() || !contactPhone.trim())) {
      return copy.requiredField;
    }
    return "";
  };

  const loadQuote = async () => {
    const validationMessage = getValidationMessage(false);
    if (validationMessage) {
      setAlert({ type: "error", message: validationMessage });
      if (!isAuthenticated) {
        redirectToLogin();
      }
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
    const validationMessage = getValidationMessage(true);
    if (validationMessage) {
      setAlert({ type: "error", message: validationMessage });
      if (!isAuthenticated) {
        redirectToLogin();
      }
      return;
    }

    setBookingLoading(true);
    setAlert(null);

    try {
      if (!quote) {
        const nextQuote = await loadQuote();
        if (!nextQuote) {
          return;
        }
      }

      const created = await bookingApi.create({
        ...payload,
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim() || undefined,
      });

      setBooking(created);
      setAlert({
        type: "success",
        message: copy.bookingSuccess(created.bookingCode || String(created.id)),
      });
      window.setTimeout(() => navigate(`/bookings/${created.id}`), 500);
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
              disabled={!bookableSchedules.length}
              onChange={(event) => {
                setScheduleId(Number(event.target.value));
              }}
            >
              {bookableSchedules.length ? (
                bookableSchedules.map((schedule) => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.scheduleCode} - {formatTourDate(schedule.departureAt, locale)}
                  </option>
                ))
              ) : (
                <option value={0}>{copy.noBookableSchedules}</option>
              )}
            </select>
          </label>

          {selectedSchedule && Number.isFinite(remainingSeats) && (
            <p className="tour-booking-help">
              <Info size={16} />
              {copy.remainingSeatsLabel(remainingSeats)}
            </p>
          )}

          <div className="tour-booking-counter-grid" aria-label={copy.passengerCount}>
            {countControls.map(({ label, value, setter, min }) => (
              <label className="tour-booking-field" key={label}>
                <span>{label}</span>
                <input
                  type="number"
                  min={min}
                  max={MAX_TRAVELLERS}
                  value={value}
                  onChange={(event) => {
                    setter(normalizeCount(event.target.value, min));
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
            <button
              type="button"
              onClick={loadQuote}
              disabled={quoteLoading || !canQuote}
            >
              <Calculator size={18} />
              {quoteLoading ? copy.reviewsLoading : copy.quoteAction}
            </button>
            <button
              type="button"
              className="primary"
              onClick={createBooking}
              disabled={bookingLoading || !hasBookableSchedule}
            >
              {isAuthenticated ? <Ticket size={18} /> : <LogIn size={18} />}
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

          {!canSubmit && (
            <p className="tour-booking-alert info">
              {getValidationMessage(true) || copy.requiredField}
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
