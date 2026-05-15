"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";
import {
  Languages,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Moon,
  Stamp,
  SunMedium,
  UserCircle2,
  UserRound,
} from "lucide-react";
import { userApi } from "../../api/server/User.api";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { toUserMeResponse, type AuthLoginUser } from "../../module/auth/types/auth";
import { setLanguage, setTheme } from "../../stores/slices/preferencesSlice";
import { useAuthStore } from "../../stores/authStore";

// === CẤU HÌNH BRAND (đổi theo dự án) ===========================
const BRAND = {
  logoSrc: "/icons.svg",
  name: "TravelViet",
};

// === CẤU HÌNH MENU (đổi theo dự án) ============================
// Mỗi item: { label, to, dropdown?: ReactNode }
type NavItemConfig = {
  label: string;
  to: string;
  dropdown?: React.ReactNode;
};

function getUserInitial(displayName?: string | null, fullName?: string | null, email?: string | null) {
  const source = displayName || fullName || email || "U";
  return source.trim().charAt(0).toUpperCase() || "U";
}

export default function Header() {
  const { t } = useTranslation("translation");
  const dispatch = useAppDispatch();
  const { theme, language } = useAppSelector((state) => state.preferences);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showHeader, setShowHeader] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [hasManagementAccess, setHasManagementAccess] = useState(false);

  const navItems = useMemo<NavItemConfig[]>(
    () => [
      {
        label: t("nav.home"),
        to: "/",
        dropdown: (
          <div className="flex flex-col space-y-3 text-sm">
            <HoveredLink href="/">{t("nav.home")}</HoveredLink>
            <HoveredLink href="/tours">{t("header.exploreTours")}</HoveredLink>
            <HoveredLink href="/destinations">
              {t("homeQuick.destinations")}
            </HoveredLink>
          </div>
        ),
      },
      { label: t("homeQuick.tours"), to: "/tours" },
      { label: t("homeQuick.destinations"), to: "/destinations" },
      { label: t("homeQuick.support"), to: "/support" },
    ],
    [t],
  );

  const loginLabel = t("header.login");
  const brandTagline = t("header.brandTagline");
  const ariaTheme =
    theme === "dark"
      ? t("header.ariaSwitchToLight")
      : t("header.ariaSwitchToDark");
  const ariaLanguage = t("header.ariaToggleLanguage");

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

  const accountName =
    user?.displayName || user?.fullName || user?.email || t("header.account");

  const profileDetails = useMemo(
    () => [
      { label: t("header.fullName"), value: user?.fullName },
      { label: t("header.displayName"), value: user?.displayName },
      { label: t("header.email"), value: user?.email },
      { label: t("header.phone"), value: user?.phone },
      { label: t("header.status"), value: user?.status },
      { label: t("header.memberLevel"), value: user?.memberLevel },
    ],
    [t, user],
  );

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
        useAuthStore.getState().setUser(toUserMeResponse(ctx.user as AuthLoginUser));
      } catch {
        if (!cancelled) setHasManagementAccess(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (!isAccountOpen) return undefined;

    const onPointerDown = (e: PointerEvent) => {
      const roots = document.querySelectorAll("[data-header-account-root]");
      let inside = false;
      roots.forEach((root) => {
        if (root.contains(e.target as Node)) inside = true;
      });
      if (!inside) setIsAccountOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsAccountOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isAccountOpen]);

  const handleLogout = () => {
    useAuthStore.getState().clearAuth();
    window.sessionStorage.removeItem("travelviet-login-welcome-seen");
    window.sessionStorage.removeItem("travelviet-login-welcome-pending");
    setIsAccountOpen(false);
    setShowProfileDetails(false);
  };

  const avatarRing = scrolled
    ? "border-black/15 bg-neutral-200/90 text-neutral-900 dark:border-white/20 dark:bg-neutral-800/90 dark:text-white"
    : "border-white/45 bg-black/25 text-white";

  // Glass surface (Movizone DNA)
  const headerSurface = scrolled
    ? "backdrop-blur-md bg-white/70 dark:bg-neutral-950/65 border-b border-black/10 dark:border-white/10 shadow-sm shadow-black/20 text-neutral-900 dark:text-white"
    : "backdrop-blur-0 bg-transparent border-b border-transparent text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.55)]";

  const [mobileOpen, setMobileOpen] = useState(false);

  const closeAccountAndMobile = () => {
    setIsAccountOpen(false);
    setMobileOpen(false);
  };

  const rowClass =
    "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-neutral-900 transition-colors hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800";

  const accountMenuInner =
    user && (
      <>
        <div className="border-b border-neutral-200 px-3 py-3 dark:border-neutral-700">
          <div className="flex gap-3">
            <div
              className={`relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 text-lg font-bold leading-none shadow ${avatarRing}`}
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="relative z-[1] flex h-full w-full items-center justify-center bg-gradient-to-br from-[#ff8533] to-[#e65c00] text-white">
                  <UserRound className="absolute h-8 w-8 opacity-20 text-white" aria-hidden />
                  <span className="relative">{getUserInitial(user.displayName, user.fullName, user.email)}</span>
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{t("header.signedIn")}</p>
              <p className="truncate font-semibold">{accountName}</p>
              <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                {user.email || t("header.notUpdated")}
              </p>
            </div>
          </div>
        </div>

        <div className="max-h-[min(70vh,520px)] overflow-y-auto p-1">
          <Link className={rowClass} to="/account" onClick={closeAccountAndMobile}>
            <UserRound className="h-4 w-4 flex-shrink-0 opacity-70" aria-hidden />
            <span>{t("header.accountPage")}</span>
          </Link>

          {hasManagementAccess && (
            <Link
              className={rowClass}
              to="/management/dashboard"
              onClick={closeAccountAndMobile}
            >
              <LayoutDashboard className="h-4 w-4 flex-shrink-0 opacity-70" aria-hidden />
              <span>{t("header.managementPage")}</span>
            </Link>
          )}

          <Link className={rowClass} to="/support" onClick={closeAccountAndMobile}>
            <LifeBuoy className="h-4 w-4 flex-shrink-0 opacity-70" aria-hidden />
            <span>{t("header.supportCenter")}</span>
          </Link>

          <Link className={rowClass} to="/passport" onClick={closeAccountAndMobile}>
            <Stamp className="h-4 w-4 flex-shrink-0 opacity-70" aria-hidden />
            <span>{t("header.passport")}</span>
          </Link>

          <button
            className={rowClass}
            type="button"
            onClick={() => setShowProfileDetails((v) => !v)}
          >
            <UserCircle2 className="h-4 w-4 flex-shrink-0 opacity-70" aria-hidden />
            <span>{t("header.profileDetails")}</span>
          </button>

          {showProfileDetails && (
            <div className="mb-1 grid gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-xs dark:bg-neutral-800/80">
              {profileDetails.map((item) => (
                <div key={item.label} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1">
                  <span className="text-neutral-500 dark:text-neutral-400">{item.label}</span>
                  <strong className="text-right font-medium text-neutral-900 dark:text-white">
                    {item.value != null && item.value !== ""
                      ? String(item.value)
                      : t("header.notUpdated")}
                  </strong>
                </div>
              ))}
            </div>
          )}

          <div className="mt-1 flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs text-neutral-600 dark:text-neutral-300">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <SunMedium className="h-3.5 w-3.5" aria-hidden />
              {t("header.theme")}
            </span>
            <div className="flex rounded-full border border-neutral-200 p-0.5 dark:border-neutral-600">
              <button
                type="button"
                className={`rounded-full px-2.5 py-1 ${theme === "light" ? "bg-[#ff6600] text-white" : ""}`}
                onClick={() => dispatch(setTheme("light"))}
              >
                {t("header.light")}
              </button>
              <button
                type="button"
                className={`rounded-full px-2.5 py-1 ${theme === "dark" ? "bg-[#ff6600] text-white" : ""}`}
                onClick={() => dispatch(setTheme("dark"))}
              >
                {t("header.dark")}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs text-neutral-600 dark:text-neutral-300">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Languages className="h-3.5 w-3.5" aria-hidden />
              {t("header.language")}
            </span>
            <div className="flex rounded-full border border-neutral-200 p-0.5 dark:border-neutral-600">
              <button
                type="button"
                className={`rounded-full px-2.5 py-1 ${language === "vi" ? "bg-[#ff6600] text-white" : ""}`}
                onClick={() => dispatch(setLanguage("vi"))}
              >
                {t("header.vietnamese")}
              </button>
              <button
                type="button"
                className={`rounded-full px-2.5 py-1 ${language === "en" ? "bg-[#ff6600] text-white" : ""}`}
                onClick={() => dispatch(setLanguage("en"))}
              >
                {t("header.english")}
              </button>
            </div>
          </div>

          <button
            className={`${rowClass} mt-1 text-[#b42318] hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40`}
            type="button"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" aria-hidden />
            <span>{t("header.logout")}</span>
          </button>
        </div>
      </>
    );

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
              <img
                src={BRAND.logoSrc}
                alt={BRAND.name}
                className="h-full w-full object-contain"
              />
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
                {brandTagline}
              </span>
            </div>
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
                >
                  {it.dropdown}
                </MenuItem>
              ))}
            </Menu>
          </div>

          {/* Slot phải (CTA / auth / toggles) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!(isAuthenticated && user) && (
              <div className="hidden md:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => dispatch(setTheme(theme === "dark" ? "light" : "dark"))}
                  aria-label={ariaTheme}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/20 bg-black/20 backdrop-blur
                             hover:bg-white/15 transition-colors"
                >
                  {theme === "dark" ? (
                    <SunMedium className="w-4.5 h-4.5 text-white/85" aria-hidden />
                  ) : (
                    <Moon className="w-4.5 h-4.5 text-white/85" aria-hidden />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => dispatch(setLanguage(language === "vi" ? "en" : "vi"))}
                  aria-label={ariaLanguage}
                  className="inline-flex items-center gap-2 h-9 rounded-full border border-white/20 bg-black/20 backdrop-blur
                             px-3 text-[11px] font-semibold uppercase tracking-[0.18em]
                             hover:bg-white/15 transition-colors"
                >
                  <Languages className="w-4 h-4 text-white/80" aria-hidden />
                  <span className="text-white/90">{language === "vi" ? "VI" : "EN"}</span>
                </button>
              </div>
            )}

            {isAuthenticated && user ? (
              <div className="relative hidden md:block" data-header-account-root>
                <button
                  type="button"
                  aria-label={accountName}
                  aria-expanded={isAccountOpen}
                  aria-haspopup="menu"
                  title={accountName}
                  onClick={() => setIsAccountOpen((o) => !o)}
                  className={`relative inline-flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 text-[15px] font-bold leading-none shadow-md transition-opacity hover:opacity-95 ${avatarRing}`}
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="relative z-[1] flex h-full w-full items-center justify-center bg-gradient-to-br from-[#ff8533] to-[#e65c00] text-white shadow-inner">
                      <UserRound className="absolute h-7 w-7 opacity-20 text-white" aria-hidden />
                      <span className="relative">{getUserInitial(user.displayName, user.fullName, user.email)}</span>
                    </span>
                  )}
                </button>
                {isAccountOpen && accountMenuInner ? (
                  <div
                    className="absolute right-0 top-full z-[100] mt-2 w-[min(100vw-2rem,280px)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
                    role="menu"
                  >
                    {accountMenuInner}
                  </div>
                ) : null}
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
        <nav className="md:hidden px-3 py-2 bg-neutral-950/80 border-b border-neutral-800 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex items-center gap-2 focus:outline-none"
            >
              <img
                src={BRAND.logoSrc}
                alt={BRAND.name}
                className="w-9 h-9 object-contain rounded-md bg-black/40"
              />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                {BRAND.name}
              </span>
            </button>
            {isAuthenticated && user ? (
              <div className="relative md:hidden" data-header-account-root>
                <button
                  type="button"
                  aria-label={accountName}
                  aria-expanded={isAccountOpen}
                  aria-haspopup="menu"
                  title={accountName}
                  onClick={() => setIsAccountOpen((o) => !o)}
                  className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-white/50 bg-black/20 text-[15px] font-bold leading-none text-white shadow-md"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="relative z-[1] flex h-full w-full items-center justify-center bg-gradient-to-br from-[#ff8533] to-[#e65c00] text-white shadow-inner">
                      <UserRound className="absolute h-7 w-7 opacity-20 text-white" aria-hidden />
                      <span className="relative">{getUserInitial(user.displayName, user.fullName, user.email)}</span>
                    </span>
                  )}
                </button>
                {isAccountOpen && accountMenuInner ? (
                  <div
                    className="fixed right-3 top-[4.5rem] z-[100] w-[min(calc(100vw-1.5rem),300px)] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900 md:hidden"
                    role="menu"
                  >
                    {accountMenuInner}
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-[12px] font-semibold uppercase tracking-wide text-[#ff6600]"
              >
                {loginLabel}
              </Link>
            )}
          </div>
          {!(isAuthenticated && user) && (
            <div className="mt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => dispatch(setTheme(theme === "dark" ? "light" : "dark"))}
                aria-label={ariaTheme}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/15 bg-black/30 backdrop-blur
                           hover:bg-white/10 transition-colors"
              >
                {theme === "dark" ? (
                  <SunMedium className="w-4.5 h-4.5 text-white/85" aria-hidden />
                ) : (
                  <Moon className="w-4.5 h-4.5 text-white/85" aria-hidden />
                )}
              </button>
              <button
                type="button"
                onClick={() => dispatch(setLanguage(language === "vi" ? "en" : "vi"))}
                aria-label={ariaLanguage}
                className="inline-flex items-center gap-2 h-9 rounded-full border border-white/15 bg-black/30 backdrop-blur
                           px-3 text-[11px] font-semibold uppercase tracking-[0.18em]
                           hover:bg-white/10 transition-colors"
              >
                <Languages className="w-4 h-4 text-white/80" aria-hidden />
                <span className="text-white/90">{language === "vi" ? "VI" : "EN"}</span>
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* ===== MOBILE SLIDE PANEL ===== */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-79 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-80 w-[78%] max-w-xs
                      bg-neutral-950/95 border-r border-neutral-800 shadow-xl md:hidden
                      transform transition-transform duration-300 ease-out
                      ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 space-y-3 text-white">
          {navItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-[13px] font-medium tracking-wide ${
                  isActive
                    ? "bg-[#ff6600] text-white shadow-md shadow-[#ff6600]/35"
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
