import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
// import { cn } from '../../../../lib/utils'; // Sử dụng nếu cần thiết

export interface GenericDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  isLoading?: boolean;
  isFetching?: boolean;
}

export function GenericDataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pagination,
  onPaginationChange,
  isLoading = false,
  isFetching = false,
}: GenericDataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        onPaginationChange(updater(pagination));
      } else {
        onPaginationChange(updater);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // Ép dùng Server-side Pagination
  });

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="h-12 px-5 align-middle whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {isLoading ? (
                // Skeleton loading state
                Array.from({ length: pagination.pageSize }).map((_, index) => (
                  <tr key={index}>
                    {columns.map((_, colIndex) => (
                      <td key={colIndex} className="p-4 align-middle">
                        {colIndex === columns.length - 1 ? (
                          <div className="flex justify-end pr-2">
                            <div className="h-8 w-8 bg-slate-100 dark:bg-slate-800/80 rounded-full animate-pulse" />
                          </div>
                        ) : colIndex === 0 ? (
                          <div className="space-y-2">
                            <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                            <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse" />
                          </div>
                        ) : (
                          <div
                            className={`h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse ${index % 2 === 0 ? "w-3/4" : "w-1/2"}`}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows?.length ? (
                // Dotted data rendering
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="p-4 align-middle text-slate-700 dark:text-slate-300"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                // Empty state
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-32 text-center text-slate-400 bg-slate-50/30 dark:bg-slate-900/30"
                  >
                    Hmm... Không có dữ liệu nào trong danh sách.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination View */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-slate-500 flex items-center h-5">
          {isFetching && !isLoading && (
            <span className="animate-pulse flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Đang cập
              nhật...
            </span>
          )}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Trang {table.getState().pagination.pageIndex + 1} /{" "}
              {pageCount > 0 ? pageCount : 1}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
