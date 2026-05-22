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

export type HeaderNavAppearance = "overlay" | "solid-light" | "solid-dark";

function isNavLinkActive(pathname: string, search: string, to: string) {
  const qIndex = to.indexOf("?");
  const toPath = qIndex >= 0 ? to.slice(0, qIndex) : to;
  const toQuery = qIndex >= 0 ? to.slice(qIndex + 1) : "";

  const pathMatch =
    pathname === toPath ||
    (toPath !== "/" && pathname.startsWith(toPath));

  if (!pathMatch) return false;
  if (!toQuery) return true;

  const expected = new URLSearchParams(toQuery);
  const actual = new URLSearchParams(search);
  for (const [key, value] of expected.entries()) {
    if (actual.get(key) !== value) return false;
  }
  return true;
}

type MenuItemProps = {
  setActive: (item: string | null) => void;
  active: string | null;
  item: string;
  to: string;
  appearance?: HeaderNavAppearance;
  children?: React.ReactNode;
};

export const MenuItem: React.FC<MenuItemProps> = ({
  setActive,
  active,
  item,
  to,
  appearance = "solid-light",
  children,
}) => {
  const location = useLocation();

  const isPageActive = isNavLinkActive(
    location.pathname,
    location.search,
    to,
  );

  const isDropdownOpen = active === item;
  const isHover = isDropdownOpen;

  const isOverlay = appearance === "overlay";
  const useLightNavText = isOverlay || appearance === "solid-dark";

  /** Overlay: chữ trắng; mục đang chọn → cam (không gạch dưới). Nền sáng: đen / cam. */
  const labelTone = isPageActive
    ? "!text-[#ff6600]"
    : useLightNavText
      ? "!text-white"
      : "!text-black";

  const underlineTone = "!bg-[#ff6600]";
  const showUnderline = !isPageActive;

  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <Link to={to} className="block group/menuitem">
        <motion.div
          transition={{ duration: 0.2 }}
          className="relative py-1"
        >
          <span
            className={`relative inline-block cursor-pointer pb-1 text-[13px] uppercase tracking-wide transition-[color,opacity,font-weight] ${labelTone} ${
              isPageActive
                ? "font-bold opacity-100"
                : "font-medium opacity-70 hover:opacity-100"
            }`}
          >
            {item}
            {showUnderline ? (
              <span
                aria-hidden
                className={`pointer-events-none absolute inset-x-0 bottom-0 block h-[2px] w-full rounded-full origin-left transform-gpu transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${underlineTone} scale-x-0 group-hover/menuitem:scale-x-100 ${isHover ? "scale-x-100" : ""}`}
              />
            ) : null}
          </span>
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
              className="rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-xl backdrop-blur-md"
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
  /** SPA route (ưu tiên). */
  to: string;
  src: string;
};

export const ProductItem: React.FC<ProductItemProps> = ({
  title,
  description,
  to,
  src,
}) => {
  return (
    <Link
      to={to}
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
    </Link>
  );
};

type HoveredLinkProps = {
  children: React.ReactNode;
  to?: string;
  href?: string;
  className?: string;
};

export const HoveredLink: React.FC<HoveredLinkProps> = ({
  children,
  to,
  href,
  className = "",
}) => {
  const tone =
    "text-neutral-700 dark:text-neutral-200 hover:text-[#ff6600] transition-colors";

  if (to) {
    return (
      <Link to={to} className={`${tone} ${className}`.trim()}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href ?? "#"} className={`${tone} ${className}`.trim()}>
      {children}
    </a>
  );
};

