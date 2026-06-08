import React, { ReactNode } from "react";

interface LegacyModuleWrapperProps {
  children: ReactNode;
}

export function LegacyModuleWrapper({ children }: LegacyModuleWrapperProps) {
  return (
    <div className="admin-legacy-wrapper min-h-[calc(100vh-8rem)] w-full">
      <style>
        {`
          /* Automatically tone down legacy container paddings or backgrounds if they clash */
          .admin-legacy-wrapper > div {
             background: transparent !important;
             box-shadow: none !important;
             border: none !important;
          }
          /* Ensure legacy tables map perfectly to light/dark themes */
          .admin-legacy-wrapper table {
             background-color: var(--color-slate-50);
             color: var(--color-slate-800);
          }
          .theme-dark .admin-legacy-wrapper table {
             background-color: var(--color-slate-900);
             color: var(--color-slate-300);
          }
          .admin-legacy-wrapper th {
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
          }
        `}
      </style>
      {/* We add a subtle padding wrapper around the legacy content 
          so it aligns well with AdminDashboard margins */}
      <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-2 sm:p-6 transition-colors">
        {children}
      </div>
    </div>
  );
}
