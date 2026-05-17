"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { Languages, Moon, SunMedium } from "lucide-react";

import {
  HoveredLink,
  Menu,
  MenuItem,
  type HeaderNavAppearance,
} from "./ui/navbar-menu";
import { HeaderAccountMenu } from "./HeaderAccountMenu";
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
    "https://res.cloudinary.com/dmzvum1lp/image/upload/v1778951137/logo_web_1_o9tz3q.png",
  name: "TravelViet",
};

type NavItemConfig = {
  label: string;
  to: string;
  dropdown?: React.ReactNode;
};

const HEADER_HIDE_DEADZONE_PX = 2;
const HEADER_GLASS_THRESHOLD_PX = 24;

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
  const { theme, language } = useAppSelector((state) => state.preferences);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showHeader, setShowHeader] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const [hasManagementAccess, setHasManagementAccess] = useState(false);

  const navItems = useMemo<NavItemConfig[]>(
    () => [
      {
        label: t("nav.home"),
        to: "/",
        dropdown: (
          <div className="flex flex-col space-y-3 text-sm">
            <HoveredLink href="/">{t("nav.home")}</HoveredLink>
            <HoveredLink href="/tours?domesticOnly=true">
              {t("header.exploreTours")}
            </HoveredLink>
            <HoveredLink href="/destinations">
              {t("homeQuick.destinations")}
            </HoveredLink>
          </div>
        ),
      },
      { label: t("homeQuick.tours"), to: "/tours?domesticOnly=true" },
      { label: t("homeQuick.destinations"), to: "/destinations" },
      { label: t("homeQuick.support"), to: "/support" },
    ],
    [t],
  );

  const mobileNavItems = useMemo(
    () => navItems.map((it) => ({ label: it.label, to: it.to })),
    [navItems],
  );

  const loginLabel = t("header.login");
  const brandTagline = t("header.brandTagline");
  const ariaTheme =
    theme === "dark"
      ? t("header.ariaSwitchToLight")
      : t("header.ariaSwitchToDark");
  const ariaLanguage = t("header.ariaToggleLanguage");

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

  /** Chỉ trang có banner: trong suốt + chữ sáng khi mới vào / chưa cuộn */
  const isOverlayTop =
    headerVariant === "over-hero" && !scrolled;

  const isDarkTheme = theme === "dark";

  const navAppearance: HeaderNavAppearance = isOverlayTop
    ? "overlay"
    : isDarkTheme
      ? "solid-dark"
      : "solid-light";

  const avatarRing = isOverlayTop
    ? "border-white/45 bg-black/25 text-white"
    : isDarkTheme
      ? "border-white/20 bg-white/10 text-white"
      : "border-black/15 bg-black/5 text-black";

  const headerSurface = isOverlayTop
    ? "backdrop-blur-0 bg-transparent border-b border-transparent text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.55)]"
    : isDarkTheme
      ? "backdrop-blur-xl bg-[#0f0f0f] border-b border-white/10 text-white shadow-sm shadow-black/30 [text-shadow:none]"
      : "backdrop-blur-xl bg-[#ebe6e3] border-b border-black/10 text-black shadow-sm shadow-black/6 [text-shadow:none]";

  const iconBtnClass = isOverlayTop
    ? "border-white/25 bg-black/20 text-white hover:bg-white/15 backdrop-blur"
    : isDarkTheme
      ? "border-white/20 bg-white/10 text-white hover:bg-white/15"
      : "border-black/15 bg-black/5 text-black hover:bg-black/10";

  const mobileBarClass = isOverlayTop
    ? "bg-neutral-950/80 border-neutral-800 text-white"
    : isDarkTheme
      ? "bg-[#0f0f0f] border-white/10 text-white"
      : "bg-[#ebe6e3] border-black/10 text-black";

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
      className={`fixed top-0 left-0 right-0 z-80 will-change-transform transform-gpu
                 transition-[background-color,backdrop-filter,box-shadow,border-color,color]
                 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                 ${headerSurface}`}
    >
      {/* ===== NAV DESKTOP ===== */}
      <nav
        aria-label={t("nav.ariaMain")}
        className={`mx-auto hidden md:flex max-w-6xl items-center justify-between
                   px-3 sm:px-4 md:px-8 gap-2
                   transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                   ${isOverlayTop ? "py-3.5" : "py-1.5"}`}
      >
        {/* Logo (ảnh wordmark) */}
        <Link
          to="/"
          className="hidden md:flex shrink-0 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6600]/50 rounded-md"
        >
          <img
            src={BRAND.logoSrc}
            alt={BRAND.name}
            className={`w-auto object-contain object-left transition-[height,max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isOverlayTop
                ? "h-10 max-w-[min(200px,42vw)] md:h-12"
                : "h-8 max-w-[min(168px,38vw)] md:h-12"
            }`}
          />
        </Link>

        {/* Menu giữa */}
        <div className="hidden md:flex items-center">
          <Menu setActive={setActiveMenu}>
            {navItems.map((it) => (
              <MenuItem
                key={it.to}
                setActive={setActiveMenu}
                active={activeMenu}
                item={it.label}
                to={it.to}
                appearance={navAppearance}
              >
                {it.dropdown}
              </MenuItem>
            ))}
          </Menu>
        </div>

        {/* Slot phải (CTA / auth / toggles) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!(isAuthenticated && user) ? (
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  dispatch(setTheme(theme === "dark" ? "light" : "dark"))
                }
                aria-label={ariaTheme}
                className={`inline-flex items-center justify-center w-9 h-9 rounded-full border transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${iconBtnClass}`}
              >
                {theme === "dark" ? (
                  <SunMedium className="w-4 h-4 opacity-90" aria-hidden />
                ) : (
                  <Moon className="w-4 h-4 opacity-90" aria-hidden />
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  dispatch(setLanguage(language === "vi" ? "en" : "vi"))
                }
                aria-label={ariaLanguage}
                className={`inline-flex items-center gap-2 h-9 rounded-full border px-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${iconBtnClass}`}
              >
                <Languages className="w-4 h-4 opacity-85" aria-hidden />
                <span className="opacity-95">
                  {language === "vi" ? t("header.vietnamese") : t("header.english")}
                </span>
              </button>
            </div>
          ) : null}

          {isAuthenticated && user ? (
            <div className="hidden md:block">
              <HeaderAccountMenu
                user={user}
                theme={theme}
                language={language}
                hasManagementAccess={hasManagementAccess}
                triggerClassName={avatarRing}
                onChangeTheme={(next) => dispatch(setTheme(next))}
                onChangeLanguage={(next) => dispatch(setLanguage(next))}
                onLogout={handleLogout}
              />
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center rounded-full border border-[#ff6600]/70
                         px-3 py-1.5 text-[12px] font-medium uppercase tracking-wide
                         text-[#ff6600] hover:bg-[#ff6600] hover:text-white transition-colors"
            >
              {loginLabel}
            </Link>
          )}
        </div>
      </nav>

      {/* ===== NAV MOBILE ===== */}
      <nav
        aria-label={t("nav.ariaMain")}
        className={`md:hidden px-3 py-2 border-b backdrop-blur ${mobileBarClass}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MobileNav
              brandName={BRAND.name}
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
              className="inline-flex items-center focus:outline-none"
            >
              <img
                src={BRAND.logoSrc}
                alt={BRAND.name}
                className="h-8 w-auto max-w-[140px] object-contain object-left"
              />
            </Link>
          </div>

          {isAuthenticated && user ? (
            <HeaderAccountMenu
              user={user}
              theme={theme}
              language={language}
              hasManagementAccess={hasManagementAccess}
              triggerClassName={
                isOverlayTop
                  ? "border-white/50 bg-black/20 text-white"
                  : isDarkTheme
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-black/15 bg-black/5 text-black"
              }
              onChangeTheme={(next) => dispatch(setTheme(next))}
              onChangeLanguage={(next) => dispatch(setLanguage(next))}
              onLogout={handleLogout}
            />
          ) : (
            <Link
              to="/login"
              className="text-[12px] font-semibold uppercase tracking-wide text-[#ff6600]"
            >
              {loginLabel}
            </Link>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
