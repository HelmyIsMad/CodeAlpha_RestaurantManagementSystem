# Restaurant Management System

A restaurant management system with Express.js backend and vanilla HTML/JS frontend, deployable on Vercel.

## File Structure

```
├── api/
│   └── index.js          Vercel serverless function entry point
├── public/
│   ├── index.html        User-facing homepage (/)
│   ├── app.js            User-facing JavaScript
│   ├── admin.html        Admin panel (/admin)
│   └── admin.js          Admin panel JavaScript
├── src/
│   ├── db.js             PostgreSQL connection pool & table initialization
│   ├── seed.js           Default menu seeding (10 items)
│   ├── middleware/
│   │   └── errorHandler.js  Global error handler
│   └── routes/
│       ├── menu.js          Menu routes
│       ├── orders.js        Order routes
│       ├── reservations.js  Reservation routes
│       └── admin.js         Admin management routes
├── server.js             Local development entry point
├── vercel.json           Vercel deployment configuration
├── .env                  Environment variables (DATABASE_URL)
└── package.json
```

## API Endpoints

### Menu

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | Get all menu items sorted by order |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place an order |
| PATCH | `/api/admin/orders/:id/status` | Accept or reject an order |
| DELETE | `/api/admin/orders/:id` | Delete an order |

### Reservations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reservations` | Create a reservation |
| GET | `/api/reservations/:id` | Get reservation status by ID |
| PATCH | `/api/admin/reservations/:id/status` | Accept or reject a reservation |
| DELETE | `/api/admin/reservations/:id` | Delete a reservation |

### Admin — Menu Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/menu` | Add a menu item |
| PUT | `/api/admin/menu/:id` | Update menu item (name, price, category, sort_order) |
| DELETE | `/api/admin/menu/:id` | Delete a menu item |
| PATCH | `/api/admin/menu/:id/order` | Change sort order of a menu item |

### Admin — Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/orders` | List all orders |
| GET | `/api/admin/reservations` | List all reservations |
| GET | `/api/admin/report` | Generate report (order/reservation counts, item popularity) |

## Frontend Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | User page | View menu, place orders, reserve tables, check reservation status |
| `/admin` | Admin panel | Manage orders/reservations/menu, generate reports |

## Request/Response Examples

### Place an Order

```
POST /api/orders
{
  "customer_name": "John",
  "items": [{ "id": 1, "quantity": 2 }, { "id": 3, "quantity": 1 }]
}
```

### Create a Reservation

```
POST /api/reservations
{
  "customer_name": "John",
  "phone": "123-456-7890",
  "reservation_date": "2026-06-22",
  "reservation_time": "19:00",
  "guests": 4
}
```

### Admin — Update Order Status

```
PATCH /api/admin/orders/1/status
{ "status": "accepted" }
```

### Admin — Add Menu Item

```
POST /api/admin/menu
{
  "name": "New Dish",
  "description": "Tasty new dish",
  "price": 15.99,
  "category": "Main Course"
}
```

### Report Response

```json
{
  "orders": [{ "status": "pending", "count": 3 }, { "status": "accepted", "count": 5 }],
  "total_items_ordered": 15,
  "menu_item_order_counts": [{ "menu_item_id": "1", "times_ordered": 8 }],
  "reservations": [{ "status": "pending", "count": 2 }, { "status": "accepted", "count": 1 }]
}
```


