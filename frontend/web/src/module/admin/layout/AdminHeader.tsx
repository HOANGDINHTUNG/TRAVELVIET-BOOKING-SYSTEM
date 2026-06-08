import React from "react";
import {
  Menu,
  Bell,
  Search,
  Globe,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import { cn } from "../../../lib/utils";

interface AdminHeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
}

export default function AdminHeader({
  sidebarOpen,
  toggleSidebar,
  toggleMobileSidebar,
}: AdminHeaderProps) {
  const [isDark, setIsDark] = React.useState(false); // In reality, bind this to global theme state

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="h-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 lg:hidden rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu size={20} />
        </button>
        <button
          onClick={toggleSidebar}
          className="p-2 hidden lg:block rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Global Search */}
        <div className="hidden md:flex items-center relative">
          <Search size={18} className="absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nhanh (Ctrl+K)..."
            className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-blue-500/50 outline-none w-64 transition-all focus:w-80 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex">
          <Globe size={20} />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

        <button className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
            alt="Profile"
            className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 dark:border-slate-700"
          />
          <ChevronDown size={16} className="text-slate-500" />
        </button>
      </div>
    </header>
  );
}
