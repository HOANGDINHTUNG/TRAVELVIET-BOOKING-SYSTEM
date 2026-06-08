import React, { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Flight } from "../api/flights.api";
import { Edit2, MoreHorizontal, PlaneTakeoff, Clock } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const ActionCell = ({
  flight,
  onEdit,
}: {
  flight: Flight;
  onEdit: (d: Flight) => void;
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
          className="w-40 z-50 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-xl animate-in fade-in-80 font-sans"
        >
          <DropdownMenu.Item
            onClick={() => onEdit(flight)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm font-bold cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md focus:bg-slate-50 dark:focus:outline-none transition-colors"
          >
            <Edit2 size={16} className="text-slate-400" /> Sửa chuyến bay
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export const getFlightColumns = (
  onEdit: (d: Flight) => void,
): ColumnDef<Flight>[] => [
  {
    accessorKey: "airlineName",
    header: "Hãng Hàng Không",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">
          {row.original.airlineName || `Airline #${row.original.airlineId}`}
        </span>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 self-start px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
          Chuyến bay:{" "}
          <span className="text-indigo-600 dark:text-indigo-400">
            {row.original.flightNo}
          </span>
        </span>
      </div>
    ),
  },
  {
    id: "route",
    header: "Lộ Trình Thời Gian",
    cell: ({ row }) => {
      const formatTime = (iso: string) => {
        if (!iso) return "N/A";
        return new Date(iso).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
      };

      const formatDate = (iso: string) => {
        if (!iso) return "";
        return new Date(iso).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        });
      };

      return (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800 min-w-[200px]">
            <div className="flex flex-col items-center">
              <span className="text-base font-black text-slate-800 dark:text-slate-200">
                {formatTime(row.original.departureTimeLocal)}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {row.original.originAirportCode}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 relative px-2">
              <div className="w-full h-px border-t-2 border-dashed border-indigo-200 dark:border-indigo-800/50 relative"></div>
              <PlaneTakeoff
                size={14}
                className="text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 dark:bg-[#151c2c] px-0.5"
              />
              <div className="text-[10px] whitespace-nowrap text-slate-400 mt-2 font-medium flex items-center gap-1">
                <Clock size={10} />{" "}
                {Math.floor(row.original.durationMinutes / 60)}h
                {row.original.durationMinutes % 60}m
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-base font-black text-slate-800 dark:text-slate-200">
                {formatTime(row.original.arrivalTimeLocal)}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {row.original.destinationAirportCode}
              </span>
            </div>
          </div>
          <div className="text-xs font-semibold text-slate-500">
            {formatDate(row.original.departureTimeLocal)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng Thái",
    cell: ({ row }) => {
      const status = row.original.status || "SCHEDULED";
      const isOk = status === "SCHEDULED" || status === "ON_TIME";
      return (
        <span
          className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-full border ${isOk ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30" : "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30"}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="text-right pr-2">
        <ActionCell flight={row.original} onEdit={onEdit} />
      </div>
    ),
  },
];
