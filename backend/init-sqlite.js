const { db, run } = require('./db');

const initDB = async () => {
  console.log('🚀 Ініціалізація SQLite БД...');

  try {
    // Таблиця КАТЕГОРІЇ
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          emoji TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => err ? reject(err) : resolve());
    });

    // Таблиця КОРИСТУВАЧИ
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          name TEXT NOT NULL,
          phone TEXT,
          role TEXT DEFAULT 'user',
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => err ? reject(err) : resolve());
    });

    // Таблиця ТОВАРИ
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category_id INTEGER NOT NULL REFERENCES categories(id),
          name TEXT NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          emoji TEXT,
          image_url TEXT,
          available INTEGER DEFAULT 1,
          quantity INTEGER DEFAULT 999,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => err ? reject(err) : resolve());
    });

    // Таблиця ЗАМОВЛЕННЯ
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER REFERENCES users(id),
          order_number TEXT UNIQUE NOT NULL,
          customer_name TEXT NOT NULL,
          customer_email TEXT NOT NULL,
          customer_phone TEXT NOT NULL,
          delivery_city TEXT NOT NULL,
          delivery_street TEXT NOT NULL,
          delivery_apartment TEXT,
          delivery_date DATE NOT NULL,
          delivery_comment TEXT,
          subtotal DECIMAL(10, 2) NOT NULL,
          delivery_fee DECIMAL(10, 2) DEFAULT 50,
          total DECIMAL(10, 2) NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => err ? reject(err) : resolve());
    });

    // Таблиця ТОВАРИ В ЗАМОВЛЕННІ
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL REFERENCES orders(id),
          product_id INTEGER REFERENCES products(id),
          product_name TEXT NOT NULL,
          product_price DECIMAL(10, 2) NOT NULL,
          quantity INTEGER NOT NULL CHECK (quantity > 0),
          item_total DECIMAL(10, 2) NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => err ? reject(err) : resolve());
    });

    // Вставити категорії
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT OR IGNORE INTO categories (key, name, emoji) VALUES 
        ('sweet', "Солодкі вироби", '🍰'),
        ('meat', "М''ясні вироби", '🥩'),
        ('bread', "Хліб", '🍞')
      `, (err) => err ? reject(err) : resolve());
    });

    // Вставити товари
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT OR IGNORE INTO products (category_id, name, description, price, emoji) VALUES 
        (1, "Круасан масляний", "Хрустке тісто з вершковим маслом", 28, "🥐"),
        (2, "Пиріг з м''ясом", "Соковита яловичина з цибулею", 65, "🥧"),
        (1, "Шоколадний еклер", "Заварне тісто з кремом", 35, "🍫"),
        (3, "Хліб Львівський", "Житньо-пшеничний хліб", 40, "🍞"),
        (2, "Пирожок з капустою", "Тушкована капуста з курятиною", 32, "🥟"),
        (1, "Медовик", "Класичний медовий торт", 90, "🍯"),
        (1, "Плетінка з маком", "Здобне тісто з маків", 55, "🥨"),
        (2, "Пиріг з печінкою", "Куряча печінка", 58, "🫓"),
        (1, "Булочка Синабон", "Булочка з корицею", 45, "🌀"),
        (3, "Багет французький", "Традиційний багет", 38, "🥖"),
        (1, "Штрудель яблучний", "Листкове тісто з яблуками", 72, "🍎"),
        (2, "Сосиска в тісті", "Свіжа сосиска", 28, "🌭")
      `, (err) => err ? reject(err) : resolve());
    });

    console.log('✅ БД успішно ініціалізована!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Помилка при ініціалізації:', error);
    process.exit(1);
  }
};

initDB();
