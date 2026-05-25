/**
 * ResqNet — SQL API client (community reports & family check-ins)
 * Prefix: dbApi_
 */

const dbApi_BASE =
  typeof window !== 'undefined' && window.RESQNET_API_BASE != null
    ? window.RESQNET_API_BASE
    : '';

function dbApi_url(path) {
  return `${dbApi_BASE}/api${path}`;
}

function dbApi_timeAgo(iso) {
  const sec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (sec < 60) return 'Just now';
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

function dbApi_formatGeoTag(lat, lon) {
  const latH = lat >= 0 ? 'N' : 'S';
  const lonH = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(6)}°${latH}, ${Math.abs(lon).toFixed(6)}°${lonH}`;
}

function dbApi_mapReport(r) {
  const geoTag = r.geoTag || dbApi_formatGeoTag(r.lat, r.lon);
  return {
    id: String(r.id),
    tier: r.tier,
    title: r.title,
    description: r.description,
    lat: r.lat,
    lon: r.lon,
    liveGps: r.liveGps,
    accuracyM: r.accuracyM,
    landmark: r.landmark || '',
    reporterLabel: r.reporterLabel || 'Citizen',
    alertType: r.alertType || 'hazard',
    geoTag,
    reportedAt: r.reportedAt,
    timeAgo: dbApi_timeAgo(r.reportedAt),
    category: r.category,
    city: r.city,
    source: r.source || 'citizen'
  };
}

function dbApi_mapCheckin(c) {
  const d = new Date(c.createdAt);
  return {
    type: c.type,
    time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    lat: c.lat,
    lon: c.lon,
    liveGps: c.liveGps,
    payload: c.payload
  };
}

window.dbApi_isOnline = async function () {
  try {
    const res = await fetch(dbApi_url('/health'), { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
};

window.dbApi_fetchReports = async function (city) {
  const res = await fetch(dbApi_url(`/reports?city=${encodeURIComponent(city)}`));
  if (!res.ok) throw new Error('Failed to load reports');
  const data = await res.json();
  return (data.reports || []).map(dbApi_mapReport);
};

window.dbApi_createReport = async function (report) {
  const res = await fetch(dbApi_url('/reports'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      city: report.city,
      category: report.category,
      alertType: report.alertType,
      tier: report.tier,
      title: report.title,
      description: report.description,
      lat: report.lat,
      lon: report.lon,
      liveGps: report.liveGps,
      accuracyM: report.accuracyM,
      landmark: report.landmark,
      reporterLabel: report.reporterLabel,
      geoTag: report.geoTag,
      reportedAt: report.reportedAt
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to save report');
  }
  const data = await res.json();
  return dbApi_mapReport(data.report);
};

window.dbApi_fetchCheckins = async function (city, limit) {
  const q = `?city=${encodeURIComponent(city)}&limit=${limit || 30}`;
  const res = await fetch(dbApi_url(`/checkins${q}`));
  if (!res.ok) throw new Error('Failed to load check-ins');
  const data = await res.json();
  return (data.checkins || []).map(dbApi_mapCheckin);
};

window.dbApi_createCheckin = async function (checkin) {
  const res = await fetch(dbApi_url('/checkins'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      city: checkin.city,
      checkinType: checkin.checkinType,
      lat: checkin.lat,
      lon: checkin.lon,
      liveGps: checkin.liveGps,
      payload: checkin.payload
    })
  });
  if (!res.ok) throw new Error('Failed to save check-in');
  const data = await res.json();
  return dbApi_mapCheckin(data.checkin);
};

window.dbApi_saveSignalSnapshot = async function (city, state) {
  try {
    await fetch(dbApi_url('/signals/snapshot'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        city,
        riskScore: state.risk?.score,
        riskLabel: state.risk?.label,
        weather: state.weather,
        payload: {
          earthquakes: state.earthquakes?.length,
          eonet: state.eonet?.length
        }
      })
    });
  } catch {
    /* non-critical */
  }
};
