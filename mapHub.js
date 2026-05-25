/**
 * ResqNet Mobile — Leaflet + OpenStreetMap, live GPS, safe-zone routing
 * @see https://leafletjs.com/
 */

const mapHub_citiesData = {
  Bengaluru: {
    lat: 12.9716,
    lon: 77.5946,
    zoom: 13,
    shelters: [
      { id: 'blr-s1', name: 'Govt Primary School Kengeri', address: '5th Main Rd, Kengeri', lat: 12.9030, lng: 77.4857, capacityText: '45/100', capacityPercent: 45, resources: ['food', 'medical', 'power'] },
      { id: 'blr-s2', name: 'HSR Community Hall', address: 'Sector 3, HSR Layout', lat: 12.9116, lng: 77.6389, capacityText: '82/100', capacityPercent: 82, resources: ['food', 'power'] },
      { id: 'blr-s3', name: 'Sports Complex Koramangala', address: '4th Block, Koramangala', lat: 12.9279, lng: 77.6271, capacityText: '29/100', capacityPercent: 29, resources: ['food', 'medical'] }
    ]
  },
  Mumbai: {
    lat: 18.9750,
    lon: 72.8258,
    zoom: 13,
    shelters: [
      { id: 'mum-s1', name: 'Municipal School Dadar West', address: 'Dadar West, Mumbai', lat: 19.0178, lng: 72.8478, capacityText: '55/120', capacityPercent: 46, resources: ['food', 'medical'] },
      { id: 'mum-s2', name: 'Transit Camp Dharavi', address: 'Dharavi, Mumbai', lat: 19.0420, lng: 72.8560, capacityText: '90/150', capacityPercent: 60, resources: ['food', 'power'] },
      { id: 'mum-s3', name: 'St. Xavier College Hall', address: 'Dhobi Talao, Mumbai', lat: 18.9430, lng: 72.8260, capacityText: '40/100', capacityPercent: 40, resources: ['medical', 'power'] }
    ]
  },
  Chennai: {
    lat: 13.0827,
    lon: 80.2707,
    zoom: 13,
    shelters: [
      { id: 'che-s1', name: 'Corporation Girls School Velachery', address: 'Velachery, Chennai', lat: 12.9750, lng: 80.2200, capacityText: '70/120', capacityPercent: 58, resources: ['food', 'medical'] },
      { id: 'che-s2', name: 'Community Hall Mylapore', address: 'Mylapore, Chennai', lat: 13.0339, lng: 80.2700, capacityText: '48/100', capacityPercent: 48, resources: ['food', 'power'] },
      { id: 'che-s3', name: 'State High School Saidapet', address: 'Saidapet, Chennai', lat: 13.0230, lng: 80.2240, capacityText: '35/90', capacityPercent: 39, resources: ['food', 'medical', 'power'] }
    ]
  },
  Delhi: {
    lat: 28.6139,
    lon: 77.2090,
    zoom: 12,
    shelters: [
      { id: 'del-s1', name: 'Night Shelter Kashmere Gate', address: 'Kashmere Gate, Delhi', lat: 28.6670, lng: 77.2280, capacityText: '60/100', capacityPercent: 60, resources: ['food', 'power'] },
      { id: 'del-s2', name: 'Community Center Saket', address: 'Saket, Delhi', lat: 28.5244, lng: 77.2066, capacityText: '42/80', capacityPercent: 53, resources: ['food', 'medical'] },
      { id: 'del-s3', name: 'Govt Boys School Yamuna Vihar', address: 'Yamuna Vihar, Delhi', lat: 28.7020, lng: 77.2980, capacityText: '55/110', capacityPercent: 50, resources: ['food', 'medical', 'power'] }
    ]
  },
  Kolkata: {
    lat: 22.5726,
    lon: 88.3639,
    zoom: 13,
    shelters: [
      { id: 'kol-s1', name: 'KMC School Hall Amherst St', address: 'Amherst Street, Kolkata', lat: 22.5850, lng: 88.3780, capacityText: '38/90', capacityPercent: 42, resources: ['food', 'medical'] },
      { id: 'kol-s2', name: 'Citizen Center Gariahat', address: 'Gariahat, Kolkata', lat: 22.5180, lng: 88.3680, capacityText: '50/100', capacityPercent: 50, resources: ['food', 'power'] },
      { id: 'kol-s3', name: 'Cyclone Shelter Behala', address: 'Behala, Kolkata', lat: 22.4980, lng: 88.3160, capacityText: '65/130', capacityPercent: 50, resources: ['food', 'medical', 'power'] }
    ]
  },
  Hyderabad: {
    lat: 17.3850,
    lon: 78.4867,
    zoom: 13,
    shelters: [
      { id: 'hyd-s1', name: 'GHMC Sports Complex Secunderabad', address: 'Secunderabad', lat: 17.4399, lng: 78.4983, capacityText: '44/100', capacityPercent: 44, resources: ['food', 'power'] },
      { id: 'hyd-s2', name: 'Community Hall Amberpet', address: 'Amberpet, Hyderabad', lat: 17.3990, lng: 78.5120, capacityText: '52/95', capacityPercent: 55, resources: ['food', 'medical'] },
      { id: 'hyd-s3', name: 'Model High School Khairatabad', address: 'Khairatabad', lat: 17.4120, lng: 78.4650, capacityText: '30/80', capacityPercent: 38, resources: ['medical', 'power'] }
    ]
  },
  Pune: {
    lat: 18.5204,
    lon: 73.8567,
    zoom: 13,
    shelters: [
      { id: 'pun-s1', name: 'PMC Primary School Sinhagad Road', address: 'Sinhagad Road, Pune', lat: 18.4650, lng: 73.8200, capacityText: '40/90', capacityPercent: 44, resources: ['food', 'medical'] },
      { id: 'pun-s2', name: 'Deccan Gymkhana Pavilion', address: 'Deccan, Pune', lat: 18.5150, lng: 73.8420, capacityText: '58/100', capacityPercent: 58, resources: ['food', 'power'] },
      { id: 'pun-s3', name: 'Samaj Mandir Yerwada', address: 'Yerwada, Pune', lat: 18.5520, lng: 73.8780, capacityText: '72/120', capacityPercent: 60, resources: ['food', 'medical', 'power'] }
    ]
  },
  Ahmedabad: {
    lat: 23.0225,
    lon: 72.5714,
    zoom: 13,
    shelters: [
      { id: 'amd-s1', name: 'AMC Primary School Paldi', address: 'Paldi, Ahmedabad', lat: 23.0100, lng: 72.5600, capacityText: '35/85', capacityPercent: 41, resources: ['food', 'medical'] },
      { id: 'amd-s2', name: 'Community Center Gota', address: 'Gota, Ahmedabad', lat: 23.0980, lng: 72.5480, capacityText: '48/100', capacityPercent: 48, resources: ['food', 'power'] },
      { id: 'amd-s3', name: 'Sports Arena Navrangpura', address: 'Navrangpura', lat: 23.0400, lng: 72.5600, capacityText: '25/70', capacityPercent: 36, resources: ['food', 'medical', 'power'] }
    ]
  },
  Tokyo: {
    lat: 35.6762,
    lon: 139.6503,
    zoom: 12,
    shelters: [
      { id: 'tok-s1', name: 'Shinjuku Shelter Unit 1', address: 'Nishi-Shinjuku, Tokyo', lat: 35.6938, lng: 139.7034, capacityText: '60/150', capacityPercent: 40, resources: ['medical', 'power'] },
      { id: 'tok-s2', name: 'Chiyoda Community Center', address: 'Chiyoda-ku, Tokyo', lat: 35.6940, lng: 139.7530, capacityText: '120/200', capacityPercent: 60, resources: ['food', 'power', 'medical'] },
      { id: 'tok-s3', name: 'Minato Disaster Arena', address: 'Shiba-Koen, Minato-ku', lat: 35.6586, lng: 139.7454, capacityText: '45/100', capacityPercent: 45, resources: ['food', 'medical'] }
    ]
  }
};

let mapHub_map = null;
let mapHub_routeLayer = null;
let mapHub_userMarker = null;
let mapHub_accuracyCircle = null;
let mapHub_shelterMarkers = [];
let mapHub_hazardMarkers = [];
let mapHub_earthquakeMarkers = [];
let mapHub_eonetMarkers = [];
let mapHub_userPosition = null;
let mapHub_positionMeta = { accuracy: null, heading: null, speed: null, updatedAt: null, error: null };
let mapHub_geoWatchId = null;
let mapHub_mapTabActive = false;
let mapHub_followUser = true;
let mapHub_activeRouteCamp = null;
let mapHub_routeRefreshTimer = null;
let mapHub_lastCity = '';
let mapHub_lastLang = '';

window.mapHub_getLivePosition = function () {
  if (!mapHub_userPosition) return null;
  return {
    lat: mapHub_userPosition.lat,
    lng: mapHub_userPosition.lng,
    accuracy: mapHub_positionMeta.accuracy,
    heading: mapHub_positionMeta.heading,
    speed: mapHub_positionMeta.speed,
    updatedAt: mapHub_positionMeta.updatedAt,
    live: true
  };
};

window.mapHub_ensureLiveTracking = function () {
  mapHub_startLiveTracking();
};

window.mapHub_panToLocation = function (lat, lng, zoom) {
  if (!mapHub_map || isNaN(lat) || isNaN(lng)) return;
  mapHub_map.setView([lat, lng], zoom || 16);
};

window.mapHub_refreshCommunityMarkers = function () {
  const city = (window.appState && window.appState.currentCity) || 'Bengaluru';
  if (mapHub_map && mapHub_mapTabActive) mapHub_renderCommunityHazards(city);
};

function mapHub_injectStyles() {
  if (document.getElementById('mapHub-dynamic-styles')) return;
  const styleEl = document.createElement('style');
  styleEl.id = 'mapHub-dynamic-styles';
  styleEl.textContent = `
    @keyframes mapHub-flash-red {
      0% { background-color: rgba(255, 51, 51, 0.96); color: #fff; }
      100% { background-color: rgba(15, 23, 42, 0.98); color: rgba(244, 63, 94, 0.9); }
    }
    #mapHub-leaflet-map { min-height: 380px; width: 100%; z-index: 1; }
    .mapHub-pin-shelter {
      width: 28px; height: 28px; border-radius: 50%;
      background: #10b981; border: 2px solid #fff;
      box-shadow: 0 2px 8px rgba(16,185,129,0.45);
      display: flex; align-items: center; justify-content: center;
      color: white; font-size: 11px;
    }
    .mapHub-pin-user {
      width: 18px; height: 18px; border-radius: 50%;
      background: #4f46e5; border: 3px solid #fff;
      box-shadow: 0 0 0 4px rgba(79,70,229,0.35);
      animation: mapHub-gps-pulse 2s ease-out infinite;
    }
    @keyframes mapHub-gps-pulse {
      0% { box-shadow: 0 0 0 0 rgba(79,70,229,0.55); }
      70% { box-shadow: 0 0 0 12px rgba(79,70,229,0); }
      100% { box-shadow: 0 0 0 0 rgba(79,70,229,0); }
    }
    .leaflet-container { font-family: Inter, system-ui, sans-serif; }
  `;
  document.head.appendChild(styleEl);
}

function mapHub_injectTokyoDropdownOption() {
  const dropdown = document.getElementById('city-dropdown');
  if (!dropdown) return;
  for (let i = 0; i < dropdown.options.length; i++) {
    if (dropdown.options[i].value === 'Tokyo') return;
  }
  const opt = document.createElement('option');
  opt.value = 'Tokyo';
  opt.textContent = 'Tokyo (Seismic)';
  dropdown.appendChild(opt);
}

function mapHub_isLeafletReady() {
  return typeof window.L !== 'undefined';
}

function mapHub_shelterIcon() {
  return L.divIcon({
    className: '',
    html: '<div class="mapHub-pin-shelter"><i class="fa-solid fa-house"></i></div>',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
}

function mapHub_userIcon() {
  return L.divIcon({
    className: '',
    html: '<div class="mapHub-pin-user"></div>',
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
}

function mapHub_hazardIcon(alertType, category) {
  const isEmergency = alertType === 'emergency' || category === 'sos';
  const bg = isEmergency ? '#dc2626' : category === 'fire' ? '#ea580c' : '#f43f5e';
  const icon = isEmergency ? '!' : '●';
  const size = isEmergency ? 26 : 22;
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;background:${bg};border:2px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;color:#fff;font-size:${isEmergency ? 14 : 10}px;font-weight:800">${icon}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
}

function mapHub_citizenPopupHtml(h) {
  const geo = h.geoTag || `${h.lat?.toFixed(5)}, ${h.lon?.toFixed(5)}`;
  const acc = h.accuracyM != null ? `±${Math.round(h.accuracyM)}m` : '';
  const gps = h.liveGps ? 'Live GPS' : 'Approximate';
  const lm = h.landmark ? `<br><em>Landmark:</em> ${h.landmark}` : '';
  const rep = h.reporterLabel && h.reporterLabel !== 'Citizen' ? `<br><em>Reporter:</em> ${h.reporterLabel}` : '';
  const osm = `https://www.openstreetmap.org/?mlat=${h.lat}&mlon=${h.lon}#map=17/${h.lat}/${h.lon}`;
  return (
    `<strong>${h.title}</strong><br>${h.description}${lm}${rep}` +
    `<br><span style="font-size:10px;color:#4f46e5;font-weight:600"><i class="fa-solid fa-map-pin"></i> ${geo}</span>` +
    `<br><span style="font-size:10px;color:#64748b">${gps} ${acc} · ${h.timeAgo || ''}</span>` +
    `<br><a href="${osm}" target="_blank" rel="noopener" style="font-size:10px">Open geo tag</a>`
  );
}

function mapHub_earthquakeIcon(mag) {
  const label = mag != null ? `M${Number(mag).toFixed(1)}` : 'EQ';
  return L.divIcon({
    className: '',
    html: `<div style="min-width:26px;height:26px;padding:0 4px;background:#f59e0b;border:2px solid #fff;border-radius:8px;box-shadow:0 2px 6px rgba(245,158,11,.45);display:flex;align-items:center;justify-content:center;color:#fff;font-size:9px;font-weight:800;font-family:Inter,sans-serif">${label}</div>`,
    iconSize: [30, 26],
    iconAnchor: [15, 13]
  });
}

function mapHub_eonetIcon(categoryId) {
  const colors = {
    wildfires: '#ea580c',
    floods: '#0284c7',
    storms: '#7c3aed',
    volcanoes: '#dc2626',
    seaLakeIce: '#0ea5e9',
    landslides: '#a16207'
  };
  const bg = colors[categoryId] || '#8b5cf6';
  return L.divIcon({
    className: '',
    html: `<div style="width:20px;height:20px;background:${bg};border:2px solid #fff;border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,.2)"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
}

function mapHub_initModule() {
  mapHub_injectStyles();
  mapHub_injectTokyoDropdownOption();
  if (window.appState) {
    window.appState.subscribe(mapHub_onStateUpdate);
  }
}

function mapHub_onStateUpdate(state) {
  const mapSlot = document.getElementById('map-slot');
  if (!mapSlot) return;

  if (!state.isLoggedIn) {
    mapHub_checkSirenStatus(false);
    mapHub_mapTabActive = false;
    return;
  }

  mapHub_checkSirenStatus(state.isSirenActive);
  mapHub_mapTabActive = state.currentTab === 'map' && !state.isLowBandwidth;

  if (!mapHub_mapTabActive) {
    const existing = document.getElementById('mapHub-main-container');
    if (existing) existing.classList.add('hidden');
    mapHub_followUser = false;
    return;
  }

  mapHub_ensureLiveTracking();

  let container = document.getElementById('mapHub-main-container');
  const lang = state.currentLanguage || 'en';
  const langChanged = mapHub_lastLang && mapHub_lastLang !== lang;
  mapHub_lastLang = lang;

  if (!container || langChanged) {
    if (langChanged && mapHub_map) mapHub_destroyMap();
    mapHub_renderShell(mapSlot);
    container = document.getElementById('mapHub-main-container');
  } else {
    container.classList.remove('hidden');
  }

  let targetCity = state.currentCity || 'Bengaluru';
  if (!mapHub_citiesData[targetCity]) targetCity = 'Bengaluru';

  const cityChanged = mapHub_lastCity !== state.currentCity;
  if (cityChanged) {
    mapHub_closeShelterSheet();
    mapHub_clearDirections();
    mapHub_lastCity = state.currentCity;
  }

  mapHub_refreshMap(targetCity, cityChanged || !mapHub_map);
  mapHub_followUser = true;
}

function mapHub_renderShell(parent) {
  parent.innerHTML = `
    <div id="mapHub-main-container" class="relative w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mb-4">
      <div class="px-3 py-2.5 border-b border-slate-100 flex items-center justify-between gap-2">
        <div class="min-w-0">
          <p class="text-sm font-bold text-slate-900 leading-none">${typeof window.i18n_t === 'function' ? window.i18n_t('safeZones') : 'Safe zones'}</p>
          <p class="text-[10px] text-slate-500 mt-0.5">${typeof window.i18n_t === 'function' ? window.i18n_t('mapSubtitle') : 'Shelters · quakes · NASA events · live GPS'}</p>
        </div>
        <button type="button" onclick="mapHub_centerOnUser()" class="text-[10px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg cursor-pointer">
          ${typeof window.i18n_t === 'function' ? window.i18n_t('centerOnMe') : 'Center on me'}
        </button>
      </div>
      <div id="mapHub-gps-bar" class="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2 text-[10px]">
        <div class="flex items-center gap-1.5 min-w-0">
          <span id="mapHub-gps-dot" class="w-2 h-2 rounded-full bg-slate-300 flex-shrink-0"></span>
          <span id="mapHub-gps-status" class="font-medium text-slate-500 truncate">Acquiring GPS…</span>
        </div>
        <span id="mapHub-gps-coords" class="font-mono text-slate-600 truncate text-right">—</span>
      </div>
      <p class="text-[9px] text-slate-400 px-3 py-1 border-b border-slate-50">${typeof window.i18n_t === 'function' ? window.i18n_t('mapLegend') : 'Green shelters · red citizen geo alerts · amber quakes · violet EONET'}</p>
      <div id="mapHub-leaflet-map" class="w-full min-h-[380px]"></div>
      <div id="mapHub-nav-hud" class="hidden mx-3 mt-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 flex items-center gap-2 text-xs">
        <i class="fa-solid fa-route text-emerald-600"></i>
        <span id="mapHub-nav-hud-step" class="text-slate-800 font-medium flex-1 truncate">Routing…</span>
        <button type="button" onclick="mapHub_clearDirections()" class="text-[10px] font-semibold text-slate-500 uppercase cursor-pointer">Clear</button>
      </div>
      <div class="px-3 py-2.5 flex gap-2 border-t border-slate-100">
        <button type="button" onclick="mapHub_routeToNearestShelter()" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl text-xs cursor-pointer">
          ${typeof window.i18n_t === 'function' ? window.i18n_t('nearestSafeZone') : 'Nearest safe zone'}
        </button>
        <button type="button" onclick="mapHub_triggerEmergencySiren()" class="bg-rose-50 text-rose-600 border border-rose-100 font-semibold py-2.5 px-3 rounded-xl text-xs cursor-pointer">
          <i class="fa-solid fa-bell"></i>
        </button>
      </div>
      <div id="mapHub-shelter-sheet" class="absolute bottom-0 inset-x-0 bg-white border-t border-slate-200 rounded-t-2xl p-4 shadow-lg transition-transform duration-300 translate-y-full z-[1000] max-h-[50%] overflow-y-auto">
        <div class="w-8 h-1 bg-slate-200 rounded-full mx-auto mb-3"></div>
        <h3 id="mapHub-sheet-camp-name" class="text-sm font-bold text-slate-900">—</h3>
        <p id="mapHub-sheet-camp-address" class="text-xs text-slate-500 mt-0.5">—</p>
        <p id="mapHub-sheet-capacity-text" class="text-xs text-slate-600 mt-2 font-mono">—</p>
        <div class="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
          <div id="mapHub-sheet-capacity-bar" class="h-full bg-emerald-500 rounded-full" style="width:0%"></div>
        </div>
        <div id="mapHub-sheet-resources-container" class="flex flex-wrap gap-1 mt-2"></div>
        <button type="button" id="mapHub-sheet-route-btn" class="w-full mt-3 bg-indigo-600 text-white font-semibold py-2.5 rounded-xl text-xs cursor-pointer">Walking route</button>
        <button type="button" id="mapHub-sheet-external-btn" class="w-full mt-2 text-slate-600 text-xs py-2 cursor-pointer">Open in OpenStreetMap</button>
        <button type="button" onclick="mapHub_closeShelterSheet()" class="w-full mt-1 text-slate-400 text-[10px] py-1 cursor-pointer">Close</button>
      </div>
    </div>
  `;
}

function mapHub_refreshMap(cityKey, rebuild) {
  if (!mapHub_isLeafletReady()) {
    console.warn('mapHub: Leaflet not loaded');
    return;
  }
  if (rebuild) mapHub_buildMap(cityKey);
  else if (mapHub_map) setTimeout(() => mapHub_map.invalidateSize(), 150);
}

function mapHub_destroyMap() {
  mapHub_clearShelterMarkers();
  mapHub_clearHazardMarkers();
  mapHub_clearSignalMarkers();
  mapHub_clearDirections();
  mapHub_removeUserFromMap();
  if (mapHub_map) {
    mapHub_map.remove();
    mapHub_map = null;
  }
}

function mapHub_removeUserFromMap() {
  if (mapHub_userMarker && mapHub_map) {
    mapHub_map.removeLayer(mapHub_userMarker);
    mapHub_userMarker = null;
  }
  if (mapHub_accuracyCircle && mapHub_map) {
    mapHub_map.removeLayer(mapHub_accuracyCircle);
    mapHub_accuracyCircle = null;
  }
}

function mapHub_buildMap(cityKey) {
  const city = mapHub_citiesData[cityKey] || mapHub_citiesData.Bengaluru;
  const mapEl = document.getElementById('mapHub-leaflet-map');
  if (!mapEl || !mapHub_isLeafletReady()) return;

  mapHub_destroyMap();

  mapHub_map = L.map(mapEl, { zoomControl: true }).setView([city.lat, city.lon], city.zoom);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mapHub_map);

  city.shelters.forEach((s) => {
    const m = L.marker([s.lat, s.lng], { icon: mapHub_shelterIcon() }).addTo(mapHub_map);
    m.bindPopup(`<strong>${s.name}</strong><br><span style="font-size:11px">${s.address}</span>`);
    m.on('click', () => mapHub_selectShelter(s.id, cityKey));
    mapHub_shelterMarkers.push(m);
  });

  mapHub_renderCommunityHazards(cityKey);
  mapHub_renderSignalMarkers();
  mapHub_ensureLiveTracking();
  if (mapHub_userPosition) {
    mapHub_syncUserOnMap();
    mapHub_map.panTo([mapHub_userPosition.lat, mapHub_userPosition.lng], mapHub_map.getZoom());
  } else {
    mapHub_updateGpsBar();
  }

  setTimeout(() => mapHub_map.invalidateSize(), 200);
}

function mapHub_renderCommunityHazards(cityKey) {
  mapHub_clearHazardMarkers();
  const hazards =
    typeof window.alertFeed_getCommunityReports === 'function'
      ? window.alertFeed_getCommunityReports(cityKey)
      : [];
  hazards.forEach((h) => {
    if (h.lat == null || h.lon == null) return;
    const m = L.marker([h.lat, h.lon], {
      icon: mapHub_hazardIcon(h.alertType, h.category)
    }).addTo(mapHub_map);
    m.bindPopup(mapHub_citizenPopupHtml(h));
    mapHub_hazardMarkers.push(m);
  });
}

function mapHub_clearShelterMarkers() {
  mapHub_shelterMarkers.forEach((m) => mapHub_map && mapHub_map.removeLayer(m));
  mapHub_shelterMarkers = [];
}

function mapHub_clearHazardMarkers() {
  mapHub_hazardMarkers.forEach((m) => mapHub_map && mapHub_map.removeLayer(m));
  mapHub_hazardMarkers = [];
}

function mapHub_clearSignalMarkers() {
  mapHub_earthquakeMarkers.forEach((m) => mapHub_map && mapHub_map.removeLayer(m));
  mapHub_eonetMarkers.forEach((m) => mapHub_map && mapHub_map.removeLayer(m));
  mapHub_earthquakeMarkers = [];
  mapHub_eonetMarkers = [];
}

function mapHub_renderSignalMarkers() {
  if (!mapHub_map) return;
  mapHub_clearSignalMarkers();

  const quakes =
    typeof window.signalsHub_getEarthquakes === 'function' ? window.signalsHub_getEarthquakes() : [];
  quakes.forEach((eq) => {
    if (eq.lat == null || eq.lon == null) return;
    const m = L.marker([eq.lat, eq.lon], { icon: mapHub_earthquakeIcon(eq.mag) }).addTo(mapHub_map);
    m.bindPopup(
      `<strong>M${eq.mag?.toFixed(1)} earthquake</strong><br>${eq.place || ''}<br><em style="font-size:10px">${eq.timeAgo || ''}</em>` +
        (eq.url ? `<br><a href="${eq.url}" target="_blank" rel="noopener">USGS details</a>` : '')
    );
    mapHub_earthquakeMarkers.push(m);
  });

  const eonet =
    typeof window.signalsHub_getEonetEvents === 'function' ? window.signalsHub_getEonetEvents() : [];
  eonet.forEach((e) => {
    const m = L.marker([e.lat, e.lon], { icon: mapHub_eonetIcon(e.categoryId) }).addTo(mapHub_map);
    m.bindPopup(
      `<strong>${e.title}</strong><br>${e.category}<br><span style="font-size:10px">${e.distanceKm} km away · NASA EONET</span>`
    );
    mapHub_eonetMarkers.push(m);
  });
}

window.mapHub_refreshSignalMarkers = function () {
  if (mapHub_map && mapHub_mapTabActive) mapHub_renderSignalMarkers();
};

function mapHub_startLiveTracking() {
  if (!navigator.geolocation) {
    mapHub_positionMeta.error = 'Geolocation not supported';
    mapHub_updateGpsBar();
    return;
  }
  if (mapHub_geoWatchId !== null) return;
  mapHub_geoWatchId = navigator.geolocation.watchPosition(
    mapHub_onPositionUpdate,
    mapHub_onPositionError,
    { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
  );
}

function mapHub_onPositionUpdate(pos) {
  const prev = mapHub_userPosition;
  mapHub_userPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude };
  mapHub_positionMeta = {
    accuracy: pos.coords.accuracy,
    heading: pos.coords.heading,
    speed: pos.coords.speed,
    updatedAt: pos.timestamp || Date.now(),
    error: null
  };
  mapHub_updateGpsBar();
  if (mapHub_map && mapHub_mapTabActive) {
    mapHub_syncUserOnMap();
    if (mapHub_followUser) {
      mapHub_map.panTo([mapHub_userPosition.lat, mapHub_userPosition.lng], { animate: true, duration: 0.35 });
    }
  }
  if (mapHub_activeRouteCamp && prev) {
    const movedM =
      mapHub_haversineKm(prev.lat, prev.lng, mapHub_userPosition.lat, mapHub_userPosition.lng) * 1000;
    if (movedM > 40) mapHub_scheduleRouteRefresh();
  }

  window.dispatchEvent(
    new CustomEvent('resqnet-live-gps', { detail: window.mapHub_getLivePosition() })
  );
}

function mapHub_onPositionError(err) {
  mapHub_positionMeta.error = err.message || 'Location denied';
  mapHub_updateGpsBar();
}

function mapHub_updateGpsBar() {
  const dot = document.getElementById('mapHub-gps-dot');
  const status = document.getElementById('mapHub-gps-status');
  const coords = document.getElementById('mapHub-gps-coords');
  if (!status) return;

  if (mapHub_positionMeta.error) {
    if (dot) dot.className = 'w-2 h-2 rounded-full bg-rose-500 flex-shrink-0';
    status.textContent = 'Location off';
    if (coords) coords.textContent = 'Enable in browser';
    return;
  }
  if (!mapHub_userPosition) {
    if (dot) dot.className = 'w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0';
    status.textContent = 'Getting GPS…';
    if (coords) coords.textContent = '';
    return;
  }
  if (dot) dot.className = 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0';
  const acc = mapHub_positionMeta.accuracy != null ? ` ±${Math.round(mapHub_positionMeta.accuracy)}m` : '';
  status.textContent = `Live${acc}`;
  if (coords) coords.textContent = `${mapHub_userPosition.lat.toFixed(5)}, ${mapHub_userPosition.lng.toFixed(5)}`;
}

function mapHub_syncUserOnMap() {
  if (!mapHub_map || !mapHub_userPosition) return;
  const latLng = [mapHub_userPosition.lat, mapHub_userPosition.lng];
  const acc = mapHub_positionMeta.accuracy;

  if (!mapHub_userMarker) {
    mapHub_userMarker = L.marker(latLng, { icon: mapHub_userIcon(), zIndexOffset: 1000 })
      .addTo(mapHub_map)
      .bindPopup('Your live location');
  } else {
    mapHub_userMarker.setLatLng(latLng);
  }

  if (acc != null && acc > 0) {
    if (!mapHub_accuracyCircle) {
      mapHub_accuracyCircle = L.circle(latLng, {
        radius: acc,
        color: '#4f46e5',
        fillColor: '#4f46e5',
        fillOpacity: 0.12,
        weight: 1,
        opacity: 0.45
      }).addTo(mapHub_map);
    } else {
      mapHub_accuracyCircle.setLatLng(latLng);
      mapHub_accuracyCircle.setRadius(acc);
    }
  } else if (mapHub_accuracyCircle) {
    mapHub_map.removeLayer(mapHub_accuracyCircle);
    mapHub_accuracyCircle = null;
  }
}

function mapHub_centerOnUser() {
  mapHub_followUser = true;
  mapHub_ensureLiveTracking();
  if (!mapHub_userPosition) {
    navigator.geolocation.getCurrentPosition(mapHub_onPositionUpdate, mapHub_onPositionError, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 15000
    });
    return;
  }
  if (mapHub_map) {
    mapHub_map.setView([mapHub_userPosition.lat, mapHub_userPosition.lng], Math.max(mapHub_map.getZoom(), 15));
  }
}

function mapHub_scheduleRouteRefresh() {
  if (!mapHub_activeRouteCamp) return;
  if (mapHub_routeRefreshTimer) clearTimeout(mapHub_routeRefreshTimer);
  mapHub_routeRefreshTimer = setTimeout(() => {
    if (mapHub_activeRouteCamp) mapHub_showDirections(mapHub_activeRouteCamp, true);
  }, 2500);
}

function mapHub_selectShelter(campId, cityKey) {
  const city = mapHub_citiesData[cityKey];
  const camp = city && city.shelters.find((s) => s.id === campId);
  if (!camp) return;

  document.getElementById('mapHub-sheet-camp-name').textContent = camp.name;
  document.getElementById('mapHub-sheet-camp-address').textContent = camp.address;
  document.getElementById('mapHub-sheet-capacity-text').textContent = camp.capacityText;
  document.getElementById('mapHub-sheet-capacity-bar').style.width = `${camp.capacityPercent}%`;

  const badgeContainer = document.getElementById('mapHub-sheet-resources-container');
  badgeContainer.innerHTML = '';
  camp.resources.forEach((r) => {
    const b = document.createElement('span');
    b.className = 'text-[9px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600';
    b.textContent = r;
    badgeContainer.appendChild(b);
  });

  document.getElementById('mapHub-sheet-route-btn').onclick = () => mapHub_showDirections(camp);
  document.getElementById('mapHub-sheet-external-btn').onclick = () => mapHub_openExternalMaps(camp);

  document.getElementById('mapHub-shelter-sheet').classList.remove('translate-y-full');
  document.getElementById('mapHub-shelter-sheet').classList.add('translate-y-0');
  if (mapHub_map) mapHub_map.setView([camp.lat, camp.lng], Math.max(mapHub_map.getZoom(), 14));
}

function mapHub_closeShelterSheet() {
  const sheet = document.getElementById('mapHub-shelter-sheet');
  if (sheet) {
    sheet.classList.add('translate-y-full');
    sheet.classList.remove('translate-y-0');
  }
}

async function mapHub_showDirections(camp, isRefresh) {
  if (!isRefresh) mapHub_closeShelterSheet();
  if (!mapHub_map) return;

  mapHub_activeRouteCamp = camp;
  mapHub_ensureLiveTracking();

  if (!mapHub_userPosition) {
    const hud = document.getElementById('mapHub-nav-hud');
    const hudText = document.getElementById('mapHub-nav-hud-step');
    if (hud) hud.classList.remove('hidden');
    if (hudText) hudText.textContent = 'Allow location for live routing';
    return;
  }

  const origin = mapHub_userPosition;
  const hud = document.getElementById('mapHub-nav-hud');
  const hudText = document.getElementById('mapHub-nav-hud-step');
  if (hud) hud.classList.remove('hidden');
  if (hudText) hudText.textContent = `Routing to ${camp.name}…`;

  const osrmUrl =
    `https://router.project-osrm.org/route/v1/foot/` +
    `${origin.lng},${origin.lat};${camp.lng},${camp.lat}` +
    `?overview=full&geometries=geojson`;

  try {
    const res = await fetch(osrmUrl);
    const data = await res.json();
    if (data.code === 'Ok' && data.routes && data.routes[0]) {
      const route = data.routes[0];
      const latLngs = route.geometry.coordinates.map((c) => [c[1], c[0]]);
      mapHub_clearRouteLayerOnly();
      mapHub_routeLayer = L.polyline(latLngs, { color: '#4f46e5', weight: 5, opacity: 0.9 }).addTo(mapHub_map);
      mapHub_map.fitBounds(mapHub_routeLayer.getBounds(), { padding: [48, 48] });
      const km = (route.distance / 1000).toFixed(1);
      const min = Math.max(1, Math.round(route.duration / 60));
      if (hudText) hudText.textContent = `${km} km · ~${min} min walk`;
      mapHub_activeRouteCamp = camp;
    } else {
      mapHub_drawStraightLine(origin, camp);
      if (hudText) hudText.textContent = `Direct line to ${camp.name}`;
    }
  } catch {
    mapHub_drawStraightLine(origin, camp);
    if (hudText) hudText.textContent = `Direct line to ${camp.name}`;
  }
}

function mapHub_clearRouteLayerOnly() {
  if (mapHub_routeLayer && mapHub_map) {
    mapHub_map.removeLayer(mapHub_routeLayer);
    mapHub_routeLayer = null;
  }
}

function mapHub_drawStraightLine(origin, camp) {
  mapHub_clearRouteLayerOnly();
  mapHub_routeLayer = L.polyline(
    [
      [origin.lat, origin.lng],
      [camp.lat, camp.lng]
    ],
    { color: '#4f46e5', weight: 4, dashArray: '8, 8', opacity: 0.75 }
  ).addTo(mapHub_map);
  mapHub_map.fitBounds(mapHub_routeLayer.getBounds(), { padding: [48, 48] });
}

function mapHub_openExternalMaps(camp) {
  const cityKey = (window.appState && window.appState.currentCity) || 'Bengaluru';
  const city = mapHub_citiesData[cityKey] || mapHub_citiesData.Bengaluru;
  const origin = mapHub_userPosition || { lat: city.lat, lng: city.lon };
  const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_foot&route=${origin.lat},${origin.lng};${camp.lat},${camp.lng}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function mapHub_clearDirections() {
  mapHub_activeRouteCamp = null;
  if (mapHub_routeRefreshTimer) clearTimeout(mapHub_routeRefreshTimer);
  mapHub_clearRouteLayerOnly();
  const hud = document.getElementById('mapHub-nav-hud');
  if (hud) hud.classList.add('hidden');
}

function mapHub_routeToNearestShelter() {
  const cityKey = (window.appState && window.appState.currentCity) || 'Bengaluru';
  const city = mapHub_citiesData[cityKey] || mapHub_citiesData.Bengaluru;
  mapHub_ensureLiveTracking();
  const origin = mapHub_userPosition || { lat: city.lat, lng: city.lon };
  let nearest = city.shelters[0];
  let minD = Infinity;
  city.shelters.forEach((s) => {
    const d = mapHub_haversineKm(origin.lat, origin.lng, s.lat, s.lng);
    if (d < minD) {
      minD = d;
      nearest = s;
    }
  });
  mapHub_selectShelter(nearest.id, cityKey);
  mapHub_showDirections(nearest);
}

function mapHub_haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

window.mapHub_openNearestSafeZone = function () {
  if (window.foundApp_switchTab) window.foundApp_switchTab('map');
  setTimeout(() => mapHub_routeToNearestShelter(), 500);
};

function mapHub_triggerEmergencySiren() {
  if (typeof window.sirenHub_trigger === 'function') {
    window.sirenHub_trigger(null);
  } else if (window.appState) {
    window.appState.update('isSirenActive', true);
  }
}

function mapHub_muteSiren() {
  if (typeof window.sirenHub_dismiss === 'function') {
    window.sirenHub_dismiss();
  } else if (window.appState) {
    window.appState.update('isSirenActive', false);
  }
}

function mapHub_checkSirenStatus(isActive) {
  if (typeof window.sirenHub_syncOverlay === 'function') {
    window.sirenHub_syncOverlay(isActive);
  }
}

document.addEventListener('DOMContentLoaded', mapHub_initModule);
