-- ============================================================
-- PHẠM VI I18N: DESTINATION & TOUR (đọc + xuất dữ liệu để dịch EN)
-- ============================================================
-- File này KHÔNG phải migration Flyway — chỉ chạy tay trong MySQL client / DBeaver.
--
-- 1) Ngôn ngữ request: header Accept-Language → Locale → language tag (vd. en, vi).
--    Bảng *_translations.lưu locale dạng ISO 639-1 ngắn: 'en', 'vi'.
--
-- 2) DESTINATION — API public merge (DestinationQueryServiceImpl):
--    Bảng gốc (tiếng Việt “chuẩn nội dung”):     destinations.name, short_description, description
--    Lớp phủ tiếng Anh:                           destination_translations (cùng 3 cột + destination_id + locale)
--    KHÔNG merge qua translation:                 province, district, region, address, slug, code, …
--    Chi tiết public (foods, specialties, activities, tips, events, media):
--    — Trả từ bảng con destinations.* / destination_media (alt_text) NGUYÊN VĂN từ DB.
--      Hiện KHÔNG có destination_food_translations… trong schema migration.
--
-- 3) TOUR — API public merge (TourTranslationMergeHelper + TourQueryServiceImpl):
--    Bảng gốc:  tours.name, short_description, description, highlights, inclusions, exclusions, notes
--    Lớp phủ:   tour_translations — các cột trên + itinerary_summary
--               (itinerary_summary CHỈ có trên tour_translations / hoặc bản vi nếu bạn thêm;
--                cột tours KHÔNG có itinerary_summary.)
--    Thứ tự ưu tiên merge: locale request → locale 'vi' trên tour_translations → cột tours.*
--
--    Lịch trình chi tiết: tour_itinerary_days (title, description), itinerary_items (title, description, …)
--    — CHƯA có bảng dịch riêng trong migration; API trả nội dung gốc từ DB.
--
-- 4) Việc cần làm trước khi web/API hiển thị EN đầy đủ:
--    • Chèn destination_translations (destination_id, 'en', …) cho mỗi điểm cần EN.
--    • Chèn tour_translations (tour_id, 'en', …) cho mỗi tour cần EN.
--    • (Tùy chọn sau) mở rộng schema + code cho media / itinerary / tag nếu cần đa ngôn ngữ.
-- ============================================================


-- ============================================================
-- A) Xuất DESTINATIONS — nguồn VI để điền cột EN trong destination_translations
-- ============================================================
SELECT
    d.id AS destination_id,
    'en' AS locale_suggested,
    d.code,
    d.slug,
    d.name AS vi_name,
    d.short_description AS vi_short_description,
    d.description AS vi_description
FROM destinations d
WHERE d.deleted_at IS NULL
ORDER BY d.id;


-- ============================================================
-- B) Xuất TOURS — nguồn VI để điền cột EN trong tour_translations
-- ============================================================
SELECT
    t.id AS tour_id,
    'en' AS locale_suggested,
    t.code,
    t.slug,
    t.destination_id,
    t.name AS vi_name,
    t.short_description AS vi_short_description,
    t.description AS vi_description,
    t.highlights AS vi_highlights,
    t.inclusions AS vi_inclusions,
    t.exclusions AS vi_exclusions,
    t.notes AS vi_notes
FROM tours t
WHERE t.deleted_at IS NULL
ORDER BY t.id;


-- ============================================================
-- C) Kiểm tra đã có bản dịch EN chưa (để tránh trùng UNIQUE)
-- ============================================================
SELECT dt.destination_id, dt.locale, LEFT(dt.name, 60) AS name_preview
FROM destination_translations dt
WHERE dt.locale = 'en'
ORDER BY dt.destination_id;

SELECT tt.tour_id, tt.locale, LEFT(tt.name, 80) AS name_preview
FROM tour_translations tt
WHERE tt.locale = 'en'
ORDER BY tt.tour_id;


-- ============================================================
-- D) Mẫu INSERT (sao chép 1 dòng, đổi id và nội dung) — chuẩn UNIQUE (entity_id, locale)
-- ============================================================
/*
INSERT IGNORE INTO destination_translations (destination_id, locale, name, short_description, description)
VALUES (
    :destination_id,
    'en',
    'English name',
    'English short intro',
    'English long description HTML or plain text.'
);

INSERT IGNORE INTO tour_translations (
    tour_id, locale, name, short_description, description,
    highlights, inclusions, exclusions, notes, itinerary_summary
) VALUES (
    :tour_id,
    'en',
    'English tour title',
    'English teaser',
    'English full description',
    'Comma or line-separated highlights in English',
    'What is included (English)',
    'What is excluded (English)',
    NULL,
    'Optional day-by-day summary in English (only in translation row).'
);
*/
