/**
 * SQLite data access — ResqNet
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'resqnet.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');
const SEED_PATH = path.join(__dirname, 'seed.sql');

let db;

function db_runSchema() {
  const sql = fs.readFileSync(SCHEMA_PATH, 'utf8');
  db.exec(sql);
}

function db_maybeSeed() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM community_reports').get().n;
  if (count > 0) return;
  if (!fs.existsSync(SEED_PATH)) return;
  db.exec(fs.readFileSync(SEED_PATH, 'utf8'));
}

function db_migrate() {
  const cols = db.prepare('PRAGMA table_info(community_reports)').all().map((c) => c.name);
  const add = (name, sql) => {
    if (!cols.includes(name)) db.exec(`ALTER TABLE community_reports ADD COLUMN ${sql}`);
  };
  add('alert_type', "alert_type TEXT NOT NULL DEFAULT 'hazard'");
  add('accuracy_m', 'accuracy_m REAL');
  add('landmark', "landmark TEXT NOT NULL DEFAULT ''");
  add('reporter_label', "reporter_label TEXT NOT NULL DEFAULT 'Citizen'");
  add('geo_tag', "geo_tag TEXT NOT NULL DEFAULT ''");
}

function db_formatGeoTag(lat, lon) {
  const latH = lat >= 0 ? 'N' : 'S';
  const lonH = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(6)}°${latH}, ${Math.abs(lon).toFixed(6)}°${lonH}`;
}

function db_init() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db_runSchema();
  db_migrate();
  db_maybeSeed();
  return db;
}

function db_getDb() {
  if (!db) db_init();
  return db;
}

function db_rowToReport(row) {
  const geoTag = row.geo_tag || db_formatGeoTag(row.lat, row.lon);
  return {
    id: String(row.id),
    city: row.city,
    category: row.category,
    alertType: row.alert_type || 'hazard',
    tier: row.tier,
    title: row.title,
    description: row.description,
    lat: row.lat,
    lon: row.lon,
    liveGps: !!row.live_gps,
    accuracyM: row.accuracy_m,
    landmark: row.landmark || '',
    reporterLabel: row.reporter_label || 'Citizen',
    geoTag,
    reportedAt: row.reported_at,
    source: 'citizen'
  };
}

function db_listReports(city, limit = 100) {
  const rows = db_getDb()
    .prepare(
      `SELECT * FROM community_reports
       WHERE city = ?
       ORDER BY datetime(reported_at) DESC
       LIMIT ?`
    )
    .all(city, limit);
  return rows.map(db_rowToReport);
}

function db_getReport(id) {
  const row = db_getDb().prepare('SELECT * FROM community_reports WHERE id = ?').get(id);
  return row ? db_rowToReport(row) : null;
}

function db_insertReport(data) {
  const geoTag = data.geoTag || db_formatGeoTag(data.lat, data.lon);
  const info = db_getDb()
    .prepare(
      `INSERT INTO community_reports
        (city, category, alert_type, tier, title, description, lat, lon, live_gps,
         accuracy_m, landmark, reporter_label, geo_tag, reported_at)
       VALUES
        (@city, @category, @alertType, @tier, @title, @description, @lat, @lon, @liveGps,
         @accuracyM, @landmark, @reporterLabel, @geoTag, @reportedAt)`
    )
    .run({
      city: data.city,
      category: data.category,
      alertType: data.alertType || 'hazard',
      tier: data.tier || 'standard',
      title: data.title,
      description: data.description || '',
      lat: data.lat,
      lon: data.lon,
      liveGps: data.liveGps ? 1 : 0,
      accuracyM: data.accuracyM ?? null,
      landmark: data.landmark || '',
      reporterLabel: data.reporterLabel || 'Citizen',
      geoTag,
      reportedAt: data.reportedAt || new Date().toISOString()
    });
  return db_getReport(info.lastInsertRowid);
}

function db_deleteReport(id) {
  const info = db_getDb().prepare('DELETE FROM community_reports WHERE id = ?').run(id);
  return info.changes > 0;
}

function db_rowToCheckin(row) {
  return {
    id: row.id,
    city: row.city,
    type: row.checkin_type,
    lat: row.lat,
    lon: row.lon,
    liveGps: !!row.live_gps,
    payload: row.payload,
    createdAt: row.created_at
  };
}

function db_listCheckins(city, limit = 30) {
  const rows = db_getDb()
    .prepare(
      `SELECT * FROM family_checkins
       WHERE city = ?
       ORDER BY datetime(created_at) DESC
       LIMIT ?`
    )
    .all(city, limit);
  return rows.map(db_rowToCheckin);
}

function db_insertCheckin(data) {
  const info = db_getDb()
    .prepare(
      `INSERT INTO family_checkins
        (city, checkin_type, lat, lon, live_gps, payload)
       VALUES
        (@city, @checkinType, @lat, @lon, @liveGps, @payload)`
    )
    .run({
      city: data.city,
      checkinType: data.checkinType,
      lat: data.lat,
      lon: data.lon,
      liveGps: data.liveGps ? 1 : 0,
      payload: data.payload
    });
  const row = db_getDb().prepare('SELECT * FROM family_checkins WHERE id = ?').get(info.lastInsertRowid);
  return db_rowToCheckin(row);
}

function db_insertSignalSnapshot(city, riskScore, riskLabel, weatherJson, payloadJson) {
  db_getDb()
    .prepare(
      `INSERT INTO signal_snapshots (city, risk_score, risk_label, weather_json, payload_json)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(city, riskScore, riskLabel, weatherJson, payloadJson);
}

function db_stats() {
  const d = db_getDb();
  return {
    reports: d.prepare('SELECT COUNT(*) AS n FROM community_reports').get().n,
    checkins: d.prepare('SELECT COUNT(*) AS n FROM family_checkins').get().n,
    snapshots: d.prepare('SELECT COUNT(*) AS n FROM signal_snapshots').get().n,
    dbPath: DB_PATH
  };
}

module.exports = {
  db_init,
  db_migrate,
  db_formatGeoTag,
  db_getDb,
  db_listReports,
  db_getReport,
  db_insertReport,
  db_deleteReport,
  db_listCheckins,
  db_insertCheckin,
  db_insertSignalSnapshot,
  db_stats,
  DB_PATH
};
