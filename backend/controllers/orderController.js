const { poolPromise, sql } = require('../db');

exports.createOrder = async (req, res) => {
  const { customer_name, email, phone, address, payment_method, items, total_amount } = req.body;

  if (!customer_name || !email || !phone || !address || !items || !items.length) {
    return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin nhận hàng và sản phẩm trong giỏ!' });
  }

  try {
    const pool = await poolPromise;
    if (!pool) return res.status(503).json({ error: 'Cơ sở dữ liệu chưa sẵn sàng!' });
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // 1. Verify stock availability for all items before proceeding
      for (const item of items) {
        const checkReq = new sql.Request(transaction);
        checkReq.input('id', sql.INT, item.id || item.product_id);
        const checkRes = await checkReq.query('SELECT id, name, stock FROM products WHERE id = @id');
        const prod = checkRes.recordset[0];

        if (prod && prod.stock < item.quantity) {
          throw new Error(`Sản phẩm "${prod.name}" trong kho chỉ còn ${prod.stock} chiếc, không đủ số lượng bạn yêu cầu!`);
        }
      }

      // 2. Create the Order
      const request = new sql.Request(transaction);
      request.input('customer_name', sql.NVARCHAR, customer_name);
      request.input('email', sql.NVARCHAR, email);
      request.input('phone', sql.NVARCHAR, phone);
      request.input('address', sql.NVARCHAR, address);
      request.input('payment_method', sql.NVARCHAR, payment_method || 'COD');
      request.input('total_amount', sql.FLOAT, Number(total_amount));

      const orderResult = await request.query(`
        INSERT INTO orders (customer_name, email, phone, address, payment_method, total_amount, status, payment_status)
        OUTPUT INSERTED.id
        VALUES (@customer_name, @email, @phone, @address, @payment_method, @total_amount, 'Pending', 'Unpaid')
      `);

      const orderId = orderResult.recordset[0].id;

      // 3. Insert items and decrement stock
      for (const item of items) {
        const productId = item.id || item.product_id;
        const productName = item.name || item.product_name || `Sản phẩm #${productId}`;

        const itemRequest = new sql.Request(transaction);
        itemRequest.input('order_id', sql.INT, orderId);
        itemRequest.input('product_id', sql.INT, productId);
        itemRequest.input('product_name', sql.NVARCHAR, productName);
        itemRequest.input('price', sql.FLOAT, Number(item.price));
        itemRequest.input('quantity', sql.INT, Number(item.quantity));

        await itemRequest.query(`
          INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
          VALUES (@order_id, @product_id, @product_name, @price, @quantity)
        `);

        const stockRequest = new sql.Request(transaction);
        stockRequest.input('quantity', sql.INT, Number(item.quantity));
        stockRequest.input('product_id', sql.INT, productId);
        await stockRequest.query(`
          UPDATE products SET stock = CASE WHEN stock - @quantity < 0 THEN 0 ELSE stock - @quantity END WHERE id = @product_id
        `);
      }

      await transaction.commit();
      res.status(201).json({
        success: true,
        orderId,
        message: 'Đặt hàng thành công! Đơn hàng đang được TechNova chuẩn bị.',
        total_amount,
        payment_method: payment_method || 'COD'
      });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const pool = await poolPromise;
    if (!pool) return res.status(503).json({ error: 'Cơ sở dữ liệu chưa sẵn sàng!' });
    const { status, search } = req.query;

    let query = 'SELECT * FROM orders WHERE 1=1';
    const request = pool.request();

    if (status && status !== 'All') {
      query += ' AND status = @status';
      request.input('status', sql.NVARCHAR, status);
    }

    if (search) {
      query += ' AND (customer_name LIKE @search OR email LIKE @search OR phone LIKE @search OR CAST(id AS NVARCHAR) LIKE @search)';
      request.input('search', sql.NVARCHAR, `%${search}%`);
    }

    query += ' ORDER BY id DESC';

    const ordersResult = await request.query(query);
    const orders = ordersResult.recordset;

    if (orders.length === 0) return res.json([]);

    for (const order of orders) {
      const itemsResult = await pool.request()
        .input('order_id', sql.INT, order.id)
        .query('SELECT oi.*, p.image FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = @order_id');
      order.items = itemsResult.recordset || [];
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  const email = req.user?.email;
  if (!email) return res.status(400).json({ error: 'User email is required' });

  try {
    const pool = await poolPromise;
    if (!pool) return res.status(503).json({ error: 'Cơ sở dữ liệu chưa sẵn sàng!' });
    const ordersResult = await pool.request()
      .input('email', sql.NVARCHAR, email)
      .query('SELECT * FROM orders WHERE LOWER(email) = LOWER(@email) ORDER BY id DESC');
    const orders = ordersResult.recordset;

    for (const order of orders) {
      const itemsResult = await pool.request()
        .input('order_id', sql.INT, order.id)
        .query('SELECT oi.*, p.image FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = @order_id');
      order.items = itemsResult.recordset || [];
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  const orderId = req.params.id;

  try {
    const pool = await poolPromise;
    if (!pool) return res.status(503).json({ error: 'Cơ sở dữ liệu chưa sẵn sàng!' });
    const orderResult = await pool.request()
      .input('id', sql.INT, orderId)
      .query('SELECT * FROM orders WHERE id = @id');

    const order = orderResult.recordset[0];
    if (!order) return res.status(404).json({ error: 'Không tìm thấy đơn hàng!' });

    // Authorization check: if authenticated user is not owner and not admin, forbid
    if (req.user && req.user.role !== 'admin' && req.user.email.toLowerCase() !== order.email.toLowerCase()) {
      return res.status(403).json({ error: 'Bạn không có quyền truy cập thông tin đơn hàng này!' });
    }

    const itemsResult = await pool.request()
      .input('order_id', sql.INT, order.id)
      .query('SELECT oi.*, p.image FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = @order_id');

    order.items = itemsResult.recordset || [];
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { status, payment_status } = req.body;
  const orderId = req.params.id;

  if (!status) return res.status(400).json({ error: 'Trạng thái đơn hàng (status) là bắt buộc' });

  try {
    const pool = await poolPromise;
    if (!pool) return res.status(503).json({ error: 'Cơ sở dữ liệu chưa sẵn sàng!' });
    const request = pool.request()
      .input('status', sql.NVARCHAR, status)
      .input('id', sql.INT, orderId);

    let query = 'UPDATE orders SET status = @status';

    // Auto mark paid if delivered or completed, or if explicit payment_status is provided
    if (payment_status) {
      query += ', payment_status = @payment_status';
      request.input('payment_status', sql.NVARCHAR, payment_status);
    } else if (['Delivered', 'Completed', 'Đã giao', 'Đã hoàn thành'].includes(status)) {
      query += ", payment_status = 'Paid'";
    }

    query += ' WHERE id = @id';

    await request.query(query);

    res.json({ success: true, message: `Cập nhật đơn hàng #${orderId} sang trạng thái "${status}" thành công!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.completeUserOrder = async (req, res) => {
  const orderId = req.params.id;
  const email = req.user?.email;

  if (!email) return res.status(401).json({ error: 'Vui lòng đăng nhập để xác nhận đơn hàng!' });

  try {
    const pool = await poolPromise;
    if (!pool) return res.status(503).json({ error: 'Cơ sở dữ liệu chưa sẵn sàng!' });
    const orderCheck = await pool.request()
      .input('id', sql.INT, orderId)
      .query('SELECT * FROM orders WHERE id = @id');

    const order = orderCheck.recordset[0];
    if (!order) return res.status(404).json({ error: 'Không tìm thấy đơn hàng!' });

    if (order.email.toLowerCase() !== email.toLowerCase() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Bạn không có quyền cập nhật đơn hàng này!' });
    }

    await pool.request()
      .input('id', sql.INT, orderId)
      .query("UPDATE orders SET status = 'Delivered', payment_status = 'Paid' WHERE id = @id");

    res.json({
      success: true,
      message: `Đơn hàng #${orderId} đã được xác nhận hoàn thành! Bây giờ bạn có thể đánh giá sản phẩm.`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  const orderId = req.params.id;
  const user = req.user;

  try {
    const pool = await poolPromise;
    if (!pool) return res.status(503).json({ error: 'Cơ sở dữ liệu chưa sẵn sàng!' });
    const orderCheck = await pool.request()
      .input('id', sql.INT, orderId)
      .query('SELECT * FROM orders WHERE id = @id');

    const order = orderCheck.recordset[0];
    if (!order) return res.status(404).json({ error: 'Không tìm thấy đơn hàng!' });

    // Only owner or admin can cancel
    if (user && user.role !== 'admin' && user.email.toLowerCase() !== order.email.toLowerCase()) {
      return res.status(403).json({ error: 'Bạn không có quyền hủy đơn hàng này!' });
    }

    if (['Delivered', 'Completed', 'Cancelled'].includes(order.status)) {
      return res.status(400).json({ error: `Không thể hủy đơn hàng đã ở trạng thái "${order.status}"!` });
    }

    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // 1. Restore product stock
      const itemsResult = await new sql.Request(transaction)
        .input('order_id', sql.INT, orderId)
        .query('SELECT product_id, quantity FROM order_items WHERE order_id = @order_id');

      for (const item of itemsResult.recordset) {
        const restoreReq = new sql.Request(transaction);
        restoreReq.input('quantity', sql.INT, item.quantity);
        restoreReq.input('product_id', sql.INT, item.product_id);
        await restoreReq.query('UPDATE products SET stock = stock + @quantity WHERE id = @product_id');
      }

      // 2. Mark order as cancelled
      await new sql.Request(transaction)
        .input('id', sql.INT, orderId)
        .query("UPDATE orders SET status = 'Cancelled' WHERE id = @id");

      await transaction.commit();

      res.json({
        success: true,
        message: `Đơn hàng #${orderId} đã được hủy và hoàn trả tồn kho thành công!`
      });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const pool = await poolPromise;
    if (!pool) return res.status(503).json({ error: 'Cơ sở dữ liệu chưa sẵn sàng!' });
    const result = await pool.request()
      .input('id', sql.INT, orderId)
      .query('DELETE FROM orders WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng để xóa' });
    }

    res.json({ success: true, message: `Đã xóa đơn hàng #${orderId} thành công` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.processPayment = async (req, res) => {
  const orderId = req.params.id;
  const { payment_gateway } = req.body; 

  if (!payment_gateway) return res.status(400).json({ error: 'Cổng thanh toán là bắt buộc' });

  try {
    const pool = await poolPromise;
    if (!pool) return res.status(503).json({ error: 'Cơ sở dữ liệu chưa sẵn sàng!' });
    const orderResult = await pool.request()
      .input('id', sql.INT, orderId)
      .query('SELECT * FROM orders WHERE id = @id');
      
    const order = orderResult.recordset[0];

    if (!order) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    if (order.payment_status === 'Paid') return res.status(400).json({ error: 'Đơn hàng này đã được thanh toán trước đó!' });

    await pool.request()
      .input('gateway', sql.NVARCHAR, payment_gateway)
      .input('id', sql.INT, orderId)
      .query("UPDATE orders SET payment_status = 'Paid', payment_method = @gateway WHERE id = @id");

    res.json({
      success: true,
      message: `Thanh toán thành công qua cổng ${payment_gateway} cho đơn hàng #${orderId}!`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
