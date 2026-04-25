# Backoffice Next Phase Notes

Date: 2026-04-24

## Scope delivered in this phase
- Added `/management` area with manager-role guard.
- Added role-based management hub for:
  - `SUPER_ADMIN`
  - `ADMIN`
  - `CONTENT_EDITOR`
  - `FIELD_STAFF`
  - `OPERATOR`
- Mapped current backend controllers/endpoints to each role view.
- Added quick API checks (GET) for key backoffice endpoints.

## Controller/API observations
- Booking currently has detail/status actions only (`/bookings/{id}`); no list/search endpoint for operations dashboard.
- Tour listing for backoffice is currently relying on public `/tours`; no dedicated `/admin/tours` list/search endpoint.
- Notifications controller uses `hasAuthority('user.update')` while seed permissions define `notification.send`; this should be aligned.
- Support has list/detail/actions, but no pagination in `/support/sessions` response yet (returns full list).
- Weather admin endpoints are destination-scoped; UI flow should include destination selector before weather management actions.

## Recommended next backend tasks
1. Add `GET /bookings` with search filters and pagination.
2. Add `GET /admin/tours` with admin-level filters/status.
3. Align notification permission check to `notification.send`.
4. Add permission/introspection endpoint for current user (example: `/users/me/permissions`) to avoid hardcoded UI assumptions.
5. Add list endpoint for refunds/payments if operation team needs queue-based workflow.

## Recommended next frontend tasks
1. Create CRUD pages per module (Users, Destinations, Tours, Schedules, Bookings, Refunds, Support).
2. Add role-permission driven menu from backend API instead of seed map in frontend.
3. Add reusable table/filter/pagination components for backoffice pages.
4. Add centralized error boundary/toast for backoffice API actions.
