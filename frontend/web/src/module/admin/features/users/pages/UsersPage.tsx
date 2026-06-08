import React, { useState } from "react";
import { useGetUsers } from "../api/users.api";
import type { AdminUser } from "../../../../../api/server/SystemAdmin.api";
import { GenericDataTable } from "../../../core/components/GenericDataTable";
import { getUserColumns } from "../components/UserColumns";
import { UserForm } from "../components/UserForm";
import { UserPlus, Search, UsersRound } from "lucide-react";
import type { PaginationState } from "@tanstack/react-table";
import { useDebounce } from "../../../core/hooks/useDebounce";
import { userStatusOptions } from "../../../../management/pages/system/systemShared";
import { useGetRoles } from "../api/users.api";

export default function UsersPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: roles = [] } = useGetRoles();

  const { data, isLoading, isFetching } = useGetUsers(
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearch,
    statusFilter,
    roleFilter,
  );

  const columns = React.useMemo(
    () =>
      getUserColumns((user) => {
        setEditingUser(user);
        setFormOpen(true);
      }),
    [],
  );

  const handleCreateNew = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6 max-w-full pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] dark:opacity-[0.08] pointer-events-none transform translate-x-12 -translate-y-8">
          <UsersRound size={140} />
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
            <UsersRound size={24} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Quản Lý Người Dùng
            </h1>
            <p className="text-sm text-slate-500 mt-0.5 font-medium">
              Quản lý tài khoản khách hàng và phân quyền hệ thống.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto relative z-10">
          <div className="relative flex-1 sm:flex-none min-w-[200px]">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((p) => ({ ...p, pageIndex: 0 }));
              }}
              placeholder="Tìm tên, email..."
              className="pl-10 pr-4 py-2.5 w-full sm:w-[240px] border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>

          <div className="flex-1 sm:flex-none min-w-[140px]">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination((p) => ({ ...p, pageIndex: 0 }));
              }}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm text-slate-700 dark:text-slate-300 appearance-none h-[42px]"
            >
              <option value="">-- Trạng thái --</option>
              {userStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 sm:flex-none min-w-[140px]">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPagination((p) => ({ ...p, pageIndex: 0 }));
              }}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm text-slate-700 dark:text-slate-300 appearance-none h-[42px]"
            >
              <option value="">-- Tất cả vai trò --</option>
              {roles.map((r) => (
                <option key={r.id} value={r.code}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCreateNew}
            className="flex flex-1 sm:flex-none items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-bold text-sm whitespace-nowrap shadow-sm shadow-indigo-500/20 shrink-0 uppercase tracking-wide h-[42px]"
          >
            <UserPlus size={18} strokeWidth={2.5} className="-ml-1" />
            <span>Thêm Mới</span>
          </button>
        </div>
      </div>

      <GenericDataTable
        columns={columns}
        data={data?.content || []}
        pageCount={data?.totalPages || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        isFetching={isFetching}
      />

      <UserForm
        open={formOpen}
        onOpenChange={(v: boolean) => {
          setFormOpen(v);
          if (!v) setTimeout(() => setEditingUser(null), 200);
        }}
        userToEdit={editingUser}
      />
    </div>
  );
}
