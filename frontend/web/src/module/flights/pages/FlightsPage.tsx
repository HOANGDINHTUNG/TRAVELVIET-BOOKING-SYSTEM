import { useState } from "react";
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
  const [tripType, setTripType] = useState<"round-trip" | "one-way">(
    "round-trip",
  );

  return (
    <div className="flights-page">
      <FlightSearchHero tripType={tripType} onTripTypeChange={setTripType} />
      <FlightHotDealsSection tripType={tripType} />
      <FlightFeaturedDestinations />
      <FlightAboutContent />
      <Footer />
    </div>
  );
}
