import { Router } from 'express';
const router = Router();
import { query } from '../db';

router.get('/', async (req, res, next) => {
  try {
    const { dateFrom, dateTo, workerId } = req.query;
    let sql = `
      SELECT a.id, a.date, a.worker_id AS workerId, a.status, a.created_at AS createdAt,
             w.name AS workerName, w.role AS workerRole
      FROM attendance a
      JOIN workers w ON w.id = a.worker_id
      WHERE 1=1
    `;
    const params = [];
    if (dateFrom) { sql += ' AND a.date >= ?'; params.push(dateFrom); }
    if (dateTo) { sql += ' AND a.date <= ?'; params.push(dateTo); }
    if (workerId) { sql += ' AND a.worker_id = ?'; params.push(workerId); }
    sql += ' ORDER BY a.date DESC, w.name';
    const [rows] = await query(sql, params);
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

router.get('/by-date/:date', async (req, res, next) => {
  try {
    const [rows] = await query(
      `SELECT a.worker_id AS workerId, a.status, w.name AS workerName, w.role AS workerRole
       FROM attendance a
       JOIN workers w ON w.id = a.worker_id
       WHERE a.date = ?
       ORDER BY w.name`,
      [req.params.date]
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

router.post('/save', async (req, res, next) => {
  try {
    const { date, entries } = req.body;
    if (!date || !Array.isArray(entries)) {
      return res.status(400).json({ error: 'date and entries array required' });
    }
    await query('DELETE FROM attendance WHERE date = ?', [date]);
    for (const e of entries) {
      if (e.workerId && (e.status === 'present' || e.status === 'absent')) {
        await query(
          'INSERT INTO attendance (date, worker_id, status) VALUES (?, ?, ?)',
          [date, e.workerId, e.status]
        );
      }
    }
    const [rows] = await query(
      `SELECT a.id, a.date, a.worker_id AS workerId, a.status, w.name AS workerName, w.role AS workerRole
       FROM attendance a JOIN workers w ON w.id = a.worker_id WHERE a.date = ? ORDER BY w.name`,
      [date]
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

export default router;
