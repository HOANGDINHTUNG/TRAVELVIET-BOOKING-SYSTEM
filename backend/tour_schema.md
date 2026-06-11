#### Bảng: `tours`
**Entity Java:** `Tour`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `--` | `id` | Unique, NOT NULL |  |
| `--` | `mã` | NOT NULL |  |
| `--` | `tên` | Unique, NOT NULL |  |
| `--` | `slug` | Nullable |  |
| `--` | `id` | Nullable |  |
| `--` | `mô` | Nullable |  |
| `--` | `mô` | Nullable |  |
| `--` | `điểm` | Nullable |  |
| `--` | `bao` | Nullable |  |
| `--` | `không` | Nullable |  |
| `--` | `ghi` | NOT NULL |  |
| `--` | `số` | NOT NULL, Default |  |
| `--` | `số` | NOT NULL, Default |  |
| `--` | `giá` | Nullable | điểm ESG 0-100 |
| `lei_score` | `TINYINT` | Nullable | điểm LEI 0-100 |
| `list_price` | `DECIMAL(14` | Nullable | giá niêm yết (gạch ngang) |
| `currency` | `CHAR(3)` | NOT NULL, Default |  |
| `--` | `loại` | Nullable |  |
| `--` | `loại` | NOT NULL, Default |  |
| `--` | `loại` | NOT NULL, Default |  |
| `--` | `độ` | NOT NULL, Default |  |
| `--` | `độ` | Nullable |  |
| `--` | `tuổi` | Nullable |  |
| `--` | `tuổi` | NOT NULL, Default |  |
| `--` | `số` | NOT NULL, Default |  |
| `--` | `số` | NOT NULL, Default |  |
| `--` | `có` | NOT NULL, Default |  |
| `--` | `có` | NOT NULL, Default |  |
| `--` | `có` | NOT NULL, Default |  |
| `--` | `có` | NOT NULL, Default |  |
| `--` | `điểm` | NOT NULL, Default |  |
| `--` | `số` | NOT NULL, Default |  |
| `--` | `số` | NOT NULL, Default |  |
| `--` | `trạng` | Nullable |  |
| `--` | `id` | Nullable |  |
| `--` | `id` | NOT NULL, Default |  |
| `--` | `ngày` | NOT NULL, Default |  |
| `--` | `ngày` | Nullable |  |
| `--` | `ngày` | Nullable |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `tour_destinations`
**Entity Java:** `Chưa xác định`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `tour_id` | `BIGINT` | NOT NULL |  |
| `destination_id` | `BIGINT` | NOT NULL |  |
| `created_at` | `DATETIME` | NOT NULL, Default |  |
| `updated_at` | `DATETIME` | NOT NULL, Default |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `tour_translations`
**Entity Java:** `Chưa xác định`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `tour_id` | `BIGINT` | NOT NULL |  |
| `locale` | `VARCHAR(10)` | NOT NULL |  |
| `name` | `VARCHAR(255)` | Nullable |  |
| `short_description` | `TEXT` | Nullable |  |
| `description` | `TEXT` | Nullable |  |
| `highlights` | `TEXT` | Nullable |  |
| `inclusions` | `TEXT` | Nullable |  |
| `exclusions` | `TEXT` | Nullable |  |
| `notes` | `TEXT` | Nullable |  |
| `itinerary_summary` | `TEXT` | Nullable |  |
| `created_at` | `DATETIME` | NOT NULL, Default |  |
| `updated_at` | `DATETIME` | NOT NULL, Default |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `tour_tags`
**Entity Java:** `TourTag`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `tour_id` | `BIGINT` | NOT NULL |  |
| `tag_id` | `BIGINT` | NOT NULL |  |
| `created_at` | `DATETIME` | NOT NULL, Default |  |
| `updated_at` | `DATETIME` | NOT NULL, Default |  |
| `deleted_at` | `DATETIME` | Nullable |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `tour_media`
**Entity Java:** `TourMedia`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `tour_id` | `BIGINT` | NOT NULL |  |
| `media_type` | `ENUM('image',` | NOT NULL, Default |  |
| `media_url` | `TEXT` | NOT NULL |  |
| `alt_text` | `VARCHAR(255)` | Nullable |  |
| `sort_order` | `INT` | NOT NULL, Default |  |
| `is_active` | `BOOLEAN` | NOT NULL, Default |  |
| `created_at` | `DATETIME` | NOT NULL, Default |  |
| `updated_at` | `DATETIME` | NOT NULL, Default |  |
| `deleted_at` | `DATETIME` | Nullable |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `tour_seasonality`
**Entity Java:** `TourSeasonality`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `tour_id` | `BIGINT` | NOT NULL |  |
| `season_name` | `VARCHAR(100)` | NOT NULL |  |
| `month_from` | `TINYINT` | Nullable |  |
| `month_to` | `TINYINT` | Nullable |  |
| `recommendation_score` | `DECIMAL(5` | NOT NULL, Default |  |
| `notes` | `TEXT` | Nullable |  |
| `created_at` | `DATETIME` | NOT NULL, Default |  |
| `updated_at` | `DATETIME` | NOT NULL, Default |  |
| `deleted_at` | `DATETIME` | Nullable |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `tour_itinerary_days`
**Entity Java:** `TourItineraryDay`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `tour_id` | `BIGINT` | NOT NULL |  |
| `day_number` | `SMALLINT` | NOT NULL |  |
| `title` | `VARCHAR(255)` | NOT NULL |  |
| `description` | `TEXT` | Nullable |  |
| `overnight_destination_id` | `BIGINT` | Nullable |  |
| `created_at` | `DATETIME` | NOT NULL, Default |  |
| `updated_at` | `DATETIME` | NOT NULL, Default |  |
| `deleted_at` | `DATETIME` | Nullable |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `tour_checklist_items`
**Entity Java:** `TourChecklistItem`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `tour_id` | `BIGINT` | NOT NULL |  |
| `item_name` | `VARCHAR(200)` | NOT NULL |  |
| `item_group` | `VARCHAR(80)` | Nullable |  |
| `is_required` | `BOOLEAN` | NOT NULL, Default |  |
| `created_at` | `DATETIME` | NOT NULL, Default |  |
| `updated_at` | `DATETIME` | NOT NULL, Default |  |
| `deleted_at` | `DATETIME` | Nullable |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `tour_schedules`
**Entity Java:** `TourSchedule`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `schedule_code` | `VARCHAR(40)` | Unique |  |
| `tour_id` | `BIGINT` | NOT NULL |  |
| `departure_at` | `DATETIME` | NOT NULL |  |
| `return_at` | `DATETIME` | NOT NULL |  |
| `booking_open_at` | `DATETIME` | Nullable |  |
| `booking_close_at` | `DATETIME` | Nullable |  |
| `meeting_at` | `DATETIME` | Nullable |  |
| `meeting_point_name` | `VARCHAR(200)` | Nullable |  |
| `meeting_address` | `TEXT` | Nullable |  |
| `meeting_latitude` | `DECIMAL(10,7)` | Nullable |  |
| `meeting_longitude` | `DECIMAL(10,7)` | Nullable |  |
| `capacity_total` | `INT` | NOT NULL |  |
| `--` | `Chỉ` | Nullable |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `tour_schedule_pickup_points`
**Entity Java:** `TourSchedulePickupPoint`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `schedule_id` | `BIGINT` | NOT NULL |  |
| `point_name` | `VARCHAR(200)` | NOT NULL |  |
| `address` | `TEXT` | NOT NULL |  |
| `latitude` | `DECIMAL(10` | Nullable |  |
| `longitude` | `DECIMAL(10` | Nullable |  |
| `pickup_at` | `DATETIME` | Nullable |  |
| `sort_order` | `INT` | NOT NULL, Default |  |
| `created_at` | `DATETIME` | NOT NULL, Default |  |
| `updated_at` | `DATETIME` | NOT NULL, Default |  |
| `deleted_at` | `DATETIME` | Nullable |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `tour_schedule_guides`
**Entity Java:** `TourScheduleGuide`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `schedule_id` | `BIGINT` | NOT NULL |  |
| `guide_id` | `BIGINT` | NOT NULL |  |
| `guide_role` | `VARCHAR(80)` | NOT NULL, Default |  |
| `assigned_at` | `DATETIME` | NOT NULL, Default |  |
| `created_at` | `DATETIME` | NOT NULL, Default |  |
| `updated_at` | `DATETIME` | NOT NULL, Default |  |
| `deleted_at` | `DATETIME` | Nullable |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `tour_price_rules`
**Entity Java:** `Chưa xác định`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `tour_id` | `BIGINT` | NOT NULL |  |
| `rule_name` | `VARCHAR(200)` | NOT NULL |  |
| `rule_type` | `ENUM('seasonal','holiday','early_bird','last_minute','group_size','channel','member_level','custom')` | NOT NULL, Default |  |
| `target_guest_type` | `ENUM('all','adult','child','infant','senior')` | NOT NULL, Default |  |
| `adjust_type` | `ENUM('fixed_amount','percentage','override_price')` | NOT NULL, Default |  |
| `adjust_value` | `DECIMAL(14,2)` | NOT NULL, Default |  |
| `min_people_count` | `INT` | Nullable |  |
| `max_people_count` | `INT` | Nullable |  |
| `member_level` | `ENUM('bronze','silver','gold','platinum','diamond')` | Nullable |  |
| `booking_from` | `DATETIME` | Nullable |  |
| `booking_to` | `DATETIME` | Nullable |  |
| `departure_from` | `DATETIME` | Nullable |  |
| `departure_to` | `DATETIME` | Nullable |  |
| `priority_no` | `INT` | NOT NULL, Default |  |
| `is_stackable` | `BOOLEAN` | NOT NULL, Default |  |
| `is_active` | `BOOLEAN` | NOT NULL, Default |  |
| `created_at` | `DATETIME` | NOT NULL, Default |  |
| `updated_at` | `DATETIME` | NOT NULL, Default |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `tour_supplier_services`
**Entity Java:** `Chưa xác định`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `tour_id` | `BIGINT` | NOT NULL |  |
| `supplier_service_id` | `BIGINT` | NOT NULL |  |
| `quantity_default` | `INT` | NOT NULL, Default |  |
| `note` | `TEXT` | Nullable |  |
| `created_at` | `DATETIME` | NOT NULL, Default |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `tour_schedule_status_history`
**Entity Java:** `Chưa xác định`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `schedule_id` | `BIGINT` | NOT NULL |  |
| `old_status` | `ENUM('draft','open','closed','full','departed','completed','cancelled')` | Nullable |  |
| `new_status` | `ENUM('draft','open','closed','full','departed','completed','cancelled')` | NOT NULL |  |
| `changed_by` | `CHAR(36)` | Nullable |  |
| `note` | `TEXT` | Nullable |  |
| `created_at` | `DATETIME` | NOT NULL, Default |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `tour_departure_hubs`
**Entity Java:** `TourDepartureHub`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `tour_id` | `BIGINT` | NOT NULL |  |
| `city_code` | `VARCHAR(10)` | NOT NULL |  |
| `city_name_vi` | `VARCHAR(120)` | NOT NULL |  |
| `city_name_en` | `VARCHAR(120)` | Nullable |  |
| `is_primary` | `BOOLEAN` | NOT NULL, Default |  |
| `sort_order` | `INT` | NOT NULL, Default |  |
| `created_at` | `DATETIME` | NOT NULL, Default |  |
| `updated_at` | `DATETIME` | NOT NULL, Default |  |
| `deleted_at` | `DATETIME` | Nullable |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `tour_combo_packages`
**Entity Java:** `TourComboPackageLink`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `tour_id` | `BIGINT` | NOT NULL |  |
| `combo_id` | `BIGINT` | NOT NULL |  |
| `package_role` | `ENUM('included',` | NOT NULL, Default |  |
| `is_default` | `BOOLEAN` | NOT NULL, Default |  |
| `sort_order` | `INT` | NOT NULL, Default |  |
| `created_at` | `DATETIME` | NOT NULL, Default |  |
| `updated_at` | `DATETIME` | NOT NULL, Default |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `tour_inclusion_flags`
**Entity Java:** `TourInclusionFlags`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `tour_id` | `BIGINT` | PK |  |
| `has_flight` | `BOOLEAN` | NOT NULL, Default |  |
| `has_hotel` | `BOOLEAN` | NOT NULL, Default |  |
| `has_meals` | `BOOLEAN` | NOT NULL, Default |  |
| `has_tickets` | `BOOLEAN` | NOT NULL, Default |  |
| `has_guide` | `BOOLEAN` | NOT NULL, Default |  |
| `has_insurance` | `BOOLEAN` | NOT NULL, Default |  |
| `has_transport` | `BOOLEAN` | NOT NULL, Default |  |
| `hotel_stars` | `TINYINT` | Nullable |  |
| `flight_type` | `ENUM('none',` | NOT NULL, Default |  |
| `notes` | `VARCHAR(500)` | Nullable |  |
| `created_at` | `DATETIME` | NOT NULL, Default |  |
| `updated_at` | `DATETIME` | NOT NULL, Default |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

