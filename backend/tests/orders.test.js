const request = require('supertest');
const express = require('express');
const ordersRouter = require('../routes/orders');
const { poolPromise, sql } = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

const app = express();
app.use(express.json());
app.use('/api/orders', ordersRouter);

describe('Orders API Endpoints', () => {
  let pool;
  let createdOrderId;
  let testProduct = { id: 1, name: 'MacBook Pro 16 M3 Max', price: 1499 };
  const userToken = jwt.sign(
    { id: 999, email: 'test_order@example.com', role: 'user' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  beforeAll(async () => {
    pool = await poolPromise;
    if (pool) {
      // Find a product with stock >= 2 or ensure product 1 has stock
      const prodRes = await pool.request().query('SELECT TOP 1 id, name, price, stock FROM products WHERE stock >= 2');
      if (prodRes.recordset.length > 0) {
        testProduct = prodRes.recordset[0];
      } else {
        await pool.request().query('UPDATE products SET stock = 10 WHERE id = 1');
      }
    }
  });

  afterAll(async () => {
    if (pool && createdOrderId) {
      await pool.request()
        .input('id', sql.INT, createdOrderId)
        .query('DELETE FROM orders WHERE id = @id');
    }
  });

  it('should create a new order', async () => {
    const orderData = {
      customer_name: 'Nguyen Van Test',
      email: 'test_order@example.com',
      phone: '0901234567',
      address: '123 Đường Công Nghệ, Quận 1, TP.HCM',
      payment_method: 'COD',
      total_amount: testProduct.price,
      items: [
        {
          id: testProduct.id,
          name: testProduct.name,
          price: testProduct.price,
          quantity: 1
        }
      ]
    };

    const res = await request(app)
      .post('/api/orders')
      .send(orderData);

    expect(res.statusCode).toBe(201);
    expect(res.body.orderId).toBeDefined();
    createdOrderId = res.body.orderId;
  });

  it('should reject order if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ customer_name: 'Incomplete' });

    expect(res.statusCode).toBe(400);
  });

  it('should get order details by ID for the owner', async () => {
    const res = await request(app)
      .get(`/api/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(createdOrderId);
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it('should complete an order for the authenticated owner', async () => {
    const res = await request(app)
      .put(`/api/orders/${createdOrderId}/complete`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
