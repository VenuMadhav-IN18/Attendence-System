import { useState, useEffect } from 'react';
import { attendanceApi, workersApi } from '../api';

export default function Records() {
  const [records, setRecords] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [filters, setFilters] = useState({ dateFrom: '', dateTo: '', workerId: '' });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast({ msg });
    setTimeout(() => setToast(null), 2500);
  };

  const loadWorkers = async () => {
    try {
      const list = await workersApi.list();
      setWorkers(list);
    } catch {
      setWorkers([]);
    }
  };

  const loadRecords = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;
      if (filters.workerId) params.workerId = filters.workerId;
      const list = await attendanceApi.list(params);
      setRecords(list);
    } catch (e) {
      showToast(e.message || 'Failed to load records');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadWorkers(); }, []);
  useEffect(() => { loadRecords(); }, [filters.dateFrom, filters.dateTo, filters.workerId]);

  const present = records.filter((r) => r.status === 'present').length;
  const absent = records.filter((r) => r.status === 'absent').length;

  return (
    <section className="panel">
      <div className="filters" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
          title="From date"
          style={{ padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)', color: 'var(--text)' }}
        />
        <span>to</span>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
          title="To date"
          style={{ padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)', color: 'var(--text)' }}
        />
        <select
          value={filters.workerId}
          onChange={(e) => setFilters((f) => ({ ...f, workerId: e.target.value }))}
          style={{ padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)', color: 'var(--text)' }}
        >
          <option value="">All workers</option>
          {workers.map((w) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
      </div>
      <div className="records-table-wrap" style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: '1rem' }}>
        <table className="records-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--surface)' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: 'var(--surface-hover)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Date</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: 'var(--surface-hover)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Worker</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: 'var(--surface-hover)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Role</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: 'var(--surface-hover)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan="4" className="empty-state">No records. Mark attendance to see data.</td></tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>{r.date}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{r.workerName || '-'}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{r.workerRole || '-'}</td>
                  <td style={{ padding: '0.75rem 1rem' }} className={r.status === 'present' ? 'status-present' : 'status-absent'}>
                    {r.status === 'present' ? 'Present' : 'Absent'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="summary" style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
        Showing {records.length} record(s) — Present: {present}, Absent: {absent}.
      </div>
      {toast && <div className="toast">{toast.msg}</div>}
    </section>
  );
}
