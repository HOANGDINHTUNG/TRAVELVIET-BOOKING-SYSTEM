-- tour_schedule_guides extends AuditableEntity, but the initial schema missed created_at.
-- Hibernate selects this column when mapping schedule guide assignments.
ALTER TABLE tour_schedule_guides
    ADD COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER assigned_at;
