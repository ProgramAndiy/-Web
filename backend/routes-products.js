const express = require('express');
const router = express.Router();
const { query, get } = require('./db');

// 🛍️ ОТРИМАТИ ВСІ ТОВАРИ
router.get('/', async (req, res) => {
  try {
    const products = await query(`
      SELECT p.*, c.name as category_name 
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.available = 1
      ORDER BY p.id
    `);
    res.json(products);
  } catch (error) {
    console.error('Помилка при отриманні товарів:', error);
    res.status(500).json({ error: 'Помилка при отриманні товарів' });
  }
});

// 📁 ОТРИМАТИ ТОВАРИ ПО КАТЕГОРІЇ
router.get('/category/:categoryKey', async (req, res) => {
  try {
    const { categoryKey } = req.params;
    const products = await query(`
      SELECT p.*, c.name as category_name 
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE c.key = ? AND p.available = 1
      ORDER BY p.name
    `, [categoryKey]);
    res.json(products);
  } catch (error) {
    console.error('Помилка при отриманні товарів:', error);
    res.status(500).json({ error: 'Помилка при отриманні товарів' });
  }
});

// 🔍 ПОШУК ТОВАРІВ
router.get('/search/:q', async (req, res) => {
  try {
    const { q } = req.params;
    const searchTerm = `%${q}%`;
    const products = await query(`
      SELECT p.*, c.name as category_name 
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE (p.name LIKE ? OR p.description LIKE ?) AND p.available = 1
      ORDER BY p.name
    `, [searchTerm, searchTerm]);
    res.json(products);
  } catch (error) {
    console.error('Помилка при пошуку:', error);
    res.status(500).json({ error: 'Помилка при пошуку' });
  }
});

// 📋 ОТРИМАТИ ОДИНОЧНИЙ ТОВАР
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await get(`
      SELECT p.*, c.name as category_name 
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);

    if (!product) {
      return res.status(404).json({ error: 'Товар не знайден' });
    }
    res.json(product);
  } catch (error) {
    console.error('Помилка при отриманні товара:', error);
    res.status(500).json({ error: 'Помилка при отриманні товара' });
  }
});

// 📂 ОТРИМАТИ КАТЕГОРІЇ
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await query('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    console.error('Помилка при отриманні категорій:', error);
    res.status(500).json({ error: 'Помилка при отриманні категорій' });
  }
});

module.exports = router;
