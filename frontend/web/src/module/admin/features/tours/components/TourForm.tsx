import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Compass, DollarSign, Image as ImageIcon } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { useCreateTour, useUpdateTour } from "../api/tours.api";
import type { Tour, TourRequest } from "../api/tours.api";
import { useGetDestinations } from "../../destinations/api/destinations.api";

const tourSchema = z.object({
  code: z.string().min(1, "Bắt buộc nhập Mã (VD: TOUR1)"),
  name: z.string().min(1, "Bắt buộc nhập tên Tour"),
  slug: z.string().min(1, "Bắt buộc nhập Slug URL liên kết"),
  destinationId: z.coerce.number().min(1, "Vui lòng chọn Điểm đến"),
  basePrice: z.coerce.number().min(0, "Giá phải là số dương"),
  durationDays: z.coerce.number().min(1, "Ít nhất 1 ngày"),
  durationNights: z.coerce.number().min(0, "Không được nhỏ hơn 0"),
  currency: z.string().min(3).max(3),
  transportType: z.string().optional(),
  tripMode: z.string().optional(),
  esgScore: z.coerce.number().min(0).max(100).optional(),
  leiScore: z.coerce.number().min(0).max(100).optional(),
  status: z.string(),
  isFeatured: z.boolean().default(false),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
});

interface TourFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tourToEdit: Tour | null;
}

export function TourForm({ open, onOpenChange, tourToEdit }: TourFormProps) {
  const isEditing = !!tourToEdit;
  const createMut = useCreateTour();
  const updateMut = useUpdateTour(tourToEdit?.id || null);

  const { data: destData } = useGetDestinations(0, 500);
  const destinations = destData?.content || [];

  const [activeTab, setActiveTab] = useState("general");

  const form = useForm<z.infer<typeof tourSchema>>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      code: "",
      name: "",
      slug: "",
      destinationId: 0,
      basePrice: 0,
      durationDays: 1,
      durationNights: 0,
      currency: "VND",
      status: "DRAFT",
      isFeatured: false,
      transportType: "FLIGHT",
      tripMode: "GROUP",
      esgScore: 0,
      leiScore: 0,
      shortDescription: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      setActiveTab("general");
      if (tourToEdit) {
        form.reset({
          code: tourToEdit.code,
          name: tourToEdit.name,
          slug: tourToEdit.slug,
          destinationId: tourToEdit.destinationId,
          basePrice: tourToEdit.basePrice,
          durationDays: tourToEdit.durationDays,
          durationNights: tourToEdit.durationNights,
          currency: tourToEdit.currency || "VND",
          status: tourToEdit.status,
          isFeatured: tourToEdit.isFeatured,
          transportType: tourToEdit.transportType || "",
          tripMode: tourToEdit.tripMode || "",
          esgScore: tourToEdit.esgScore || 0,
          leiScore: tourToEdit.leiScore || 0,
          shortDescription: tourToEdit.shortDescription || "",
          description: tourToEdit.description || "",
        });
      } else {
        form.reset({
          code: "",
          name: "",
          slug: "",
          destinationId: 0,
          basePrice: 0,
          durationDays: 1,
          durationNights: 0,
          currency: "VND",
          status: "DRAFT",
          isFeatured: false,
          transportType: "FLIGHT",
          tripMode: "GROUP",
          esgScore: 0,
          leiScore: 0,
          shortDescription: "",
          description: "",
        });
      }
    }
  }, [open, tourToEdit, form]);

  const onSubmit = async (values: z.infer<typeof tourSchema>) => {
    const payload = values as TourRequest;

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
        <Dialog.Content className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[560px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300">
          <div className="flex flex-none items-center justify-between p-6 pb-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 z-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                <Compass size={24} strokeWidth={2} />
              </div>
              <div>
                <Dialog.Title className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  {isEditing ? "Cập nhật Tour Tuyến" : "Mở Tuyến Mới"}
                </Dialog.Title>
                <Dialog.Description className="text-sm font-medium text-slate-500 mt-1">
                  Định cấu hình các thông số cơ bản cho sản phẩm Du lịch.
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
            id="tour-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 overflow-hidden flex flex-col"
          >
            <Tabs.Root
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
            >
              <Tabs.List className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-2 shrink-0 bg-slate-50 dark:bg-slate-900 overflow-x-auto scrollbar-none">
                <Tabs.Trigger
                  value="general"
                  className="px-4 py-3 border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 dark:data-[state=active]:border-indigo-400 font-bold text-sm text-slate-500 whitespace-nowrap transition-colors"
                >
                  Tổng quan
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="financial"
                  className="px-4 py-3 border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 dark:data-[state=active]:border-indigo-400 font-bold text-sm text-slate-500 whitespace-nowrap transition-colors"
                >
                  Tài chính & Thuộc tính
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="description"
                  className="px-4 py-3 border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 dark:data-[state=active]:border-indigo-400 font-bold text-sm text-slate-500 whitespace-nowrap transition-colors"
                >
                  Nội dung mô tả
                </Tabs.Trigger>
              </Tabs.List>

              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                <Tabs.Content
                  value="general"
                  className="space-y-5 focus:outline-none data-[state=inactive]:hidden"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Mã Tuyến (Code) <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...form.register("code")}
                        placeholder="VD: SGN-PQ-01"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm uppercase"
                      />
                      {form.formState.errors.code && (
                        <p className="text-xs text-red-500 font-medium">
                          {form.formState.errors.code.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Slug (Đường dẫn) <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...form.register("slug")}
                        placeholder="VD: tour-phu-quoc"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                      {form.formState.errors.slug && (
                        <p className="text-xs text-red-500 font-medium">
                          {form.formState.errors.slug.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Tên Điểm Đến / Tour{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...form.register("name")}
                      placeholder="Khám phá Phú Quốc 3N2Đ..."
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-sm"
                    />
                    {form.formState.errors.name && (
                      <p className="text-xs text-red-500 font-medium">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Điểm Đến Bản Đồ <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...form.register("destinationId")}
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium appearance-none"
                    >
                      <option value={0} disabled>
                        -- Chọn Tỉnh/Thành Điểm Đến --
                      </option>
                      {destinations.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                    {form.formState.errors.destinationId && (
                      <p className="text-xs text-red-500 font-medium">
                        {form.formState.errors.destinationId.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Thời lượng (Ngày){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        {...form.register("durationDays")}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                      />
                      {form.formState.errors.durationDays && (
                        <p className="text-xs text-red-500 font-medium">
                          {form.formState.errors.durationDays.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Thời lượng (Đêm) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        {...form.register("durationNights")}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                      />
                      {form.formState.errors.durationNights && (
                        <p className="text-xs text-red-500 font-medium">
                          {form.formState.errors.durationNights.message}
                        </p>
                      )}
                    </div>
                  </div>
                </Tabs.Content>

                <Tabs.Content
                  value="financial"
                  className="space-y-5 focus:outline-none data-[state=inactive]:hidden"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <DollarSign size={14} />
                        Giá Cơ Sở (VND)
                      </label>
                      <input
                        type="number"
                        {...form.register("basePrice")}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm tabular-nums"
                      />
                      {form.formState.errors.basePrice && (
                        <p className="text-xs text-red-500 font-medium">
                          {form.formState.errors.basePrice.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Tiền Tệ
                      </label>
                      <input
                        defaultValue="VND"
                        disabled
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-100/50 dark:bg-slate-800 text-slate-500 font-bold text-sm uppercase cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Phương Tiện
                      </label>
                      <select
                        {...form.register("transportType")}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium appearance-none"
                      >
                        <option value="FLIGHT">Máy bay (Flight)</option>
                        <option value="COACH">Xe khách (Coach)</option>
                        <option value="TRAIN">Tàu hỏa (Train)</option>
                        <option value="CRUISE">Du thuyền (Cruise)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Hình Thức Đi
                      </label>
                      <select
                        {...form.register("tripMode")}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium appearance-none"
                      >
                        <option value="GROUP">
                          Khách lẻ ghép đoàn (Group)
                        </option>
                        <option value="PRIVATE">
                          Tour riêng (Private/Family)
                        </option>
                        <option value="FREETOUR">
                          Tour tự do (Free & Easy)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 dark:border-indigo-900/30 dark:bg-indigo-900/10 space-y-4">
                    <div className="flex items-center gap-3">
                      <Controller
                        name="isFeatured"
                        control={form.control}
                        render={({ field }) => (
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                          />
                        )}
                      />
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        Nổi Bật (Featured Top Tour)
                      </label>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Trạng Thái Hiển Thị
                      </label>
                      <select
                        {...form.register("status")}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium appearance-none"
                      >
                        <option value="DRAFT">Nháp (Draft)</option>
                        <option value="PUBLISHED">Công khai (Published)</option>
                        <option value="ARCHIVED">Lưu kho (Archived)</option>
                      </select>
                    </div>
                  </div>
                </Tabs.Content>

                <Tabs.Content
                  value="description"
                  className="space-y-5 focus:outline-none data-[state=inactive]:hidden"
                >
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Mô tả ngắn (Short Description)
                    </label>
                    <textarea
                      {...form.register("shortDescription")}
                      rows={2}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Mô tả chi tiết (Description)
                    </label>
                    <textarea
                      {...form.register("description")}
                      rows={6}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                </Tabs.Content>
              </div>
            </Tabs.Root>
          </form>

          <div className="flex-none p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-3 justify-end shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-20">
            <Dialog.Close asChild>
              <button
                disabled={isPending}
                type="button"
                className="px-6 py-2.5 text-sm font-bold border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-wider"
              >
                Hủy
              </button>
            </Dialog.Close>
            <button
              type="submit"
              form="tour-form"
              disabled={isPending}
              className="px-8 py-2.5 text-sm font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm uppercase tracking-wider"
            >
              {isPending ? "Đang xử lý..." : "Lưu Tuyến Tour"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
