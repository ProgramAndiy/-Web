-- ═══════════════════════════════════════════════════════════════════════════
-- Сучасна Пекарня - База Даних (PostgreSQL / MySQL)
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────
-- 1. КАТЕГОРІЇ ТОВАРІВ
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  key VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  emoji VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (key, name, emoji) VALUES
('sweet', 'Солодкі вироби', '🍰'),
('meat', 'М\'ясні вироби', '🥩'),
('bread', 'Хліб', '🍞');

-- ─────────────────────────────────────────────────────────────────────────
-- 2. ТОВАРИ
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  emoji VARCHAR(10),
  image_url VARCHAR(500),
  available BOOLEAN DEFAULT true,
  quantity INT DEFAULT 999,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (category_id, name, description, price, emoji) VALUES
(1, 'Круасан масляний', 'Хрустке тісто з вершковим маслом, золотиста скоринка', 28, '🥐'),
(2, 'Пиріг з м\'ясом', 'Соковита яловичина з цибулею в пишному дріжджовому тісті', 65, '🥧'),
(1, 'Шоколадний еклер', 'Заварне тісто, вершковий крем, глазур з чорного шоколаду', 35, '🍫'),
(3, 'Хліб Львівський', 'Житньо-пшеничний хліб на заквасці з кмином та коріандром', 40, '🍞'),
(2, 'Пирожок з капустою', 'Тушкована капуста з курятиною', 32, '🥟'),
(1, 'Медовик', 'Класичний медовий торт з ніжним заварним кремом', 90, '🍯'),
(1, 'Плетінка з маком', 'Здобне плетене тісто з маковою начинкою', 55, '🥨'),
(2, 'Пиріг з печінкою', 'Куряча печінка з морквою і цибулею', 58, '🫓'),
(1, 'Булочка Синабон', 'Американська булочка з корицею та кремом', 45, '🌀'),
(3, 'Багет французький', 'Традиційний білий багет', 38, '🥖'),
(1, 'Штрудель яблучний', 'Листкове тісто з карамельними яблуками', 72, '🍎'),
(2, 'Сосиска в тісті', 'Свіжа свиняча сосиска у здобному тісті', 28, '🌭');

-- ─────────────────────────────────────────────────────────────────────────
-- 3. КОРИСТУВАЧИ
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('user', 'admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Приклад: адміністратор (пароль: admin123)
-- INSERT INTO users (email, password_hash, name, phone, role) VALUES
-- ('admin@suchasna.lviv.ua', 'hashed_password', 'Адміністратор', '+38 0321234567', 'admin');

-- ─────────────────────────────────────────────────────────────────────────
-- 4. АДРЕСИ ДОСТАВКИ
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE delivery_addresses (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  city VARCHAR(100) NOT NULL,
  street VARCHAR(255) NOT NULL,
  building VARCHAR(20),
  apartment VARCHAR(20),
  postal_code VARCHAR(10),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────────────────
-- 5. ЗАМОВЛЕННЯ
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  order_number VARCHAR(20) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  
  -- Адреса доставки
  delivery_city VARCHAR(100) NOT NULL,
  delivery_street VARCHAR(255) NOT NULL,
  delivery_apartment VARCHAR(20),
  delivery_date DATE NOT NULL,
  delivery_comment TEXT,
  
  -- Вартість
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 50,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Статус
  status ENUM('pending', 'confirmed', 'preparing', 'ready', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  
  -- Часові мітки
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────────────────
-- 6. ТОВАРИ В ЗАМОВЛЕННІ
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  item_total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────────────────
-- 7. ПАРТНЕРИ
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE partners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cities TEXT,
  icon VARCHAR(10),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO partners (name, cities, icon) VALUES
('Novus Lviv', 'Львів', '🛒'),
('Silpo', 'Стрий, Трускавець', '🏪'),
('АТБ Маркет', 'Мукачеве, Самбір', '🏬'),
('Auchan', 'Львів (ТРЦ Forum)', '🏢'),
('Gastro Lviv', 'Дрогобич', '🍽️'),
('Metro Cash&Carry', 'Червоноград', '📦');

-- ─────────────────────────────────────────────────────────────────────────
-- 8. КОМАНДА
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  emoji VARCHAR(10),
  bio TEXT,
  photo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO team_members (name, role, emoji) VALUES
('Олена Коваль', 'Шеф-кондитер', '👩‍🍳'),
('Богдан Мельник', 'Майстер-пекар', '👨‍🍳'),
('Ірина Лисак', 'Технолог виробництва', '👩‍💼'),
('Тарас Гнатів', 'Керівник логістики', '🚛');

-- ─────────────────────────────────────────────────────────────────────────
-- 9. ІНДЕКСИ ДЛЯ ОПТИМІЗАЦІЇ
-- ─────────────────────────────────────────────────────────────────────────
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_delivery_addresses_user_id ON delivery_addresses(user_id);

-- ─────────────────────────────────────────────────────────────────────────
-- 10. ЗАПИТИ ДЛЯ ЗВИЧАЙНОГО ВИКОРИСТАННЯ
-- ─────────────────────────────────────────────────────────────────────────

-- Отримати всі замовлення адміна
-- SELECT o.*, COUNT(oi.id) as items_count FROM orders o
-- LEFT JOIN order_items oi ON o.id = oi.order_id
-- GROUP BY o.id ORDER BY o.created_at DESC;

-- Отримати замовлення користувача
-- SELECT o.*, COUNT(oi.id) as items_count FROM orders o
-- LEFT JOIN order_items oi ON o.id = oi.order_id
-- WHERE o.user_id = $1
-- GROUP BY o.id ORDER BY o.created_at DESC;

-- Отримати товари в замовленні
-- SELECT * FROM order_items WHERE order_id = $1;

-- Оновити статус замовлення
-- UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2;
