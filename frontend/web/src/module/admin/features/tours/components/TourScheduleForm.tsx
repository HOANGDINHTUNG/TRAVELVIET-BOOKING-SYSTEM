import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as Dialog from "@radix-ui/react-dialog";
import { X, CalendarDays, DollarSign, Users, Clock } from "lucide-react";
import type {
  TourScheduleRequest,
  TourScheduleResponse,
} from "../api/tourSchedules.api";
import {
  useCreateTourSchedule,
  useUpdateTourSchedule,
} from "../api/tourSchedules.api";

const scheduleSchema = z
  .object({
    scheduleCode: z.string().min(1, "Vui lòng nhập mã chuyến đi"),
    departureAt: z.string().min(1, "Bắt buộc nhập ngày KH"),
    returnAt: z.string().min(1, "Bắt buộc nhập ngày về"),
    bookingOpenAt: z.string().min(1, "Bắt buộc chọn lúc mở bán"),
    bookingCloseAt: z.string().min(1, "Bắt buộc chọn lúc đóng"),
    capacityTotal: z.coerce.number().min(1, "Số chỗ phòng tuyến ít nhất là 1"),
    minGuestsToOperate: z.coerce.number().min(1, "Tối thiểu 1 người để chạy"),
    adultPrice: z.coerce.number().min(0, "Không được nhỏ hơn 0"),
    childPrice: z.coerce.number().min(0, "Không được nhỏ hơn 0"),
    infantPrice: z.coerce.number().min(0, "Không được nhỏ hơn 0"),
    seniorPrice: z.coerce.number().min(0, "Không được nhỏ hơn 0"),
    singleRoomSurcharge: z.coerce.number().min(0, "Không được nhỏ hơn 0"),
    status: z.string(),
  })
  .superRefine((data, ctx) => {
    // Convert to Date objects for comparison
    const now = new Date();
    const departure = new Date(data.departureAt);
    const returnDate = new Date(data.returnAt);
    const openDate = new Date(data.bookingOpenAt);
    const closeDate = new Date(data.bookingCloseAt);

    // 1. Khởi hành phải cách hiện tại tối thiểu 7 ngày để có thời gian gom rạp khách
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    if (departure < oneWeekFromNow) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ngày khởi hành phải cách hiện tại ít nhất 1 tuần (7 ngày).",
        path: ["departureAt"],
      });
    }

    // 2. Ngày về phải SAU ngày khởi hành
    if (returnDate <= departure) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ngày về phải diễn ra SAU ngày khởi hành",
        path: ["returnAt"],
      });
    }

    // 3. Ngày mở bán phải TRƯỚC ngày khởi hành ít nhất
    if (openDate >= departure) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Thời gian mở bán phải TRƯỚC ngày khởi hành",
        path: ["bookingOpenAt"],
      });
    }

    // 4. Ngày đóng bán phải trước ngày khởi hành tối thiểu 24 tiếng (để nhà xe xếp chỗ)
    const oneDayBeforeDeparture = new Date(
      departure.getTime() - 24 * 60 * 60 * 1000,
    );
    if (closeDate > oneDayBeforeDeparture) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Thời gian đóng nhận chỗ phải TRƯỚC lịch khởi hành tối thiểu 24 giờ",
        path: ["bookingCloseAt"],
      });
    }

    // 5. Đóng bán phải diễn ra SAU khi mở bán
    if (closeDate <= openDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Thời gian đóng bán phải diễn ra SAU thời gian mở bán",
        path: ["bookingCloseAt"],
      });
    }

    // 6. Số lượng khách tối thiểu không thể lớn hơn Tổng số chỗ
    if (data.minGuestsToOperate > data.capacityTotal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Khách tối thiểu không được vượt quá Tổng số chỗ",
        path: ["minGuestsToOperate"],
      });
    }
  });

interface TourScheduleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tourId: number | null;
  scheduleToEdit?: TourScheduleResponse | null;
}

// Convert YYYY-MM-DDTHH:mm:ss.SSSZ to YYYY-MM-DDTHH:mm
const toDatetimeLocal = (isoString?: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  // Cần hiển thị theo giờ Local của browser
  const tzoffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
  return new Date(date.getTime() - tzoffset).toISOString().slice(0, 16);
};

// Convert YYYY-MM-DDTHH:mm về ISO 8601 kèm TZ của backend (UTC hoặc giữ nguyên chuỗi cho Jackson parse)
const toISOStringForBackend = (localDatetime: string) => {
  if (!localDatetime) return "";
  // Return format YYYY-MM-DDTHH:mm:00
  return localDatetime + ":00";
};

export function TourScheduleForm({
  open,
  onOpenChange,
  tourId,
  scheduleToEdit,
}: TourScheduleFormProps) {
  const isEditing = !!scheduleToEdit;
  const createMut = useCreateTourSchedule(tourId);
  const updateMut = useUpdateTourSchedule(tourId, scheduleToEdit?.id ?? null);

  const form = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
    mode: "onChange",
    defaultValues: {
      scheduleCode: "",
      departureAt: "",
      returnAt: "",
      bookingOpenAt: "",
      bookingCloseAt: "",
      capacityTotal: 10,
      minGuestsToOperate: 5,
      adultPrice: 0,
      childPrice: 0,
      infantPrice: 0,
      seniorPrice: 0,
      singleRoomSurcharge: 0,
      status: "OPEN",
    },
  });

  useEffect(() => {
    if (open) {
      if (scheduleToEdit) {
        form.reset({
          scheduleCode: scheduleToEdit.scheduleCode || "",
          departureAt: toDatetimeLocal(scheduleToEdit.departureAt),
          returnAt: toDatetimeLocal(scheduleToEdit.returnAt),
          bookingOpenAt: toDatetimeLocal(scheduleToEdit.bookingOpenAt),
          bookingCloseAt: toDatetimeLocal(scheduleToEdit.bookingCloseAt),
          capacityTotal: scheduleToEdit.capacityTotal || 0,
          minGuestsToOperate: scheduleToEdit.minGuestsToOperate || 0,
          adultPrice: scheduleToEdit.adultPrice || 0,
          childPrice: scheduleToEdit.childPrice || 0,
          infantPrice: scheduleToEdit.infantPrice || 0,
          seniorPrice: scheduleToEdit.seniorPrice || 0,
          singleRoomSurcharge: scheduleToEdit.singleRoomSurcharge || 0,
          status: scheduleToEdit.status || "OPEN",
        });
      } else {
        form.reset({
          scheduleCode: "",
          departureAt: "",
          returnAt: "",
          bookingOpenAt: "",
          bookingCloseAt: "",
          capacityTotal: 20,
          minGuestsToOperate: 10,
          adultPrice: 0,
          childPrice: 0,
          infantPrice: 0,
          seniorPrice: 0,
          singleRoomSurcharge: 0,
          status: "OPEN",
        });
      }
    }
  }, [open, scheduleToEdit, form]);

  const onSubmit = (values: z.infer<typeof scheduleSchema>) => {
    if (!tourId) return;

    const payload: TourScheduleRequest = {
      ...values,
      departureAt: toISOStringForBackend(values.departureAt),
      returnAt: toISOStringForBackend(values.returnAt),
      bookingOpenAt: toISOStringForBackend(values.bookingOpenAt),
      bookingCloseAt: toISOStringForBackend(values.bookingCloseAt),
    };

    if (isEditing) {
      updateMut.mutate(payload, { onSuccess: () => onOpenChange(false) });
    } else {
      createMut.mutate(payload, { onSuccess: () => onOpenChange(false) });
    }
  };

  const isPending = createMut.isPending || updateMut.isPending;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed right-0 top-0 bottom-0 z-[110] w-full sm:w-[600px] bg-white dark:bg-slate-950 flex flex-col shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300">
          <div className="flex flex-none items-center justify-between p-6 pb-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-lg flex items-center justify-center shrink-0">
                <CalendarDays size={20} strokeWidth={2} />
              </div>
              <div>
                <Dialog.Title className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {isEditing ? "Chỉnh Sửa Lịch Trình" : "Thêm Lịch Khởi Hành"}
                </Dialog.Title>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                disabled={isPending}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <form
            id="schedule-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800"
          >
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CalendarDays size={18} className="text-slate-400" />
                Thông Tin Cơ Bản
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Mã Lịch *
                  </label>
                  <input
                    {...form.register("scheduleCode")}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-sm font-semibold uppercase"
                    placeholder="VD: KH001"
                  />
                  {form.formState.errors.scheduleCode && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.scheduleCode.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Trạng Thái
                  </label>
                  <select
                    {...form.register("status")}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-sm font-semibold"
                  >
                    <option value="OPEN">Đang mở (OPEN)</option>
                    <option value="CLOSED">Đóng (CLOSED)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Clock size={18} className="text-slate-400" />
                Thời Gian & Lịch Trình
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Khởi Hành *
                  </label>
                  <input
                    type="datetime-local"
                    {...form.register("departureAt")}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                  {form.formState.errors.departureAt && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.departureAt.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Ngày Về *
                  </label>
                  <input
                    type="datetime-local"
                    {...form.register("returnAt")}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                  {form.formState.errors.returnAt && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.returnAt.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Mở Bán Từ *
                  </label>
                  <input
                    type="datetime-local"
                    {...form.register("bookingOpenAt")}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                  {form.formState.errors.bookingOpenAt && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.bookingOpenAt.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Đóng Bán Lúc *
                  </label>
                  <input
                    type="datetime-local"
                    {...form.register("bookingCloseAt")}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                  {form.formState.errors.bookingCloseAt && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.bookingCloseAt.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Users size={18} className="text-slate-400" />
                Sức Chứa
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Tổng Số Chỗ *
                  </label>
                  <input
                    type="number"
                    min={1}
                    {...form.register("capacityTotal")}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                  {form.formState.errors.capacityTotal && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.capacityTotal.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Tối Thiểu Để Khởi Hành *
                  </label>
                  <input
                    type="number"
                    min={1}
                    {...form.register("minGuestsToOperate")}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                  {form.formState.errors.minGuestsToOperate && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.minGuestsToOperate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <DollarSign size={18} className="text-slate-400" />
                Giá Biểu Đợt Này (VND)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Người Lớn *
                  </label>
                  <input
                    type="number"
                    {...form.register("adultPrice")}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-sm font-bold text-emerald-600 dark:text-emerald-400"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Trẻ Em
                  </label>
                  <input
                    type="number"
                    {...form.register("childPrice")}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Sơ Sinh
                  </label>
                  <input
                    type="number"
                    {...form.register("infantPrice")}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Người Lớn Tuổi
                  </label>
                  <input
                    type="number"
                    {...form.register("seniorPrice")}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Phụ Thu Phòng Đơn
                  </label>
                  <input
                    type="number"
                    {...form.register("singleRoomSurcharge")}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>
            </div>
          </form>

          <div className="flex-none p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
            <Dialog.Close asChild>
              <button
                disabled={isPending}
                type="button"
                className="px-6 py-2.5 text-sm font-bold border rounded-lg text-slate-600 hover:bg-slate-100 transition-colors uppercase"
              >
                Hủy
              </button>
            </Dialog.Close>
            <button
              type="submit"
              form="schedule-form"
              disabled={isPending}
              className="px-8 py-2.5 text-sm font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors uppercase shadow-sm"
            >
              {isPending ? "Đang lưu..." : "Lưu Thay Đổi"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
