const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, verifyToken, isAdmin } = require('../middlewares/authMiddleware');

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập tài khoản và mật khẩu!' });
  }

  // 1. Check environment admin credentials
  if (username.trim().toLowerCase() === ADMIN_USER.toLowerCase() && password === ADMIN_PASS) {
    const token = jwt.sign(
      { id: 0, email: ADMIN_USER, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    return res.json({
      success: true,
      token,
      admin: {
        id: 0,
        username: ADMIN_USER,
        role: 'admin',
        name: 'Quản Lý Trưởng'
      },
      message: 'Đăng nhập quản trị thành công!'
    });
  }

  // 2. Check users database for admin account
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.NVARCHAR, username.trim())
      .query("SELECT * FROM users WHERE (LOWER(email) = LOWER(@email) OR LOWER(fullname) = LOWER(@email)) AND role = 'admin'");

    const adminUser = result.recordset[0];
    if (adminUser) {
      const isMatch = await bcrypt.compare(password, adminUser.password);
      if (isMatch || password === adminUser.password) {
        const token = jwt.sign(
          { id: adminUser.id, email: adminUser.email, role: 'admin' },
          JWT_SECRET,
          { expiresIn: '1d' }
        );

        return res.json({
          success: true,
          token,
          admin: {
            id: adminUser.id,
            username: adminUser.email,
            role: 'admin',
            name: adminUser.fullname
          },
          message: `Đăng nhập quản trị thành công! Chào mừng ${adminUser.fullname}!`
        });
      }
    }
  } catch (err) {
    console.error('Database admin login check failed:', err);
  }

  return res.status(401).json({ error: 'Tài khoản hoặc mật khẩu quản trị không chính xác!' });
});

router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const pool = await poolPromise;
    
    const prodResult = await pool.request().query('SELECT COUNT(*) as totalProducts, SUM(CASE WHEN stock <= 3 THEN 1 ELSE 0 END) as lowStock FROM products');
    const orderResult = await pool.request().query('SELECT COUNT(*) as totalOrders, SUM(total_amount) as totalRevenue, SUM(CASE WHEN status = \'Pending\' THEN 1 ELSE 0 END) as pendingOrders FROM orders');
    const commentResult = await pool.request().query('SELECT COUNT(*) as totalComments FROM comments');
    const userResult = await pool.request().query('SELECT COUNT(*) as totalUsers FROM users');
    const msgResult = await pool.request().query('SELECT COUNT(*) as totalMessages FROM contact_messages');

    res.json({
      totalProducts: prodResult.recordset[0].totalProducts || 0,
      lowStock: prodResult.recordset[0].lowStock || 0,
      totalOrders: orderResult.recordset[0].totalOrders || 0,
      totalRevenue: orderResult.recordset[0].totalRevenue || 0,
      pendingOrders: orderResult.recordset[0].pendingOrders || 0,
      totalComments: commentResult.recordset[0].totalComments || 0,
      totalUsers: userResult.recordset[0].totalUsers || 0,
      totalMessages: msgResult.recordset[0].totalMessages || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// E-COMMENT MANAGEMENT ENDPOINTS
// ==========================================

// Get all comments with product details
router.get('/comments', verifyToken, isAdmin, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        c.id, c.product_id, c.author, c.avatar, c.rating, c.content,
        c.variant_purchased, c.is_verified_purchase, c.admin_reply, c.created_at,
        p.name as product_name, p.image as product_image, p.category as product_category
      FROM comments c
      LEFT JOIN products p ON c.product_id = p.id
      ORDER BY c.id DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin reply to a customer review
router.put('/comments/:id/reply', verifyToken, isAdmin, async (req, res) => {
  const commentId = req.params.id;
  const { admin_reply } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.INT, commentId)
      .input('reply', sql.NVARCHAR, admin_reply || '')
      .query('UPDATE comments SET admin_reply = @reply WHERE id = @id');

    res.json({ success: true, message: 'Đã cập nhật phản hồi của TechNova Mall!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a comment / Spam review
router.delete('/comments/:id', verifyToken, isAdmin, async (req, res) => {
  const commentId = req.params.id;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.INT, commentId)
      .query('DELETE FROM comments WHERE id = @id');

    res.json({ success: true, message: 'Đã xóa bình luận thành công!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// VOUCHER & PROMOTION ENDPOINTS
// ==========================================

// Get all vouchers
router.get('/vouchers', verifyToken, isAdmin, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM vouchers ORDER BY id DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new voucher
router.post('/vouchers', verifyToken, isAdmin, async (req, res) => {
  const { code, discount_type, discount_value, min_order_value, max_discount, max_usage, expires_at } = req.body;

  if (!code || !discount_value) {
    return res.status(400).json({ error: 'Mã code và mức giảm giá là bắt buộc!' });
  }

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('code', sql.NVARCHAR, code.toUpperCase().trim())
      .input('type', sql.NVARCHAR, discount_type || 'percent')
      .input('val', sql.FLOAT, parseFloat(discount_value))
      .input('minOrder', sql.FLOAT, parseFloat(min_order_value || 0))
      .input('maxDiscount', sql.FLOAT, parseFloat(max_discount || 100))
      .input('maxUsage', sql.INT, parseInt(max_usage || 100))
      .input('expires', sql.DATETIME, expires_at ? new Date(expires_at) : null)
      .query(`
        INSERT INTO vouchers (code, discount_type, discount_value, min_order_value, max_discount, max_usage, expires_at, is_active)
        VALUES (@code, @type, @val, @minOrder, @maxDiscount, @maxUsage, @expires, 1)
      `);

    res.status(201).json({ success: true, message: 'Tạo mã voucher khuyến mãi mới thành công!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle voucher active status
router.put('/vouchers/:id/toggle', verifyToken, isAdmin, async (req, res) => {
  const voucherId = req.params.id;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.INT, voucherId)
      .query('UPDATE vouchers SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END WHERE id = @id');

    res.json({ success: true, message: 'Đã cập nhật trạng thái voucher!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete voucher
router.delete('/vouchers/:id', verifyToken, isAdmin, async (req, res) => {
  const voucherId = req.params.id;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.INT, voucherId)
      .query('DELETE FROM vouchers WHERE id = @id');

    res.json({ success: true, message: 'Đã xóa voucher thành công!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

