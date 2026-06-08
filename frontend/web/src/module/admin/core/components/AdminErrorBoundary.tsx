import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class AdminErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: "",
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-[60vh] flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 font-sans">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shrink-0">
              <AlertTriangle size={32} strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Đã có lỗi xảy ra!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
              Hệ thống giao diện không thể tải tài nguyên của module này. Vui
              lòng ấn tải lại hoặc chuyển qua trang khác bên Menu trái.
            </p>

            {this.state.errorMessage && (
              <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg text-left overflow-hidden">
                <p className="text-xs font-mono text-red-600 dark:text-red-400 break-words">
                  {this.state.errorMessage}
                </p>
              </div>
            )}

            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              <RefreshCcw size={16} /> Thử lại ngay
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
