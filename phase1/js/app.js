/**
 * Attendance for Blue Collar Workers - Phase 1
 * Uses localStorage; will be replaced by API in Phase 2.
 */

const STORAGE_WORKERS = 'attendance_workers';
const STORAGE_RECORDS = 'attendance_records';

// ----- Data helpers -----
function getWorkers() {
  const raw = localStorage.getItem(STORAGE_WORKERS);
  return raw ? JSON.parse(raw) : [];
}

function setWorkers(workers) {
  localStorage.setItem(STORAGE_WORKERS, JSON.stringify(workers));
}

function getRecords() {
  const raw = localStorage.getItem(STORAGE_RECORDS);
  return raw ? JSON.parse(raw) : [];
}

function setRecords(records) {
  localStorage.setItem(STORAGE_RECORDS, JSON.stringify(records));
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// ----- UI: Tabs -----
document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
    tab.classList.add('active');
    const id = tab.getAttribute('data-tab');
    document.getElementById(id).classList.add('active');
    if (id === 'mark') renderAttendancePanel();
    if (id === 'workers') renderWorkersPanel();
    if (id === 'records') renderRecordsPanel();
  });
});

// ----- Workers -----
function addWorker(name, role, wage) {
  const workers = getWorkers();
  const id = 'w_' + Date.now();
  workers.push({ id, name: name.trim(), role: (role || '').trim(), dailyWage: wage ? parseFloat(wage) : null });
  setWorkers(workers);
  renderWorkersPanel();
  renderAttendancePanel();
  populateFilterWorker();
  showToast('Worker added.', 'success');
}

document.getElementById('worker-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('worker-name').value;
  const role = document.getElementById('worker-role').value;
  const wage = document.getElementById('worker-wage').value;
  if (!name.trim()) return;
  addWorker(name, role, wage);
  e.target.reset();
});

function removeWorker(id) {
  const workers = getWorkers().filter((w) => w.id !== id);
  setWorkers(workers);
  renderWorkersPanel();
  renderAttendancePanel();
  populateFilterWorker();
  showToast('Worker removed.');
}

function renderWorkersPanel() {
  const list = document.getElementById('workers-list');
  const workers = getWorkers();
  if (workers.length === 0) {
    list.innerHTML = '<p class="empty-state">No workers yet. Add one above.</p>';
    return;
  }
  list.innerHTML = workers
    .map(
      (w) =>
        `<div class="worker-row" data-id="${w.id}">
          <div class="info">
            <span class="name">${escapeHtml(w.name)}</span>
            ${w.role ? `<span class="role">${escapeHtml(w.role)}</span>` : ''}
          </div>
          ${w.dailyWage != null ? `<span class="wage">₹${w.dailyWage}</span>` : ''}
          <button type="button" class="remove" data-id="${w.id}">Remove</button>
        </div>`
    )
    .join('');
  list.querySelectorAll('button.remove').forEach((btn) => {
    btn.addEventListener('click', () => removeWorker(btn.getAttribute('data-id')));
  });
}

// ----- Mark Attendance -----
let currentDayState = {}; // workerId -> 'present' | 'absent'

function renderAttendancePanel() {
  const dateInput = document.getElementById('attendance-date');
  if (!dateInput.value) dateInput.value = todayStr();
  const workers = getWorkers();
  const listEl = document.getElementById('attendance-list');
  const date = dateInput.value;
  const records = getRecords();
  const dayRecords = records.filter((r) => r.date === date);

  currentDayState = {};
  dayRecords.forEach((r) => {
    currentDayState[r.workerId] = r.status;
  });
  workers.forEach((w) => {
    if (currentDayState[w.id] == null) currentDayState[w.id] = null;
  });

  if (workers.length === 0) {
    listEl.innerHTML = '<p class="empty-state">Add workers in the Workers tab first.</p>';
    return;
  }

  listEl.innerHTML = workers
    .map(
      (w) => {
        const status = currentDayState[w.id];
        return `<div class="attendance-item" data-id="${w.id}">
          <div>
            <span class="name">${escapeHtml(w.name)}</span>
            ${w.role ? `<span class="role">${escapeHtml(w.role)}</span>` : ''}
          </div>
          <div class="toggle-group">
            <button type="button" class="toggle present ${status === 'present' ? 'active' : ''}" data-status="present">Present</button>
            <button type="button" class="toggle absent ${status === 'absent' ? 'active' : ''}" data-status="absent">Absent</button>
          </div>
        </div>`;
      }
    )
    .join('');

  listEl.querySelectorAll('.attendance-item').forEach((row) => {
    const workerId = row.getAttribute('data-id');
    row.querySelectorAll('.toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const status = btn.getAttribute('data-status');
        currentDayState[workerId] = status;
        row.querySelectorAll('.toggle').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });
}

document.getElementById('attendance-date').addEventListener('change', renderAttendancePanel);
document.getElementById('btn-today').addEventListener('click', () => {
  document.getElementById('attendance-date').value = todayStr();
  renderAttendancePanel();
});

document.getElementById('btn-save-attendance').addEventListener('click', () => {
  const date = document.getElementById('attendance-date').value;
  if (!date) {
    showToast('Please select a date.');
    return;
  }
  const workers = getWorkers();
  let records = getRecords().filter((r) => r.date !== date);
  workers.forEach((w) => {
    const status = currentDayState[w.id];
    if (status) {
      records.push({ date, workerId: w.id, workerName: w.name, workerRole: w.role, status });
    }
  });
  setRecords(records);
  showToast('Attendance saved.', 'success');
  renderRecordsPanel();
});

// ----- Records -----
function populateFilterWorker() {
  const select = document.getElementById('filter-worker');
  const workers = getWorkers();
  const current = select.value;
  select.innerHTML = '<option value="">All workers</option>' + workers.map((w) => `<option value="${w.id}">${escapeHtml(w.name)}</option>`).join('');
  if (workers.some((w) => w.id === current)) select.value = current;
}

function renderRecordsPanel() {
  let records = getRecords();
  const dateFrom = document.getElementById('filter-date-from').value;
  const dateTo = document.getElementById('filter-date-to').value;
  const workerId = document.getElementById('filter-worker').value;

  if (dateFrom) records = records.filter((r) => r.date >= dateFrom);
  if (dateTo) records = records.filter((r) => r.date <= dateTo);
  if (workerId) records = records.filter((r) => r.workerId === workerId);

  records.sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return (a.workerName || '').localeCompare(b.workerName || '');
  });

  const tbody = document.getElementById('records-body');
  if (records.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-cell">No records. Mark attendance to see data.</td></tr>';
  } else {
    tbody.innerHTML = records
      .map(
        (r) =>
          `<tr>
            <td>${r.date}</td>
            <td>${escapeHtml(r.workerName || '-')}</td>
            <td>${escapeHtml(r.workerRole || '-')}</td>
            <td class="status-${r.status}">${r.status === 'present' ? 'Present' : 'Absent'}</td>
          </tr>`
      )
      .join('');
  }

  const present = records.filter((r) => r.status === 'present').length;
  const absent = records.filter((r) => r.status === 'absent').length;
  document.getElementById('summary').textContent = `Showing ${records.length} record(s) — Present: ${present}, Absent: ${absent}.`;
}

document.getElementById('btn-filter').addEventListener('click', renderRecordsPanel);

// Populate worker filter when records panel is first used
document.getElementById('filter-worker').addEventListener('focus', () => {
  if (document.getElementById('filter-worker').options.length <= 1) populateFilterWorker();
});

// ----- Init -----
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showToast(message, type = '') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.className = 'toast' + (type ? ' ' + type : '');
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

// Set default date and load
document.getElementById('attendance-date').value = todayStr();
renderAttendancePanel();
renderWorkersPanel();
populateFilterWorker();
renderRecordsPanel();
