/**
 * API client for Attendance backend (Phase 2).
 * Vite proxy forwards /api to backend in dev.
 * In production, use VITE_API_URL environment variable.
 */
const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText || 'Request failed');
  return data;
}

export const workersApi = {
  list: () => request('/workers'),
  get: (id) => request(`/workers/${id}`),
  create: (body) => request('/workers', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/workers/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/workers/${id}`, { method: 'DELETE' }),
};

export const attendanceApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/attendance${q ? '?' + q : ''}`);
  },
  byDate: (date) => request(`/attendance/by-date/${date}`),
  save: (date, entries) => request('/attendance/save', {
    method: 'POST',
    body: JSON.stringify({ date, entries }),
  }),
};

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
