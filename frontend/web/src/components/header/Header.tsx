"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import type { HeaderNavAppearance } from "./ui/navbar-menu";
import { HeaderMegaMenu } from "./HeaderMegaMenu";
import { HEADER_NAV_LINKS } from "./headerNavConfig";
import { HeaderUtilityActions } from "./HeaderUtilityActions";
import { MobileNav } from "./MobileNav";
import { userApi } from "../../api/server/User.api";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { toUserMeResponse, type AuthLoginUser } from "../../module/auth/types/auth";
import { setLanguage, setTheme } from "../../stores/slices/preferencesSlice";
import { useAuthStore } from "../../stores/authStore";
import { resolveHeaderVariant } from "./headerVariant";

// === CẤU HÌNH BRAND (đổi theo dự án) ===========================
const BRAND = {
  logoSrc:
    "https://res.cloudinary.com/dmzvum1lp/image/upload/v1779513001/logo_web_1_1_qqnm26.png",
  name: "Travel Viet",
  wordmark: "Travel Viet",
  travelBlue: "#0a4d69",
};

const HEADER_HIDE_DEADZONE_PX = 2;
const HEADER_GLASS_THRESHOLD_PX = 24;

function HeaderBrandWordmark({
  logoSizeClass,
  textClassName = "text-[15px] md:text-[17px]",
}: {
  logoSizeClass: string;
  textClassName?: string;
}) {
  return (
    <>
      <img
        src={BRAND.logoSrc}
        alt={BRAND.name}
        className={`shrink-0 object-contain transition-[height,width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${logoSizeClass}`}
      />
      <span
        className={`flex flex-col leading-[1.05] font-extrabold tracking-tight ${textClassName}`}
      >
        <span style={{ color: BRAND.travelBlue }}>Travel</span>
        <span className="text-[#ff6600]">Viet</span>
      </span>
    </>
  );
}

/**
 * Header chính (public site).
 *
 * Phase 1 nâng cấp:
 * - Account dropdown: chuyển sang Radix `DropdownMenu` (qua
 *   `HeaderAccountMenu`) ⇒ keyboard nav + click-outside + focus mgmt.
 * - Mobile drawer: chuyển sang Shadcn `Sheet` (qua `MobileNav`).
 * - Show/hide khi cuộn: dùng `motion.header` (Framer Motion v12)
 *   thay vì CSS class toggle — tránh layout reflow, giữ 60fps.
 * - Vẫn giữ desktop nav dropdown (`Menu/MenuItem`) với underline animation
 *   để không phá hiệu ứng "Movizone DNA" đang chạy ổn.
 */
export default function Header() {
  const { t } = useTranslation("translation");
  const location = useLocation();
  const dispatch = useAppDispatch();
  const headerVariant = useMemo(
    () => resolveHeaderVariant(location.pathname),
    [location.pathname],
  );
  const { theme, language, currency } = useAppSelector((state) => state.preferences);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showHeader, setShowHeader] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const [hasManagementAccess, setHasManagementAccess] = useState(false);

  const mobileNavItems = useMemo(
    () => [
      { label: t("nav.home"), to: HEADER_NAV_LINKS.home },
      { label: t("header.nav.packageTour"), to: HEADER_NAV_LINKS.packageTour },
      { label: t("homeQuick.tours"), to: HEADER_NAV_LINKS.toursDomestic },
      { label: t("header.nav.flightTicket"), to: HEADER_NAV_LINKS.flights },
      { label: t("header.nav.hotel"), to: HEADER_NAV_LINKS.hotels },
      { label: t("header.nav.travelCombo"), to: HEADER_NAV_LINKS.travelCombo },
      {
        label: t("header.nav.addOnServices"),
        to: HEADER_NAV_LINKS.support,
      },
      {
        label: t("header.megaMenu.more.label"),
        to: HEADER_NAV_LINKS.destinations,
      },
      { label: t("homeQuick.destinations"), to: HEADER_NAV_LINKS.destinations },
      { label: t("homeQuick.support"), to: HEADER_NAV_LINKS.support },
      { label: t("homeQuick.passport"), to: HEADER_NAV_LINKS.passport },
      {
        label: t("header.myBookings", { defaultValue: "Đơn đã đặt" }),
        to: HEADER_NAV_LINKS.myBookings,
      },
    ],
    [t],
  );

  const loginLabel = t("header.login");
  const brandTagline = t("header.brandTagline");

  useEffect(() => {
    const syncScrollState = () => {
      const currentY = window.scrollY || window.pageYOffset;
      setScrolled(currentY > HEADER_GLASS_THRESHOLD_PX);
      lastScrollY.current = currentY;
    };

    syncScrollState();
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY || window.pageYOffset;

      setScrolled(currentY > HEADER_GLASS_THRESHOLD_PX);

      if (currentY <= 0) {
        setShowHeader(true);
        lastScrollY.current = 0;
        return;
      }

      const diff = currentY - lastScrollY.current;
      if (diff > HEADER_HIDE_DEADZONE_PX) setShowHeader(false);
      else if (diff < -HEADER_HIDE_DEADZONE_PX) setShowHeader(true);

      lastScrollY.current = currentY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setHasManagementAccess(false);
      return undefined;
    }

    let cancelled = false;
    void (async () => {
      try {
        const ctx = await userApi.getMyAccessContext();
        if (cancelled) return;
        setHasManagementAccess(Boolean(ctx.hasManagementAccess));
        useAuthStore
          .getState()
          .setUser(toUserMeResponse(ctx.user as AuthLoginUser));
      } catch {
        if (!cancelled) setHasManagementAccess(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.id]);

  const handleLogout = useCallback(() => {
    useAuthStore.getState().clearAuth();
    window.sessionStorage.removeItem("travelviet-login-welcome-seen");
    window.sessionStorage.removeItem("travelviet-login-welcome-pending");
  }, []);

  /** Trang hero: header kính mờ suốt (kể cả khi đã cuộn). */
  const isOverHero = headerVariant === "over-hero";
  /** Chỉ ảnh hưởng kích thước logo khi chưa cuộn. */
  const isOverlayTop = isOverHero && !scrolled;

  const isDarkTheme = theme === "dark";

  const navAppearance: HeaderNavAppearance = isOverHero
    ? "overlay"
    : isDarkTheme
      ? "solid-dark"
      : "solid-light";

  const avatarRing = isOverHero
    ? "border-white/45 bg-black/25 text-white"
    : isDarkTheme
      ? "border-white/20 bg-white/10 text-white"
      : "border-black/15 bg-black/5 text-black";

  /** Kính mờ — nhìn xuyên nội dung phía dưới (hero / trang cuộn). */
  const headerGlass =
    "backdrop-blur-xl backdrop-saturate-150 border-b supports-[backdrop-filter]:backdrop-blur-xl";

  const headerSurface = isOverHero
    ? `${headerGlass} bg-[var(--header-surface-overlay)] border-b border-white/15 text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.35)]`
    : isDarkTheme
      ? `${headerGlass} bg-[color-mix(in_srgb,var(--header-surface-dark)_92%,transparent)] border-[var(--header-border-dark)] text-white shadow-[0_8px_32px_rgba(0,0,0,0.28)] [text-shadow:none]`
      : `${headerGlass} bg-[color-mix(in_srgb,var(--header-surface-light)_94%,transparent)] border-[var(--header-border-light)] text-[var(--color-text)] shadow-[0_8px_24px_rgba(15,80,120,0.06)] [text-shadow:none]`;

  const mobileBarClass = isOverHero
    ? "border-transparent text-white"
    : isDarkTheme
      ? "border-transparent text-white"
      : "border-transparent text-[var(--color-text)]";

  const logoSizeClass = isOverlayTop
    ? "h-11 w-11 md:h-12 md:w-12"
    : "h-9 w-9 md:h-10 md:w-10";

  return (
    <motion.header
      role="banner"
      aria-label={t("nav.ariaMain")}
      initial={false}
      animate={{ y: showHeader ? 0 : -100 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 32,
        mass: 0.8,
      }}
      className={`fixed top-0 left-0 right-0 isolate z-[1000] will-change-transform transform-gpu
                 transition-[background-color,backdrop-filter,box-shadow,border-color,color]
                 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                 ${headerSurface}`}
    >
      {/* ===== NAV DESKTOP ===== */}
      <nav
        aria-label={t("nav.ariaMain")}
        className={`site-header-nav mx-auto hidden md:flex max-w-[1440px] min-h-[3.5rem] items-center justify-between
                   px-2 sm:px-3 lg:px-4 gap-1.5 py-2
                   transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`
                  }
      >
        {/* Logo + chữ hai hàng (Travel / Viet) phía sau logo */}
        <Link
          to="/"
          className="hidden md:inline-flex shrink-0 items-center gap-2.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6600]/50"
        >
          <HeaderBrandWordmark
            logoSizeClass={logoSizeClass}
            textClassName="text-[15px] md:text-[17px]"
          />
        </Link>

        {/* Menu giữa — không dùng `hidden` (trước đó làm mất toàn bộ item) */}
        <div className="site-header-nav__menu flex min-w-0 flex-1 items-center justify-center overflow-visible px-0.5 lg:px-1">
          <HeaderMegaMenu
            t={t}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            appearance={navAppearance}
            isAuthenticated={isAuthenticated}
          />
        </div>

        <HeaderUtilityActions
          appearance={navAppearance}
          isAuthenticated={isAuthenticated}
          user={user}
          theme={theme}
          language={language}
          currency={currency}
          hasManagementAccess={hasManagementAccess}
          avatarRingClassName={avatarRing}
          onChangeTheme={(next) => dispatch(setTheme(next))}
          onChangeLanguage={(next) => dispatch(setLanguage(next))}
          onLogout={handleLogout}
        />
      </nav>

      {/* ===== NAV MOBILE ===== */}
      <nav
        aria-label={t("nav.ariaMain")}
        className={`md:hidden px-3 py-2 ${mobileBarClass}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MobileNav
              brandName={BRAND.wordmark}
              brandTagline={brandTagline}
              logoSrc={BRAND.logoSrc}
              items={mobileNavItems}
              theme={theme}
              language={language}
              isAuthenticated={isAuthenticated}
              onChangeTheme={(next) => dispatch(setTheme(next))}
              onChangeLanguage={(next) => dispatch(setLanguage(next))}
            />
            <Link
              to="/"
              className="inline-flex min-w-0 items-center gap-2 focus:outline-none"
            >
              <HeaderBrandWordmark
                logoSizeClass="h-8 w-8"
                textClassName="text-[13px]"
              />
            </Link>
          </div>

          <HeaderUtilityActions
            appearance={navAppearance}
            isAuthenticated={isAuthenticated}
            user={user}
            theme={theme}
            language={language}
            currency={currency}
            hasManagementAccess={hasManagementAccess}
            avatarRingClassName={
              isOverHero
                ? "border-white/50 bg-black/20 text-white"
                : isDarkTheme
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-black/15 bg-black/5 text-black"
            }
            onChangeTheme={(next) => dispatch(setTheme(next))}
            onChangeLanguage={(next) => dispatch(setLanguage(next))}
            onLogout={handleLogout}
          />
        </div>
      </nav>
    </motion.header>
  );
}
