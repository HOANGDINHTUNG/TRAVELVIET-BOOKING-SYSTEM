import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import type { Destination } from "../api/destinations.api";
import { useDeleteDestination } from "../api/destinations.api";
import {
  Edit2,
  MoreHorizontal,
  MapPin,
  Trash2,
  ShieldCheck,
  Globe,
  Users,
  Star,
  Settings,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ConfirmActionDialog } from "../../../core/components/ConfirmActionDialog";

const ActionCell = ({
  destination,
  onEdit,
}: {
  destination: Destination;
  onEdit: (d: Destination) => void;
}) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const deleteMutation = useDeleteDestination();

  const handleDelete = () => {
    deleteMutation.mutate(destination.uuid, {
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
              onClick={() => onEdit(destination)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-bold cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md focus:bg-slate-50 focus:outline-none transition-colors"
            >
              <Edit2 size={16} className="text-slate-400" /> Sửa nhanh
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() =>
                navigate(`/admin/destinations/${destination.uuid}/details`)
              }
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-bold cursor-pointer text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-md focus:bg-indigo-100 focus:outline-none transition-colors"
            >
              <Settings size={16} className="text-indigo-500" /> Cấu hình Chi
              Tiết
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-1" />
            <DropdownMenu.Item
              onClick={() => setDeleteDialogOpen(true)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-bold cursor-pointer text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700 rounded-md focus:bg-red-50 focus:outline-none transition-colors"
            >
              <Trash2 size={16} /> Xóa Điểm Đến
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <ConfirmActionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Cảnh báo xóa Điểm đến!"
        description={`Bạn có chắn muốn xóa toàn bộ dữ liệu của ${destination.name} khỏi bản đồ Destinations? (Hành động không thể hoàn tác)`}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
};

export const getDestinationColumns = (
  onEdit: (d: Destination) => void,
): ColumnDef<Destination>[] => [
  {
    accessorKey: "name",
    header: "Tên Điểm Đến",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 max-w-[300px]">
        <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          {row.original.isOfficial && (
            <ShieldCheck size={16} className="text-sky-500 shrink-0" />
          )}
          {row.original.name}
        </span>
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
          <Globe size={12} /> {row.original.code} / {row.original.slug}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Vị Trí Cụ Thể",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-rose-500" />
          {row.original.province}, {row.original.countryCode}
        </div>
        {row.original.region && (
          <span className="text-xs text-slate-400 font-medium ml-6">
            Miền: {row.original.region}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "crowdLevelDefault",
    header: "Mức độ",
    cell: ({ row }) => {
      const level = row.original.crowdLevelDefault;
      if (!level) return <span className="text-slate-400 text-xs">—</span>;

      const getCrowdProps = (lvl: string) => {
        switch (lvl) {
          case "LOW":
            return {
              color: "text-emerald-600 bg-emerald-50 border-emerald-200",
              label: "THẤP",
            };
          case "HIGH":
            return {
              color: "text-orange-600 bg-orange-50 border-orange-200",
              label: "CAO",
            };
          case "VERY_HIGH":
            return {
              color: "text-red-600 bg-red-50 border-red-200",
              label: "RẤT CAO",
            };
          default:
            return {
              color: "text-blue-600 bg-blue-50 border-blue-200",
              label: "T.BÌNH",
            };
        }
      };

      const { color, label } = getCrowdProps(level);
      return (
        <div className="flex flex-col gap-1.5 items-start">
          <span
            className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md border ${color} flex items-center gap-1`}
          >
            <Users size={10} /> {label}
          </span>
          {row.original.isFeatured && (
            <span className="px-2 py-0.5 text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-1">
              <Star size={10} className="fill-amber-500 text-amber-500" /> Nổi
              bật
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng Thái Báo Cáo",
    cell: ({ row }) => {
      const isApproved = row.original.status === "APPROVED";
      return (
        <span
          className={`px-2.5 py-1 text-xs uppercase tracking-wider font-bold rounded-full border ${isApproved ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30" : "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30"}`}
        >
          {row.original.status}
        </span>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Hiển Thị (Active)",
    cell: ({ row }) => (
      <div className="flex items-center">
        {row.original.isActive ? (
          <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded text-xs font-bold border border-sky-200">
            ON
          </span>
        ) : (
          <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-bold border border-slate-200">
            OFF
          </span>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="text-right pr-2">
        <ActionCell destination={row.original} onEdit={onEdit} />
      </div>
    ),
  },
];
