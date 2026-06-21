const { Router } = require('express');
const { pool } = require('../db');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM menu_items ORDER BY sort_order');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
