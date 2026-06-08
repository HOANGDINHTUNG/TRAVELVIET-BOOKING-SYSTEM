import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Plus, Trash2, PackageOpen, LayoutList } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { useCreateCombo, useUpdateCombo } from "../api/combos.api";
import type { ComboPackage, ComboPackageRequest } from "../api/combos.api";
import { useGetDestinations } from "../../destinations/api/destinations.api";

const comboItemSchema = z.object({
  itemType: z.enum(["FLIGHT", "HOTEL", "TOUR", "TRANSIT", "OTHER"]),
  itemRefId: z.coerce.number().optional(),
  itemName: z.string().min(1, "Hãy nhập tên dịch vụ"),
  quantity: z.coerce.number().min(1),
  unitPrice: z.coerce.number().min(0),
  isMandatory: z.boolean().default(true),
});

const comboSchema = z.object({
  code: z.string().min(1, "Cần mã Combo"),
  name: z.string().min(1, "Tên Combo không được để trống"),
  description: z.string().optional(),
  destinationId: z.coerce.number().min(1, "Chọn Điểm đến"),
  comboType: z.string().min(1),
  basePrice: z.coerce.number().min(0),
  discountAmount: z.coerce.number().min(0).default(0),
  isActive: z.boolean().default(true),
  items: z.array(comboItemSchema).min(1, "Phải có ít nhất 1 dịch vụ"),
});

interface ComboFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comboToEdit: ComboPackage | null;
}

export function ComboForm({ open, onOpenChange, comboToEdit }: ComboFormProps) {
  const isEditing = !!comboToEdit;
  const createMut = useCreateCombo();
  const updateMut = useUpdateCombo(comboToEdit?.id || null);

  const { data: destData, isLoading: destLoading } = useGetDestinations(0, 100);
  const destinations = destData?.content || [];

  const form = useForm<z.infer<typeof comboSchema>>({
    resolver: zodResolver(comboSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      destinationId: 0,
      comboType: "STANDARD",
      basePrice: 0,
      discountAmount: 0,
      isActive: true,
      items: [
        {
          itemType: "FLIGHT",
          itemName: "",
          quantity: 1,
          unitPrice: 0,
          isMandatory: true,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (open && comboToEdit) {
      form.reset({
        code: comboToEdit.code,
        name: comboToEdit.name,
        description: comboToEdit.description || "",
        destinationId: comboToEdit.destinationId || 0,
        comboType: comboToEdit.comboType || "STANDARD",
        basePrice: comboToEdit.basePrice,
        discountAmount: comboToEdit.discountAmount || 0,
        isActive: comboToEdit.isActive,
        items: (comboToEdit.items || []).map((i) => ({
          itemType: (i.itemType as any) || "OTHER",
          itemName: i.itemName,
          itemRefId: i.itemRefId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          isMandatory: i.isMandatory !== undefined ? i.isMandatory : true,
        })),
      });
    } else if (open && !comboToEdit) {
      form.reset({
        code: "",
        name: "",
        description: "",
        destinationId: 0,
        comboType: "STANDARD",
        basePrice: 0,
        discountAmount: 0,
        isActive: true,
        items: [
          {
            itemType: "FLIGHT",
            itemName: "",
            quantity: 1,
            unitPrice: 0,
            isMandatory: true,
          },
        ],
      });
    }
  }, [open, comboToEdit, form]);

  const onSubmit = async (values: z.infer<typeof comboSchema>) => {
    const payload = values as ComboPackageRequest;
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
        <Dialog.Content className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[800px] border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shadow-2xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300">
          <div className="flex flex-none items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative z-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                <PackageOpen size={24} strokeWidth={2} />
              </div>
              <div>
                <Dialog.Title className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  {isEditing ? "Cập nhật Gói Combo" : "Tạo mẫu Combo Mới"}
                </Dialog.Title>
                <Dialog.Description className="text-sm font-medium text-slate-500 mt-1">
                  Đóng gói chuỗi dịch vụ và thiết lập giá tối ưu.
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                disabled={isPending}
                className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <form
            id="combo-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 overflow-hidden flex flex-col"
          >
            <Tabs.Root defaultValue="tab1" className="flex flex-col h-full">
              <Tabs.List className="flex flex-none shrink-0 border-b border-slate-200 dark:border-slate-800 px-6 gap-6 bg-white dark:bg-slate-900 z-10 w-full overflow-x-auto scrollbar-hide shadow-sm sticky top-0">
                <Tabs.Trigger
                  value="tab1"
                  className="py-4 text-sm font-bold border-b-[3px] border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  Thông tin Cơ bản
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="tab2"
                  className="py-4 text-sm font-bold border-b-[3px] border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors flex items-center gap-2"
                >
                  Giỏ Dịch vụ (Items)
                  {form.formState.errors.items && (
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Mã CODE Combo <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...form.register("code")}
                          placeholder="VD: SUMMER2024"
                          className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase font-bold text-sm"
                        />
                        {form.formState.errors.code && (
                          <p className="text-xs text-red-500 font-medium">
                            {form.formState.errors.code.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Điểm Đến <span className="text-red-500">*</span>
                        </label>
                        <Controller
                          name="destinationId"
                          control={form.control}
                          render={({ field }) => (
                            <select
                              {...field}
                              disabled={destLoading}
                              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                            >
                              <option value={0} disabled>
                                -- Tỉnh/Thành --
                              </option>
                              {destinations.map((d) => (
                                <option key={d.id} value={d.id}>
                                  {d.name}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Tên Combo <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...form.register("name")}
                        placeholder="VD: Combo nghỉ dưỡng 3N2Đ Phú Quốc + Bay Bamboo"
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-sm"
                      />
                      {form.formState.errors.name && (
                        <p className="text-xs text-red-500 font-medium">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Tổng Giá Gốc (Base Price){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          {...form.register("basePrice")}
                          className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-600 dark:text-indigo-400 font-black text-sm tabular-nums"
                        />
                      </div>
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Giá trị Khuyến Mãi Giảm Từ Gốc
                        </label>
                        <input
                          type="number"
                          {...form.register("discountAmount")}
                          className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-emerald-600 dark:text-emerald-400 font-black text-sm tabular-nums"
                        />
                      </div>
                    </div>
                  </div>
                </Tabs.Content>

                <Tabs.Content
                  value="tab2"
                  className="space-y-5 animate-in fade-in zoom-in-95 duration-200 outline-none pb-8"
                >
                  {form.formState.errors.items?.root && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm font-medium border border-red-200 flex items-center gap-2 shadow-sm">
                      {form.formState.errors.items.root.message}
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
                            className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 rounded-md border border-transparent transition-colors shadow-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_100px] gap-4 mb-4 pr-10">
                          <div className="space-y-1.5 flex flex-col">
                            <label className="text-xs font-bold text-slate-500">
                              LOẠI DỊCH VỤ
                            </label>
                            <Controller
                              name={`items.${index}.itemType` as const}
                              control={form.control}
                              render={({ field }) => (
                                <select
                                  {...field}
                                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 focus:outline-none text-xs font-bold uppercase"
                                >
                                  <option value="FLIGHT">Chuyến Bay</option>
                                  <option value="HOTEL">Phòng KS</option>
                                  <option value="TOUR">Tour/Xe</option>
                                  <option value="OTHER">Dịch vụ khác</option>
                                </select>
                              )}
                            />
                          </div>

                          <div className="space-y-1.5 flex flex-col">
                            <label className="text-xs font-bold text-slate-500">
                              TÊN DỊCH VỤ{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              {...form.register(
                                `items.${index}.itemName` as const,
                              )}
                              placeholder="Mô tả hoặc Tên SP..."
                              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-semibold shadow-sm"
                            />
                            {form.formState.errors.items?.[index]?.itemName && (
                              <p className="text-[10px] text-red-500">
                                {
                                  form.formState.errors.items?.[index]?.itemName
                                    ?.message
                                }
                              </p>
                            )}
                          </div>

                          <div className="space-y-1.5 flex flex-col">
                            <label className="text-xs font-bold text-slate-500">
                              SỐ LƯỢNG
                            </label>
                            <input
                              type="number"
                              {...form.register(
                                `items.${index}.quantity` as const,
                              )}
                              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-bold tabular-nums text-indigo-600 dark:text-indigo-400 text-sm text-center shadow-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5 flex flex-col">
                            <label className="text-xs font-bold text-slate-500">
                              Đơn Giá Khai Báo (VND)
                            </label>
                            <input
                              type="number"
                              {...form.register(
                                `items.${index}.unitPrice` as const,
                              )}
                              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 tabular-nums text-sm font-medium shadow-sm"
                            />
                          </div>
                          <div className="flex items-center gap-3 mt-5">
                            <Controller
                              name={`items.${index}.isMandatory` as const}
                              control={form.control}
                              render={({ field }) => (
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                              )}
                            />
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                              Dịch vụ Bắt Buộc (Mandatory)
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      append({
                        itemType: "OTHER",
                        itemName: "",
                        quantity: 1,
                        unitPrice: 0,
                        isMandatory: true,
                      })
                    }
                    className="w-full py-4 border-[2px] border-dashed border-indigo-200 dark:border-indigo-900/50 rounded-2xl text-sm font-semibold text-indigo-500 hover:text-indigo-700 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all flex justify-center items-center gap-2 group shadow-sm bg-white dark:bg-slate-950"
                  >
                    <Plus
                      size={18}
                      className="group-hover:scale-125 transition-transform"
                    />{" "}
                    <span className="tracking-wide uppercase">
                      Thêm Dịch vụ vào Combo
                    </span>
                  </button>
                  <div className="h-4" />
                </Tabs.Content>
              </div>
            </Tabs.Root>
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
              form="combo-form"
              disabled={isPending}
              className="px-8 py-2.5 text-sm font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 uppercase tracking-wider shadow-sm shadow-indigo-500/20"
            >
              {isPending ? "Đang đẩy dữ liệu..." : "Lưu Thay Đổi"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
