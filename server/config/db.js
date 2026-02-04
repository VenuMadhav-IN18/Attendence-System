/**
 * MySQL connection config.
 * Set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE in .env or environment.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

export const host = process.env.MYSQL_HOST || 'localhost';
export const user = process.env.MYSQL_USER || 'root';
export const password = process.env.MYSQL_PASSWORD || 'StrongPass123!';
export const database = process.env.MYSQL_DATABASE || 'attendance_blue_collar';
export const waitForConnections = true;
export const connectionLimit = 10;
export const queueLimit = 0;
