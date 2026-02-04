import { createPool } from 'mysql2/promise';
import config from './config/db.js';

const pool = createPool(config);

// ✅ named export that your routes expect
export const query = (sql, params = []) => {
  return pool.execute(sql, params);
};
