MOVIZONE-Style UI/UX Replication Guide



Mục tiêu: Tài liệu này gói trọn 3 "linh hồn" của giao diện kiểu Movizone:





Header Glassmorphism (top trong suốt ↔ scroll compact + backdrop-blur).



BannerHome Cinematic (Hero 100vh + overlay gradient + typography đậm + stagger fade-up).



Momentum Scroll (cuộn có đà bằng lerp + Parallax GSAP ScrollTrigger scrub 1.5).

Bất kỳ dự án React 19 + Tailwind v4 nào (TravelViet, MovieApp, BlogSite, ShopUI...) đều có thể copy y nguyên các file dưới đây vào, kết nối với dữ liệu của mình và có ngay giao diện đúng "DNA" Movizone.



📋 Mục lục





Stack & Dependencies



Cấu trúc file đề xuất



SmoothScrollLayout.tsx — Momentum scroll



navbar-menu.tsx — Menu primitives + sliding underline



Header.tsx — Glassmorphism động



BannerHome.tsx — Cinematic Hero 100vh



App.tsx — Cách lắp ráp



index.css — Tailwind v4 + dark mode + font Oswald



Data adapter — Áp dụng cho dự án bất kỳ



Customization & Tham số tinh chỉnh



Troubleshooting thường gặp



1. Stack & Dependencies







Mục



Phiên bản tối thiểu



Ghi chú





react



^19.0.0



Cần concurrent features





react-dom



^19.0.0









react-router-dom



^7.0.0



Cho Link, useNavigate





tailwindcss



^4.1.0



Dùng @theme inline, @custom-variant dark





@tailwindcss/vite



^4.1.0



Plugin Vite





gsap



^3.13.0



Đã có ScrollTrigger built-in





motion



^12.0.0



Tên gói mới của Framer Motion





react-icons



^5.0.0 (tùy chọn)



Icon menu mobile

Lệnh cài đặt nhanh:

npm install react@^19 react-dom@^19 react-router-dom@^7 \
            tailwindcss@^4.1 @tailwindcss/vite@^4.1 \
            gsap@^3.13 motion@^12 react-icons

Lưu ý: Tailwind v4 không còn tailwind.config.js mặc định. Mọi token đặt trong index.css qua @theme inline { ... }.



2. Cấu trúc file đề xuất

src/
├─ App.tsx
├─ main.tsx
├─ index.css
├─ assets/
│  └─ logo.png
└─ components/
   ├─ common/
   │  └─ ux/
   │     └─ SmoothScrollLayout.tsx
   ├─ header/
   │  ├─ Header.tsx
   │  └─ ui/
   │     └─ navbar-menu.tsx
   └─ hero/
      └─ BannerHome.tsx



Đường dẫn có thể tùy ý. Quan trọng là 4 file: SmoothScrollLayout, navbar-menu, Header, BannerHome.



3. SmoothScrollLayout.tsx — Momentum scroll

Vai trò: Wrap toàn bộ <main> để mọi cú cuộn đều có cảm giác "có đà" — cuộn xong nội dung vẫn trôi thêm một chút rồi mới dừng hẳn. Đồng thời tự đồng bộ ScrollTrigger để parallax luôn bám đúng vị trí.

Kỹ thuật:





Page giữ scroll thật trên window (để link #anchor, ScrollTrigger, focus... hoạt động bình thường).



Body có height = content.scrollHeight để window.scrollY đúng.



Nội dung được wrap trong một <div fixed inset-0 overflow-hidden>, bên trong là <div> được translate3d theo hàm lerp (current += (target - current) * ease).



ease = 0.08 (gợi ý 0.06–0.12) cho cảm giác Movizone-chuẩn.

Code đầy đủ — copy 1:1 vào dự án:

// src/components/common/ux/SmoothScrollLayout.tsx
//
// Momentum / Inertia scroll (Movizone DNA):
// - Trang giữ scroll thật trên `window` (để ScrollTrigger / anchor link... vẫn hoạt động)
// - Nội dung được translate3d theo hàm lerp -> tạo cảm giác "có đà": cuộn rồi
//   nội dung vẫn trôi thêm một chút trước khi dừng hẳn.
// - Khi content height đổi (route mới, ảnh lazy load) -> tự refresh
//   ScrollTrigger để parallax bám đúng điểm trigger.

import React, { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollLayoutProps {
  children: React.ReactNode;
  /**
   * Độ mượt (0–1).
   * Càng nhỏ thì trôi càng lâu, cảm giác có nhiều "đà" hơn.
   * Gợi ý: 0.06 – 0.12 (Movizone style)
   */
  ease?: number;
}

const SmoothScrollLayout: React.FC<SmoothScrollLayoutProps> = ({
  children,
  ease = 0.08,
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const current = useRef(0);
  const target = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const content = contentRef.current;

    if (!content) return;

    html.style.scrollBehavior = "auto";
    body.style.overflow = "auto";

    const setBodyHeight = () => {
      const h = content.scrollHeight;
      body.style.height = `${h}px`;
      ScrollTrigger.refresh();
    };

    setBodyHeight();

    const resizeObserver = new ResizeObserver(() => {
      setBodyHeight();
    });
    resizeObserver.observe(content);
    window.addEventListener("resize", setBodyHeight);

    const onScroll = () => {
      target.current = window.scrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    content.style.willChange = "transform";

    const smoothScroll = () => {
      current.current += (target.current - current.current) * ease;
      if (Math.abs(target.current - current.current) < 0.1) {
        current.current = target.current;
      }
      const y = Math.round(current.current * 100) / 100;
      content.style.transform = `translate3d(0, -${y}px, 0)`;
      rafId.current = window.requestAnimationFrame(smoothScroll);
    };

    smoothScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", setBodyHeight);
      resizeObserver.disconnect();
      if (rafId.current) cancelAnimationFrame(rafId.current);

      body.style.height = "";
      body.style.overflow = "";
      html.style.scrollBehavior = "";
      content.style.transform = "";
      content.style.willChange = "";
    };
  }, [ease]);

  return (
    <div className="fixed inset-0 w-full overflow-hidden">
      <div ref={contentRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
};

export default SmoothScrollLayout;



4. navbar-menu.tsx — Menu primitives + sliding underline

Vai trò: Bộ primitive dùng cho thanh menu desktop:





<Menu>: container có onMouseLeave clear active state.



<MenuItem>: 1 mục menu, hiển thị sliding underline màu vàng #ecad29 khi hover / khi page active / khi dropdown đang mở. Underline scale từ 0 → 1 theo trục X với cubic-bezier(0.22,1,0.36,1) 500ms.



<ProductItem>: card nhỏ trong dropdown (ảnh + tiêu đề + mô tả).



<HoveredLink>: link đơn giản dùng trong dropdown.

Code đầy đủ:

// src/components/header/ui/navbar-menu.tsx
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
    location.pathname === to ||
    (to !== "/" && location.pathname.startsWith(to));

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
            className={`pointer-events-none mt-1 block h-[2px] rounded-full bg-[#ecad29] origin-center transform-gpu transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isPageActive ? "w-12 scale-x-100" : "w-12 scale-x-0"
            } group-hover/menuitem:scale-x-100 ${
              isHover ? "scale-x-100" : ""
            }`}
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
            group-hover:text-yellow-500
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



5. Header.tsx — Glassmorphism động

Vai trò: Header position: fixed overlay lên Hero.







State



Background



Padding (py)



Logo size



Text color



Shadow





Top



bg-transparent (text-shadow đảm bảo contrast)



py-3.5



48px



text-white



none





Scrolled



bg-white/70 dark:bg-neutral-950/65 backdrop-blur-md



py-1.5



36px



text-neutral-900 dark:text-white



shadow-sm

Logic:





scrolled = scrollY > 24.



Ẩn header khi cuộn xuống nhanh, hiện khi cuộn lên (DEADZONE 2px).



Transition tất cả thuộc tính dùng cubic-bezier(0.22,1,0.36,1) duration 500ms.

Phiên bản generic (đã tách khỏi auth/search/i18n của project gốc) — sẵn sàng dùng cho dự án bất kỳ:

// src/components/header/Header.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, MenuItem, HoveredLink } from "./ui/navbar-menu";

// === CẤU HÌNH BRAND (đổi theo dự án) ===========================
const BRAND = {
  logoSrc: "/assets/logo.png",
  name: "YourBrand",
  tagline: "Tagline • Dòng phụ • Của brand",
};

// === CẤU HÌNH MENU (đổi theo dự án) ============================
// Mỗi item: { label, to, dropdown?: ReactNode }
type NavItemConfig = {
  label: string;
  to: string;
  dropdown?: React.ReactNode;
};

const NAV_ITEMS: NavItemConfig[] = [
  {
    label: "Home",
    to: "/",
    dropdown: (
      <div className="flex flex-col space-y-3 text-sm">
        <HoveredLink href="/">Trang chủ</HoveredLink>
        <HoveredLink href="/search">Tìm kiếm nhanh</HoveredLink>
      </div>
    ),
  },
  { label: "Explore", to: "/explore" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showHeader, setShowHeader] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY || window.pageYOffset;

      setScrolled(currentY > 24);

      if (currentY <= 0) {
        setShowHeader(true);
        lastScrollY.current = 0;
        return;
      }

      const diff = currentY - lastScrollY.current;
      const DEADZONE = 2;

      if (diff > DEADZONE) setShowHeader(false);
      else if (diff < -DEADZONE) setShowHeader(true);

      lastScrollY.current = currentY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Glass surface (Movizone DNA)
  const headerSurface = scrolled
    ? "backdrop-blur-md bg-white/70 dark:bg-neutral-950/65 border-b border-black/10 dark:border-white/10 shadow-sm shadow-black/20 text-neutral-900 dark:text-white"
    : "backdrop-blur-0 bg-transparent border-b border-transparent text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.55)]";

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-80 will-change-transform transform-gpu
                   transition-[transform,background-color,backdrop-filter,box-shadow,border-color,color]
                   duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                   ${headerSurface}
                   ${showHeader ? "translate-y-0" : "-translate-y-full"}`}
      >
        {/* ===== NAV DESKTOP ===== */}
        <nav
          className={`mx-auto hidden md:flex max-w-6xl items-center justify-between
                     px-3 sm:px-4 md:px-8 gap-2
                     transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                     ${scrolled ? "py-1.5" : "py-3.5"}`}
        >
          {/* Logo + brand */}
          <Link to="/" className="hidden md:flex items-center gap-2 group">
            <div
              className={`overflow-hidden grid place-items-center
                         transition-[width,height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                         ${scrolled ? "md:w-9 md:h-9" : "md:w-12 md:h-12"}`}
            >
              <img src={BRAND.logoSrc} alt={BRAND.name} className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className={`font-semibold uppercase tracking-[0.18em]
                           transition-[font-size] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                           ${scrolled ? "text-xs sm:text-sm" : "text-xs sm:text-sm md:text-base"}`}
              >
                {BRAND.name}
              </span>
              <span
                className={`text-[10px] sm:text-[11px] overflow-hidden
                           transition-[opacity,max-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                           ${scrolled ? "opacity-0 max-h-0" : "opacity-60 max-h-4 text-current"}`}
              >
                {BRAND.tagline}
              </span>
            </div>
          </Link>

          {/* Menu giữa */}
          <div className="hidden md:flex items-center">
            <Menu setActive={setActiveMenu}>
              {NAV_ITEMS.map((it) => (
                <MenuItem
                  key={it.to}
                  setActive={setActiveMenu}
                  active={activeMenu}
                  item={it.label}
                  to={it.to}
                >
                  {it.dropdown}
                </MenuItem>
              ))}
            </Menu>
          </div>

          {/* Slot phải (CTA / auth / toggles) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="inline-flex items-center rounded-full border border-[#ecad29]/60
                         px-3 py-1.5 text-[12px] font-medium uppercase tracking-wide
                         text-[#ecad29] hover:bg-[#ecad29] hover:text-black transition-colors"
            >
              Login
            </Link>
          </div>
        </nav>

        {/* ===== NAV MOBILE ===== */}
        <nav className="md:hidden px-3 py-2 bg-neutral-950/80 border-b border-neutral-800 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex items-center gap-2 focus:outline-none"
            >
              <img src={BRAND.logoSrc} alt={BRAND.name} className="w-9 h-9 object-contain rounded-md bg-black/40" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                {BRAND.name}
              </span>
            </button>
            <Link to="/login" className="text-[12px] font-semibold uppercase tracking-wide text-[#ecad29]">
              Login
            </Link>
          </div>
        </nav>
      </header>

      {/* ===== MOBILE SLIDE PANEL ===== */}
      {mobileOpen && (
        <div className="fixed inset-0 z-79 bg-black/60 backdrop-blur-sm md:hidden"
             onClick={() => setMobileOpen(false)} />
      )}
      <div className={`fixed inset-y-0 left-0 z-80 w-[78%] max-w-xs
                      bg-neutral-950/95 border-r border-neutral-800 shadow-xl md:hidden
                      transform transition-transform duration-300 ease-out
                      ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 space-y-3 text-white">
          {NAV_ITEMS.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-[13px] font-medium tracking-wide ${
                  isActive
                    ? "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 text-black shadow-md"
                    : "bg-white/5 hover:bg-white/10"
                }`
              }
            >
              {it.label}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}



Tùy biến nhanh:





Đổi BRAND.logoSrc, BRAND.name, BRAND.tagline cho dự án của bạn.



Đổi NAV_ITEMS (có thể thêm dropdown bằng JSX <ProductItem> từ navbar-menu.tsx).



Đổi mã màu #ecad29 (vàng Movizone) sang màu brand của bạn ở các vị trí: underline, login button.



Slot phải (Login) có thể thay bằng UserMenu, LanguageToggle, DarkModeToggle... tùy nhu cầu.



6. BannerHome.tsx — Cinematic Hero 100vh

Vai trò: Hero full-viewport có:





Layout: h-screen min-h-[640px], margin-top âm để chui dưới header.



Overlay gradient system: 2 lớp gradient (trái→phải đổ tối + trên→dưới vignette).



Typography: Font Oswald, text-[40px]/[72px]/[88px], leading-[0.92], tracking-tight, font-bold.



Animation:





Easing chính: power3.out cho mọi tween entry.



Stagger 0.1s giữa meta → title → subtitle → desc → CTA.



Card nhỏ ở góc phải dưới chuyển slide tự động, có pagination + progress bar.



Parallax:





Ảnh nền: yPercent: -30 (30% tốc độ cuộn) với scrub: 1.5.



Text foreground: yPercent: -15 + fade nhẹ → tạo chiều sâu.

Phiên bản generic — KHÔNG phụ thuộc TMDB/Redux. Nhận trực tiếp slides qua props:

// src/components/hero/BannerHome.tsx
import { useRef, useLayoutEffect, type FC } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

// ===== INTERFACE DATA =========================================
// Dự án nào dùng cũng phải map về cấu trúc Slide này.
export interface BannerSlide {
  /** Dòng meta nhỏ trên cùng. VD: "EN • 2024", "Phú Quốc • Tour 5N4Đ" */
  place: string;
  /** Tiêu đề chính (h1). Có thể là chữ hoặc HTML chứa <img> cho logo */
  title: string;
  /** Phụ đề/subtitle */
  subtitle: string;
  /** Mô tả dài (~2-4 dòng) */
  description: string;
  /** URL ảnh nền chất lượng cao (>=1920px) */
  image: string;
  /** Đường dẫn xem chi tiết khi bấm CTA */
  detailPath: string;
  /** (Tùy chọn) URL ảnh logo dùng làm tiêu đề thay chữ */
  logoImage?: string | null;
}

interface BannerHomeProps {
  slides: BannerSlide[];
  /** Số slide tối đa hiển thị, mặc định 6 */
  maxSlides?: number;
  /** Label CTA button, mặc định "Xem chi tiết" */
  ctaLabel?: string;
}

const BannerHome: FC<BannerHomeProps> = ({
  slides: rawSlides,
  maxSlides = 6,
  ctaLabel = "Xem chi tiết",
}) => {
  const navigate = useNavigate();

  const demoRef = useRef<HTMLDivElement | null>(null);
  const demoCardsRef = useRef<HTMLDivElement | null>(null);
  const slideNumbersRef = useRef<HTMLDivElement | null>(null);
  const detailsEvenRef = useRef<HTMLDivElement | null>(null);
  const detailsOddRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const arrowLeftRef = useRef<HTMLDivElement | null>(null);
  const arrowRightRef = useRef<HTMLDivElement | null>(null);

  const slides = rawSlides.slice(0, maxSlides).filter(s => !!s.image);

  useLayoutEffect(() => {
    if (!slides.length) return;

    const demoEl = demoRef.current;
    const demoCardsEl = demoCardsRef.current;
    const slideNumbersEl = slideNumbersRef.current;
    const detailsEvenEl = detailsEvenRef.current;
    const detailsOddEl = detailsOddRef.current;
    const indicatorEl = indicatorRef.current;
    const progressBarEl = progressRef.current;
    const arrowLeft = arrowLeftRef.current;
    const arrowRight = arrowRightRef.current;

    if (!demoEl || !demoCardsEl || !slideNumbersEl ||
        !detailsEvenEl || !detailsOddEl || !indicatorEl || !progressBarEl) return;

    const isMobile = window.innerWidth < 768;
    const ease = "power3.out";  // ===== Movizone DNA easing =====
    const STAGGER = 0.1;        // ===== Movizone DNA stagger =====
    const REVEAL_DURATION = 0.9;

    let isCancelled = false;

    const ctx = gsap.context(() => {
      // Build cards (background) HTML
      const cardsHtml = slides
        .map((s, i) =>
          `<div class="card absolute left-0 top-0 bg-center bg-cover bg-no-repeat shadow-[6px_6px_10px_2px_rgba(0,0,0,0.6)] rounded-xl overflow-hidden"
                id="card${i}" style="background-image:url(${s.image})"></div>`
        ).join("");

      // Build mini card content (gradient + meta + buttons)
      const cardContentsHtml = slides.map((s, i) => `
        <div class="card-content absolute inset-0 text-white/90" id="card-content-${i}">
          <div class="flex h-full w-full items-end">
            <div class="w-full bg-linear-to-t from-black/85 via-black/50 to-transparent p-3 md:p-4">
              <div class="text-[11px] md:text-[13px] font-medium text-white/70">${s.place}</div>
              <div class="mt-1 font-['Oswald',sans-serif] font-semibold text-[15px] md:text-[18px] leading-tight line-clamp-2">${s.title}</div>
              <div class="font-['Oswald',sans-serif] text-[12px] md:text-[14px] text-white/70 leading-tight line-clamp-2">${s.subtitle}</div>
              <div class="text-[11px] md:text-[12px] leading-snug text-white/80 line-clamp-2">${s.description}</div>
              <div class="cta mt-4 flex items-center gap-4 pointer-events-auto">
                <button class="bookmark w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#ecad29] text-white grid place-items-center border-none shadow-[0_8px_18px_rgba(236,173,41,0.5)]">
                  <span class="text-[16px] md:text-[18px] leading-none">★</span>
                </button>
                <button class="discover h-8 md:h-9 px-5 md:px-6 rounded-full border border-white/80 text-[10px] md:text-[11px] uppercase bg-black/30 backdrop-blur tracking-[0.18em] hover:bg-white hover:text-black transition-colors">${ctaLabel}</button>
              </div>
            </div>
          </div>
        </div>`).join("");

      const slideNumbersHtml = slides.map((_, i) =>
        `<div class="item w-[42px] h-[42px] md:w-[50px] md:h-[50px] absolute top-0 left-0 grid place-items-center text-[22px] md:text-[28px] font-bold text-white" id="slide-item-${i}">${i+1}</div>`
      ).join("");

      demoCardsEl.innerHTML = cardsHtml + cardContentsHtml;
      slideNumbersEl.innerHTML = slideNumbersHtml;

      const range = (n: number) => Array(n).fill(0).map((_, j) => j);
      const set = gsap.set;
      const getCard = (i: number) => `#card${i}`;
      const getCardContent = (i: number) => `#card-content-${i}`;
      const getSliderItem = (i: number) => `#slide-item-${i}`;

      function animate(target: gsap.TweenTarget | null, duration: number, props: gsap.TweenVars) {
        if (!target) return Promise.resolve();
        return new Promise<void>(res => {
          gsap.to(target, { ...props, duration, onComplete: () => res() });
        });
      }

      const order = range(slides.length);
      let detailsEven = true;

      // CTA click -> navigate
      demoCardsEl.querySelectorAll<HTMLButtonElement>(".card-content .discover").forEach((btn, i) => {
        btn.addEventListener("click", () => slides[i]?.detailPath && navigate(slides[i].detailPath));
      });
      demoEl.querySelectorAll<HTMLButtonElement>("#details-even .discover, #details-odd .discover").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = order[0];
          if (slides[idx]?.detailPath) navigate(slides[idx].detailPath);
        });
      });

      let offsetTop = 200;
      let offsetLeft = 700;
      const cardWidth = isMobile ? 110 : 130;
      const cardHeight = isMobile ? 170 : 200;
      const gap = 16;
      const numberSize = 50;
      let isAnimating = false;

      function updateDetails(detailsEl: HTMLElement | null, index: number) {
        if (!detailsEl) return;
        const s = slides[index];
        const place = detailsEl.querySelector<HTMLDivElement>(".place-box .text");
        const t1 = detailsEl.querySelector<HTMLDivElement>(".title-1");
        const t2 = detailsEl.querySelector<HTMLDivElement>(".title-2");
        const desc = detailsEl.querySelector<HTMLDivElement>(".desc");
        if (!s || !place || !t1 || !t2 || !desc) return;

        place.innerHTML = s.place;

        if (s.logoImage) {
          t1.innerHTML = `<img src="${s.logoImage}" alt="${s.title.replace(/"/g, """)}"
            class="max-h-[60px] md:max-h-20 w-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]" />`;
        } else {
          t1.textContent = s.title;
        }
        t2.textContent = s.subtitle;
        desc.textContent = s.description;
      }

      function staggerRevealDetails(detailsActive: HTMLElement, baseDelay = 0.25) {
        const sel = detailsActive.querySelectorAll.bind(detailsActive);
        gsap.to(sel(".text"),    { y: 0, opacity: 1, delay: baseDelay + STAGGER * 0, duration: REVEAL_DURATION, ease });
        gsap.to(sel(".title-1"), { y: 0, opacity: 1, delay: baseDelay + STAGGER * 1, duration: REVEAL_DURATION, ease });
        gsap.to(sel(".title-2"), { y: 0, opacity: 1, delay: baseDelay + STAGGER * 2, duration: REVEAL_DURATION, ease });
        gsap.to(sel(".desc"),    { y: 0, opacity: 1, delay: baseDelay + STAGGER * 3, duration: REVEAL_DURATION, ease });
        gsap.to(sel(".cta"),     { y: 0, opacity: 1, delay: baseDelay + STAGGER * 4, duration: REVEAL_DURATION, ease });
      }

      function resetDetailsInitial(detailsEl: HTMLElement) {
        set(detailsEl.querySelectorAll(".text"),    { y: 100, opacity: 0 });
        set(detailsEl.querySelectorAll(".title-1"), { y: 100, opacity: 0 });
        set(detailsEl.querySelectorAll(".title-2"), { y: 100, opacity: 0 });
        set(detailsEl.querySelectorAll(".desc"),    { y: 50,  opacity: 0 });
        set(detailsEl.querySelectorAll(".cta"),     { y: 60,  opacity: 0 });
      }

      function init() {
        const [active, ...rest] = order;
        const detailsActive   = detailsEven ? detailsEvenEl : detailsOddEl;
        const detailsInactive = detailsEven ? detailsOddEl  : detailsEvenEl;
        const { innerHeight: height, innerWidth: width } = window;

        offsetTop  = height - cardHeight - 32;
        offsetLeft = width  - (cardWidth + gap) * rest.length - 32;

        set(getCard(active), { x: 0, y: 0, width, height, borderRadius: 0 });
        set(getCardContent(active), { x: 0, y: 0, opacity: 0 });

        if (detailsActive && detailsInactive) {
          set(detailsActive,   { opacity: 0, zIndex: 22, x: -200 });
          set(detailsInactive, { opacity: 0, zIndex: 12 });
          resetDetailsInitial(detailsInactive);
          resetDetailsInitial(detailsActive);
        }

        set(progressBarEl, { width: 260 * (1 / order.length) * (active + 1) });
        set(indicatorEl, { x: -window.innerWidth });

        if (!isMobile) {
          rest.forEach((i, idx) => {
            const x = offsetLeft + idx * (cardWidth + gap);
            set(getCard(i),        { x, y: offsetTop, width: cardWidth, height: cardHeight, zIndex: 30, borderRadius: 14 });
            set(getCardContent(i), { x, y: offsetTop, zIndex: 40 });
            set(getSliderItem(i),  { x: (idx + 1) * numberSize });
          });
        } else {
          rest.forEach(i => {
            set(getCard(i),        { opacity: 0, pointerEvents: "none" });
            set(getCardContent(i), { opacity: 0, pointerEvents: "none" });
            set(getSliderItem(i),  { opacity: 0 });
          });
          set(slideNumbersEl, { opacity: 0 });
        }

        if (detailsActive) {
          gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: 0.15 });
          staggerRevealDetails(detailsActive, 0.25);
        }

        updateDetails(detailsActive, order[0]);
      }

      function step(): Promise<void> {
        if (isAnimating || isCancelled) return Promise.resolve();
        isAnimating = true;

        return new Promise<void>(resolve => {
          order.push(order.shift() as number);
          detailsEven = !detailsEven;

          const detailsActive   = detailsEven ? detailsEvenEl : detailsOddEl;
          const detailsInactive = detailsEven ? detailsOddEl  : detailsEvenEl;

          updateDetails(detailsActive, order[0]);

          if (detailsActive && detailsInactive) {
            set(detailsActive, { zIndex: 22 });
            gsap.to(detailsActive, { opacity: 1, delay: 0.15, ease });
            staggerRevealDetails(detailsActive, 0.15);
            set(detailsInactive, { zIndex: 12 });
          }

          const [active, ...rest] = order;
          const prv = rest[rest.length - 1];
          const { innerWidth: width, innerHeight: height } = window;
          const offsetTopLocal  = height - cardHeight - 32;
          const offsetLeftLocal = width  - (cardWidth + gap) * rest.length - 32;

          set(getCard(active), { opacity: 1, pointerEvents: "auto" });
          set(getCard(prv), { zIndex: 10 });
          set(getCard(active), { zIndex: 20 });
          gsap.to(getCard(prv), { scale: 1.5, ease });

          gsap.to(getCardContent(active), { opacity: 0, duration: 0.3, ease });
          gsap.to(getSliderItem(active), { x: 0, ease });
          gsap.to(getSliderItem(prv),    { x: -numberSize, ease });
          gsap.to(progressBarEl, { width: 260 * (1 / order.length) * (active + 1), ease });

          gsap.to(getCard(active), {
            x: 0, y: 0, ease, width, height, borderRadius: 0,
            onComplete: () => {
              if (!isMobile) {
                const xNew = offsetLeftLocal + (rest.length - 1) * (cardWidth + gap);
                set(getCard(prv), { x: xNew, y: offsetTopLocal, width: cardWidth, height: cardHeight, zIndex: 30, borderRadius: 14, scale: 1 });
                set(getCardContent(prv), { x: xNew, y: offsetTopLocal, opacity: 1, zIndex: 40 });
                set(getSliderItem(prv), { x: rest.length * numberSize });
              } else {
                set(getCard(prv), { opacity: 0, pointerEvents: "none" });
                set(getCardContent(prv), { opacity: 0, pointerEvents: "none" });
              }

              if (detailsInactive) {
                set(detailsInactive, { opacity: 0 });
                resetDetailsInitial(detailsInactive);
              }
              isAnimating = false;
              resolve();
            },
          });

          if (!isMobile) {
            rest.forEach((i, idx) => {
              if (i !== prv) {
                const xNew = offsetLeftLocal + idx * (cardWidth + gap);
                set(getCard(i), { zIndex: 30 });
                gsap.to(getCard(i), { x: xNew, y: offsetTopLocal, width: cardWidth, height: cardHeight, borderRadius: 14, ease, delay: 0.05 * (idx + 1) });
                gsap.to(getCardContent(i), { x: xNew, y: offsetTopLocal, opacity: 1, zIndex: 40, ease, delay: 0.05 * (idx + 1) });
                gsap.to(getSliderItem(i),  { x: (idx + 1) * numberSize, ease });
              }
            });
          }
        });
      }

      async function loop() {
        while (!isCancelled) {
          const { innerWidth: width } = window;
          await animate(indicatorEl, 2, { x: 0 });
          if (isCancelled) break;
          await animate(indicatorEl, 0.8, { x: width, delay: 0.3 });
          if (isCancelled) break;
          gsap.set(indicatorEl, { x: -width });
          await step();
        }
      }

      function loadImage(src: string) {
        return new Promise<HTMLImageElement>((res, rej) => {
          const img = new Image();
          img.onload = () => res(img);
          img.onerror = rej;
          img.src = src;
        });
      }
      const loadImages = () => Promise.all(slides.map(s => loadImage(s.image)));

      const handleNext = () => { if (!isAnimating && !isCancelled) void step(); };
      const handlePrev = () => {
        if (isAnimating || order.length <= 1 || isCancelled) return;
        const a = order.pop(); if (a !== undefined) order.unshift(a);
        const b = order.pop(); if (b !== undefined) order.unshift(b);
        void step();
      };

      arrowRight?.addEventListener("click", handleNext);
      arrowLeft?.addEventListener("click", handlePrev);

      // ============ PARALLAX (Movizone DNA: scrub 1.5, 30% speed) =============
      const parallaxTriggers: ScrollTrigger[] = [];
      const bg = gsap.to(demoCardsEl, {
        yPercent: -30, ease: "none",
        scrollTrigger: { trigger: demoEl, start: "top top", end: "bottom top", scrub: 1.5, invalidateOnRefresh: true },
      });
      if (bg.scrollTrigger) parallaxTriggers.push(bg.scrollTrigger);

      const textTargets = [detailsEvenEl, detailsOddEl].filter(Boolean) as HTMLElement[];
      if (textTargets.length) {
        const fg = gsap.to(textTargets, {
          yPercent: -15, opacity: 0.85, ease: "none",
          scrollTrigger: { trigger: demoEl, start: "top top", end: "bottom top", scrub: 1.5, invalidateOnRefresh: true },
        });
        if (fg.scrollTrigger) parallaxTriggers.push(fg.scrollTrigger);
      }

      async function start() {
        try {
          await loadImages();
          if (isCancelled) return;
          init();
          ScrollTrigger.refresh();
          await loop();
        } catch (e) { console.error(e); }
      }
      void start();

      return () => {
        arrowRight?.removeEventListener("click", handleNext);
        arrowLeft?.removeEventListener("click", handlePrev);
        parallaxTriggers.forEach(t => t.kill());
        demoCardsEl.innerHTML = "";
        slideNumbersEl.innerHTML = "";
      };
    }, demoRef);

    return () => { isCancelled = true; ctx.revert(); };
  }, [slides, navigate, ctaLabel]);

  return (
    <div className="relative h-screen min-h-[640px] w-full bg-black text-white overflow-hidden font-sans -mt-13 md:-mt-19">
      {/* Thanh vàng indicator chạy ở mép trên */}
      <div ref={indicatorRef} className="indicator fixed left-0 right-0 top-0 h-[5px] bg-[#ecad29] z-40" />

      <div id="demo" ref={demoRef} className="relative w-full h-full">
        {/* Cinematic Overlay Gradient System */}
        <div className="absolute inset-0 z-10 pointer-events-none
                        bg-[linear-gradient(90deg,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.55)_25%,rgba(0,0,0,0.25)_55%,rgba(0,0,0,0)_85%)]" />
        <div className="absolute inset-0 z-10 pointer-events-none
                        bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0)_18%,rgba(0,0,0,0)_60%,rgba(0,0,0,0.75)_100%)]" />

        {/* Cards layer (inject HTML từ slides) */}
        <div id="demo-cards" ref={demoCardsRef} className="absolute inset-0 z-0" />

        {/* DETAILS EVEN */}
        <DetailsBlock ctaLabel={ctaLabel} refEl={detailsEvenRef} id="details-even" z={30} />
        {/* DETAILS ODD */}
        <DetailsBlock ctaLabel={ctaLabel} refEl={detailsOddRef}  id="details-odd"  z={20} />

        {/* Pagination */}
        <div className="pagination hidden md:inline-flex absolute left-4 md:left-6 bottom-4 md:bottom-6 items-center gap-4 md:gap-5 z-80 pointer-events-auto">
          <div ref={arrowLeftRef}  className="arrow arrow-left  w-10 h-10 md:w-[46px] md:h-[46px] rounded-full border-2 border-white/30 grid place-items-center bg-black/40 backdrop-blur hover:border-white/70 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-white/75"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </div>
          <div ref={arrowRightRef} className="arrow arrow-right w-10 h-10 md:w-[46px] md:h-[46px] rounded-full border-2 border-white/30 grid place-items-center bg-black/40 backdrop-blur ml-1 md:ml-3 hover:border-white/70 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-white/75"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </div>
          <div className="progress-sub-container ml-2 md:ml-4 flex items-center h-[42px] w-[190px] md:w-60">
            <div className="progress-sub-background w-full h-[3px] bg-white/25 rounded-full overflow-hidden">
              <div ref={progressRef} className="progress-sub-foreground h-[3px] bg-[#ecad29]" />
            </div>
          </div>
          <div id="slide-numbers" ref={slideNumbersRef}
               className="slide-numbers relative w-[42px] h-[42px] md:w-[50px] md:h-[50px] overflow-hidden z-30 bg-black/40 rounded-full border border-white/20 backdrop-blur" />
        </div>
      </div>
    </div>
  );
};

// Sub-component: block details (meta + title + sub + desc + CTA)
const DetailsBlock: FC<{
  refEl: React.RefObject<HTMLDivElement | null>;
  id: string;
  z: number;
  ctaLabel: string;
}> = ({ refEl, id, z, ctaLabel }) => (
  <div
    id={id}
    ref={refEl}
    className={`details absolute top-28 left-5 md:top-1/4 md:left-12 lg:left-16 max-w-[640px]`}
    style={{ zIndex: z }}
  >
    <div className="place-box h-10 overflow-hidden relative">
      <div className="text pt-3 text-[12px] md:text-[14px] tracking-[0.18em] uppercase font-medium text-white/85 flex flex-wrap items-center gap-2">
        <span className="absolute w-[26px] h-0.5 md:w-[34px] md:h-[3px] rounded-full bg-[#ecad29] left-0 top-0" />
      </div>
    </div>
    <div className="title-box-1 mt-2 h-[80px] md:h-[112px] lg:h-[140px] overflow-hidden">
      <div className="title-1 font-['Oswald',sans-serif] font-bold text-[40px] md:text-[72px] lg:text-[88px] leading-[0.92] tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.85)]" />
    </div>
    <div className="title-box-2 mt-1 h-7 md:h-10 overflow-hidden">
      <div className="title-2 font-['Oswald',sans-serif] font-medium text-[18px] md:text-[28px] leading-none uppercase tracking-[0.08em] text-white/85 drop-shadow-[0_6px_16px_rgba(0,0,0,0.7)]" />
    </div>
    <div className="desc mt-5 w-[300px] md:w-[560px] max-h-[110px] text-[13px] md:text-[15px] leading-relaxed text-white/85 overflow-hidden line-clamp-4" />
    <div className="cta mt-7 flex items-center max-w-[500px] gap-4">
      <button className="bookmark w-10 h-10 rounded-full bg-[#ecad29] text-white grid place-items-center border-none shadow-[0_10px_24px_rgba(236,173,41,0.45)] hover:scale-110 transition-transform duration-300">
        <span className="text-[18px] leading-none">★</span>
      </button>
      <button className="discover h-10 px-7 rounded-full border border-white/80 text-[11px] md:text-[12px] uppercase bg-black/30 backdrop-blur tracking-[0.22em] font-semibold hover:bg-white hover:text-black hover:border-white transition-colors duration-300">
        {ctaLabel}
      </button>
    </div>
  </div>
);

export default BannerHome;



7. App.tsx — Cách lắp ráp

// src/App.tsx
import { Outlet } from "react-router-dom";
import Header from "./components/header/Header";
import SmoothScrollLayout from "./components/common/ux/SmoothScrollLayout";

function App() {
  return (
    <>
      <Header />
      <SmoothScrollLayout ease={0.08}>
        <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-neutral-900 dark:text-neutral-100">
          {/*
            QUAN TRỌNG:
            - `pt-13 md:pt-19` bù chiều cao header fixed cho các page KHÔNG có hero.
            - Trang có <BannerHome> sẽ tự kéo lên bằng `-mt-13 md:-mt-19` để hero
              chiếm trọn 100vh và header glassmorphism overlay đẹp lên trên.
          */}
          <div className="min-h-[90vh] pt-13 md:pt-19">
            <Outlet />
          </div>
        </main>
      </SmoothScrollLayout>
    </>
  );
}

export default App;

Sử dụng BannerHome trong page:

// src/pages/HomePage.tsx (ví dụ TravelViet)
import BannerHome, { type BannerSlide } from "../components/hero/BannerHome";

const slides: BannerSlide[] = [
  {
    place: "PHÚ QUỐC • 5N4Đ",
    title: "Đảo Ngọc Phú Quốc",
    subtitle: "Trải nghiệm thiên đường nghỉ dưỡng",
    description: "Khám phá những bãi biển hoang sơ, lặn ngắm san hô và thưởng thức ẩm thực hải sản tươi sống tại đảo ngọc miền Nam.",
    image: "https://yourcdn.com/phu-quoc.jpg",
    detailPath: "/tours/phu-quoc",
  },
  {
    place: "HÀ GIANG • 4N3Đ",
    title: "Cao Nguyên Đá Đồng Văn",
    subtitle: "Hùng vĩ và bí ẩn",
    description: "Chinh phục những cung đèo hiểm trở, ngắm hoa tam giác mạch nở rộ giữa lưng trời.",
    image: "https://yourcdn.com/ha-giang.jpg",
    detailPath: "/tours/ha-giang",
  },
  // ... thêm slide khác
];

export default function HomePage() {
  return (
    <>
      <BannerHome slides={slides} ctaLabel="Xem tour chi tiết" />
      {/* các section khác bên dưới */}
    </>
  );
}



8. index.css — Tailwind v4 + dark mode + font Oswald

/* src/index.css */

@import "tailwindcss";

/* Font Oswald (BẮT BUỘC cho BannerHome typography) */
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Nunito+Sans:wght@300;400;600;700;800&display=swap");

/* Dark mode class-based */
@custom-variant dark (&:where(.dark, .dark *));

*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  font-family: "Nunito Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
}

/* Ẩn scrollbar (Movizone style minimal) */
::-webkit-scrollbar { display: none; }
* { scrollbar-width: none; }

@layer base {
  body {
    @apply bg-background text-foreground;
  }
}



Lưu ý: Tailwind v4 sinh spacing động từ --spacing token (mặc định 0.25rem). Các class như pt-13 (52px), pt-19 (76px), w-12, h-12 đều hợp lệ mặc định, không cần khai báo thêm.

vite.config.ts (cần plugin Tailwind v4):

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});



9. Data adapter — Áp dụng cho dự án bất kỳ

Bất kể dữ liệu gốc của bạn là gì (TMDB movies, danh sách tour, sản phẩm, bài viết...), chỉ cần map về interface BannerSlide rồi truyền vào <BannerHome slides={...} />.

Ví dụ 1 — TravelViet (dữ liệu tour)

interface Tour {
  id: string;
  name: string;
  destination: string;
  duration: string;
  shortDesc: string;
  coverImage: string;
}

const mapTourToSlide = (t: Tour): BannerSlide => ({
  place: `${t.destination.toUpperCase()} • ${t.duration}`,
  title: t.name,
  subtitle: t.destination,
  description: t.shortDesc,
  image: t.coverImage,
  detailPath: `/tours/${t.id}`,
});

const slides = tours.map(mapTourToSlide);
<BannerHome slides={slides} ctaLabel="Đặt tour ngay" />

Ví dụ 2 — Movie app (dữ liệu TMDB)

const mapMovieToSlide = (m: TMDBMovieSummary): BannerSlide => ({
  place: `${m.original_language.toUpperCase()} • ${m.release_date?.slice(0, 4)}`,
  title: m.title,
  subtitle: m.original_title !== m.title ? m.original_title : "Now Showing",
  description: m.overview || "Chưa có mô tả.",
  image: `https://image.tmdb.org/t/p/original${m.backdrop_path}`,
  detailPath: `/movie/${m.id}`,
  logoImage: m.logoPath ? `https://image.tmdb.org/t/p/w500${m.logoPath}` : null,
});

Ví dụ 3 — E-commerce (sản phẩm nổi bật)

const mapProductToSlide = (p: Product): BannerSlide => ({
  place: `${p.category.toUpperCase()} • ${p.brand}`,
  title: p.name,
  subtitle: p.tagline,
  description: p.description,
  image: p.heroImage,
  detailPath: `/products/${p.slug}`,
});



10. Customization & Tham số tinh chỉnh

🎨 Đổi màu brand (mặc định vàng Movizone #ecad29)

Tìm-thay tất cả #ecad29 trong 3 file: Header.tsx, navbar-menu.tsx, BannerHome.tsx sang mã màu brand của bạn. Ví dụ:







Brand



Mã màu





Movizone (gốc)



#ecad29





TravelViet



#0ea5e9 (sky-blue) hoặc #10b981 (emerald)





Tech/SaaS



#6366f1 (indigo)





Food



#ef4444 (red)

⚙️ Tham số chuyển động (BannerHome.tsx)







Hằng số



Mặc định



Ý nghĩa



Tinh chỉnh





ease



"power3.out"



Easing chính cho stagger reveal



Thử "expo.out" cho giảm tốc mạnh hơn





STAGGER



0.1



Khoảng cách giữa các phần tử xuất hiện



0.08 – 0.15 đều OK





REVEAL_DURATION



0.9



Thời gian fade-up của mỗi phần tử









Parallax yPercent



-30 (bg)



Tốc độ trôi ảnh nền (30% scroll)



-20 (chậm hơn) → -50 (nhanh, đậm chiều sâu)





Parallax scrub



1.5



Độ trễ parallax (1.5s)



1 (nhạy) → 2.5 (rất có đà)

⚙️ Tham số momentum (SmoothScrollLayout.tsx)







Prop



Mặc định



Ý nghĩa



Khoảng đề xuất





ease



0.08



Tốc độ lerp (càng nhỏ càng có đà)



0.06 – 0.12

<SmoothScrollLayout ease={0.06}>{/* mượt hơn, nhiều đà */}
<SmoothScrollLayout ease={0.12}>{/* nhanh, ít trễ */}

🖼️ Đổi chiều cao Hero

Trong BannerHome.tsx, đổi class h-screen min-h-[640px]:

// Full viewport (mặc định)
className="h-screen min-h-[640px]"

// 80vh
className="h-[80vh] min-h-[600px]"

// Mobile 70vh / Desktop 100vh
className="h-[70vh] md:h-screen min-h-[600px]"

🔤 Đổi font

Mặc định dùng Oswald cho tiêu đề. Có thể thay bằng Bebas Neue, Anton, Archivo Black...:





Import font trong index.css:

 @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap");



Trong BannerHome.tsx, tìm-thay font-['Oswald',sans-serif] thành font-['Bebas_Neue',sans-serif].



11. Troubleshooting thường gặp

❓ Parallax không chạy / lag





Chắc chắn đã gsap.registerPlugin(ScrollTrigger) (đã làm sẵn trong SmoothScrollLayout.tsx và BannerHome.tsx).



Sau khi nội dung load (ảnh / route mới), gọi ScrollTrigger.refresh() — SmoothScrollLayout đã tự làm việc này khi body height đổi.

❓ Header che mất hero / không thấy hero full-screen





Kiểm tra BannerHome có class -mt-13 md:-mt-19. Số này phải khớp với pt-13 md:pt-19 trong App.tsx.



Nếu bạn dùng header cao khác, đổi cả hai giá trị này tương ứng.

❓ Text trắng trên nền sáng không đọc được khi header transparent





Đã có sẵn [text-shadow:0_2px_10px_rgba(0,0,0,0.55)] trong Header.tsx cho state top. Đảm bảo không xóa.

❓ Build TypeScript báo lỗi Property 'addEventListener' does not exist on type 'never'





TypeScript thu hẹp type quá tay khi dùng "X" in window. File SmoothScrollLayout.tsx ở phiên bản trên đã fix bằng cách bỏ check không cần thiết.

❓ Tailwind không sinh class pt-13 / w-12





Bạn đang dùng Tailwind v3. Hãy nâng lên v4 hoặc khai báo manual trong tailwind.config.js:

theme: { extend: { spacing: { 13: "3.25rem", 19: "4.75rem" } } }

❓ Hero scroll bị giật / không mượt





Kiểm tra <SmoothScrollLayout> có được wrap quanh <main> (xem App.tsx).



Tránh đặt overflow: hidden lên body hoặc html ngoài CSS đã quy định.

❓ Logo trong BannerHome bị méo





TMDB-style: dùng logoImage (URL ảnh). Component sẽ render <img> với max-h-20 object-contain → giữ tỷ lệ.



Nếu để logoImage: null, sẽ fallback dùng title text với font Oswald đậm.



✅ Checklist khi áp dụng vào dự án mới





Cài đủ deps: react@19, react-router-dom@7, tailwindcss@4, gsap, motion.



Cấu hình vite.config.ts với @tailwindcss/vite.



Copy index.css (font Oswald + dark variant).



Copy 4 file: SmoothScrollLayout.tsx, navbar-menu.tsx, Header.tsx, BannerHome.tsx.



Wrap app trong <SmoothScrollLayout> trong App.tsx.



Thay BRAND và NAV_ITEMS trong Header.tsx.



Map dữ liệu của bạn về BannerSlide[] và truyền vào <BannerHome>.



(Tùy chọn) Tìm-thay #ecad29 sang màu brand của bạn.



Chạy npm run dev và kiểm tra:





Header top trong suốt, scroll thì glass blur + compact.



Hover menu hiện sliding underline vàng từ tâm.



Hero 100vh, title fade-up theo nhịp 0.1s power3.out.



Cuộn xuống: ảnh nền hero trôi 30% scroll với đà ~1.5s, nội dung trang lerp mượt.



📜 License & Credit

Tài liệu này dựa trên implementation Movizone-style đã được tinh chỉnh trong project MOIVEZONE. Tự do sử dụng cho mọi dự án.

Movizone DNA = 3 thành phần chính:





Glass Header — Trong suốt ↔ Compact glass, tự ẩn khi cuộn xuống.



Cinematic Hero — Full 100vh + dual overlay gradient + Oswald typography + GSAP parallax scrub 1.5.



Momentum Scroll — Lerp 0.08 + ScrollTrigger refresh trên body height change.

Khi cả 3 cùng hoạt động → cảm giác sản phẩm "cao cấp - cinematic - có đà" đặc trưng.