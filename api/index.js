const express = require('express');
const cors = require('cors');
const path = require('path');
const { initTables } = require('../src/db');
const { seedMenu } = require('../src/seed');

const menuRoutes = require('../src/routes/menu');
const orderRoutes = require('../src/routes/orders');
const reservationRoutes = require('../src/routes/reservations');
const adminRoutes = require('../src/routes/admin');
const errorHandler = require('../src/middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

let initialized = false;

app.use('/api', async (req, res, next) => {
  if (initialized) return next();
  try {
    await initTables();
    await seedMenu();
    initialized = true;
    next();
  } catch (err) {
    console.error('DB init failed:', err);
    res.status(500).json({ error: 'Database initialization failed' });
  }
});

app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(errorHandler);

module.exports = app;
