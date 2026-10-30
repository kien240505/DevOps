const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ Họ tên, Email, Tiêu đề và Nội dung tin nhắn!' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.NVARCHAR, name)
      .input('email', sql.NVARCHAR, email)
      .input('phone', sql.NVARCHAR, phone || '')
      .input('subject', sql.NVARCHAR, subject)
      .input('message', sql.NVARCHAR, message)
      .query(`
        INSERT INTO contact_messages (name, email, phone, subject, message) 
        OUTPUT INSERTED.id
        VALUES (@name, @email, @phone, @subject, @message)
      `);
      
    res.status(201).json({
      success: true,
      id: result.recordset[0].id,
      message: 'Gửi tin nhắn liên hệ thành công! TechNova sẽ phản hồi sớm nhất.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM contact_messages ORDER BY id DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  const messageId = req.params.id;
  const { status } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.INT, messageId)
      .input('status', sql.NVARCHAR, status || 'Read')
      .query('UPDATE contact_messages SET status = @status WHERE id = @id');

    res.json({ success: true, message: 'Cập nhật trạng thái tin nhắn thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  const messageId = req.params.id;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.INT, messageId)
      .query('DELETE FROM contact_messages WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Không tìm thấy tin nhắn để xóa' });
    }

    res.json({ success: true, message: 'Đã xóa tin nhắn thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
