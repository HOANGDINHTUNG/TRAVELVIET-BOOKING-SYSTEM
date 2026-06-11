#### Bảng: `destinations`
**Entity Java:** `Destination`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `--` | `id` | NOT NULL, Default |  |
| `--` | `uuid` | Unique, NOT NULL |  |
| `--` | `mã` | NOT NULL |  |
| `--` | `tên` | Unique, NOT NULL |  |
| `--` | `slug` | NOT NULL, Default |  |
| `--` | `mã` | NOT NULL |  |
| `--` | `tỉnh` | Nullable |  |
| `--` | `quận` | Nullable |  |
| `--` | `khu` | Nullable |  |
| `--` | `địa` | Nullable |  |
| `--` | `vĩ` | Nullable |  |
| `--` | `kinh` | Nullable |  |
| `--` | `mô` | Nullable |  |
| `--` | `mô` | Nullable |  |
| `--` | `tháng` | Nullable |  |
| `--` | `tháng` | NOT NULL, Default |  |
| `--` | `mức` | NOT NULL, Default |  |
| `--` | `có` | NOT NULL, Default |  |
| `--` | `có` | NOT NULL, Default |  |
| `--` | `trạng` | Nullable |  |
| `--` | `id` | Nullable |  |
| `--` | `id` | Nullable |  |
| `--` | `lý` | NOT NULL, Default |  |
| `--` | `có` | Nullable |  |
| `destination_level` | `INT` | NOT NULL, Default |  |
| `destination_path` | `VARCHAR(512)` | NOT NULL, Default |  |
| `created_at` | `DATETIME` | NOT NULL, Default |  |
| `--` | `ngày` | NOT NULL, Default |  |
| `--` | `ngày` | Nullable |  |
| `--` | `ngày` | Unique |  |
| `--` | `unique` | Nullable |  |
| `--` | `kiểm` | Nullable |  |
| `--` | `kiểm` | Nullable |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `destination_translations`
**Entity Java:** `Chưa xác định`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `destination_id` | `BIGINT` | NOT NULL |  |
| `locale` | `VARCHAR(10)` | NOT NULL |  |
| `name` | `VARCHAR(200)` | Nullable |  |
| `short_description` | `TEXT` | Nullable |  |
| `description` | `TEXT` | Nullable |  |
| `created_at` | `DATETIME` | NOT NULL, Default |  |
| `updated_at` | `DATETIME` | NOT NULL, Default |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `destination_media`
**Entity Java:** `DestinationMedia`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `--` | `id` | NOT NULL |  |
| `--` | `id` | NOT NULL, Default |  |
| `--` | `loại` | NOT NULL |  |
| `--` | `url` | Nullable |  |
| `--` | `text` | NOT NULL, Default |  |
| `--` | `thứ` | NOT NULL, Default |  |
| `--` | `có` | NOT NULL, Default |  |
| `--` | `ngày` | NOT NULL, Default |  |
| `--` | `ngày` | Nullable |  |
| `--` | `ngày` | Nullable |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `destination_foods`
**Entity Java:** `DestinationFood`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `--` | `id` | NOT NULL |  |
| `--` | `id` | NOT NULL |  |
| `--` | `tên` | Nullable |  |
| `--` | `mô` | NOT NULL, Default |  |
| `--` | `có` | NOT NULL, Default |  |
| `--` | `ngày` | NOT NULL, Default |  |
| `--` | `ngày` | Nullable |  |
| `--` | `ngày` | Nullable |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `destination_specialties`
**Entity Java:** `DestinationSpecialty`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `--` | `id` | NOT NULL |  |
| `--` | `id` | NOT NULL |  |
| `--` | `tên` | Nullable |  |
| `--` | `mô` | NOT NULL, Default |  |
| `--` | `ngày` | NOT NULL, Default |  |
| `--` | `ngày` | Nullable |  |
| `--` | `ngày` | Nullable |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `destination_activities`
**Entity Java:** `DestinationActivity`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `--` | `id` | NOT NULL |  |
| `--` | `id` | NOT NULL |  |
| `--` | `tên` | Nullable |  |
| `--` | `mô` | NOT NULL, Default |  |
| `--` | `điểm` | NOT NULL, Default |  |
| `--` | `ngày` | NOT NULL, Default |  |
| `--` | `ngày` | Nullable |  |
| `--` | `ngày` | Nullable |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `destination_tips`
**Entity Java:** `DestinationTip`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `--` | `id` | NOT NULL |  |
| `--` | `id` | NOT NULL |  |
| `--` | `tên` | NOT NULL |  |
| `--` | `nội` | NOT NULL, Default |  |
| `--` | `thứ` | NOT NULL, Default |  |
| `--` | `ngày` | NOT NULL, Default |  |
| `--` | `ngày` | Nullable |  |
| `--` | `ngày` | Nullable |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `destination_events`
**Entity Java:** `DestinationEvent`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `--` | `id` | NOT NULL |  |
| `--` | `id` | NOT NULL |  |
| `--` | `tên` | Nullable |  |
| `--` | `loại` | Nullable |  |
| `--` | `mô` | Nullable |  |
| `--` | `ngày` | Nullable |  |
| `--` | `ngày` | NOT NULL, Default |  |
| `--` | `có` | NOT NULL, Default |  |
| `--` | `có` | NOT NULL, Default |  |
| `--` | `ngày` | NOT NULL, Default |  |
| `--` | `ngày` | Nullable |  |
| `--` | `ngày` | Nullable |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `destination_follows`
**Entity Java:** `DestinationFollow`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `--` | `id` | NOT NULL |  |
| `--` | `id` | NOT NULL |  |
| `--` | `id` | NOT NULL, Default |  |
| `--` | `có` | NOT NULL, Default |  |
| `--` | `có` | NOT NULL, Default |  |
| `--` | `có` | NOT NULL, Default |  |
| `--` | `có` | NOT NULL, Default |  |
| `--` | `ngày` | NOT NULL, Default |  |
| `--` | `ngày` | Nullable |  |
| `--` | `ngày` | Unique |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `destination_proposals`
**Entity Java:** `Chưa xác định`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `proposal_code` | `VARCHAR(50)` | Unique, NOT NULL |  |
| `proposed_by` | `CHAR(36)` | NOT NULL |  |
| `proposal_type` | `ENUM('new_destination','update_destination')` | NOT NULL, Default |  |
| `destination_id` | `BIGINT` | Nullable |  |
| `name` | `VARCHAR(200)` | NOT NULL |  |
| `country_code` | `CHAR(2)` | NOT NULL, Default |  |
| `province` | `VARCHAR(120)` | Nullable |  |
| `district` | `VARCHAR(120)` | Nullable |  |
| `region` | `VARCHAR(120)` | Nullable |  |
| `address` | `TEXT` | Nullable |  |
| `latitude` | `DECIMAL(10,7)` | Nullable |  |
| `longitude` | `DECIMAL(10,7)` | Nullable |  |
| `short_description` | `TEXT` | Nullable |  |
| `description` | `TEXT` | Nullable |  |
| `evidence_note` | `TEXT` | Nullable |  |
| `status` | `ENUM('draft','submitted','under_review','approved','rejected','published','cancelled')` | NOT NULL, Default |  |
| `submitted_at` | `DATETIME` | Nullable |  |
| `reviewed_by` | `CHAR(36)` | Nullable |  |
| `reviewed_at` | `DATETIME` | Nullable |  |
| `review_note` | `TEXT` | Nullable |  |
| `created_at` | `DATETIME` | NOT NULL, Default |  |
| `updated_at` | `DATETIME` | NOT NULL, Default |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `destination_proposal_attachments`
**Entity Java:** `Chưa xác định`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `proposal_id` | `BIGINT` | NOT NULL |  |
| `file_url` | `TEXT` | NOT NULL |  |
| `file_type` | `VARCHAR(50)` | Nullable |  |
| `caption` | `VARCHAR(255)` | Nullable |  |
| `created_at` | `DATETIME` | NOT NULL, Default |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

#### Bảng: `destination_proposal_reviews`
**Entity Java:** `Chưa xác định`

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |
|--------------------|--------------|-----------|-----------------|
| `id` | `BIGINT` | PK, Auto Inc |  |
| `proposal_id` | `BIGINT` | NOT NULL |  |
| `reviewer_id` | `CHAR(36)` | NOT NULL |  |
| `decision` | `ENUM('request_update','approve','reject')` | NOT NULL |  |
| `note` | `TEXT` | Nullable |  |
| `created_at` | `DATETIME` | NOT NULL, Default |  |

**Chú thích quan hệ logic:**
- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]

