import { createElement, lazy, Suspense } from "react";
import type { ReactElement } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminPageSkeleton from "../module/admin/layout/AdminPageSkeleton";
import App from "../App";
import { LegacyModuleWrapper } from "../module/admin/core/components/LegacyModuleWrapper";

const lazyHomePage = lazy(() => import("../module/home/pages/HomePage"));
const lazyDestinationDetailPage = lazy(
  () => import("../module/destinations/pages/DestinationDetailPage"),
);
const lazyDestinationsPage = lazy(
  () => import("../module/destinations/pages/DestinationsPage"),
);
const lazyToursPage = lazy(() => import("../module/tours/pages/ToursPage"));
const lazyTourCheckoutPage = lazy(
  () => import("../module/tours/pages/TourCheckoutPage"),
);
const lazyTourLegacyIdRedirect = lazy(
  () => import("../module/tours/pages/TourLegacyIdRedirect"),
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
const lazyRouteErrorPage = lazy(
  () => import("../components/error/RouteErrorPage"),
);
const lazyRequireAuthenticated = lazy(
  () => import("./guards/RequireAuthenticated"),
);
const lazyRequireManagerAccess = lazy(
  () => import("./guards/RequireManagerAccess"),
);
const lazyRequireRoles = lazy(() => import("./guards/RequireRoles"));
const lazyManagementLayout = lazy(
  () => import("../module/management/layouts/ManagementLayout"),
);
const lazyManagementLayoutNew = lazy(
  () => import("../components/layout/ManagementLayout"),
);
const lazyManagementToursPage = lazy(
  () => import("../module/management/tours/pages/ManagementToursPage"),
);
const lazyManagementHubPage = lazy(
  () => import("../module/management/pages/ManagementHubPage"),
);
const lazyDashboardOverview = lazy(
  () => import("../module/management/pages/DashboardOverview"),
);
const lazyManagementApiProbePage = lazy(
  () => import("../module/management/pages/ManagementApiProbePage"),
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
const lazyTourPublicDetailPage = lazy(
  () => import("../module/tours/pages/TourPublicDetailPage"),
);
const lazyBookingConfirmationPage = lazy(
  () => import("../module/bookings/pages/BookingConfirmationPage"),
);
const lazyPaymentReturnPage = lazy(
  () => import("../module/bookings/pages/PaymentReturnPage"),
);
const lazyMyBookingsPage = lazy(
  () => import("../module/bookings/pages/MyBookingsPage"),
);
const lazyServiceHubPage = lazy(
  () => import("../module/services/pages/ServiceHubPage"),
);
const lazyFlightsPage = lazy(
  () => import("../module/flights/pages/FlightsPage"),
);
const lazyHotelsPage = lazy(() => import("../module/hotels/pages/HotelsPage"));
const lazyCombosPage = lazy(() => import("../module/combos/pages/CombosPage"));
const lazyComboSearchResultsPage = lazy(
  () => import("../module/combos/pages/ComboSearchResultsPage"),
);
const lazyComboCatalogPage = lazy(
  () => import("../module/combos/pages/ComboCatalogPage"),
);
const lazyComboDetailPage = lazy(
  () => import("../module/combos/pages/ComboDetailPage"),
);
const lazyComboCheckoutPage = lazy(
  () => import("../module/combos/pages/ComboCheckoutPage"),
);
const lazyHotelSearchResultsPage = lazy(
  () => import("../module/hotels/pages/HotelSearchResultsPage"),
);
const lazyHotelDetailPage = lazy(
  () => import("../module/hotels/pages/HotelDetailPage"),
);
const lazyHotelCheckoutPage = lazy(
  () => import("../module/hotels/pages/HotelCheckoutPage"),
);
const lazyHotelPaymentSuccessPage = lazy(
  () => import("../module/hotels/pages/HotelPaymentSuccessPage"),
);
const lazyFlightSearchResultsPage = lazy(
  () => import("../module/flights/pages/FlightSearchResultsPage"),
);
const lazyFlightCheckoutPage = lazy(
  () => import("../module/flights/pages/FlightCheckoutPage"),
);
const lazyFlightPaymentSuccessPage = lazy(
  () => import("../module/flights/pages/FlightPaymentSuccessPage"),
);
const lazyManagementBookingsPage = lazy(
  () => import("../module/management/bookings/pages/ManagementBookingsPage"),
);

// Admin Module v3 (New Architecture)
const lazyAdminLayout = lazy(
  () => import("../module/admin/layout/AdminLayout"),
);
const lazyAdminDashboardPage = lazy(
  () => import("../module/admin/pages/AdminDashboardPage"),
);
const lazyAdminHotelsPage = lazy(
  () => import("../module/admin/features/hotels/pages/HotelPage"),
);
const lazyAdminFlightsPage = lazy(
  () => import("../module/admin/features/flights/pages/FlightPage"),
);
const lazyAdminCombosPage = lazy(
  () => import("../module/admin/features/combos/pages/ComboPage"),
);
const lazyAdminDestinationsPage = lazy(
  () => import("../module/admin/features/destinations/pages/DestinationPage"),
);
const lazyAdminToursPage = lazy(
  () => import("../module/admin/features/tours/pages/ToursPage"),
);
const lazyAdminBookingsPage = lazy(
  () => import("../module/admin/features/bookings/pages/BookingsPage"),
);
const lazyAdminSettingsPage = lazy(
  () => import("../module/admin/features/settings/pages/SettingsPage"),
);
const lazyAdminUsersPage = lazy(
  () => import("../module/admin/features/users/pages/UsersPage"),
);

const withSuspense = (element: ReactElement) => (
  <Suspense fallback={<AdminPageSkeleton />}>{element}</Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: withSuspense(createElement(lazyRouteErrorPage)),
    children: [
      { index: true, element: withSuspense(createElement(lazyHomePage)) },
      {
        path: "destinations/branch/:programSlug",
        element: withSuspense(createElement(lazyDestinationsPage)),
      },
      {
        path: "destinations",
        element: withSuspense(createElement(lazyDestinationsPage)),
      },
      {
        path: "destinations/:uuid",
        element: withSuspense(createElement(lazyDestinationDetailPage)),
      },
      {
        path: "tours",
        element: withSuspense(createElement(lazyToursPage)),
      },
      {
        path: "tours/checkout",
        element: withSuspense(createElement(lazyTourCheckoutPage)),
      },
      {
        path: "flights",
        element: withSuspense(createElement(lazyFlightsPage)),
      },
      {
        path: "flights/search",
        element: withSuspense(createElement(lazyFlightSearchResultsPage)),
      },
      {
        path: "flights/checkout",
        element: withSuspense(createElement(lazyFlightCheckoutPage)),
      },
      {
        path: "flights/success",
        element: withSuspense(createElement(lazyFlightPaymentSuccessPage)),
      },
      {
        path: "hotels",
        element: withSuspense(createElement(lazyHotelsPage)),
      },
      {
        path: "hotels/all",
        element: <Navigate to="/hotels/search" replace />,
      },
      {
        path: "hotels/search",
        element: withSuspense(createElement(lazyHotelSearchResultsPage)),
      },
      {
        path: "hotels/checkout",
        element: withSuspense(createElement(lazyHotelCheckoutPage)),
      },
      {
        path: "hotels/success",
        element: withSuspense(createElement(lazyHotelPaymentSuccessPage)),
      },
      {
        path: "hotels/:id",
        element: withSuspense(createElement(lazyHotelDetailPage)),
      },
      {
        path: "combos",
        element: withSuspense(createElement(lazyCombosPage)),
      },
      {
        path: "combos/search",
        element: withSuspense(createElement(lazyComboSearchResultsPage)),
      },
      {
        path: "combos/all",
        element: withSuspense(createElement(lazyComboCatalogPage)),
      },
      {
        path: "combos/checkout",
        element: withSuspense(createElement(lazyComboCheckoutPage)),
      },
      {
        path: "combos/:id",
        element: withSuspense(createElement(lazyComboDetailPage)),
      },
      {
        path: "car-rental",
        element: withSuspense(createElement(lazyServiceHubPage)),
      },
      {
        path: "visa",
        element: withSuspense(createElement(lazyServiceHubPage)),
      },
      {
        // Public tour detail — slug-friendly URL
        // /tour/:slug (slug encode id ở cuối, vd: halong-bay-3-days-42)
        path: "tour/:slug",
        element: withSuspense(createElement(lazyTourPublicDetailPage)),
      },
      {
        // URL cũ từ homepage — chuyển sang chi tiết public
        path: "tours/:id",
        element: withSuspense(createElement(lazyTourLegacyIdRedirect)),
      },
      {
        element: withSuspense(createElement(lazyRequireAuthenticated)),
        children: [
          {
            path: "bookings/:id",
            element: withSuspense(createElement(lazyBookingDetailPage)),
          },
          {
            // Phase 7 — confirmation sau khi tạo booking thành công
            path: "booking-confirmation/:bookingId",
            element: withSuspense(createElement(lazyBookingConfirmationPage)),
          },
          {
            // Phase 8 — VNPay return URL
            path: "payment/vnpay-return",
            element: withSuspense(createElement(lazyPaymentReturnPage)),
          },
          {
            // Phase 8 — danh sách booking của user hiện tại
            path: "my-bookings",
            element: withSuspense(createElement(lazyMyBookingsPage)),
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
                element: withSuspense(createElement(lazyDashboardOverview)),
              },
              {
                path: "system-api-probe",
                element: withSuspense(
                  createElement(lazyManagementApiProbePage),
                ),
              },
              {
                path: "developer-hub",
                element: withSuspense(createElement(lazyManagementHubPage)),
              },
              {
                path: "users",
                element: withSuspense(
                  createElement(lazyManagementSystemPage, { pageId: "users" }),
                ),
              },
              {
                path: "roles",
                element: withSuspense(
                  createElement(lazyManagementSystemPage, { pageId: "roles" }),
                ),
              },
              {
                path: "permissions",
                element: withSuspense(
                  createElement(lazyManagementSystemPage, {
                    pageId: "permissions",
                  }),
                ),
              },
              {
                path: "audit-logs",
                element: withSuspense(createElement(lazyManagementAuditPage)),
              },
              {
                path: "destinations",
                element: withSuspense(
                  createElement(lazyManagementDestinationPage),
                ),
              },
              {
                path: "tours",
                element: withSuspense(createElement(lazyManagementToursPage)),
              },
              {
                path: "schedules",
                element: withSuspense(
                  createElement(lazyManagementTourPage, { mode: "schedules" }),
                ),
              },
              {
                path: "bookings",
                element: withSuspense(
                  createElement(lazyManagementBookingsPage),
                ),
              },
              {
                path: "payments",
                element: withSuspense(
                  createElement(lazyManagementModulePage, {
                    pageId: "payments",
                  }),
                ),
              },
              {
                path: "refunds",
                element: withSuspense(
                  createElement(lazyManagementModulePage, {
                    pageId: "refunds",
                  }),
                ),
              },
              {
                path: "support",
                element: withSuspense(createElement(lazyManagementSupportPage)),
              },
              {
                path: "promotions",
                element: withSuspense(
                  createElement(lazyManagementPromotionPage),
                ),
              },
              {
                path: "reviews",
                element: withSuspense(
                  createElement(lazyManagementModulePage, {
                    pageId: "reviews",
                  }),
                ),
              },
              {
                path: "notifications",
                element: withSuspense(
                  createElement(lazyManagementModulePage, {
                    pageId: "notifications",
                  }),
                ),
              },
              {
                path: "reports",
                element: withSuspense(
                  createElement(lazyManagementModulePage, {
                    pageId: "reports",
                  }),
                ),
              },
              {
                path: ":roleCode",
                element: withSuspense(createElement(lazyManagementHubPage)),
              },
            ],
          },
        ],
      },
      {
        // Backoffice v2 (Tailwind layout, tự bọc 2 lớp guard)
        // Đặt ngoài cây `management/*` legacy để không phá routes hiện hữu.
        path: "management/tours-v2",
        element: withSuspense(createElement(lazyManagementLayoutNew)),
        children: [
          {
            index: true,
            element: withSuspense(createElement(lazyManagementToursPage)),
          },
        ],
      },
      {
        // Phase 8 — Backoffice booking management (tự bọc guards)
        path: "management/bookings-v2",
        element: withSuspense(createElement(lazyManagementLayoutNew)),
        children: [
          {
            index: true,
            element: withSuspense(createElement(lazyManagementBookingsPage)),
          },
        ],
      },
      {
        element: withSuspense(createElement(lazyRequireManagerAccess)),
        children: [
          {
            // New Admin Architecture Router
            path: "admin",
            element: withSuspense(createElement(lazyAdminLayout)),
            children: [
              {
                index: true,
                element: withSuspense(createElement(lazyAdminDashboardPage)),
              },
              {
                path: "destinations",
                element: withSuspense(createElement(lazyAdminDestinationsPage)),
              },
              {
                path: "tours",
                element: withSuspense(createElement(lazyAdminToursPage)),
              },
              {
                element: withSuspense(
                  createElement(lazyRequireRoles, {
                    roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR"],
                  }),
                ),
                children: [
                  {
                    path: "users",
                    element: withSuspense(createElement(lazyAdminUsersPage)),
                  },
                ],
              },
              {
                element: withSuspense(
                  createElement(lazyRequireRoles, {
                    roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR", "FIELD_STAFF"],
                  }),
                ),
                children: [
                  {
                    path: "bookings",
                    element: withSuspense(createElement(lazyAdminBookingsPage)),
                  },
                ],
              },
              {
                element: withSuspense(
                  createElement(lazyRequireRoles, {
                    roles: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"],
                  }),
                ),
                children: [
                  {
                    path: "hotels",
                    element: withSuspense(createElement(lazyAdminHotelsPage)),
                  },
                  {
                    path: "flights",
                    element: withSuspense(createElement(lazyAdminFlightsPage)),
                  },
                  {
                    path: "combos",
                    element: withSuspense(createElement(lazyAdminCombosPage)),
                  },
                ],
              },
              {
                element: withSuspense(
                  createElement(lazyRequireRoles, {
                    roles: ["SUPER_ADMIN", "ADMIN"],
                  }),
                ),
                children: [
                  {
                    path: "settings",
                    element: withSuspense(createElement(lazyAdminSettingsPage)),
                  },
                ],
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
