import React, { useState } from "react";
import { useGetTours } from "../api/tours.api";
import type { Tour } from "../api/tours.api";
import { GenericDataTable } from "../../../core/components/GenericDataTable";
import { getTourColumns } from "../components/TourColumns";
import { TourForm } from "../components/TourForm";
import { TourSchedulesDialog } from "../components/TourSchedulesDialog";
import { Plus, Search, Compass } from "lucide-react";
import type { PaginationState } from "@tanstack/react-table";
import { useDebounce } from "../../../core/hooks/useDebounce";

export default function TourPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  const [schedulesOpen, setSchedulesOpen] = useState(false);
  const [schedulesTour, setSchedulesTour] = useState<Tour | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isFetching } = useGetTours(
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearch,
  );

  const columns = React.useMemo(
    () =>
      getTourColumns(
        (tour) => {
          setEditingTour(tour);
          setFormOpen(true);
        },
        (tour) => {
          setSchedulesTour(tour);
          setSchedulesOpen(true);
        },
      ),
    [],
  );

  const handleCreateNew = () => {
    setEditingTour(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6 max-w-full pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] dark:opacity-[0.08] pointer-events-none transform translate-x-12 -translate-y-8">
          <Compass size={140} />
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
            <Compass size={24} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Chương trình Tour / Lộ trình
            </h1>
            <p className="text-sm text-slate-500 mt-0.5 font-medium">
              Tổ chức nội dung cấu trúc & thiết kế sản phẩm Tour trọn gói.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto relative z-10">
          <div className="relative flex-1 sm:flex-none">
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
              placeholder="Tìm kiếm tour..."
              className="pl-10 pr-4 py-2.5 w-full sm:w-[280px] border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-bold text-sm whitespace-nowrap shadow-sm shadow-indigo-500/20 shrink-0 uppercase tracking-wide"
          >
            <Plus size={18} strokeWidth={2.5} className="-ml-1" />{" "}
            <span>Thiết Kế Tuyến Mới</span>
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

      <TourForm
        open={formOpen}
        onOpenChange={(v: boolean) => {
          setFormOpen(v);
          if (!v) setTimeout(() => setEditingTour(null), 200);
        }}
        tourToEdit={editingTour}
      />

      <TourSchedulesDialog
        open={schedulesOpen}
        onOpenChange={(v: boolean) => {
          setSchedulesOpen(v);
          if (!v) setTimeout(() => setSchedulesTour(null), 200);
        }}
        tour={schedulesTour}
      />
    </div>
  );
}
