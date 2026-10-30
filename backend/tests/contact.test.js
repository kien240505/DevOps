const request = require('supertest');
const express = require('express');
const contactRouter = require('../routes/contact');
const { poolPromise, sql } = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

const app = express();
app.use(express.json());
app.use('/api/contact', contactRouter);

describe('Contact API Endpoints', () => {
  let pool;
  let testMsgId;
  const adminToken = jwt.sign(
    { id: 0, email: 'admin', role: 'admin' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  beforeAll(async () => {
    pool = await poolPromise;
  });

  afterAll(async () => {
    if (pool && testMsgId) {
      await pool.request()
        .input('id', sql.INT, testMsgId)
        .query('DELETE FROM contact_messages WHERE id = @id');
    }
  });

  it('should submit a contact message', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        name: 'Nguyen Van Test',
        email: 'test_contact@example.com',
        phone: '0912345678',
        subject: 'Hỏi về bảo hành',
        message: 'Xin chào, tôi muốn hỏi về chính sách bảo hành 24 tháng của MacBook Pro.'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.id).toBeDefined();
    testMsgId = res.body.id;
  });

  it('should reject contact message if fields are missing', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Chỉ có tên' });

    expect(res.statusCode).toBe(400);
  });

  it('should get contact messages for admin', async () => {
    const res = await request(app)
      .get('/api/contact')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(m => m.id === testMsgId)).toBe(true);
  });

  it('should update contact message status for admin', async () => {
    const res = await request(app)
      .put(`/api/contact/${testMsgId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Resolved' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
