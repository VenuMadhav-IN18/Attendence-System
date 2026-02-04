require('dotenv').config();

const express = require('express');
const cors = require('cors');

const workersRouter = require('./routes/workers').default;
const attendanceRouter = require('./routes/attendance').default;

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allowed frontend origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://attendence-system-kohl.vercel.app'
];

// ✅ CORS middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Handle preflight requests
app.options('*', cors());

// ✅ Body parser
app.use(express.json());

// ✅ Routes
app.use('/api/workers', workersRouter);
app.use('/api/attendance', attendanceRouter);

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Attendance API running' });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
