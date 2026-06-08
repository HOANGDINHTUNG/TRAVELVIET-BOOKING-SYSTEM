import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { ComboPackage } from "../api/combos.api";
import { Edit2, MoreHorizontal, PackageOpen, LayoutList } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useUpdateComboStatus } from "../api/combos.api";

const ActionCell = ({
  combo,
  onEdit,
}: {
  combo: ComboPackage;
  onEdit: (d: ComboPackage) => void;
}) => {
  return (
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
            onClick={() => onEdit(combo)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm font-bold cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md focus:outline-none transition-colors"
          >
            <Edit2 size={16} className="text-slate-400" /> Sửa thông tin Combo
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

const StatusSwitch = ({ combo }: { combo: ComboPackage }) => {
  const mutation = useUpdateComboStatus();

  return (
    <button
      onClick={() =>
        mutation.mutate({ id: combo.id, isActive: !combo.isActive })
      }
      disabled={mutation.isPending}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        combo.isActive ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          combo.isActive ? "translate-x-6" : "translate-x-1"
        } ${mutation.isPending ? "opacity-50" : ""}`}
      />
    </button>
  );
};

export const getComboColumns = (
  onEdit: (d: ComboPackage) => void,
): ColumnDef<ComboPackage>[] => [
  {
    accessorKey: "name",
    header: "Sản phẩm Combo",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 max-w-[300px]">
        <span className="font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
          {row.original.name}
        </span>
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 uppercase">
          <PackageOpen size={12} /> CODE:{" "}
          <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-1 rounded">
            {row.original.code}
          </span>
        </span>
      </div>
    ),
  },
  {
    accessorKey: "items",
    header: "Cấu thành Dịch vụ",
    cell: ({ row }) => {
      const items = row.original.items || [];
      return (
        <div className="flex flex-wrap gap-1">
          {items.slice(0, 3).map((item, idx) => (
            <span
              key={idx}
              className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 uppercase"
            >
              {item.itemType} x{item.quantity}
            </span>
          ))}
          {items.length > 3 && (
            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-indigo-100 dark:bg-indigo-900/30 dark:border-indigo-800/30 dark:text-indigo-400">
              +{items.length - 3}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "finalPrice",
    header: "Mức Giá Hiện Hành",
    cell: ({ row }) => (
      <div className="flex flex-col space-y-0.5">
        <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(row.original.finalPrice || row.original.basePrice)}
        </span>
        {row.original.discountAmount > 0 && (
          <span className="text-[10px] text-slate-500 font-medium line-through">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(row.original.basePrice)}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Đang Bán",
    cell: ({ row }) => <StatusSwitch combo={row.original} />,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="text-right pr-2">
        <ActionCell combo={row.original} onEdit={onEdit} />
      </div>
    ),
  },
];
