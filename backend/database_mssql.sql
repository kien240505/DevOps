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
GO

-- Create Tables
CREATE TABLE products (
  id INT PRIMARY KEY IDENTITY(1,1),
  name NVARCHAR(MAX) NOT NULL,
  category NVARCHAR(255) NOT NULL,
  price FLOAT NOT NULL,
  oldPrice FLOAT,
  rating FLOAT DEFAULT 5.0,
  stock INT DEFAULT 10,
  image NVARCHAR(MAX) NOT NULL,
  description NVARCHAR(MAX) NOT NULL,
  specs NVARCHAR(MAX),
  featured INT DEFAULT 0,
  created_at DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE comments (
  id INT PRIMARY KEY IDENTITY(1,1),
  product_id INT NOT NULL FOREIGN KEY REFERENCES products(id) ON DELETE CASCADE,
  author NVARCHAR(255) NOT NULL,
  avatar NVARCHAR(MAX),
  rating INT NOT NULL,
  content NVARCHAR(MAX) NOT NULL,
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

SET IDENTITY_INSERT products ON;
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (1, N'MacBook Pro 16 M3 Max', N'Laptop', 2499, 2699, 4.9, 15, N'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', N'Sức mạnh vượt trội cho chuyên gia sáng tạo với chip M3 Max 16-Core CPU, 40-Core GPU và màn hình Liquid Retina XDR sắc nét.', N'["Apple M3 Max Chip","36GB Unified Memory","1TB SSD Storage","16.2-inch XDR Display","Up to 22h battery"]', 1);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (2, N'iPhone 15 Pro Max Titanium', N'Smartphone', 1199, 1299, 4.8, 25, N'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80', N'Thiết kế vỏ Titanium hàng không nhẹ vượt trội, nút Action linh hoạt và cụm camera zoom quang học 5x sắc nét tuyệt đối.', N'["Chip A17 Pro 3nm","Camera chính 48MP","Zoom quang 5x","Titanium Grade 5","USB-C 3.0"]', 1);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (3, N'Sony WH-1000XM5 ANC', N'Audio', 349, 399, 4.7, 30, N'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', N'Tai nghe chống ồn chủ động hàng đầu thế giới với 8 micro kép, màng loa 30mm đặc biệt và thời lượng pin 30 giờ.', N'["Industry-leading ANC","Hi-Res Audio LDAC","30-hour Battery","Speak-to-Chat","Multi-point Bluetooth"]', 1);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (4, N'Dell UltraSharp 32 4K USB-C Hub Monitor', N'Monitor', 799, 899, 4.6, 12, N'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80', N'Màn hình đồ họa chuẩn IPS Black 4K HDR400, độ phủ màu 100% sRGB & DCI-P3 98%, cổng sạc USB-C 90W tiện lợi.', N'["32-inch 4K UHD","IPS Black Technology","DCI-P3 98%","USB-C Hub 90W Power","Ergonomic Stand"]', 0);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (5, N'Logitech MX Master 3S Wireless Mouse', N'Accessory', 99, 119, 4.9, 50, N'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80', N'Chuột không dây công xưởng công nghệ với cảm biến 8K DPI Quiet Clicks và con cuộn cuộn siêu tốc MagSpeed.', N'["8000 DPI Optical","Quiet Click buttons","MagSpeed Scroll","Bluetooth & Logi Bolt","USB-C Quick Charge"]', 1);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (6, N'Keychron Q1 Max Wireless Mechanical Keyboard', N'Accessory', 219, 239, 4.8, 18, N'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80', N'Bàn phím cơ CNC Nhôm nguyên khối, Gasket Mount êm ái, hỗ trợ kết nối 2.4Ghz siêu tốc và tùy chỉnh VIA/QMK.', N'["Full Aluminum Body","2.4Ghz & Bluetooth 5.1","Hot-swappable Switches","South-facing RGB","QMK/VIA Programmable"]', 0);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (7, N'iPad Pro 13 M4 Ultra-Thin', N'Tablet', 1299, 1399, 4.9, 20, N'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80', N'Mỏng kinh ngạc chỉ 5.1mm với màn hình Tandem OLED Ultra Retina XDR siêu nét và sức mạnh đột phá từ chip M4.', N'["Chip Apple M4","Ultra Retina XDR OLED","Thickness 5.1mm","Apple Pencil Pro Support","Thunderbolt 4 / USB 4"]', 1);
INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (8, N'Apple Watch Ultra 2 Titanium', N'Smartwatch', 799, 849, 4.8, 14, N'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&q=80', N'Đồng hồ thể thao chuyên nghiệp với màn hình sáng nhất 3000 nits, định vị GPS kép chuẩn xác và đo độ sâu chống nước 100m.', N'["S9 SiP Chip","3000 nits OLED Display","Precision Dual GPS","100m Water Resistant","36 Hours Battery"]', 0);
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

