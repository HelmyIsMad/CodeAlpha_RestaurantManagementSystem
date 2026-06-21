async function loadMenu() {
  const res = await fetch('/api/menu');
  const items = await res.json();
  const container = document.getElementById('menu');
  const orderItemsDiv = document.getElementById('orderItems');

  container.innerHTML = '<table border="1"><tr><th>Name</th><th>Description</th><th>Price</th><th>Category</th></tr>' +
    items.map(i => `<tr><td>${i.name}</td><td>${i.description || ''}</td><td>$${parseFloat(i.price).toFixed(2)}</td><td>${i.category || ''}</td></tr>`).join('') +
    '</table>';

  orderItemsDiv.innerHTML = items.map(i => `
    <label><input type="checkbox" value="${i.id}" class="order-item"> ${i.name} ($${parseFloat(i.price).toFixed(2)})
    Qty: <input type="number" class="qty" data-id="${i.id}" value="1" min="1" style="width:50px"></label><br>
  `).join('');
}

document.getElementById('orderForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('orderName').value;
  const checked = document.querySelectorAll('.order-item:checked');
  const items = Array.from(checked).map(cb => ({
    id: parseInt(cb.value),
    quantity: parseInt(document.querySelector(`.qty[data-id="${cb.value}"]`).value) || 1,
  }));
  if (items.length === 0) return alert('Select at least one item');
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_name: name, items }),
  });
  const data = await res.json();
  document.getElementById('orderResult').textContent = res.ok
    ? `Order #${data.id} placed! Total: $${parseFloat(data.total).toFixed(2)}`
    : `Error: ${data.error}`;
});

document.getElementById('reservationForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {
    customer_name: document.getElementById('resName').value,
    phone: document.getElementById('resPhone').value,
    reservation_date: document.getElementById('resDate').value,
    reservation_time: document.getElementById('resTime').value,
    guests: parseInt(document.getElementById('resGuests').value),
  };
  const res = await fetch('/api/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  document.getElementById('reservationResult').textContent = res.ok
    ? `Reservation #${data.id} created! Status: ${data.status}`
    : `Error: ${data.error}`;
});

document.getElementById('searchResBtn').addEventListener('click', async () => {
  const id = document.getElementById('searchResId').value;
  if (!id) return alert('Enter a reservation ID');
  const res = await fetch(`/api/reservations/${id}`);
  const data = await res.json();
  document.getElementById('searchResult').textContent = res.ok
    ? `Reservation #${data.id} - Name: ${data.customer_name}, Date: ${data.reservation_date}, Time: ${data.reservation_time}, Guests: ${data.guests}, Status: ${data.status}`
    : `Error: ${data.error}`;
});

loadMenu();
