import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Plane } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  useCreateFlight,
  useUpdateFlight,
  MOCK_AIRLINES,
  MOCK_AIRPORTS,
} from "../api/flights.api";
import type { Flight, FlightRequest } from "../api/flights.api";

const flightSchema = z
  .object({
    airlineId: z.coerce.number().min(1, "Vui lòng chọn Hãng hàng không"),
    flightNo: z.string().min(1, "Vui lòng nhập Số hiệu chuyến (VD: VN123)"),
    originAirportId: z.coerce.number().min(1, "Vui lòng chọn Sân bay đi"),
    destinationAirportId: z.coerce.number().min(1, "Vui lòng chọn Sân bay đến"),
    departureTimeLocal: z.string().min(1, "Bắt buộc nhập giờ đi"),
    arrivalTimeLocal: z.string().min(1, "Bắt buộc nhập giờ đến"),
    durationMinutes: z.coerce.number().min(30, "Thời lượng tối thiểu 30p"),
    status: z.string().min(1),
  })
  .refine((data) => data.originAirportId !== data.destinationAirportId, {
    message: "Sân bay cất cánh và hạ cánh không được trùng nhau",
    path: ["destinationAirportId"],
  })
  .refine(
    (data) =>
      new Date(data.departureTimeLocal) < new Date(data.arrivalTimeLocal),
    {
      message: "Giờ hạ cánh phải sau giờ cất cánh",
      path: ["arrivalTimeLocal"],
    },
  );

interface FlightFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flightToEdit: Flight | null;
}

export function FlightForm({
  open,
  onOpenChange,
  flightToEdit,
}: FlightFormProps) {
  const isEditing = !!flightToEdit;
  const createMut = useCreateFlight();
  const updateMut = useUpdateFlight(flightToEdit?.id || null);

  const form = useForm<z.infer<typeof flightSchema>>({
    resolver: zodResolver(flightSchema),
    defaultValues: {
      airlineId: 0,
      flightNo: "",
      originAirportId: 0,
      destinationAirportId: 0,
      departureTimeLocal: "",
      arrivalTimeLocal: "",
      durationMinutes: 120,
      status: "SCHEDULED",
    },
  });

  useEffect(() => {
    if (open && flightToEdit) {
      form.reset({
        airlineId: flightToEdit.airlineId,
        flightNo: flightToEdit.flightNo,
        originAirportId: flightToEdit.originAirportId,
        destinationAirportId: flightToEdit.destinationAirportId,
        departureTimeLocal: flightToEdit.departureTimeLocal
          ? new Date(flightToEdit.departureTimeLocal).toISOString().slice(0, 16)
          : "",
        arrivalTimeLocal: flightToEdit.arrivalTimeLocal
          ? new Date(flightToEdit.arrivalTimeLocal).toISOString().slice(0, 16)
          : "",
        durationMinutes: flightToEdit.durationMinutes,
        status: flightToEdit.status || "SCHEDULED",
      });
    } else if (open && !flightToEdit) {
      form.reset({
        airlineId: 0,
        flightNo: "",
        originAirportId: 0,
        destinationAirportId: 0,
        departureTimeLocal: "",
        arrivalTimeLocal: "",
        durationMinutes: 120,
        status: "SCHEDULED",
      });
    }
  }, [open, flightToEdit, form]);

  const onSubmit = async (values: z.infer<typeof flightSchema>) => {
    // API Cấu trúc Date: ISO 8601
    // Input datetime-local cung cấp YYYY-MM-DDTHH:mm, backend Expects LocalDateTime JSON
    const payload: FlightRequest = {
      ...values,
      departureTimeLocal: new Date(values.departureTimeLocal).toISOString(),
      arrivalTimeLocal: new Date(values.arrivalTimeLocal).toISOString(),
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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[600px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300">
          <div className="flex flex-none items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900 shadow-sm relative z-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                <Plane size={24} strokeWidth={2} className="rotate-45" />
              </div>
              <div>
                <Dialog.Title className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  {isEditing ? "Chỉnh sửa Lịch Bay" : "Bổ sung Chuyến Bay mơi"}
                </Dialog.Title>
                <Dialog.Description className="text-sm font-medium text-slate-500 mt-1">
                  Thiết lập hàng không tuyến điểm hạ/cất cánh.
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                disabled={isPending}
                className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <form
            id="flight-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 flex flex-col">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Hãng Hàng Không <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="airlineId"
                  control={form.control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium text-sm"
                    >
                      <option value={0} disabled>
                        -- Chọn Hãng --
                      </option>
                      {MOCK_AIRLINES.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {form.formState.errors.airlineId && (
                  <p className="text-xs text-red-500 font-medium">
                    {form.formState.errors.airlineId.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 flex flex-col">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Số Hiệu <span className="text-red-500">*</span>
                </label>
                <input
                  {...form.register("flightNo")}
                  placeholder="VD: VN123, VJ456..."
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase transition-all font-bold text-sm"
                />
                {form.formState.errors.flightNo && (
                  <p className="text-xs text-red-500 font-medium">
                    {form.formState.errors.flightNo.message}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Nơi Cất Cánh <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="originAirportId"
                    control={form.control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium text-sm"
                      >
                        <option value={0} disabled>
                          -- BAY TỪ --
                        </option>
                        {MOCK_AIRPORTS.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {form.formState.errors.originAirportId && (
                    <p className="text-xs text-red-500 font-medium">
                      {form.formState.errors.originAirportId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Nơi Hạ Cánh <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="destinationAirportId"
                    control={form.control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium text-sm"
                      >
                        <option value={0} disabled>
                          -- ĐẾN NƠI --
                        </option>
                        {MOCK_AIRPORTS.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {form.formState.errors.destinationAirportId && (
                    <p className="text-xs text-red-500 font-medium">
                      {form.formState.errors.destinationAirportId.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Giờ Cất Cánh Khởi Hành{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    {...form.register("departureTimeLocal")}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-sm font-semibold text-slate-700 dark:text-slate-300"
                  />
                  {form.formState.errors.departureTimeLocal && (
                    <p className="text-xs text-red-500 font-medium">
                      {form.formState.errors.departureTimeLocal.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Giờ Cập Bến Hạ Cánh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    {...form.register("arrivalTimeLocal")}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-sm font-semibold text-slate-700 dark:text-slate-300"
                  />
                  {form.formState.errors.arrivalTimeLocal && (
                    <p className="text-xs text-red-500 font-medium">
                      {form.formState.errors.arrivalTimeLocal.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 flex flex-col">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Vận tốc / Thời lượng (Phút){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...form.register("durationMinutes")}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold text-sky-600 dark:text-sky-400 text-sm tabular-nums"
                />
                {form.formState.errors.durationMinutes && (
                  <p className="text-xs text-red-500 font-medium">
                    {form.formState.errors.durationMinutes.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 flex flex-col">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Trạng Thái Hệ Thống
                </label>
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold text-sm text-slate-700 dark:text-slate-300"
                    >
                      <option value="SCHEDULED">SCHEDULED (Lên trình)</option>
                      <option value="DELAYED">DELAYED (Hoãn)</option>
                      <option value="CANCELLED">CANCELLED (Hủy)</option>
                    </select>
                  )}
                />
              </div>
            </div>
          </form>

          <div className="flex-none p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-3 justify-end shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-20">
            <Dialog.Close asChild>
              <button
                disabled={isPending}
                type="button"
                className="px-6 py-2.5 text-sm font-bold border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 uppercase tracking-wider"
              >
                Thoát
              </button>
            </Dialog.Close>
            <button
              type="submit"
              form="flight-form"
              disabled={isPending}
              className="px-8 py-2.5 text-sm font-bold rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider shadow-sm shadow-sky-500/20"
            >
              {isPending ? "Đang đẩy dữ liệu..." : "Phê Duyệt Lịch Bay"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
