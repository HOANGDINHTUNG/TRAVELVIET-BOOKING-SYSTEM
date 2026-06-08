import { Footer } from "@/components/Footer/Footer";
import { FlightAboutContent } from "../components/FlightAboutContent";

import { FlightSearchHero } from "../components/FlightSearchHero";
import { FlightHotDealsSection } from "../components/FlightHotDealsSection";
import { FlightFeaturedDestinations } from "../components/FlightFeaturedDestinations";
import "./FlightsPage.css";

/**
 * Trang đặt vé máy bay (UI only) — `/flights`
 * BE/DB sẽ gắn sau; hiện toast khi bấm Tìm kiếm.
 */
export default function FlightsPage() {
  return (
    <div className="flights-page">
      <FlightSearchHero />
      <FlightHotDealsSection />
      <FlightFeaturedDestinations />
      <FlightAboutContent />
      <Footer />
    </div>
  );
}
