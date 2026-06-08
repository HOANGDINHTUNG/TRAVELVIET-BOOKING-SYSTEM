import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import "@/module/flights/components/FlightSearchHero.css";

const WEEKDAYS_VI = [
  "Th 2",
  "Th 3",
  "Th 4",
  "Th 5",
  "Th 6",
  "Th 7",
  "CN",
] as const;
const WEEKDAYS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function parseIso(iso: string): Date {
  return new Date(`${iso}T12:00:00`);
}

function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDisplay(iso: string, locale: string): string {
  if (!iso) return "";
  return parseIso(iso).toLocaleDateString(locale === "vi" ? "vi-VN" : "en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function monthLabel(d: Date, locale: string): string {
  return d.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
    month: "long",
    year: "numeric",
  });
}

function buildMonthGrid(viewMonth: Date): (Date | null)[][] {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day, 12));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Ensure the popup looks nice and fits in with the standard FlightCalendar
// but maps over the HomeSearchBar styles.
export function SingleDatePicker({
  date,
  onChange,
  className,
}: {
  date: string;
  onChange: (iso: string) => void;
  className?: string; // The shell wrapper class
}) {
  const { t, i18n } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    if (date) {
      const d = parseIso(date);
      return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const weekdays = i18n.language === "vi" ? WEEKDAYS_VI : WEEKDAYS_EN;
  const monthA = viewMonth;
  const monthB = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const pickDate = (d: Date) => {
    onChange(toIso(d));
    setOpen(false); // Close upon selecting the date
  };

  const renderMonth = (monthDate: Date) => {
    const weeks = buildMonthGrid(monthDate);
    return (
      <div className="flight-cal__month" key={monthDate.toISOString()}>
        <p className="flight-cal__month-title">
          {monthLabel(monthDate, i18n.language)}
        </p>
        <div className="flight-cal__weekdays">
          {weekdays.map((wd, i) => (
            <span
              key={wd}
              className={`flight-cal__weekday${i === 6 ? " is-sun" : ""}`}
            >
              {wd}
            </span>
          ))}
        </div>
        <div className="flight-cal__grid">
          {weeks.map((week, wi) =>
            week.map((cell, di) => {
              if (!cell) {
                return (
                  <span
                    key={`${wi}-${di}-s`}
                    className="flight-cal__day is-empty"
                  />
                );
              }
              const isPast = cell < today && !isSameDay(cell, today);
              const isSelected = date && isSameDay(cell, parseIso(date));
              const isToday = isSameDay(cell, today);
              const isSun = cell.getDay() === 0;

              return (
                <button
                  key={`${wi}-${di}`}
                  type="button"
                  disabled={isPast}
                  className={[
                    "flight-cal__day",
                    isPast ? "is-disabled" : "",
                    isSelected ? "is-selected" : "",
                    isToday ? "is-today" : "",
                    isSun ? "is-sun" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={(e) => {
                    e.preventDefault();
                    pickDate(cell);
                  }}
                >
                  {cell.getDate()}
                </button>
              );
            }),
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={rootRef}
      className={cn(className, "relative text-left !overflow-visible")}
      onClick={(e) => {
        if (!open) setOpen(true);
      }}
    >
      <span className="pointer-events-none absolute left-2.5 z-[2] flex items-center text-[var(--home-search-icon,#ff6600)]">
        <Calendar size={17} strokeWidth={2.4} aria-hidden />
      </span>

      <button
        type="button"
        className={cn(
          "h-full min-h-[46px] w-full appearance-none bg-transparent pl-9 pr-3 text-sm flex items-center",
          "outline-none text-left",
          date
            ? "text-[var(--home-search-field-text)]"
            : "text-[var(--home-search-field-muted)]",
        )}
      >
        {date
          ? formatDisplay(date, i18n.language)
          : t("homePage.search.datePlaceholder")}
      </button>

      {open ? (
        // The dialog popup matching flight/hotel calendar design!
        <div className="absolute top-[calc(100%+8px)] left-0 z-50 mt-2 bg-white rounded-xl shadow-xl border border-slate-200">
          <div
            className="flight-cal"
            style={{
              position: "relative",
              top: "auto",
              left: "auto",
              transform: "none",
              minWidth: "max-content",
            }}
            role="dialog"
          >
            <div className="flight-cal__nav">
              <button
                type="button"
                className="flight-cal__nav-btn"
                aria-label="Previous Month"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setViewMonth(
                    (m) => new Date(m.getFullYear(), m.getMonth() - 1, 1),
                  );
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flight-cal__months" style={{ display: "flex" }}>
                {renderMonth(monthA)}
                {renderMonth(monthB)}
              </div>
              <button
                type="button"
                className="flight-cal__nav-btn"
                aria-label="Next Month"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setViewMonth(
                    (m) => new Date(m.getFullYear(), m.getMonth() + 1, 1),
                  );
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
