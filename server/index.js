/**
 * Attendance for Blue Collar Workers - Backend (Phase 2)
 * Express API + MySQL
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const workersRouter = require('./routes/workers');
const attendanceRouter = require('./routes/attendance');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  process.env.VITE_API_URL?.replace('/api', ''),
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

app.use('/api/workers', workersRouter);
app.use('/api/attendance', attendanceRouter);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Attendance API' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Attendance API running at http://localhost:${PORT}`);
});
