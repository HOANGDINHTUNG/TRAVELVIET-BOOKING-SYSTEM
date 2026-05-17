#!/usr/bin/env python3
"""Merge booking readiness tail + V9 sync into V7__seed_data.sql (UTF-8 safe)."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TRANSCRIPT = Path(
    r"C:\Users\Admin\.cursor\projects\d-Documents-WED-SERVICE-travelviet-booking-system"
    r"\agent-transcripts\475b2954-bc5d-4b3f-b45a-14d2e609023e"
    r"\475b2954-bc5d-4b3f-b45a-14d2e609023e.jsonl"
)
V7 = ROOT / "backend/src/main/resources/db/migration/V7__seed_data.sql"
SYNC_SQL = """-- CUỐI V7: Đồng bộ booked_seats từ booking thực tế (sau mọi seed)
UPDATE tour_schedules s
LEFT JOIN (
    SELECT
        b.schedule_id,
        COALESCE(SUM(b.adults + b.children + b.seniors), 0) AS occupied
    FROM bookings b
    WHERE b.status IN ('pending_payment', 'confirmed', 'checked_in', 'completed')
    GROUP BY b.schedule_id
) occ ON occ.schedule_id = s.id
SET s.booked_seats = COALESCE(occ.occupied, 0)
WHERE s.deleted_at IS NULL;

UPDATE tour_schedules s
SET s.status = 'full'
WHERE s.deleted_at IS NULL
  AND s.status = 'open'
  AND s.capacity_total > 0
  AND s.booked_seats >= s.capacity_total
  AND s.departure_at > NOW();

UPDATE tour_schedules s
SET s.status = 'open'
WHERE s.deleted_at IS NULL
  AND s.status = 'full'
  AND s.capacity_total > 0
  AND s.booked_seats < s.capacity_total
  AND s.departure_at > NOW();
"""

WAVE2 = r"""
-- =====================================================================
-- CUỐI V7 Wave 2: Lịch OPEN + hub + flags + điểm đón cho tour active còn thiếu
-- booked_seats = 0 (không seed số giả)
-- =====================================================================

INSERT IGNORE INTO tour_schedules (
    id, schedule_code, tour_id, departure_at, return_at, status,
    capacity_total, booked_seats,
    adult_price, child_price, infant_price, senior_price,
    booking_open_at, booking_close_at, meeting_point_name, note
)
SELECT
    2000 + t.id * 10 + 1,
    CONCAT('SCH_', t.code, '_W2A'),
    t.id,
    DATE_ADD(CURRENT_TIMESTAMP, INTERVAL (7 + (t.id % 21)) DAY),
    DATE_ADD(
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL (7 + (t.id % 21)) DAY),
        INTERVAL GREATEST(COALESCE(t.duration_days, 1), 1) DAY),
    'open',
    LEAST(45, GREATEST(12, COALESCE(t.max_group_size, 20))),
    0,
    t.base_price,
    ROUND(t.base_price * 0.75, 0),
    ROUND(t.base_price * 0.08, 0),
    ROUND(t.base_price * 0.90, 0),
    DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY),
    DATE_ADD(CURRENT_TIMESTAMP, INTERVAL (6 + (t.id % 21)) DAY),
    'Điểm tập trung TravelViet',
    CONCAT('Suất A — ', t.name)
FROM tours t
WHERE t.deleted_at IS NULL
  AND t.status = 'active'
  AND NOT EXISTS (
    SELECT 1 FROM tour_schedules s
    WHERE s.tour_id = t.id
      AND s.deleted_at IS NULL
      AND s.status = 'open'
      AND s.departure_at > NOW()
      AND (s.capacity_total - s.booked_seats) > 0
  );

INSERT IGNORE INTO tour_schedules (
    id, schedule_code, tour_id, departure_at, return_at, status,
    capacity_total, booked_seats,
    adult_price, child_price, infant_price, senior_price,
    booking_open_at, booking_close_at, meeting_point_name, note
)
SELECT
    2000 + t.id * 10 + 2,
    CONCAT('SCH_', t.code, '_W2B'),
    t.id,
    DATE_ADD(CURRENT_TIMESTAMP, INTERVAL (14 + (t.id % 18)) DAY),
    DATE_ADD(
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL (14 + (t.id % 18)) DAY),
        INTERVAL GREATEST(COALESCE(t.duration_days, 1), 1) DAY),
    'open',
    LEAST(45, GREATEST(12, COALESCE(t.max_group_size, 20))),
    0,
    t.base_price,
    ROUND(t.base_price * 0.75, 0),
    ROUND(t.base_price * 0.08, 0),
    ROUND(t.base_price * 0.90, 0),
    CURRENT_TIMESTAMP,
    DATE_ADD(CURRENT_TIMESTAMP, INTERVAL (13 + (t.id % 18)) DAY),
    'Điểm tập trung TravelViet',
    CONCAT('Suất B — ', t.name)
FROM tours t
WHERE t.deleted_at IS NULL
  AND t.status = 'active'
  AND NOT EXISTS (
    SELECT 1 FROM tour_schedules s
    WHERE s.tour_id = t.id AND s.id = 2000 + t.id * 10 + 2
  );

INSERT IGNORE INTO tour_schedule_pickup_points (
    schedule_id, point_name, address, latitude, longitude, pickup_at, sort_order
)
SELECT
    s.id,
    'Văn phòng TravelViet Q.1',
    '235 Nguyễn Huệ, Quận 1, TP.HCM',
    10.7743,
    106.7019,
    DATE_SUB(s.departure_at, INTERVAL 3 HOUR),
    0
FROM tour_schedules s
WHERE s.deleted_at IS NULL
  AND s.status = 'open'
  AND s.departure_at > NOW()
  AND NOT EXISTS (
    SELECT 1 FROM tour_schedule_pickup_points p
    WHERE p.schedule_id = s.id AND p.deleted_at IS NULL
  );

INSERT IGNORE INTO tour_departure_hubs (tour_id, city_code, city_name_vi, city_name_en, is_primary, sort_order)
SELECT t.id, 'SGN', 'TP. Hồ Chí Minh', 'Ho Chi Minh City', TRUE, 0
FROM tours t
WHERE t.deleted_at IS NULL
  AND t.status = 'active'
  AND NOT EXISTS (
    SELECT 1 FROM tour_departure_hubs h
    WHERE h.tour_id = t.id AND h.deleted_at IS NULL
  );

INSERT IGNORE INTO tour_inclusion_flags (
    tour_id, has_flight, has_hotel, has_meals, has_tickets, has_guide, has_insurance, has_transport,
    hotel_stars, flight_type, notes
)
SELECT
    t.id,
    CASE
        WHEN LOWER(CONCAT(IFNULL(t.inclusions, ''), ' ', IFNULL(t.description, '')))
             REGEXP 'máy bay|vé máy bay|bay khứ|bay perth|bay delhi' THEN TRUE
        ELSE FALSE
    END,
    CASE
        WHEN LOWER(CONCAT(IFNULL(t.inclusions, ''), ' ', IFNULL(t.description, '')))
             REGEXP 'khách sạn|ks [0-9]|resort|du thuyền|homestay|ngủ đêm' THEN TRUE
        WHEN COALESCE(t.duration_days, 1) >= 2 THEN TRUE
        ELSE FALSE
    END,
    CASE
        WHEN LOWER(CONCAT(IFNULL(t.inclusions, ''), ' ', IFNULL(t.description, '')))
             REGEXP 'ăn |bữa |buffet|ẩm thực' THEN TRUE
        ELSE FALSE
    END,
    CASE
        WHEN LOWER(CONCAT(IFNULL(t.inclusions, ''), ' ', IFNULL(t.description, '')))
             REGEXP 'vé |vào cổng|tham quan' THEN TRUE
        ELSE TRUE
    END,
    CASE
        WHEN LOWER(CONCAT(IFNULL(t.inclusions, ''), ' ', IFNULL(t.description, '')))
             REGEXP 'hdv|hướng dẫn' THEN TRUE
        ELSE TRUE
    END,
    CASE
        WHEN LOWER(CONCAT(IFNULL(t.inclusions, ''), ' ', IFNULL(t.description, '')))
             REGEXP 'bảo hiểm' THEN TRUE
        WHEN t.base_price >= 10000000 THEN TRUE
        ELSE FALSE
    END,
    CASE
        WHEN LOWER(CONCAT(IFNULL(t.inclusions, ''), ' ', IFNULL(t.description, '')))
             REGEXP 'xe |đưa đón|cano|tàu |thuyền' THEN TRUE
        ELSE TRUE
    END,
    CASE
        WHEN t.base_price >= 45000000 THEN 5
        WHEN t.base_price >= 20000000 THEN 4
        WHEN COALESCE(t.duration_days, 1) >= 3 AND t.base_price >= 8000000 THEN 4
        WHEN COALESCE(t.duration_days, 1) >= 2 THEN 3
        ELSE NULL
    END,
    CASE
        WHEN LOWER(CONCAT(IFNULL(t.inclusions, ''), ' ', IFNULL(t.description, '')))
             REGEXP 'máy bay|vé máy bay' THEN 'roundtrip'
        ELSE 'none'
    END,
    LEFT(CONCAT('Gồm: ', IFNULL(t.inclusions, 'Theo chương trình')), 500)
FROM tours t
WHERE t.deleted_at IS NULL
  AND t.status = 'active'
  AND NOT EXISTS (SELECT 1 FROM tour_inclusion_flags f WHERE f.tour_id = t.id);
"""


def load_wave1_from_transcript() -> str:
    line = TRANSCRIPT.read_text(encoding="utf-8").splitlines()[1337]
    data = json.loads(line)
    contents = data["message"]["content"][1]["input"]["contents"]
    contents = re.sub(r"('open',\d+),\d+,(\d{5,})", r"\1,0,\2", contents)
    # strip V10 header; keep from section A
    idx = contents.find("-- =====================================================================\n-- A)")
    if idx < 0:
        raise RuntimeError("wave1 section A not found in transcript")
    body = contents[idx:]
    # use INSERT IGNORE for inclusion_flags (not INSERT ... ON DUPLICATE)
    body = body.replace(
        "INSERT INTO tour_inclusion_flags",
        "INSERT IGNORE INTO tour_inclusion_flags",
    )
    body = re.sub(
        r"\nON DUPLICATE KEY UPDATE[\s\S]*?notes = VALUES\(notes\);\n",
        "\n",
        body,
        count=1,
    )
    return body


def main() -> None:
    wave1 = load_wave1_from_transcript()
    sync = SYNC_SQL

    tail = (
        "\n\n-- =====================================================================\n"
        "-- CUỐI V7: Booking readiness wave 1 (flash / beach / hot tours)\n"
        "-- booked_seats = 0; marketing \"còn ít chỗ\" chỉ ghi trong note\n"
        "-- =====================================================================\n\n"
        "UPDATE tours\nSET is_featured = TRUE\nWHERE id IN (41, 46, 50, 63, 78, 89)\n"
        "  AND deleted_at IS NULL;\n\n"
        + wave1
        + "\n"
        + WAVE2
        + "\n"
        + sync
    )

    v7_text = V7.read_text(encoding="utf-8")
    if "SCH_TOUR_TH_01_202605_A" in v7_text:
        print("V7 already contains wave1 schedules — skip append")
        return

    V7.write_text(v7_text.rstrip() + tail, encoding="utf-8")
    print(f"Appended booking readiness to {V7} (+{len(tail)} bytes)")


if __name__ == "__main__":
    main()
