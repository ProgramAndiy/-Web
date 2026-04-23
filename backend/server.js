require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const pool = require('./db');

// Import routes
const usersRoutes = require('./routes-users');
const productsRoutes = require('./routes-products');
const ordersRoutes = require('./routes-orders');
const adminRoutes = require('./routes-admin');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── STATIC FILES ─────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── REQUEST LOGGING ───────────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// ─── HEALTH CHECK ──────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Сучасна Пекарня Backend API' });
});

// ─── DATABASE CONNECTION TEST ─────────────────────────────────────────────
app.get('/db-check', async (req, res) => {
  try {
    const { get } = require('./db');
    const result = await get("SELECT datetime('now') as time");
    res.json({ status: 'Connected', time: result.time });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// ─── API ROUTES ────────────────────────────────────────────────────────────
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);

// ─── SPA FALLBACK (для React Router) ───────────────────────────────────────
// Будь-яка невідома маршрута повертає index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ─── ERROR HANDLER ─────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── START SERVER ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║     Сучасна Пекарня - Backend API Server                  ║
╠════════════════════════════════════════════════════════════╣
║  🚀 Сервер запущений на http://localhost:${PORT}           
║  📦 API dokumentacija: http://localhost:${PORT}/api/      
║  ✅ Статус: Готово                                        
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n📛 Вимикаємо сервер...');
  process.exit(0);
});