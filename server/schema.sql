-- Database schema for Attendance Blue Collar Workers
-- Run this in your production MySQL database

CREATE DATABASE IF NOT EXISTS attendance_blue_collar;
USE attendance_blue_collar;

-- Workers table
CREATE TABLE IF NOT EXISTS workers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) DEFAULT '',
  daily_wage DECIMAL(10,2) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  worker_id INT NOT NULL,
  status ENUM('present', 'absent') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_date_worker (date, worker_id),
  FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
);
