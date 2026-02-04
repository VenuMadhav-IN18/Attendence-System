import 'dotenv/config';


import express, { json } from 'express';
import cors from 'cors';

import workersRouter from './routes/workers.js';
import attendanceRouter from './routes/attendance.js';


const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allowed frontend origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://attendence-system-kohl.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow server-to-server, Postman, curl
    if (!origin) return callback(null, true);

    // allow all vercel preview domains
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // allow known origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log('❌ CORS blocked:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// IMPORTANT
app.options('*', cors());


// ✅ Body parser
app.use(json());

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
