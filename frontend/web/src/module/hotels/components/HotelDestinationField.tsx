import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, X } from "lucide-react";
const HOTEL_DESTINATION_SUGGESTIONS = [
  "Vũng Tàu",
  "Nha Trang",
  "Hà Nội",
  "Hồ Chí Minh",
  "Đà Lạt",
  "Đà Nẵng",
  "Phú Quốc",
  "Cần Thơ",
  "Bangkok",
  "Singapore",
];
import "./HotelDestinationField.css";

type HotelDestinationFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export function HotelDestinationField({
  value,
  onChange,
}: HotelDestinationFieldProps) {
  const { t } = useTranslation("translation", { keyPrefix: "hotelsPage" });
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const suggestions = HOTEL_DESTINATION_SUGGESTIONS.filter((item) => {
    const q = value.trim().toLowerCase();
    if (!q) return true;
    return item.toLowerCase().includes(q);
  }).slice(0, 8);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const pick = (label: string) => {
    onChange(label);
    setOpen(false);
    setActiveIndex(-1);
  };

  return (
    <div className="hotel-dest-field" ref={rootRef}>
      <span className="hotel-dest-field__icon" aria-hidden>
        <MapPin size={18} strokeWidth={2} />
      </span>
      <div className="hotel-dest-field__body">
        <span className="hotel-dest-field__label">
          {t("search.destinationLabel")}
        </span>
        <input
          type="text"
          className="hotel-dest-field__input"
          placeholder={t("search.destinationPlaceholder")}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (!open || suggestions.length === 0) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((i) => (i + 1) % suggestions.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
            } else if (e.key === "Enter" && activeIndex >= 0) {
              e.preventDefault();
              pick(suggestions[activeIndex]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
        />
      </div>
      {value ? (
        <button
          type="button"
          className="hotel-dest-field__clear"
          aria-label={t("search.clearField")}
          onClick={() => onChange("")}
        >
          <X size={12} strokeWidth={3} />
        </button>
      ) : null}

      {open && suggestions.length > 0 ? (
        <ul
          className="hotel-dest-field__list"
          role="listbox"
          aria-label={t("search.destinationListAria")}
        >
          {suggestions.map((item, index) => (
            <li key={item} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={`hotel-dest-field__item${index === activeIndex ? " is-active" : ""}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(item)}
              >
                <MapPin
                  size={16}
                  strokeWidth={2}
                  className="hotel-dest-field__item-icon"
                />
                <span>{item}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
