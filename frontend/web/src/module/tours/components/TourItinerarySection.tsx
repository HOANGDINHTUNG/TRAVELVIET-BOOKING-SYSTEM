import { Clock, MapPin } from "lucide-react";
import type { BackendTour } from "../../home/database/interface/publicTravel";
import type { TourDetailCopy } from "../utils/tourDetailCopy";
import { formatTourTime } from "../utils/tourDetailFormatters";

type TourItinerarySectionProps = {
  tour: BackendTour;
  copy: TourDetailCopy;
};

export function TourItinerarySection({ tour, copy }: TourItinerarySectionProps) {
  const sortedDays = [...(tour.itineraryDays ?? [])].sort(
    (a, b) => a.dayNumber - b.dayNumber,
  );

  return (
    <section className="tour-section tour-itinerary-section">
      <div className="tour-section-heading">
        <p className="tour-section-kicker">{copy.itineraryKicker}</p>
        <h2>{copy.itineraryTitle}</h2>
      </div>

      {sortedDays.length === 0 ? (
        <div className="tour-empty-state">{copy.noItinerary}</div>
      ) : (
        <div className="tour-itinerary-timeline">
          {sortedDays.map((day) => (
            <article key={day.id} className="tour-itinerary-day">
              <div className="tour-day-marker">
                <span>{copy.day} {day.dayNumber}</span>
                <i aria-hidden="true" />
              </div>

              <div className="tour-day-content">
                <h3>{day.title}</h3>
                {day.description && <p>{day.description}</p>}

                <div className="tour-day-items">
                  {[...(day.items ?? [])]
                    .sort((a, b) => a.sequenceNo - b.sequenceNo)
                    .map((item) => {
                      const startTime = formatTourTime(item.startTime);
                      const endTime = formatTourTime(item.endTime);
                      const timeLabel =
                        startTime && endTime
                          ? `${startTime} - ${endTime}`
                          : startTime || copy.timeFallback;

                      return (
                        <div key={item.id} className="tour-itinerary-item">
                          <div className="tour-item-time">
                            <Clock size={16} />
                            <span>{timeLabel}</span>
                          </div>
                          <div className="tour-item-detail">
                            <h4>{item.title}</h4>
                            {item.description && <p>{item.description}</p>}
                            {item.locationName && (
                              <div className="tour-item-location">
                                <MapPin size={14} />
                                <span>{item.locationName}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
