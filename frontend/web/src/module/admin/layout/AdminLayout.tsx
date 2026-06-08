import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { AdminErrorBoundary } from "../core/components/AdminErrorBoundary";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev);

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        isMobile={false}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            />
            <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
              <AdminSidebar
                isOpen={true}
                isMobile={true}
                onClose={() => setIsMobileOpen(false)}
              />
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminHeader
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          toggleMobileSidebar={toggleMobileSidebar}
        />
        {/* MAIN CONTENT AREA */}
        <main className="flex-1 w-full bg-slate-50 dark:bg-slate-900 border-t border-l border-slate-200 dark:border-slate-800 rounded-tl-3xl shadow-inner relative overflow-hidden transition-colors">
          <div className="absolute inset-0 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
            <AdminErrorBoundary>
              <Outlet
                context={{
                  accessContext: { isSuperAdmin: true, permissions: [] },
                }}
              />
            </AdminErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
