const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, role, daily_wage AS dailyWage, created_at AS createdAt FROM workers ORDER BY name'
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, role, dailyWage } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO workers (name, role, daily_wage) VALUES (?, ?, ?)',
      [name.trim(), (role || '').trim(), dailyWage != null ? parseFloat(dailyWage) : null]
    );
    const [rows] = await db.query(
      'SELECT id, name, role, daily_wage AS dailyWage, created_at AS createdAt FROM workers WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, role, daily_wage AS dailyWage, created_at AS createdAt FROM workers WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Worker not found' });
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, role, dailyWage } = req.body;
    const id = req.params.id;
    await db.query(
      'UPDATE workers SET name = COALESCE(?, name), role = COALESCE(?, role), daily_wage = ? WHERE id = ?',
      [name != null ? name.trim() : null, role != null ? (role || '').trim() : null, dailyWage != null ? parseFloat(dailyWage) : null, id]
    );
    const [rows] = await db.query(
      'SELECT id, name, role, daily_wage AS dailyWage, created_at AS createdAt FROM workers WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Worker not found' });
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM workers WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Worker not found' });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

module.exports = router;
