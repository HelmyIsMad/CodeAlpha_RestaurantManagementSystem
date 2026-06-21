async function apiFetch(url, options) {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function createOrderRow(order) {
  const div = document.createElement('div');
  div.style.border = '1px solid #ccc';
  div.style.margin = '8px 0';
  div.style.padding = '8px';
  div.innerHTML = `
    <strong>Order #${order.id}</strong> - ${order.customer_name} - $${parseFloat(order.total).toFixed(2)} - Status: ${order.status} - ${order.created_at}<br>
    Items: ${JSON.stringify(order.items)}<br>
    <button class="accept-order" data-id="${order.id}">Accept</button>
    <button class="reject-order" data-id="${order.id}">Reject</button>
    <button class="delete-order" data-id="${order.id}">Delete</button>
  `;
  return div;
}

function createReservationRow(res) {
  const div = document.createElement('div');
  div.style.border = '1px solid #ccc';
  div.style.margin = '8px 0';
  div.style.padding = '8px';
  div.innerHTML = `
    <strong>Reservation #${res.id}</strong> - ${res.customer_name} - ${res.reservation_date} ${res.reservation_time} - ${res.guests} guests - Status: ${res.status}<br>
    <button class="accept-reservation" data-id="${res.id}">Accept</button>
    <button class="reject-reservation" data-id="${res.id}">Reject</button>
    <button class="delete-reservation" data-id="${res.id}">Delete</button>
  `;
  return div;
}

document.getElementById('loadOrders').addEventListener('click', async () => {
  try {
    const orders = await apiFetch('/api/admin/orders');
    const container = document.getElementById('ordersList');
    container.innerHTML = '';
    orders.forEach(o => container.appendChild(createOrderRow(o)));
  } catch (err) {
    document.getElementById('ordersList').textContent = 'Error: ' + err.message;
  }
});

document.getElementById('ordersList').addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  try {
    if (e.target.classList.contains('accept-order')) {
      await apiFetch(`/api/admin/orders/${id}/status`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'accepted' })
      });
      document.getElementById('loadOrders').click();
    } else if (e.target.classList.contains('reject-order')) {
      await apiFetch(`/api/admin/orders/${id}/status`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'rejected' })
      });
      document.getElementById('loadOrders').click();
    } else if (e.target.classList.contains('delete-order')) {
      await apiFetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
      document.getElementById('loadOrders').click();
    }
  } catch (err) {
    alert(err.message);
  }
});

document.getElementById('loadReservations').addEventListener('click', async () => {
  try {
    const reservations = await apiFetch('/api/admin/reservations');
    const container = document.getElementById('reservationsList');
    container.innerHTML = '';
    reservations.forEach(r => container.appendChild(createReservationRow(r)));
  } catch (err) {
    document.getElementById('reservationsList').textContent = 'Error: ' + err.message;
  }
});

document.getElementById('reservationsList').addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  try {
    if (e.target.classList.contains('accept-reservation')) {
      await apiFetch(`/api/admin/reservations/${id}/status`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'accepted' })
      });
      document.getElementById('loadReservations').click();
    } else if (e.target.classList.contains('reject-reservation')) {
      await apiFetch(`/api/admin/reservations/${id}/status`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'rejected' })
      });
      document.getElementById('loadReservations').click();
    } else if (e.target.classList.contains('delete-reservation')) {
      await apiFetch(`/api/admin/reservations/${id}`, { method: 'DELETE' });
      document.getElementById('loadReservations').click();
    }
  } catch (err) {
    alert(err.message);
  }
});

document.getElementById('addMenuForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const data = await apiFetch('/api/admin/menu', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        name: document.getElementById('menuName').value,
        description: document.getElementById('menuDesc').value,
        price: parseFloat(document.getElementById('menuPrice').value),
        category: document.getElementById('menuCategory').value,
      })
    });
    document.getElementById('addMenuResult').textContent = `Added item #${data.id}`;
  } catch (err) {
    document.getElementById('addMenuResult').textContent = 'Error: ' + err.message;
  }
});

document.getElementById('editMenuForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const id = document.getElementById('editMenuId').value;
    const body = {};
    const name = document.getElementById('editMenuName').value;
    const price = document.getElementById('editMenuPrice').value;
    const category = document.getElementById('editMenuCategory').value;
    const sort_order = document.getElementById('editMenuOrder').value;
    if (name) body.name = name;
    if (price) body.price = parseFloat(price);
    if (category) body.category = category;
    if (sort_order) body.sort_order = parseInt(sort_order);
    const data = await apiFetch(`/api/admin/menu/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    document.getElementById('editMenuResult').textContent = `Updated item #${data.id}`;
  } catch (err) {
    document.getElementById('editMenuResult').textContent = 'Error: ' + err.message;
  }
});

document.getElementById('deleteMenuBtn').addEventListener('click', async () => {
  const id = document.getElementById('deleteMenuId').value;
  if (!id) return;
  try {
    await apiFetch(`/api/admin/menu/${id}`, { method: 'DELETE' });
    document.getElementById('deleteMenuResult').textContent = 'Deleted';
  } catch (err) {
    document.getElementById('deleteMenuResult').textContent = 'Error: ' + err.message;
  }
});

document.getElementById('loadMenuBtn').addEventListener('click', async () => {
  try {
    const items = await apiFetch('/api/menu');
    const container = document.getElementById('menuList');
    container.innerHTML = '<table border="1"><tr><th>ID</th><th>Name</th><th>Price</th><th>Sort Order</th><th>Category</th></tr>' +
      items.map(i => `<tr><td>${i.id}</td><td>${i.name}</td><td>$${parseFloat(i.price).toFixed(2)}</td><td>${i.sort_order}</td><td>${i.category || ''}</td></tr>`).join('') +
      '</table>';
  } catch (err) {
    document.getElementById('menuList').textContent = 'Error: ' + err.message;
  }
});

document.getElementById('moveOrderBtn').addEventListener('click', async () => {
  const id = document.getElementById('moveOrderId').value;
  const sort_order = document.getElementById('moveOrderPosition').value;
  if (!id || sort_order === '') return;
  try {
    const data = await apiFetch(`/api/admin/menu/${id}/order`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sort_order: parseInt(sort_order) })
    });
    document.getElementById('moveOrderResult').textContent = `Moved item #${data.id} to position ${data.sort_order}`;
  } catch (err) {
    document.getElementById('moveOrderResult').textContent = 'Error: ' + err.message;
  }
});

document.getElementById('reportBtn').addEventListener('click', async () => {
  try {
    const data = await apiFetch('/api/admin/report');
    const container = document.getElementById('reportResult');
    container.innerHTML = `
      <h3>Report</h3>
      <p><strong>Orders:</strong></p>
      <ul>${data.orders.map(o => `<li>${o.status}: ${o.count}</li>`).join('')}</ul>
      <p><strong>Total Items Ordered:</strong> ${data.total_items_ordered}</p>
      <p><strong>Items Ordered Count:</strong></p>
      <ul>${data.menu_item_order_counts.map(m => `<li>Item #${m.menu_item_id}: ${m.times_ordered} times</li>`).join('')}</ul>
      <p><strong>Reservations:</strong></p>
      <ul>${data.reservations.map(r => `<li>${r.status}: ${r.count}</li>`).join('')}</ul>
    `;
  } catch (err) {
    document.getElementById('reportResult').textContent = 'Error: ' + err.message;
  }
});
