const { poolPromise, sql } = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

exports.register = async (req, res) => {
  const { fullname, email, phone, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu!' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự!' });
  }

  try {
    const pool = await poolPromise;
    const checkResult = await pool.request()
      .input('email', sql.NVARCHAR, email)
      .query('SELECT id FROM users WHERE email = @email');

    if (checkResult.recordset.length > 0) {
      return res.status(409).json({ error: 'Email này đã được đăng ký. Vui lòng dùng email khác!' });
    }

    const avatar = `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = email.toLowerCase() === ADMIN_USER.toLowerCase() ? 'admin' : 'user';

    const insertResult = await pool.request()
      .input('fullname', sql.NVARCHAR, fullname)
      .input('email', sql.NVARCHAR, email)
      .input('phone', sql.NVARCHAR, phone || '')
      .input('password', sql.NVARCHAR, hashedPassword)
      .input('avatar', sql.NVARCHAR, avatar)
      .input('role', sql.NVARCHAR, role)
      .query(`
        INSERT INTO users (fullname, email, phone, password, avatar, role) 
        OUTPUT INSERTED.id
        VALUES (@fullname, @email, @phone, @password, @avatar, @role)
      `);

    const newId = insertResult.recordset[0].id;

    // Issue JWT token so new user is immediately authenticated
    const token = jwt.sign(
      { id: newId, email, role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: { id: newId, fullname, email, phone: phone || '', avatar, role },
      message: `Đăng ký thành công! Chào mừng ${fullname} đến với TechNova!`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập Email và Mật khẩu!' });
  }

  // 1. Check if login matches admin credentials from environment
  if (email.trim().toLowerCase() === ADMIN_USER.toLowerCase() && password === ADMIN_PASS) {
    const token = jwt.sign(
      { id: 0, email: ADMIN_USER, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: 0,
        fullname: 'Quản Lý Trưởng',
        email: ADMIN_USER,
        phone: '',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: 'admin'
      },
      message: 'Đăng nhập quản trị thành công!'
    });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.NVARCHAR, email)
      .query('SELECT * FROM users WHERE email = @email');

    const user = result.recordset[0];
    if (!user) return res.status(401).json({ error: 'Email chưa được đăng ký trong hệ thống!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && password !== user.password) {
      return res.status(401).json({ error: 'Mật khẩu không chính xác!' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone || '',
        avatar: user.avatar,
        role: user.role
      },
      message: `Đăng nhập thành công! Chào mừng trở lại ${user.fullname}!`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  const userId = req.user?.id;

  if (userId === undefined || userId === null) {
    return res.status(401).json({ error: 'Không tìm thấy thông tin xác thực người dùng!' });
  }

  // ID 0 represents system administrator
  if (userId === 0) {
    return res.json({
      id: 0,
      fullname: 'Quản Lý Trưởng',
      email: ADMIN_USER,
      phone: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'admin'
    });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.INT, userId)
      .query('SELECT id, fullname, email, phone, avatar, role, created_at FROM users WHERE id = @id');

    const user = result.recordset[0];
    if (!user) return res.status(404).json({ error: 'Không tìm thấy thông tin tài khoản!' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.user?.id || req.body?.id;
  const { fullname, phone, avatar } = req.body;

  if (!userId && userId !== 0) {
    return res.status(401).json({ error: 'Không xác định được danh tính người dùng!' });
  }

  if (userId === 0) {
    return res.json({
      success: true,
      user: {
        id: 0,
        fullname: fullname || 'Quản Lý Trưởng',
        email: ADMIN_USER,
        phone: phone || '',
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: 'admin'
      },
      message: 'Cập nhật thông tin quản trị viên thành công!'
    });
  }

  try {
    const pool = await poolPromise;
    const request = pool.request()
      .input('id', sql.INT, userId)
      .input('fullname', sql.NVARCHAR, fullname)
      .input('phone', sql.NVARCHAR, phone || '');

    let updateQuery = 'UPDATE users SET fullname = @fullname, phone = @phone';
    if (avatar) {
      updateQuery += ', avatar = @avatar';
      request.input('avatar', sql.NVARCHAR, avatar);
    }
    updateQuery += ' WHERE id = @id';

    await request.query(updateQuery);

    const result = await pool.request()
      .input('id', sql.INT, userId)
      .query('SELECT id, fullname, email, phone, avatar, role FROM users WHERE id = @id');

    const updatedUser = result.recordset[0];
    res.json({
      success: true,
      user: updatedUser,
      message: 'Cập nhật thông tin cá nhân thành công!'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  const userId = req.user?.id;
  const { currentPassword, newPassword } = req.body;

  if (!userId && userId !== 0) {
    return res.status(401).json({ error: 'Không xác định được danh tính người dùng!' });
  }

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới!' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
  }

  if (userId === 0) {
    return res.status(400).json({ error: 'Tài khoản admin mặc định được cấu hình qua tệp môi trường (.env).' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.INT, userId)
      .query('SELECT password FROM users WHERE id = @id');

    const user = result.recordset[0];
    if (!user) return res.status(404).json({ error: 'Không tìm thấy tài khoản!' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch && currentPassword !== user.password) {
      return res.status(400).json({ error: 'Mật khẩu hiện tại không chính xác!' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.request()
      .input('id', sql.INT, userId)
      .input('password', sql.NVARCHAR, hashedPassword)
      .query('UPDATE users SET password = @password WHERE id = @id');

    res.json({ success: true, message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Vui lòng nhập Email!' });

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.NVARCHAR, email)
      .query('SELECT id FROM users WHERE email = @email');

    const user = result.recordset[0];
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng với email này!' });

    // Generate 6-character alphanumeric reset token
    const resetToken = Math.random().toString(36).substring(2, 8).toUpperCase();
    await pool.request()
      .input('resetToken', sql.NVARCHAR, resetToken)
      .input('id', sql.INT, user.id)
      .query('UPDATE users SET reset_token = @resetToken, reset_token_expiry = DATEADD(minute, 30, GETDATE()) WHERE id = @id');

    res.json({ 
      success: true,
      message: 'Mã khôi phục mật khẩu đã được tạo (hết hạn sau 30 phút)!', 
      resetToken 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, resetToken, newPassword } = req.body;

  if (!email || !resetToken || !newPassword) {
    return res.status(400).json({ error: 'Vui lòng điền Email, Mã xác thực và Mật khẩu mới!' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.NVARCHAR, email)
      .input('resetToken', sql.NVARCHAR, resetToken)
      .query(`
        SELECT id FROM users 
        WHERE email = @email 
          AND reset_token = @resetToken 
          AND (reset_token_expiry IS NULL OR reset_token_expiry >= GETDATE())
      `);

    const user = result.recordset[0];
    if (!user) {
      return res.status(400).json({ error: 'Mã khôi phục không chính xác hoặc đã hết hạn!' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.request()
      .input('id', sql.INT, user.id)
      .input('password', sql.NVARCHAR, hashedPassword)
      .query('UPDATE users SET password = @password, reset_token = NULL, reset_token_expiry = NULL WHERE id = @id');

    res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT id, fullname, email, phone, avatar, role, created_at FROM users ORDER BY id DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  const currentUserId = req.user?.id;

  if (Number(userId) === Number(currentUserId) || Number(userId) === 0) {
    return res.status(400).json({ error: 'Không thể xóa tài khoản của chính bạn!' });
  }

  try {
    const pool = await poolPromise;

    // Check if user exists and if user is admin
    const checkUser = await pool.request()
      .input('id', sql.INT, userId)
      .query('SELECT id, role FROM users WHERE id = @id');

    if (checkUser.recordset.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng để xóa' });
    }

    if (checkUser.recordset[0].role === 'admin' && req.user?.role !== 'superadmin') {
      return res.status(403).json({ error: 'Không thể xóa tài khoản Quản trị viên!' });
    }

    await pool.request()
      .input('id', sql.INT, userId)
      .query('DELETE FROM users WHERE id = @id');

    res.json({ success: true, message: 'Đã xóa người dùng thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
