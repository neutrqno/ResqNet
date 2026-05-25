/**
 * Initialize / reset SQLite database from schema.sql
 * Usage: npm run db:init
 */

const fs = require('fs');
const path = require('path');
const { db_init, db_stats, DB_PATH } = require('./db');

const reset = process.argv.includes('--reset');

if (reset && fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
  const wal = DB_PATH + '-wal';
  const shm = DB_PATH + '-shm';
  if (fs.existsSync(wal)) fs.unlinkSync(wal);
  if (fs.existsSync(shm)) fs.unlinkSync(shm);
  console.log('Removed existing database.');
}

db_init();
console.log('Database ready:', DB_PATH);
console.log(JSON.stringify(db_stats(), null, 2));
