import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, UserSquare } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { useCreateUser, useUpdateUser, useGetRoles } from "../api/users.api";
import type {
  AdminUser,
  AdminCreateUserPayload,
  AdminUpdateUserPayload,
} from "../../../../../api/server/SystemAdmin.api";
import {
  genderOptions,
  memberLevelOptions,
  userCategoryOptions,
  userStatusOptions,
} from '@/utils/systemShared';

const userSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
  displayName: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  phone: z.string().optional(),
  passwordHash: z.string().optional(),
  userCategory: z.string().min(1, "Chọn nhóm tài khoản"),
  status: z.string().min(1, "Chọn trạng thái"),
  roleCodes: z.array(z.string()).default([]),
  memberLevel: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  loyaltyPoints: z.coerce.number().optional(),
  totalSpent: z.coerce.number().optional(),
  avatarUrl: z.string().optional(),
});

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userToEdit: AdminUser | null;
}

export function UserForm({ open, onOpenChange, userToEdit }: UserFormProps) {
  const isEditing = !!userToEdit;
  const createMut = useCreateUser();
  const updateMut = useUpdateUser(userToEdit?.id || null);

  const { data: roles = [] } = useGetRoles();

  const [activeTab, setActiveTab] = useState("general");

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: "",
      displayName: "",
      email: "",
      phone: "",
      passwordHash: "",
      userCategory: "CUSTOMER",
      status: "active",
      roleCodes: [],
      memberLevel: "NONE",
      gender: "UNKNOWN",
      dateOfBirth: "",
      loyaltyPoints: 0,
      totalSpent: 0,
      avatarUrl: "",
    },
  });

  useEffect(() => {
    if (open) {
      setActiveTab("general");
      if (userToEdit) {
        form.reset({
          fullName: userToEdit.fullName || "",
          displayName: userToEdit.displayName || "",
          email: userToEdit.email || "",
          phone: userToEdit.phone || "",
          passwordHash: "", // Don't populate password hash
          userCategory: userToEdit.userCategory || "CUSTOMER",
          status: userToEdit.status || "active",
          roleCodes: userToEdit.roles || [],
          memberLevel: userToEdit.memberLevel || "NONE",
          gender: userToEdit.gender || "UNKNOWN",
          dateOfBirth: userToEdit.dateOfBirth || "",
          loyaltyPoints: userToEdit.loyaltyPoints || 0,
          totalSpent: Number(userToEdit.totalSpent || 0),
          avatarUrl: userToEdit.avatarUrl || "",
        });
      } else {
        form.reset({
          fullName: "",
          displayName: "",
          email: "",
          phone: "",
          passwordHash: "",
          userCategory: "CUSTOMER",
          status: "active",
          roleCodes: ["CUSTOMER"],
          memberLevel: "NONE",
          gender: "UNKNOWN",
          dateOfBirth: "",
          loyaltyPoints: 0,
          totalSpent: 0,
          avatarUrl: "",
        });
      }
    }
  }, [open, userToEdit, form]);

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    if (isEditing) {
      const payload: AdminUpdateUserPayload = {
        fullName: values.fullName,
        displayName: values.displayName,
        email: values.email || undefined,
        phone: values.phone || undefined,
        userCategory: values.userCategory,
        status: values.status,
        roleCodes: values.roleCodes,
        memberLevel: values.memberLevel || "NONE",
        gender: values.gender,
        dateOfBirth: values.dateOfBirth,
        loyaltyPoints: values.loyaltyPoints,
        totalSpent: values.totalSpent,
        avatarUrl: values.avatarUrl,
      };
      if (values.passwordHash?.trim()) {
        payload.passwordHash = values.passwordHash;
      }
      updateMut.mutate(payload, { onSuccess: () => onOpenChange(false) });
    } else {
      const payload: AdminCreateUserPayload = {
        ...values,
        passwordHash: values.passwordHash || "12345678", // Provide a default if empty on creation
      };
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
                <UserSquare size={24} strokeWidth={2} />
              </div>
              <div>
                <Dialog.Title className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  {isEditing
                    ? "Cập Nhật Hồ Sơ Người Dùng"
                    : "Tạo Tài Khoản Mới"}
                </Dialog.Title>
                <Dialog.Description className="text-sm font-medium text-slate-500 mt-1">
                  Định cấu hình thông tin định danh và phân quyền.
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
            id="user-form"
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
                  Thông tin cơ bản
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="access"
                  className="px-4 py-3 border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 dark:data-[state=active]:border-indigo-400 font-bold text-sm text-slate-500 whitespace-nowrap transition-colors"
                >
                  Quyền & Vai Trò
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="details"
                  className="px-4 py-3 border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 dark:data-[state=active]:border-indigo-400 font-bold text-sm text-slate-500 whitespace-nowrap transition-colors"
                >
                  Dữ Liệu Mở Rộng
                </Tabs.Trigger>
              </Tabs.List>

              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                <Tabs.Content
                  value="general"
                  className="space-y-5 focus:outline-none data-[state=inactive]:hidden"
                >
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Họ Và Tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...form.register("fullName")}
                      placeholder="VD: Nguyễn Văn A"
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold"
                    />
                    {form.formState.errors.fullName && (
                      <p className="text-xs text-red-500 font-medium">
                        {form.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Tên Hiển Thị
                      </label>
                      <input
                        {...form.register("displayName")}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Giới Tính
                      </label>
                      <select
                        {...form.register("gender")}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium appearance-none"
                      >
                        {genderOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Email
                      </label>
                      <input
                        type="email"
                        {...form.register("email")}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                      {form.formState.errors.email && (
                        <p className="text-xs text-red-500 font-medium">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Số Điện Thoại
                      </label>
                      <input
                        {...form.register("phone")}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 flex flex-col pt-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Avatar URL
                    </label>
                    <input
                      {...form.register("avatarUrl")}
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono text-slate-500"
                    />
                  </div>
                </Tabs.Content>

                <Tabs.Content
                  value="access"
                  className="space-y-6 focus:outline-none data-[state=inactive]:hidden"
                >
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Mật Khẩu
                    </label>
                    <input
                      type="password"
                      {...form.register("passwordHash")}
                      placeholder={
                        isEditing
                          ? "Bỏ trống nếu không thay đổi"
                          : "Nhập mật khẩu (tối thiểu 8 ký tự)"
                      }
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Nhóm Tài Khoản
                      </label>
                      <select
                        {...form.register("userCategory")}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium appearance-none"
                      >
                        {userCategoryOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Trạng Thái
                      </label>
                      <select
                        {...form.register("status")}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-700 appearance-none shadow-sm"
                      >
                        {userStatusOptions.slice(1).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">
                      Ủy Quyền (Roles)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <Controller
                        name="roleCodes"
                        control={form.control}
                        render={({ field }) => (
                          <>
                            {roles.map((r) => (
                              <label
                                key={r.code}
                                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                                  checked={field.value.includes(r.code || "")}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      field.onChange([...field.value, r.code]);
                                    } else {
                                      field.onChange(
                                        field.value.filter(
                                          (code) => code !== r.code,
                                        ),
                                      );
                                    }
                                  }}
                                />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                  {r.name || r.code}
                                </span>
                              </label>
                            ))}
                          </>
                        )}
                      />
                    </div>
                  </div>
                </Tabs.Content>

                <Tabs.Content
                  value="details"
                  className="space-y-5 focus:outline-none data-[state=inactive]:hidden"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Hạng Thành Viên
                      </label>
                      <select
                        {...form.register("memberLevel")}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium appearance-none"
                      >
                        {memberLevelOptions.slice(1).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Ngày Sinh
                      </label>
                      <input
                        type="date"
                        {...form.register("dateOfBirth")}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Điểm Tích Lũy
                      </label>
                      <input
                        type="number"
                        {...form.register("loyaltyPoints")}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm tabular-nums"
                      />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Tổng Chi Tiêu
                      </label>
                      <input
                        type="number"
                        {...form.register("totalSpent")}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm tabular-nums"
                      />
                    </div>
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
              form="user-form"
              disabled={isPending}
              className="px-8 py-2.5 text-sm font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm uppercase tracking-wider flex items-center justify-center min-w-[140px]"
            >
              {isPending ? "Đang xử lý..." : "Lưu Hồ Sơ"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
