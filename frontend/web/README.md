# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

# MovieZone Project Structure Guide

Tài liệu này ghi lại cấu trúc hiện tại của project MovieZone để dùng làm mẫu dựng các project React khác có routing, Redux Toolkit, API layer và module theo feature.

## 1. Tổng Quan

Project chia thành 2 phần:

```txt
MOIVEZONE/
├─ client/          # Frontend React + Vite + TypeScript
├─ server/          # Mock backend bằng json-server
├─ CODEX_REACT_CLIENT_FORM.md
├─ HUONG_DAN_TRUOT_MUOT.md
└─ PROJECT_STRUCTURE_GUIDE.md
```

Stack chính:

- Frontend: React 19, TypeScript, Vite, React Router DOM v7.
- State: Redux Toolkit + React Redux typed hooks.
- API: Axios cho TMDB và Axios riêng cho server nội bộ.
- UI: Tailwind CSS v4, CSS module/global theo từng trang, lucide/react-icons, motion/gsap.
- Backend giả: `json-server` đọc/ghi `server/db.json`.

## 2. Luồng Chạy Chính

Luồng boot của frontend:

```txt
client/src/main.tsx
  -> bọc app bằng <Provider store={store}>
  -> bọc router bằng <RouterProvider router={router}>
  -> router/index.tsx render App
  -> App.tsx load config/banner ban đầu
  -> App.tsx render Header + Outlet + Footer + MobileNavigation
  -> từng page trong module render nội dung
```

Ý nghĩa các file lõi:

- `src/main.tsx`: entry point, gắn Redux store và router vào React tree.
- `src/stores/index.ts`: cấu hình toàn bộ reducer global.
- `src/router/index.tsx`: khai báo route, lazy page, route bảo vệ.
- `src/App.tsx`: layout shell toàn app, fetch TMDB config/trending ban đầu, xử lý page loader.
- `src/index.css`: Tailwind import, theme variable, dark mode, global utilities.

## 3. Cấu Trúc Frontend

```txt
client/src/
├─ api/
│  ├─ movie/        # API service gọi TMDB
│  └─ server/       # API service gọi json-server/app backend
├─ app/             # instance axios TMDB
├─ components/      # component dùng chung hoặc theo layout lớn
├─ constants/       # navigation, constant tĩnh
├─ hooks/           # custom hook dùng chung
├─ layouts/         # layout phụ nếu cần
├─ lib/             # helper nhỏ, ví dụ cn()
├─ mobile/          # component riêng mobile
├─ module/          # feature modules chính
├─ router/          # router + route guards
├─ stores/          # root store + slice global cũ
├─ styles/          # CSS riêng các page/feature cũ
├─ test/            # trang/tool test
├─ types/           # type dùng chung
└─ utils/           # axios instance server/app utilities
```

Quy tắc đang dùng:

- `components/`: đặt UI dùng chung nhiều nơi như `Header`, `Footer`, `Card`, `PageLoader`.
- `module/`: mỗi domain/feature lớn có folder riêng: `movies`, `auth`, `admin`, `persons`, `collections`, `tv`, `search`, v.v.
- `api/`: tách service gọi API khỏi page/component.
- `database/interface/`: đặt type/interface response hoặc model của module.
- `store/`: đặt Redux slice/thunk của module.
- `pages/`: component cấp route.
- `components/`: component con chỉ phục vụ module đó.

## 4. Pattern Module Chuẩn

Một module feature nên theo dạng:

```txt
src/module/<feature>/
├─ pages/
│  └─ <Feature>Page.tsx
├─ components/
│  ├─ <Feature>Hero.tsx
│  ├─ <Feature>List.tsx
│  └─ <Feature>Section.tsx
├─ store/
│  └─ <feature>Slice.ts
└─ database/
   └─ interface/
      └─ <feature>.ts
```

Nếu feature cần gọi API riêng:

```txt
src/api/movie/TMDB<Feature>.api.ts
# hoặc
src/api/server/<Feature>.api.ts
```

Ví dụ module `movies`:

- `pages/DetailsPage.tsx`: page route, đọc params, gọi hook/API, normalize data, render section.
- `components/DetailsHero.tsx`, `DetailsVideosSection.tsx`, ...: UI chia nhỏ theo section.
- `store/moviesSlice.ts`: state banner, list phim, TV list, selected detail.
- `database/interface/movie.ts`: type TMDB movie detail/list.

## 5. Routing

Router nằm ở `src/router/index.tsx`.

Pattern chính:

```tsx
const SomePage = lazy(() => import("../module/some/pages/SomePage"));

const withSuspense = (element: JSX.Element) => (
  <Suspense fallback={<div>Đang tải...</div>}>{element}</Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: withSuspense(<Home />) },
      { path: "movie", element: withSuspense(<AllMoviesPage />) },
    ],
  },
]);
```

Route guard:

- `ProtectedRoute`: yêu cầu đăng nhập, kiểm tra user bị block.
- `AdminRoute`: yêu cầu `currentUser.role === "admin"`.

Pattern route bảo vệ:

```tsx
{
  element: <ProtectedRoute />,
  children: [
    { path: "movie/:id", element: withSuspense(<DetailsPage mediaType="movie" />) },
    {
      element: <AdminRoute />,
      children: [
        { path: "admin", element: withSuspense(<AdminDashboardPage />) },
      ],
    },
  ],
}
```

Khi thêm page mới:

1. Tạo page trong `src/module/<feature>/pages`.
2. Import lazy trong `router/index.tsx`.
3. Thêm route public hoặc đặt dưới `ProtectedRoute`/`AdminRoute`.
4. Nếu cần layout riêng như auth, tạo route layout riêng có `Outlet`.

## 6. Redux Store

Root store nằm ở `src/stores/index.ts`.

```txt
configureStore({
  reducer: {
    moviesData,
    language,
    collection,
    company,
    certifications,
    tmdbConfig,
    tmdbChanges,
    tmdbCreditDetails,
    tmdbDiscover,
    tmdbGenres,
    account,
    auth,
    network,
    app,
    trending,
    moviesCategories,
    tvCategories,
    person,
    review,
    search,
    tvSeason,
    tvEpisode,
    tvEpisodeGroup,
    admin,
  }
})
```

Typed hooks nằm ở `src/hooks/UseCustomeRedux.tsx`:

```tsx
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
```

Pattern slice chuẩn:

```tsx
interface FeatureState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

const initialState: FeatureState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchFeature = createAsyncThunk(
  "feature/fetchFeature",
  async (_, { getState }) => {
    const data = await featureApi.getList();
    return data.results;
  },
);

const featureSlice = createSlice({
  name: "feature",
  initialState,
  reducers: {
    clearFeature(state) {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeature.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeature.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFeature.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});
```

Khi thêm slice:

1. Tạo `src/module/<feature>/store/<feature>Slice.ts`.
2. Export reducer default.
3. Import vào `src/stores/index.ts`.
4. Thêm key reducer.
5. Dùng `useAppDispatch` và `useAppSelector` trong page/component.

## 7. API Layer

Project có 2 Axios instance.

### TMDB API

File: `src/app/axiosTMDB.ts`

- `baseURL`: `https://api.themoviedb.org/3`
- Timeout: `8000`
- Interceptor tự gắn:
  - `Authorization: Bearer <VITE_TMDB_V4_TOKEN>`
  - `api_key=<VITE_TMDB_V3_KEY>`
  - `accept: application/json`

Service TMDB đặt trong `src/api/movie/`.

Ví dụ pattern:

```tsx
export const tmdbMoviesApi = {
  async getPopular(page = 1, language = "vi-VN") {
    const res = await axiosTMDB.get("/movie/popular", {
      params: { page, language },
    });
    return res.data;
  },
};
```

### Server Nội Bộ / Mock Backend

File: `src/utils/axiosIntance.ts`

- Ưu tiên `VITE_API_URL`.
- Fallback production: `https://moivezone-1.onrender.com`.
- Fallback local: `http://localhost:3000`.

Server hiện dùng `json-server`:

```txt
server/
├─ db.json
├─ package.json
└─ package-lock.json
```

Script:

```bash
npm run dev
```

Chạy `json-server --watch db.json --port 3000`.

## 8. Custom Hooks

`useFetch<T>(endpoint, extraParams?)`

- Dùng cho endpoint trả list có `results`.
- Tự lấy `language` từ Redux.
- Gọi TMDB qua `axiosTMDB`.
- Trả `{ data, loading }`.

`useFetchDetails<T>(endpoint, extraParams?)`

- Dùng cho endpoint detail.
- Có `AbortController`.
- Tự lấy `language`.
- Trả `{ data, loading, error }`.

Khi nào dùng hook, khi nào dùng Redux thunk:

- Dùng hook khi data chỉ phục vụ một page/component và không cần share global.
- Dùng Redux thunk khi data cần dùng nhiều nơi, cần cache, cần điều khiển từ UI khác, hoặc là state app-wide như auth/admin/language.

## 9. Auth Và User Flow

Auth state nằm ở `src/module/auth/store/authSlice.ts`.

State:

```tsx
interface AuthState {
  currentUser: IUser | null;
  isAuthenticated: boolean;
}
```

Luồng chính:

```txt
Login/Register page
  -> gọi User.api.ts
  -> dispatch login(user) hoặc setCurrentUser(user)
  -> lưu currentUser vào sessionStorage
  -> ProtectedRoute đọc auth state
```

User API nằm ở `src/api/server/User.api.ts`:

- `getAllUsers()`
- `createUser(payload)`
- `findUserByEmail(email)`
- `updateUser` thunk
- `updateUserDirect(payload)`

Lưu ý khi dựng project thật: không lưu password plain text trong `db.json`; đây chỉ là mock backend/dev server.

## 10. UI Và Layout

App shell:

```txt
Header
SmoothScrollLayout
  main
    ScrollToTop
    Outlet
    Footer
    MobileNavigation
```

Component dùng chung:

```txt
src/components/
├─ common/
│  ├─ ui/
│  └─ ux/
├─ header/
├─ footer/
├─ error/
├─ home/
└─ admin/
```

Quy tắc nên giữ:

- Page route chỉ điều phối data và ghép section.
- Component section nhận props đã được page chuẩn hóa.
- Component dùng chung không import trực tiếp data module nếu không thật cần.
- UI state local như modal/trailer/search input nên để trong component/page.
- State dùng nhiều nơi như auth/admin/language nên để Redux.

## 11. Type Và Interface

Project tách type theo domain:

```txt
src/module/<feature>/database/interface/<feature>.ts
src/types/interface/
```

Quy tắc:

- Type response TMDB đặt cạnh module sử dụng nhiều nhất.
- Type server app như user/ticket/news có thể đặt trong `src/types/interface/server` hoặc module tương ứng.
- Nếu một type chỉ dùng trong 1 component và nhỏ, có thể khai báo local trong file.
- Nếu type dùng qua nhiều module, đưa ra `src/types` hoặc file interface của module chủ.

## 12. Cách Thêm Một Feature Mới

Ví dụ thêm feature `awards`.

1. Tạo cấu trúc:

```txt
src/module/awards/
├─ pages/
│  └─ AwardsPage.tsx
├─ components/
│  ├─ AwardsHero.tsx
│  └─ AwardsList.tsx
├─ store/
│  └─ awardsSlice.ts
└─ database/
   └─ interface/
      └─ awards.ts
```

2. Tạo API service nếu cần:

```txt
src/api/movie/TMDBAwards.api.ts
# hoặc
src/api/server/Awards.api.ts
```

3. Khai báo type trong `database/interface/awards.ts`.

4. Viết slice nếu data cần global:

```tsx
export const fetchAwards = createAsyncThunk("awards/fetchAwards", async () => {
  const res = await awardsApi.getAwards();
  return res.results;
});
```

5. Gắn reducer vào `src/stores/index.ts`:

```tsx
import awardsReducer from "../module/awards/store/awardsSlice";

reducer: {
  awards: awardsReducer,
}
```

6. Thêm route:

```tsx
const AwardsPage = lazy(() => import("../module/awards/pages/AwardsPage"));

{ path: "awards", element: withSuspense(<AwardsPage />) }
```

7. Thêm navigation nếu cần trong `src/constants/Navigation.tsx`.

8. Page chỉ nên làm 4 việc:

- Đọc params/query.
- Gọi hook/thunk/API.
- Normalize/map dữ liệu cho UI.
- Render các component section.

## 13. Checklist Dựng Project Tương Tự

Khi tạo project mới theo cấu trúc này:

- Tạo `client` bằng Vite React TypeScript.
- Cài `react-router-dom`, `@reduxjs/toolkit`, `react-redux`, `axios`, `tailwindcss`.
- Tạo `src/main.tsx`, `src/router/index.tsx`, `src/stores/index.ts`, `src/App.tsx`.
- Tạo typed Redux hooks trong `src/hooks/UseCustomeRedux.tsx`.
- Tạo axios instance cho external API và internal API.
- Chia feature vào `src/module/<feature>`.
- Mỗi feature có `pages`, `components`, `store`, `database/interface` khi cần.
- Dùng lazy route cho page cấp route.
- Dùng route guard cho auth/admin.
- Đưa shared UI vào `src/components`.
- Đưa constants/navigation vào `src/constants`.
- Đưa type shared vào `src/types`.
- Dùng `.env` cho API key/base URL.

## 14. Env Cần Có

Frontend cần các biến:

```env
VITE_TMDB_V4_TOKEN=your_tmdb_v4_token
VITE_TMDB_V3_KEY=your_tmdb_v3_key
VITE_API_URL=http://localhost:3000
```

Không commit `.env` thật lên repo.

## 15. Quy Ước Nên Chuẩn Hóa Thêm

Một vài điểm nên chuẩn hóa khi nhân cấu trúc sang project khác:

- Sửa tên `axiosIntance.ts` thành `axiosInstance.ts` ở project mới để tránh typo.
- Sửa `UseCustomeRedux.tsx` thành `useCustomRedux.ts` hoặc `reduxHooks.ts`.
- Hạn chế để comment tiếng Việt bị lỗi encoding; lưu file UTF-8.
- Tránh để business logic quá dày trong page. Nếu page dài, tách mapper/helper sang `feature/utils`.
- Với backend thật, không lưu password/session/API key dạng plain text như mock `db.json`.
- Nên thống nhất mỗi module dùng một trong hai hướng fetch data: hook local hoặc Redux thunk, tránh trộn nếu không cần.

## 16. Blueprint Ngắn Gọn

Mẫu nhanh để dựng app khác:

```txt
src/
├─ main.tsx
├─ App.tsx
├─ index.css
├─ app/
│  └─ axiosExternal.ts
├─ utils/
│  └─ axiosInstance.ts
├─ router/
│  ├─ index.tsx
│  ├─ ProtectedRoute.tsx
│  └─ AdminRoute.tsx
├─ stores/
│  ├─ index.ts
│  └─ appSlice.ts
├─ hooks/
│  ├─ reduxHooks.ts
│  ├─ useFetch.ts
│  └─ useFetchDetails.ts
├─ components/
│  ├─ common/
│  ├─ header/
│  ├─ footer/
│  └─ error/
├─ constants/
├─ types/
└─ module/
   └─ <feature>/
      ├─ pages/
      ├─ components/
      ├─ store/
      └─ database/
         └─ interface/
```
