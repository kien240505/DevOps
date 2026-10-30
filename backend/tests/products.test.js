const request = require('supertest');
const express = require('express');
const productsRouter = require('../routes/products');
const { poolPromise, sql } = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

const app = express();
app.use(express.json());
app.use('/api/products', productsRouter);

describe('Products API Endpoints', () => {
  let pool;
  let testProductId;
  const adminToken = jwt.sign(
    { id: 0, email: 'admin', role: 'admin' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  beforeAll(async () => {
    pool = await poolPromise;
    // Create a temporary test product specifically for this test suite
    if (pool) {
      const insertRes = await pool.request()
        .input('name', sql.NVARCHAR, 'Jest Test Laptop Pro')
        .input('category', sql.NVARCHAR, 'Laptop')
        .input('price', sql.FLOAT, 899)
        .input('oldPrice', sql.FLOAT, 999)
        .input('rating', sql.FLOAT, 5.0)
        .input('stock', sql.INT, 10)
        .input('image', sql.NVARCHAR, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80')
        .input('description', sql.NVARCHAR, 'Temporary test product description')
        .input('specs', sql.NVARCHAR, JSON.stringify(['Test Spec 1']))
        .input('featured', sql.INT, 1)
        .query(`
          INSERT INTO products (name, category, price, oldPrice, rating, stock, image, description, specs, featured)
          OUTPUT INSERTED.id
          VALUES (@name, @category, @price, @oldPrice, @rating, @stock, @image, @description, @specs, @featured)
        `);
      testProductId = insertRes.recordset[0].id;
    }
  });

  afterAll(async () => {
    if (pool && testProductId) {
      await pool.request()
        .input('id', sql.INT, testProductId)
        .query('DELETE FROM products WHERE id = @id');
    }
  });

  it('should get list of products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should filter products by category', async () => {
    const res = await request(app).get('/api/products?category=Laptop');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach(p => {
      expect(p.category.toLowerCase()).toBe('laptop');
    });
  });

  it('should filter products by price range', async () => {
    const res = await request(app).get('/api/products?minPrice=200&maxPrice=1000');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach(p => {
      expect(p.price).toBeGreaterThanOrEqual(200);
      expect(p.price).toBeLessThanOrEqual(1000);
    });
  });

  it('should get product categories', async () => {
    const res = await request(app).get('/api/products/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toContain('All');
  });

  it('should get single product detail with comments', async () => {
    const res = await request(app).get(`/api/products/${testProductId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(testProductId);
    expect(Array.isArray(res.body.comments)).toBe(true);
  });

  it('should add comment to product', async () => {
    const res = await request(app)
      .post(`/api/products/${testProductId}/comments`)
      .send({
        author: 'Tester DevOps',
        rating: 5,
        content: 'Sản phẩm thử nghiệm chất lượng tuyệt vời!'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.author).toBe('Tester DevOps');
    expect(res.body.rating).toBe(5);
  });

  it('should update product details for admin', async () => {
    const res = await request(app)
      .put(`/api/products/${testProductId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        price: 949,
        stock: 25
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Product updated successfully');
  });
});
