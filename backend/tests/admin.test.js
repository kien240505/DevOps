const request = require('supertest');
const express = require('express');
const adminRouter = require('../routes/admin');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

const app = express();
app.use(express.json());
app.use('/api/admin', adminRouter);

describe('Admin API Endpoints', () => {
  const adminToken = jwt.sign(
    { id: 0, email: 'admin', role: 'admin' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  it('should login admin with valid env credentials', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({
        username: process.env.ADMIN_USER || 'admin',
        password: process.env.ADMIN_PASS || 'admin123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.admin).toBeDefined();
  });

  it('should reject admin login with invalid password', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({
        username: process.env.ADMIN_USER || 'admin',
        password: 'wrong_password_999'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it('should get admin dashboard stats with admin token', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.totalProducts).toBeDefined();
    expect(res.body.totalOrders).toBeDefined();
    expect(res.body.totalRevenue).toBeDefined();
  });

  it('should reject get stats without token', async () => {
    const res = await request(app).get('/api/admin/stats');
    expect(res.statusCode).toBe(403);
  });
});
