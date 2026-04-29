-- Bo sung cac cot dang co trong entity Destination nhung thieu o V1__init_schema.sql
-- Lam cho `GET /destinations` va cac flow lien quan chay duoc.

ALTER TABLE destinations
    ADD COLUMN uuid CHAR(36) NULL AFTER id,
    ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'APPROVED',
    ADD COLUMN proposed_by CHAR(36) NULL,
    ADD COLUMN verified_by CHAR(36) NULL,
    ADD COLUMN rejection_reason TEXT NULL,
    ADD COLUMN is_official BOOLEAN NOT NULL DEFAULT FALSE;

-- Backfill uuid cho cac dong cu (neu co)
UPDATE destinations SET uuid = (UUID()) WHERE uuid IS NULL;

ALTER TABLE destinations
    MODIFY COLUMN uuid CHAR(36) NOT NULL,
    ADD UNIQUE KEY uk_destinations_uuid (uuid);
