import type { ColumnDef } from "@tanstack/react-table";
import type { Booking } from "../api/bookings.api";
import { User, Calendar, CreditCard, Hash } from "lucide-react";

export const getBookingColumns = (): ColumnDef<Booking>[] => [
  {
    accessorKey: "bookingCode",
    header: "Mã Đặt Chỗ (Code)",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 w-[120px]">
        <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 uppercase text-sm tracking-wider">
          <Hash size={14} className="text-slate-400" />
          {row.original.bookingCode}
        </span>
        <span className="text-xs text-slate-500 font-medium">
          ID: {row.original.id}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "customer",
    header: "Thông tin Liên Hệ",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 w-[200px]">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
          <User size={14} className="text-indigo-500" />
          {row.original.contactName}
        </div>
        <div className="text-xs text-slate-500 font-medium">
          {row.original.contactEmail}
        </div>
        <div className="text-xs text-slate-500 font-medium">
          {row.original.contactPhone}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "details",
    header: "Sản phẩm / Dịch vụ",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 w-[180px]">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 w-fit px-2 py-0.5 rounded text-xs text-slate-600 dark:text-slate-300">
          Tour ID: {row.original.tourId}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Calendar size={12} /> Schedule {row.original.scheduleId}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "finalAmount",
    header: "Tổng Giá Trị",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: row.original.currency || "VND",
          }).format(row.original.finalAmount)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: "Thanh Toán",
    cell: ({ row }) => {
      const isPaid =
        row.original.paymentStatus === "PAID" ||
        row.original.paymentStatus === "COMPLETED";
      return (
        <span
          className={`flex items-center gap-1.5 w-fit px-2.5 py-1 text-xs font-bold uppercase rounded-full border ${isPaid ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800"}`}
        >
          <CreditCard size={12} />{" "}
          {isPaid ? "Đã Thanh Toán" : "Chưa Thanh Toán"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng Thái Booking",
    cell: ({ row }) => {
      const isConfirmed = row.original.status === "CONFIRMED";
      const isCancelled = row.original.status === "CANCELLED";
      const isPending = row.original.status === "PENDING";
      return (
        <span
          className={`px-2.5 py-1 text-xs uppercase tracking-wider font-bold rounded-full border ${isConfirmed ? "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800" : isCancelled ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" : isPending ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/30" : "bg-slate-50 text-slate-600 border-slate-200"}`}
        >
          {row.original.status}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày Tạo",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-slate-500 tabular-nums">
        {new Intl.DateTimeFormat("vi-VN", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(new Date(row.original.createdAt))}
      </span>
    ),
  },
];
