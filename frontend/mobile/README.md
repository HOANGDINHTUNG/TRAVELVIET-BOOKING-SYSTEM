# TravelViet Commerce (Mobile)

Ứng dụng Expo dành cho **admin / commerce desk** — đồng bộ web `PromotionCommercePanel` (4 tab: Vouchers, Campaigns, Products, Combos).

## Tính năng

- List + tìm kiếm + phân trang (`size=12`) + bật/tắt trạng thái (PATCH status)
- **Không** CRUD form (chờ web có `ProductManagementPane` — Giai đoạn 5)
- Đăng nhập API thật, SecureStore, refresh token khi 401
- Tab: **Commerce** + **Cài đặt** (+ AI assistant khi đã login)

## Tài liệu

| File | Mô tả |
|------|--------|
| [docs/MOBILE_WEB_PRODUCT_ALIGNMENT_PLAN.md](docs/MOBILE_WEB_PRODUCT_ALIGNMENT_PLAN.md) | Kế hoạch G0–G9 |
| [HUONG_DAN_TEST_SAN_PHAM.md](HUONG_DAN_TEST_SAN_PHAM.md) | Hướng dẫn test API / quyền |

## Cấu hình

```bash
cd frontend/mobile
npm install
copy .env.example .env
# Sửa EXPO_PUBLIC_API_LOCAL_URL (emulator: 10.0.2.2:8088, máy thật: IP LAN)
npx expo start -c
```

## Quyền tối thiểu

- Vào app: `voucher.view` **hoặc** `promotion.campaign.view`
- Toggle voucher: `voucher.publish`
- Toggle campaign: `promotion.campaign.publish`
- Toggle product/combo: `voucher.delete`

## Cấu trúc chính

```
app/(tabs)/products/     → Commerce Desk (4 segment tabs)
app/(tabs)/preferences/  → Tài khoản + API + đăng xuất
app/(auth)/login.tsx     → Login desk theme #8f5d20
features/commerce/       → CommerceDeskScreen, hooks API
services/                → apiClient, authSession, promotionApi, …
theme/commerceDesk.ts    → Design tokens web backoffice
```

## Theme

Màu chủ đạo desk: **`#8f5d20`** (`theme/commerceDesk.ts`) — không dùng consumer blue `#2563EB` trên desk.
