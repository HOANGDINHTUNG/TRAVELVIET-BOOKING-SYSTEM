"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
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

function useNavLabelTone(
  appearance: HeaderNavAppearance,
  isPageActive: boolean,
) {
  const isOverlay = appearance === "overlay";
  const useLightNavText = isOverlay || appearance === "solid-dark";

  const labelTone = isPageActive
    ? "!text-[#ff6600]"
    : useLightNavText
      ? "!text-white"
      : "!text-[var(--color-text)]";

  return { labelTone, underlineTone: "!bg-[#ff6600]" };
}

type SimpleNavItemProps = {
  item: string;
  to: string;
  appearance?: HeaderNavAppearance;
};

/** Mục điều hướng phẳng (không dropdown) — Home, Package Tour, … */
export const SimpleNavItem: React.FC<SimpleNavItemProps> = ({
  item,
  to,
  appearance = "solid-light",
}) => {
  const location = useLocation();
  const isPageActive = isNavLinkActive(
    location.pathname,
    location.search,
    to,
  );
  const { labelTone, underlineTone } = useNavLabelTone(appearance, isPageActive);

  return (
    <Link to={to} className="group/navitem block">
      <span
        className={`relative inline-flex cursor-pointer items-center whitespace-nowrap pb-1 text-[12px] font-semibold tracking-[0.01em] transition-[color,opacity] lg:text-[12.5px] xl:text-[13px] ${labelTone} ${
          isPageActive
            ? "opacity-100"
            : "opacity-80 hover:opacity-100"
        }`}
      >
        {item}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 block h-[2px] w-full origin-left rounded-full transform-gpu transition-transform duration-300 ease-out ${underlineTone} ${
            isPageActive
              ? "scale-x-100"
              : "scale-x-0 group-hover/navitem:scale-x-100"
          }`}
        />
      </span>
    </Link>
  );
};

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
  const { labelTone, underlineTone } = useNavLabelTone(
    appearance,
    isPageActive || isDropdownOpen,
  );

  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <Link to={to} className="group/menuitem block">
        <span
          className={`relative inline-flex cursor-pointer items-center gap-1 whitespace-nowrap pb-1 text-[12px] font-semibold tracking-[0.01em] transition-[color,opacity] lg:text-[12.5px] xl:text-[13px] ${labelTone} ${
            isPageActive || isDropdownOpen
              ? "opacity-100"
              : "opacity-80 hover:opacity-100"
          }`}
        >
          {item}
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
            aria-hidden
          />
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 bottom-0 block h-[2px] w-full origin-left rounded-full transform-gpu transition-transform duration-300 ease-out ${underlineTone} ${
              isPageActive || isDropdownOpen
                ? "scale-x-100"
                : "scale-x-0 group-hover/menuitem:scale-x-100"
            }`}
          />
        </span>
      </Link>

      {isDropdownOpen && children ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 8 }}
          transition={springTransition}
          className="absolute top-[calc(100%+6px)] left-1/2 z-[1100] -translate-x-1/2 pt-1"
        >
          <div className="min-w-[220px] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-xl shadow-black/10 backdrop-blur-md">
            <div className="p-3">{children}</div>
          </div>
        </motion.div>
      ) : null}
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
      className="relative z-[1001] flex flex-nowrap items-center gap-x-2 md:gap-x-2.5 lg:gap-x-3.5 xl:gap-x-5"
    >
      {children}
    </nav>
  );
};

type ProductItemProps = {
  title: string;
  description: string;
  to: string;
  src: string;
  /** Giữ skeleton (ảnh + dòng chữ) khi BE chưa sẵn sàng hoặc đang tải. */
  forceLoading?: boolean;
};

export const ProductItem: React.FC<ProductItemProps> = ({
  title,
  description,
  to,
  src,
  forceLoading = false,
}) => {
  const [imageReady, setImageReady] = React.useState(false);
  const [imageFailed, setImageFailed] = React.useState(false);
  const hasText = title.trim().length > 0 && description.trim().length > 0;
  const canLoadImage = !forceLoading && src.trim().length > 0;
  const showTextSkeleton = forceLoading || !hasText;
  const showImageSkeleton =
    forceLoading || (canLoadImage && !imageReady && !imageFailed);

  const markImageLoaded = React.useCallback(() => {
    setImageReady(true);
    setImageFailed(false);
  }, []);

  const markImageFailed = React.useCallback(() => {
    setImageFailed(true);
    setImageReady(false);
  }, []);

  const handleImageRef = React.useCallback(
    (node: HTMLImageElement | null) => {
      if (!node || !canLoadImage) return;
      if (node.complete && node.naturalWidth > 0) {
        markImageLoaded();
      }
    },
    [canLoadImage, markImageLoaded],
  );

  React.useEffect(() => {
    setImageReady(false);
    setImageFailed(false);
  }, [src, forceLoading]);

  return (
    <Link
      to={to}
      className="group flex space-x-3 rounded-lg p-2 transition-all duration-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 hover:shadow-lg cursor-pointer"
    >
      <div className="relative h-[70px] w-[140px] shrink-0 overflow-hidden rounded-md shadow-xl">
        {canLoadImage && !imageFailed ? (
          <img
            ref={handleImageRef}
            src={src}
            width={140}
            height={70}
            alt={title}
            onLoad={markImageLoaded}
            onError={markImageFailed}
            className={`h-full w-full object-cover transition-[transform,opacity] duration-300 group-hover:scale-[1.03] ${
              imageReady ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : null}
        {showImageSkeleton ? (
          <div
            aria-hidden
            className="absolute inset-0 animate-pulse bg-neutral-200 dark:bg-neutral-700"
          />
        ) : null}
      </div>
      <div className="flex flex-col justify-center">
        {showTextSkeleton ? (
          <div className="w-40 space-y-2" aria-hidden>
            <div className="h-4 w-28 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-3 w-36 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-3 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
          </div>
        ) : (
          <>
            <h4 className="mb-1 text-xl font-bold text-black transition-colors duration-300 group-hover:text-[#ff6600] dark:text-white">
              {title}
            </h4>
            <p className="max-w-40 text-sm text-neutral-700 dark:text-neutral-300">
              {description}
            </p>
          </>
        )}
      </div>
    </Link>
  );
};

type HoveredLinkProps = {
  children: React.ReactNode;
  to?: string;
  href?: string;
  className?: string;
  /** Giữ skeleton thay chữ khi BE chưa sẵn sàng. */
  forceLoading?: boolean;
  /** Độ rộng thanh skeleton (Tailwind width class). */
  skeletonWidthClass?: string;
};

export function DropdownSectionHeading({
  children,
  forceLoading = false,
  className = "",
}: {
  children: React.ReactNode;
  forceLoading?: boolean;
  className?: string;
}) {
  if (forceLoading) {
    return (
      <div className={`px-2 pb-1 ${className}`.trim()} aria-hidden>
        <div className="h-2.5 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
      </div>
    );
  }

  return (
    <p
      className={`px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 ${className}`.trim()}
    >
      {children}
    </p>
  );
}

export const HoveredLink: React.FC<HoveredLinkProps> = ({
  children,
  to,
  href,
  className = "",
  forceLoading = false,
  skeletonWidthClass = "w-36",
}) => {
  const tone =
    "block rounded-md px-2 py-1.5 text-[13px] font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 hover:text-[#ff6600] dark:hover:bg-neutral-800/70 transition-colors";

  if (forceLoading) {
    return (
      <span
        className={`block rounded-md px-2 py-1.5 ${className}`.trim()}
        aria-hidden
      >
        <span
          className={`block h-3.5 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700 ${skeletonWidthClass}`}
        />
      </span>
    );
  }

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
