import { useEffect, useId, useRef, useState } from "react";
import { MapPin, Plane, X } from "lucide-react";
import {
  filterFlightAirports,
  formatAirportLabel,
  type FlightAirportOption,
} from "../data/flightAirportData";
import { extractIataFromLabel } from "../utils/flightSearchParams";

type FlightAirportAutocompleteProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string, option?: FlightAirportOption) => void;
  clearAria: string;
  listAria: string;
  excludeValue?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
};

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;

  const lower = text.toLowerCase();
  const needle = q.toLowerCase();
  const idx = lower.indexOf(needle);
  if (idx === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, idx)}
      <mark className="flight-ac__mark">
        {text.slice(idx, idx + needle.length)}
      </mark>
      {text.slice(idx + needle.length)}
    </>
  );
}

export function FlightAirportAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  clearAria,
  listAria,
  excludeValue,
  inputRef: externalInputRef,
}: FlightAirportAutocompleteProps) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef || internalInputRef;
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Extract IATA from excludeValue like "TP. Hồ Chí Minh (SGN)" -> "SGN"
  const excludedIata = excludeValue
    ? extractIataFromLabel(excludeValue, "")
    : null;

  const suggestions = filterFlightAirports(value).filter(
    (s) => s.iata !== excludedIata,
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [value]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const showList = open && suggestions.length > 0;

  const openList = () => setOpen(true);

  const pick = (opt: FlightAirportOption) => {
    onChange(formatAirportLabel(opt), opt);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showList) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        openList();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && suggestions[activeIndex]) {
      e.preventDefault();
      pick(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div
      className="flight-route-field"
      ref={rootRef}
      onMouseDown={(e) => {
        if (e.target === inputRef.current) return;
        e.preventDefault();
        inputRef.current?.focus();
        openList();
      }}
    >
      <span className="flight-route-field__icon" aria-hidden>
        <MapPin size={16} strokeWidth={2.2} />
      </span>
      <div className="flight-route-field__body">
        <span className="flight-route-field__label">{label}</span>
        <input
          ref={inputRef}
          type="text"
          className="flight-route-field__input"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={showList}
          aria-controls={showList ? listboxId : undefined}
          aria-autocomplete="list"
          onFocus={openList}
          onClick={openList}
          onChange={(e) => {
            onChange(e.target.value);
            openList();
          }}
          onKeyDown={onKeyDown}
        />
      </div>
      {value ? (
        <button
          type="button"
          className="flight-route-field__clear"
          aria-label={clearAria}
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
        >
          <X size={14} strokeWidth={2.2} aria-hidden />
        </button>
      ) : null}

      {showList ? (
        <ul
          id={listboxId}
          className="flight-ac__list"
          role="listbox"
          aria-label={listAria}
        >
          {suggestions.map((opt, index) => (
            <li key={`${opt.iata}-${opt.city}`} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={`flight-ac__item${index === activeIndex ? " is-active" : ""}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => pick(opt)}
              >
                <span className="flight-ac__plane" aria-hidden>
                  <Plane size={16} strokeWidth={2} />
                </span>
                <span className="flight-ac__text">
                  <span className="flight-ac__city">
                    <HighlightMatch text={opt.city} query={value} />
                  </span>
                  <span className="flight-ac__airport">{opt.airportName}</span>
                </span>
                <span className="flight-ac__iata">{opt.iata}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
