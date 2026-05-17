import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Calendar, ChevronDown, MapPin, Plane, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { RevealOnScroll } from "@/components/ui/MotionStagger";

type SelectOption = { value: string; label: string };

/**
 * Class chuẩn cho 1 ô tìm kiếm trong thanh.
 * Tách ra để 3 ô select + 1 ô date share đồng bộ thiết kế.
 */
const fieldShellClass = cn(
  "group relative flex min-h-[46px] flex-1 cursor-pointer items-center overflow-hidden",
  "rounded-lg border border-[#c5d5e5] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
  "transition-colors duration-150",
  "focus-within:border-[#ff6600] focus-within:shadow-[0_0_0_2px_rgba(255,102,0,0.18)]",
);

const fieldIconClass =
  "pointer-events-none absolute left-2.5 z-[2] flex items-center text-[#ff6600]";

const fieldControlClass = cn(
  "h-full min-h-[46px] w-full appearance-none bg-transparent pl-9 pr-8 text-sm text-neutral-700 outline-none",
  "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
);

/**
 * Thanh tìm kiếm tour ở dưới banner — Phase 2: chuyển CSS thuần sang Tailwind v4.
 * Vẫn giữ DNA "panel xanh nhạt" (light blue gradient) đặc trưng TravelViet.
 *
 * Nguyên tắc:
 * - Dùng `appearance-none` + custom chevron để select đồng bộ mọi browser.
 * - Date input có placeholder ảo che khi rỗng để label chỉ hiện khi user chưa chọn.
 * - Layout responsive 100% qua flex-wrap + grid-cols mobile, không cần media query.
 */
export function HomeSearchBar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [departure, setDeparture] = useState("");
  const [tourType, setTourType] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  const { departureOptions, tourTypeOptions, destinationOptions } = useMemo(
    () => ({
      departureOptions: t("homePage.search.departures", {
        returnObjects: true,
      }) as SelectOption[],
      tourTypeOptions: t("homePage.search.tourTypes", {
        returnObjects: true,
      }) as SelectOption[],
      destinationOptions: t("homePage.search.destinations", {
        returnObjects: true,
      }) as SelectOption[],
    }),
    [t, i18n.language],
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (departure) params.set("departure", departure);
    if (tourType) params.set("type", tourType);
    if (destination) params.set("destination", destination);
    if (date) params.set("date", date);
    navigate(`/tours?${params.toString()}`);
  };

  return (
    <RevealOnScroll
      as="section"
      aria-label={t("homePage.search.sectionAria")}
      className={cn(
        "relative overflow-hidden border-b border-[#dce8f2]",
        "bg-[linear-gradient(180deg,#f4fafd_0%,#e8f2fa_55%,#eef6fc_100%)]",
        "px-3 py-[clamp(14px,2.5vw,22px)] sm:px-6 md:px-8 md:pb-4",
      )}
    >
      {/* Lớp light bloom radial — giữ DNA "panel xanh nhạt" */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 opacity-55",
          "bg-[radial-gradient(ellipse_140%_70%_at_15%_-10%,rgba(255,255,255,0.85)_0%,transparent_55%),radial-gradient(ellipse_100%_50%_at_85%_110%,rgba(255,255,255,0.5)_0%,transparent_50%),radial-gradient(ellipse_80%_40%_at_50%_30%,rgba(180,220,245,0.35)_0%,transparent_60%)]",
        )}
      />

      <div
        className={cn(
          "relative z-[1] mx-auto max-w-[var(--home-content-max)] rounded-2xl border border-[#b8d9ee]",
          "bg-[linear-gradient(165deg,#f0f8ff_0%,#e4f2fb_45%,#dff0fa_100%)]",
          "p-3 md:p-4",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_4px_18px_rgba(15,80,120,0.08)]",
        )}
      >
        <div className="flex flex-wrap items-stretch gap-2 sm:gap-2.5">
          {/* Nơi khởi hành */}
          <label
            className={cn(
              fieldShellClass,
              "min-w-[130px] flex-[1_1_calc(50%-6px)] md:flex-[1_1_160px]",
            )}
          >
            <span className={fieldIconClass}>
              <MapPin size={17} strokeWidth={2.4} aria-hidden />
            </span>
            <select
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className={cn(
                fieldControlClass,
                departure ? "text-neutral-900" : "text-[#6b7a8c]",
              )}
              aria-label={t("homePage.search.departurePlaceholder")}
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
            <ChevronDown
              size={14}
              strokeWidth={2.4}
              aria-hidden
              className="pointer-events-none absolute right-2.5 z-[2] text-neutral-800"
            />
          </label>

          {/* Loại tour */}
          <label
            className={cn(
              fieldShellClass,
              "min-w-[130px] flex-[1_1_calc(50%-6px)] md:flex-[1_1_160px]",
            )}
          >
            <span className={fieldIconClass}>
              <Plane size={17} strokeWidth={2.4} aria-hidden />
            </span>
            <select
              value={tourType}
              onChange={(e) => setTourType(e.target.value)}
              className={cn(
                fieldControlClass,
                tourType ? "text-neutral-900" : "text-[#6b7a8c]",
              )}
              aria-label={t("homePage.search.tourTypePlaceholder")}
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
            <ChevronDown
              size={14}
              strokeWidth={2.4}
              aria-hidden
              className="pointer-events-none absolute right-2.5 z-[2] text-neutral-800"
            />
          </label>

          {/* Điểm đến */}
          <label
            className={cn(
              fieldShellClass,
              "min-w-[130px] flex-[1_1_calc(50%-6px)] md:flex-[1_1_160px]",
            )}
          >
            <span className={fieldIconClass}>
              <MapPin size={17} strokeWidth={2.4} aria-hidden />
            </span>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={cn(
                fieldControlClass,
                destination ? "text-neutral-900" : "text-[#6b7a8c]",
              )}
              aria-label={t("homePage.search.destinationPlaceholder")}
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
            <ChevronDown
              size={14}
              strokeWidth={2.4}
              aria-hidden
              className="pointer-events-none absolute right-2.5 z-[2] text-neutral-800"
            />
          </label>

          {/* Ngày khởi hành */}
          <label
            className={cn(
              fieldShellClass,
              "min-w-[130px] flex-[1_1_calc(50%-6px)] md:flex-[1_1_160px]",
            )}
          >
            <span className={fieldIconClass}>
              <Calendar size={17} strokeWidth={2.4} aria-hidden />
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              title={t("homePage.search.dateInputTitle")}
              aria-label={t("homePage.search.dateInputTitle")}
              className={cn(
                fieldControlClass,
                "relative z-[3] pr-3",
                date ? "text-neutral-900" : "text-transparent",
              )}
            />
            {!date ? (
              <span className="pointer-events-none absolute left-9 right-3 top-1/2 z-[1] -translate-y-1/2 text-sm text-[#6b7a8c]">
                {t("homePage.search.datePlaceholder")}
              </span>
            ) : null}
          </label>

          {/* CTA tìm kiếm */}
          <button
            type="button"
            onClick={handleSearch}
            className={cn(
              "inline-flex min-h-[46px] flex-shrink-0 items-center justify-center gap-2",
              "rounded-lg bg-[#ff6600] px-[clamp(18px,3vw,28px)] text-[15px] font-extrabold tracking-wide text-white whitespace-nowrap",
              "shadow-[0_2px_8px_rgba(255,102,0,0.35)] transition-all duration-150",
              "hover:bg-[#e65c00] active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6600]/55 focus-visible:ring-offset-2",
              "max-md:w-full max-md:min-h-[48px]",
            )}
          >
            <Search size={16} strokeWidth={2.6} aria-hidden />
            <span>{t("homePage.search.searchButton")}</span>
          </button>
        </div>
      </div>
    </RevealOnScroll>
  );
}
