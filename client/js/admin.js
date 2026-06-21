let revenueChartInstance = null;
let bookingsChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
});

// Guard admin session
function checkAdminAuth() {
  const token = localStorage.getItem('adminToken');
  const loginView = document.getElementById('admin-login-view');
  const coreView = document.getElementById('admin-core-view');

  if (token) {
    loginView.style.display = 'none';
    coreView.style.display = 'grid';
    
    // Set profile name
    const admin = JSON.parse(localStorage.getItem('adminUser'));
    document.getElementById('admin-profile-name').textContent = admin ? admin.username : 'Administrator';

    // Boot default dashboard metrics
    loadAnalytics();
    fetchBookings();
    fetchUsers();
    fetchDestinations();
    fetchPackages();
    loadDestinationsDropdown();
  } else {
    loginView.style.display = 'flex';
    coreView.style.display = 'none';
  }
}

// Admin Tab Switches
function switchAdminTab(tabId) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.admin-menu li').forEach(m => m.classList.remove('active'));

  document.getElementById(`section-${tabId}`).classList.add('active');
  document.getElementById(`menu-${tabId}`).classList.add('active');

  // Update header text
  const titles = {
    analytics: 'Analytics & Metrics',
    bookings: 'Manage User Reservations',
    users: 'Manage Registered Travelers',
    destinations: 'Manage Tour Destinations',
    packages: 'Manage Tour Packages'
  };
  document.getElementById('current-workspace-title').textContent = titles[tabId] || 'Admin Panel';
}

// Admin Login
async function handleAdminLogin(e) {
  e.preventDefault();

  const emailOrUsername = document.getElementById('admin-user').value;
  const password = document.getElementById('admin-pass').value;

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrUsername, password })
    });
    const json = await res.json();

    if (json.success) {
      showAlert('Admin access granted!', 'success');
      localStorage.setItem('adminToken', json.token);
      localStorage.setItem('adminUser', JSON.stringify(json.admin));
      
      setTimeout(() => {
        checkAdminAuth();
      }, 1000);
    } else {
      showAlert(json.message || 'Access Denied', 'error');
    }
  } catch (err) {
    showAlert('Server connection failed.', 'error');
  }
}

// Admin Sign Out
async function handleAdminLogout() {
  const token = localStorage.getItem('adminToken');
  try {
    await fetch('/api/admin/logout', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  } catch (err) {
    console.error(err);
  }
  
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  showAlert('Signed out of Admin Console', 'success');
  setTimeout(() => {
    checkAdminAuth();
  }, 1000);
}

// Load Analytics & Draw Charts
async function loadAnalytics() {
  const token = localStorage.getItem('adminToken');
  try {
    const res = await fetch('/api/admin/analytics', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const json = await res.json();

    if (json.success) {
      const metrics = json.data;
      
      // Update stats text boards
      document.getElementById('stat-users').textContent = metrics.totalUsers;
      document.getElementById('stat-bookings').textContent = metrics.totalBookings;
      document.getElementById('stat-revenue').textContent = `₹${metrics.totalRevenue}`;
      document.getElementById('stat-pending').textContent = metrics.pendingBookings;

      // 1. Draw Revenue Line Chart
      const months = metrics.monthlyRevenue.map(m => m.month);
      const values = metrics.monthlyRevenue.map(m => m.revenue);

      if (revenueChartInstance) revenueChartInstance.destroy();
      const ctx1 = document.getElementById('revenueChart').getContext('2d');
      revenueChartInstance = new Chart(ctx1, {
        type: 'line',
        data: {
          labels: months,
          datasets: [{
            label: 'Monthly Stream Revenue (₹)',
            data: values,
            borderColor: '#ff7a00',
            backgroundColor: 'rgba(255, 122, 0, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });

      // 2. Draw Bookings Doughnut Chart
      if (bookingsChartInstance) bookingsChartInstance.destroy();
      const ctx2 = document.getElementById('bookingsDoughnut').getContext('2d');
      bookingsChartInstance = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['Confirmed', 'Pending'],
          datasets: [{
            data: [metrics.confirmedBookings, metrics.pendingBookings],
            backgroundColor: ['#2ec4b6', '#ff7a00'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  } catch (err) {
    console.error('Error drawing charts:', err);
  }
}

// Manage User Bookings List
async function fetchBookings() {
  const token = localStorage.getItem('adminToken');
  const tbody = document.getElementById('admin-bookings-table');
  try {
    const res = await fetch('/api/admin/bookings', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const json = await res.json();

    if (json.success) {
      tbody.innerHTML = '';
      if (json.data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No reservation bookings found.</td></tr>`;
        return;
      }

      json.data.forEach(b => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><b>${b.bookingId}</b></td>
          <td>${b.user ? b.user.fullName : 'Guest'}</td>
          <td>${b.destination ? b.destination.name : 'Unknown'}</td>
          <td>₹${b.amount}</td>
          <td><span class="badge badge-${b.status.toLowerCase().replace(/\s+/g, '-')}">${b.status}</span></td>
          <td><span style="font-size:12px; font-weight:600;">${b.trackingStatus}</span></td>
          <td class="actions-cell">
            ${b.status === 'Pending' ? `
              <button onclick="confirmAdminBooking('${b._id}')" class="btn btn-edit" title="Confirm" style="padding:6px; font-size:11px;">Confirm</button>
              <button onclick="rejectAdminBooking('${b._id}')" class="btn btn-delete" title="Cancel" style="padding:6px; font-size:11px;">Reject</button>
            ` : `
              <button onclick="openBookingStatusModal('${b._id}', '${b.status}', '${b.trackingStatus}')" class="btn btn-edit" style="width:fit-content; padding: 6px 10px; font-size: 11px;">Update Milestone</button>
            `}
          </td>
        `;
        tbody.appendChild(row);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

// Quick Actions for Bookings
async function confirmAdminBooking(id) {
  const token = localStorage.getItem('adminToken');
  try {
    const res = await fetch(`/api/admin/bookings/${id}/confirm`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const json = await res.json();
    if (json.success) {
      showAlert('Booking confirmed!');
      fetchBookings();
      loadAnalytics();
    }
  } catch (err) {
    console.error(err);
  }
}

async function rejectAdminBooking(id) {
  if (!confirm('Cancel this booking?')) return;
  const token = localStorage.getItem('adminToken');
  try {
    const res = await fetch(`/api/admin/bookings/${id}/reject`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const json = await res.json();
    if (json.success) {
      showAlert('Booking cancelled successfully');
      fetchBookings();
      loadAnalytics();
    }
  } catch (err) {
    console.error(err);
  }
}

// Update Milestones Tracking status
function openBookingStatusModal(id, status, tracking) {
  document.getElementById('modal-booking-id').value = id;
  document.getElementById('modal-booking-status').value = status;
  document.getElementById('modal-booking-tracking').value = tracking;
  
  document.getElementById('booking-modal').classList.add('active');
}

async function handleUpdateBooking(e) {
  e.preventDefault();
  const id = document.getElementById('modal-booking-id').value;
  const status = document.getElementById('modal-booking-status').value;
  const trackingStatus = document.getElementById('modal-booking-tracking').value;
  const token = localStorage.getItem('adminToken');

  try {
    const res = await fetch(`/api/admin/bookings/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status, trackingStatus })
    });
    const json = await res.json();

    if (json.success) {
      showAlert('Status milestone saved successfully!');
      closeModal('booking-modal');
      fetchBookings();
      loadAnalytics();
    }
  } catch (err) {
    console.error(err);
  }
}

// User Management
async function fetchUsers() {
  const token = localStorage.getItem('adminToken');
  const tbody = document.getElementById('admin-users-table');
  try {
    const res = await fetch('/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const json = await res.json();

    if (json.success) {
      tbody.innerHTML = '';
      json.data.forEach(u => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${u.fullName}</td>
          <td>${u.email}</td>
          <td>${u.phoneNumber}</td>
          <td>${new Date(u.createdAt).toLocaleDateString()}</td>
          <td class="actions-cell">
            <button onclick="deleteAdminUser('${u._id}')" class="action-btn btn-delete">🗑️</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

async function deleteAdminUser(id) {
  if (!confirm('DANGER: Deleting this user will purge all associated bookings, payments, and reviews. Proceed?')) return;
  const token = localStorage.getItem('adminToken');
  try {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const json = await res.json();

    if (json.success) {
      showAlert('User and all associated details deleted clean');
      fetchUsers();
      fetchBookings();
      loadAnalytics();
    }
  } catch (err) {
    console.error(err);
  }
}

// Destination management
async function fetchDestinations() {
  const token = localStorage.getItem('adminToken');
  const tbody = document.getElementById('admin-destinations-table');
  try {
    const res = await fetch('/api/destinations');
    const json = await res.json();

    if (json.success) {
      tbody.innerHTML = '';
      json.data.forEach(d => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><b>${d.name}</b></td>
          <td>${d.country}</td>
          <td>${d.category}</td>
          <td>${d.budgetCategory}</td>
          <td>★ ${d.rating || '0.0'}</td>
          <td class="actions-cell">
            <button onclick="openEditDestinationModal('${d._id}', '${d.name}', '${d.country}', '${d.category}', '${d.budgetCategory}', '${d.images[0]}', '${d.description.replace(/'/g, "\\'")}')" class="action-btn btn-edit">✏️</button>
            <button onclick="deleteDestination('${d._id}')" class="action-btn btn-delete">🗑️</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

function openAddDestinationModal() {
  document.getElementById('dest-modal-title').textContent = 'Add New Destination';
  document.getElementById('modal-dest-id').value = '';
  document.getElementById('destination-form').reset();
  document.getElementById('destination-modal').classList.add('active');
}

function openEditDestinationModal(id, name, country, category, budget, img, desc) {
  document.getElementById('dest-modal-title').textContent = 'Edit Destination';
  document.getElementById('modal-dest-id').value = id;
  document.getElementById('modal-dest-name').value = name;
  document.getElementById('modal-dest-country').value = country;
  document.getElementById('modal-dest-category').value = category;
  document.getElementById('modal-dest-budget').value = budget;
  document.getElementById('modal-dest-img').value = img;
  document.getElementById('modal-dest-desc').value = desc;

  document.getElementById('destination-modal').classList.add('active');
}

async function handleDestinationSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('modal-dest-id').value;
  const name = document.getElementById('modal-dest-name').value;
  const country = document.getElementById('modal-dest-country').value;
  const category = document.getElementById('modal-dest-category').value;
  const budgetCategory = document.getElementById('modal-dest-budget').value;
  const image = document.getElementById('modal-dest-img').value;
  const description = document.getElementById('modal-dest-desc').value;
  
  const token = localStorage.getItem('adminToken');
  const method = id ? 'PUT' : 'POST';
  const url = id ? `/api/destinations/${id}` : '/api/destinations';

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, country, category, budgetCategory, images: [image], description })
    });
    const json = await res.json();

    if (json.success) {
      showAlert(id ? 'Destination updated!' : 'New destination added!');
      closeModal('destination-modal');
      fetchDestinations();
      loadDestinationsDropdown();
    } else {
      showAlert(json.message || 'Error occurred during save', 'error');
    }
  } catch (err) {
    console.error(err);
  }
}

async function deleteDestination(id) {
  if (!confirm('DANGER: Deleting this destination will purge all associated packages, bookings and reviews. Proceed?')) return;
  const token = localStorage.getItem('adminToken');
  try {
    const res = await fetch(`/api/destinations/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const json = await res.json();
    if (json.success) {
      showAlert('Destination deleted');
      fetchDestinations();
      fetchPackages();
      loadDestinationsDropdown();
    }
  } catch (err) {
    console.error(err);
  }
}

// Package management
async function fetchPackages() {
  const token = localStorage.getItem('adminToken');
  const tbody = document.getElementById('admin-packages-table');
  try {
    const res = await fetch('/api/packages');
    const json = await res.json();

    if (json.success) {
      tbody.innerHTML = '';
      json.data.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><b>${p.title}</b></td>
          <td>${p.destination ? p.destination.name : 'Unknown'}</td>
          <td>${p.durationDays} Days / ${p.durationNights} Nights</td>
          <td>₹${p.price}</td>
          <td class="actions-cell">
            <button onclick="openEditPackageModal('${p._id}', '${p.title}', '${p.destination ? p.destination._id : ''}', ${p.durationDays}, ${p.durationNights}, ${p.price}, '${p.images[0]}', '${p.description.replace(/'/g, "\\'")}', '${p.inclusions.join(',')}', '${p.exclusions.join(',')}')" class="action-btn btn-edit">✏️</button>
            <button onclick="deletePackage('${p._id}')" class="action-btn btn-delete">🗑️</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

async function loadDestinationsDropdown() {
  const select = document.getElementById('modal-pkg-dest');
  try {
    const res = await fetch('/api/destinations');
    const json = await res.json();
    if (json.success) {
      select.innerHTML = '<option value="">Select a Destination...</option>';
      json.data.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d._id;
        opt.textContent = `${d.name}, ${d.country}`;
        select.appendChild(opt);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

function openAddPackageModal() {
  document.getElementById('package-modal-title').textContent = 'Add New Tour Package';
  document.getElementById('modal-pkg-id').value = '';
  document.getElementById('package-form').reset();
  document.getElementById('package-modal').classList.add('active');
}

function openEditPackageModal(id, title, destId, days, nights, price, img, desc, inclusions, exclusions) {
  document.getElementById('package-modal-title').textContent = 'Edit Tour Package';
  document.getElementById('modal-pkg-id').value = id;
  document.getElementById('modal-pkg-title').value = title;
  document.getElementById('modal-pkg-dest').value = destId;
  document.getElementById('modal-pkg-days').value = days;
  document.getElementById('modal-pkg-nights').value = nights;
  document.getElementById('modal-pkg-price').value = price;
  document.getElementById('modal-pkg-img').value = img;
  document.getElementById('modal-pkg-desc').value = desc;
  document.getElementById('modal-pkg-inclusions').value = inclusions;
  document.getElementById('modal-pkg-exclusions').value = exclusions;

  document.getElementById('package-modal').classList.add('active');
}

async function handlePackageSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('modal-pkg-id').value;
  const title = document.getElementById('modal-pkg-title').value;
  const destination = document.getElementById('modal-pkg-dest').value;
  const durationDays = document.getElementById('modal-pkg-days').value;
  const durationNights = document.getElementById('modal-pkg-nights').value;
  const price = document.getElementById('modal-pkg-price').value;
  const image = document.getElementById('modal-pkg-img').value;
  const description = document.getElementById('modal-pkg-desc').value;
  
  // Format inclusions and exclusions arrays
  const inclusions = document.getElementById('modal-pkg-inclusions').value.split(',').map(s => s.trim()).filter(s => s);
  const exclusions = document.getElementById('modal-pkg-exclusions').value.split(',').map(s => s.trim()).filter(s => s);

  const token = localStorage.getItem('adminToken');
  const method = id ? 'PUT' : 'POST';
  const url = id ? `/api/packages/${id}` : '/api/packages';

  // Build basic itinerary for newly created package (standard 3 days default template)
  const itinerary = [];
  for (let i = 1; i <= durationDays; i++) {
    itinerary.push({
      day: i,
      title: `Day ${i} Sightseeing & Relax`,
      description: `Enjoy local activities, explore tourist guides recommendations, and delicious local food.`
    });
  }

  const payload = {
    title,
    destination,
    durationDays,
    durationNights,
    price,
    images: [image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800'],
    description,
    inclusions,
    exclusions,
    itinerary
  };

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const json = await res.json();

    if (json.success) {
      showAlert(id ? 'Tour Package updated!' : 'New package added successfully!');
      closeModal('package-modal');
      fetchPackages();
    } else {
      showAlert(json.message || 'Error occurred during save', 'error');
    }
  } catch (err) {
    console.error(err);
  }
}

async function deletePackage(id) {
  if (!confirm('Are you sure you want to delete this package?')) return;
  const token = localStorage.getItem('adminToken');
  try {
    const res = await fetch(`/api/packages/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const json = await res.json();
    if (json.success) {
      showAlert('Package deleted successfully');
      fetchPackages();
    }
  } catch (err) {
    console.error(err);
  }
}

// Modal helper close
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}
