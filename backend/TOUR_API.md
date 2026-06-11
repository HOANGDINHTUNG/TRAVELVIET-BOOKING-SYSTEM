### API ENDPOINTS - TOURS

| STT | Phương thức | Đường dẫn URL | Quyền truy cập | DTO Đầu vào | ApiResponse Đầu ra | Chú thích (Controller) |
|-----|-------------|---------------|----------------|-------------|--------------------|-------------------------|
| 1 | `PUT` | `/admin/guides/{guideId}/translations/{locale}` | Mặc định (User/Public) | `UpsertGuideTranslationRequest` | `GuideTranslationResponse` | AdminGuideTranslationController.java |
| 2 | `GET` | `/admin/tours/{id}` | Mặc định (User/Public) | `Params` | `TourResponse` | AdminTourController.java |
| 3 | `POST` | `/admin/toursfileImage` | Mặc định (User/Public) | `N/A` | `TourResponse` | AdminTourController.java |
| 4 | `PUT` | `/admin/tours/{id}` | Mặc định (User/Public) | `TourRequest` | `TourResponse` | AdminTourController.java |
| 5 | `PUT` | `/admin/tours/{id}` | Mặc định (User/Public) | `Params` | `TourResponse` | AdminTourController.java |
| 6 | `DELETE` | `/admin/tours/{id}` | Mặc định (User/Public) | `Params` | `String` | AdminTourController.java |
| 7 | `GET` | `/admin/tours/{tourId}/schedules` | Mặc định (User/Public) | `Params` | `List<TourScheduleResponse` | AdminTourController.java |
| 8 | `GET` | `/admin/tours/{tourId}/schedules/{scheduleId}` | Mặc định (User/Public) | `Params` | `TourScheduleResponse` | AdminTourController.java |
| 9 | `POST` | `/admin/tours/{tourId}/schedules` | Mặc định (User/Public) | `TourScheduleRequest` | `TourScheduleResponse` | AdminTourController.java |
| 10 | `PUT` | `/admin/tours/{tourId}/schedules/{scheduleId}` | Mặc định (User/Public) | `TourScheduleRequest` | `TourScheduleResponse` | AdminTourController.java |
| 11 | `PATCH` | `/admin/tours/{tourId}/schedules/{scheduleId}/status` | Mặc định (User/Public) | `UpdateTourScheduleStatusRequest` | `TourScheduleResponse` | AdminTourController.java |
| 12 | `PUT` | `/admin/tours/{tourId}/translations/{locale}` | Mặc định (User/Public) | `UpsertTourTranslationRequest` | `TourTranslationResponse` | AdminTourTranslationController.java |
| 13 | `DELETE` | `/admin/tours/{tourId}/translations/{locale}` | Mặc định (User/Public) | `Params` | `Void` | AdminTourTranslationController.java |
| 14 | `GET` | `/tours/{id}` | Mặc định (User/Public) | `Params` | `TourResponse` | TourController.java |
| 15 | `GET` | `/tours/{id}/schedules` | Mặc định (User/Public) | `Params` | `List<TourScheduleResponse` | TourController.java |
| 16 | `GET` | `/tours/{tourId}/schedules/{scheduleId}` | Mặc định (User/Public) | `Params` | `TourScheduleResponse` | TourController.java |
