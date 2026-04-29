import { Calendar, MapPin, Route, UserRound, Users, X } from "lucide-react";
import type { BackendTourSchedule } from "../../home/database/interface/publicTravel";
import type { TourDetailCopy, TourDetailLocale } from "../utils/tourDetailCopy";
import { formatTourDate, formatTourPrice } from "../utils/tourDetailFormatters";

type TourScheduleDetailModalProps = {
  schedule: BackendTourSchedule;
  copy: TourDetailCopy;
  locale: TourDetailLocale;
  currency?: string;
  onClose: () => void;
};

function pickupName(point: NonNullable<BackendTourSchedule["pickupPoints"]>[number]) {
  return point.pointName || point.pickupName || point.address || "";
}

function guideName(guide: NonNullable<BackendTourSchedule["guideAssignments"]>[number]) {
  return guide.guideFullName || guide.guideName || guide.guideCode || "";
}

export function TourScheduleDetailModal({
  schedule,
  copy,
  locale,
  currency = "VND",
  onClose,
}: TourScheduleDetailModalProps) {
  return (
    <div className="tour-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="tour-schedule-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-schedule-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="tour-modal-header">
          <div>
            <p className="tour-section-kicker">{schedule.scheduleCode}</p>
            <h2 id="tour-schedule-modal-title">{copy.scheduleDetailTitle}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label={copy.close}>
            <X size={20} />
          </button>
        </header>

        <div className="tour-modal-grid">
          <div className="tour-modal-metric">
            <Calendar size={18} />
            <span>{copy.departure}</span>
            <strong>{formatTourDate(schedule.departureAt, locale)}</strong>
          </div>
          <div className="tour-modal-metric">
            <Calendar size={18} />
            <span>{copy.returnDate}</span>
            <strong>{formatTourDate(schedule.returnAt, locale)}</strong>
          </div>
          <div className="tour-modal-metric">
            <Users size={18} />
            <span>{copy.capacity}</span>
            <strong>{schedule.capacityTotal ?? copy.noContent}</strong>
          </div>
          <div className="tour-modal-metric">
            <Users size={18} />
            <span>{copy.bookedSeats}</span>
            <strong>{schedule.bookedSeats ?? 0}</strong>
          </div>
          <div className="tour-modal-metric">
            <MapPin size={18} />
            <span>{copy.meetingPoint}</span>
            <strong>{schedule.meetingPointName || schedule.meetingAddress || copy.noContent}</strong>
          </div>
          <div className="tour-modal-metric">
            <Route size={18} />
            <span>{copy.transportDetail}</span>
            <strong>{schedule.transportDetail || copy.noContent}</strong>
          </div>
        </div>

        <div className="tour-modal-price-grid">
          <div>
            <span>{copy.adultPrice}</span>
            <strong>{formatTourPrice(schedule.adultPrice, currency, locale)}</strong>
          </div>
          <div>
            <span>{copy.childPrice}</span>
            <strong>{formatTourPrice(schedule.childPrice, currency, locale)}</strong>
          </div>
          <div>
            <span>{copy.infantPrice}</span>
            <strong>{formatTourPrice(schedule.infantPrice, currency, locale)}</strong>
          </div>
          <div>
            <span>{copy.seniorPrice}</span>
            <strong>{formatTourPrice(schedule.seniorPrice, currency, locale)}</strong>
          </div>
        </div>

        {schedule.note && <p className="tour-modal-note">{schedule.note}</p>}

        <div className="tour-modal-columns">
          <article>
            <h3>{copy.pickupPoints}</h3>
            {schedule.pickupPoints?.length ? (
              <ul>
                {schedule.pickupPoints.map((point) => (
                  <li key={point.id}>
                    <MapPin size={15} />
                    <span>
                      <strong>{pickupName(point)}</strong>
                      {point.pickupAt && <small>{formatTourDate(point.pickupAt, locale)}</small>}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{copy.noContent}</p>
            )}
          </article>

          <article>
            <h3>{copy.guides}</h3>
            {schedule.guideAssignments?.length ? (
              <ul>
                {schedule.guideAssignments.map((guide) => (
                  <li key={guide.id}>
                    <UserRound size={15} />
                    <span>
                      <strong>{guideName(guide)}</strong>
                      <small>{guide.guideRole || guide.role || copy.noContent}</small>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{copy.noContent}</p>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}
