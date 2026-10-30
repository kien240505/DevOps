const request = require('supertest');
const express = require('express');
const authRouter = require('../routes/auth');
const { poolPromise, sql } = require('../db');

// Setup mock express app
const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth API Endpoints', () => {
  let pool;
  const testUser = {
    fullname: 'Test User',
    email: 'test_user_devops@example.com',
    password: 'password123'
  };

  beforeAll(async () => {
    pool = await poolPromise;
    if (pool) {
      await pool.request()
        .input('email', sql.NVARCHAR, testUser.email)
        .query('DELETE FROM users WHERE email = @email');
    }
  });

  afterAll(async () => {
    if (pool) {
      await pool.request()
        .input('email', sql.NVARCHAR, testUser.email)
        .query('DELETE FROM users WHERE email = @email');
    }
  });

  it('should register a new user and return JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('should not register user with duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(res.statusCode).toEqual(409);
    expect(res.body.error).toBeDefined();
  });

  it('should login user and return JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('should fail login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toBeDefined();
  });

  it('should request forgot password and receive resetToken', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: testUser.email });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.resetToken).toBeDefined();

    // Test reset password with token
    const resetRes = await request(app)
      .post('/api/auth/reset-password')
      .send({
        email: testUser.email,
        resetToken: res.body.resetToken,
        newPassword: 'newpassword456'
      });

    expect(resetRes.statusCode).toEqual(200);
    expect(resetRes.body.success).toBe(true);
  });

  it('should get and update user profile with JWT token', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'newpassword456' });

    const token = loginRes.body.token;

    // Get profile
    const getRes = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.statusCode).toEqual(200);
    expect(getRes.body.email).toBe(testUser.email);

    // Update profile
    const updateRes = await request(app)
      .put('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ fullname: 'Updated Name', phone: '0988776655' });

    expect(updateRes.statusCode).toEqual(200);
    expect(updateRes.body.success).toBe(true);
    expect(updateRes.body.user.fullname).toBe('Updated Name');
    expect(updateRes.body.user.phone).toBe('0988776655');

    // Change password
    const passRes = await request(app)
      .put('/api/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'newpassword456',
        newPassword: 'password123'
      });

    expect(passRes.statusCode).toEqual(200);
    expect(passRes.body.success).toBe(true);
  });
});
