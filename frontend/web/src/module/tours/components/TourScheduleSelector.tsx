import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CalendarRange, Loader2 } from "lucide-react";
import { formatCurrencyVnd } from "@/utils/currency";
import type { TourScheduleResponse } from "../types/publicTour";
import { listBookableSchedules } from "../utils/tourScheduleSelection";

type TourScheduleSelectorProps = {
  schedules: TourScheduleResponse[] | null | undefined;
  isLoading?: boolean;
  selectedId: number | null;
  onSelect: (schedule: TourScheduleResponse) => void;
};

export function TourScheduleSelector(props: TourScheduleSelectorProps) {
  const { t } = useTranslation("tours");

  const bookable = useMemo(
    () => listBookableSchedules(props.schedules),
    [props.schedules],
  );

  const schedulesByMonth = useMemo(() => {
    const map = new Map<string, TourScheduleResponse[]>();
    for (const schedule of bookable) {
      if (!schedule.departureAt) continue;
      const date = new Date(schedule.departureAt);
      const key = `Tháng ${date.getMonth() + 1}\n${date.getFullYear()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(schedule);
    }
    return map;
  }, [bookable]);

  const monthKeys = Array.from(schedulesByMonth.keys());
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    if (
      monthKeys.length > 0 &&
      (!activeTab || !monthKeys.includes(activeTab))
    ) {
      setActiveTab(monthKeys[0]);
    }
  }, [monthKeys, activeTab]);

  if (props.isLoading) {
    return (
      <div className="flex min-h-[140px] items-center justify-center gap-3 rounded-2xl border border-blue-50/80 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 px-4 py-8 text-sm text-slate-600 dark:text-slate-300 shadow-sm">
        <Loader2
          className="h-5 w-5 shrink-0 animate-spin text-blue-600"
          aria-hidden
        />
        Đang tải lịch khởi hành...
      </div>
    );
  }

  if (bookable.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 px-4 py-10 text-center shadow-sm">
        <CalendarRange
          className="mx-auto mb-3 h-8 w-8 text-blue-500/80"
          aria-hidden
        />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Hiện chưa có lịch khởi hành nào.
        </p>
      </div>
    );
  }

  const activeSchedules = schedulesByMonth.get(activeTab) || [];

  return (
    <div>
      {/* Month Tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto custom-scrollbar pb-2">
        {monthKeys.map((key) => {
          const isActive = key === activeTab;
          const labelParts = key.split("\n");
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-14 rounded-2xl border transition-colors ${
                isActive
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500"
              }`}
            >
              <span className="text-xs font-semibold">{labelParts[0]}</span>
              <span
                className={`text-[10px] ${isActive ? "text-blue-100" : "text-slate-400 dark:text-slate-500"}`}
              >
                {labelParts[1]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Schedule Rows */}
      <div className="space-y-3">
        {activeSchedules.map((schedule) => {
          const isSelected = schedule.id === props.selectedId;
          const rawDate = schedule.departureAt
            ? new Date(schedule.departureAt)
            : null;
          const dateStr = rawDate
            ? rawDate.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "N/A";

          return (
            <div
              key={schedule.id}
              onClick={() => !isSelected && props.onSelect(schedule)}
              className={`bg-white dark:bg-slate-800 transition-colors cursor-pointer ${
                isSelected
                  ? "rounded-[24px] shadow-sm ring-2 ring-blue-600 mb-4"
                  : "rounded-full px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500"
              }`}
            >
              {isSelected ? (
                <div className="p-6 flex flex-col gap-6">
                  {/* Expanded Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                    <div className="flex items-center gap-6">
                      <div className="text-blue-600 font-bold whitespace-nowrap min-w-[90px]">
                        {dateStr}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 truncate">
                        <span className="text-slate-200 dark:text-slate-600">
                          |
                        </span>
                        <span className="truncate flex items-center gap-2">
                          <span className="border border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-400 text-[8px] px-1 rounded block leading-none py-0.5">
                            🎫
                          </span>
                          {schedule.scheduleCode || `#${schedule.id}`}
                        </span>
                      </div>
                    </div>
                    <button
                      className="bg-blue-600 text-white font-medium px-5 py-2 rounded-full transition-colors text-sm shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      Đang chọn
                    </button>
                  </div>

                  {/* Transport */}
                  <div>
                    <div className="text-center text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">
                      Phương tiện di chuyển
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center text-sm gap-4">
                      <div className="w-full sm:w-1/3">
                        <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-1 border-b border-slate-100 dark:border-slate-700 pb-2 border-dashed">
                          <span>Ngày đi: {dateStr}</span>
                          <span className="text-[#e11d27] flex items-center gap-1 font-bold text-xs">
                            ✈️ VU638
                          </span>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <div className="text-lg font-bold text-slate-500 dark:text-slate-400">
                            08:35
                          </div>
                          <div className="text-lg font-bold text-slate-500 dark:text-slate-400">
                            10:00
                          </div>
                        </div>
                      </div>
                      <div className="w-full sm:w-1/3 flex items-center mx-4">
                        <div className="w-full border-t-2 border-dashed border-slate-200 dark:border-slate-700 relative mt-4">
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] bg-white dark:bg-slate-800 px-2 text-blue-500 italic font-bold">
                            Vietravel Airlines
                          </span>
                        </div>
                      </div>
                      <div className="w-full sm:w-1/3 text-right">
                        <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-1 border-b border-slate-100 dark:border-slate-700 pb-2 border-dashed">
                          <span>
                            Ngày về:{" "}
                            {schedule.returnAt
                              ? new Date(schedule.returnAt).toLocaleDateString(
                                  "vi-VN",
                                )
                              : dateStr}
                          </span>
                          <span className="text-[#e11d27] flex items-center gap-1 font-bold text-xs">
                            ✈️ VU639
                          </span>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <div className="text-lg font-bold text-slate-500 dark:text-slate-400">
                            17:00
                          </div>
                          <div className="text-lg font-bold text-slate-500 dark:text-slate-400">
                            18:30
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Matrix */}
                  <div className="mt-4 pt-6 border-t border-slate-100 dark:border-slate-700">
                    <div className="text-center text-sm font-bold text-slate-700 dark:text-slate-200 mb-6">
                      Giá chuyến đi
                    </div>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm max-w-3xl mx-auto">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-100">
                            Người lớn
                          </div>
                          <div className="text-slate-400 text-xs text-left">
                            (Từ 12 tuổi trở lên)
                          </div>
                        </div>
                        <div className="text-[#e11d27] font-bold">
                          {formatCurrencyVnd(schedule.adultPrice || 8990000)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center pl-6 border-l border-slate-100 dark:border-slate-700">
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-100">
                            Em bé
                          </div>
                          <div className="text-slate-400 text-xs text-left">
                            (Dưới 4 tuổi)
                          </div>
                        </div>
                        <div className="text-[#e11d27] font-bold">
                          {formatCurrencyVnd(schedule.infantPrice || 400000)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-100">
                            Trẻ em
                          </div>
                          <div className="text-slate-400 text-xs text-left">
                            (Từ 5 đến 11 tuổi)
                          </div>
                        </div>
                        <div className="text-[#e11d27] font-bold">
                          {formatCurrencyVnd(schedule.childPrice || 7640000)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center pl-6 border-l border-slate-100 dark:border-slate-700">
                        <div className="font-bold text-slate-800 dark:text-slate-100">
                          Phụ thu phòng đơn
                        </div>
                        <div className="text-[#e11d27] font-bold">
                          {formatCurrencyVnd((schedule.adultPrice || 0) * 0.25)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-6">
                    <div className="text-blue-600 font-bold whitespace-nowrap min-w-[90px]">
                      {dateStr}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 truncate">
                      <span className="text-slate-200 dark:text-slate-600">
                        |
                      </span>
                      <span className="truncate flex items-center gap-2">
                        <span className="border border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-400 text-[8px] px-1 rounded block leading-none py-0.5">
                          🎫
                        </span>
                        {schedule.scheduleCode || `#${schedule.id}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end mt-4 sm:mt-0">
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-base">
                      {formatCurrencyVnd(schedule.adultPrice || 0)}
                    </div>
                    <button
                      className="px-5 py-2 rounded-full transition-colors text-xs font-semibold bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onSelect(schedule);
                      }}
                    >
                      Chọn
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TourScheduleSelector;
