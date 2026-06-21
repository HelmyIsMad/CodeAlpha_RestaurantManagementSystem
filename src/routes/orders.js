const { Router } = require('express');
const { pool } = require('../db');

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { customer_name, items } = req.body;
    if (!customer_name || !items || !items.length) {
      return res.status(400).json({ error: 'customer_name and items are required' });
    }
    const itemIds = items.map(i => i.id);
    const menuResult = await pool.query('SELECT id, price FROM menu_items WHERE id = ANY($1)', [itemIds]);
    const priceMap = {};
    menuResult.rows.forEach(r => { priceMap[r.id] = parseFloat(r.price); });
    let total = 0;
    for (const item of items) {
      const qty = item.quantity || 1;
      total += (priceMap[item.id] || 0) * qty;
    }
    const result = await pool.query(
      'INSERT INTO orders (customer_name, items, total) VALUES ($1, $2, $3) RETURNING *',
      [customer_name, JSON.stringify(items), total]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
