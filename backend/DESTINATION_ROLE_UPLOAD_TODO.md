# Destination Role + Upload (MinIO)

Date: 2026-04-24

## Role xu ly Destination

- `SUPER_ADMIN`: full access (bao gom create/update/delete/approve/reject).
- `ADMIN`: `destination.create`, `destination.update`, `destination.delete`, `destination.publish`, `destination.review`.
- `CONTENT_EDITOR`: `destination.create`, `destination.update`, `destination.publish`, `destination.review`.
- `FIELD_STAFF`: `destination.create`, `destination.update`, `destination.review`.
- `OPERATOR`: `destination.view`, `destination.review` (khong co delete).

## API da co cho Destination

- `GET /admin/destinations`
- `GET /admin/destinations/{uuid}`
- `POST /admin/destinations` (JSON)
- `PUT /admin/destinations/{uuid}` (JSON)
- `DELETE /admin/destinations/{uuid}`
- `PATCH /admin/destinations/{uuid}/approve`
- `PATCH /admin/destinations/{uuid}/reject`

## API moi da them (upload file qua MinIO roi lay URL)

- `POST /admin/destinations` với `multipart/form-data`
  - part `destination`: JSON `DestinationRequest`
  - part `imageFiles`: `MultipartFile[]` (optional)
  - part `videoFiles`: `MultipartFile[]` (optional)
- `PUT /admin/destinations/{uuid}` với `multipart/form-data`
  - part `destination`: JSON `DestinationRequest`
  - part `imageFiles`: `MultipartFile[]` (optional)
  - part `videoFiles`: `MultipartFile[]` (optional)

Controller tu dong:
1. Upload file len MinIO qua `FileService.uploadFile(...)`
2. Nhan URL tra ve
3. Ghep URL vao `mediaList` trong request roi moi save destination

## TODO API de trong (ban co the them sau)

- `POST /admin/destinations/media/upload` (single upload, tra ve URL)
- `DELETE /admin/destinations/media` (xoa object tren MinIO theo URL/objectKey)
- `POST /admin/destinations/media/presign` (neu can direct upload tu frontend)

