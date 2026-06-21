const { pool } = require('./db');

const defaultMenu = [
  { name: 'Margherita Pizza', description: 'Classic tomato, mozzarella, and basil', price: 12.99, category: 'Main Course', sort_order: 1 },
  { name: 'Pepperoni Pizza', description: 'Pepperoni, mozzarella, and tomato sauce', price: 14.99, category: 'Main Course', sort_order: 2 },
  { name: 'Caesar Salad', description: 'Romaine lettuce, croutons, parmesan, Caesar dressing', price: 9.99, category: 'Salad', sort_order: 3 },
  { name: 'Grilled Chicken Sandwich', description: 'Grilled chicken breast with lettuce and tomato', price: 11.99, category: 'Main Course', sort_order: 4 },
  { name: 'Spaghetti Bolognese', description: 'Spaghetti with rich meat sauce', price: 13.99, category: 'Pasta', sort_order: 5 },
  { name: 'French Fries', description: 'Crispy golden french fries', price: 4.99, category: 'Sides', sort_order: 6 },
  { name: 'Cheeseburger', description: 'Beef patty with cheddar cheese and toppings', price: 10.99, category: 'Main Course', sort_order: 7 },
  { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center', price: 6.99, category: 'Dessert', sort_order: 8 },
  { name: 'Lemonade', description: 'Fresh squeezed lemonade', price: 3.99, category: 'Beverage', sort_order: 9 },
  { name: 'Iced Tea', description: 'Refreshing iced tea', price: 2.99, category: 'Beverage', sort_order: 10 },
];

async function seedMenu() {
  const result = await pool.query('SELECT COUNT(*)::int AS count FROM menu_items');
  if (result.rows[0].count < 10) {
    const existing = await pool.query('SELECT name FROM menu_items');
    const existingNames = existing.rows.map(r => r.name);
    const toInsert = defaultMenu.filter(item => !existingNames.includes(item.name));
    if (toInsert.length > 0) {
      for (const item of toInsert) {
        await pool.query(
          'INSERT INTO menu_items (name, description, price, category, sort_order) VALUES ($1, $2, $3, $4, $5)',
          [item.name, item.description, item.price, item.category, item.sort_order]
        );
      }
      console.log(`Seeded ${toInsert.length} menu items`);
    }
  }
}

module.exports = { seedMenu };
