import { createElement, lazy, Suspense } from "react";
import type { ReactElement } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";

const lazyHomePage = lazy(() => import("../module/home/pages/HomePage"));
const lazyDestinationDetailPage = lazy(
  () => import("../module/destinations/pages/DestinationDetailPage"),
);
const lazyDestinationsPage = lazy(
  () => import("../module/destinations/pages/DestinationsPage"),
);
const lazyToursPage = lazy(() => import("../module/tours/pages/ToursPage"));
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
const lazyManageDestinationsPage = lazy(
  () => import("../module/management/pages/ManageDestinationsPage"),
);
const lazyManageToursPage = lazy(
  () => import("../module/management/pages/ManageToursPage"),
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
        path: "destinations",
        element: withSuspense(createElement(lazyDestinationsPage)),
      },
      {
        path: "tours",
        element: withSuspense(createElement(lazyToursPage)),
      },
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
                element: withSuspense(createElement(lazyManagementHubPage)),
              },
              {
                path: "destinations",
                element: withSuspense(createElement(lazyManageDestinationsPage)),
              },
              {
                path: "tours",
                element: withSuspense(createElement(lazyManageToursPage)),
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
