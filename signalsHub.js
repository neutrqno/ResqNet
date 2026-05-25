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

let signalsHub_isExpanded = false;
let signalsHub_activeTab = 'weather'; // 'weather' | 'earthquakes' | 'eonet' | 'imd'

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

  // Generate tab-specific HTML
  let tabContentHtml = '';

  // Friendly Advice block for each tab
  let friendlyAdviceHtml = '';

  if (signalsHub_activeTab === 'weather') {
    let alertRows = (w.alerts || [])
      .slice(0, 3)
      .map(
        (a) => `<li class="text-xs text-amber-800"><strong>${a.event}</strong> — ${a.headline || a.severity}</li>`
      )
      .join('');

    tabContentHtml = `
      <div class="space-y-3 slide-up">
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="bg-slate-50 border border-slate-100 rounded-xl py-2 px-1">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Rain now</p>
            <p class="text-sm font-black text-sky-600 mt-0.5">${w.precipitation} mm</p>
          </div>
          <div class="bg-slate-50 border border-slate-100 rounded-xl py-2 px-1">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Wind</p>
            <p class="text-sm font-black text-slate-700 mt-0.5">${Math.round(w.windSpeed)} km/h</p>
          </div>
          <div class="bg-slate-50 border border-slate-100 rounded-xl py-2 px-1">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Temp</p>
            <p class="text-sm font-black text-slate-800 mt-0.5">${Math.round(w.temp)}°C</p>
          </div>
        </div>
        <p class="text-[10.5px] text-slate-500 leading-relaxed font-medium">
          <i class="fa-solid fa-cloud text-sky-400 mr-0.5"></i> ${w.weatherLabel} · Today: ${Math.round(w.dailyRain)} mm rain, wind max ${Math.round(w.dailyWindMax)} km/h
        </p>
        ${alertRows ? `<ul class="mt-2 space-y-1 list-disc list-inside bg-amber-50/50 border border-amber-100 rounded-xl p-2.5">${alertRows}</ul>` : ''}
      </div>
    `;

    // Conversational plain language advice
    let adviceText = "Everything looks safe and calm. Perfect weather to step outside!";
    if (s.risk.score >= 75) {
      adviceText = "🚨 Extreme weather conditions detected. Stay indoors, secure all doors and windows, and keep your phone charged.";
    } else if (s.risk.score >= 50) {
      adviceText = "⚠️ Heavy rain or high winds active. Avoid waterlogged streets and low-lying underpasses. Drive with caution.";
    } else if (s.risk.score >= 25) {
      adviceText = "🌧️ Light showers or moderate wind in the forecast. Carry an umbrella and plan for slight traffic delays.";
    }

    friendlyAdviceHtml = `
      <div class="bg-indigo-50/80 border border-indigo-100 rounded-xl p-3 mt-3 slide-up">
        <h4 class="text-[10px] font-black uppercase text-indigo-700 tracking-wider flex items-center gap-1.5 mb-1">
          <i class="fa-solid fa-face-smile"></i> Friendly Weather Guide
        </h4>
        <p class="text-[11px] text-indigo-900 leading-relaxed font-medium">${adviceText}</p>
      </div>
    `;

  } else if (signalsHub_activeTab === 'earthquakes') {
    let eqHtml = '';
    if (s.earthquakes.length === 0) {
      eqHtml = `<p class="text-xs text-slate-500 p-2 text-center bg-slate-50 rounded-xl border border-slate-100">No M4+ quakes within the region (last 7 days).</p>`;
    } else {
      eqHtml = `<div class="space-y-2 max-h-40 overflow-y-auto pr-1">${s.earthquakes
        .slice(0, 6)
        .map(
          (eq) => `
        <div class="flex justify-between items-center gap-2 text-xs bg-slate-50 rounded-xl px-3 py-2 border border-slate-100 hover:border-slate-200 transition-all">
          <div class="flex items-center gap-2">
            <span class="font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[10px] border border-rose-100">M${eq.mag?.toFixed(1)}</span>
            <span class="text-slate-700 font-semibold truncate max-w-[150px]">${eq.place || 'Unknown'}</span>
          </div>
          <span class="text-slate-400 font-bold text-[10px]">${eq.timeAgo}</span>
        </div>`
        )
        .join('')}</div>`;
    }

    tabContentHtml = `
      <div class="space-y-3 slide-up">
        ${eqHtml}
      </div>
    `;

    friendlyAdviceHtml = `
      <div class="bg-amber-50 border border-amber-150 rounded-xl p-3 mt-3 slide-up">
        <h4 class="text-[10px] font-black uppercase text-amber-800 tracking-wider flex items-center gap-1.5 mb-1">
          <i class="fa-solid fa-circle-question"></i> Understanding Earthquakes
        </h4>
        <p class="text-[10.5px] text-amber-900 leading-relaxed">
          The Earth's crust is constantly moving. Tremors below magnitude 5.0 are very common and harmless. We track them within our region to stay informed, but there's no need to worry unless a high-magnitude alert is issued.
        </p>
      </div>
    `;

  } else if (signalsHub_activeTab === 'eonet') {
    let eonetHtml = '';
    if (s.eonet.length === 0) {
      eonetHtml = `<p class="text-xs text-slate-500 p-2 text-center bg-slate-50 rounded-xl border border-slate-100">No active environmental events tracked in region.</p>`;
    } else {
      eonetHtml = `<div class="space-y-2 max-h-40 overflow-y-auto pr-1">${s.eonet
        .slice(0, 5)
        .map(
          (e) => `
        <div class="text-xs bg-violet-50 border border-violet-100 rounded-xl px-3 py-2 flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <span class="font-extrabold text-violet-800 bg-violet-100/60 px-2 py-0.5 rounded text-[9.5px]">${e.category}</span>
            <span class="text-[9.5px] text-slate-400 font-semibold">${e.distanceKm} km away</span>
          </div>
          <p class="text-slate-700 font-semibold">${e.title}</p>
        </div>`
        )
        .join('')}</div>`;
    }

    tabContentHtml = `
      <div class="space-y-3 slide-up">
        ${eonetHtml}
      </div>
    `;

    friendlyAdviceHtml = `
      <div class="bg-violet-50 border border-violet-100 rounded-xl p-3 mt-3 slide-up">
        <h4 class="text-[10px] font-black uppercase text-violet-800 tracking-wider flex items-center gap-1.5 mb-1">
          <i class="fa-solid fa-satellite"></i> NASA Satellite Tracking
        </h4>
        <p class="text-[10.5px] text-violet-900 leading-relaxed">
          NASA's satellites monitor global environmental phenomena like ocean storms or wildfires from space. These events are far away and tracked purely for science—they pose absolutely no threat to you today!
        </p>
      </div>
    `;

  } else if (signalsHub_activeTab === 'imd') {
    let imdHtml = '';
    if (s.imd.length === 0) {
      imdHtml = `<p class="text-xs text-slate-500 p-2 text-center bg-slate-50 rounded-xl border border-slate-100">No active regional advisories at the moment.</p>`;
    } else {
      imdHtml = `<div class="space-y-2.5">${s.imd
        .map(
          (a) => `
        <div class="text-xs border-l-3 border-sky-400 pl-3 py-1 bg-sky-50/30 rounded-r-xl pr-2">
          <span class="font-bold text-slate-800 block text-[11px]">${a.title}</span>
          <p class="text-slate-500 mt-1 leading-normal text-[10.5px]">${a.description}</p>
        </div>`
        )
        .join('')}</div>`;
    }

    tabContentHtml = `
      <div class="space-y-3 slide-up">
        ${imdHtml}
      </div>
    `;

    friendlyAdviceHtml = `
      <div class="bg-sky-50 border border-sky-100 rounded-xl p-3 mt-3 slide-up">
        <h4 class="text-[10px] font-black uppercase text-sky-850 tracking-wider flex items-center gap-1.5 mb-1">
          <i class="fa-solid fa-circle-info"></i> What this means for you
        </h4>
        <p class="text-[10.5px] text-sky-900 leading-relaxed">
          These are official India Meteorological Department weather bulletins. If there's an active yellow or red warning, plan your trips accordingly and stay indoors during heavy downpours.
        </p>
      </div>
    `;
  }

  // Define conversational overall message based on Risk Score
  let overallRiskMsg = '';
  if (s.risk.score >= 75) {
    overallRiskMsg = '🔴 Red Alert · Critical conditions! Extreme weather or active alerts. Seek shelter immediately.';
  } else if (s.risk.score >= 50) {
    overallRiskMsg = '🟠 Orange Alert · Elevated risk. Heavy rain or warnings active. Limit travel.';
  } else if (s.risk.score >= 25) {
    overallRiskMsg = '🟡 Yellow Alert · Moderate risk. Minor weather signals active. Carry an umbrella.';
  } else {
    overallRiskMsg = '🟢 Green Alert · No threats. Enjoy your day and stay safe!';
  }

  // Header Card markup
  const headerCardHtml = `
    <div class="bg-gradient-to-tr from-slate-900 to-slate-800 text-white border border-slate-900 rounded-2xl shadow-lg p-4 overflow-hidden relative">
      <!-- Grid pattern decoration -->
      <div class="absolute inset-0 opacity-5 pointer-events-none" style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 12px 12px;"></div>
      
      <div class="flex items-center justify-between relative z-10">
        <div>
          <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Live Telemetry</span>
          <h3 class="text-sm font-black tracking-tight mt-0.5">Disaster Risk Score</h3>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[9px] font-bold text-slate-400">Updated ${updated}</span>
          <button type="button" onclick="signalsHub_refresh()" class="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all cursor-pointer" title="Refresh Telemetry">
            <i class="fa-solid fa-arrows-rotate text-[10px]"></i>
          </button>
        </div>
      </div>

      <!-- Risk score ring/bar -->
      <div class="mt-4 flex items-center gap-4 relative z-10">
        <!-- Big Number -->
        <div class="w-14 h-14 rounded-full bg-slate-950/40 border border-slate-800/80 flex flex-col items-center justify-center shrink-0 shadow-inner">
          <span class="text-xl font-black font-mono leading-none">${s.risk.score}</span>
          <span class="text-[7.5px] font-black text-slate-500 uppercase tracking-wide mt-0.5 leading-none">/ 100</span>
        </div>

        <div class="flex-1 min-w-0">
          <div class="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/40">
            <div class="${rc.bar} h-full rounded-full transition-all duration-1000" style="width: ${s.risk.score}%"></div>
          </div>
          <p class="text-[11px] font-bold mt-2 truncate leading-tight">${overallRiskMsg}</p>
          ${
            s.risk.factors.length
              ? `<p class="text-[9px] text-slate-400 mt-1 truncate leading-none">${s.risk.factors.join(' · ')}</p>`
              : ''
          }
        </div>
      </div>

      <!-- Collapsible Expand trigger -->
      <div class="mt-4 pt-3.5 border-t border-slate-800/60 flex justify-center relative z-10">
        <button id="signals-hub-toggle-btn" type="button" class="w-full py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-extrabold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer transition-all">
          <span>${signalsHub_isExpanded ? 'Hide Live Signals' : 'Show Live Signals'}</span>
          <i class="fa-solid ${signalsHub_isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} text-[9px]"></i>
        </button>
      </div>
    </div>
  `;

  // Expanded panel markup
  let detailPanelHtml = '';
  if (signalsHub_isExpanded) {
    const tabClass = (tab) =>
      signalsHub_activeTab === tab
        ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50 font-black'
        : 'text-slate-400 hover:text-slate-700 font-semibold';

    detailPanelHtml = `
      <div class="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm slide-up">
        <!-- Segmented Tab Bar -->
        <div class="bg-slate-100 rounded-xl p-1 flex gap-0.5 select-none mb-3">
          <button type="button" class="signals-hub-tab-btn flex-1 py-2 rounded-lg text-[9.5px] uppercase tracking-wider transition-all cursor-pointer ${tabClass('weather')}" data-tab="weather">
            🌦️ Weather
          </button>
          <button type="button" class="signals-hub-tab-btn flex-1 py-2 rounded-lg text-[9.5px] uppercase tracking-wider transition-all cursor-pointer ${tabClass('earthquakes')}" data-tab="earthquakes">
            🌋 Quakes
          </button>
          <button type="button" class="signals-hub-tab-btn flex-1 py-2 rounded-lg text-[9.5px] uppercase tracking-wider transition-all cursor-pointer ${tabClass('eonet')}" data-tab="eonet">
            🛰️ Space
          </button>
          <button type="button" class="signals-hub-tab-btn flex-1 py-2 rounded-lg text-[9.5px] uppercase tracking-wider transition-all cursor-pointer ${tabClass('imd')}" data-tab="imd">
            📢 Advisories
          </button>
        </div>

        <!-- Active Tab Content -->
        <div class="px-0.5">
          ${tabContentHtml}
        </div>

        <!-- Conversational Safety Guidance -->
        ${friendlyAdviceHtml}
      </div>
    `;
  }

  return `
    <div class="space-y-3" id="signals-hub-dashboard">
      ${headerCardHtml}
      ${detailPanelHtml}
    </div>
  `;
}

function signalsHub_bindDashboardListeners() {
  const toggleBtn = document.getElementById('signals-hub-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      signalsHub_isExpanded = !signalsHub_isExpanded;
      signalsHub_refreshUI();
    });
  }

  const tabBtns = document.querySelectorAll('.signals-hub-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      signalsHub_activeTab = btn.getAttribute('data-tab');
      signalsHub_refreshUI();
    });
  });
}

function signalsHub_refreshUI() {
  const panel = document.getElementById('signals-hub-panel');
  if (!panel) return;
  if (window.appState && window.appState.isLowBandwidth) return;
  const city = (window.appState && window.appState.currentCity) || 'Bengaluru';
  panel.innerHTML = signalsHub_drawDashboardHTML(city);
  signalsHub_bindDashboardListeners();
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
