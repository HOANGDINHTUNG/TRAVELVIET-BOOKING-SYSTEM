# Kế hoạch đồng bộ Mobile ↔ Web — Module Sản phẩm (Commerce)

> **Nguyên tắc:** Mobile là bản “desk” của web, không tự thêm màn hình/thao tác mà web chưa có.  
> **Nguồn tham chiếu chính (web):** `PromotionCommercePanel` — tab **Products** trên Admin/SuperAdmin Dashboard.  
> **API chung:** `frontend/web/src/api/server/Commerce.api.ts` ↔ `frontend/mobile/services/productsApi.ts`

---

## 1. Phân tích giao diện Web (đọc kỹ codebase)

### 1.1 Web có **hai khu** khuyến mãi — không được nhầm

| Khu vực | File | Có tab Products? | CRUD sản phẩm? |
|---------|------|------------------|----------------|
| **Promotion & Commerce Desk** | `PromotionCommercePanel.tsx` | ✅ Có (cùng Vouchers, Campaigns, Combos) | ❌ **Không** — chỉ list + bật/tắt |
| **Trang Khuyến mãi (sidebar)** | `ManagementPromotionPage.tsx` | ❌ Chỉ Campaign + Voucher | ✅ CRUD campaign/voucher (master-detail) |

**Kết luận:** Đồng bộ mobile “Products” phải bám **`PromotionCommercePanel`**, **không** bám layout CRUD của `ManagementPromotionPage`.

### 1.2 Cấu trúc UI web — tab Products (`PromotionCommercePanel`)

```
┌─ Header ─────────────────────────────────────────────┐
│ Kicker: PROMOTION & COMMERCE                         │
│ Title + mô tả ngắn                                   │
│ Summary: [N vouchers] [N campaigns] [N products] [N combos] │
└──────────────────────────────────────────────────────┘
┌─ Toolbar ────────────────────────────────────────────┐
│ Tabs: Vouchers | Campaigns | Products | Combos       │
│ Search: "Tim theo ma hoac ten" + Enter               │
│ Nút: [Tai lai]                                       │
└──────────────────────────────────────────────────────┘
┌─ Grid cards (auto-fit min 240px) ────────────────────┐
│ ┌─ Card ─────────────────────────────────────────┐   │
│ │ Header: SKU (vàng #8f5d20) | Badge trạng thái   │   │
│ │ H4: Tên sản phẩm                                 │   │
│ │ P:  Mô tả hoặc productType                      │   │
│ │ DL: Gia | Ton kho | Gift (dt/dd 2 cột)           │   │
│ │ [Tat product] hoặc [Bat product]  ← trên card    │   │
│ └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
Empty: "Khong co du lieu phu hop."
Message: "Da cap nhat product." (sau toggle)
```

### 1.3 Trường dữ liệu & API (web ↔ BE)

| Hiển thị web | Trường API | Ghi chú |
|--------------|------------|---------|
| SKU | `sku` | Header card, uppercase |
| Trạng thái | `isActive` | `Tam tat` / `Dang bat` |
| Tên | `name` | `h4` |
| Subtitle | `description` \|\| `productType` | |
| Gia | `unitPrice` | `formatMoney` — không ký hiệu ₫ |
| Ton kho | `stockQty` | |
| Gift | `isGiftable` | `Co` / `Khong` |
| Thao tác | `PATCH /products/{id}/status` | Body `{ isActive }` — **không DELETE** |

**Query list (web):** `page=0`, `size=12`, `keyword`, `sortBy=createdAt`, `sortDir=desc`  
**Quyền:** `voucher.view|create|update|delete` (tạm gate product — theo API doc)

### 1.4 Design tokens web (tab Products)

| Token | Web (`ManagementHubPage.css`) | Mobile hiện tại | Cần chỉnh? |
|-------|------------------------------|-----------------|------------|
| Accent tab active | `#8f5d20` (nâu admin) | `#2563EB` (blue spec cũ) | ✅ Phase 2 — dùng theme **Commerce Desk** |
| SKU màu | `#8f5d20` | `textMuted` | ✅ |
| Badge active | nền xanh `#176452` | xanh `#DBEAFE` / primary | ✅ |
| Card radius | `8px` | `12px` | ✅ nhẹ |
| Grid gap | `12px` | `8px` margin card | ✅ |

> **Lưu ý:** Spec trước đó dùng `#2563EB` (consumer/minimal). Web backoffice dùng **#8f5d20**. Kế hoạch: **ưu tiên web desk**; tab consumer (Home/Tour) giữ nguyên.

---

## 2. So sánh Mobile hiện tại — Thừa / Thiếu

### 2.1 Đang **thừa** (web chưa có → không nên làm mặc định)

| Tính năng mobile | Web có? | Hành động |
|------------------|---------|-----------|
| Màn **Chi tiết** riêng `/products/[id]` | ❌ | Gỡ hoặc ẩn Phase 1–3 |
| Màn **Form** Create/Edit + FAB `+` | ❌ | Gỡ hoặc ẩn Phase 1–3 |
| Long-press xóa | ❌ (có nút trên card) | Thay bằng nút **Tắt/Bật** trên card |
| `size=50` | Web `size=12` | Đổi về 12 + phân trang |
| Banner debug API | ❌ | Chỉ `__DEV__` |
| Đăng nhập → chỉ tab Sản phẩm | ❌ | Tab desk + tách consumer |

### 2.2 Đang **thiếu** (web có → mobile cần bổ sung)

| Tính năng web | Mobile | Hành động |
|---------------|--------|-----------|
| Header desk + kicker + mô tả | ❌ | Phase 2 |
| Summary chip **N products** | ❌ | Phase 2 |
| Toolbar: placeholder search đúng copy | Gần đủ | Phase 2 chuẩn hóa copy |
| Nút **Tải lại** (↔ pull-refresh) | Có refresh | Giữ cả hai |
| Card **dl** 3 dòng: Giá / Tồn kho / Gift | Chỉ SL + giá 1 dòng | Phase 2 |
| Nút **Tắt product / Bật product** trên card | Long-press / màn detail | Phase 2 |
| Message sau toggle | Snackbar | ✅ giữ |
| Empty: "Không có dữ liệu phù hợp" | Copy khác | Phase 2 |
| Phân trang `page/totalPages` | ❌ | Phase 3 |

### 2.3 Đúng hướng (giữ)

- Gọi `GET /products`, `PATCH .../status`
- React Query + invalidate
- `formatMoney` giống web
- Auth Bearer + quyền voucher.*

---

## 3. Kiến trúc Mobile mục tiêu (sau đồng bộ)

```
app/(tabs)/
├── products/                    ← Commerce Desk (giống web tab Products)
│   ├── _layout.tsx              ← Stack tối giản (chỉ khi cần modal)
│   └── index.tsx                ← Một màn desk: header + toolbar + grid + toggle
├── index.tsx                    ← Consumer Home (mock tour) — KHÔNG trộn
├── tours.tsx
└── preferences.tsx
```

**Không có** (cho đến khi web có CRUD product page):

- `products/[id].tsx`
- `products/form.tsx`
- FAB tạo mới

---

## 4. Chia giai đoạn triển khai

### Giai đoạn 0 — Chuẩn bị & “đóng băng” phạm vi (0.5 ngày) ✅

**Mục tiêu:** Cả team thống nhất reference, tránh làm thêm tính năng lệch web.

- [x] Review & sign-off tài liệu này
- [x] Tạo `theme/commerceDesk.ts` map token từ `mgmt-promo-*` (màu, radius 8, font weight 900 labels)
- [x] Tạo `constants/commerceDeskCopy.ts` — copy **tiếng Việt có dấu**, đồng bộ web (sau này web sửa copy thì sync 1 file)
- [ ] Checklist QA: URL `.env`, login, quyền `voucher.view`

**Deliverable:** Không đổi UI lớn, chỉ tài liệu + token file.

---

### Giai đoạn 1 — Cắt phạm vi lệch web (1 ngày) ✅

**Mục tiêu:** Mobile không còn “app CRUD 3 màn” khi web chỉ có desk.

| Task | Chi tiết |
|------|----------|
| Ẩn/xóa route | `products/[id].tsx`, `products/form.tsx` khỏi router công khai |
| Gỡ FAB | Không nút `+` tạo sản phẩm |
| Đổi điều hướng | Card **không** push detail; chỉ toggle hoặc không action |
| API list | `size: 12` giống web |
| Toggle | `useToggleProductStatus` — label **Tắt sản phẩm** / **Bật sản phẩm** (map `Bat/Tat product`) |
| Dev banner | `ApiConnectionBanner` chỉ khi `__DEV__` |

**Acceptance:**

- Một màn tab **Sản phẩm** = grid card + search + refresh + nút trên card
- Không còn màn form/chi tiết trong build production

---

### Giai đoạn 2 — UI card & desk layout giống web (1.5–2 ngày) ✅

**Mục tiêu:** Nhìn vào mobile nhận ra cùng “DNA” với `mgmt-promo-card`.

| Component | Mô tả |
|-----------|--------|
| `CommerceDeskHeader` | Kicker, title, mô tả ngắn (rút gọn mobile) |
| `CommerceSummaryChips` | Ít nhất chip `{n} sản phẩm` |
| `CommerceToolbar` | Search + nút Tải lại (icon Refresh) |
| `ProductDeskCard` | Thay `ProductCard`: header SKU+badge, title, subtitle, 3 dòng dl, nút toggle |

**Style map:**

- SKU: `#8f5d20`, 12px, bold, uppercase
- Badge: giống `.mgmt-promo-card header strong`
- `dt` uppercase muted, `dd` bold phải

**Acceptance:** So sánh screenshot web tab Products ↔ mobile — cùng thứ tự thông tin.

---

### Giai đoạn 3 — Hành vi list đầy đủ như web (1 ngày) ✅

| Task | Chi tiết |
|------|----------|
| Phân trang | `Pagination` đơn giản: Trang x/y, Prev/Next |
| Search | Enter + nút Tìm = gọi API `keyword` |
| Loading | Skeleton card (giữ) |
| Empty | Copy: «Không có dữ liệu phù hợp» |
| Error + Retry | Giữ |
| Message | Snackbar «Đã cập nhật sản phẩm» (giống web) |

**Acceptance:** Hành vi giống web desk; không thêm filter `productType` trừ khi web thêm.

---

### Giai đoạn 4 — Auth, API, parity web client (0.5–1 ngày) ✅

| Task | Chi tiết |
|------|----------|
| `.env` | `.env.example` — `EXPO_PUBLIC_API_FAILOVER_*`, LAN / Render / 10.0.2.2 |
| Login | `establishSessionAfterLogin` + chặn nếu thiếu `voucher.view` |
| Permissions | `useCommerceAccess` + ẩn nút toggle nếu thiếu `voucher.delete` |
| Session | `GET users/me/access-context`, 401 → `clearAuthSession` |
| Failover | `apiBaseUrl.ts` + `ApiBootstrap` — probe local rồi public |

**Acceptance:** Gọi cùng endpoint, cùng payload với `commerceApi.updateProductStatus`.

---

### Giai đoạn 5 — (Tương lai) CRUD đầy đủ — **chỉ khi web có**

**Điều kiện mở:** Web thêm `ProductManagementPane` kiểu `CampaignManagementPane` HOẶC form trong desk.

Khi đó mobile mới thêm:

- Master-detail hoặc Form create/edit
- FAB / nút «Tạo sản phẩm»
- `POST` / `PUT` / có thể `DELETE` nếu BE hỗ trợ

**Không làm trước web** — tránh thừa chỗ.

---

### Giai đoạn 9 — Login, routing & thương hiệu ✅

| Task | Chi tiết |
|------|----------|
| Login UI | Theme desk `#8f5d20`, kicker PROMOTION & COMMERCE |
| Register | Chỉ thông báo tài khoản do admin cấp (không mock đăng ký) |
| Routing | `index` → redirect; guard `(tabs)` / `(auth)` |
| Tab bar | Màu accent desk; ẩn tab consumer |
| app.json | TravelViet Commerce, expo-secure-store plugin |

---

### Giai đoạn 8 — Preferences admin & AI Chat ✅

| Task | Chi tiết |
|------|----------|
| Preferences | Tài khoản thật, API URL, danh sách quyền, mở Commerce, đăng xuất |
| AI Chat | Chỉ hiện khi đã login + đang ở tab; màu desk; refresh token khi 401 |
| Copy AI | Gợi ý theo ngữ cảnh admin/commerce |

---

### Giai đoạn 7 — Phiên đăng nhập & app admin ✅

| Task | Chi tiết |
|------|----------|
| SecureStore | Lưu session sau login; khôi phục khi mở app |
| Refresh token | `POST /auth/refresh` + retry request khi 401 (giống web) |
| Tab bar | Ẩn Home/Tours/Destinations — chỉ Commerce + Preferences |
| Bootstrap | `AppBootstrap`: API URL + restore session |

---

### Giai đoạn 6 — Mở rộng desk 4 tab ✅

- Tab bottom **Commerce** với segment 4 tab: Vouchers | Campaigns | Products | Combos
- API: `vouchers`, `promotion-campaigns`, `products`, `combo-packages`
- Toggle: `voucher.publish`, `promotion.campaign.publish`, `voucher.delete` (product/combo)
- Header 4 chip summary (totalElements)

---

## 5. Ma trận đồng bộ chi tiết (checklist dev)

| # | Hạng mục | Web | Mobile target |
|---|----------|-----|---------------|
| 1 | Màn hình chính | 1 panel tab | 1 tab `products/index` |
| 2 | SKU vị trí | Header trái | Header trái |
| 3 | Trạng thái | Header phải | Header phải |
| 4 | Tên | h4 | Title 18px bold |
| 5 | Mô tả | p | Subtitle 13px muted |
| 6 | Giá | dt/dd | Row label Giá |
| 7 | Tồn kho | dt/dd | Row label Tồn kho |
| 8 | Gift | dt/dd | Row label Quà tặng |
| 9 | Tạo mới | Không | Không |
| 10 | Sửa form | Không | Không |
| 11 | Chi tiết | Không | Không |
| 12 | Xóa/tắt | Nút card PATCH | Nút card PATCH |
| 13 | page size | 12 | 12 |
| 14 | formatMoney | vi-VN 0 decimals | Cùng hàm |

---

## 6. Rủi ro & quyết định cần bạn xác nhận

1. **Màu chủ đạo:** Theo web desk `#8f5d20` hay giữ `#2563EB`?  
   → Đề xuất: **Desk = #8f5d20**; consumer tabs giữ theme hiện tại.

2. **CRUD trên mobile:** Có cần giữ form create/edit ẩn sau feature flag không?  
   → Đề xuất: **Tắt hẳn** đến Giai đoạn 5.

3. **Phạm vi mobile app:** Chỉ admin desk hay vẫn là app khách (Home/Tour)?  
   → Đề xuất: Tab **Sản phẩm** = admin; Home/Tour = phase sau, không trộn API product.

4. **4 tab Voucher/Campaign/Combo:** Làm ngay hay chỉ Products?  
   → Đề xuất: **Chỉ Products** trước (Giai đoạn 1–4).

---

## 7. Thứ tự bắt đầu triển khai (đề xuất tuần tự)

```
G0 Chuẩn bị → G1 Cắt phạm vi → G2 UI card/desk → G3 Pagination/search → G4 Auth/API → (G5 CRUD khi web sẵn sàng)
```

**Không song song G2 + G5** — tránh làm lại hai lần.

---

## 8. File sẽ chạm khi triển khai (dự kiến)

| Giai đoạn | File |
|-----------|------|
| G0 | `theme/commerceDesk.ts`, `constants/commerceDeskCopy.ts` |
| G1 | Xóa/ẩn `(tabs)/products/[id].tsx`, `form.tsx`; sửa `index.tsx`, `ProductCard` |
| G2 | `ProductDeskCard.tsx`, `CommerceDeskHeader.tsx`, `CommerceToolbar.tsx` |
| G3 | `ProductPagination.tsx`, hooks `useProductList` params |
| G4 | `config/apiConfig.ts`, `(auth)/login.tsx`, permissions guard |

---

## 9. Tiêu chí “xong” toàn initiative

- [x] User mở Commerce Desk thấy layout giống web (4 tab + card)
- [x] Không có màn/thao tác mà web không có (CRUD chờ G5)
- [x] Toggle trạng thái hoạt động, message rõ
- [x] Dữ liệu từ BE thật, `size=12`, search keyword
- [ ] QA trên emulator + máy thật với `.env` đúng IP (manual)

---

*Tài liệu này là baseline trước khi code Giai đoạn 1. Mọi PR mobile product nên link tới checklist §5.*
