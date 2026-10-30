const sql = require('mssql');
const path = require('path');
require('dotenv').config();

// Parse DB_SERVER in case it has SQLEXPRESS/localhost format
let serverHost = process.env.DB_SERVER || 'SQLEXPRESS/localhost';
let instanceName = undefined;

if (serverHost.includes('/')) {
  const parts = serverHost.split('/');
  serverHost = parts[1];
  instanceName = parts[0];
} else if (serverHost.includes('\\')) {
  const parts = serverHost.split('\\');
  serverHost = parts[0];
  instanceName = parts[1];
}

const config = {
  user: process.env.DB_USER || 'devops',
  password: process.env.DB_PASSWORD || 'devops123',
  server: serverHost,
  database: process.env.DB_NAME || 'DevOps',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

if (instanceName) {
  config.options.instanceName = instanceName;
}

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(async pool => {
    console.log('Connected to MSSQL Database at', serverHost);
    await initializeDb(pool);
    return pool;
  })
  .catch(err => {
    console.error('Database Connection Failed! Bad Config: ', err);
  });

async function initializeDb(pool) {
  try {
    // Check and create products
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='products' AND xtype='U')
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
      )
    `);

    // Safe migration for existing products table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('products') AND name = 'brand')
        ALTER TABLE products ADD brand NVARCHAR(100) DEFAULT 'TechNova';
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('products') AND name = 'sold_count')
        ALTER TABLE products ADD sold_count INT DEFAULT 0;
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('products') AND name = 'rating_count')
        ALTER TABLE products ADD rating_count INT DEFAULT 1;
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('products') AND name = 'quick_specs')
        ALTER TABLE products ADD quick_specs NVARCHAR(MAX);
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('products') AND name = 'variants')
        ALTER TABLE products ADD variants NVARCHAR(MAX);
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('products') AND name = 'is_flash_sale')
        ALTER TABLE products ADD is_flash_sale INT DEFAULT 0;
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('products') AND name = 'discount_percent')
        ALTER TABLE products ADD discount_percent INT DEFAULT 0;
    `);

    // Comments
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='comments' AND xtype='U')
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
      )
    `);

    // Safe migration for existing comments table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('comments') AND name = 'user_id')
        ALTER TABLE comments ADD user_id INT;
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('comments') AND name = 'variant_purchased')
        ALTER TABLE comments ADD variant_purchased NVARCHAR(255);
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('comments') AND name = 'is_verified_purchase')
        ALTER TABLE comments ADD is_verified_purchase INT DEFAULT 1;
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('comments') AND name = 'images')
        ALTER TABLE comments ADD images NVARCHAR(MAX);
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('comments') AND name = 'admin_reply')
        ALTER TABLE comments ADD admin_reply NVARCHAR(MAX);
    `);

    // Orders
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='orders' AND xtype='U')
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
      )
    `);

    // Order items
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='order_items' AND xtype='U')
      CREATE TABLE order_items (
        id INT PRIMARY KEY IDENTITY(1,1),
        order_id INT NOT NULL FOREIGN KEY REFERENCES orders(id) ON DELETE CASCADE,
        product_id INT NOT NULL,
        product_name NVARCHAR(255) NOT NULL,
        price FLOAT NOT NULL,
        quantity INT NOT NULL
      )
    `);

    // Users
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
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
      )
    `);

    // Contact Messages
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='contact_messages' AND xtype='U')
      CREATE TABLE contact_messages (
        id INT PRIMARY KEY IDENTITY(1,1),
        name NVARCHAR(255) NOT NULL,
        email NVARCHAR(255) NOT NULL,
        phone NVARCHAR(20),
        subject NVARCHAR(255) NOT NULL,
        message NVARCHAR(MAX) NOT NULL,
        status NVARCHAR(50) DEFAULT 'New',
        created_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Vouchers Table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='vouchers' AND xtype='U')
      BEGIN
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
        INSERT INTO vouchers (code, discount_type, discount_value, min_order_value, max_discount, usage_count, max_usage, is_active)
        VALUES 
          ('TECH10', 'percent', 20, 50, 100, 38, 200, 1),
          ('FREESHIP', 'fixed', 15, 0, 15, 62, 500, 1),
          ('VIP50', 'fixed', 50, 300, 50, 12, 50, 1);
      END
    `);

    // Seed Data
    const result = await pool.request().query("SELECT COUNT(*) as count FROM products");
    if (result.recordset[0].count === 0) {
      console.log('Seeding initial products catalog...');
      try {
        const { PRODUCTS_DATA } = require('./seed_products');
        for (const p of PRODUCTS_DATA) {
          const discount = p.discountPercent || (p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0);
          const req = pool.request();
          req.input('name', sql.NVARCHAR, p.name);
          req.input('category', sql.NVARCHAR, p.category);
          req.input('brand', sql.NVARCHAR, p.brand || 'TechNova');
          req.input('price', sql.FLOAT, p.price);
          req.input('oldPrice', sql.FLOAT, p.oldPrice || null);
          req.input('rating', sql.FLOAT, p.rating || 5.0);
          req.input('stock', sql.INT, p.stock || 10);
          req.input('sold_count', sql.INT, p.soldCount || 100);
          req.input('rating_count', sql.INT, p.ratingCount || 25);
          req.input('image', sql.NVARCHAR, p.image);
          req.input('description', sql.NVARCHAR, p.description);
          req.input('specs', sql.NVARCHAR, JSON.stringify(p.specs || []));
          req.input('quick_specs', sql.NVARCHAR, JSON.stringify(p.quickSpecs || []));
          req.input('variants', sql.NVARCHAR, JSON.stringify(p.variants || []));
          req.input('featured', sql.INT, p.featured || 0);
          req.input('is_flash_sale', sql.INT, p.isFlashSale ? 1 : 0);
          req.input('discount_percent', sql.INT, discount);

          await req.query(`
            INSERT INTO products (
              name, category, brand, price, oldPrice, rating, stock, sold_count, rating_count,
              image, description, specs, quick_specs, variants, featured, is_flash_sale, discount_percent
            )
            VALUES (
              @name, @category, @brand, @price, @oldPrice, @rating, @stock, @sold_count, @rating_count,
              @image, @description, @specs, @quick_specs, @variants, @featured, @is_flash_sale, @discount_percent
            )
          `);
        }
        console.log(`Initial catalog seeded with ${PRODUCTS_DATA.length} products successfully.`);
      } catch (seedErr) {
        console.error('Error seeding products catalog:', seedErr);
      }
    }
  } catch (err) {
    console.error('Error during DB Initialization:', err);
  }
}

module.exports = {
  sql,
  poolPromise
};
