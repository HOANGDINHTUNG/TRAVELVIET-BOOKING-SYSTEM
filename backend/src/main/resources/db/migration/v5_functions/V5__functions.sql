-- Flyway V5: functions

DELIMITER $$
CREATE FUNCTION fn_generate_code(p_prefix VARCHAR(10)) 
RETURNS VARCHAR(50) DETERMINISTIC NO SQL BEGIN RETURN CONCAT( 
	UPPER(p_prefix), 
    DATE_FORMAT(NOW(), '%y%m%d%H%i%s'), 
    UPPER(SUBSTRING(REPLACE(UUID(), '-', ''), 1, 6)) 
); END$$
DELIMITER ;
