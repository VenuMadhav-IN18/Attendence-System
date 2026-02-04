import { useState, useEffect } from 'react';
import { workersApi, attendanceApi, todayStr } from '../api';

export default function MarkAttendance() {
  const [date, setDate] = useState(todayStr());
  const [workers, setWorkers] = useState([]);
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = '') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const loadWorkers = async () => {
    try {
      const list = await workersApi.list();
      setWorkers(list);
    } catch (e) {
      showToast(e.message || 'Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  const loadDay = async () => {
    if (!date) return;
    try {
      const records = await attendanceApi.byDate(date);
      const next = {};
      workers.forEach((w) => { next[w.id] = null; });
      records.forEach((r) => { next[r.workerId] = r.status; });
      setState(next);
    } catch {
      const next = {};
      workers.forEach((w) => { next[w.id] = null; });
      setState(next);
    }
  };

  useEffect(() => { loadWorkers(); }, []);
  useEffect(() => { if (workers.length) loadDay(); }, [date, workers.length]);

  const setStatus = (workerId, status) => {
    setState((s) => ({ ...s, [workerId]: status }));
  };

  const save = async () => {
    if (!date) { showToast('Select a date'); return; }
    setSaving(true);
    try {
      const entries = workers
        .filter((w) => state[w.id])
        .map((w) => ({ workerId: w.id, status: state[w.id] }));
      await attendanceApi.save(date, entries);
      showToast('Attendance saved.', 'success');
      loadDay();
    } catch (e) {
      showToast(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="empty-state">Loading…</p>;

  return (
    <section className="panel">
      <div className="date-bar">
        <label htmlFor="attendance-date">Date</label>
        <input
          id="attendance-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="button" className="btn-secondary" onClick={() => setDate(todayStr())}>
          Today
        </button>
      </div>
      <div className="attendance-list" style={{ padding: '0.5rem', marginBottom: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
        {workers.length === 0 ? (
          <p className="empty-state">Add workers in the Workers tab first.</p>
        ) : (
          workers.map((w) => (
            <div
              key={w.id}
              className="attendance-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div>
                <span style={{ fontWeight: 500 }}>{w.name}</span>
                {w.role && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{w.role}</span>}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className={'toggle present' + (state[w.id] === 'present' ? ' active' : '')}
                  style={{
                    padding: '0.4rem 0.9rem',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    background: state[w.id] === 'present' ? 'var(--success)' : 'var(--surface-hover)',
                    color: state[w.id] === 'present' ? '#fff' : 'var(--text-muted)',
                  }}
                  onClick={() => setStatus(w.id, 'present')}
                >
                  Present
                </button>
                <button
                  type="button"
                  className={'toggle absent' + (state[w.id] === 'absent' ? ' active' : '')}
                  style={{
                    padding: '0.4rem 0.9rem',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    background: state[w.id] === 'absent' ? 'var(--absent)' : 'var(--surface-hover)',
                    color: state[w.id] === 'absent' ? '#fff' : 'var(--text-muted)',
                  }}
                  onClick={() => setStatus(w.id, 'absent')}
                >
                  Absent
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="actions">
        <button type="button" className="btn-primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save Attendance'}
        </button>
      </div>
      {toast && (
        <div className={'toast' + (toast.type ? ' ' + toast.type : '')}>
          {toast.msg}
        </div>
      )}
    </section>
  );
}
