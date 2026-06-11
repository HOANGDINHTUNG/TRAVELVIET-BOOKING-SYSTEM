### API ENDPOINTS - DESTINATIONS

| STT | Phương thức | Đường dẫn URL | Quyền truy cập | DTO Đầu vào | ApiResponse Đầu ra | Chú thích (Controller) |
|-----|-------------|---------------|----------------|-------------|--------------------|-------------------------|
| 1 | `GET` | `/admin/destinations/{uuid}` | Mặc định (User/Public) | `Params` | `DestinationDetailResponse` | AdminDestinationController.java |
| 2 | `POST` | `/admin/destinationsimageFiles` | Mặc định (User/Public) | `N/A` | `DestinationDetailResponse` | AdminDestinationController.java |
| 3 | `PUT` | `/admin/destinations/{uuid}` | Mặc định (User/Public) | `DestinationRequest` | `DestinationDetailResponse` | AdminDestinationController.java |
| 4 | `PUT` | `/admin/destinations/{uuid}` | Mặc định (User/Public) | `Params` | `DestinationDetailResponse` | AdminDestinationController.java |
| 5 | `DELETE` | `/admin/destinations/{uuid}` | Mặc định (User/Public) | `Params` | `Void` | AdminDestinationController.java |
| 6 | `PATCH` | `/admin/destinations/{uuid}/approve` | Mặc định (User/Public) | `Params` | `DestinationDetailResponse` | AdminDestinationController.java |
| 7 | `PATCH` | `/admin/destinations/{uuid}/reject` | Mặc định (User/Public) | `RejectProposalRequest` | `DestinationDetailResponse` | AdminDestinationController.java |
| 8 | `PUT` | `/admin/destinations/{destinationUuid}/translations/{locale}` | Mặc định (User/Public) | `UpsertDestinationTranslationRequest` | `DestinationTranslationResponse` | AdminDestinationTranslationController.java |
| 9 | `GET` | `/destinations/program/{programSlug}` | Mặc định (User/Public) | `Params` | `DestinationPublicDetailResponse` | DestinationController.java |
| 10 | `GET` | `/destinations/{uuid}` | Mặc định (User/Public) | `Params` | `DestinationPublicDetailResponse` | DestinationController.java |
| 11 | `POST` | `/destinations/propose` | Mặc định (User/Public) | `ProposeDestinationRequest` | `DestinationProposalResponse` | DestinationController.java |
| 12 | `POST` | `/destinations/{uuid}/follow` | Có @PreAuthorize | `Params` | `DestinationFollowResponse` | DestinationFollowController.java |
| 13 | `DELETE` | `/destinations/{uuid}/follow` | Có @PreAuthorize | `Params` | `Void` | DestinationFollowController.java |
| 14 | `PUT` | `/destinations/{uuid}/follow/settings` | Có @PreAuthorize | `FollowDestinationRequest` | `DestinationFollowResponse` | DestinationFollowController.java |
| 15 | `GET` | `/destinations/me/follows` | Có @PreAuthorize | `Params` | `PageResponse<DestinationFollowResponse` | DestinationFollowController.java |
| 16 | `GET` | `/users/me/destination-follows` | Có @PreAuthorize | `Params` | `PageResponse<DestinationFollowResponse` | UserMeDestinationFollowsController.java |
