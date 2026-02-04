import { useState, useEffect } from 'react';
import { workersApi } from '../api';

export default function Workers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ name: '', role: '', dailyWage: '' });

  const showToast = (msg, type = '') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const load = async () => {
    try {
      const list = await workersApi.list();
      setWorkers(list);
    } catch (e) {
      showToast(e.message || 'Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      await workersApi.create({
        name: form.name.trim(),
        role: form.role.trim() || undefined,
        dailyWage: form.dailyWage ? parseFloat(form.dailyWage) : null,
      });
      setForm({ name: '', role: '', dailyWage: '' });
      showToast('Worker added.', 'success');
      load();
    } catch (e) {
      showToast(e.message || 'Failed to add worker');
    }
  };

  const remove = async (id) => {
    if (!confirm('Remove this worker? Their attendance history will remain.')) return;
    try {
      await workersApi.delete(id);
      showToast('Worker removed.');
      load();
    } catch (e) {
      showToast(e.message || 'Failed to remove');
    }
  };

  if (loading) return <p className="empty-state">Loading…</p>;

  return (
    <section className="panel">
      <form onSubmit={handleSubmit} className="worker-form" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3>Add Worker</h3>
        <div className="form-row" style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            style={{ flex: 1, minWidth: '120px', padding: '0.6rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg)', color: 'var(--text)' }}
          />
          <input
            type="text"
            placeholder="Role (e.g. Mason, Painter)"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            style={{ flex: 1, minWidth: '120px', padding: '0.6rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg)', color: 'var(--text)' }}
          />
        </div>
        <div className="form-row" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="number"
            placeholder="Daily wage (optional)"
            min="0"
            step="0.01"
            value={form.dailyWage}
            onChange={(e) => setForm((f) => ({ ...f, dailyWage: e.target.value }))}
            style={{ flex: 1, minWidth: '120px', padding: '0.6rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg)', color: 'var(--text)' }}
          />
          <button type="submit" className="btn-primary">Add Worker</button>
        </div>
      </form>
      <div className="workers-list" style={{ overflow: 'hidden' }}>
        {workers.length === 0 ? (
          <p className="empty-state">No workers yet. Add one above.</p>
        ) : (
          workers.map((w) => (
            <div
              key={w.id}
              className="worker-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div className="info">
                <span className="name" style={{ fontWeight: 500 }}>{w.name}</span>
                {w.role && <span className="role" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{w.role}</span>}
              </div>
              {w.dailyWage != null && <span className="wage" style={{ color: 'var(--success)' }}>₹{w.dailyWage}</span>}
              <button
                type="button"
                className="remove"
                onClick={() => remove(w.id)}
                style={{ padding: '0.35rem 0.75rem', background: 'transparent', border: '1px solid var(--absent)', color: 'var(--absent)', borderRadius: 'var(--radius)', fontSize: '0.85rem' }}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
      {toast && <div className={'toast' + (toast.type ? ' ' + toast.type : '')}>{toast.msg}</div>}
    </section>
  );
}
