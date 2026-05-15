import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MapPin, Plane, Calendar } from "lucide-react";
import "./HomeSearchBar.css";

type SelectOption = { value: string; label: string };

export function HomeSearchBar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [departure, setDeparture] = useState("");
  const [tourType, setTourType] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  const { departureOptions, tourTypeOptions, destinationOptions } = useMemo(() => {
    return {
      departureOptions: t("homePage.search.departures", {
        returnObjects: true,
      }) as SelectOption[],
      tourTypeOptions: t("homePage.search.tourTypes", {
        returnObjects: true,
      }) as SelectOption[],
      destinationOptions: t("homePage.search.destinations", {
        returnObjects: true,
      }) as SelectOption[],
    };
  }, [t, i18n.language]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (departure) params.set("departure", departure);
    if (tourType) params.set("type", tourType);
    if (destination) params.set("destination", destination);
    if (date) params.set("date", date);
    navigate(`/tours?${params.toString()}`);
  };

  return (
    <div className="hsb-wrap">
      <div className="hsb-panel">
        <div className="hsb-bar">
          {/* ============================================================
              Nơi khởi hành
              ============================================================ */}
          <label className={`hsb-field${departure ? " hsb-field-filled" : ""}`}>
            <span className="hsb-icon" aria-hidden>
              <MapPin size={17} strokeWidth={2.4} />
            </span>
            <select
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
            >
              <option value="">
                {t("homePage.search.departurePlaceholder")}
              </option>
              {departureOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <span className="hsb-arrow" aria-hidden>
              ▾
            </span>
          </label>

          {/* ============================================================
              Loại tour
              ============================================================ */}
          <label className={`hsb-field${tourType ? " hsb-field-filled" : ""}`}>
            <span className="hsb-icon" aria-hidden>
              <Plane size={17} strokeWidth={2.4} />
            </span>
            <select
              value={tourType}
              onChange={(e) => setTourType(e.target.value)}
            >
              <option value="">
                {t("homePage.search.tourTypePlaceholder")}
              </option>
              {tourTypeOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <span className="hsb-arrow" aria-hidden>
              ▾
            </span>
          </label>

          {/* ============================================================
              Điểm đến
              ============================================================ */}
          <label className={`hsb-field${destination ? " hsb-field-filled" : ""}`}>
            <span className="hsb-icon" aria-hidden>
              <MapPin size={17} strokeWidth={2.4} />
            </span>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="">
                {t("homePage.search.destinationPlaceholder")}
              </option>
              {destinationOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <span className="hsb-arrow" aria-hidden>
              ▾
            </span>
          </label>

          {/* ============================================================
              Ngày khởi hành
              ============================================================ */}
          <label className={`hsb-field hsb-field-date${date ? " hsb-field-date-filled" : ""}`}>
            <span className="hsb-icon" aria-hidden>
              <Calendar size={17} strokeWidth={2.4} />
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              title={t("homePage.search.dateInputTitle")}
            />
            {!date ? (
              <span className="hsb-date-placeholder">
                {t("homePage.search.datePlaceholder")}
              </span>
            ) : null}
          </label>

          {/* ============================================================
              Nút tìm kiếm
              ============================================================ */}
          <button type="button" className="hsb-btn" onClick={handleSearch}>
            {t("homePage.search.searchButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
