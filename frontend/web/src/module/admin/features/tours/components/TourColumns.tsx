import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Tour } from "../api/tours.api";
import { useDeleteTour } from "../api/tours.api";
import {
  Edit2,
  MoreHorizontal,
  Compass,
  Trash2,
  CalendarDays,
  Navigation,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ConfirmActionDialog } from "../../../core/components/ConfirmActionDialog";

const ActionCell = ({
  tour,
  onEdit,
}: {
  tour: Tour;
  onEdit: (d: Tour) => void;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const deleteMutation = useDeleteTour();

  const handleDelete = () => {
    deleteMutation.mutate(tour.id, {
      onSuccess: () => setDeleteDialogOpen(false),
    });
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 focus:outline-none transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            className="w-48 z-50 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-xl animate-in fade-in-80 font-sans"
          >
            <DropdownMenu.Item
              onClick={() => onEdit(tour)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-bold cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md focus:bg-slate-50 focus:outline-none transition-colors"
            >
              <Edit2 size={16} className="text-slate-400" /> Sửa thông tin Tour
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-1" />
            <DropdownMenu.Item
              onClick={() => setDeleteDialogOpen(true)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-bold cursor-pointer text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700 rounded-md focus:bg-red-50 focus:outline-none transition-colors"
            >
              <Trash2 size={16} /> Gỡ bỏ Tuyến
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <ConfirmActionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Cảnh báo gỡ bỏ Tour!"
        description={`Bạn có chắn muốn gỡ bỏ tour "${tour.name}" ra khỏi hệ thống? (Hành động này sẽ xóa hoặc ẩn vĩnh viễn)`}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
};

export const getTourColumns = (
  onEdit: (d: Tour) => void,
): ColumnDef<Tour>[] => [
  {
    accessorKey: "name",
    header: "Sản phẩm Tour / Mã",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1.5 max-w-[320px]">
        <span className="font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
          {row.original.name}
        </span>
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
          <Compass size={12} className="text-indigo-500" /> {row.original.code}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "schedule",
    header: "Lộ Trình / Điểm Đến",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-1.5 w-fit bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          <CalendarDays size={14} /> {row.original.durationDays}N{" "}
          {row.original.durationNights}Đ
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <Navigation size={12} className="text-rose-500" />{" "}
          {row.original.destinationName ||
            `Destination ID: ${row.original.destinationId}`}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "basePrice",
    header: "Giá Cơ Sở",
    cell: ({ row }) => (
      <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: row.original.currency || "VND",
        }).format(row.original.basePrice)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Hiển Thị (Status)",
    cell: ({ row }) => {
      const isPublished =
        row.original.status === "PUBLISHED" || row.original.status === "ACTIVE";
      const isDraft = row.original.status === "DRAFT";
      return (
        <span
          className={`px-2.5 py-1 text-xs uppercase tracking-wider font-bold rounded-full border ${isPublished ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30" : isDraft ? "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700" : "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30"}`}
        >
          {row.original.status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="text-right pr-2">
        <ActionCell tour={row.original} onEdit={onEdit} />
      </div>
    ),
  },
];
