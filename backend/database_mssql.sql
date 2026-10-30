-- ========================================================
-- DATABASE SCRIPT FOR SQL SERVER (DevOps / e-commerce)
-- Generated automatically on 10/16/2026, 3:06:09 PM
-- ========================================================

USE DevOps;
GO

-- Drop tables if needed (reverse order of FK)
IF OBJECT_ID('order_items', 'U') IS NOT NULL DROP TABLE order_items;
IF OBJECT_ID('orders', 'U') IS NOT NULL DROP TABLE orders;
IF OBJECT_ID('comments', 'U') IS NOT NULL DROP TABLE comments;
IF OBJECT_ID('products', 'U') IS NOT NULL DROP TABLE products;
IF OBJECT_ID('users', 'U') IS NOT NULL DROP TABLE users;
IF OBJECT_ID('contact_messages', 'U') IS NOT NULL DROP TABLE contact_messages;
IF OBJECT_ID('vouchers', 'U') IS NOT NULL DROP TABLE vouchers;
GO

-- Create Tables
CREATE TABLE products (
  id INT PRIMARY KEY IDENTITY(1,1),
  name NVARCHAR(MAX) NOT NULL,
  category NVARCHAR(255) NOT NULL,
  brand NVARCHAR(100) DEFAULT 'TechNova',
  price FLOAT NOT NULL,
  oldPrice FLOAT,
  rating FLOAT DEFAULT 5.0,
  stock INT DEFAULT 10,
  sold_count INT DEFAULT 0,
  rating_count INT DEFAULT 1,
  image NVARCHAR(MAX) NOT NULL,
  description NVARCHAR(MAX) NOT NULL,
  specs NVARCHAR(MAX),
  quick_specs NVARCHAR(MAX),
  variants NVARCHAR(MAX),
  featured INT DEFAULT 0,
  is_flash_sale INT DEFAULT 0,
  discount_percent INT DEFAULT 0,
  created_at DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE comments (
  id INT PRIMARY KEY IDENTITY(1,1),
  product_id INT NOT NULL FOREIGN KEY REFERENCES products(id) ON DELETE CASCADE,
  user_id INT,
  author NVARCHAR(255) NOT NULL,
  avatar NVARCHAR(MAX),
  rating INT NOT NULL,
  content NVARCHAR(MAX) NOT NULL,
  variant_purchased NVARCHAR(255),
  is_verified_purchase INT DEFAULT 1,
  images NVARCHAR(MAX),
  admin_reply NVARCHAR(MAX),
  created_at DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE orders (
  id INT PRIMARY KEY IDENTITY(1,1),
  customer_name NVARCHAR(255) NOT NULL,
  email NVARCHAR(255) NOT NULL,
  phone NVARCHAR(20) NOT NULL,
  address NVARCHAR(MAX) NOT NULL,
  payment_method NVARCHAR(50) NOT NULL,
  total_amount FLOAT NOT NULL,
  status NVARCHAR(50) DEFAULT 'Pending',
  payment_status NVARCHAR(50) DEFAULT 'Unpaid',
  created_at DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE order_items (
  id INT PRIMARY KEY IDENTITY(1,1),
  order_id INT NOT NULL FOREIGN KEY REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT NOT NULL,
  product_name NVARCHAR(255) NOT NULL,
  price FLOAT NOT NULL,
  quantity INT NOT NULL
);
GO

CREATE TABLE users (
  id INT PRIMARY KEY IDENTITY(1,1),
  fullname NVARCHAR(255) NOT NULL,
  email NVARCHAR(255) NOT NULL UNIQUE,
  phone NVARCHAR(20),
  password NVARCHAR(255) NOT NULL,
  avatar NVARCHAR(MAX),
  role NVARCHAR(50) DEFAULT 'user',
  reset_token NVARCHAR(255),
  reset_token_expiry DATETIME,
  created_at DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE contact_messages (
  id INT PRIMARY KEY IDENTITY(1,1),
  name NVARCHAR(255) NOT NULL,
  email NVARCHAR(255) NOT NULL,
  phone NVARCHAR(20),
  subject NVARCHAR(255) NOT NULL,
  message NVARCHAR(MAX) NOT NULL,
  status NVARCHAR(50) DEFAULT 'New',
  created_at DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE vouchers (
  id INT PRIMARY KEY IDENTITY(1,1),
  code NVARCHAR(50) NOT NULL UNIQUE,
  discount_type NVARCHAR(20) DEFAULT 'percent',
  discount_value FLOAT NOT NULL,
  min_order_value FLOAT DEFAULT 0,
  max_discount FLOAT DEFAULT 100,
  usage_count INT DEFAULT 0,
  max_usage INT DEFAULT 100,
  expires_at DATETIME,
  is_active INT DEFAULT 1,
  created_at DATETIME DEFAULT GETDATE()
);
GO

INSERT INTO vouchers (code, discount_type, discount_value, min_order_value, max_discount, usage_count, max_usage, is_active)
VALUES 
  ('TECH10', 'percent', 20, 50, 100, 38, 200, 1),
  ('FREESHIP', 'fixed', 15, 0, 15, 62, 500, 1),
  ('VIP50', 'fixed', 50, 300, 50, 12, 50, 1);
GO

SET IDENTITY_INSERT products ON;
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (1, N'MacBook Pro 16 M3 Max', N'Laptop', 2499, 2699, 4.9, 15, N'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', N'Sức mạnh vượt trội cho chuyên gia sáng tạo với chip M3 Max 16-Core CPU, 40-Core GPU và màn hình Liquid Retina XDR sắc nét.', N'["Apple M3 Max Chip","36GB Unified Memory","1TB SSD Storage","16.2-inch XDR Display","Up to 22h battery"]', 1);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (2, N'iPhone 15 Pro Max Titanium', N'Smartphone', 1199, 1299, 4.8, 25, N'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80', N'Thiết kế vỏ Titanium hàng không nhẹ vượt trội, nút Action linh hoạt và cụm camera zoom quang học 5x sắc nét tuyệt đối.', N'["Chip A17 Pro 3nm","Camera chính 48MP","Zoom quang 5x","Titanium Grade 5","USB-C 3.0"]', 1);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (3, N'Sony WH-1000XM5 ANC', N'Audio', 349, 399, 4.7, 30, N'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', N'Tai nghe chống ồn chủ động hàng đầu thế giới với 8 micro kép, màng loa 30mm đặc biệt và thời lượng pin 30 giờ.', N'["Industry-leading ANC","Hi-Res Audio LDAC","30-hour Battery","Speak-to-Chat","Multi-point Bluetooth"]', 1);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (4, N'Dell UltraSharp 32 4K USB-C Hub Monitor', N'Monitor', 799, 899, 4.6, 12, N'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80', N'Màn hình đồ họa chuẩn IPS Black 4K HDR400, độ phủ màu 100% sRGB & DCI-P3 98%, cổng sạc USB-C 90W tiện lợi.', N'["32-inch 4K UHD","IPS Black Technology","DCI-P3 98%","USB-C Hub 90W Power","Ergonomic Stand"]', 0);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (5, N'Logitech MX Master 3S Wireless Mouse', N'Accessory', 99, 119, 4.9, 50, N'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80', N'Chuột không dây công xưởng công nghệ với cảm biến 8K DPI Quiet Clicks và con cuộn siêu tốc MagSpeed.', N'["8000 DPI Optical","Quiet Click buttons","MagSpeed Scroll","Bluetooth & Logi Bolt","USB-C Quick Charge"]', 1);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (6, N'Keychron Q1 Max Wireless Mechanical Keyboard', N'Accessory', 219, 239, 4.8, 18, N'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80', N'Bàn phím cơ CNC Nhôm nguyên khối, Gasket Mount êm ái, hỗ trợ kết nối 2.4Ghz siêu tốc và tùy chỉnh VIA/QMK.', N'["Full Aluminum Body","2.4Ghz & Bluetooth 5.1","Hot-swappable Switches","South-facing RGB","QMK/VIA Programmable"]', 0);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (7, N'iPad Pro 13 M4 Ultra-Thin', N'Tablet', 1299, 1399, 4.9, 20, N'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80', N'Mỏng kinh ngạc chỉ 5.1mm với màn hình Tandem OLED Ultra Retina XDR siêu nét và sức mạnh đột phá từ chip M4.', N'["Chip Apple M4","Ultra Retina XDR OLED","Thickness 5.1mm","Apple Pencil Pro Support","Thunderbolt 4 / USB 4"]', 1);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (8, N'Apple Watch Ultra 2 Titanium', N'Smartwatch', 799, 849, 4.8, 14, N'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&q=80', N'Đồng hồ thể thao chuyên nghiệp với màn hình sáng nhất 3000 nits, định vị GPS kép chuẩn xác và đo độ sâu chống nước 100m.', N'["S9 SiP Chip","3000 nits OLED Display","Precision Dual GPS","100m Water Resistant","36 Hours Battery"]', 0);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (9, N'Samsung Galaxy S24 Ultra 5G AI', N'Smartphone', 1299, 1399, 4.8, 18, N'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80', N'Quyền năng Galaxy AI tích hợp, bút S-Pen thông minh, khung viền Titanium và camera 200MP bắt trọn khoảnh khắc đêm.', N'["Snapdragon 8 Gen 3 for Galaxy","Camera 200MP AI","Bút S-Pen tích hợp","Màn hình Dynamic AMOLED 2X 120Hz","Khung Titanium"]', 1);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (10, N'Asus ROG Zephyrus G16 OLED Gaming Laptop', N'Laptop', 1999, 2199, 4.9, 8, N'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80', N'Laptop gaming mỏng nhẹ cao cấp nhất trang bị màn hình ROG Nebula OLED 240Hz, card đồ họa RTX 4070 và chip Intel Core Ultra 9.', N'["Intel Core Ultra 9 185H","NVIDIA RTX 4070 8GB","16-inch ROG Nebula OLED 2.5K 240Hz","32GB LPDDR5X RAM","Vỏ Nhôm CNC cao cấp"]', 1);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (11, N'Bose QuietComfort Ultra Headphones', N'Audio', 429, 479, 4.8, 22, N'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80', N'Âm thanh không gian đột phá Bose Immersive Audio, khả năng khử tiếng ồn đẳng cấp thế giới và đệm tai sang trọng êm ái.', N'["Bose Immersive Audio","CustomTune Technology","24 Hours Battery","WindBlock Mode","Multipoint Bluetooth 5.3"]', 0);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (12, N'AirPods Max Space Gray', N'Audio', 549, 599, 4.7, 16, N'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80', N'Sự kết hợp hoàn hảo giữa âm thanh độ trung thực cao và tính năng chống ồn chủ động hàng đầu từ hệ sinh thái Apple.', N'["Apple H1 Chip each ear","Spatial Audio with Dynamic Head Tracking","Computational Audio","Smart Case included"]', 1);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (13, N'Marshall Stanmore III Bluetooth Speaker', N'Audio', 379, 419, 4.9, 12, N'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80', N'Thiết kế vintage huyền thoại với chất âm rộng mở, củ loa hướng ra ngoài và ống dẫn sóng nâng cấp cho âm trường sống động.', N'["80W Total Output","Bluetooth 5.2 & RCA/3.5mm","Dynamic Loudness","Brass Control Knobs","Eco-friendly Build"]', 0);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (14, N'LG UltraGear 34 OLED Curved Gaming Monitor', N'Monitor', 999, 1199, 4.9, 7, N'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80', N'Màn hình cong OLED 800R đắm chìm tuyệt đối, tần số quét 240Hz siêu mượt và thời gian phản hồi 0.03ms không bóng mờ.', N'["34-inch WQHD OLED","800R Extreme Curve","240Hz Refresh Rate","0.03ms GtG","DCI-P3 98.5%"]', 1);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (15, N'Samsung Odyssey Neo G9 49 Super Curved', N'Monitor', 1799, 1999, 4.8, 5, N'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80', N'Tuyệt phẩm màn hình siêu rộng 49 inch Dual QHD, tấm nền Quantum Mini-LED cùng độ sáng cực đại 2000 nits đỉnh cao.', N'["49-inch Dual QHD (5120x1440)","1000R Curvature","Quantum Mini-LED","240Hz & 1ms","CoreSync Lighting"]', 1);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (16, N'Google Pixel 9 Pro Fold', N'Smartphone', 1799, 1899, 4.7, 10, N'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80', N'Điện thoại màn hình gập mỏng nhất của Google với chip Tensor G4, trợ lý Gemini AI thông minh và camera Super Res Zoom 20x.', N'["Chip Google Tensor G4","Màn hình ngoài 6.3 inch OLED 120Hz","Màn hình trong 8.0 inch Super Actua","Gemini Advanced 1 Year"]', 0);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (17, N'PlayStation 5 Pro 2TB Console', N'Gaming Gear', 699, 749, 4.9, 20, N'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80', N'Cỗ máy chơi game mạnh mẽ nhất hiện nay với công nghệ nâng cấp hình ảnh PSSR AI, GPU nâng cấp 67% và Ray Tracing tiên tiến.', N'["Custom AMD Zen 2 CPU","Upgraded GPU with PSSR AI","2TB NVMe SSD","Wi-Fi 7 Ready","DualSense Wireless Controller"]', 1);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (18, N'Xbox Series X 1TB Console', N'Gaming Gear', 499, 549, 4.8, 15, N'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80', N'Trải nghiệm chơi game 4K 120FPS đích thực với kiến trúc Xbox Velocity Architecture, hỗ trợ thư viện hàng ngàn game Game Pass.', N'["12 Teraflops RDNA 2 GPU","1TB Custom NVMe SSD","True 4K Gaming & 8K Ready","Quick Resume Multiple Games"]', 0);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (19, N'Nintendo Switch OLED Model Mario Red', N'Gaming Gear', 349, 379, 4.8, 25, N'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80', N'Màn hình OLED 7 inch rực rỡ sắc màu, chân đế rộng linh hoạt, loa nâng cấp và dock kết nối cổng LAN tiện ích.', N'["7-inch OLED Screen","64GB Internal Storage","Enhanced Audio Speakers","Wired LAN Port Dock","Mario Red Edition"]', 0);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (20, N'Valve Steam Deck OLED 1TB Handheld PC', N'Gaming Gear', 649, 699, 4.9, 14, N'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80', N'Mang thư viện game PC Steam đi khắp mọi nơi với màn hình HDR OLED 90Hz rực rỡ, pin lâu hơn 50% và Wi-Fi 6E siêu nhanh.', N'["7.4-inch HDR OLED 90Hz","Custom 6nm AMD APU","1TB NVMe SSD","50Whr Battery (3-12h)","Wi-Fi 6E Fast Download"]', 1);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (21, N'Garmin Fenix 7X Pro Sapphire Solar', N'Smartwatch', 899, 999, 4.9, 10, N'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', N'Đồng hồ GPS thể thao đa năng cao cấp nhất tích hợp thấu kính sạc năng lượng mặt trời, đèn pin LED siêu sáng và bản đồ địa hình toàn cầu.', N'["Power Sapphire Solar Lens","Built-in LED Flashlight","Multi-band GPS SatIQ","Up to 37 Days Battery Life","Titanium Bezel"]', 1);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (22, N'Samsung Galaxy Watch 6 Classic', N'Smartwatch', 399, 449, 4.7, 18, N'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80', N'Sự trở lại của vòng xoay bezel xoay vật lý trứ danh, màn hình kính Sapphire siêu bền và cảm biến theo dõi sức khỏe BIA tân tiến.', N'["Physical Rotating Bezel","Sapphire Crystal Glass","Body Composition Analysis","Advanced Sleep Coaching","Wear OS by Google"]', 0);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (23, N'Microsoft Surface Pro 11 Copilot+ PC', N'Tablet', 1199, 1299, 4.8, 12, N'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&q=80', N'Sự kết hợp hoàn hảo giữa máy tính bảng và laptop mạnh mẽ trang bị chip Snapdragon X Elite và trí tuệ nhân tạo Copilot+ thông minh.', N'["Snapdragon X Elite 12 Cores","13-inch PixelSense OLED 120Hz","45 TOPS NPU AI Power","All-day Battery up to 14h"]', 0);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (24, N'Samsung Galaxy Tab S9 Ultra AMOLED', N'Tablet', 1199, 1319, 4.9, 14, N'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80', N'Màn hình Dynamic AMOLED 2X khổng lồ 14.6 inch, kháng nước bụi IP68 đầu tiên trên tablet cao cấp, kèm bút S-Pen không độ trễ.', N'["14.6-inch Dynamic AMOLED 2X 120Hz","Snapdragon 8 Gen 2 for Galaxy","IP68 Water & Dust Resistance","Quad Speakers by AKG"]', 1);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (25, N'Dell XPS 15 9530 OLED Creator Laptop', N'Laptop', 2199, 2399, 4.8, 9, N'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80', N'Biểu tượng laptop đồ họa mỏng nhẹ với màn hình 3.5K OLED cảm ứng, viền siêu mỏng InfinityEdge 4 cạnh và cấu hình Intel Gen 13.', N'["Intel Core i7-13700H","NVIDIA RTX 4060 8GB","15.6-inch 3.5K OLED Touch","32GB DDR5 RAM","CNC Aluminum & Carbon Fiber"]', 0);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (26, N'Lenovo ThinkPad X1 Carbon Gen 12', N'Laptop', 1899, 2099, 4.9, 11, N'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80', N'Đỉnh cao doanh nhân siêu bền bỉ với trọng lượng nhẹ chỉ 1.09kg, bàn phím gõ êm nhất thế giới và chip Intel Core Ultra AI mới nhất.', N'["Intel Core Ultra 7 155H","14-inch 2.8K OLED 120Hz","1.09kg Featherweight","Military-grade MIL-STD 810H","TrackPoint & Haptic Touchpad"]', 0);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (27, N'Anker Prime 27,650mAh Power Bank 250W', N'Accessory', 179, 199, 4.9, 35, N'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80', N'Pin dự phòng công suất khủng 250W hỗ trợ sạc nhanh cùng lúc 2 laptop, màn hình màu kỹ thuật số hiển thị công suất thời gian thực.', N'["27,650mAh Capacity","250W Total Output","140W Single Port Max","Smart Digital Display","App Connectivity via Bluetooth"]', 0);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (28, N'Elgato Stream Deck MK.2 White Studio Controller', N'Accessory', 149, 169, 4.8, 22, N'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80', N'Bàn điều khiển studio chuyên nghiệp với 15 phím LCD tùy biến vô hạn, điều khiển âm thanh, ánh sáng và livestream chỉ với một chạm.', N'["15 Customizable LCD Keys","One-touch Actions & Macros","Detachable Faceplate Design","Direct OBS & Twitch Integration"]', 0);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (29, N'Sony Alpha 7 IV Mirrorless Camera', N'Gaming Gear', 2499, 2699, 4.9, 8, N'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80', N'Máy ảnh chuẩn mực cho nhà sáng tạo nội dung với cảm biến Exmor R CMOS 33MP, quay phim 4K 60p 10-bit và lấy nét mắt thời gian thực AI.', N'["33MP Full-Frame Exmor R Sensor","BIONZ XR Image Processor","4K 60p 10-Bit 4:2:2 Video","Real-time Eye AF Human/Animal/Bird"]', 1);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (30, N'DJI Mini 4 Pro Fly More Combo Drone', N'Accessory', 1099, 1199, 4.9, 12, N'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&q=80', N'Flycam siêu nhẹ dưới 249g tích hợp cảm biến chướng ngại vật đa hướng 360, quay video dọc 4K/60fps HDR và truyền hình ảnh FHD 20km.', N'["Under 249g Ultra-lightweight","Omnidirectional Obstacle Sensing","4K/60fps HDR True Vertical Shooting","20km FHD Video Transmission"]', 1);
SET IDENTITY_INSERT products OFF;
GO

SET IDENTITY_INSERT comments ON;
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (1, 1, N'Nguyễn Văn An', N'https://i.pravatar.cc/150?img=11', 5, N'Sản phẩm dùng rất mượt, đóng gói cẩn thận, giao hàng trong ngày. Rất hài lòng!');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (2, 1, N'Trần Thị Mai', N'https://i.pravatar.cc/150?img=32', 5, N'Thiết kế đẹp mắt sang trọng, shop tư vấn tận tình. Đáng giá tiền!');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (3, 2, N'Nguyễn Văn An', N'https://i.pravatar.cc/150?img=11', 5, N'Sản phẩm dùng rất mượt, đóng gói cẩn thận, giao hàng trong ngày. Rất hài lòng!');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (4, 2, N'Lê Hoàng Minh', N'https://i.pravatar.cc/150?img=68', 4, N'Chất lượng sản phẩm tuyệt vời, tuy nhiên vận chuyển mất 2 ngày.');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (5, 1, N'Lê Hoàng Minh', N'https://i.pravatar.cc/150?img=68', 4, N'Chất lượng sản phẩm tuyệt vời, tuy nhiên vận chuyển mất 2 ngày.');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (6, 2, N'Trần Thị Mai', N'https://i.pravatar.cc/150?img=32', 5, N'Thiết kế đẹp mắt sang trọng, shop tư vấn tận tình. Đáng giá tiền!');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (7, 3, N'Trần Thị Mai', N'https://i.pravatar.cc/150?img=32', 5, N'Thiết kế đẹp mắt sang trọng, shop tư vấn tận tình. Đáng giá tiền!');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (8, 3, N'Lê Hoàng Minh', N'https://i.pravatar.cc/150?img=68', 4, N'Chất lượng sản phẩm tuyệt vời, tuy nhiên vận chuyển mất 2 ngày.');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (9, 3, N'Nguyễn Văn An', N'https://i.pravatar.cc/150?img=11', 5, N'Sản phẩm dùng rất mượt, đóng gói cẩn thận, giao hàng trong ngày. Rất hài lòng!');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (10, 4, N'Nguyễn Văn An', N'https://i.pravatar.cc/150?img=11', 5, N'Sản phẩm dùng rất mượt, đóng gói cẩn thận, giao hàng trong ngày. Rất hài lòng!');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (11, 4, N'Trần Thị Mai', N'https://i.pravatar.cc/150?img=32', 5, N'Thiết kế đẹp mắt sang trọng, shop tư vấn tận tình. Đáng giá tiền!');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (12, 4, N'Lê Hoàng Minh', N'https://i.pravatar.cc/150?img=68', 4, N'Chất lượng sản phẩm tuyệt vời, tuy nhiên vận chuyển mất 2 ngày.');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (13, 5, N'Nguyễn Văn An', N'https://i.pravatar.cc/150?img=11', 5, N'Sản phẩm dùng rất mượt, đóng gói cẩn thận, giao hàng trong ngày. Rất hài lòng!');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (14, 5, N'Lê Hoàng Minh', N'https://i.pravatar.cc/150?img=68', 4, N'Chất lượng sản phẩm tuyệt vời, tuy nhiên vận chuyển mất 2 ngày.');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (15, 5, N'Trần Thị Mai', N'https://i.pravatar.cc/150?img=32', 5, N'Thiết kế đẹp mắt sang trọng, shop tư vấn tận tình. Đáng giá tiền!');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (16, 6, N'Trần Thị Mai', N'https://i.pravatar.cc/150?img=32', 5, N'Thiết kế đẹp mắt sang trọng, shop tư vấn tận tình. Đáng giá tiền!');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (17, 6, N'Lê Hoàng Minh', N'https://i.pravatar.cc/150?img=68', 4, N'Chất lượng sản phẩm tuyệt vời, tuy nhiên vận chuyển mất 2 ngày.');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (18, 6, N'Nguyễn Văn An', N'https://i.pravatar.cc/150?img=11', 5, N'Sản phẩm dùng rất mượt, đóng gói cẩn thận, giao hàng trong ngày. Rất hài lòng!');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (19, 7, N'Trần Thị Mai', N'https://i.pravatar.cc/150?img=32', 5, N'Thiết kế đẹp mắt sang trọng, shop tư vấn tận tình. Đáng giá tiền!');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (20, 7, N'Nguyễn Văn An', N'https://i.pravatar.cc/150?img=11', 5, N'Sản phẩm dùng rất mượt, đóng gói cẩn thận, giao hàng trong ngày. Rất hài lòng!');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (21, 7, N'Lê Hoàng Minh', N'https://i.pravatar.cc/150?img=68', 4, N'Chất lượng sản phẩm tuyệt vời, tuy nhiên vận chuyển mất 2 ngày.');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (22, 8, N'Trần Thị Mai', N'https://i.pravatar.cc/150?img=32', 5, N'Thiết kế đẹp mắt sang trọng, shop tư vấn tận tình. Đáng giá tiền!');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (23, 8, N'Lê Hoàng Minh', N'https://i.pravatar.cc/150?img=68', 4, N'Chất lượng sản phẩm tuyệt vời, tuy nhiên vận chuyển mất 2 ngày.');
INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (24, 8, N'Nguyễn Văn An', N'https://i.pravatar.cc/150?img=11', 5, N'Sản phẩm dùng rất mượt, đóng gói cẩn thận, giao hàng trong ngày. Rất hài lòng!');
SET IDENTITY_INSERT comments OFF;
GO

SET IDENTITY_INSERT users ON;
INSERT INTO users (id, fullname, email, phone, password, avatar, role, reset_token) VALUES (1, N'Test User', N'test@example.com', N'', N'$2b$10$ZAmBhdLDbIbKrQvKAEfIpuB9MNZedcRBfnJM3BWatPTpj70i5FmkS', N'https://i.pravatar.cc/150?u=test%40example.com', N'user', N'gv5zzl3jn8e');
SET IDENTITY_INSERT users OFF;
GO

