# 🥐 Сучасна Пекарня - Полова Система (Frontend + Backend)

Сучасна Пекарня - це повнофункціональна система управління пекарнею з можливістю замовлення випічки онлайн.

## 📁 Структура проекту

```
практика/
├── Frontend (React):
│   ├── index.html           # Основний HTML файл
│   ├── index.js             # React компоненти
│   ├── styles.css           # Стилі
│   ├── agent.js             # AI помічник
│   └── agent.html           # HTML для помічника
│
├── Backend (Node.js/Express):
│   ├── server.js            # Основний серверний файл
│   ├── db.js                # PostgreSQL підключення
│   ├── middleware.js        # Middleware для аутентифікації
│   ├── routes-users.js      # API по користувачам
│   ├── routes-products.js   # API по товарам
│   ├── routes-orders.js     # API по замовленнях
│   ├── routes-admin.js      # API для адміністратора
│   ├── package.json         # NPM залежності
│   ├── .env.example         # Приклад .env файлу
│   └── scripts-initDB.js    # Ініціалізація БД
│
├── Database (PostgreSQL):
│   ├── database.sql         # SQL схема
│   └── database-mongodb-schema.json  # MongoDB schemy (альтернатива)
│
└── Документація:
    ├── API-DOCUMENTATION.md # API документація
    └── README.md            # Цей файл
```

---

## 🚀 Швидкий старт

### Вимоги
- Node.js >= 14
- PostgreSQL >= 12
- npm або yarn

### 1️⃣ Встановити залежності

```bash
cd практика
npm install
```

### 2️⃣ Налаштувати базу даних

#### PostgreSQL встановлення (якщо ще не встановлено)

**Windows (через Chocolatey):**
```bash
choco install postgresql
```

**macOS (через Homebrew):**
```bash
brew install postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install postgresql postgresql-contrib
```

#### Створити базу даних

```bash
# Запустити PostgreSQL
psql

# Усередину psql:
CREATE DATABASE sukhasna_bakery;
\q
```

### 3️⃣ Налаштувати .env файл

```bash
# Скопіюйте приклад конфігурації
cp .env.example .env

# Відредагуйте .env своїми даними (не забудьте своїй пароль для БД)
```

### 4️⃣ Ініціалізувати БД

```bash
npm run init-db
```

### 5️⃣ Запустити сервер

```bash
# Режим розробки (з автоперезагрузкою)
npm run dev

# Або режим продакшену
npm start
```

✅ Сервер буде доступний на: **http://localhost:5000**

### 6️⃣ Запустити Frontend

Просто відкрийте `index.html` у браузері або використовуйте локальний HTTP сервер:

```bash
# Python 3
python -m http.server 8000

# Або Node.js
npx http-server
```

Потім відкрийте: **http://localhost:8000**

---

## 🎯 Основні功能

### For Users (Користувачі)
✅ Реєстрація та вход  
✅ Перегляд товарів  
✅ Додавання до кошика  
✅ Створення замовлень  
✅ Перегляд історії замовлень  
✅ Редагування профіля  
✅ Чат с AI помічником  

### For Admins (Адміністратори)
✅ Перегляд всіх замовлень  
✅ Оновлення статусу замовлень  
✅ Статистика та звіти  
✅ Управління користувачами  
✅ Перегляд популярних товарів  
✅ Аналіз доходу  

---

## 📡 API Endpoints

### Користувачи
```
POST   /api/users/register     - Реєстрація
POST   /api/users/login        - Вход
GET    /api/users/profile      - Отримати профіль
PUT    /api/users/profile      - Оновити профіль
```

### Товари
```
GET    /api/products           - Всі товари
GET    /api/products/:id       - Товар по ID
GET    /api/products/category/:key - По категорії
GET    /api/products/search/query/:q - Пошук
```

### Замовлення
```
POST   /api/orders/create      - Створити
GET    /api/orders/:id         - Отримати
GET    /api/orders/user/:userId - Замовлення користувача
PUT    /api/orders/:id/status  - Оновити статус
```

### Адміністратор
```
GET    /api/admin/orders       - Всі замовлення
GET    /api/admin/statistics   - Статистика
GET    /api/admin/users        - Користувачи
GET    /api/admin/report/date-range - Звіти
```

Детальна документація: [API-DOCUMENTATION.md](./API-DOCUMENTATION.md)

---

## 🗄️ Структура БД

### Таблиці PostgreSQL
- **users** - Користувачи
- **categories** - Категорії товарів
- **products** - Товари
- **orders** - Замовлення
- **order_items** - Товари в замовленнях
- **delivery_addresses** - Адреси доставки
- **partners** - Партнери
- **team_members** - Команда

[Детальна схема БД](./database.sql)

---

## 🔐 Безпека

- JWT токени для аутентифікації
- Bcrypt для хешування паролів
- Helmet.js для безпеки заголовків
- CORS налаштування
- Захищені маршрути адміна

---

## 💻 Технологічний стек

### Frontend
- React 18
- Babel для transpilation
- CSS3
- No build tools (простий setup)

### Backend
- Node.js + Express
- PostgreSQL
- JWT для аутентифікаціі
- Bcryptjs для паролів
- CORS + Helmet

---

## 🐛 Розв'язування проблем

### PostgreSQL не з'єднується
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
✅ Впевніться що PostgreSQL запущений:
```bash
# Windows
net start postgresql-x64-15

# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Port 5000 уже займаний
```bash
# Змініть PORT в .env файлі
PORT=5001
```

### БД не ініціалізована
```bash
npm run init-db
```

---

## 📊 Тестові дані

Після ініціалізації БД у вас будуть:
- 12 товарів у 3 категоріях
- 4 партнери
- 4 члена команди

### Тестовий адміністратор
```
Email: admin@suchasna.lviv.ua
Password: admin123
Admin Code: pekarna_admin_2024
```

---

## 📝 Заначення по статусам замовлень

| Статус | Опис |
|--------|------|
| pending | Очікування підтвердження |
| confirmed | Підтверджено |
| preparing | Готується |
| ready | Готово до висилки |
| shipped | Відправлено |
| delivered | Доставлено |
| cancelled | Скасовано |

---

## 🎓 Приклади використання

### cURL приклади

**Реєстрація:**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Іван","email":"ivan@test.com","password":"123456"}'
```

**Отримати товари:**
```bash
curl http://localhost:5000/api/products
```

**Створити замовлення:**
```bash
curl -X POST http://localhost:5000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{...}' # Див. API документацію
```

---

## 🤝 Contribution

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📄 Ліцензія

MIT License - вільно використовуйте для своїх проектів!

---

## 📞 Контакти

- Email: hello@suchasna.lviv.ua
- Instagram: @sukhasna_bakery
- Telegram: @sukhasna_bakery

---

