CREATE TABLE IF NOT EXISTS customer_testimonials (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(120) NOT NULL,
    customer_title VARCHAR(180) NULL,
    content TEXT NOT NULL,
    rating TINYINT NOT NULL DEFAULT 5,
    avatar_url TEXT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_customer_testimonial_name (customer_name),
    CONSTRAINT chk_customer_testimonials_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB;

INSERT INTO customer_testimonials (
    customer_name,
    customer_title,
    content,
    rating,
    avatar_url,
    is_verified,
    sort_order,
    is_active
) VALUES
(
    'Chi Nguyen Mai',
    'Nguyen Dinh Chieu - Ho Chi Minh',
    'CONG TY TNHH ON VIET NAM dac biet an tuong voi su chuyen nghiep cua THD Travel trong viec thiet ke hanh trinh nghi duong cho ON Viet Nam. Toan bo dich vu tu dat ve, xe dua don, khach san, am thuc den cac hoat dong gan ket deu duoc sap xep chu dao.',
    5,
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
    TRUE,
    1,
    TRUE
),
(
    'Chi Tho Nguyen',
    'Dong Da - Ha Noi',
    '[Happy Money - Cong ty co phan TM lien ket Nano] Nho su ho tro tan tam cua THD Travel, chuyen du lich ket hop hoi thao cua doanh nghiep chung toi dien ra thuan loi va tron ven. Doi ngu tu van theo sat tung chi tiet.',
    5,
    'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=160&q=80',
    TRUE,
    2,
    TRUE
),
(
    'Anh Hung',
    'Thuy Nguyen - Hai Phong',
    '[Cong ty TNHH LITEON] Chuyen di lan nay thuc su y nghia voi toan the nhan vien. THD Travel da sap xep chu dao tu tu van, di chuyen, luu tru, an uong den cac hoat dong team building soi dong va gala dinner an tuong.',
    5,
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    TRUE,
    3,
    TRUE
),
(
    'Chi Truong Uyen Thanh',
    'An Khanh - Ho Chi Minh',
    'HCM branch of Electrolux Vietnam danh gia cao su chuyen nghiep cua THD Travel. Toan bo khau dat phong cho hon 500 khach moi trong hoi nghi khach hang PRIVATE EVENT vua qua duoc xu ly nhanh chong.',
    5,
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
    TRUE,
    4,
    TRUE
)
ON DUPLICATE KEY UPDATE
    customer_title = VALUES(customer_title),
    content = VALUES(content),
    rating = VALUES(rating),
    avatar_url = VALUES(avatar_url),
    is_verified = VALUES(is_verified),
    sort_order = VALUES(sort_order),
    is_active = VALUES(is_active);
