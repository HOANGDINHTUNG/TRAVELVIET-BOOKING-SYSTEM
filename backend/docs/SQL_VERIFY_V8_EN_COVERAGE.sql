-- Verify EN translation coverage after running V8__seed_i18n_en.sql
-- Muc tieu: moi tour active/deleted_at IS NULL deu co row locale='en' trong tour_translations.

-- 1) Tong quan coverage
SELECT
    totals.total_tours,
    totals.tours_with_en,
    (totals.total_tours - totals.tours_with_en) AS tours_missing_en
FROM (
    SELECT
        COUNT(*) AS total_tours,
        COUNT(DISTINCT CASE WHEN tr_en.tour_id IS NOT NULL THEN t.id END) AS tours_with_en
    FROM tours t
    LEFT JOIN tour_translations tr_en
        ON tr_en.tour_id = t.id
       AND tr_en.locale = 'en'
    WHERE t.deleted_at IS NULL
) totals;

-- 2) Danh sach tour con thieu EN (ky vong 0 dong)
SELECT
    t.id,
    t.code,
    t.name
FROM tours t
LEFT JOIN tour_translations tr_en
    ON tr_en.tour_id = t.id
   AND tr_en.locale = 'en'
WHERE t.deleted_at IS NULL
  AND tr_en.tour_id IS NULL
ORDER BY t.id;

-- 3) Muc do chat luong toi thieu: EN bi trung y VI (tham khao bien tap content)
-- Luu y: ket qua > 0 KHONG phai loi ky thuat, chi la goi y de bien tap EN chat luong cao hon.
SELECT
    t.id,
    t.code,
    t.name AS canonical_name,
    tr_vi.name AS vi_name,
    tr_en.name AS en_name
FROM tours t
JOIN tour_translations tr_en
    ON tr_en.tour_id = t.id
   AND tr_en.locale = 'en'
LEFT JOIN tour_translations tr_vi
    ON tr_vi.tour_id = t.id
   AND tr_vi.locale = 'vi'
WHERE t.deleted_at IS NULL
  AND COALESCE(NULLIF(TRIM(tr_en.name), ''), t.name) = COALESCE(NULLIF(TRIM(tr_vi.name), ''), t.name)
ORDER BY t.id;
