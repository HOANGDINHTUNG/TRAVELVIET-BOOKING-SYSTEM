import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicItineraryDay, TourResponse } from "../types/publicTour";

type TourItineraryTimelineProps = {
  tour: TourResponse;
};

function normalizeDays(input: unknown): PublicItineraryDay[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter(
      (it): it is Record<string, unknown> =>
        typeof it === "object" && it !== null,
    )
    .map((raw) => ({
      dayNumber: typeof raw.dayNumber === "number" ? raw.dayNumber : null,
      title: typeof raw.title === "string" ? raw.title : null,
      description: typeof raw.description === "string" ? raw.description : null,
      dayImageUrl: typeof raw.dayImageUrl === "string" ? raw.dayImageUrl : null,
      overnightDestinationId:
        typeof raw.overnightDestinationId === "number"
          ? raw.overnightDestinationId
          : null,
      items: Array.isArray(raw.items) ? raw.items : [],
    }))
    .sort((a, b) => (a.dayNumber ?? 0) - (b.dayNumber ?? 0));
}

function TourItineraryTimeline({ tour }: TourItineraryTimelineProps) {
  const { t } = useTranslation("tours");
  const days = normalizeDays(tour.itineraryDays);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set([0])); // Expand day 1 by default

  const toggleDay = (index: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const allExpanded = days.length > 0 && expandedIds.size === days.length;

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(days.map((_, i) => i)));
    }
  };

  if (days.length === 0) {
    return (
      <p className="text-sm text-[var(--color-muted,#64748b)]">
        {String(t("detail.itinerary.empty"))}
      </p>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-5">
        <h3 className="text-xl font-bold text-[#00b2d6]">Chương trình tour</h3>
        <button
          onClick={toggleAll}
          className="text-sm font-medium text-[#00b2d6] hover:text-[#0092af] transition-colors"
        >
          {allExpanded ? "Thu gọn" : "Xem tất cả"}
        </button>
      </div>

      <div className="flex flex-col">
        {days.map((day, index) => {
          const isExpanded = expandedIds.has(index);

          return (
            <div
              key={`${day.dayNumber ?? index}`}
              className={cn(
                "border-b border-slate-200 dark:border-slate-800 last:border-b-0",
                isExpanded
                  ? "bg-slate-50/30 dark:bg-slate-800/30"
                  : "bg-white dark:bg-slate-900",
              )}
            >
              {/* ACCORDION HEADER */}
              <button
                onClick={() => toggleDay(index)}
                className="w-full text-left p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Thumbnail Image - Always visible to match user requirement */}
                  {day.dayImageUrl && (
                    <div className="shrink-0 h-16 w-[100px] sm:w-[120px] rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <img
                        src={day.dayImageUrl}
                        alt={`Ngày ${day.dayNumber}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-sm font-semibold text-[#00b2d6] mb-1">
                      Ngày {day.dayNumber ?? index + 1}
                    </span>
                    <h4 className="text-[15px] text-[var(--color-heading)] font-medium truncate leading-tight">
                      {day.title ?? String(t("detail.itinerary.untitledDay"))}
                    </h4>
                  </div>
                </div>

                <ChevronDown
                  className={cn(
                    "shrink-0 h-5 w-5 text-slate-400 transition-transform duration-300 ml-4",
                    isExpanded && "rotate-180",
                  )}
                />
              </button>

              {/* ACCORDION CONTENT */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 animate-in slide-in-from-top-2 duration-200">
                  <div className="border-t border-dashed border-slate-200 dark:border-slate-700 pt-4 mb-4" />

                  {/* Day general description */}
                  {day.description && (
                    <p className="text-[14.5px] leading-relaxed text-[var(--color-text)] font-normal mb-6 whitespace-pre-line">
                      {day.description}
                    </p>
                  )}

                  {/* Nested Itinerary Items */}
                  {day.items && day.items.length > 0 && (
                    <div className="flex flex-col gap-6">
                      {day.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex flex-col gap-3">
                          {/* Item Title & Desc */}
                          <div className="text-[14.5px] leading-relaxed text-[var(--color-text)]">
                            <strong className="text-[var(--color-heading)] tracking-tight">
                              {item.title}
                            </strong>
                            {item.description && (
                              <span> - {item.description}</span>
                            )}
                          </div>

                          {/* Item Inline Image */}
                          {item.imageUrl && (
                            <figure className="mt-1 mb-2">
                              <div className="w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                <img
                                  src={item.imageUrl}
                                  alt={item.imageCaption || item.title}
                                  className="w-full h-auto object-cover max-h-[400px]"
                                />
                              </div>
                              {item.imageCaption && (
                                <figcaption className="mt-2.5 text-center text-[13.5px] italic text-slate-500">
                                  {item.imageCaption}
                                </figcaption>
                              )}
                            </figure>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {day.overnightDestinationId && (
                    <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-slate-600">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      {String(t("detail.itinerary.overnight"))} #
                      {day.overnightDestinationId}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TourItineraryTimeline;
