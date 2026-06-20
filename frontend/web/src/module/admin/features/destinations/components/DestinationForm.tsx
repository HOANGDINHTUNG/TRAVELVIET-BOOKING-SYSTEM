import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, MapPin } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import {
  useCreateDestination,
  useUpdateDestination,
} from "../api/destinations.api";
import type { Destination, DestinationRequest } from "../api/destinations.api";

const numberOrUndefined = z
  .union([z.string(), z.number(), z.undefined(), z.null()])
  .transform((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  });

const destSchema = z.object({
  code: z.string().min(1, "Bắt buộc nhập Code (VD: VNPQ)"),
  name: z.string().min(1, "Bắt buộc nhập tên Điểm Đến"),
  slug: z.string().optional(),
  countryCode: z.string().min(2, "Mã quốc gia (VD: VN)").max(2),
  province: z.string().min(1, "Bắt buộc nhập Tỉnh/Thành"),
  district: z.string().optional(),
  region: z.string().optional(),
  address: z.string().optional(),
  latitude: numberOrUndefined,
  longitude: numberOrUndefined,
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  bestTimeFromMonth: numberOrUndefined,
  bestTimeToMonth: numberOrUndefined,
  crowdLevelDefault: z.string().optional(),
  isActive: z.boolean().default(true),
  isOfficial: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  parentId: numberOrUndefined,
});

interface DestinationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destToEdit: Destination | null;
}

export function DestinationForm({
  open,
  onOpenChange,
  destToEdit,
}: DestinationFormProps) {
  const isEditing = !!destToEdit;
  const createMut = useCreateDestination();
  const updateMut = useUpdateDestination();

  const form = useForm<z.infer<typeof destSchema>>({
    resolver: zodResolver(destSchema),
    defaultValues: {
      code: "",
      name: "",
      slug: "",
      countryCode: "VN",
      province: "",
      district: "",
      region: "",
      address: "",
      latitude: undefined,
      longitude: undefined,
      shortDescription: "",
      description: "",
      bestTimeFromMonth: undefined,
      bestTimeToMonth: undefined,
      crowdLevelDefault: "MEDIUM",
      isActive: true,
      isOfficial: true,
      isFeatured: false,
      parentId: undefined,
    },
  });

  useEffect(() => {
    if (open && destToEdit) {
      form.reset({
        code: destToEdit.code,
        name: destToEdit.name,
        slug: destToEdit.slug || "",
        countryCode: destToEdit.countryCode || "VN",
        province: destToEdit.province || "",
        district: destToEdit.district || "",
        region: destToEdit.region || "",
        address: destToEdit.address || "",
        latitude: destToEdit.latitude,
        longitude: destToEdit.longitude,
        shortDescription: destToEdit.shortDescription || "",
        description: destToEdit.description || "",
        bestTimeFromMonth: destToEdit.bestTimeFromMonth,
        bestTimeToMonth: destToEdit.bestTimeToMonth,
        crowdLevelDefault: destToEdit.crowdLevelDefault || "MEDIUM",
        isActive: destToEdit.isActive,
        isOfficial: destToEdit.isOfficial,
        isFeatured: destToEdit.isFeatured,
        parentId: destToEdit.parentId,
      });
    } else if (open && !destToEdit) {
      form.reset({
        code: "",
        name: "",
        slug: "",
        countryCode: "VN",
        province: "",
        district: "",
        region: "",
        address: "",
        latitude: undefined,
        longitude: undefined,
        shortDescription: "",
        description: "",
        bestTimeFromMonth: undefined,
        bestTimeToMonth: undefined,
        crowdLevelDefault: "MEDIUM",
        isActive: true,
        isOfficial: true,
        isFeatured: false,
        parentId: undefined,
      });
    }
  }, [open, destToEdit, form]);

  const onSubmit = async (values: z.infer<typeof destSchema>) => {
    const payload = values as DestinationRequest;
    if (isEditing && destToEdit) {
      updateMut.mutate(
        { uuid: destToEdit.uuid, data: payload },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMut.mutate(payload, { onSuccess: () => onOpenChange(false) });
    }
  };

  const isPending = createMut.isPending || updateMut.isPending;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[600px] border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shadow-2xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300">
          <div className="flex flex-none items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                <MapPin size={24} strokeWidth={2} />
              </div>
              <div>
                <Dialog.Title className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  {isEditing ? "Cập nhật Điểm Đến" : "Mở rộng Bản Đồ"}
                </Dialog.Title>
                <Dialog.Description className="text-sm font-medium text-slate-500 mt-1">
                  Đánh dấu địa lý một địa phương hoặc Quốc gia.
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
            id="dest-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 overflow-hidden flex flex-col"
          >
            <Tabs.Root
              defaultValue="general"
              className="flex-1 flex flex-col h-full"
            >
              <Tabs.List className="flex px-6 space-x-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pt-2 shrink-0">
                <Tabs.Trigger
                  value="general"
                  className="px-4 py-3 text-sm font-bold text-slate-500 data-[state=active]:text-rose-600 border-b-2 border-transparent data-[state=active]:border-rose-600 transition-colors"
                >
                  Thông tin (General)
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="geography"
                  className="px-4 py-3 text-sm font-bold text-slate-500 data-[state=active]:text-rose-600 border-b-2 border-transparent data-[state=active]:border-rose-600 transition-colors"
                >
                  Địa lý (Geography)
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="tourism"
                  className="px-4 py-3 text-sm font-bold text-slate-500 data-[state=active]:text-rose-600 border-b-2 border-transparent data-[state=active]:border-rose-600 transition-colors"
                >
                  Du lịch (Tourism)
                </Tabs.Trigger>
              </Tabs.List>

              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
                <Tabs.Content
                  value="general"
                  className="space-y-6 outline-none"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Mã CODE <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...form.register("code")}
                        placeholder="VD: SGN, HN, PQ..."
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold text-sm uppercase"
                      />
                      {form.formState.errors.code && (
                        <p className="text-xs text-red-500 font-medium">
                          {form.formState.errors.code.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Tên Điểm Đến <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...form.register("name")}
                        placeholder="Hồ Chí Minh, Đà Nẵng..."
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold text-sm"
                      />
                      {form.formState.errors.name && (
                        <p className="text-xs text-red-500 font-medium">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Slug (Đường dẫn)
                      </label>
                      <input
                        {...form.register("slug")}
                        placeholder="ho-chi-minh"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Danh mục cha (ID)
                      </label>
                      <input
                        type="number"
                        {...form.register("parentId")}
                        placeholder="VD: 1 (Việt Nam)"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-semibold text-sm"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/50 dark:border-rose-900/30 dark:bg-rose-900/10 space-y-4">
                    <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-1">
                      Tuỳ chỉnh hiển thị
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Controller
                          name="isActive"
                          control={form.control}
                          render={({ field }) => (
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                            />
                          )}
                        />
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          Đang hoạt động (Active)
                        </label>
                      </div>

                      <div className="flex items-center gap-3">
                        <Controller
                          name="isFeatured"
                          control={form.control}
                          render={({ field }) => (
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                            />
                          )}
                        />
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          Nổi bật (Featured)
                        </label>
                      </div>

                      <div className="flex items-center gap-3">
                        <Controller
                          name="isOfficial"
                          control={form.control}
                          render={({ field }) => (
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                            />
                          )}
                        />
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          Chính thức (Official)
                        </label>
                      </div>
                    </div>
                  </div>
                </Tabs.Content>

                <Tabs.Content
                  value="geography"
                  className="space-y-6 outline-none"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Mã Quốc Gia <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...form.register("countryCode")}
                        placeholder="VN"
                        maxLength={2}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold text-sm uppercase"
                      />
                      {form.formState.errors.countryCode && (
                        <p className="text-xs text-red-500 font-medium">
                          {form.formState.errors.countryCode.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Tỉnh/Thành <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...form.register("province")}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-medium"
                      />
                      {form.formState.errors.province && (
                        <p className="text-xs text-red-500 font-medium">
                          {form.formState.errors.province.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Quận/Huyện (District)
                      </label>
                      <input
                        {...form.register("district")}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Vùng/Miền (Region)
                      </label>
                      <input
                        {...form.register("region")}
                        placeholder="Đông Nam Bộ..."
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Đoạn địa chỉ chi tiết (Address)
                    </label>
                    <input
                      {...form.register("address")}
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Vĩ độ (Latitude)
                      </label>
                      <input
                        {...form.register("latitude")}
                        type="number"
                        step="0.0000001"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Kinh độ (Longitude)
                      </label>
                      <input
                        {...form.register("longitude")}
                        type="number"
                        step="0.0000001"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                      />
                    </div>
                  </div>
                </Tabs.Content>

                <Tabs.Content
                  value="tourism"
                  className="space-y-6 outline-none"
                >
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Mô tả ngắn (Short Description)
                    </label>
                    <textarea
                      {...form.register("shortDescription")}
                      rows={2}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Mô tả chi tiết (Long Description)
                    </label>
                    <textarea
                      {...form.register("description")}
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Tháng thích hợp (Bắt đầu)
                      </label>
                      <input
                        {...form.register("bestTimeFromMonth")}
                        type="number"
                        min="1"
                        max="12"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Tháng thích hợp (Kết thúc)
                      </label>
                      <input
                        {...form.register("bestTimeToMonth")}
                        type="number"
                        min="1"
                        max="12"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Mức độ đông đúc (Crowd Level)
                    </label>
                    <select
                      {...form.register("crowdLevelDefault")}
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-medium"
                    >
                      <option value="LOW">Thấp (Thưa thớt)</option>
                      <option value="MEDIUM">Trung bình</option>
                      <option value="HIGH">Cao (Đông đúc)</option>
                      <option value="VERY_HIGH">Rất cao (Quá tải)</option>
                    </select>
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
                className="px-6 py-2.5 text-sm font-bold border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors uppercase tracking-wider"
              >
                Hủy
              </button>
            </Dialog.Close>
            <button
              type="submit"
              form="dest-form"
              disabled={isPending}
              className="px-8 py-2.5 text-sm font-bold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors flex items-center gap-2 uppercase tracking-wider shadow-sm"
            >
              {isPending ? "Đang xử lý..." : "Lưu Điểm Đến"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
