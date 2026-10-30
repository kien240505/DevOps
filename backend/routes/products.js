const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    if (!pool) {
      return res.status(503).json({ error: 'Database connection not available' });
    }
    const { category, brand, search, sort, featured, flashSale, minPrice, maxPrice, minRating } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const request = pool.request();

  if (category && category !== 'All') {
    query += ' AND LOWER(category) = LOWER(@category)';
    request.input('category', sql.NVARCHAR, category);
  }

  if (brand && brand !== 'All') {
    query += ' AND LOWER(brand) = LOWER(@brand)';
    request.input('brand', sql.NVARCHAR, brand);
  }

  if (search) {
    query += ' AND (name LIKE @search OR description LIKE @search OR brand LIKE @search)';
    request.input('search', sql.NVARCHAR, `%${search}%`);
  }

  if (featured === '1') {
    query += ' AND featured = 1';
  }

  if (flashSale === '1' || flashSale === 'true') {
    query += ' AND is_flash_sale = 1';
  }

  if (minRating) {
    query += ' AND rating >= @minRating';
    request.input('minRating', sql.FLOAT, parseFloat(minRating));
  }

  if (minPrice !== undefined && minPrice !== '') {
    query += ' AND price >= @minPrice';
    request.input('minPrice', sql.FLOAT, parseFloat(minPrice));
  }

  if (maxPrice !== undefined && maxPrice !== '') {
    query += ' AND price <= @maxPrice';
    request.input('maxPrice', sql.FLOAT, parseFloat(maxPrice));
  }

  if (sort === 'price-asc') {
    query += ' ORDER BY price ASC';
  } else if (sort === 'price-desc') {
    query += ' ORDER BY price DESC';
  } else if (sort === 'rating') {
    query += ' ORDER BY rating DESC';
  } else if (sort === 'popular' || sort === 'bestseller') {
    query += ' ORDER BY sold_count DESC';
  } else {
    query += ' ORDER BY id DESC';
  }

    const result = await request.query(query);
    const products = result.recordset.map(p => {
      let specs = [];
      let quickSpecs = [];
      let variants = [];
      try {
        specs = p.specs ? (typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs) : [];
      } catch { specs = [p.specs]; }
      try {
        quickSpecs = p.quick_specs ? (typeof p.quick_specs === 'string' ? JSON.parse(p.quick_specs) : p.quick_specs) : [];
      } catch { quickSpecs = []; }
      try {
        variants = p.variants ? (typeof p.variants === 'string' ? JSON.parse(p.variants) : p.variants) : [];
      } catch { variants = []; }

      return {
        ...p,
        brand: p.brand || 'TechNova',
        soldCount: p.sold_count ?? 120,
        ratingCount: p.rating_count ?? 25,
        isFlashSale: Boolean(p.is_flash_sale),
        discountPercent: p.discount_percent || (p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0),
        specs,
        quickSpecs,
        variants
      };
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const pool = await poolPromise;
    if (!pool) return res.status(503).json({ error: 'Cơ sở dữ liệu chưa sẵn sàng!' });
    const result = await pool.request().query('SELECT DISTINCT category FROM products WHERE category IS NOT NULL');
    const categories = ['All', ...result.recordset.map(r => r.category).filter(Boolean)];
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/brands', async (req, res) => {
  try {
    const pool = await poolPromise;
    if (!pool) return res.status(503).json({ error: 'Cơ sở dữ liệu chưa sẵn sàng!' });
    const result = await pool.request().query('SELECT DISTINCT brand FROM products WHERE brand IS NOT NULL');
    const brands = ['All', ...result.recordset.map(r => r.brand).filter(Boolean)];
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/flash-sale', async (req, res) => {
  try {
    const pool = await poolPromise;
    if (!pool) return res.status(503).json({ error: 'Cơ sở dữ liệu chưa sẵn sàng!' });
    const result = await pool.request().query('SELECT * FROM products WHERE is_flash_sale = 1 OR featured = 1 ORDER BY sold_count DESC');
    const products = result.recordset.map(p => {
      let quickSpecs = [];
      try {
        quickSpecs = p.quick_specs ? (typeof p.quick_specs === 'string' ? JSON.parse(p.quick_specs) : p.quick_specs) : [];
      } catch { quickSpecs = []; }
      return {
        ...p,
        brand: p.brand || 'TechNova',
        soldCount: p.sold_count ?? 120,
        ratingCount: p.rating_count ?? 25,
        isFlashSale: true,
        discountPercent: p.discount_percent || (p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 15),
        quickSpecs
      };
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const pool = await poolPromise;
    if (!pool) return res.status(503).json({ error: 'Cơ sở dữ liệu chưa sẵn sàng!' });
    const prodResult = await pool.request()
      .input('id', sql.INT, productId)
      .query('SELECT * FROM products WHERE id = @id');
      
    const product = prodResult.recordset[0];
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let specs = [];
    let quickSpecs = [];
    let variants = [];
    try {
      specs = product.specs ? (typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs) : [];
    } catch { specs = [product.specs]; }
    try {
      quickSpecs = product.quick_specs ? (typeof product.quick_specs === 'string' ? JSON.parse(product.quick_specs) : product.quick_specs) : [];
    } catch { quickSpecs = []; }
    try {
      variants = product.variants ? (typeof product.variants === 'string' ? JSON.parse(product.variants) : product.variants) : [];
    } catch { variants = []; }

    product.specs = specs;
    product.quickSpecs = quickSpecs;
    product.variants = variants;
    product.brand = product.brand || 'TechNova';
    product.soldCount = product.sold_count ?? 120;
    product.ratingCount = product.rating_count ?? 25;
    product.isFlashSale = Boolean(product.is_flash_sale);
    product.discountPercent = product.discount_percent || (product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0);

    const commentsResult = await pool.request()
      .input('id', sql.INT, productId)
      .query('SELECT * FROM comments WHERE product_id = @id ORDER BY id DESC');
      
    const comments = commentsResult.recordset.map(c => {
      let images = [];
      try {
        images = c.images ? (typeof c.images === 'string' ? JSON.parse(c.images) : c.images) : [];
      } catch { images = []; }
      return {
        ...c,
        images,
        variantPurchased: c.variant_purchased || 'Chính hãng TechNova',
        isVerifiedPurchase: c.is_verified_purchase !== 0,
        adminReply: c.admin_reply || null
      };
    });

    res.json({ ...product, comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/comments', async (req, res) => {
  const productId = req.params.id;
  const { author, rating, content, avatar, variantPurchased, isVerifiedPurchase, images, adminReply, userId } = req.body;

  if (!author || !rating || !content) {
    return res.status(400).json({ error: 'Author, rating and content are required' });
  }

  const defaultAvatar = avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(author)}`;
  const imagesJson = JSON.stringify(images || []);

  try {
    const pool = await poolPromise;
    if (!pool) return res.status(503).json({ error: 'Cơ sở dữ liệu chưa sẵn sàng!' });
    const insertResult = await pool.request()
      .input('product_id', sql.INT, productId)
      .input('user_id', sql.INT, userId || null)
      .input('author', sql.NVARCHAR, author)
      .input('avatar', sql.NVARCHAR, defaultAvatar)
      .input('rating', sql.INT, Number(rating))
      .input('content', sql.NVARCHAR, content)
      .input('variant_purchased', sql.NVARCHAR, variantPurchased || 'Bản Tiêu Chuẩn')
      .input('is_verified_purchase', sql.INT, isVerifiedPurchase !== false ? 1 : 0)
      .input('images', sql.NVARCHAR, imagesJson)
      .input('admin_reply', sql.NVARCHAR, adminReply || null)
      .query(`
        INSERT INTO comments (
          product_id, user_id, author, avatar, rating, content, variant_purchased, is_verified_purchase, images, admin_reply
        ) 
        OUTPUT INSERTED.*
        VALUES (
          @product_id, @user_id, @author, @avatar, @rating, @content, @variant_purchased, @is_verified_purchase, @images, @admin_reply
        )
      `);

    const newComment = insertResult.recordset[0];

    const statsResult = await pool.request()
      .input('product_id', sql.INT, productId)
      .query('SELECT AVG(CAST(rating AS FLOAT)) as avgRating, COUNT(*) as commentCount FROM comments WHERE product_id = @product_id');

    if (statsResult.recordset[0]) {
      const newAvg = statsResult.recordset[0].avgRating ? parseFloat(statsResult.recordset[0].avgRating.toFixed(1)) : 5.0;
      const count = statsResult.recordset[0].commentCount || 1;
      await pool.request()
        .input('rating', sql.FLOAT, newAvg)
        .input('rating_count', sql.INT, count)
        .input('product_id', sql.INT, productId)
        .query('UPDATE products SET rating = @rating, rating_count = @rating_count WHERE id = @product_id');
    }

    res.status(201).json({
      ...newComment,
      images: images || [],
      variantPurchased: newComment.variant_purchased,
      isVerifiedPurchase: Boolean(newComment.is_verified_purchase),
      adminReply: newComment.admin_reply
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id/comments/:commentId', verifyToken, async (req, res) => {
  const { id: productId, commentId } = req.params;
  const user = req.user;

  try {
    const pool = await poolPromise;
    if (!pool) return res.status(503).json({ error: 'Cơ sở dữ liệu chưa sẵn sàng!' });
    const commentCheck = await pool.request()
      .input('id', sql.INT, commentId)
      .input('product_id', sql.INT, productId)
      .query('SELECT * FROM comments WHERE id = @id AND product_id = @product_id');

    const comment = commentCheck.recordset[0];
    if (!comment) return res.status(404).json({ error: 'Không tìm thấy bình luận!' });

    if (user.role !== 'admin' && user.fullname !== comment.author) {
      return res.status(403).json({ error: 'Bạn không có quyền xóa bình luận này!' });
    }

    await pool.request()
      .input('id', sql.INT, commentId)
      .query('DELETE FROM comments WHERE id = @id');

    // Recalculate average rating
    const avgResult = await pool.request()
      .input('product_id', sql.INT, productId)
      .query('SELECT AVG(CAST(rating AS FLOAT)) as avgRating FROM comments WHERE product_id = @product_id');

    const newAvg = avgResult.recordset[0].avgRating ? parseFloat(avgResult.recordset[0].avgRating.toFixed(1)) : 5.0;
    await pool.request()
      .input('rating', sql.FLOAT, newAvg)
      .input('product_id', sql.INT, productId)
      .query('UPDATE products SET rating = @rating WHERE id = @product_id');

    res.json({ success: true, message: 'Đã xóa bình luận thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, isAdmin, async (req, res) => {
  const { name, category, price, oldPrice, stock, image, description, specs, featured } = req.body;

  if (!name || !category || !price || !image) {
    return res.status(400).json({ error: 'Name, category, price and image are required' });
  }

  const specsString = Array.isArray(specs) ? JSON.stringify(specs) : (specs ? JSON.stringify([specs]) : JSON.stringify([]));

  try {
    const pool = await poolPromise;
    if (!pool) return res.status(503).json({ error: 'Cơ sở dữ liệu chưa sẵn sàng!' });
    const result = await pool.request()
      .input('name', sql.NVARCHAR, name)
      .input('category', sql.NVARCHAR, category)
      .input('price', sql.FLOAT, Number(price))
      .input('oldPrice', sql.FLOAT, oldPrice ? Number(oldPrice) : null)
      .input('stock', sql.INT, stock !== undefined ? Number(stock) : 10)
      .input('image', sql.NVARCHAR, image)
      .input('description', sql.NVARCHAR, description || '')
      .input('specs', sql.NVARCHAR, specsString)
      .input('featured', sql.INT, featured ? 1 : 0)
      .query(`
        INSERT INTO products (name, category, price, oldPrice, stock, image, description, specs, featured)
        OUTPUT INSERTED.id
        VALUES (@name, @category, @price, @oldPrice, @stock, @image, @description, @specs, @featured)
      `);
      
    res.status(201).json({ id: result.recordset[0].id, message: 'Product created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  const { name, category, price, oldPrice, stock, image, description, specs, featured } = req.body;
  const productId = req.params.id;

  try {
    const pool = await poolPromise;
    if (!pool) return res.status(503).json({ error: 'Cơ sở dữ liệu chưa sẵn sàng!' });
    const existingRes = await pool.request()
      .input('id', sql.INT, productId)
      .query('SELECT * FROM products WHERE id = @id');
    const existing = existingRes.recordset[0];
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const finalName = name !== undefined ? name : existing.name;
    const finalCategory = category !== undefined ? category : existing.category;
    const finalPrice = price !== undefined ? Number(price) : existing.price;
    const finalOldPrice = oldPrice !== undefined ? (oldPrice ? Number(oldPrice) : null) : existing.oldPrice;
    const finalStock = stock !== undefined ? Number(stock) : existing.stock;
    const finalImage = image !== undefined ? image : existing.image;
    const finalDescription = description !== undefined ? description : existing.description;
    const finalSpecs = specs !== undefined ? (Array.isArray(specs) ? JSON.stringify(specs) : (specs ? JSON.stringify([specs]) : JSON.stringify([]))) : existing.specs;
    const finalFeatured = featured !== undefined ? (featured ? 1 : 0) : existing.featured;

    await pool.request()
      .input('name', sql.NVARCHAR, finalName)
      .input('category', sql.NVARCHAR, finalCategory)
      .input('price', sql.FLOAT, finalPrice)
      .input('oldPrice', sql.FLOAT, finalOldPrice)
      .input('stock', sql.INT, finalStock)
      .input('image', sql.NVARCHAR, finalImage)
      .input('description', sql.NVARCHAR, finalDescription)
      .input('specs', sql.NVARCHAR, finalSpecs)
      .input('featured', sql.INT, finalFeatured)
      .input('id', sql.INT, productId)
      .query(`
        UPDATE products SET name = @name, category = @category, price = @price, oldPrice = @oldPrice, 
        stock = @stock, image = @image, description = @description, specs = @specs, featured = @featured
        WHERE id = @id
      `);
      
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  const productId = req.params.id;
  try {
    const pool = await poolPromise;
    if (!pool) return res.status(503).json({ error: 'Cơ sở dữ liệu chưa sẵn sàng!' });
    await pool.request()
      .input('id', sql.INT, productId)
      .query('DELETE FROM products WHERE id = @id');
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
