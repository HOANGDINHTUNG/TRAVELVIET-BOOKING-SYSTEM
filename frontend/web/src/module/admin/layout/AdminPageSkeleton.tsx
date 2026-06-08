import React from "react";

export default function AdminPageSkeleton() {
  return (
    <div className="space-y-6 max-w-full pb-8 pt-4 px-2 w-full animate-pulse">
      {/* Skeleton Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-4 w-72 bg-slate-100 dark:bg-slate-800/60 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="h-10 w-full sm:w-64 bg-slate-100 dark:bg-slate-800/80 rounded-lg" />
          <div className="h-10 w-28 bg-slate-200 dark:bg-slate-700/50 rounded-lg hidden sm:block" />
        </div>
      </div>

      {/* Skeleton Table Area */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center border-b border-slate-100 dark:border-slate-800 p-4">
          <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded mr-auto" />
          <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded mx-4" />
          <div className="h-4 w-1/6 bg-slate-200 dark:bg-slate-800 rounded mx-4" />
          <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded ml-4" />
        </div>

        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center border-b border-slate-50 dark:border-slate-800/50 p-4"
          >
            <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-full mr-4 shrink-0" />
            <div className="space-y-2 mr-auto w-1/3">
              <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded" />
              <div className="h-3 w-2/3 bg-slate-50 dark:bg-slate-800/50 rounded" />
            </div>
            <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded-full mx-4" />
            <div className="h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded-full ml-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
