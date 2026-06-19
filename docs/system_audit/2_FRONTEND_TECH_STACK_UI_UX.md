# 2. NGĂN XẾP CÔNG NGHỆ FRONTEND VÀ UI/UX (Frontend Tech Stack & UI/UX)

Tài liệu này bóc tách chi tiết hệ sinh thái thư viện Frontend và giao diện cực kỳ đồ sộ tại `/frontend/web/package.json`.

## 1. NỀN TẢNG CỐT LÕI (CORE ECOSYSTEM)

- **React (19.2.4) + React DOM:** Phiên bản bleeding-edge của React, ứng dụng React Compiler (Memoization tự động hoá), Hooks tân tiến (`use`).
- **Vite (8.0.1):** Build tool chạy WebServer ảo (HMR) tốc độ ánh sáng bằng Go-mô phỏng ESBuild.
- **TypeScript (5.9.3):** Ngôn ngữ gõ tĩnh hạt nhân, áp dụng interface strict cho toàn bộ component props.

## 2. HỆ THỐNG GIAO DIỆN HEADLESS VÀ STYLING

- **TailwindCSS (4.2.3):** Vite Plugin thế hệ 4 (Atomic CSS). Mọi class UI được nhúng trực tiếp dạng `className="flex items-center text-sm"`. Dự án không sử dụng CSS Frameworks cồng kềnh như Bootstrap/MUI.
- **Radix UI Primitives:** Thay vì tự Code Logic Mở/Đóng Khung, click-outside modal, dự án tải hàng chục thư viện `@radix-ui/react-*` (Dialog, Tabs, Accordion, Tooltip, Switch, DropdownMenu). Đây là các Logic-only Components.
- **Lucide React & React Icons:** Hệ thống Icon Vectors.
- **Class-variance-authority (CVA) & Tailwind Merge (clsx):** Siêu công cụ để Merge String CSS. Tránh đụng độ kiểu: `p-4` và `p-2` khi render ra UI bị đè nhau.

## 3. STATE MANAGEMENT & ROUTING

- **React Router DOM (7.14.2):** Module hóa History API.
- **TanStack React Query (5.100.9):** Phụ trách Gọi - Lưu Cache Backend. Hỗ trợ tự Re-fetch nếu rớt mạng, Cache vô hiệu hóa tự động (StaleTime/GC Time).
- **Zustand (5.0.13):** Giải pháp State cục bộ siêu nhỏ ngọn (Bear stores) cho Micro-stores thay vì Redux.
- **Redux Toolkit (2.11.2):** Central Store mạnh mẽ, có thể được giữ để Auth State.

## 4. FORM & VALIDATION CORE

- **React Hook Form (7.75.0):** Performance-based form control. Bản chất Form này Uncontrolled -> Ghi Text vào Input không làm re-render Form.
- **Zod (4.4.3) + @hookform/resolvers:** Kỹ thuật Schema-based Validation. Nếu Username < 5 kí tự, Zod chặn Submit form ngay mức JavaScript trước khi Network kịp bay đi.

## 5. CÔNG CỤ VÀ TIỆN ÍCH LIỀN KỀ

- **i18next-http-backend & React-i18next:** Trình load file translation json đa ngôn ngữ động, nhồi text thẳng vào Virtual DOM.
- **Sonner:** Hệ thống bánh Toast siêu xịn, thông báo Popup "Đăng nhập thành công" văng ra rất dẻo.
- **Recharts:** Khung vẽ biểu đồ SVG mượt mà sử dụng cho trang Admin Dashboard.
- **XLSX:** Plugin đọc xuất File Excel trong React.
