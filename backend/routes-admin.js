const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { query, get, run } = require('./db');
const { verifyToken, isAdmin } = require('./middleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `product-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Дозволені лише зображення'));
  }
});

// 📦 ОТРИМАТИ ВСІ ЗАМОВЛЕННЯ (ЛИШЕ АДМІН)
router.get('/orders', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let queryStr = 'SELECT o.* FROM orders o WHERE 1=1';
    const params = [];

    if (status) {
      queryStr += ' AND o.status = ?';
      params.push(status);
    }

    queryStr += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit));
    params.push(parseInt(offset));

    const orders = await query(queryStr, params);

    // Отримати товари для кожного замовлення
    for (let order of orders) {
      const items = await query(`
        SELECT * FROM order_items WHERE order_id = ?
      `, [order.id]);
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    console.error('Помилка при отриманні замовлень:', error);
    res.status(500).json({ error: 'Помилка при отриманні замовлень' });
  }
});

// 📊 ОТРИМАТИ СТАТИСТИКУ (ЛИШЕ АДМІН)
router.get('/statistics', verifyToken, isAdmin, async (req, res) => {
  try {
    // Загальна кількість замовлень
    const ordersCountResult = await get(`
      SELECT COUNT(*) as total FROM orders
    `);

    // Загальна сума
    const totalRevenueResult = await get(`
      SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != 'cancelled'
    `);

    // Замовлення по статусам
    const ordersByStatus = await query(`
      SELECT status, COUNT(*) as count FROM orders GROUP BY status
    `);

    // Найпопулярніші товари
    const topProducts = await query(`
      SELECT 
        oi.product_name,
        SUM(oi.quantity) as total_quantity,
        COALESCE(SUM(oi.item_total), 0) as total_revenue
      FROM order_items oi
      GROUP BY oi.product_name
      ORDER BY total_quantity DESC
      LIMIT 10
    `);

    // Останні замовлення
    const recentOrders = await query(`
      SELECT o.id, o.order_number, o.customer_name, o.total, o.status, o.created_at 
      FROM orders o
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    const usersCountResult   = await get(`SELECT COUNT(*) as total FROM users`);
    const productsCountResult = await get(`SELECT COUNT(*) as total FROM products WHERE available = 1`);

    res.json({
      total_orders:    ordersCountResult?.total    || 0,
      total_revenue:   totalRevenueResult?.total   || 0,
      total_users:     usersCountResult?.total     || 0,
      total_products:  productsCountResult?.total  || 0,
      orders_by_status: ordersByStatus,
      top_products:    topProducts,
      recent_orders:   recentOrders
    });
  } catch (error) {
    console.error('Помилка при отриманні статистики:', error);
    res.status(500).json({ error: 'Помилка при отриманні статистики' });
  }
});

// 👥 ОТРИМАТИ ВСІ КОРИСТУВАЧІ (ЛИШЕ АДМІН)
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await query(`
      SELECT id, email, name, phone, role, is_active, created_at FROM users ORDER BY created_at DESC
    `);
    res.json(users);
  } catch (error) {
    console.error('Помилка при отриманні користувачів:', error);
    res.status(500).json({ error: 'Помилка при отриманні користувачів' });
  }
});

// 🚫 ДЕАКТИВУВАТИ КОРИСТУВАЧА (ЛИШЕ АДМІН)
router.put('/users/:userId/deactivate', verifyToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await run(`
      UPDATE users SET is_active = 0 WHERE id = ?
    `, [userId]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Користувач не знайден' });
    }

    const user = await get('SELECT id, email, name FROM users WHERE id = ?', [userId]);

    res.json({
      message: 'Користувача деактивовано',
      user
    });
  } catch (error) {
    console.error('Помилка при деактивації:', error);
    res.status(500).json({ error: 'Помилка при деактивації користувача' });
  }
});

// 📈 ОТРИМАТИ ЗВІТ ПО ДАТАМ (ЛИШЕ АДМІН)
router.get('/report/date-range', verifyToken, isAdmin, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const results = await query(`
      SELECT 
        DATE(o.created_at) as date,
        COUNT(o.id) as orders_count,
        COALESCE(SUM(o.total), 0) as total_revenue,
        COALESCE(AVG(o.total), 0) as avg_order_value
      FROM orders o
      WHERE DATE(o.created_at) >= ? AND DATE(o.created_at) <= ?
      GROUP BY DATE(o.created_at)
      ORDER BY date DESC
    `, [start_date, end_date]);

    res.json(results);
  } catch (error) {
    console.error('Помилка при отриманні звіту:', error);
    res.status(500).json({ error: 'Помилка при отриманні звіту' });
  }
});

// ➕ ДОДАТИ НОВИЙ ТОВАР (ЛИШЕ АДМІН)
router.post('/products', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Заповніть обов\'язкові поля: name, price, category' });
    }

    const categoryRecord = await get(`SELECT id FROM categories WHERE key = ?`, [category]);
    if (!categoryRecord) {
      return res.status(400).json({ error: 'Категорія не знайдена' });
    }

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await run(`
      INSERT INTO products (category_id, name, price, description, image_url, available)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [categoryRecord.id, name, price, description || null, image_url, 1]);

    res.json({
      message: 'Товар додано успішно',
      product: { id: result.id, image_url }
    });
  } catch (error) {
    console.error('Помилка при додаванні товару:', error);
    res.status(500).json({ error: 'Помилка при додаванні товару' });
  }
});

// ✏️ РЕДАГУВАТИ ТОВАР (ЛИШЕ АДМІН)
router.put('/products/:productId', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, price, category, description, available } = req.body;

    const updates = [];
    const params = [];

    if (name !== undefined)        { updates.push('name = ?');        params.push(name); }
    if (price !== undefined)       { updates.push('price = ?');       params.push(price); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (available !== undefined)   { updates.push('available = ?');   params.push(available ? 1 : 0); }
    if (req.file)                  { updates.push('image_url = ?');   params.push(`/uploads/${req.file.filename}`); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Не передано полів для оновлення' });
    }

    params.push(productId);
    const result = await run(`UPDATE products SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, params);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Товар не знайден' });
    }

    const updated = await get('SELECT * FROM products WHERE id = ?', [productId]);
    res.json({ message: 'Товар оновлено', product: updated });
  } catch (error) {
    console.error('Помилка при редагуванні товару:', error);
    res.status(500).json({ error: 'Помилка при редагуванні товару' });
  }
});

// 🗑️ ВИДАЛИТИ ТОВАР (ЛИШЕ АДМІН)
router.delete('/products/:productId', verifyToken, isAdmin, async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await run(`
      DELETE FROM products WHERE id = ?
    `, [productId]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Товар не знайден' });
    }

    res.json({
      message: 'Товар видалено',
      product_id: productId
    });
  } catch (error) {
    console.error('Помилка при видаленні товару:', error);
    res.status(500).json({ error: 'Помилка при видаленні товару' });
  }
});

module.exports = router;
