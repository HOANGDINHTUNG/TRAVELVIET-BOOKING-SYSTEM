"use client";

import React from "react";
import { motion, type Transition } from "motion/react";
import { Link, useLocation } from "react-router-dom";

const springTransition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

type MenuItemProps = {
  setActive: (item: string | null) => void;
  active: string | null;
  item: string;
  to: string;
  children?: React.ReactNode;
};

export const MenuItem: React.FC<MenuItemProps> = ({
  setActive,
  active,
  item,
  to,
  children,
}) => {
  const location = useLocation();

  const isPageActive =
    location.pathname === to || (to !== "/" && location.pathname.startsWith(to));

  const isDropdownOpen = active === item;
  const isHover = isDropdownOpen;

  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      {/* Label chính + sliding underline (Movizone DNA) */}
      <Link to={to} className="block group/menuitem">
        <motion.div
          transition={{ duration: 0.2 }}
          className="relative flex flex-col items-center py-1"
        >
          <span
            className={`relative cursor-pointer text-[13px] uppercase tracking-wide transition-colors ${
              isPageActive
                ? "font-semibold opacity-100"
                : "opacity-80 hover:opacity-100"
            }`}
          >
            {item}
          </span>

          {/* Sliding underline: scale-x 0 -> 1 từ giữa khi hover/active */}
          <span
            className={`pointer-events-none mt-1 block h-[2px] rounded-full bg-[#ff6600] origin-center transform-gpu transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isPageActive ? "w-12 scale-x-100" : "w-12 scale-x-0"
            } group-hover/menuitem:scale-x-100 ${isHover ? "scale-x-100" : ""}`}
          />
        </motion.div>
      </Link>

      {/* Dropdown */}
      {isDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 10 }}
          transition={springTransition}
        >
          <div className="absolute top-[105%] left-1/2 -translate-x-1/2 pt-1 z-50">
            <motion.div
              layoutId="active-menu-dropdown"
              transition={springTransition}
              className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/20 dark:border-white/20 shadow-xl"
            >
              <motion.div layout className="w-max h-full p-4">
                {children}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

type MenuProps = {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
};

export const Menu: React.FC<MenuProps> = ({ setActive, children }) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative flex items-center gap-8"
    >
      {children}
    </nav>
  );
};

type ProductItemProps = {
  title: string;
  description: string;
  href: string;
  src: string;
};

export const ProductItem: React.FC<ProductItemProps> = ({
  title,
  description,
  href,
  src,
}) => {
  return (
    <a
      href={href}
      className="
        group flex space-x-3 rounded-lg p-2 transition-all duration-300
        hover:bg-neutral-100 dark:hover:bg-neutral-800/70
        hover:shadow-lg cursor-pointer
      "
    >
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        className="
          shrink-0 rounded-md shadow-xl transition-transform duration-300
          group-hover:scale-[1.03]
        "
      />
      <div className="flex flex-col justify-center">
        <h4
          className="
            text-xl font-bold mb-1 text-black dark:text-white
            transition-colors duration-300
            group-hover:text-[#ff6600]
          "
        >
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-40 dark:text-neutral-300">
          {description}
        </p>
      </div>
    </a>
  );
};

type HoveredLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode;
};

export const HoveredLink: React.FC<HoveredLinkProps> = ({
  children,
  ...rest
}) => {
  return (
    <a
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 hover:text-red-700"
    >
      {children}
    </a>
  );
};

