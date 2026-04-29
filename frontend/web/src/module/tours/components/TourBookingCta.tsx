import { CalendarCheck, MessageCircle } from "lucide-react";
import type { BackendTour } from "../../home/database/interface/publicTravel";
import type { TourDetailCopy } from "../utils/tourDetailCopy";

type TourBookingCtaProps = {
  tour: BackendTour;
  copy: TourDetailCopy;
};

export function TourBookingCta({ tour, copy }: TourBookingCtaProps) {
  return (
    <section id="tour-booking-cta" className="tour-booking-cta">
      <div>
        <p className="tour-section-kicker">{copy.ctaKicker}</p>
        <h2>{copy.ctaTitle(tour.name)}</h2>
        <p>{copy.ctaCopy}</p>
      </div>
      <a href="#tour-schedules" className="tour-action-button primary">
        <CalendarCheck size={18} />
        {copy.ctaAction}
      </a>
      <span className="tour-cta-mark" aria-hidden="true">
        <MessageCircle size={42} />
      </span>
    </section>
  );
}
