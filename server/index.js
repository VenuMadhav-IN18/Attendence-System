const express = require('express');
const cors = require('cors');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://attendence-system-kohl.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
app.use(express.json());

app.use('/api/workers', workersRouter);
app.use('/api/attendance', attendanceRouter);
