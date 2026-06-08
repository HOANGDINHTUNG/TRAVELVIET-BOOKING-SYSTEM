import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, AlertTriangle } from "lucide-react";

export interface ConfirmActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  isLoading?: boolean;
  confirmButtonClass?: string;
  iconClass?: string;
}

export function ConfirmActionDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isLoading = false,
  confirmButtonClass = "bg-red-600 hover:bg-red-700 text-white",
  iconClass = "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-500",
}: ConfirmActionDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Backdrop (Glass style) */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Modal Window */}
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-xl rounded-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 leading-normal">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-full shrink-0 flex items-center justify-center ${iconClass}`}
            >
              <AlertTriangle size={24} strokeWidth={2.5} />
            </div>
            <div className="space-y-2 mt-1">
              <Dialog.Title className="text-[17px] font-semibold leading-none tracking-tight text-slate-900 dark:text-zinc-100">
                {title}
              </Dialog.Title>
              <Dialog.Description className="text-[14px] text-slate-500 dark:text-slate-400">
                {description}
              </Dialog.Description>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 mt-5">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => onOpenChange(false)}
              className="mt-2 sm:mt-0 inline-flex h-10 w-full sm:w-auto items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className={`inline-flex h-10 w-full sm:w-auto items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${confirmButtonClass}`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang xử lý
                </span>
              ) : (
                "Xác nhận"
              )}
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none disabled:opacity-50"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Đóng</span>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
