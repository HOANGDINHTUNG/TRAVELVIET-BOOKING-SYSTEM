import { createElement, lazy, Suspense } from "react";
import type { ReactElement } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";

const lazyHomePage = lazy(() => import("../module/home/pages/HomePage"));
const lazyDestinationDetailPage = lazy(
  () => import("../module/destinations/pages/DestinationDetailPage"),
);
const lazyTourDetailPage = lazy(
  () => import("../module/tours/pages/TourDetailPage"),
);
const lazyBookingDetailPage = lazy(
  () => import("../module/bookings/pages/BookingDetailPage"),
);
const lazyAccountPage = lazy(
  () => import("../module/account/pages/AccountPage"),
);
const lazySupportCenterPage = lazy(
  () => import("../module/support/pages/SupportCenterPage"),
);
const lazyPassportPage = lazy(
  () => import("../module/loyalty/pages/PassportPage"),
);
const lazyScheduleChatPage = lazy(
  () => import("../module/scheduleChat/pages/ScheduleChatPage"),
);
const lazyAuthLayout = lazy(() => import("../module/auth/layouts/AuthLayout"));
const lazyLoginPage = lazy(() => import("../module/auth/pages/LoginPage"));
const lazyRegisterPage = lazy(
  () => import("../module/auth/pages/RegisterPage"),
);
const lazyNotFoundPage = lazy(() => import("../components/error/NotFoundPage"));
const lazyRequireAuthenticated = lazy(
  () => import("./RequireAuthenticated"),
);
const lazyRequireManagerAccess = lazy(() => import("./RequireManagerAccess"));
const lazyManagementLayout = lazy(
  () => import("../module/management/layouts/ManagementLayout"),
);
const lazyManagementHubPage = lazy(
  () => import("../module/management/pages/ManagementHubPage"),
);
const lazyManagementModulePage = lazy(
  () => import("../module/management/pages/ManagementModulePage"),
);
const lazyManagementSystemPage = lazy(
  () => import("../module/management/pages/ManagementSystemPage"),
);
const lazyManagementAuditPage = lazy(
  () => import("../module/management/pages/ManagementAuditPage"),
);
const lazyManagementDestinationPage = lazy(
  () => import("../module/management/pages/ManagementDestinationPage"),
);
const lazyManagementTourPage = lazy(
  () => import("../module/management/pages/ManagementTourPage"),
);
const lazyManagementSupportPage = lazy(
  () => import("../module/management/pages/ManagementSupportPage"),
);
const lazyManagementPromotionPage = lazy(
  () => import("../module/management/pages/ManagementPromotionPage"),
);

const withSuspense = (element: ReactElement) => (
  <Suspense fallback={<div className="min-h-screen">Đang tải...</div>}>
    {element}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: withSuspense(createElement(lazyNotFoundPage)),
    children: [
      { index: true, element: withSuspense(createElement(lazyHomePage)) },
      {
        element: withSuspense(createElement(lazyRequireAuthenticated)),
        children: [
          {
            path: "destinations/:uuid",
            element: withSuspense(createElement(lazyDestinationDetailPage)),
          },
          {
            path: "tours/:id",
            element: withSuspense(createElement(lazyTourDetailPage)),
          },
          {
            path: "bookings/:id",
            element: withSuspense(createElement(lazyBookingDetailPage)),
          },
          {
            path: "account",
            element: withSuspense(createElement(lazyAccountPage)),
          },
          {
            path: "support",
            element: withSuspense(createElement(lazySupportCenterPage)),
          },
          {
            path: "passport",
            element: withSuspense(createElement(lazyPassportPage)),
          },
          {
            path: "schedules/:scheduleId/chat",
            element: withSuspense(createElement(lazyScheduleChatPage)),
          },
        ],
      },
      {
        element: withSuspense(createElement(lazyAuthLayout)),
        children: [
          {
            path: "login",
            element: withSuspense(createElement(lazyLoginPage)),
          },
          {
            path: "register",
            element: withSuspense(createElement(lazyRegisterPage)),
          },
        ],
      },
      {
        element: withSuspense(createElement(lazyRequireManagerAccess)),
        children: [
          {
            path: "management",
            element: withSuspense(createElement(lazyManagementLayout)),
            children: [
              {
                index: true,
                element: <Navigate to="dashboard" replace />,
              },
              {
                path: "dashboard",
                element: withSuspense(createElement(lazyManagementHubPage)),
              },
              {
                path: "users",
                element: withSuspense(createElement(lazyManagementSystemPage, { pageId: "users" })),
              },
              {
                path: "roles",
                element: withSuspense(createElement(lazyManagementSystemPage, { pageId: "roles" })),
              },
              {
                path: "permissions",
                element: withSuspense(createElement(lazyManagementSystemPage, { pageId: "permissions" })),
              },
              {
                path: "audit-logs",
                element: withSuspense(createElement(lazyManagementAuditPage)),
              },
              {
                path: "destinations",
                element: withSuspense(createElement(lazyManagementDestinationPage)),
              },
              {
                path: "tours",
                element: withSuspense(createElement(lazyManagementTourPage, { mode: "tours" })),
              },
              {
                path: "schedules",
                element: withSuspense(createElement(lazyManagementTourPage, { mode: "schedules" })),
              },
              {
                path: "bookings",
                element: withSuspense(createElement(lazyManagementModulePage, { pageId: "bookings" })),
              },
              {
                path: "payments",
                element: withSuspense(createElement(lazyManagementModulePage, { pageId: "payments" })),
              },
              {
                path: "refunds",
                element: withSuspense(createElement(lazyManagementModulePage, { pageId: "refunds" })),
              },
              {
                path: "support",
                element: withSuspense(createElement(lazyManagementSupportPage)),
              },
              {
                path: "promotions",
                element: withSuspense(createElement(lazyManagementPromotionPage)),
              },
              {
                path: "reviews",
                element: withSuspense(createElement(lazyManagementModulePage, { pageId: "reviews" })),
              },
              {
                path: "notifications",
                element: withSuspense(createElement(lazyManagementModulePage, { pageId: "notifications" })),
              },
              {
                path: "reports",
                element: withSuspense(createElement(lazyManagementModulePage, { pageId: "reports" })),
              },
              {
                path: ":roleCode",
                element: withSuspense(createElement(lazyManagementHubPage)),
              },
            ],
          },
        ],
      },
      { path: "*", element: withSuspense(createElement(lazyNotFoundPage)) },
    ],
  },
]);

export default router;
