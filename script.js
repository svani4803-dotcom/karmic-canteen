// Unified script for Employee and Admin pages
const STORAGE_KEY = 'canteenOrders';

// placeOrder — used on employee.html
function placeOrder() {
    const nameEl = document.getElementById('employeeName');
    const name = nameEl ? nameEl.value.trim() : '';

    if (!name) {
        alert('Please enter your name.');
        return;
    }

    const wantBreakfast = document.querySelector('input[name="wantBreakfast"]:checked');
    const wantLunch = document.querySelector('input[name="wantLunch"]:checked');
    const wantSnacks = document.querySelector('input[name="wantSnacks"]:checked');

    if (!wantBreakfast || !wantLunch || !wantSnacks) {
        alert('Please answer all yes/no questions for Breakfast, Lunch and Snacks.');
        return;
    }

    const order = {
        employee: name,
        breakfast: wantBreakfast.value === 'yes',
        lunch: wantLunch.value === 'yes',
        snacks: wantSnacks.value === 'yes',
        timestamp: Date.now()
    };

    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    orders.push(order);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));

    alert(`Order placed successfully for ${name}!`);
    showEmployeeOrders();
}

// showEmployeeOrders — populates #orderList on employee page
function showEmployeeOrders() {
    const list = document.getElementById('orderList');
    if (!list) return;

    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    list.innerHTML = '';

    if (orders.length === 0) {
        list.innerHTML = '<li>No orders placed yet.</li>';
        return;
    }

    orders.forEach(o => {
        const li = document.createElement('li');
        li.textContent = `${o.employee} - Breakfast: ${o.breakfast ? 'Yes' : 'No'}, Lunch: ${o.lunch ? 'Yes' : 'No'}, Snacks: ${o.snacks ? 'Yes' : 'No'}`;
        list.appendChild(li);
    });
}

// showAdminOrders — builds admin table with counts
function showAdminOrders() {
    const tbody = document.getElementById('orderSummary');
    if (!tbody) return;

    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    tbody.innerHTML = '';

    if (orders.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="3">No orders placed yet</td>';
        tbody.appendChild(tr);
        return;
    }

    // Count yes/no for each meal type
    const counts = {
        Breakfast: { Yes: 0, No: 0 },
        Lunch: { Yes: 0, No: 0 },
        Snacks: { Yes: 0, No: 0 }
    };

    orders.forEach(o => {
        counts.Breakfast[o.breakfast ? 'Yes' : 'No']++;
        counts.Lunch[o.lunch ? 'Yes' : 'No']++;
        counts.Snacks[o.snacks ? 'Yes' : 'No']++;
    });

    // Append rows: Meal Type | Item(Yes/No) | Count
    for (const meal of ['Breakfast', 'Lunch', 'Snacks']) {
        for (const ans of ['Yes', 'No']) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${meal}</td><td>${ans}</td><td>${counts[meal][ans]}</td>`;
            tbody.appendChild(tr);
        }
    }
}

// clearOrders — removes storage and refreshes both pages
function clearOrders() {
    if (!confirm('Clear all orders?')) return;
    localStorage.removeItem(STORAGE_KEY);
    alert('All orders cleared.');
    showEmployeeOrders();
    showAdminOrders();
}

// Initialization
window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('orderSummary')) {
        showAdminOrders();
        // add clear button if not present
        if (!document.getElementById('clearOrdersBtn')) {
            const btn = document.createElement('button');
            btn.id = 'clearOrdersBtn';
            btn.textContent = 'Clear All Orders';
            btn.style.marginTop = '10px';
            btn.addEventListener('click', clearOrders);
            document.body.appendChild(btn);
        }
    }

    if (document.getElementById('orderList')) {
        showEmployeeOrders();
    }
});