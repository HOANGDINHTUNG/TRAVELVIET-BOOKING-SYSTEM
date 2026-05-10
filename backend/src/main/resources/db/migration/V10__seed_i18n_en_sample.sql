-- Sample English rows for destination_translations / guide_translations (tables created in V9).
-- Flyway order: V7 seeds base Vietnamese content; V9 creates translation tables; this file adds EN overlays.

INSERT IGNORE INTO destination_translations (destination_id, locale, name, short_description, description)
VALUES
(1, 'en', 'Ho Chi Minh City', 'A dynamic metropolis', 'The economic and culinary hub of southern Vietnam, blending history with modern life.'),
(10, 'en', 'Hoi An', 'Ancient trading port', 'Yellow-walled old town, lantern-lit evenings, and the Thu Bon River.');

INSERT IGNORE INTO guide_translations (guide_id, locale, full_name, bio)
VALUES
(1, 'en', 'Minh Tran', 'Enthusiastic licensed guide specializing in central Vietnam food and culture.'),
(2, 'en', 'Lan Nguyen', 'Historian guide focused on Hoi An heritage and highland cultures.');
