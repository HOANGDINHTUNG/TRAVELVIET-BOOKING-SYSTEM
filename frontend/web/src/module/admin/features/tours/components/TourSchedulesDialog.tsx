import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, CalendarDays, Users, CheckCircle, Clock } from "lucide-react";
import type { Tour } from "../api/tours.api";
import {
  useGetTourSchedules,
  useUpdateTourScheduleStatus,
} from "../api/tourSchedules.api";

interface TourSchedulesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tour: Tour | null;
}

export function TourSchedulesDialog({
  open,
  onOpenChange,
  tour,
}: TourSchedulesDialogProps) {
  const { data: schedules, isLoading } = useGetTourSchedules(tour?.id ?? null);
  const statusMutation = useUpdateTourScheduleStatus();

  const handleToggleStatus = (scheduleId: number, currentStatus: string) => {
    if (!tour) return;
    const newStatus = currentStatus === "OPEN" ? "CLOSED" : "OPEN";
    statusMutation.mutate({ tourId: tour.id, scheduleId, status: newStatus });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[100] grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl sm:rounded-2xl flex flex-col max-h-[85vh]">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
            <div>
              <Dialog.Title className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Lịch khởi hành & Sĩ số
              </Dialog.Title>
              <Dialog.Description className="text-sm text-slate-500 mt-1">
                Quản lý các đợt chạy và lượng khách đặt chỗ cho tour{" "}
                <strong className="text-indigo-600 dark:text-indigo-400">
                  {tour?.name}
                </strong>
              </Dialog.Description>
            </div>
            <Dialog.Close className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <X size={20} className="text-slate-500" />
            </Dialog.Close>
          </div>

          <div className="overflow-y-auto flex-1 min-h-[300px]">
            {isLoading ? (
              <div className="flex h-32 items-center justify-center text-slate-500">
                Đang tải dữ liệu...
              </div>
            ) : schedules && schedules.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-4 py-3">Mã lịch trình</th>
                      <th className="px-4 py-3">Thời gian</th>
                      <th className="px-4 py-3">Giá (Người lớn)</th>
                      <th className="px-4 py-3">Sĩ số (Đã đặt/Tổng)</th>
                      <th className="px-4 py-3">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {schedules.map((s) => (
                      <tr
                        key={s.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                      >
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                          {s.scheduleCode}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                            <CalendarDays size={14} />
                            {new Date(s.departureAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 tabular-nums font-semibold">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(s.adultPrice)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Users
                              size={16}
                              className={
                                s.bookedSeats >= s.capacityTotal
                                  ? "text-red-500"
                                  : "text-emerald-500"
                              }
                            />
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {s.bookedSeats}
                            </span>
                            <span className="text-slate-400">
                              / {s.capacityTotal}
                            </span>
                          </div>
                          {s.bookedSeats >= s.capacityTotal && (
                            <div className="text-xs text-red-500 mt-0.5 font-medium">
                              Hết chỗ
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleStatus(s.id, s.status)}
                            disabled={statusMutation.isPending}
                            title="Click để đổi trạng thái"
                            className={`px-2.5 py-1 text-xs uppercase tracking-wider font-bold rounded-full border flex items-center gap-1 w-max transition-colors cursor-pointer disabled:opacity-50 ${
                              s.status === "OPEN"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
                                : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                            }`}
                          >
                            {s.status === "OPEN" ? (
                              <CheckCircle size={12} />
                            ) : (
                              <Clock size={12} />
                            )}
                            {s.status}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-slate-500 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <CalendarDays size={32} className="text-slate-300 mb-3" />
                <p>Chưa có lịch khởi hành nào cho tour này.</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Đóng
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
