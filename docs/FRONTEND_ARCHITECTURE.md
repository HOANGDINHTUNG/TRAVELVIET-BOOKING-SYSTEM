# FRONTEND_ARCHITECTURE.md — TravelViet Booking System

> **Vai trò tài liệu:** Bản thiết kế kiến trúc frontend (Web + Mobile) khớp với backend `Spring Boot 4.0.x` đang vận hành.
> **Nguồn tham chiếu:**
>
> - `backend/BACKEND_OVERVIEW.md` — kiến trúc, audit, RBAC seed.
> - `backend/API_DOCUMENTATION.md` — contract `ApiResponse<T>`, `PageResponse<T>`, `Accept-Language`, mã lỗi `api.error.*`.
> - `frontend/web/README.md` (lược đồ MovieZone tham khảo) + mã hiện tại (`src/utils/axiosInstance.ts`, `src/utils/authSessionStorage.ts`, `src/router/*`, `src/lib/i18n.ts`, `src/stores/index.ts`).
> - `frontend/web/docs/BACKOFFICE_NEXT_PHASE.md` — yêu cầu CRUD backoffice.
> - `frontend/mobile/package.json` — Expo SDK 54 + Expo Router 6 + RN 0.81.
>
> **Quy ước:**
>
> - “**Hiện trạng**” = mô tả những gì đã có trong code (đã xác minh).
> - “**Đề xuất**” = thay đổi/mở rộng theo lộ trình (chưa có hoặc cần chuẩn hoá).
> - Mục `Notes cho phiên sau` ở cuối file ghi nhanh các điểm cần kiểm tra lại để các lần thao tác sau nhanh hơn.

---

## 0. Hiện trạng đã verify (đọc thẳng từ code)


| Vùng               | Hiện trạng                                                                                                                                                                       | Vị trí                                           |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Web — bundler      | Vite 8 + plugin React 6 (SWC variant chưa dùng)                                                                                                                                  | `frontend/web/vite.config.ts`                    |
| Web — UI           | React **19.2**, Tailwind CSS **v4** (qua `@tailwindcss/vite`), GSAP, lucide / react-icons                                                                                        | `frontend/web/package.json`                      |
| Web — routing      | `react-router-dom v7` + `createBrowserRouter` + lazy + `RequireAuthenticated` / `RequireManagerAccess`                                                                           | `frontend/web/src/router/index.tsx`              |
| Web — state        | Redux Toolkit `^2.11`, mới chỉ có 2 slice (`home`, `preferences`)                                                                                                                | `frontend/web/src/stores/index.ts`               |
| Web — fetching     | Axios `^1.15` instance đơn (`axiosBackend`), interceptor request gắn `Authorization` + `Accept-Language` từ `navigator.language`; interceptor response tự refresh token 401      | `frontend/web/src/utils/axiosInstance.ts`        |
| Web — API client   | Wrapper `requestBackendData()` tự gọi `unwrapApiResponse()` để bóc `ApiResponse<T>`                                                                                              | `frontend/web/src/api/server/serverApiClient.ts` |
| Web — i18n         | `i18next ^26` + `react-i18next ^17`, **resource đang viết inline trong `src/lib/i18n.ts`** (không tách JSON)                                                                     | `frontend/web/src/lib/i18n.ts`                   |
| Web — auth storage | Token + user lưu `**sessionStorage` + `localStorage` (legacy)**; có event bus `travelviet:login` / `travelviet:logout` / `travelviet:token-refresh`                              | `frontend/web/src/utils/authSessionStorage.ts`   |
| Web — module       | Đã theo **feature-based**: `src/module/{auth,home,destinations,tours,bookings,management,...}`                                                                                   | `frontend/web/src/module/*`                      |
| Mobile             | **Expo SDK 54** + **Expo Router 6** + **React Native 0.81** + `react-native-paper`, chỉ có vài screen mẫu (`Home`, `Checkout`)                                                   | `frontend/mobile/package.json`                   |
| Backend contract   | `ApiResponse<T> { success, message, data }`, lỗi qua `ErrorResponse` + `errorCode`, header `Accept-Language` (default `vi`), response có `Content-Language` (đã expose qua CORS) | `backend/API_DOCUMENTATION.md §0, §2.5`          |


> **Khoảng cách lớn cần lấp:** hiện chưa có **TanStack Query**, chưa có **react-hook-form + zod**, chưa có **toast / error boundary backoffice** (đã ghi trong `BACKOFFICE_NEXT_PHASE.md` mục 4), chưa có **token introspection theo permission** (hiện chỉ check role code), chưa có **CRUD page** đầy đủ cho `Bookings/Refunds/Payments/Reviews`.

---

## 1. Tổng quan Tech Stack & Thư viện lõi

### 1.1 Mục tiêu đối khớp Backend


| Yêu cầu từ Backend                                                | Lựa chọn FE                                                                                                                                                                                        | Lý do chọn                                                                                                                                                                                                          |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ApiResponse<T>` & `PageResponse<T>` đồng nhất                    | **Axios + lớp `serverApiClient` + `unwrapApiResponse<T>()`** đã có; **nâng cấp** bằng **TanStack Query v5** để cache / dedupe / pagination                                                         | Query lo `loading/error/cache/staleTime`; client wrapper lo bóc `data` ra khỏi envelope ⇒ giữ contract backend nhất quán mà code component sạch.                                                                    |
| Header `Accept-Language: vi/en`, lỗi `api.error.*` đã dịch        | `**i18next` + `react-i18next` + `i18next-http-backend`** (đã có `i18next` trong `package.json`)                                                                                                    | Cùng dùng locale tag (`vi`, `en`); FE chỉ cần `i18n.changeLanguage()` rồi axios interceptor tự bơm header (hiện đang lấy từ `navigator.language` — **đề xuất** đọc từ `i18n.language` để khớp lựa chọn người dùng). |
| RBAC theo **permission** (`@PreAuthorize`)                        | **Hook `usePermissions()` + `<Can permission="..." />`**, lấy `roles[]` từ `AuthResponse.user`; bổ sung endpoint backend `GET /users/me/permissions` (đã đề nghị trong `BACKOFFICE_NEXT_PHASE.md`) | Tách bạch UI gating khỏi logic role hard-code; mở đường gắn quyền chi tiết khi BE expose permission list.                                                                                                           |
| JWT Bearer + refresh                                              | **Axios interceptor + single-flight refresh** (đã có `refreshPromise` ở `axiosInstance.ts`); token lưu storage tách biệt                                                                           | Tránh race condition khi nhiều request 401 cùng lúc; dùng `Event` bus để Provider bên ngoài (Zustand/Query) clear cache khi logout.                                                                                 |
| Validation Bean Validation BE                                     | `**react-hook-form` v7 + `@hookform/resolvers/zod` + `zod`**                                                                                                                                       | Schema zod tái dùng cho DTO BE; render lỗi field-level; map mã `api.error.*` từ BE sang field error qua middleware.                                                                                                 |
| Server-side pagination (`page/size/sort`)                         | **TanStack Query `keepPreviousData` + `useInfiniteQuery`** cho list dài (Tours, Notifications, Reviews)                                                                                            | Khớp `PageResponse<T>` (`page, size, totalElements, last`) — ánh xạ trực tiếp.                                                                                                                                      |
| Form multipart (admin destination upload `imageFiles/videoFiles`) | `**FormData` builder + `axios` (default JSON, override `Content-Type: multipart/form-data`)**                                                                                                      | BE đã hỗ trợ multipart; cần helper `appendJsonPart()` để bọc `destination` JSON theo chuẩn Spring.                                                                                                                  |
| Realtime chat (`/schedules/{id}/chat-room`)                       | **Polling 5–10s qua `useQuery({ refetchInterval })`** ở giai đoạn 1; **WebSocket/STOMP** khi BE bật STOMP/SSE                                                                                      | BE chưa expose WS — polling đủ MVP, dễ thay khi có `/ws`.                                                                                                                                                           |


### 1.2 Stack đầy đủ (đã chốt)

**Web (`frontend/web`)**

- **Core:** React 19.2, TypeScript 5.9, Vite 8 + `@vitejs/plugin-react`, Tailwind CSS v4.
- **Routing:** `react-router-dom` v7 (data router, lazy + `Suspense`).
- **State:**
  - **Server state:** **TanStack Query v5** (`@tanstack/react-query`, `@tanstack/react-query-devtools`).
  - **Global UI state nhỏ gọn:** **Zustand v5** (auth slice, locale slice, layout/theme) — thay dần Redux Toolkit khi không cần middleware phức tạp; **giữ Redux Toolkit** cho domain hiện tại (`home`, `preferences`) đến khi migrate xong.
  - **Local form state:** `react-hook-form` + `zod`.
- **Networking:** Axios `^1.15` (giữ instance hiện tại) + `axios-retry` (idempotent GET).
- **i18n:** `i18next` + `react-i18next` + `i18next-http-backend` (tách JSON: `public/locales/{vi,en}/{common,errors,booking,tour,...}.json`).
- **UI primitives:** Tailwind v4 + **Radix UI** (Dialog, Popover, DropdownMenu) + `lucide-react` (đã có) + `cva` (`class-variance-authority`) cho variant.
- **Toast / Notification:** `sonner` (lightweight, accessible).
- **Date / Money:** `date-fns` + `date-fns-tz`; format tiền VND qua `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`.
- **Animation hiện có:** GSAP — giữ cho hero/landing; phần app dùng `framer-motion` cho micro-interaction.
- **Test:** **Vitest** + **@testing-library/react** + **MSW** (mock REST khớp `ApiResponse`).
- **Lint/format:** ESLint 9 (đã có) + `eslint-plugin-react-hooks` + `eslint-plugin-tanstack-query` + Prettier.

**Mobile (`frontend/mobile`)**

- Expo SDK 54, Expo Router v6, React Native 0.81, React Native Paper, `expo-secure-store` (lưu refresh token).
- Tái dùng cùng **TanStack Query v5** + cùng **zod schema** với web (gói `packages/shared` ở roadmap §6).
- Axios instance riêng (vì baseURL/timeout khác) nhưng cùng pattern interceptor.

### 1.3 Lý giải các lựa chọn “khó” nhất

- **TanStack Query thay vì Redux Thunk:** server state có vòng đời riêng (TTL, refetch theo focus/online). Dùng Redux cho server state khiến boilerplate nhiều và cache không thông minh; Query lo cache key + invalidation theo entity (`['tours', filters]`, `['booking', id]`).
- **Zustand bên cạnh Redux Toolkit (giai đoạn chuyển tiếp):** Redux đã có 2 slice — không cần xoá ngay. Module mới **dùng Zustand** (đặc biệt `auth`, `ui`). Khi `home/preferences` rảnh tay sẽ migrate dần.
- **i18next thay vì FormatJS:** BE đã trả message đã dịch theo locale (`Content-Language`). FE chỉ cần i18next cho UI label + map `api.error.`* → label dự phòng khi mất kết nối / fallback. i18next có sẵn (`package.json`).
- **react-hook-form + zod:** zod schema = single source of truth, vừa validate FE vừa generate type (`z.infer`). Match với Bean Validation BE (BE vẫn là nguồn cuối cùng).

---

## 2. Cấu trúc thư mục (Folder Structure)

> **Triết lý:** Feature-based theo domain BE (`auth`, `tours`, `bookings`, `payments`, …) — phù hợp với `module/`* đã có. Bên trong mỗi feature có **layered structure** (`api`, `pages`, `components`, `hooks`, `store`, `types`, `validation`, `utils`).
> Atomic Design **không áp dụng đồng bộ toàn dự án** vì FE phần lớn là form/list/dashboard — chỉ áp dụng nội bộ trong `src/components/ui` (atoms) và `src/components/common` (molecules/organisms dùng chung).

### 2.1 Cấu trúc khuyến nghị (Web)

```text
frontend/web/
├── public/
│   └── locales/
│       ├── vi/
│       │   ├── common.json
│       │   ├── errors.json        # map api.error.* → message FE fallback
│       │   ├── auth.json
│       │   ├── booking.json
│       │   ├── tour.json
│       │   └── management.json
│       └── en/ (...)
├── src/
│   ├── main.tsx
│   ├── App.tsx                    # shell (Navbar/Outlet/Footer)
│   ├── app/                       # provider/composition root
│   │   ├── AppProviders.tsx       # QueryClient, Redux/Zustand, I18n, Toast, ErrorBoundary
│   │   ├── queryClient.ts         # cấu hình TanStack Query mặc định
│   │   └── theme.ts
│   ├── router/
│   │   ├── index.tsx              # createBrowserRouter
│   │   ├── routes.tsx             # khai báo route theo feature (lazy)
│   │   ├── guards/
│   │   │   ├── RequireAuthenticated.tsx
│   │   │   ├── RequireManagerAccess.tsx
│   │   │   └── RequirePermission.tsx
│   │   └── paths.ts               # constant URL (tránh magic string)
│   ├── lib/                       # third-party setup
│   │   ├── i18n.ts                # init i18next (load JSON từ /locales)
│   │   ├── axios.ts               # tạo instance + interceptor (chuyển từ utils/axiosInstance.ts)
│   │   ├── apiClient.ts           # wrapper unwrapApiResponse + typed helpers
│   │   └── env.ts                 # parse import.meta.env qua zod
│   ├── api/
│   │   └── (giữ kiểu hiện tại: nhóm theo domain, mỗi file 1 nhóm endpoint)
│   ├── components/
│   │   ├── ui/                    # atoms: Button, Input, Badge, Spinner (cva)
│   │   ├── common/                # molecules: DataTable, Pagination, EmptyState, ErrorBlock
│   │   ├── layout/                # Header, Footer, ManagementSidebar, AppShell
│   │   └── feedback/              # Toaster, ErrorBoundary, ConfirmDialog
│   ├── hooks/
│   │   ├── reduxHooks.ts          # legacy (typed hooks đã có)
│   │   ├── useAuth.ts             # đọc/ghi auth từ Zustand
│   │   ├── usePermission.ts       # check permission/role
│   │   ├── useApiQuery.ts         # wrap useQuery để map ApiResponse error
│   │   └── useApiMutation.ts
│   ├── stores/                    # Zustand slices (global UI/auth)
│   │   ├── authStore.ts
│   │   ├── localeStore.ts
│   │   └── layoutStore.ts
│   ├── module/                    # FEATURE LAYER (đã có pattern)
│   │   ├── auth/
│   │   │   ├── api/               # endpoint client (Auth.api.ts hiện có)
│   │   │   ├── hooks/             # useLoginMutation, useRegisterMutation, useRefreshSession
│   │   │   ├── pages/             # LoginPage, RegisterPage, ForgotPasswordPage
│   │   │   ├── components/        # AuthLayout, LoginForm, RegisterForm
│   │   │   ├── validation/        # loginSchema.ts, registerSchema.ts (zod)
│   │   │   ├── types/             # AuthUser, AuthResponse, ManagerRoleCode
│   │   │   └── utils/             # tokenStorage (đã có authSessionStorage)
│   │   ├── tours/
│   │   │   ├── api/, hooks/, pages/, components/, types/, validation/
│   │   ├── bookings/
│   │   ├── payments/
│   │   ├── refunds/
│   │   ├── reviews/
│   │   ├── destinations/
│   │   ├── promotions/            # vouchers + campaigns
│   │   ├── loyalty/               # passport + missions + badges
│   │   ├── notifications/
│   │   ├── support/               # user-side
│   │   ├── scheduleChat/
│   │   ├── ai/                    # AI Chat box (đang trong components/ai)
│   │   └── management/            # backoffice (đã có) — sub-module theo role
│   │       ├── shared/            # DataTable, Filter, RoleGate
│   │       ├── users/, roles/, audit/
│   │       ├── tours/, schedules/
│   │       ├── bookings/, payments/, refunds/
│   │       ├── promotions/, vouchers/
│   │       ├── support/, notifications/
│   │       └── reports/
│   ├── types/
│   │   ├── api.ts                 # ApiResponse, PageResponse, ApiErrorBody
│   │   └── envelope.ts
│   ├── constants/
│   │   ├── enums.ts               # mirror BE enum (BookingStatus, RefundStatus, ...)
│   │   ├── permissions.ts         # const string permission names
│   │   └── preferences.ts (đã có)
│   ├── utils/
│   │   ├── format/                # currency, date, phone
│   │   ├── http/                  # buildQueryParams, multipartFormData
│   │   └── runtime/               # guards, debounce, retry
│   ├── styles/                    # tailwind base + theme
│   └── test/
│       ├── setup.ts               # MSW + i18n test bootstrap
│       ├── mocks/
│       │   ├── handlers.ts        # MSW handler khớp ApiResponse
│       │   └── server.ts
│       └── factories/             # tạo dữ liệu mẫu khớp DTO
└── ...
```

### 2.2 Quy ước đặt tên

- **File component:** `PascalCase.tsx` (`BookingDetailPage.tsx`).
- **Hook:** `useXxx.ts` (`useBookingQuote.ts`).
- **API client function:** `verbResource()` (`createBooking`, `getTourById`).
- **Zod schema:** `xxxSchema` + type `XxxInput = z.infer<typeof xxxSchema>`.
- **Permission constant:** `SCREAMING_SNAKE` map sang chuỗi BE: `BOOKING_VIEW = 'booking.view'`.
- **Folder mỗi feature:** số ít (`booking` vs `bookings`)? **chọn số nhiều cho domain list**, đồng bộ với BE module (`bookings`, `tours`, `destinations`).

### 2.3 Quy tắc “Page” (theo MovieZone guide đang dùng)

Mỗi `pages/*Page.tsx` chỉ làm 4 việc:

1. Đọc `params/search`.
2. Gọi `useXxxQuery` / `useXxxMutation`.
3. Map dữ liệu (mapper trong `feature/utils/`).
4. Render section components (đặt trong `feature/components/`).

**Cấm** đặt logic gọi axios trực tiếp trong page.

---

## 3. Chiến lược Quản lý State & Gọi API

### 3.1 Phân loại state


| Loại                                 | Lưu ở đâu                                                                                                                   | Ví dụ                                                        |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Server state** (đến từ BE, có TTL) | **TanStack Query**                                                                                                          | `tours`, `tourDetail`, `bookings`, `userMe`, `notifications` |
| **Auth state** (token, user)         | **Zustand `authStore`** + persist sang `sessionStorage` (refresh token: `localStorage` hoặc `expo-secure-store` cho mobile) | accessToken, refreshToken, currentUser, permissions          |
| **UI/preference state**              | **Zustand `localeStore`, `layoutStore`** + persist `localStorage`                                                           | theme, language, sidebar collapse                            |
| **Form state**                       | **react-hook-form** (local)                                                                                                 | login form, booking form, admin destination upsert           |
| **Ephemeral component state**        | `useState` / `useReducer`                                                                                                   | modal open, tab active                                       |
| **Domain client-side đặc biệt**      | **Redux Toolkit (legacy)** — sẽ migrate dần                                                                                 | `home`, `preferences` (đang có)                              |


### 3.2 Luồng dữ liệu (Data Flow chuẩn)

```text
┌────────────────┐  call useXxxQuery / useXxxMutation
│   Component    │ ────────────────────────────────────┐
└────────────────┘                                     ▼
        ▲                                ┌────────────────────────┐
        │ TanStack Query cache           │  hooks/useApiQuery.ts  │
        │ (key, staleTime, retry)        │  hooks/useApiMutation  │
        │                                └─────────────┬──────────┘
        │                                              ▼
        │                              ┌────────────────────────────┐
        │                              │  module/<x>/api/Xxx.api.ts │
        │                              │  → backendApiClient.<verb> │
        │                              └─────────────┬──────────────┘
        │                                            ▼
        │                            ┌──────────────────────────────┐
        │                            │  lib/apiClient.ts            │
        │                            │  - request<T>()              │
        │                            │  - unwrapApiResponse<T>()    │
        │                            │  - mapApiError() (api.error.*│
        │                            │    → i18n key + field map)   │
        │                            └─────────────┬────────────────┘
        │                                          ▼
        │                           ┌────────────────────────────────┐
        │                           │  lib/axios.ts (axiosBackend)   │
        │                           │  Request interceptor:          │
        │                           │   - Authorization: Bearer …    │
        │                           │   - Accept-Language (i18n)     │
        │                           │   - X-Request-ID (uuid)        │
        │                           │  Response interceptor:         │
        │                           │   - 401 → single-flight refresh│
        │                           │   - 5xx → log + propagate      │
        │                           └─────────────┬──────────────────┘
        │                                         ▼
        │                                    BACKEND (Spring)
        │                                         │
        ▼                                         ▼
  Re-render với data đã unwrap        ApiResponse<T> JSON envelope
```

### 3.3 Bóc tách `ApiResponse<T>` chính xác

**Hợp đồng BE** (xác nhận tại `backend/.../ApiResponse.java`, tài liệu `§2.5`):

```ts
type ApiResponse<T> = {
  success: boolean;        // backend luôn trả
  message?: string;        // đã dịch theo Accept-Language
  data?: T;                // body chính, có thể null khi success=false hoặc 204
  errorCode?: string;      // ví dụ "BAD_REQUEST", "RESOURCE_NOT_FOUND"
  errors?: Array<{ field: string; message: string; code?: string }>;
};

type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};
```

**Quy tắc bóc tách (hardened)** — bổ sung cho `unwrapApiResponse` đang có:

```ts
export class ApiError extends Error {
  constructor(
    public readonly errorCode: string,
    message: string,
    public readonly fieldErrors?: Array<{ field: string; message: string; code?: string }>,
    public readonly httpStatus?: number,
    public readonly i18nKey?: string,    // ví dụ "api.error.tour.not_found"
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function unwrapApiResponse<T>(
  envelope: ApiResponse<T>,
  fallbackMessage = 'Request failed.',
  options: { allowEmpty?: boolean } = {},
): T {
  if (!envelope.success) {
    throw new ApiError(
      envelope.errorCode ?? 'UNKNOWN',
      envelope.message ?? fallbackMessage,
      envelope.errors,
    );
  }
  if (envelope.data === undefined && !options.allowEmpty) {
    throw new ApiError('EMPTY_RESPONSE', envelope.message ?? fallbackMessage);
  }
  return envelope.data as T;
}
```

**Bốn nguyên tắc bắt buộc khi dùng:**

1. **Một entry point** duy nhất gọi `unwrapApiResponse` — không component nào tự đọc `response.data.data`.
2. **Hook query** trả về `**T` đã unwrap** (không trả `ApiResponse<T>`); error đi qua `error: ApiError` của TanStack Query.
3. **Error mapping** theo `errorCode` hoặc `i18nKey` trước khi hiển thị: ưu tiên `t('errors:' + errorCode)` rồi fallback `envelope.message` (đã dịch BE).
4. **Pagination wrapper:** với `PageResponse<T>` dùng helper `unwrapPage()` trả về `{ items, page, size, totalElements, totalPages, last }`.

### 3.4 Cấu hình `QueryClient`

```ts
// src/app/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (failureCount, error) =>
        error instanceof ApiError && error.httpStatus && error.httpStatus < 500
          ? false
          : failureCount < 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

### 3.5 Convention query key (chống cache trùng)

```ts
const tourKeys = {
  all: ['tours'] as const,
  list: (filters: PublicTourSearchParams) => [...tourKeys.all, 'list', filters] as const,
  detail: (id: number) => [...tourKeys.all, 'detail', id] as const,
  schedules: (tourId: number) => [...tourKeys.detail(tourId), 'schedules'] as const,
};
```

> `Accept-Language` phải nằm trong query key (hoặc trong `filters`) để **không tráo dữ liệu vi/en**. BE đã ép `Content-Language` — FE bắt buộc invalidate khi đổi locale.

### 3.6 Mutation + invalidation chuẩn

```ts
const { mutate } = useMutation({
  mutationFn: (payload) => bookingApi.create(payload),
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    toast.success(t('booking:createSuccess'));
    navigate(`/bookings/${data.id}`);
  },
  onError: (error: ApiError) => {
    if (error.fieldErrors?.length) setFormErrors(error.fieldErrors);
    toast.error(t(`errors:${error.errorCode}`, { defaultValue: error.message }));
  },
});
```

---

## 4. Bảo mật & Luồng Xác thực (Auth Flow)

### 4.1 Quyết định lưu trữ token


| Loại                         | Lưu ở                                                                                                         | Lý do                                                                                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Access token (JWT, ~1h)**  | `**sessionStorage`**                                                                                          | Tự xoá khi đóng tab; không gửi lên domain khác. Hiện code đã làm vậy (`AUTH_TOKEN_KEY`).                                                                                     |
| **Refresh token (~30 ngày)** | `**localStorage`** *(tạm chấp nhận)* — **mục tiêu dài hạn:** chuyển sang **HttpOnly Cookie** do BE phát hành  | XSS vẫn là rủi ro với localStorage; BE chưa expose `Set-Cookie` cho `/auth/refresh`. Khi BE bổ sung cookie HttpOnly + CORS `credentials: true`, FE chỉ cần xoá cờ lưu local. |
| **User profile snapshot**    | `sessionStorage`                                                                                              | Hiển thị nhanh khi reload (avatar, displayName), nhưng phải đối chiếu lại `GET /users/me` ngay sau mount.                                                                    |
| **Mobile (Expo)**            | `**expo-secure-store*`* cho refresh token (Android Keystore / iOS Keychain), `AsyncStorage` cho user snapshot | RN không có `localStorage`; Secure Store là chuẩn an toàn.                                                                                                                   |


**Cảnh báo bảo mật cần ghi vào checklist:**

- ❌ **Không lưu** access token vào `localStorage` (đã xoá legacy keys nhưng cần dọn các util đang đọc song song).
- ❌ **Không** log token, kể cả trong DevTools (filter `Authorization` ở axios interceptor khi `import.meta.env.DEV`).
- ✅ Set CSP `default-src 'self'` khi build production; whitelist origin BE qua `connect-src`.
- ✅ Backend hiện đã expose `Content-Language` + `X-Request-ID` qua CORS — **giữ nguyên**, FE log `X-Request-ID` để trace lỗi với BE.

### 4.2 Auto refresh token (đã có, cần củng cố)

Hiện trạng tại `frontend/web/src/utils/axiosInstance.ts`:

- ✅ `refreshPromise` single-flight — tránh nhiều request 401 song song.
- ✅ Đánh dấu `_retry` để không loop.
- ✅ Bỏ qua `auth/refresh` khỏi vòng retry.
- ✅ Phát event `travelviet:logout` khi refresh fail.

**Đề xuất bổ sung:**

1. **Queue request đang chờ:** ngoài `refreshPromise`, gom các request 401 vào hàng đợi và phát lại sau khi refresh xong (hiện đang chỉ retry request gây ra 401).
2. **Pre-emptive refresh:** dựa vào `expiresIn` trả từ `AuthResponse`, set `setTimeout` refresh trước khi hết hạn ~60s ⇒ giảm số lần 401 trong UX.
3. **Skew clock:** trừ 30s khi tính hạn (BE clock skew).
4. **Logout broadcast:** dùng `BroadcastChannel('travelviet-auth')` để các tab khác cùng logout khi 1 tab refresh fail.

### 4.3 Sequence Login → Bảo vệ route

```text
[LoginPage]
  └─ submit (react-hook-form + zod)
        └─ useLoginMutation()
              ├─ axiosBackend.post('/auth/login') → ApiResponse<AuthResponse>
              ├─ persistAuthSessionData(auth)        ← lưu token + user
              ├─ authStore.setSession(auth)          ← Zustand
              ├─ queryClient.invalidateQueries(['users','me'])
              └─ navigate(resolvePostAuthRedirect(user))
                  ├─ hasManagerRole(user) → /management/dashboard
                  └─ ngược lại            → / (hoặc location.state.from)

[Mỗi request kế tiếp]
  └─ axiosBackend interceptor gắn Authorization: Bearer <accessToken>
        └─ 401? → refreshPromise (single-flight)
                    ├─ thành công  → retry request gốc
                    └─ thất bại    → clearAuthSession + redirect /login

[Route guard]
  └─ <RequireAuthenticated> kiểm tra token + user
  └─ <RequireManagerAccess>  kiểm tra hasManagerRole(user)
  └─ <RequirePermission permission="booking.cancel"> (mới)
        └─ check user.permissions ∋ 'booking.cancel'
```

### 4.4 Bảo vệ Private Routes (Backoffice / Dashboard Admin)

**Pattern 3 lớp guard:**

```tsx
// router/index.tsx
{
  element: <RequireAuthenticated />,
  children: [
    {
      element: <RequireManagerAccess />,    // chặn theo role code
      children: [
        {
          path: 'management',
          element: <ManagementLayout />,
          children: [
            {
              element: <RequirePermission anyOf={['booking.view']} />,  // chặn theo permission
              children: [
                { path: 'bookings', element: <ManagementBookingsPage /> },
                { path: 'bookings/:id', element: <ManagementBookingDetailPage /> },
              ],
            },
            // ...
          ],
        },
      ],
    },
  ],
}
```

`<RequirePermission>` đọc `permissions` từ `authStore`. Nếu BE chưa expose permission list (đề nghị `/users/me/permissions` đã ghi trong `BACKOFFICE_NEXT_PHASE.md` mục 4) — fallback theo bảng map role → permission ở `constants/permissions.ts`.

### 4.5 Khi logout

```ts
function logout() {
  clearStoredAuthSession();              // xoá token storage (đã có)
  authStore.reset();                     // clear Zustand
  queryClient.clear();                   // **bắt buộc**: xoá cache server state
  window.dispatchEvent(new Event('travelviet:logout'));
  navigate('/login', { replace: true });
}
```

> **Quan trọng:** thiếu `queryClient.clear()` sẽ gây leak dữ liệu user trước sang user sau khi cùng tab. Đây là bug điển hình khi tích hợp Query với auth.

---

## 5. Quy chuẩn Code (Coding Standards) — input cho `.cursorrules`

> **5 quy tắc bắt buộc, áp dụng toàn FE.** Chép thẳng vào `.cursorrules` (hoặc `frontend/web/AGENTS.md`).

### Rule 1 — “Single source of truth” cho gọi API

- **MUST:** mọi request HTTP đi qua `lib/apiClient.ts` (sử dụng `axiosBackend` ở `lib/axios.ts`).
- **MUST:** mọi hook gọi API nằm dưới `module/<feature>/hooks/use*Query.ts` hoặc `use*Mutation.ts`, **không** `axios` trực tiếp trong component.
- **MUST:** dùng `unwrapApiResponse<T>()` — không reach `response.data.data`.
- **MUST NOT:** tạo axios instance mới ngoài `lib/axios.ts`.

### Rule 2 — Type-safety + Zod cho input

- **MUST:** mọi DTO request/response có type khai báo trong `module/<feature>/types/`.
- **MUST:** mọi form (login, register, booking, admin upsert) có **zod schema** ở `module/<feature>/validation/`; dùng `z.infer` làm type.
- **MUST:** enum BE (`BookingStatus`, `RefundStatus`, `Sentiment`, …) khai báo lại tại `constants/enums.ts` và **không hardcode** chuỗi `'paid'`, `'cancelled'` rải rác.
- **MUST NOT:** dùng `any` ở public surface (DTO, hook return). Nội bộ utility cho phép `unknown` + narrow.

### Rule 3 — i18n & error mapping bắt buộc

- **MUST:** mọi text hiển thị người dùng dùng `t('namespace:key')`. **Không** chuỗi tiếng Việt/Anh hard-code trong JSX (trừ logging dev).
- **MUST:** lỗi BE mã `api.error.*` map qua bảng `public/locales/{lng}/errors.json`. Chưa có key thì fallback `error.message` (đã được BE dịch theo `Accept-Language`).
- **MUST:** đổi locale ⇒ `i18n.changeLanguage(lng)` + `queryClient.invalidateQueries()` cho các key có locale (tour list/detail).
- **MUST:** axios interceptor lấy `Accept-Language` từ `i18n.language` (không từ `navigator.language` như hiện tại).

### Rule 4 — Auth & token an toàn

- **MUST:** access token chỉ lưu `sessionStorage` (key `AUTH_TOKEN_KEY`). Refresh token lưu `localStorage` (chuyển HttpOnly cookie khi BE sẵn sàng).
- **MUST:** logout luôn gọi `clearStoredAuthSession()` + `authStore.reset()` + `queryClient.clear()`.
- **MUST:** route admin luôn bọc `<RequireAuthenticated>` → `<RequireManagerAccess>` (→ `<RequirePermission>` cho action cụ thể).
- **MUST NOT:** `console.log(token)`, kèm token vào URL, hoặc gửi token sang origin thứ 3.

### Rule 5 — Cấu trúc page & component

- **MUST:** `pages/*Page.tsx` chỉ làm 4 việc (đọc params → gọi hook → map data → render section). Logic dài tách `feature/utils/` hoặc `feature/hooks/`.
- **MUST:** component dùng chung > 2 nơi đặt ở `src/components/`. Component chỉ phục vụ 1 feature đặt ở `module/<feature>/components/`.
- **MUST:** mỗi mutation thành công invalidate đúng key (`queryClient.invalidateQueries({ queryKey })`) — không refetch toàn bộ.
- **MUST:** lazy load page route (`React.lazy` + `Suspense`) — tuân thủ pattern hiện tại.
- **MUST NOT:** import từ `module/A` sang `module/B` trực tiếp; dùng `module/<x>/index.ts` re-export hoặc đẩy lên `src/components/` / `src/hooks/`.

---

## 6. Lộ trình Migration (gợi ý 4 sprint)


| Sprint                             | Mục tiêu                                                        | Việc chính                                                                                                                                        |
| ---------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **S1 — Nền móng**                  | Đưa TanStack Query, zod, i18n JSON, Toast vào                   | Cài deps, tạo `app/AppProviders.tsx`, viết `useApiQuery/Mutation`, tách i18n inline → `public/locales/`, thêm `Toaster`, `ErrorBoundary`.         |
| **S2 — Auth & RBAC**               | Củng cố auth flow + permission gate                             | Viết `authStore` (Zustand), refactor `RequireAuthenticated` đọc store, thêm `RequirePermission`, pre-emptive refresh, BroadcastChannel cross-tab. |
| **S3 — Backoffice CRUD**           | Hiện thực CRUD theo `BACKOFFICE_NEXT_PHASE.md`                  | DataTable + Filter + Pagination chuẩn, từng module: Users/Roles, Tours/Schedules, Bookings, Refunds, Support, Promotions.                         |
| **S4 — Mobile alignment & shared** | Tách `packages/shared` (zod, types, error map) cho web + mobile | pnpm workspace, share `module/*/types`, schema; mobile dùng `expo-secure-store` cho refresh.                                                      |


---

## 7. Checklist khớp Backend (per-module)

> Dùng làm bảng kiểm khi tạo từng feature mới.

- Endpoint nằm trong `API_DOCUMENTATION.md` mục tương ứng.
- Permission khớp bảng §12; `<RequirePermission>` hoặc `<Can>` đặt đúng chỗ.
- Type request/response sinh từ DTO BE (không tự đoán); enum mirror `§13`.
- Zod schema khớp Bean Validation BE (min/max/regex).
- i18n key cho lỗi `api.error.*` được thêm vào `errors.json`.
- Query key có namespace + filter + locale.
- Mutation invalidate đúng key liên quan (vd `POST /bookings` invalidate `bookingKeys.all` + `userKeys.me`).
- Page lazy loaded.
- Test MSW cover happy + 1 error case (ít nhất `errorCode = 'BAD_REQUEST'`).

---

## 8. Notes cho phiên sau (verify để thao tác nhanh)

> Ghi nhanh các điểm cần kiểm tra lại lần sau — mục tiêu giảm thời gian khám phá ở các phiên kế tiếp. **Đã verify trong phiên này** ghi `[V]`, **chưa verify, cần kiểm chứng** ghi `[?]`.

1. `[V]` Web đang dùng React 19, RTK 2.11, react-router-dom 7, axios 1.15, i18next 26 — **vẫn có thể cài thêm** TanStack Query 5, zod 3, react-hook-form 7 (peer dep tương thích React 19).
2. `[V]` `axiosBackend` (`src/utils/axiosInstance.ts`) đã có **single-flight refresh** + event bus. Khi viết `lib/axios.ts` mới, **port nguyên** logic này, đừng viết lại từ đầu.
3. `[V]` `authSessionStorage.ts` lưu cả `sessionStorage` + `localStorage` (legacy keys `auth-token`, `token`). Khi cleanup phải xoá cả hai để tránh tồn tại token cũ.
4. `[V]` `i18n` hiện tại là **resource inline trong `src/lib/i18n.ts`** — khi tách JSON, nhớ giữ namespace mặc định là `translation` (nếu đổi cần update `t()` call rải rác).
5. `[V]` BE đã có `**Content-Language` exposed via CORS** — FE có thể đọc header để debug locale resolve.
6. `[V]` Permission mapping theo BE đã ở `frontend/web/src/module/management/config/managementCatalog.ts` + `managementRoles.ts` — tận dụng khi build `RequirePermission`.
7. `[?]` Cần check FE đã có endpoint gọi `GET /users/me/permissions` chưa? Nếu chưa, dùng map cứng + đặt **TODO** chờ BE.
8. `[?]` Mobile (`frontend/mobile`) hiện chưa có axios setup — chỉ có vài screen mẫu. Phải tạo `lib/axios.ts` riêng với `expo-secure-store`.
9. `[?]` `vite.config.ts` chưa cấu hình **path alias** (`@/`). Khuyến nghị thêm `resolve.alias = { '@': '/src' }` + `tsconfig.app.json paths`.
10. `[?]` Chưa có **CSP / security headers** rõ rệt cho production build. Cần ghi vào tài liệu deploy.
11. `[?]` Chưa có **MSW** trong `frontend/web` — khi setup test cần cấu hình `setupServer` + handler khớp `ApiResponse`.
12. `[V]` BE cache layer (Caffeine) có key theo `Accept-Language` — FE đổi locale phải invalidate query (xem §3.5).
13. `[V]` Backend hiện chỉ có endpoint `GET /bookings/{id}` (chưa có list `/bookings`), `GET /admin/tours` cũng chưa có (xem `BACKOFFICE_NEXT_PHASE.md` §1, §2). FE backoffice tạm dùng `GET /tours` công khai → đánh dấu **TODO chờ BE**.
14. `[V]` Notification permission BE đang dùng `user.update` (ghi chú trong `BACKOFFICE_NEXT_PHASE.md`) — UI gating phải khớp tới khi BE đổi sang `notification.send`.

---

## 9. TL;DR

- **Stack chốt:** React 19 + Vite + TS + Tailwind v4 + **TanStack Query** + **Zustand** (giữ RTK cho legacy) + **react-hook-form/zod** + **i18next** + **MSW + Vitest**.
- **Cấu trúc:** Feature-based `src/module/`* (đã có), bổ sung `src/lib/{axios,apiClient,i18n}`, `src/app/{AppProviders,queryClient}`, `src/router/guards/*`, `src/components/{ui,common,layout,feedback}`.
- **State:** server state ⇒ Query, auth/UI ⇒ Zustand, form ⇒ react-hook-form. Không trộn.
- **API:** Mọi request đi qua `apiClient.unwrapApiResponse<T>()`; lỗi `ApiError` chuẩn hoá `errorCode + fieldErrors`.
- **Auth:** access ở `sessionStorage`, refresh ở `localStorage` (chuyển HttpOnly cookie sau), single-flight refresh + pre-emptive + BroadcastChannel logout.
- **Guard:** `RequireAuthenticated` → `RequireManagerAccess` → `RequirePermission` (3 lớp).
- **Coding rule:** 5 quy tắc ở §5, sẵn sàng paste vào `.cursorrules`.

