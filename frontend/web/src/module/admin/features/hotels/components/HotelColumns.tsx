/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useDeleteHotel } from "../api/hotels.api";
import type { Hotel } from "../api/hotels.api";
import { Edit2, Trash2, MoreHorizontal, BedDouble } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ConfirmActionDialog } from "../../../core/components/ConfirmActionDialog";
import { useGetDestinations } from "../../destinations/api/destinations.api";

// Hiển thị tên Destination thay vì ID
const DestinationNameDisplay = ({ destId }: { destId: number }) => {
  const { data } = useGetDestinations(0, 100);
  const destination = data?.content.find((d) => d.id === destId);
  return (
    <span className="text-slate-600 dark:text-slate-400 font-medium">
      {destination ? (
        destination.name
      ) : (
        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
      )}
    </span>
  );
};

// Component Action cho Table
const ActionCell = ({
  hotel,
  onEdit,
}: {
  hotel: Hotel;
  onEdit: (d: Hotel) => void;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteMutation = useDeleteHotel();

  const handleDelete = () => {
    deleteMutation.mutate(hotel.id, {
      onSuccess: () => setDeleteDialogOpen(false),
    });
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 focus:outline-none data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800 transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            className="w-48 z-50 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl animate-in fade-in-80 zoom-in-95 font-sans"
          >
            <DropdownMenu.Item
              onClick={() => onEdit(hotel)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-bold cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md focus:bg-slate-50 dark:focus:bg-slate-800 focus:outline-none transition-colors"
            >
              <Edit2 size={16} className="text-slate-400" /> Sửa thông tin
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-1" />
            <DropdownMenu.Item
              onClick={() => setDeleteDialogOpen(true)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-bold cursor-pointer text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700 dark:hover:text-red-400 rounded-md focus:bg-red-50 dark:focus:bg-red-950/40 focus:outline-none transition-colors"
            >
              <Trash2 size={16} /> Xóa Khách Sạn
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <ConfirmActionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Cảnh báo xóa Khách sạn!"
        description={`Bạn có chắn muốn xóa toàn bộ dữ liệu của Khách sạn "${hotel.name}" bao gồm phòng ốc khỏi hệ thống? (Hành động không thể hoàn tác)`}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
};

export const getHotelColumns = (
  onEdit: (d: Hotel) => void,
): ColumnDef<Hotel>[] => [
  {
    accessorKey: "name",
    header: "Tên Khách Sạn",
    cell: ({ row }) => {
      const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`text-xs ${i < rating ? "text-amber-400" : "text-slate-200 dark:text-slate-700"}`}
          >
            ★
          </span>
        ));
      };

      return (
        <div className="flex flex-col gap-1 max-w-[280px]">
          <span className="font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
            {row.original.name}
          </span>
          <div className="flex items-center gap-1.5 opacity-90">
            {renderStars(row.original.starRating)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "destinationId",
    header: "Điểm Đến",
    cell: ({ row }) => (
      <DestinationNameDisplay destId={row.original.destinationId} />
    ),
  },
  {
    accessorKey: "roomTypes",
    header: "Hệ Thống Phòng",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
        <div className="p-1 px-2.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg flex items-center gap-1.5 border border-indigo-100 dark:border-indigo-800/30">
          <BedDouble size={14} /> {row.original.roomTypes?.length || 0} Loại
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng Thái",
    cell: ({ row }) => {
      const isActive = row.original.status === "ACTIVE";
      return (
        <span
          className={`px-2.5 py-1 text-xs font-bold rounded-full border ${isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30" : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"}`}
        >
          {isActive ? "Hoạt Động" : "Bảo Trì"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="text-right pr-2">
        <ActionCell hotel={row.original} onEdit={onEdit} />
      </div>
    ),
  },
];
