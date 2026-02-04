/**
 * MySQL connection config.
 * Set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE in .env or environment.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

module.exports = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'StrongPass123!',
  database: process.env.MYSQL_DATABASE || 'attendance_blue_collar',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};
