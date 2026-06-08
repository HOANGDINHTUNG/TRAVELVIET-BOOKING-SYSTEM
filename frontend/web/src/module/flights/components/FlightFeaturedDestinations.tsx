import { useEffect, useState } from "react";
import {
  fetchPublicFlights,
  type FlightResponse,
} from "@/api/server/Flight.api";
import "./FlightFeaturedDestinations.css";

export function FlightFeaturedDestinations() {
  const [flights, setFlights] = useState<FlightResponse[]>([]);

  useEffect(() => {
    let active = true;
    fetchPublicFlights({ size: 10 }) // Get extra to find unique valid ones if needed
      .then((res) => {
        if (active) setFlights(res.slice(0, 5));
      })
      .catch((err) => console.error("Failed to fetch featured flights:", err));
    return () => {
      active = false;
    };
  }, []);

  if (flights.length === 0) {
    return null; // Do not render if no data
  }

  // Fallback image helper
  const getAirportImg = () => {
    // Generate a distinct somewhat related random unspash image based on airport code
    return `https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=300&q=80`;
  };

  return (
    <section
      className="flight-featured"
      aria-labelledby="flight-featured-title"
    >
      <div className="flight-featured__inner">
        <h2 id="flight-featured-title" className="flight-featured__title">
          Chặng bay nổi bật
        </h2>
        <ul className="flight-featured__grid">
          {flights.map((f) => (
            <li key={f.id} className="flight-featured__item">
              <div className="flight-featured__pill">
                <img
                  src={getAirportImg()}
                  alt={f.destinationAirportName}
                  className="flight-featured__img"
                  loading="lazy"
                />
                <div className="flight-featured__caption">
                  {f.originAirportCode} - {f.destinationAirportCode}
                  <br />
                  {new Intl.NumberFormat("vi-VN").format(f.minPrice)}₫
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
