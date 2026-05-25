/**
 * ResqNet API server — Express + SQLite
 * Serves the static frontend and /api/* routes.
 */

const express = require('express');
const path = require('path');
const {
  db_init,
  db_listReports,
  db_getReport,
  db_insertReport,
  db_deleteReport,
  db_listCheckins,
  db_insertCheckin,
  db_insertSignalSnapshot,
  db_stats
} = require('./db');

const PORT = Number(process.env.PORT) || 3000;
const ROOT = path.join(__dirname, '..');

db_init();

const app = express();
app.use(express.json({ limit: '256kb' }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

function apiError(res, status, message) {
  return res.status(status).json({ ok: false, error: message });
}

function validateReportBody(body) {
  const required = ['city', 'category', 'title', 'lat', 'lon'];
  for (const key of required) {
    if (body[key] === undefined || body[key] === null || body[key] === '') {
      return `Missing field: ${key}`;
    }
  }
  if (Number.isNaN(Number(body.lat)) || Number.isNaN(Number(body.lon))) {
    return 'lat and lon must be numbers';
  }
  return null;
}

// ─── Health ───────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'resqnet-api', stats: db_stats() });
});

// ─── Community reports ────────────────────────────────────
app.get('/api/reports', (req, res) => {
  const city = (req.query.city || '').trim();
  if (!city) return apiError(res, 400, 'Query param city is required');
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 200);
    res.json({ ok: true, city, reports: db_listReports(city, limit) });
  } catch (err) {
    console.error(err);
    apiError(res, 500, 'Failed to load reports');
  }
});

app.get('/api/reports/:id', (req, res) => {
  try {
    const report = db_getReport(Number(req.params.id));
    if (!report) return apiError(res, 404, 'Report not found');
    res.json({ ok: true, report });
  } catch (err) {
    console.error(err);
    apiError(res, 500, 'Failed to load report');
  }
});

app.post('/api/reports', (req, res) => {
  const errMsg = validateReportBody(req.body);
  if (errMsg) return apiError(res, 400, errMsg);
  try {
    const report = db_insertReport({
      city: String(req.body.city).trim(),
      category: String(req.body.category).trim(),
      alertType: req.body.alertType || 'hazard',
      tier: req.body.tier || 'standard',
      title: String(req.body.title).trim(),
      description: String(req.body.description || '').trim(),
      lat: Number(req.body.lat),
      lon: Number(req.body.lon),
      liveGps: !!req.body.liveGps,
      accuracyM: req.body.accuracyM != null ? Number(req.body.accuracyM) : null,
      landmark: String(req.body.landmark || '').trim(),
      reporterLabel: String(req.body.reporterLabel || 'Citizen').trim(),
      geoTag: String(req.body.geoTag || '').trim(),
      reportedAt: req.body.reportedAt || new Date().toISOString()
    });
    res.status(201).json({ ok: true, report });
  } catch (err) {
    console.error(err);
    apiError(res, 500, 'Failed to save report');
  }
});

app.delete('/api/reports/:id', (req, res) => {
  try {
    const ok = db_deleteReport(Number(req.params.id));
    if (!ok) return apiError(res, 404, 'Report not found');
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    apiError(res, 500, 'Failed to delete report');
  }
});

// ─── Family check-ins ─────────────────────────────────────
app.get('/api/checkins', (req, res) => {
  const city = (req.query.city || '').trim();
  if (!city) return apiError(res, 400, 'Query param city is required');
  try {
    const limit = Math.min(Number(req.query.limit) || 30, 100);
    res.json({ ok: true, city, checkins: db_listCheckins(city, limit) });
  } catch (err) {
    console.error(err);
    apiError(res, 500, 'Failed to load check-ins');
  }
});

app.post('/api/checkins', (req, res) => {
  const { city, checkinType, lat, lon, payload } = req.body;
  if (!city || !checkinType || lat == null || lon == null || !payload) {
    return apiError(res, 400, 'city, checkinType, lat, lon, payload required');
  }
  if (!['safe', 'help'].includes(checkinType)) {
    return apiError(res, 400, 'checkinType must be safe or help');
  }
  try {
    const checkin = db_insertCheckin({
      city: String(city).trim(),
      checkinType,
      lat: Number(lat),
      lon: Number(lon),
      liveGps: !!req.body.liveGps,
      payload: String(payload)
    });
    res.status(201).json({ ok: true, checkin });
  } catch (err) {
    console.error(err);
    apiError(res, 500, 'Failed to save check-in');
  }
});

// ─── Signal snapshots (optional persist from frontend) ───
app.post('/api/signals/snapshot', (req, res) => {
  const { city, riskScore, riskLabel, weather, payload } = req.body;
  if (!city || !payload) return apiError(res, 400, 'city and payload required');
  try {
    db_insertSignalSnapshot(
      String(city).trim(),
      Number(riskScore) || 0,
      String(riskLabel || 'Low'),
      weather ? JSON.stringify(weather) : null,
      JSON.stringify(payload)
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    apiError(res, 500, 'Failed to save snapshot');
  }
});

// ─── Static frontend ──────────────────────────────────────
app.use(express.static(ROOT));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(ROOT, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ResqNet running at http://localhost:${PORT}`);
  console.log(`SQLite: ${db_stats().dbPath}`);
  console.log(`API:    http://localhost:${PORT}/api/health`);
});
