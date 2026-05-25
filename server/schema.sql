-- ResqNet SQLite schema

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS community_reports (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  city            TEXT NOT NULL,
  category        TEXT NOT NULL,
  alert_type      TEXT NOT NULL DEFAULT 'hazard',
  tier            TEXT NOT NULL DEFAULT 'standard',
  title           TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  lat             REAL NOT NULL,
  lon             REAL NOT NULL,
  live_gps        INTEGER NOT NULL DEFAULT 0,
  accuracy_m      REAL,
  landmark        TEXT NOT NULL DEFAULT '',
  reporter_label  TEXT NOT NULL DEFAULT 'Citizen',
  geo_tag         TEXT NOT NULL DEFAULT '',
  reported_at     TEXT NOT NULL,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_community_reports_city
  ON community_reports (city, reported_at DESC);

CREATE TABLE IF NOT EXISTS family_checkins (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  city          TEXT NOT NULL,
  checkin_type  TEXT NOT NULL CHECK (checkin_type IN ('safe', 'help')),
  lat           REAL NOT NULL,
  lon           REAL NOT NULL,
  live_gps      INTEGER NOT NULL DEFAULT 0,
  payload       TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_family_checkins_city
  ON family_checkins (city, created_at DESC);

-- Optional: cache disaster signal snapshots per city (for analytics / LBW)
CREATE TABLE IF NOT EXISTS signal_snapshots (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  city          TEXT NOT NULL,
  risk_score    INTEGER NOT NULL DEFAULT 0,
  risk_label    TEXT NOT NULL DEFAULT 'Low',
  weather_json  TEXT,
  payload_json  TEXT NOT NULL,
  captured_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_signal_snapshots_city
  ON signal_snapshots (city, captured_at DESC);
