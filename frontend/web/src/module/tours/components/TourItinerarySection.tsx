import { Clock, MapPin } from "lucide-react";
import type { BackendTour } from "../../home/database/interface/publicTravel";

type TourItinerarySectionProps = {
  tour: BackendTour;
};

export function TourItinerarySection({ tour }: TourItinerarySectionProps) {
  const sortedDays = (tour.itineraryDays || []).sort(
    (a, b) => a.dayNumber - b.dayNumber,
  );

  const formatTime = (time?: string | number[] | null) => {
    if (!time) return "--:--";
    if (Array.isArray(time)) {
      const h = String(time[0]).padStart(2, "0");
      const m = String(time[1]).padStart(2, "0");
      return `${h}:${m}`;
    }
    if (typeof time === "string") {
      return time.substring(0, 5);
    }
    return "--:--";
  };

  return (
    <section className="tour-itinerary-section">
      <h2 className="section-title">Lịch trình chi tiết</h2>

      <div className="itinerary-timeline">
        {sortedDays.map((day) => (
          <div key={day.id} className="itinerary-day">
            <div className="day-marker">
              <span className="day-number">Ngày {day.dayNumber}</span>
              <div className="marker-dot" />
              <div className="marker-line" />
            </div>

            <div className="day-content">
              <h3 className="day-title">{day.title}</h3>
              {day.description && (
                <p className="day-summary">{day.description}</p>
              )}

              <div className="day-items">
                {(day.items || [])
                  .sort((a, b) => a.sequenceNo - b.sequenceNo)
                  .map((item) => (
                    <div key={item.id} className="itinerary-item">
                      <div className="item-time">
                        <Clock size={16} />
                        <span>{formatTime(item.startTime)}</span>
                      </div>
                      <div className="item-detail">
                        <h4 className="item-title">{item.title}</h4>
                        {item.description && (
                          <p className="item-description">{item.description}</p>
                        )}
                        {item.locationName && (
                          <div className="item-location">
                            <MapPin size={14} />
                            <span>{item.locationName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
