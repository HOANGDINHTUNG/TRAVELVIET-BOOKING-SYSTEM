import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  MapPin,
  Plane,
  Hotel,
  CreditCard,
  Users,
  Settings,
  Package,
  ChevronDown,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  useAuthStore,
  selectCurrentUser,
  getRoleCodes,
} from "../../../stores/authStore";

interface AdminSidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard, roles: [] },
  {
    name: "Quản lý Điểm đến",
    path: "/admin/destinations",
    icon: MapPin,
    roles: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"],
  },
  {
    name: "Quản lý Tour",
    path: "/admin/tours",
    icon: Package,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "CONTENT_EDITOR",
      "FIELD_STAFF",
      "OPERATOR",
    ],
  },
  {
    name: "Quản lý Khách sạn",
    path: "/admin/hotels",
    icon: Hotel,
    roles: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"],
  },
  {
    name: "Quản lý Combo",
    path: "/admin/combos",
    icon: Package,
    roles: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"],
  },
  {
    name: "Quản lý Chuyến bay",
    path: "/admin/flights",
    icon: Plane,
    roles: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"],
  },
  {
    name: "Đơn hàng (Bookings)",
    path: "/admin/bookings",
    icon: CreditCard,
    roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR", "FIELD_STAFF"],
  },
  {
    name: "Khách hàng",
    path: "/admin/users",
    icon: Users,
    roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR"],
  },
  {
    name: "Cài đặt hệ thống",
    path: "/admin/settings",
    icon: Settings,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
];

export default function AdminSidebar({
  isOpen,
  isMobile,
  onClose,
}: AdminSidebarProps) {
  const sidebarWidth = isOpen ? 260 : 80;

  const user = useAuthStore(selectCurrentUser);
  const userRoles = getRoleCodes(user);

  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.some((r) => userRoles.includes(r));
  });

  return (
    <motion.aside
      initial={{ width: isMobile ? 260 : sidebarWidth, x: isMobile ? -260 : 0 }}
      animate={{
        width: isMobile ? 260 : sidebarWidth,
        x: isMobile && !isOpen ? -260 : 0,
      }}
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
      className={cn(
        "h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm shrink-0",
        isMobile ? "w-[260px]" : "",
      )}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src="https://res.cloudinary.com/dmzvum1lp/image/upload/v1779857558/Gemini_Generated_Image_1d6lmg1d6lmg1d6l-removebg-preview_poqjd0.png"
            alt="TravelViet Logo"
            className="h-8 w-auto shrink-0"
          />
          {isOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-xl whitespace-nowrap text-slate-800 dark:text-white"
            >
              TravelViet
            </motion.span>
          )}
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        <nav className="flex flex-col gap-1 px-3">
          {filteredMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-medium"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200",
                )
              }
            >
              <item.icon size={20} className="shrink-0" />
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}
              {/* Hover tooltip for collapsed state */}
              {!isOpen && !isMobile && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Profile Area (Optional) */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div
          className={cn("flex items-center gap-3", !isOpen && "justify-center")}
        >
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
            alt="Admin"
            className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 shrink-0"
          />
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col overflow-hidden"
            >
              <span className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">
                System Admin
              </span>
              <span className="text-xs text-slate-500 truncate">
                admin@travelviet.com
              </span>
            </motion.div>
          )}
        </div>
        {isOpen && (
          <NavLink
            to="/"
            className="mt-3 flex items-center justify-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
          >
            Quay về trang chủ
          </NavLink>
        )}
      </div>
    </motion.aside>
  );
}
