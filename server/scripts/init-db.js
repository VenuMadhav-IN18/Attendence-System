/**
 * Initialize MySQL database and tables.
 * Run: node server/scripts/init-db.js
 * Ensure MySQL is running and credentials in .env are correct.
 */
import { createConnection } from 'mysql2/promise';
import { join } from 'path';
require('dotenv').config({ path: join(__dirname, '../../.env') });

const config = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  multipleStatements: true,
};

async function run() {
  let conn;
  try {
    conn = await createConnection(config);
    const dbName = process.env.MYSQL_DATABASE || 'attendance_blue_collar';
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await conn.query(`USE \`${dbName}\`;`);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS workers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) DEFAULT '',
        daily_wage DECIMAL(10,2) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        worker_id INT NOT NULL,
        status ENUM('present', 'absent') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_date_worker (date, worker_id),
        FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
      );
    `);

    console.log('Database and tables created successfully.');
  } catch (err) {
    console.error('Init DB error:', err.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

run();
