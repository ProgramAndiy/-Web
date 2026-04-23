require('dotenv').config();
const pool = require('../db');
const fs = require('fs');
const path = require('path');

const initDB = async () => {
  try {
    console.log('🚀 Ініціалізація бази даних...');

    // Читати SQL файл
    const sqlPath = path.join(__dirname, '../database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Виконати SQL
    await pool.query(sql);

    console.log('✅ База даних успішно ініціалізована!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Помилка при ініціалізації:', error);
    process.exit(1);
  }
};

initDB();
