require('dotenv').config();
const app = require('./api/index');
const { testConnection } = require('./src/db');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await testConnection();
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to database:', err.message);
    process.exit(1);
  }
}

start();
