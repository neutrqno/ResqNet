/**
 * ResqNet — Live disaster signals (Open-Meteo, USGS, NASA EONET, IMD reference)
 * Prefix: signalsHub_
 */

const signalsHub_cityCoords = {
  Bengaluru: { lat: 12.9716, lon: 77.5946 },
  Mumbai: { lat: 18.9750, lon: 72.8258 },
  Chennai: { lat: 13.0827, lon: 80.2707 },
  Delhi: { lat: 28.6139, lon: 77.2090 },
  Kolkata: { lat: 22.5726, lon: 88.3639 },
  Hyderabad: { lat: 17.3850, lon: 78.4867 },
  Pune: { lat: 18.5204, lon: 73.8567 },
  Ahmedabad: { lat: 23.0225, lon: 72.5714 },
  Tokyo: { lat: 35.6762, lon: 139.6503 }
};

/** IMD-style regional advisories (reference; replace with live feed when available). */
const signalsHub_imdAdvisories = {
  Bengaluru: [
    { title: 'Heavy rainfall advisory', description: 'IMD: Isolated heavy rain likely over Bengaluru Urban & adjacent districts. Watch urban waterlogging.', tier: 'serious' },
    { title: 'Thunderstorm watch', description: 'Squally winds possible during evening hours. Secure loose objects.', tier: 'relatively' }
  ],
  Mumbai: [
    { title: 'High tide / coastal alert', description: 'IMD: Rough seas along Konkan coast. Avoid shoreline during high tide windows.', tier: 'serious' },
    { title: 'Monsoon intense spell', description: 'Very heavy rainfall forecast for Mumbai Metropolitan Region.', tier: 'severe' }
  ],
  Chennai: [
    { title: 'Cyclone watch — Bay of Bengal', description: 'IMD: Depression may intensify. Coastal districts on alert; prepare evacuation kit.', tier: 'severe' },
    { title: 'Flood watch — Adyar / Cooum', description: 'Low-lying areas may see inundation with sustained rainfall.', tier: 'serious' }
  ],
  Delhi: [
    { title: 'Heat / dust storm advisory', description: 'IMD: Sudden dust-raising winds possible. Stay indoors if visibility drops.', tier: 'relatively' },
    { title: 'Yamuna flood watch', description: 'River level monitoring active during monsoon surge.', tier: 'serious' }
  ],
  Kolkata: [
    { title: 'Cyclone advisory — Odisha corridor', description: 'IMD: System tracking north-west. Eastern districts may see heavy rain.', tier: 'serious' },
    { title: 'Urban waterlogging alert', description: 'Continuous rain may overwhelm drainage in central Kolkata.', tier: 'relatively' }
  ],
  Hyderabad: [
    { title: 'Thunderstorm warning', description: 'IMD: Lightning risk with convective clouds. Avoid open fields.', tier: 'relatively' },
    { title: 'Musi river watch', description: 'Low-lying colonies near river advised to monitor levels.', tier: 'serious' }
  ],
  Pune: [
    { title: 'Ghat section landslide watch', description: 'IMD / highway advisories: heavy rain on Sahyadri slopes.', tier: 'serious' },
    { title: 'Mutha river level watch', description: 'Water release from dams may raise river levels.', tier: 'relatively' }
  ],
  Ahmedabad: [
    { title: 'Dust storm / heat wave', description: 'IMD: Dry westerlies may cause blowing dust. Limit outdoor exposure.', tier: 'relatively' },
    { title: 'Sabarmati riverfront caution', description: 'Water release advisory during heavy upstream rain.', tier: 'serious' }
  ],
  Tokyo: [
    { title: 'Typhoon approach watch', description: 'JMA / regional: Monitor typhoon track for Honshu. Prepare emergency kit.', tier: 'severe' },
    { title: 'Seismic aftershock guidance', description: 'Remain alert for aftershocks after significant regional quakes.', tier: 'serious' }
  ]
};

let signalsHub_cache = {
  city: '',
  fetchedAt: 0,
  loading: false,
  error: null,
  weather: null,
  weatherAlerts: [],
  earthquakes: [],
  eonet: [],
  imd: [],
  risk: { score: 0, label: '—', factors: [] }
};

let signalsHub_earthquakeMarkers = [];
let signalsHub_eonetMarkers = [];

function signalsHub_coords(city) {
  return signalsHub_cityCoords[city] || signalsHub_cityCoords.Bengaluru;
}

function signalsHub_haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function signalsHub_weatherCodeLabel(code) {
  const map = {
    0: 'Clear',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Fog',
    51: 'Drizzle',
    61: 'Rain',
    63: 'Rain',
    65: 'Heavy rain',
    80: 'Showers',
    81: 'Showers',
    82: 'Heavy showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm',
    99: 'Severe thunderstorm'
  };
  return map[code] ?? 'Variable';
}

async function signalsHub_fetchOpenMeteo(lat, lon) {
  const forecastUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,precipitation,wind_speed_10m,weather_code` +
    `&daily=precipitation_sum,wind_speed_10m_max` +
    `&forecast_days=3&timezone=auto`;

  const alertsUrl = `https://api.open-meteo.com/v1/alerts?latitude=${lat}&longitude=${lon}`;

  const [forecastRes, alertsRes] = await Promise.all([
    fetch(forecastUrl),
    fetch(alertsUrl).catch(() => null)
  ]);

  if (!forecastRes.ok) throw new Error('Open-Meteo forecast unavailable');
  const data = await forecastRes.json();
  const c = data.current;
  const daily = data.daily;

  let alerts = [];
  if (alertsRes && alertsRes.ok) {
    const alertData = await alertsRes.json();
    alerts = (alertData.alerts || []).map((a) => ({
      event: a.event || 'Weather alert',
      headline: a.headline || a.description || '',
      severity: a.severity || 'Unknown'
    }));
  }

  return {
    temp: c.temperature_2m,
    precipitation: c.precipitation,
    windSpeed: c.wind_speed_10m,
    weatherCode: c.weather_code,
    weatherLabel: signalsHub_weatherCodeLabel(c.weather_code),
    dailyRain: daily?.precipitation_sum?.[0] ?? 0,
    dailyWindMax: daily?.wind_speed_10m_max?.[0] ?? 0,
    alerts
  };
}

async function signalsHub_fetchEarthquakes(lat, lon, radiusKm) {
  const start = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const url =
    `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson` +
    `&starttime=${start}&minmagnitude=4` +
    `&latitude=${lat}&longitude=${lon}&maxradiuskm=${radiusKm}` +
    `&orderby=time&limit=20`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('USGS earthquake feed unavailable');
  const geo = await res.json();

  return (geo.features || []).map((f) => {
    const [lng, latQ, depth] = f.geometry.coordinates;
    const p = f.properties;
    return {
      id: f.id,
      lat: latQ,
      lon: lng,
      depth,
      mag: p.mag,
      place: p.place,
      time: p.time,
      timeAgo: signalsHub_timeAgo(p.time),
      url: p.url,
      type: 'earthquake'
    };
  });
}

async function signalsHub_fetchEonet(lat, lon, maxKm) {
  const url = 'https://eonet.gsfc.nasa.gov/api/v3/events/geojson?status=open&limit=40';
  const res = await fetch(url);
  if (!res.ok) throw new Error('NASA EONET unavailable');
  const geo = await res.json();

  const events = [];
  (geo.features || []).forEach((f) => {
    const coords = f.geometry?.coordinates;
    if (!coords || f.geometry.type !== 'Point') return;
    const [lng, latE] = coords;
    const dist = signalsHub_haversineKm(lat, lon, latE, lng);
    if (dist > maxKm) return;

    const cat = f.properties?.categories?.[0]?.title || f.properties?.title || 'Natural event';
    const catId = (f.properties?.categories?.[0]?.id || '').toLowerCase();
    events.push({
      id: f.id || `eonet-${latE}-${lng}`,
      lat: latE,
      lon: lng,
      title: f.properties?.title || 'NASA EONET event',
      category: cat,
      categoryId: catId,
      description: (f.properties?.sources || []).map((s) => s.id).join(', ') || 'Active natural event',
      timeAgo: 'Active',
      distanceKm: Math.round(dist),
      type: 'eonet'
    });
  });

  return events.slice(0, 12);
}

function signalsHub_timeAgo(iso) {
  const sec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

function signalsHub_computeRisk(weather, earthquakes, eonet, communityCount) {
  const factors = [];
  let score = 0;

  if (weather) {
    if (weather.precipitation >= 10) {
      score += 28;
      factors.push('Heavy rain now');
    } else if (weather.precipitation >= 2) {
      score += 16;
      factors.push('Active precipitation');
    }
    if (weather.dailyRain >= 80) {
      score += 18;
      factors.push('High 24h rainfall');
    } else if (weather.dailyRain >= 40) {
      score += 10;
      factors.push('Elevated daily rain');
    }
    if (weather.windSpeed >= 50) {
      score += 22;
      factors.push('Very strong winds');
    } else if (weather.windSpeed >= 30) {
      score += 12;
      factors.push('Strong winds');
    }
    if (weather.weatherCode >= 95) {
      score += 15;
      factors.push('Thunderstorm conditions');
    }
    (weather.alerts || []).forEach((a) => {
      score += 12;
      factors.push(`Alert: ${a.event}`);
    });
  }

  earthquakes.forEach((eq) => {
    if (eq.mag >= 6) {
      score += 25;
      factors.push(`M${eq.mag.toFixed(1)} earthquake nearby`);
    } else if (eq.mag >= 5) {
      score += 15;
      factors.push(`M${eq.mag.toFixed(1)} earthquake`);
    } else if (eq.mag >= 4.5) {
      score += 8;
    }
  });

  if (eonet.length > 0) {
    score += Math.min(20, eonet.length * 4);
    factors.push(`${eonet.length} NASA natural event(s) in region`);
  }

  if (communityCount > 0) {
    score += Math.min(15, communityCount * 4);
    factors.push(`${communityCount} community report(s)`);
  }

  score = Math.min(100, score);
  let label = 'Low';
  if (score >= 75) label = 'Critical';
  else if (score >= 50) label = 'High';
  else if (score >= 25) label = 'Moderate';

  return { score, label, factors: factors.slice(0, 6) };
}

async function signalsHub_fetchAll(city) {
  const { lat, lon } = signalsHub_coords(city);
  const radiusKm = city === 'Tokyo' ? 2000 : 1400;
  const eonetKm = city === 'Tokyo' ? 2500 : 1800;

  signalsHub_cache.loading = true;
  signalsHub_cache.city = city;
  signalsHub_refreshUI();

  try {
    const [weather, earthquakes, eonet] = await Promise.all([
      signalsHub_fetchOpenMeteo(lat, lon),
      signalsHub_fetchEarthquakes(lat, lon, radiusKm),
      signalsHub_fetchEonet(lat, lon, eonetKm)
    ]);

    const communityCount =
      typeof window.alertFeed_getCommunityReports === 'function'
        ? window.alertFeed_getCommunityReports(city).length
        : 0;

    const imd = signalsHub_imdAdvisories[city] || [];

    signalsHub_cache = {
      city,
      fetchedAt: Date.now(),
      loading: false,
      error: null,
      weather,
      weatherAlerts: weather.alerts || [],
      earthquakes,
      eonet,
      imd,
      risk: signalsHub_computeRisk(weather, earthquakes, eonet, communityCount)
    };
  } catch (err) {
    signalsHub_cache.loading = false;
    signalsHub_cache.error = err.message || 'Failed to load signals';
  }

  signalsHub_refreshUI();
  if (typeof window.mapHub_refreshSignalMarkers === 'function') {
    window.mapHub_refreshSignalMarkers();
  }
  if (typeof window.dbApi_saveSignalSnapshot === 'function' && !signalsHub_cache.error) {
    window.dbApi_saveSignalSnapshot(city, signalsHub_cache);
  }
}


window.signalsHub_getState = function () {
  return signalsHub_cache;
};

window.signalsHub_getEarthquakes = function () {
  return signalsHub_cache.earthquakes || [];
};

window.signalsHub_getEonetEvents = function () {
  return signalsHub_cache.eonet || [];
};

window.signalsHub_refresh = function (city) {
  const c = city || (window.appState && window.appState.currentCity) || 'Bengaluru';
  const stale = Date.now() - signalsHub_cache.fetchedAt > 5 * 60 * 1000;
  if (signalsHub_cache.city !== c || stale || signalsHub_cache.error) {
    signalsHub_fetchAll(c);
  } else {
    signalsHub_refreshUI();
  }
};

function signalsHub_riskColor(label) {
  if (label === 'Critical') return { bg: 'bg-rose-600', text: 'text-white', bar: 'bg-rose-500' };
  if (label === 'High') return { bg: 'bg-orange-500', text: 'text-white', bar: 'bg-orange-500' };
  if (label === 'Moderate') return { bg: 'bg-amber-400', text: 'text-slate-900', bar: 'bg-amber-400' };
  return { bg: 'bg-emerald-500', text: 'text-white', bar: 'bg-emerald-500' };
}

function signalsHub_drawDashboardHTML(city) {
  const s = signalsHub_cache;
  if (s.loading && s.city === city) {
    return `
      <div class="bg-white border border-slate-200 rounded-xl p-4 text-center">
        <i class="fa-solid fa-circle-notch fa-spin text-indigo-500 mb-2"></i>
        <p class="text-xs text-slate-500">${typeof window.i18n_t === 'function' ? window.i18n_t('loadingSignals') : 'Loading live weather, earthquakes & hazard signals…'}</p>
      </div>`;
  }
  if (s.error && s.city === city) {
    return `
      <div class="bg-rose-50 border border-rose-100 rounded-xl p-4 text-xs text-rose-700">
        Could not load all signals: ${s.error}. Check connection and retry.
        <button type="button" onclick="signalsHub_refresh()" class="block mt-2 font-semibold underline">Retry</button>
      </div>`;
  }
  if (s.city !== city || !s.weather) {
    return `<div class="text-xs text-slate-400 py-2">Signals will load for ${city}…</div>`;
  }

  const rc = signalsHub_riskColor(s.risk.label);
  const w = s.weather;
  const updated = new Date(s.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let eqHtml = '';
  if (s.earthquakes.length === 0) {
    eqHtml = `<p class="text-xs text-slate-500">No M4+ quakes within region (7 days).</p>`;
  } else {
    eqHtml = `<div class="space-y-1.5 max-h-32 overflow-y-auto">${s.earthquakes
      .slice(0, 6)
      .map(
        (eq) => `
      <div class="flex justify-between gap-2 text-xs bg-slate-50 rounded-lg px-2 py-1.5 border border-slate-100">
        <span class="font-semibold text-amber-700">M${eq.mag?.toFixed(1)}</span>
        <span class="text-slate-600 truncate flex-1">${eq.place || 'Unknown'}</span>
        <span class="text-slate-400 shrink-0">${eq.timeAgo}</span>
      </div>`
      )
      .join('')}</div>`;
  }

  let eonetHtml = '';
  if (s.eonet.length === 0) {
    eonetHtml = `<p class="text-xs text-slate-500">No open NASA EONET events nearby.</p>`;
  } else {
    eonetHtml = `<div class="space-y-1.5 max-h-28 overflow-y-auto">${s.eonet
      .slice(0, 5)
      .map(
        (e) => `
      <div class="text-xs bg-violet-50 border border-violet-100 rounded-lg px-2 py-1.5">
        <span class="font-semibold text-violet-800">${e.category}</span>
        <span class="text-slate-600"> · ${e.title}</span>
        <span class="text-slate-400"> (${e.distanceKm} km)</span>
      </div>`
      )
      .join('')}</div>`;
  }

  let imdHtml = (s.imd || [])
    .map(
      (a) => `
    <div class="text-xs border-l-2 border-sky-400 pl-2 py-1">
      <span class="font-semibold text-slate-800">${a.title}</span>
      <p class="text-slate-500 mt-0.5">${a.description}</p>
    </div>`
    )
    .join('');

  let alertRows = (w.alerts || [])
    .slice(0, 3)
    .map(
      (a) => `<li class="text-xs text-amber-800"><strong>${a.event}</strong> — ${a.headline || a.severity}</li>`
    )
    .join('');

  return `
    <div class="space-y-3" id="signals-hub-dashboard">
      <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div class="${rc.bg} ${rc.text} px-3 py-2 flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wide">Disaster risk score</span>
          <span class="text-lg font-black">${s.risk.score}</span>
        </div>
        <div class="px-3 py-2">
          <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div class="${rc.bar} h-full rounded-full transition-all" style="width:${s.risk.score}%"></div>
          </div>
          <p class="text-xs font-semibold text-slate-700 mt-1.5">${s.risk.label} risk · updated ${updated}</p>
          ${
            s.risk.factors.length
              ? `<p class="text-[10px] text-slate-500 mt-1">${s.risk.factors.join(' · ')}</p>`
              : ''
          }
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl p-3">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xs font-semibold text-slate-800"><i class="fa-solid fa-cloud-rain text-sky-500 mr-1"></i> Weather · Open-Meteo</h3>
          <button type="button" onclick="signalsHub_refresh()" class="text-[10px] text-indigo-600 font-semibold">Refresh</button>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="bg-slate-50 rounded-lg py-2 px-1">
            <p class="text-[10px] text-slate-500">Rain now</p>
            <p class="text-sm font-bold text-sky-700">${w.precipitation} mm</p>
          </div>
          <div class="bg-slate-50 rounded-lg py-2 px-1">
            <p class="text-[10px] text-slate-500">Wind</p>
            <p class="text-sm font-bold text-slate-800">${Math.round(w.windSpeed)} km/h</p>
          </div>
          <div class="bg-slate-50 rounded-lg py-2 px-1">
            <p class="text-[10px] text-slate-500">Temp</p>
            <p class="text-sm font-bold text-slate-800">${Math.round(w.temp)}°C</p>
          </div>
        </div>
        <p class="text-[10px] text-slate-500 mt-2">${w.weatherLabel} · Today: ${Math.round(w.dailyRain)} mm rain, wind up to ${Math.round(w.dailyWindMax)} km/h</p>
        ${alertRows ? `<ul class="mt-2 space-y-1 list-disc list-inside">${alertRows}</ul>` : ''}
        <p class="text-[10px] text-emerald-600 mt-2">Flood/storm signals use rain + wind + official weather alerts.</p>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl p-3">
        <h3 class="text-xs font-semibold text-slate-800 mb-2"><i class="fa-solid fa-house-chimney-crack text-amber-600 mr-1"></i> Earthquakes · USGS</h3>
        ${eqHtml}
      </div>

      <div class="bg-white border border-slate-200 rounded-xl p-3">
        <h3 class="text-xs font-semibold text-slate-800 mb-2"><i class="fa-solid fa-globe text-violet-600 mr-1"></i> Natural events · NASA EONET</h3>
        ${eonetHtml}
      </div>

      <div class="bg-sky-50 border border-sky-100 rounded-xl p-3">
        <h3 class="text-xs font-semibold text-sky-900 mb-2"><i class="fa-solid fa-wind text-sky-600 mr-1"></i> India advisories · IMD reference</h3>
        <div class="space-y-2">${imdHtml}</div>
      </div>
    </div>`;
}

function signalsHub_refreshUI() {
  const panel = document.getElementById('signals-hub-panel');
  if (!panel) return;
  if (window.appState && window.appState.isLowBandwidth) return;
  const city = (window.appState && window.appState.currentCity) || 'Bengaluru';
  panel.innerHTML = signalsHub_drawDashboardHTML(city);
}

window.signalsHub_refreshUI = signalsHub_refreshUI;

function signalsHub_onStateUpdate(state) {
  if (!state.isLoggedIn) return;
  const city = state.currentCity || 'Bengaluru';
  if (state.currentTab === 'alerts' && !state.isLowBandwidth) {
    signalsHub_refreshUI();
  }
  if (state.isLowBandwidth || state.currentTab === 'alerts' || state.currentTab === 'map') {
    window.signalsHub_refresh(city);
  }
}

function signalsHub_init() {
  if (window.appState) {
    window.appState.subscribe(signalsHub_onStateUpdate);
  }
}

/** Plain-text summary for LBW mode */
window.signalsHub_getTextSummary = function (city) {
  const s = signalsHub_cache;
  if (s.city !== city || !s.weather) return '';
  const w = s.weather;
  let text = `**[SIGNALS]** Risk ${s.risk.score}/100 (${s.risk.label}). Rain ${w.precipitation}mm, wind ${Math.round(w.windSpeed)}km/h, ${w.weatherLabel}.`;
  if (s.earthquakes[0]) {
    text += ` Latest quake M${s.earthquakes[0].mag?.toFixed(1)}: ${s.earthquakes[0].place}.`;
  }
  if (s.eonet[0]) text += ` EONET: ${s.eonet[0].title}.`;
  return text;
};

document.addEventListener('DOMContentLoaded', signalsHub_init);
