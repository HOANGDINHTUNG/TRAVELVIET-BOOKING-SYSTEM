# TravelViet Phase 1 - Schema Design (Hotels / Flights / Combos)

## 1) Muc tieu thiet ke

- Mo rong he thong hien tai theo huong an toan, khong pha vo luong Tour/Booking cu.
- Rang buoc chat che voi `destinations`.
- Ho tro dat phong, dat ve may bay, dat combo va gom thanh toan chung qua `orders`.
- Khong tao migration version moi ngoai he `V1` den `V8`.

## 2) Nguyen tac tuong thich

- Giu nguyen bang `bookings` hien tai cho Tour.
- Bo sung bang moi cho cac nghiep vu moi:
  - `hotel_bookings`
  - `flight_bookings`
  - `combo_bookings`
- Tat ca booking moi lien ket `order_id` de gom cung payment session.

## 3) Text ERD de duyet

### 3.1 Hotels domain

#### `hotels` (mo rong bang da ton tai)
- Them cot:
  - `destination_id BIGINT NOT NULL` -> FK `destinations(id)`
  - `slug VARCHAR(220) NULL UNIQUE`
  - `review_score DECIMAL(3,2) NULL`
  - `description TEXT NULL`
- Rang buoc:
  - FK destination ON DELETE RESTRICT
  - Index: `(destination_id, status)`, `(star_rating, status)`

#### `hotel_room_types` (moi)
- `id BIGINT PK AUTO_INCREMENT`
- `hotel_id BIGINT NOT NULL` -> FK `hotels(id)`
- `code VARCHAR(40) NOT NULL`
- `name VARCHAR(180) NOT NULL`
- `bed_type VARCHAR(80) NULL`
- `max_adults INT NOT NULL DEFAULT 2`
- `max_children INT NOT NULL DEFAULT 0`
- `max_occupancy INT NOT NULL DEFAULT 2`
- `base_price DECIMAL(14,2) NOT NULL DEFAULT 0`
- `currency CHAR(3) NOT NULL DEFAULT 'VND'`
- `inventory_total INT NOT NULL DEFAULT 0`
- `is_refundable BOOLEAN NOT NULL DEFAULT TRUE`
- `status ENUM('active','inactive') NOT NULL DEFAULT 'active'`
- Audit: `created_at`, `updated_at`, `deleted_at`
- Unique: `(hotel_id, code)`

#### `hotel_room_inventory` (moi, ton kho theo ngay)
- `id BIGINT PK AUTO_INCREMENT`
- `room_type_id BIGINT NOT NULL` -> FK `hotel_room_types(id)`
- `stay_date DATE NOT NULL`
- `allotment INT NOT NULL DEFAULT 0`
- `booked_qty INT NOT NULL DEFAULT 0`
- `available_qty INT NOT NULL DEFAULT 0`
- `price_override DECIMAL(14,2) NULL`
- Audit: `created_at`, `updated_at`
- Unique: `(room_type_id, stay_date)`
- Check:
  - `allotment >= 0`
  - `booked_qty >= 0`
  - `available_qty >= 0`

#### `hotel_images` (moi)
- `id BIGINT PK AUTO_INCREMENT`
- `hotel_id BIGINT NOT NULL` -> FK `hotels(id)`
- `media_url TEXT NOT NULL`
- `alt_text VARCHAR(255) NULL`
- `sort_order INT NOT NULL DEFAULT 0`
- `is_cover BOOLEAN NOT NULL DEFAULT FALSE`
- `is_active BOOLEAN NOT NULL DEFAULT TRUE`
- Audit: `created_at`, `updated_at`, `deleted_at`

#### `hotel_amenities` (moi)
- `id BIGINT PK AUTO_INCREMENT`
- `code VARCHAR(40) NOT NULL UNIQUE`
- `name VARCHAR(120) NOT NULL`
- `icon VARCHAR(120) NULL`
- `category VARCHAR(80) NULL`
- `is_active BOOLEAN NOT NULL DEFAULT TRUE`
- Audit: `created_at`, `updated_at`

#### `hotel_amenity_mappings` (moi)
- `hotel_id BIGINT NOT NULL` -> FK `hotels(id)`
- `amenity_id BIGINT NOT NULL` -> FK `hotel_amenities(id)`
- `created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP`
- PK: `(hotel_id, amenity_id)`

---

### 3.2 Flights domain

#### `airlines` (moi)
- `id BIGINT PK AUTO_INCREMENT`
- `code_iata CHAR(2) NOT NULL UNIQUE`
- `code_icao VARCHAR(3) NULL UNIQUE`
- `name VARCHAR(160) NOT NULL`
- `logo_url TEXT NULL`
- `is_active BOOLEAN NOT NULL DEFAULT TRUE`
- Audit: `created_at`, `updated_at`

#### `airports` (moi)
- `id BIGINT PK AUTO_INCREMENT`
- `code_iata CHAR(3) NOT NULL UNIQUE`
- `code_icao VARCHAR(4) NULL UNIQUE`
- `name VARCHAR(180) NOT NULL`
- `city_name VARCHAR(120) NOT NULL`
- `country_code CHAR(2) NOT NULL DEFAULT 'VN'`
- `destination_id BIGINT NOT NULL` -> FK `destinations(id)`
- `latitude DECIMAL(10,7) NULL`
- `longitude DECIMAL(10,7) NULL`
- `timezone VARCHAR(60) NULL`
- `is_active BOOLEAN NOT NULL DEFAULT TRUE`
- Audit: `created_at`, `updated_at`
- Index: `(destination_id, is_active)`

#### `flights` (moi)
- `id BIGINT PK AUTO_INCREMENT`
- `airline_id BIGINT NOT NULL` -> FK `airlines(id)`
- `flight_no VARCHAR(10) NOT NULL`
- `origin_airport_id BIGINT NOT NULL` -> FK `airports(id)`
- `destination_airport_id BIGINT NOT NULL` -> FK `airports(id)`
- `departure_time_local DATETIME NOT NULL`
- `arrival_time_local DATETIME NOT NULL`
- `duration_minutes INT NOT NULL`
- `status ENUM('scheduled','active','inactive','cancelled') NOT NULL DEFAULT 'scheduled'`
- Audit: `created_at`, `updated_at`
- Index:
  - `(origin_airport_id, destination_airport_id, departure_time_local)`
  - `(airline_id, status)`

#### `flight_classes` (moi)
- `id BIGINT PK AUTO_INCREMENT`
- `flight_id BIGINT NOT NULL` -> FK `flights(id)`
- `cabin_class ENUM('economy','premium_economy','business','first') NOT NULL`
- `fare_family VARCHAR(80) NOT NULL DEFAULT 'standard'`
- `base_price DECIMAL(14,2) NOT NULL DEFAULT 0`
- `tax_amount DECIMAL(14,2) NOT NULL DEFAULT 0`
- `currency CHAR(3) NOT NULL DEFAULT 'VND'`
- `seat_total INT NOT NULL DEFAULT 0`
- `seat_available INT NOT NULL DEFAULT 0`
- `baggage_rule_json JSON NULL`
- `change_refund_rule_json JSON NULL`
- `is_active BOOLEAN NOT NULL DEFAULT TRUE`
- Audit: `created_at`, `updated_at`
- Unique: `(flight_id, cabin_class, fare_family)`

---

### 3.3 Combos domain (nang cap bang co san)

#### `combo_packages` (mo rong bang da ton tai)
- Them cot:
  - `destination_id BIGINT NULL` -> FK `destinations(id)`
  - `combo_type ENUM('tour_hotel','flight_hotel','custom') NOT NULL DEFAULT 'custom'`
  - `discount_type ENUM('fixed_amount','percentage') NOT NULL DEFAULT 'fixed_amount'`
  - `discount_value DECIMAL(14,2) NOT NULL DEFAULT 0`
  - `pricing_rule_json JSON NULL`
  - `start_at DATETIME NULL`
  - `end_at DATETIME NULL`

#### `combo_package_items` (mo rong bang da ton tai)
- Dieu chinh `item_type` de dung bo item linh hoat:
  - `tour`, `tour_schedule`, `hotel`, `room_type`, `flight`, `flight_class`, `service`
- Them cot:
  - `is_mandatory BOOLEAN NOT NULL DEFAULT TRUE`
  - `sort_order INT NOT NULL DEFAULT 0`
  - `unit_price_snapshot DECIMAL(14,2) NULL`

---

### 3.4 Booking extension (song song voi booking cu)

#### `hotel_bookings` (moi)
- `id BIGINT PK AUTO_INCREMENT`
- `booking_code VARCHAR(50) UNIQUE`
- `user_id CHAR(36) NOT NULL`
- `order_id BIGINT NULL` -> FK `orders(id)`
- `hotel_id BIGINT NOT NULL` -> FK `hotels(id)`
- `room_type_id BIGINT NOT NULL` -> FK `hotel_room_types(id)`
- `checkin_date DATE NOT NULL`
- `checkout_date DATE NOT NULL`
- `rooms INT NOT NULL DEFAULT 1`
- `adults INT NOT NULL DEFAULT 1`
- `children INT NOT NULL DEFAULT 0`
- `status ENUM('pending_payment','confirmed','checked_in','completed','cancelled','refunded','expired')`
- `payment_status ENUM('unpaid','partial','paid','failed','refunded','chargeback')`
- `contact_name`, `contact_phone`, `contact_email`
- money fields: `subtotal_amount`, `discount_amount`, `tax_amount`, `final_amount`, `currency`
- `special_requests`, `cancel_reason`, `cancelled_at`, `completed_at`
- Audit: `created_at`, `updated_at`, `deleted_at`

#### `hotel_booking_guests` (moi)
- `id BIGINT PK AUTO_INCREMENT`
- `hotel_booking_id BIGINT NOT NULL` -> FK `hotel_bookings(id)`
- `full_name VARCHAR(150) NOT NULL`
- `guest_type ENUM('adult','child') NOT NULL DEFAULT 'adult'`
- `date_of_birth DATE NULL`
- `identity_no VARCHAR(50) NULL`
- Audit: `created_at`, `updated_at`, `deleted_at`

#### `flight_bookings` (moi)
- `id BIGINT PK AUTO_INCREMENT`
- `booking_code VARCHAR(50) UNIQUE`
- `user_id CHAR(36) NOT NULL`
- `order_id BIGINT NULL` -> FK `orders(id)`
- `flight_id BIGINT NOT NULL` -> FK `flights(id)`
- `flight_class_id BIGINT NOT NULL` -> FK `flight_classes(id)`
- `departure_date DATE NOT NULL`
- `trip_type ENUM('one_way','round_trip') NOT NULL DEFAULT 'one_way'`
- `return_flight_id BIGINT NULL` -> FK `flights(id)` (neu round trip)
- `return_departure_date DATE NULL`
- `passenger_count INT NOT NULL DEFAULT 1`
- `status`, `payment_status` (giong hotel_bookings)
- contact + money fields + audit fields

#### `flight_booking_passengers` (moi)
- `id BIGINT PK AUTO_INCREMENT`
- `flight_booking_id BIGINT NOT NULL` -> FK `flight_bookings(id)`
- `passenger_type ENUM('adult','child','infant','senior') NOT NULL DEFAULT 'adult'`
- `full_name VARCHAR(150) NOT NULL`
- `gender ENUM('male','female','other','unknown') NOT NULL DEFAULT 'unknown'`
- `date_of_birth DATE NULL`
- `passport_no VARCHAR(50) NULL`
- `identity_no VARCHAR(50) NULL`
- Audit: `created_at`, `updated_at`, `deleted_at`

#### `combo_bookings` (moi)
- `id BIGINT PK AUTO_INCREMENT`
- `booking_code VARCHAR(50) UNIQUE`
- `user_id CHAR(36) NOT NULL`
- `order_id BIGINT NULL` -> FK `orders(id)`
- `combo_id BIGINT NOT NULL` -> FK `combo_packages(id)`
- `travel_start_date DATE NULL`
- `travel_end_date DATE NULL`
- `selection_snapshot_json JSON NULL`
- `status`, `payment_status`, contact + money fields + audit fields

---

### 3.5 Tich hop voi order/payment session

#### `order_items` (mo rong)
- Mo rong `item_type` de map item moi:
  - `tour_booking`, `hotel_booking`, `flight_booking`, `combo_booking`, `product`, `addon`, `service`
- Quy uoc:
  - `item_ref_id` tro den id cua bang booking tuong ung.
  - Van giu co che thanh toan thong qua `orders` -> `payments`.

## 4) Chien luoc index cho B2 (se update trong V2__indexes.sql)

- Hotel search:
  - `hotels(destination_id, status, star_rating)`
  - `hotel_room_inventory(stay_date, available_qty)`
- Flight search:
  - `flights(origin_airport_id, destination_airport_id, departure_time_local)`
  - `flight_classes(cabin_class, seat_available, is_active)`
- Booking query:
  - `hotel_bookings(user_id, created_at)`
  - `flight_bookings(user_id, created_at)`
  - `combo_bookings(user_id, created_at)`
  - `(order_id)` cho ca 3 bang booking moi

## 5) Diem can ban duyet truoc khi viet SQL

- Xac nhan dong y mo hinh bang song song cho booking (da chot).
- Xac nhan duoc mo rong truc tiep enum/item_type hien co trong `order_items`.
- Xac nhan flights su dung cap `flight_id + departure_date` (khong tao bang `flight_instances` o Phase 1 de giam do lon thay doi).

