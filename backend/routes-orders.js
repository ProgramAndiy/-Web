const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { run, query, get } = require('./db');
const { verifyToken } = require('./middleware');

// ➕ СТВОРИТИ ЗАМОВЛЕННЯ
router.post('/create', async (req, res) => {
  try {
    const { 
      user_id, 
      customer_name, 
      customer_email, 
      customer_phone, 
      delivery_city, 
      delivery_street, 
      delivery_apartment,
      delivery_date,
      delivery_comment,
      items,
      subtotal,
      delivery_fee
    } = req.body;

    if (!customer_name || !customer_email || !items || items.length === 0) {
      return res.status(400).json({ error: 'Необхідні всі обов\'язкові поля' });
    }

    const order_number = `ORD-${Date.now()}`;
    const total = subtotal + delivery_fee;

    // Вставити замовлення
    const orderResult = await run(`
      INSERT INTO orders (
        user_id,
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        delivery_city,
        delivery_street,
        delivery_apartment,
        delivery_date,
        delivery_comment,
        subtotal,
        delivery_fee,
        total,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      user_id || null,
      order_number,
      customer_name,
      customer_email,
      customer_phone,
      delivery_city,
      delivery_street,
      delivery_apartment || null,
      delivery_date,
      delivery_comment || null,
      subtotal,
      delivery_fee,
      total,
      'pending'
    ]);

    // Вставити товари замовлення
    for (const item of items) {
      await run(`
        INSERT INTO order_items (
          order_id,
          product_id,
          product_name,
          product_price,
          quantity,
          item_total
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        orderResult.id,
        item.product_id || null,
        item.product_name,
        item.product_price,
        item.quantity,
        item.quantity * item.product_price
      ]);
    }

    res.status(201).json({
      message: 'Замовлення успішно створено',
      order: {
        id: orderResult.id,
        order_number,
        total,
        status: 'pending',
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Помилка при створенні замовлення:', error);
    res.status(500).json({ error: 'Помилка при створенні замовлення' });
  }
});

// 📦 ОТРИМАТИ ЗАМОВЛЕННЯ КОРИСТУВАЧА
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Перевірити що це замовлення свого користувача
    if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ заборонено' });
    }

    const orders = await query(`
      SELECT o.* FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [userId]);

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

// 🔍 ОТРИМАТИ ОДНЕ ЗАМОВЛЕННЯ
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await get(`
      SELECT * FROM orders WHERE id = ?
    `, [orderId]);

    if (!order) {
      return res.status(404).json({ error: 'Замовлення не знайдено' });
    }

    // Отримати товари з замовлення
    const items = await query(`
      SELECT * FROM order_items WHERE order_id = ?
    `, [orderId]);

    order.items = items;

    res.json(order);
  } catch (error) {
    console.error('Помилка при отриманні замовлення:', error);
    res.status(500).json({ error: 'Помилка при отриманні замовлення' });
  }
});

// ✏️ ОНОВИТИ СТАТУС ЗАМОВЛЕННЯ
router.put('/:orderId/status', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Невірний статус' });
    }

    const result = await run(`
      UPDATE orders 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, orderId]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Замовлення не знайдено' });
    }

    const order = await get('SELECT * FROM orders WHERE id = ?', [orderId]);

    res.json({
      message: 'Статус замовлення оновлено',
      order
    });
  } catch (error) {
    console.error('Помилка при оновленні статусу:', error);
    res.status(500).json({ error: 'Помилка при оновленні статусу' });
  }
});

// 📜 ОТРИМАТИ ІСТОРІЮ ЗАМОВЛЕНЬ
router.get('/history/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const orders = await query(`
      SELECT o.* FROM orders o
      WHERE o.customer_email = ?
      ORDER BY o.created_at DESC
      LIMIT 50
    `, [email]);

    // Отримати товари для кожного замовлення
    for (let order of orders) {
      const items = await query(`
        SELECT * FROM order_items WHERE order_id = ?
      `, [order.id]);
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    console.error('Помилка при отриманні історії:', error);
    res.status(500).json({ error: 'Помилка при отриманні історії' });
  }
});

module.exports = router;
