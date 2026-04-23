const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { get, run } = require('./db');
const { verifyToken } = require('./middleware');

const JWT_SECRET = 'your_secret_key_here_pekarna_2024';
const JWT_EXPIRY = '7d';

// 📝 РЕЄСТРАЦІЯ
router.post('/register', async (req, res) => {
  const { email, password, name, phone, adminCode } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Все поля обов\'язкові' });
  }

  if (adminCode && adminCode !== 'admin_26') {
    return res.status(403).json({ error: 'Невірний код адміністратора' });
  }

  const role = adminCode === 'admin_26' ? 'admin' : 'user';

  try {
    const existing = await get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({ error: 'Користувач з таким email вже існує' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await run(
      'INSERT INTO users (email, password_hash, name, phone, role) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, phone || '', role]
    );

    const token = jwt.sign(
      { id: result.id, email, role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.json({
      message: 'Реєстрація успішна',
      token,
      user: { id: result.id, email, name, role }
    });
  } catch (error) {
    console.error('Помилка реєстрації:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

// 🔑 ВХІД
router.post('/login', async (req, res) => {
  const { email, password, adminCode } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email і пароль обов\'язкові' });
  }

  try {
    // Пошук користувача
    const user = await get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      return res.status(401).json({ error: 'Невірні email або пароль' });
    }

    // Перевірка пароля
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Невірні email або пароль' });
    }

    let userRole = user.role;

    // Перевірка адміністраторського кода
    if (adminCode) {
      if (adminCode !== 'admin_26') {
        return res.status(403).json({ error: 'Невірний код адміністратора' });
      }
      userRole = 'admin';
      // Оновити роль у БД
      await run('UPDATE users SET role = ? WHERE id = ?', ['admin', user.id]);
    }

    // Генерація токена
    const token = jwt.sign(
      { id: user.id, email: user.email, role: userRole },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.json({
      message: 'Вхід успішний',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: userRole
      }
    });
  } catch (error) {
    console.error('Помилка входа:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

// 👤 ПРОФІЛЬ КОРИСТУВАЧА (з авторизацією)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await get('SELECT id, email, name, phone, role, created_at FROM users WHERE id = ?', [req.user.id]);

    if (!user) {
      return res.status(404).json({ error: 'Користувач не знайден' });
    }

    res.json(user);
  } catch (error) {
    console.error('Помилка при отриманні профілю:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

// ✏️ ОНОВЛЕННЯ ПРОФІЛЮ
router.put('/profile', verifyToken, async (req, res) => {
  const { name, phone } = req.body;

  try {
    const result = await run(
      'UPDATE users SET name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name || '', phone || '', req.user.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Користувач не знайден' });
    }

    const updatedUser = await get('SELECT id, email, name, phone, role FROM users WHERE id = ?', [req.user.id]);
    res.json({ message: 'Профіль оновлен', user: updatedUser });
  } catch (error) {
    console.error('Помилка при оновленні профілю:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

module.exports = router;
