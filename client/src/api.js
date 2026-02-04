/**
 * API client for Attendance backend (Phase 2).
 * Vite proxy forwards /api to backend in dev.
 * In production, use VITE_API_URL environment variable.
 */
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api'; // Dev: use proxy
  // If VITE_API_URL doesn't end with /api, add it
  if (envUrl.endsWith('/api')) return envUrl;
  return `${envUrl}/api`;
};

const BASE = getBaseUrl();

async function request(path, options = {}) {
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = cleanPath.startsWith('http') ? cleanPath : `${BASE}${cleanPath}`;
  
  console.log('API Request:', url, options.method || 'GET'); // Debug log
  
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  
  console.log('API Response:', res.status, res.statusText); // Debug log
  
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('API Error:', res.status, data); // Debug log
    throw new Error(data.error || res.statusText || 'Request failed');
  }
  return data;
}

export const workersApi = {
  list: async () => {
    const result = await request('/workers');
    return Array.isArray(result) ? result : [];
  },
  get: (id) => request(`/workers/${id}`),
  create: (body) => request('/workers', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/workers/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/workers/${id}`, { method: 'DELETE' }),
};

export const attendanceApi = {
  list: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const result = await request(`/attendance${q ? '?' + q : ''}`);
    return Array.isArray(result) ? result : [];
  },
  byDate: async (date) => {
    const result = await request(`/attendance/by-date/${date}`);
    return Array.isArray(result) ? result : [];
  },
  save: (date, entries) => request('/attendance/save', {
    method: 'POST',
    body: JSON.stringify({ date, entries }),
  }),
};

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
