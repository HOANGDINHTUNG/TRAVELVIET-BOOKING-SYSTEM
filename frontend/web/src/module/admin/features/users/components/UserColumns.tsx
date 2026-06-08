import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { AdminUser } from "../../../../../api/server/SystemAdmin.api";
import { useDeactivateUser } from "../api/users.api";
import { Edit2, MoreHorizontal, Mail, Phone, UserMinus } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ConfirmActionDialog } from "../../../core/components/ConfirmActionDialog";
import {
  getInitials,
  getUserDisplayName,
  userStatusOptions,
  labelFor,
} from "../../../../management/pages/system/systemShared";

const ActionCell = ({
  user,
  onEdit,
}: {
  user: AdminUser;
  onEdit: (d: AdminUser) => void;
}) => {
  const [deactivateDialogOpen, setDeactivateDialogOpen] = React.useState(false);
  const deactivateMutation = useDeactivateUser();

  const handleDeactivate = () => {
    deactivateMutation.mutate(user.id, {
      onSuccess: () => setDeactivateDialogOpen(false),
    });
  };

  const isActive =
    user.status !== "inactive" &&
    user.status !== "blocked" &&
    user.status !== "deleted";

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
              onClick={() => onEdit(user)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-bold cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md focus:bg-slate-50 focus:outline-none transition-colors"
            >
              <Edit2 size={16} className="text-slate-400" /> Cập nhật người dùng
            </DropdownMenu.Item>
            {isActive && (
              <>
                <DropdownMenu.Separator className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-1" />
                <DropdownMenu.Item
                  onClick={() => setDeactivateDialogOpen(true)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-bold cursor-pointer text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-700 rounded-md focus:bg-amber-50 focus:outline-none transition-colors"
                >
                  <UserMinus size={16} /> Khóa tài khoản
                </DropdownMenu.Item>
              </>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <ConfirmActionDialog
        open={deactivateDialogOpen}
        onOpenChange={setDeactivateDialogOpen}
        title="Khóa tài khoản"
        description={`Bạn có chắn muốn khóa tài khoản "${getUserDisplayName(user)}"?`}
        onConfirm={handleDeactivate}
        isLoading={deactivateMutation.isPending}
      />
    </>
  );
};

export const getUserColumns = (
  onEdit: (d: AdminUser) => void,
): ColumnDef<AdminUser>[] => [
  {
    accessorKey: "name",
    header: "Họ và Tên",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover shadow-sm bg-slate-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 font-bold flex items-center justify-center shrink-0">
              {getInitials(getUserDisplayName(user)) || "U"}
            </div>
          )}
          <div className="flex flex-col max-w-[200px]">
            <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
              {getUserDisplayName(user)}
            </span>
            <span className="text-xs font-medium text-slate-500 truncate">
              ID: {user.id.substring(0, 8)}...
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "contact",
    header: "Liên hệ",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
          {user.email && (
            <div className="flex items-center gap-1.5">
              <Mail size={14} className="text-slate-400 shrink-0" />
              <span className="truncate max-w-[200px]">{user.email}</span>
            </div>
          )}
          {user.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={14} className="text-slate-400 shrink-0" />
              <span className="truncate max-w-[200px]">{user.phone}</span>
            </div>
          )}
          {!user.email && !user.phone && (
            <span className="italic text-slate-400 text-xs">
              Chưa có thông tin liên hệ
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "roles",
    header: "Vai Trò",
    cell: ({ row }) => {
      const user = row.original;
      const roleStr = user.roles?.join(", ") || user.role || "GUEST";
      return (
        <span className="px-2.5 py-1 text-xs uppercase tracking-wider font-bold rounded-lg bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 shadow-sm whitespace-nowrap">
          {roleStr}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng Thái",
    cell: ({ row }) => {
      const statusValue = row.original.status || "unknown";
      const statusLabel = labelFor(userStatusOptions, statusValue);
      let colorClass =
        "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";

      if (statusValue.toLowerCase() === "active") {
        colorClass =
          "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30";
      } else if (
        statusValue.toLowerCase() === "inactive" ||
        statusValue.toLowerCase() === "blocked"
      ) {
        colorClass =
          "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/30";
      }

      return (
        <span
          className={`px-2.5 py-1 text-xs uppercase tracking-wider font-bold rounded-full border shadow-sm ${colorClass}`}
        >
          {statusLabel}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="text-right pr-2">
        <ActionCell user={row.original} onEdit={onEdit} />
      </div>
    ),
  },
];
