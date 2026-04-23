const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_secret_key_here_pekarna_2024';

// Middleware для перевірки JWT токена
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Токен не знайдено' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Невірний токен' });
    }
    req.user = user;
    next();
  });
};

// Middleware для перевірки ролі адміна
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Доступ заборонено. Потрібні права адміністратора' });
  }
  next();
};

module.exports = { verifyToken, isAdmin };
