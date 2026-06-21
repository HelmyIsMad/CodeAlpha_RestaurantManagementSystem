const { Router } = require('express');
const { pool } = require('../db');

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { customer_name, phone, reservation_date, reservation_time, guests } = req.body;
    if (!customer_name || !reservation_date || !reservation_time || !guests) {
      return res.status(400).json({ error: 'customer_name, reservation_date, reservation_time, and guests are required' });
    }
    const result = await pool.query(
      'INSERT INTO reservations (customer_name, phone, reservation_date, reservation_time, guests) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [customer_name, phone, reservation_date, reservation_time, guests]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM reservations WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
