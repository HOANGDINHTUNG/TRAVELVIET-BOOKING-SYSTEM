-- Add deleted_at to hotels table for AuditableEntity support
ALTER TABLE `hotels` ADD COLUMN `deleted_at` timestamp NULL DEFAULT NULL;
