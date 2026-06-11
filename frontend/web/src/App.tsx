import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import { SiteFabStack } from "./components/fab/SiteFabStack";
import ScrollToTop from "./components/common/ux/ScrollToTop";
import Header from "./components/header/Header";
import { SiteMotion } from "./components/Motion/SiteMotion";
import { PublicCommandPalette } from "./components/command/PublicCommandPalette";
import { LoginWelcomeAnimation } from "./module/auth/components/LoginWelcome/LoginWelcomeAnimation";
import { useAppSelector } from "./hooks/reduxHooks";
import { LenisProvider } from "./providers/LenisProvider";
import { resolveHeaderVariant } from "./components/header/headerVariant";
import { syncBrowserTabTitle } from "./stores/aiChatNotificationStore";

/**
 * App shell:
 * - Public pages: bọc trong `LenisProvider` để có smooth scroll mượt + parallax đồng bộ
 *   với GSAP `ScrollTrigger`.
 * - Management pages: KHÔNG smooth-scroll (admin shell có scroll container riêng).
 * - Trang `/login` & `/register`: vẫn smooth-scroll nhẹ nhưng ẩn Header/FAB để tập trung.
 */
function App() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const { theme, language } = useAppSelector((state) => state.preferences);
  const isAdminPage = location.pathname.startsWith("/admin");
  const isTourPublicDetailPage = location.pathname.startsWith("/tour/");
  const isAuthPublicPage =
    location.pathname === "/login" || location.pathname === "/register";
  const isHeaderOverlayPage =
    resolveHeaderVariant(location.pathname) === "over-hero";

  useEffect(() => {
    document.documentElement.lang = language;
    void i18n.changeLanguage(language);
  }, [i18n, language]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("theme-dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    syncBrowserTabTitle(0);
  }, []);

  const mainContent = (
    <main className="min-h-screen bg-background text-foreground">
      <div
        className={
          isAuthPublicPage
            ? "min-h-screen"
            : isHeaderOverlayPage
              ? "min-h-[90vh]"
              : isTourPublicDetailPage
                ? "min-h-[90vh] pt-12 md:pt-14"
                : "min-h-[90vh] pt-[var(--site-header-height)]"
        }
      >
        <Outlet />
      </div>
    </main>
  );

  const publicShell = (
    <>
      <ScrollToTop />
      {!isAuthPublicPage && <Header />}
      <LenisProvider>{mainContent}</LenisProvider>
      <SiteMotion />
      <SiteFabStack />
    </>
  );

  return (
    <div
      className={`app-shell theme-${theme} ${theme === "dark" ? "dark" : ""} lang-${language} min-h-screen`}
    >
      {isAdminPage ? (
        <>
          <ScrollToTop />
          <main className="min-h-screen bg-transparent text-foreground">
            <Outlet />
          </main>
        </>
      ) : (
        // Public site: bọc trong PublicCommandPalette ⇒ mọi component con đều
        // dùng được `useCommandPalette()`, đồng thời shortcut Cmd/Ctrl+K
        // hoạt động toàn site (palette tự lắng nghe `keydown`).
        <PublicCommandPalette>{publicShell}</PublicCommandPalette>
      )}
      {!isAuthPublicPage ? <LoginWelcomeAnimation /> : null}
    </div>
  );
}

export default App;
