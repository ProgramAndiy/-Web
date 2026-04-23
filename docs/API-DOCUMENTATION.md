# Сучасна Пекарня - Backend API Документація

## 📋 Вміст

1. [Встановлення](#встановлення)
2. [Конфігурація](#конфігурація)
3. [Запуск сервера](#запуск-сервера)
4. [API Endpoints](#api-endpoints)
5. [Приклади запитів](#приклади-запитів)

---

## 🛠️ Встановлення

### Вимоги
- Node.js >= 14
- PostgreSQL >= 12
- npm або yarn

### Крок 1: Встановити залежності
```bash
npm install
```

### Крок 2: Налаштувати PostgreSQL
```bash
#創建нову базу даних
createdb sukhasna_bakery

# Або використовуючи psql
psql
CREATE DATABASE sukhasna_bakery;
```

### Крок 3: Розраховувати схему
```bash
psql sukhasna_bakery < database.sql
```

---

## ⚙️ Конфігурація

1. Скопіюйте `.env.example` в `.env`:
```bash
cp .env.example .env
```

2. Відредагуйте `.env` з вашими налаштуваннями:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sukhasna_bakery
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
ADMIN_SECRET_CODE=pekarna_admin_2024
```

---

## 🚀 Запуск сервера

### Режим розробки (з автоперезагрузкою)
```bash
npm run dev
```

### Режим продакшену
```bash
npm start
```

### Ініціалізація бази даних
```bash
npm run init-db
```

Сервер буде запущений на: **http://localhost:5000**

---

## 📡 API Endpoints

### 👤 Користувачі
- `POST /api/users/register` - Реєстрація
- `POST /api/users/login` - Вход
- `GET /api/users/profile` - Отримати профіль (потребує токен)
- `PUT /api/users/profile` - Оновити профіль (потребує токен)

### 📦 Товари
- `GET /api/products` - Отримати всі товари
- `GET /api/products/:id` - Отримати товар по ID
- `GET /api/products/category/:categoryKey` - Отримати товари по категорії
- `GET /api/products/search/query/:q` - Пошук товарів
- `GET /api/products/categories/all` - Отримати категорії

### 🛒 Замовлення
- `POST /api/orders/create` - Створити замовлення
- `GET /api/orders/:orderId` - Отримати замовлення
- `GET /api/orders/user/:userId` - Отримати замовлення користувача (потребує токен)
- `PUT /api/orders/:orderId/status` - Оновити статус (потребує токен)
- `GET /api/orders/history/:email` - Отримати історію замовлень

### 👑 Адміністратор
- `GET /api/admin/orders` - Отримати всі замовлення (потребує адмін)
- `GET /api/admin/statistics` - Отримати статистику (потребує адмін)
- `GET /api/admin/users` - Отримати користувачів (потребує адмін)
- `PUT /api/admin/users/:userId/deactivate` - Деактивувати користувача (потребує адмін)
- `GET /api/admin/report/date-range` - Отримати звіт по датам (потребує адмін)

---

## 💡 Приклади запитів

### 1. Реєстрація користувача
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Іван Франко",
    "email": "ivan@example.com",
    "password": "password123",
    "phone": "+38 093 000 0000"
  }'
```

**Відповідь:**
```json
{
  "message": "Користувач успішно зареєстрований",
  "user": {
    "id": 1,
    "email": "ivan@example.com",
    "name": "Іван Франко",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 2. Вход (Користувач)
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ivan@example.com",
    "password": "password123"
  }'
```

### 3. Вход (Адміністратор)
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ivan@example.com",
    "password": "password123",
    "adminCode": "pekarna_admin_2024"
  }'
```

### 4. Отримати всі товари
```bash
curl http://localhost:5000/api/products
```

### 5. Пошук товарів
```bash
curl http://localhost:5000/api/products/search/query/круасан
```

### 6. Створити замовлення
```bash
curl -X POST http://localhost:5000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "customer_name": "Іван Франко",
    "customer_email": "ivan@example.com",
    "customer_phone": "+38 093 000 0000",
    "delivery_city": "Львів",
    "delivery_street": "вул. Городоцька 56",
    "delivery_apartment": "12",
    "delivery_date": "2024-01-15",
    "delivery_comment": "Позвоните за 30 минут",
    "items": [
      {
        "product_id": 1,
        "product_name": "Круасан масляний",
        "product_price": 28,
        "quantity": 2
      }
    ],
    "subtotal": 56,
    "delivery_fee": 50
  }'
```

### 7. Отримати замовлення користувача
```bash
curl -X GET http://localhost:5000/api/orders/user/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 8. Отримати статистику (Адміністратор)
```bash
curl -X GET http://localhost:5000/api/admin/statistics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 9. Дістати всі замовлення (Адміністратор)
```bash
curl -X GET "http://localhost:5000/api/admin/orders?status=pending&limit=50" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 10. Оновити статус замовлення 
```bash
curl -X PUT http://localhost:5000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "confirmed"
  }'
```

---

## 🔐 Авторизація

### Використання JWT токена
Додайте заголовок к всіх захищених запитам:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Ролі доступу
- **user** - Звичайний користувач (може переглядати свої замовлення)
- **admin** - Адміністратор (може переглядати всі замовлення та статистику)

---

## 📊 Статуси замовлень
- `pending` - Очікування підтвердження
- `confirmed` - Підтверджено
- `preparing` - Готується
- `ready` - Готово до відправлення
- `shipped` - Відправлено
- `delivered` - Доставлено
- `cancelled` - Скасовано

---

## 🐛 Логування помилок
Всі помилки логуються в консоль для зручності налагодження.

---

## 📝 Ліцензія
MIT
