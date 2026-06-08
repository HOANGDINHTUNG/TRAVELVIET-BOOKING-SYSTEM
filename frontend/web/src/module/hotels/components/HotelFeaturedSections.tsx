import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getBackendData } from "@/api/server/serverApiClient";
import type { PageResponse } from "@/types/api";
import type { HotelResponse } from "@/api/server/Hotel.api";
import { HotelOfferCard } from "./HotelOfferCard";
import { HotelFeaturedCardsSkeleton } from "./HotelFeaturedCardsSkeleton";
import "./HotelFeaturedSections.css";

function HotelCarouselSection({
  title,
  filters,
  hotels,
  loading,
}: {
  title: string;
  filters: string[];
  hotels: HotelResponse[];
  loading: boolean;
}) {
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollCarousel = (dir: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 350;
      carouselRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Very naive filter simulation for UI since real DB might not have all these cities
  const displayHotels = useMemo(() => {
    if (loading) return [];
    return hotels
      .filter((h) => h.province.includes(activeFilter) || true)
      .slice(0, 8); // just returning subset as mock filter
  }, [hotels, activeFilter, loading]);

  return (
    <div className="hf-section">
      <div className="hf-section__header-flex">
        <h2 className="hf-section__title">{title}</h2>
        <button
          className="hf-section__view-more"
          onClick={() => navigate("/hotels/all")}
        >
          Xem thêm
          <span className="hf-section__view-more-icon">→</span>
        </button>
      </div>

      <div className="hf-section__tabs">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`hf-section__tab ${activeFilter === filter ? "is-active" : ""}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="hf-section__carousel-wrap">
        <button
          type="button"
          className="hf-section__btn hf-section__btn--prev"
          onClick={() => scrollCarousel("left")}
        >
          ←
        </button>

        <div className="hf-section__row" ref={carouselRef}>
          {loading ? (
            <HotelFeaturedCardsSkeleton />
          ) : displayHotels.length === 0 ? (
            <p className="hf-section__empty">Chưa có dữ liệu</p>
          ) : (
            displayHotels.map((h) => <HotelOfferCard key={h.id} hotel={h} />)
          )}
        </div>

        <button
          type="button"
          className="hf-section__btn hf-section__btn--next"
          onClick={() => scrollCarousel("right")}
        >
          →
        </button>
      </div>
    </div>
  );
}

export function HotelFeaturedSections() {
  const [hotels, setHotels] = useState<HotelResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getBackendData<PageResponse<HotelResponse>>("hotels", {
      isActive: true,
      size: 16, // Get more for the sake of 2 carousels
    })
      .then((res) => {
        if (active) {
          setHotels(res.content ?? []);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch featured hotels:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const domesticFilters = [
    "Hà Nội",
    "Đà Nẵng",
    "Đà Lạt",
    "Phú Quốc",
    "Cần Thơ",
    "TP. Hồ Chí Minh",
  ];
  const intlFilters = [
    "Trung Quốc",
    "Thái Lan",
    "Singapore",
    "Hàn Quốc",
    "Nhật Bản",
    "Đài Loan",
    "UAE (Dubai, Abu Dhabi..)",
  ];

  // Mock split
  const domesticHotels = hotels.slice(0, Math.ceil(hotels.length / 2));
  const intlHotels = hotels.slice(Math.ceil(hotels.length / 2));

  return (
    <div className="hotel-featured-sections">
      <div className="hotel-featured-sections__inner">
        <HotelCarouselSection
          title="Khách sạn nổi bật nội địa"
          filters={domesticFilters}
          hotels={domesticHotels}
          loading={loading}
        />
        <br />
        <br />
        <HotelCarouselSection
          title="Khách sạn nổi bật quốc tế"
          filters={intlFilters}
          hotels={intlHotels}
          loading={loading}
        />
      </div>
    </div>
  );
}
