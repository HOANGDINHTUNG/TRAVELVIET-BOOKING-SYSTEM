import { Calendar, Eye, MapPin, Ticket, Users } from "lucide-react";
import type { BackendTourSchedule } from "../../home/database/interface/publicTravel";
import type { TourDetailCopy, TourDetailLocale } from "../utils/tourDetailCopy";
import { formatTourDate, formatTourPrice } from "../utils/tourDetailFormatters";

type TourScheduleSectionProps = {
  schedules: BackendTourSchedule[];
  copy: TourDetailCopy;
  locale: TourDetailLocale;
  currency?: string;
  onViewSchedule?: (schedule: BackendTourSchedule) => void;
};

export function TourScheduleSection({
  schedules,
  copy,
  locale,
  currency = "VND",
  onViewSchedule,
}: TourScheduleSectionProps) {
  return (
    <section id="tour-schedules" className="tour-section tour-schedule-section">
      <div className="tour-section-heading">
        <p className="tour-section-kicker">{copy.schedulesKicker}</p>
        <h2>{copy.schedulesTitle}</h2>
      </div>

      {schedules.length === 0 ? (
        <div className="tour-empty-state">{copy.noSchedules}</div>
      ) : (
        <div className="tour-schedules-grid">
          {schedules.map((schedule) => {
            const meetingPoint =
              schedule.meetingPointName || schedule.meetingAddress || copy.noContent;

            return (
              <article key={schedule.id} className="tour-schedule-card">
                <div className="tour-schedule-head">
                  <span>{schedule.scheduleCode}</span>
                  <strong>{schedule.status}</strong>
                </div>

                <div className="tour-schedule-metrics">
                  <div>
                    <Calendar size={18} />
                    <span>{copy.departure}</span>
                    <strong>{formatTourDate(schedule.departureAt, locale)}</strong>
                  </div>
                  <div>
                    <Calendar size={18} />
                    <span>{copy.returnDate}</span>
                    <strong>{formatTourDate(schedule.returnAt, locale)}</strong>
                  </div>
                  <div>
                    <Users size={18} />
                    <span>{copy.seats}</span>
                    <strong>{schedule.remainingSeats}</strong>
                  </div>
                  <div>
                    <MapPin size={18} />
                    <span>{copy.meetingPoint}</span>
                    <strong>{meetingPoint}</strong>
                  </div>
                </div>

                <div className="tour-schedule-price">
                  <div>
                    <span>{copy.fromPrice}</span>
                    <strong>
                      {formatTourPrice(schedule.adultPrice, currency, locale)}
                    </strong>
                    <small>{copy.perGuest}</small>
                  </div>
                  <a href="#tour-booking-cta" className="tour-action-button">
                    <Ticket size={18} />
                    {copy.bookNow}
                  </a>
                </div>
                {onViewSchedule && (
                  <button
                    type="button"
                    className="tour-schedule-detail-button"
                    onClick={() => onViewSchedule(schedule)}
                  >
                    <Eye size={18} />
                    {copy.viewSchedule}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
