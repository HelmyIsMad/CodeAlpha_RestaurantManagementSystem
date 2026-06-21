const { Router } = require('express');
const { pool } = require('../db');

const router = Router();

router.get('/orders', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.patch('/orders/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be accepted or rejected' });
    }
    const result = await pool.query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/orders/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    next(err);
  }
});

router.get('/reservations', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM reservations ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.patch('/reservations/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be accepted or rejected' });
    }
    const result = await pool.query('UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Reservation not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/reservations/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM reservations WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Reservation not found' });
    res.json({ message: 'Reservation deleted' });
  } catch (err) {
    next(err);
  }
});

router.post('/menu', async (req, res, next) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'name and price are required' });
    }
    const result = await pool.query(
      'INSERT INTO menu_items (name, description, price, category) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/menu/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, sort_order } = req.body;
    const result = await pool.query(
      `UPDATE menu_items SET name = COALESCE($1, name), description = COALESCE($2, description),
       price = COALESCE($3, price), category = COALESCE($4, category), sort_order = COALESCE($5, sort_order)
       WHERE id = $6 RETURNING *`,
      [name, description, price, category, sort_order, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Menu item not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/menu/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM menu_items WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Menu item not found' });
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    next(err);
  }
});

router.patch('/menu/:id/order', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sort_order } = req.body;
    if (sort_order === undefined) {
      return res.status(400).json({ error: 'sort_order is required' });
    }
    const result = await pool.query('UPDATE menu_items SET sort_order = $1 WHERE id = $2 RETURNING *', [sort_order, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Menu item not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.get('/report', async (req, res, next) => {
  try {
    const orderStats = await pool.query(
      `SELECT status, COUNT(*)::int AS count FROM orders GROUP BY status`
    );
    const reservationStats = await pool.query(
      `SELECT status, COUNT(*)::int AS count FROM reservations GROUP BY status`
    );
    const totalItemsOrdered = await pool.query(
      `SELECT SUM((item->>'quantity')::int) AS total FROM orders, jsonb_array_elements(items) AS item`
    );
    const menuItemCounts = await pool.query(
      `SELECT item->>'id' AS menu_item_id, COUNT(*)::int AS times_ordered
       FROM orders, jsonb_array_elements(items) AS item
       GROUP BY item->>'id'`
    );
    res.json({
      orders: orderStats.rows,
      total_items_ordered: parseInt(totalItemsOrdered.rows[0].total) || 0,
      menu_item_order_counts: menuItemCounts.rows,
      reservations: reservationStats.rows,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
