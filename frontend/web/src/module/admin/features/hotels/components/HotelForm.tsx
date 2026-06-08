import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  X,
  Plus,
  Trash2,
  Building,
  BedDouble,
  Hotel as HotelIcon,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { useCreateHotel, useUpdateHotel } from "../api/hotels.api";
import type { Hotel, CreateHotelPayload } from "../api/hotels.api";
import { useGetDestinations } from "../../destinations/api/destinations.api";

const roomTypeSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên hạng phòng (VD: Deluxe)"),
  pricePerNight: z.coerce.number().min(0, "Giá không được nhỏ hơn 0"),
  maxOccupancy: z.coerce.number().min(1, "Sức chứa phải lớn hơn 0"),
  totalRooms: z.coerce.number().min(1, "Tổng số phòng phải lớn hơn 0"),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

const hotelSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên khách sạn"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ cụ thể"),
  starRating: z.coerce.number().min(1, "Vui lòng định danh sao"),
  destinationId: z.coerce.number().min(1, "Vui lòng chọn Tỉnh/Thành"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  roomTypes: z.array(roomTypeSchema).min(1, "Phải tạo ít nhất 1 hạng phòng"),
});

interface HotelFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hotelToEdit: Hotel | null;
}

export function HotelForm({ open, onOpenChange, hotelToEdit }: HotelFormProps) {
  const isEditing = !!hotelToEdit;

  const createMut = useCreateHotel();
  const updateMut = useUpdateHotel(hotelToEdit?.id || null);

  const { data: destData, isLoading: isDestLoading } = useGetDestinations(
    0,
    100,
  );
  const destinations = destData?.content || [];

  const form = useForm<z.infer<typeof hotelSchema>>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      starRating: 3,
      destinationId: 0,
      status: "ACTIVE",
      roomTypes: [
        {
          name: "",
          pricePerNight: 0,
          maxOccupancy: 2,
          totalRooms: 1,
          status: "ACTIVE",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "roomTypes",
  });

  useEffect(() => {
    if (open && hotelToEdit) {
      form.reset(hotelToEdit);
    } else if (open && !hotelToEdit) {
      form.reset({
        name: "",
        description: "",
        address: "",
        starRating: 3,
        destinationId: "",
        status: "ACTIVE",
        roomTypes: [
          {
            name: "",
            pricePerNight: 0,
            maxOccupancy: 2,
            totalRooms: 1,
            status: "ACTIVE",
          },
        ],
      });
    }
  }, [open, hotelToEdit, form]);

  const onSubmit = async (values: z.infer<typeof hotelSchema>) => {
    const payload = values as CreateHotelPayload;
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
        <Dialog.Content className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[700px] border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shadow-2xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300">
          <div className="flex flex-none items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative z-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                <HotelIcon size={24} strokeWidth={2} />
              </div>
              <div>
                <Dialog.Title className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  {isEditing ? "Cập nhật Khách sạn" : "Thêm mới Khách sạn"}
                </Dialog.Title>
                <Dialog.Description className="text-sm font-medium text-slate-500 mt-1">
                  Quản lý cơ sở lưu trú và phân mảng hệ thống phòng.
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                disabled={isPending}
                className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 text-slate-500 transition-colors bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <form
            id="hotel-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 overflow-hidden flex flex-col"
          >
            <Tabs.Root defaultValue="tab1" className="flex flex-col h-full">
              <Tabs.List className="flex flex-none shrink-0 border-b border-slate-200 dark:border-slate-800 px-6 gap-6 bg-white dark:bg-slate-900 z-10 w-full overflow-x-auto scrollbar-hide shadow-sm sticky top-0">
                <Tabs.Trigger
                  value="tab1"
                  className="py-4 text-sm font-bold border-b-[3px] border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors whitespace-nowrap flex items-center gap-2"
                >
                  <Building size={16} /> Thông tin Khách sạn
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="tab2"
                  className="py-4 text-sm font-bold border-b-[3px] border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors whitespace-nowrap flex items-center gap-2"
                >
                  <BedDouble size={16} /> Hạng phòng
                  {form.formState.errors.roomTypes && (
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  )}
                </Tabs.Trigger>
              </Tabs.List>

              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                <Tabs.Content
                  value="tab1"
                  className="space-y-6 animate-in fade-in zoom-in-95 duration-200 outline-none pb-8"
                >
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Tên Khách sạn <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...form.register("name")}
                        placeholder="Ví dụ: InterContinental Hanoi Westlake"
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-sm shadow-sm"
                      />
                      {form.formState.errors.name && (
                        <p className="text-xs font-medium text-red-500 mt-1">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Điểm đến <span className="text-red-500">*</span>
                        </label>
                        <Controller
                          name="destinationId"
                          control={form.control}
                          render={({ field }) => (
                            <select
                              {...field}
                              disabled={isDestLoading}
                              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-sm shadow-sm"
                            >
                              <option value="" disabled>
                                --- Chọn điểm đến ---
                              </option>
                              {destinations.map((dest) => (
                                <option key={dest.id} value={dest.id}>
                                  {dest.name} - {dest.countryCode}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                        {form.formState.errors.destinationId && (
                          <p className="text-xs font-medium text-red-500 mt-1">
                            {form.formState.errors.destinationId.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Trạng thái Hoạt động
                        </label>
                        <Controller
                          name="status"
                          control={form.control}
                          render={({ field }) => (
                            <select
                              {...field}
                              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-sm shadow-sm"
                            >
                              <option value="ACTIVE">
                                Mở hệ thống (Active)
                              </option>
                              <option value="INACTIVE">
                                Vô hiệu hóa (Inactive)
                              </option>
                            </select>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                    <div className="grid grid-cols-[1fr_auto] gap-4">
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Địa chỉ cụ thể <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...form.register("address")}
                          placeholder="Số nhà, Đường, Quận/Huyện..."
                          className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-sm shadow-sm"
                        />
                        {form.formState.errors.address && (
                          <p className="text-xs font-medium text-red-500 mt-1">
                            {form.formState.errors.address.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5 flex flex-col min-w-[120px]">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Tiêu chuẩn Sao
                        </label>
                        <Controller
                          name="starRating"
                          control={form.control}
                          render={({ field }) => (
                            <select
                              {...field}
                              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-bold text-amber-600 text-sm shadow-sm text-center"
                            >
                              <option value={1}>1 Sao ⭐</option>
                              <option value={2}>2 Sao ⭐⭐</option>
                              <option value={3}>3 Sao ⭐⭐⭐</option>
                              <option value={4}>4 Sao ⭐⭐⭐⭐</option>
                              <option value={5}>5 Sao ⭐⭐⭐⭐⭐</option>
                            </select>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Mô tả Khách sạn
                      </label>
                      <textarea
                        {...form.register("description")}
                        rows={5}
                        placeholder="Thông tin giới thiệu tổng quan, tiện ích, nội quy..."
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm leading-relaxed shadow-sm"
                      />
                      {form.formState.errors.description && (
                        <p className="text-xs font-medium text-red-500 mt-1">
                          {form.formState.errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>
                </Tabs.Content>

                <Tabs.Content
                  value="tab2"
                  className="space-y-5 animate-in fade-in zoom-in-95 duration-200 outline-none pb-8"
                >
                  {form.formState.errors.roomTypes?.root && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm font-medium border border-red-200 flex items-center gap-2 shadow-sm">
                      {form.formState.errors.roomTypes.root.message}
                    </div>
                  )}

                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="relative p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-all focus-within:ring-2 ring-indigo-500/20 group"
                      >
                        <div className="absolute top-4 right-4 z-10">
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 rounded-md border border-transparent hover:border-red-200 dark:hover:border-red-900/50 transition-colors shadow-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                          <span className="w-6 h-6 flex items-center justify-center bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 rounded text-xs font-bold font-mono">
                            {index + 1}
                          </span>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                            Thông số phòng
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[1fr_150px] gap-4 mb-4">
                          <div className="space-y-1.5 flex flex-col">
                            <label className="text-xs font-bold text-slate-500">
                              Tên Hạng Phòng{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              {...form.register(
                                `roomTypes.${index}.name` as const,
                              )}
                              placeholder="VD: Deluxe Double Room with Ocean View..."
                              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-semibold shadow-sm"
                            />
                            {form.formState.errors.roomTypes?.[index]?.name && (
                              <p className="text-xs text-red-500 font-medium">
                                {
                                  form.formState.errors.roomTypes?.[index]?.name
                                    ?.message
                                }
                              </p>
                            )}
                          </div>
                          <div className="space-y-1.5 flex flex-col">
                            <label className="text-xs font-bold text-slate-500">
                              Giá / Đêm (VND){" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              {...form.register(
                                `roomTypes.${index}.pricePerNight` as const,
                                { valueAsNumber: true },
                              )}
                              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-bold tabular-nums text-indigo-600 dark:text-indigo-400 text-sm shadow-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1.5 flex flex-col">
                            <label className="text-xs font-bold text-slate-500">
                              Sức chứa (Khách)
                            </label>
                            <input
                              type="number"
                              {...form.register(
                                `roomTypes.${index}.maxOccupancy` as const,
                                { valueAsNumber: true },
                              )}
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm shadow-sm text-center font-medium"
                            />
                          </div>
                          <div className="space-y-1.5 flex flex-col">
                            <label className="text-xs font-bold text-slate-500">
                              Tổng Số Phòng
                            </label>
                            <input
                              type="number"
                              {...form.register(
                                `roomTypes.${index}.totalRooms` as const,
                                { valueAsNumber: true },
                              )}
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm shadow-sm text-center font-medium"
                            />
                          </div>
                          <div className="space-y-1.5 flex flex-col">
                            <label className="text-xs font-bold text-slate-500">
                              Trạng thái Mở Đặt
                            </label>
                            <Controller
                              name={`roomTypes.${index}.status` as const}
                              control={form.control}
                              render={({ field }) => (
                                <select
                                  {...field}
                                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm shadow-sm font-medium"
                                >
                                  <option value="ACTIVE">Hoạt động</option>
                                  <option value="INACTIVE">Bảo trì</option>
                                </select>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      append({
                        name: "",
                        pricePerNight: 0,
                        maxOccupancy: 2,
                        totalRooms: 1,
                        status: "ACTIVE",
                      })
                    }
                    className="w-full py-4 border-[2px] border-dashed border-indigo-200 dark:border-indigo-900/50 rounded-2xl text-sm font-semibold text-indigo-500 hover:text-indigo-700 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 dark:hover:border-indigo-700 transition-all flex justify-center items-center gap-2 group shadow-sm bg-white dark:bg-slate-950"
                  >
                    <Plus
                      size={18}
                      className="group-hover:scale-125 transition-transform"
                    />{" "}
                    <span className="tracking-wide uppercase">
                      Thêm Cấu trúc Hạng phòng Mới
                    </span>
                  </button>

                  <div className="h-4" />
                </Tabs.Content>
              </div>
            </Tabs.Root>
          </form>

          <div className="flex-none p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-3 justify-end shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-20 relative">
            <Dialog.Close asChild>
              <button
                type="button"
                disabled={isPending}
                className="px-6 py-2.5 text-sm font-bold border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors disabled:opacity-50 uppercase tracking-wider shadow-sm"
              >
                Thoát
              </button>
            </Dialog.Close>
            <button
              type="submit"
              form="hotel-form"
              disabled={isPending}
              className="px-8 py-2.5 text-sm font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm shadow-indigo-500/20 uppercase tracking-wider"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{" "}
                  Đang Lưu Data...
                </span>
              ) : (
                "Phê Duyệt Dữ Liệu"
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
