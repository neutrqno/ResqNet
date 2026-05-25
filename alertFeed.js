/**
 * ResqNet Mobile - Alerts & Incident Feed Module
 * 
 * Strict Code Isolation Contract:
 * All top-level variables and functions are prefixed with 'alertFeed_'.
 * Target Container: <div id="feed-slot"></div>
 */

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════════════════════
  // GLOBAL MODULE STATE
  // ═══════════════════════════════════════════════════════════
  let alertFeed_expandedCards = {}; // Key: Alert ID (string) -> Value: Boolean (expanded)
  let alertFeed_hazardReportState = {
    step: 'idle', // 'idle' | 'completed'
    alertType: 'hazard',
    category: 'waterlogging',
    description: '',
    landmark: '',
    reporterLabel: '',
    draftGeo: null,
    lastSubmitted: null,
    fileName: '',
    result: null
  };
  let alertFeed_familyTrackerLogs = []; // Array of log objects: { type: 'safe'|'help', time: string, payload: string }

  // Coordinates data for simulating exact GPS coordinates by city
  const alertFeed_cityCoords = {
    'Bengaluru': { lat: 12.9716, lon: 77.5946 },
    'Mumbai': { lat: 18.9750, lon: 72.8258 },
    'Chennai': { lat: 13.0827, lon: 80.2707 },
    'Delhi': { lat: 28.6139, lon: 77.2090 },
    'Kolkata': { lat: 22.5726, lon: 88.3639 },
    'Hyderabad': { lat: 17.3850, lon: 78.4867 },
    'Pune': { lat: 18.5204, lon: 73.8567 },
    'Ahmedabad': { lat: 23.0225, lon: 72.5714 },
    'Tokyo': { lat: 35.6762, lon: 139.6503 }
  };

  const alertFeed_STORAGE_KEY = 'resqnet_community_alerts_v1';

  let alertFeed_reportsCache = [];
  let alertFeed_reportsCity = '';
  let alertFeed_dbOnline = null;
  let alertFeed_syncing = false;

  const alertFeed_categoryLabels = {
    sos: 'Life-threatening emergency',
    fire: 'Fire / smoke',
    medical: 'Medical emergency',
    trapped: 'People trapped / rescue needed',
    waterlogging: 'Flooding / waterlogging',
    treefall: 'Tree fall / blocked road',
    powergrid: 'Power line / grid hazard',
    structural: 'Structural damage'
  };

  const alertFeed_categoryTier = {
    sos: 'severe',
    fire: 'severe',
    medical: 'severe',
    trapped: 'severe',
    waterlogging: 'severe',
    powergrid: 'severe',
    structural: 'serious',
    treefall: 'relatively'
  };

  const alertFeed_alertTypeLabels = {
    emergency: 'Emergency SOS',
    hazard: 'Hazard report',
    watch: 'Situation watch'
  };

  function alertFeed_formatGeoTag(lat, lon) {
    const latH = lat >= 0 ? 'N' : 'S';
    const lonH = lon >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(6)}°${latH}, ${Math.abs(lon).toFixed(6)}°${lonH}`;
  }

  function alertFeed_mapStoredReport(r) {
    return {
      id: r.id,
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
      geoTag: r.geoTag || alertFeed_formatGeoTag(r.lat, r.lon),
      reportedAt: r.reportedAt,
      timeAgo: alertFeed_timeAgo(r.reportedAt),
      category: r.category,
      source: 'citizen'
    };
  }

  function alertFeed_loadAllReports() {
    try {
      const raw = localStorage.getItem(alertFeed_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function alertFeed_saveAllReports(list) {
    localStorage.setItem(alertFeed_STORAGE_KEY, JSON.stringify(list));
  }

  function alertFeed_timeAgo(iso) {
    const sec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (sec < 60) return 'Just now';
    if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
    if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
    return `${Math.floor(sec / 86400)}d ago`;
  }

  function alertFeed_getAlertsForCityLocal(city) {
    return alertFeed_loadAllReports()
      .filter((r) => r.city === city)
      .sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt))
      .map(alertFeed_mapStoredReport);
  }

  function alertFeed_saveLocalReport(report) {
    const list = alertFeed_loadAllReports();
    list.unshift(report);
    localStorage.setItem(alertFeed_STORAGE_KEY, JSON.stringify(list.slice(0, 200)));
  }

  async function alertFeed_syncReports(city) {
    alertFeed_syncing = true;
    const useDb = typeof window.dbApi_fetchReports === 'function';
    if (useDb) {
      try {
        alertFeed_dbOnline = await window.dbApi_isOnline();
        if (alertFeed_dbOnline) {
          alertFeed_reportsCache = await window.dbApi_fetchReports(city);
          alertFeed_reportsCity = city;
          alertFeed_syncing = false;
          return 'sql';
        }
      } catch (e) {
        console.warn('alertFeed: SQL API unavailable', e);
        alertFeed_dbOnline = false;
      }
    }
    alertFeed_reportsCache = alertFeed_getAlertsForCityLocal(city);
    alertFeed_reportsCity = city;
    alertFeed_syncing = false;
    return 'local';
  }

  async function alertFeed_syncCheckins(city) {
    if (typeof window.dbApi_fetchCheckins !== 'function' || !alertFeed_dbOnline) return;
    try {
      const rows = await window.dbApi_fetchCheckins(city, 20);
      if (rows.length) alertFeed_familyTrackerLogs = rows;
    } catch (e) {
      console.warn('alertFeed: check-ins load failed', e);
    }
  }

  function alertFeed_getAlertsForCity(city) {
    if (alertFeed_reportsCity === city) {
      return alertFeed_reportsCache;
    }
    return alertFeed_getAlertsForCityLocal(city);
  }

  window.alertFeed_getCommunityReports = function (city) {
    const c = city || 'Bengaluru';
    return alertFeed_getAlertsForCity(c);
  };

  function alertFeed_afterReportSaved(city) {
    if (typeof window.mapHub_refreshCommunityMarkers === 'function') {
      window.mapHub_refreshCommunityMarkers();
    }
    if (typeof window.signalsHub_refresh === 'function') {
      window.signalsHub_refresh(city);
    }
    if (window.appState && window.appState.currentTab === 'volunteer' && window.appState.listeners) {
      window.appState.listeners.forEach((cb) => cb(window.appState));
    }
  }

  async function alertFeed_addCommunityReport(report) {
    if (alertFeed_dbOnline && typeof window.dbApi_createReport === 'function') {
      try {
        const saved = await window.dbApi_createReport(report);
        alertFeed_reportsCache.unshift(saved);
        alertFeed_reportsCity = report.city;
        alertFeed_afterReportSaved(report.city);
        return saved;
      } catch (e) {
        console.warn('alertFeed: POST failed, saving locally', e);
      }
    }
    alertFeed_saveLocalReport(report);
    alertFeed_reportsCache = alertFeed_getAlertsForCityLocal(report.city);
    alertFeed_reportsCity = report.city;
    alertFeed_afterReportSaved(report.city);
    return report;
  }


  // ═══════════════════════════════════════════════════════════
  // MODULE STYLING INJECTION
  // ═══════════════════════════════════════════════════════════
  function alertFeed_injectStyles() {
    if (document.getElementById('alertFeed-dynamic-styles')) return;

    const styleEl = document.createElement('style');
    styleEl.id = 'alertFeed-dynamic-styles';
    styleEl.textContent = `
      @keyframes alertFeed-pulse-red-glow {
        0% { border-color: rgba(239, 68, 68, 0.45); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.15); }
        50% { border-color: rgba(255, 51, 51, 1); box-shadow: 0 0 14px 4px rgba(255, 51, 51, 0.35); }
        100% { border-color: rgba(239, 68, 68, 0.45); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.15); }
      }
      .alertFeed-border-flash-red {
        border-width: 3px !important;
        animation: alertFeed-pulse-red-glow 1.4s infinite ease-in-out;
      }
      .alertFeed-collapsible {
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-out;
      }
      .alertFeed-collapsible.expanded {
        max-height: 800px;
        opacity: 1;
      }
      @keyframes alertFeed-loader-spin {
        to { transform: rotate(360deg); }
      }
      .alertFeed-spinner {
        animation: alertFeed-loader-spin 1.2s linear infinite;
      }
      .alertFeed-log-row {
        font-family: 'Courier New', Courier, monospace;
        font-size: 10px;
        animation: alertFeed-fade-in-log 0.25s forwards ease-out;
      }
      @keyframes alertFeed-fade-in-log {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(styleEl);
  }

  // ═══════════════════════════════════════════════════════════
  // REACTIVE OBSERVER ROUTING
  // ═══════════════════════════════════════════════════════════
  function alertFeed_onStateUpdate(state) {
    const feedSlot = document.getElementById('feed-slot');
    if (!feedSlot) return;

    if (!state.isLoggedIn) {
      feedSlot.innerHTML = '';
      return;
    }

    const shouldDisplay = (state.currentTab === 'alerts') && (!state.isLowBandwidth);
    if (shouldDisplay && typeof window.mapHub_ensureLiveTracking === 'function') {
      window.mapHub_ensureLiveTracking();
    }
    
    if (!shouldDisplay) {
      // Hide or empty container to respect other tabs/low bandwidth override
      feedSlot.innerHTML = '';
      return;
    }

    alertFeed_renderLayout(feedSlot, state);
  }

  // ═══════════════════════════════════════════════════════════
  // INTEGRATED LAYOUT RENDERING ENGINE
  // ═══════════════════════════════════════════════════════════
  function alertFeed_t(key) {
    return typeof window.i18n_t === 'function' ? window.i18n_t(key) : key;
  }

  function alertFeed_dbStatusBadge() {
    if (alertFeed_syncing) {
      return `<span class="text-[9px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">${alertFeed_t('syncing')}</span>`;
    }
    if (alertFeed_dbOnline === true) {
      return `<span class="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full"><i class="fa-solid fa-database mr-0.5"></i> ${alertFeed_t('sqlBadge')}</span>`;
    }
    if (alertFeed_dbOnline === false) {
      return `<span class="text-[9px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">${alertFeed_t('offlineBadge')}</span>`;
    }
    return '';
  }

  function alertFeed_renderCommunityList(alertsList, currentCity) {
    if (alertFeed_syncing) {
      return `<div class="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-xs text-slate-500">
        <i class="fa-solid fa-circle-notch fa-spin text-indigo-500 mb-2"></i><br>${alertFeed_t('loadingDb')}
      </div>`;
    }
    if (alertsList.length > 0) {
      return alertsList.map((alert) => alertFeed_drawAlertCard(alert)).join('');
    }
    return `
      <div class="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center">
        <i class="fa-solid fa-shield text-slate-300 text-2xl mb-2"></i>
                <p class="text-sm font-medium text-slate-700">${alertFeed_t('noReportsYet')} ${currentCity}</p>
                <p class="text-xs text-slate-500 mt-1">${alertFeed_t('noReportsHint')}</p>
      </div>`;
  }

  async function alertFeed_renderLayout(container, state) {
    const currentCity = state.currentCity || 'Bengaluru';
    alertFeed_syncing = true;

    let html = `
      <div class="space-y-4 slide-up py-2 select-none">
        <div class="px-0.5 flex items-start justify-between gap-2">
          <div>
            <h2 class="text-base font-bold text-slate-900">${currentCity} ${typeof window.i18n_t === 'function' ? window.i18n_t('alertsTitle') : 'alerts'}</h2>
            <p class="text-xs text-slate-500 mt-0.5">${typeof window.i18n_t === 'function' ? window.i18n_t('alertsSubtitle') : 'Citizen geo-tagged alerts · live signals · SQL'}</p>
          </div>
          <span id="alertFeed-db-badge">${alertFeed_dbStatusBadge()}</span>
        </div>

        <div id="signals-hub-panel"></div>

        ${alertFeed_drawHazardReportPortal(currentCity)}
        ${alertFeed_drawFamilyCircleTracker(currentCity)}

        <div class="space-y-2">
          <div class="flex items-center justify-between px-0.5">
            <h3 class="text-xs font-semibold text-slate-700">${typeof window.i18n_t === 'function' ? window.i18n_t('communityReports') : 'Citizen alerts'} (<span id="alertFeed-report-count">…</span>)</h3>
          </div>
          <div class="space-y-2" id="alertFeed-cards-list">
            ${alertFeed_renderCommunityList([], currentCity)}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    if (typeof window.signalsHub_refresh === 'function') {
      window.signalsHub_refresh(currentCity);
    } else if (typeof window.signalsHub_refreshUI === 'function') {
      window.signalsHub_refreshUI();
    }

    alertFeed_bindEventListeners(alertFeed_getAlertsForCity(currentCity));

    await alertFeed_syncReports(currentCity);
    await alertFeed_syncCheckins(currentCity);

    const alertsList = alertFeed_getAlertsForCity(currentCity);
    const listEl = document.getElementById('alertFeed-cards-list');
    const countEl = document.getElementById('alertFeed-report-count');
    const badgeEl = document.getElementById('alertFeed-db-badge');
    if (countEl) countEl.textContent = String(alertsList.length);
    if (listEl) listEl.innerHTML = alertFeed_renderCommunityList(alertsList, currentCity);
    if (badgeEl) badgeEl.innerHTML = alertFeed_dbStatusBadge();
    alertFeed_bindEventListeners(alertsList);
    if (typeof window.mapHub_refreshCommunityMarkers === 'function') {
      window.mapHub_refreshCommunityMarkers();
    }
  }

  // ═══════════════════════════════════════════════════════════
  // WIDGET DRAWING SUB-FUNCTIONS
  // ═══════════════════════════════════════════════════════════

  // Draw Family Circle Tracker Card Layout
  function alertFeed_drawFamilyCircleTracker(city) {
    const coords = alertFeed_cityCoords[city] || alertFeed_cityCoords['Bengaluru'];
    
    // Draw logs
    let logsHtml = '';
    if (alertFeed_familyTrackerLogs.length > 0) {
      logsHtml = `
        <div class="mt-4 border-t border-slate-100 pt-3.5 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-[9px] font-black uppercase text-indigo-600 tracking-wider">SMS Telemetry Logs</span>
            <button onclick="alertFeed_clearFamilyLogs()" class="text-[9px] font-extrabold text-slate-400 hover:text-rose-500 transition-colors uppercase">Clear Logs</button>
          </div>
          <div class="space-y-2 max-h-40 overflow-y-auto pr-1">
            ${alertFeed_familyTrackerLogs.map(log => `
              <div class="bg-slate-50 border border-slate-100 rounded-xl p-3 font-mono text-[10.5px] leading-relaxed shadow-sm slide-up">
                <div class="flex items-center justify-between text-[9px] border-b border-slate-200/50 pb-1 mb-1.5 font-sans">
                  <span class="font-black text-slate-700 flex items-center gap-1">
                    <i class="fa-solid fa-satellite-dish text-[9px] ${log.type === 'help' ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}"></i>
                    ${log.type === 'help' ? '🚨 REQUEST HELP SEND' : '✅ SAFE BEACON BROADCAST'}
                  </span>
                  <span class="text-slate-400 font-bold font-mono">${log.time}</span>
                </div>
                <div class="text-slate-500 text-[9.5px]">
                  <strong>Target:</strong> Family Group (3 members)<br>
                  <strong>GPS:</strong> Lat ${log.lat.toFixed(6)}°, Lon ${log.lon.toFixed(6)}°
                  ${log.liveGps ? ' <span class="text-emerald-600 font-bold">(LIVE)</span>' : ' <span class="text-amber-600">(approx.)</span>'}<br>
                  <strong>Source:</strong> ${log.liveGps ? 'Device geolocation' : 'City fallback'}
                </div>
                <div class="bg-white border border-slate-100 rounded-lg p-2 mt-1.5 text-slate-800 italic leading-snug">
                  "${log.payload}"
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    return `
      <div class="bg-white border border-slate-200 rounded-xl p-4">
        <h3 class="text-sm font-semibold text-slate-900 mb-1">${alertFeed_t('familyCheckin')}</h3>
        <p class="text-xs text-slate-500 mb-3">${alertFeed_t('familyCheckinDesc')}</p>
        <div class="grid grid-cols-2 gap-2">
          <button id="alertFeed-btn-safe" class="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl text-xs cursor-pointer">
            ${alertFeed_t('iAmSafe')}
          </button>
          <button id="alertFeed-btn-help" class="bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3 rounded-xl text-xs cursor-pointer">
            ${alertFeed_t('requestHelp')}
          </button>
        </div>
        ${logsHtml}
      </div>
    `;
  }

  function alertFeed_drawGeoTagPanel(geo, city) {
    if (!geo) {
      return `
        <div id="alertFeed-geo-panel" class="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-3 text-center">
          <i class="fa-solid fa-location-crosshairs text-slate-300 text-lg mb-1"></i>
          <p class="text-xs text-slate-500">${alertFeed_t('acquiringGps')}</p>
          <button type="button" id="alertFeed-btn-refresh-geo" class="mt-2 text-[10px] font-semibold text-indigo-600">${alertFeed_t('refreshGps')}</button>
        </div>`;
    }
    const liveBadge = geo.live
      ? `<span class="text-[9px] font-bold uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">${alertFeed_t('liveGps')}</span>`
      : `<span class="text-[9px] font-bold uppercase text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">${alertFeed_t('cityFallback')}</span>`;
    const acc =
      geo.accuracy != null ? `<span class="text-[10px] text-slate-500">±${Math.round(geo.accuracy)} m</span>` : '';
    const osm = `https://www.openstreetmap.org/?mlat=${geo.lat}&mlon=${geo.lon}#map=17/${geo.lat}/${geo.lon}`;

    return `
      <div id="alertFeed-geo-panel" class="bg-indigo-50/80 border border-indigo-100 rounded-xl p-3">
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="text-[10px] font-black uppercase text-indigo-700 tracking-wide flex items-center gap-1">
            <i class="fa-solid fa-map-pin"></i> ${alertFeed_t('geoTag')}
          </span>
          ${liveBadge}
        </div>
        <p class="font-mono text-xs font-bold text-slate-800 leading-relaxed">${geo.geoTag}</p>
        <p class="font-mono text-[10px] text-slate-500 mt-0.5">Lat ${geo.lat.toFixed(6)} · Lon ${geo.lon.toFixed(6)} ${acc}</p>
        <p class="text-[10px] text-slate-500 mt-1">${city} · attached to this alert</p>
        <div class="flex gap-2 mt-2">
          <button type="button" id="alertFeed-btn-refresh-geo" class="flex-1 text-[10px] font-semibold text-indigo-700 bg-white border border-indigo-100 py-1.5 rounded-lg">${alertFeed_t('refreshGps')}</button>
          <a href="${osm}" target="_blank" rel="noopener" class="flex-1 text-center text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 py-1.5 rounded-lg">${alertFeed_t('previewMap')}</a>
        </div>
      </div>`;
  }

  function alertFeed_categoryOptions(alertType) {
    const emergency = ['sos', 'fire', 'medical', 'trapped'];
    const hazard = ['waterlogging', 'treefall', 'powergrid', 'structural'];
    const watch = ['waterlogging', 'treefall', 'structural'];
    const keys = alertType === 'emergency' ? emergency : alertType === 'watch' ? watch : hazard;
    return keys
      .map(
        (k) =>
          `<option value="${k}" ${alertFeed_hazardReportState.category === k ? 'selected' : ''}>${alertFeed_categoryLabels[k]}</option>`
      )
      .join('');
  }

  function alertFeed_drawHazardReportPortal(city) {
    const state = alertFeed_hazardReportState;
    alertFeed_syncDraftGeo(city);

    if (state.step === 'completed' && state.result) {
      const sub = state.lastSubmitted;
      const geoLine = sub
        ? `<p class="text-[10px] font-mono text-emerald-800 mt-2 bg-white/60 rounded-lg px-2 py-1.5"><i class="fa-solid fa-map-pin mr-1"></i>${sub.geoTag}</p>`
        : '';
      return `
        <div class="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
          <p class="text-sm font-semibold text-emerald-800">${alertFeed_t('reportPublished')}</p>
          <p class="text-xs text-emerald-700 mt-1">${alertFeed_t('reportPublishedHint')} ${city}.</p>
          ${geoLine}
          <button id="alertFeed-btn-hazard-reset" class="mt-3 text-xs font-semibold text-emerald-800 underline cursor-pointer">${alertFeed_t('reportAnother')}</button>
        </div>
      `;
    }

    const submitLabel =
      state.alertType === 'emergency' ? alertFeed_t('sendEmergency') : alertFeed_t('publishGeo');
    const submitClass =
      state.alertType === 'emergency'
        ? 'bg-rose-600 hover:bg-rose-500'
        : 'bg-indigo-600 hover:bg-indigo-500';

    return `
      <div class="bg-white border-2 border-indigo-100 rounded-xl p-4 shadow-sm">
        <div class="flex items-start gap-2 mb-3">
          <div class="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
            <i class="fa-solid fa-triangle-exclamation text-rose-600 text-sm"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900">${alertFeed_t('citizenEmergency')}</h3>
            <p class="text-xs text-slate-500 mt-0.5">${alertFeed_t('citizenEmergencyDesc')}</p>
          </div>
        </div>

        ${alertFeed_drawGeoTagPanel(state.draftGeo, city)}

        <div class="space-y-3 mt-3">
          <div>
            <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">${alertFeed_t('alertLevel')}</label>
            <select id="alertFeed-input-alert-type" class="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800">
              <option value="emergency" ${state.alertType === 'emergency' ? 'selected' : ''}>${alertFeed_t('emergencySos')}</option>
              <option value="hazard" ${state.alertType === 'hazard' ? 'selected' : ''}>${alertFeed_t('hazardReport')}</option>
              <option value="watch" ${state.alertType === 'watch' ? 'selected' : ''}>${alertFeed_t('situationWatch')}</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">${alertFeed_t('incidentType')}</label>
            <select id="alertFeed-input-category" class="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800">
              ${alertFeed_categoryOptions(state.alertType)}
            </select>
          </div>
          <div>
            <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">${alertFeed_t('landmark')}</label>
            <input id="alertFeed-input-landmark" type="text" placeholder="e.g. Near Metro gate 2, 4th Block"
              value="${(state.landmark || '').replace(/"/g, '&quot;')}"
              class="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">${alertFeed_t('yourName')}</label>
            <input id="alertFeed-input-reporter" type="text" placeholder="Anonymous citizen"
              value="${(state.reporterLabel || '').replace(/"/g, '&quot;')}"
              class="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">${alertFeed_t('whatHappening')}</label>
            <textarea id="alertFeed-input-description" rows="3" placeholder="Describe the emergency, people at risk, access routes…"
              class="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none">${state.description || ''}</textarea>
          </div>
          <button id="alertFeed-btn-submit" class="w-full ${submitClass} text-white font-bold py-3 rounded-xl text-sm cursor-pointer shadow-md">
            <i class="fa-solid fa-location-dot mr-1"></i> ${submitLabel}
          </button>
        </div>
      </div>
    `;
  }

  function alertFeed_drawAlertCard(alert) {
    const tierStyles = {
      severe: { border: 'border-l-rose-500', badge: 'bg-rose-100 text-rose-700', label: 'Severe' },
      serious: { border: 'border-l-amber-500', badge: 'bg-amber-100 text-amber-800', label: 'Serious' },
      relatively: { border: 'border-l-yellow-400', badge: 'bg-yellow-100 text-yellow-800', label: 'Moderate' },
      standard: { border: 'border-l-blue-400', badge: 'bg-blue-100 text-blue-700', label: 'Standard' }
    };
    const s = tierStyles[alert.tier] || tierStyles.standard;
    const typeLabel = alertFeed_alertTypeLabels[alert.alertType] || 'Alert';
    const isEmergency = alert.alertType === 'emergency' || alert.category === 'sos';
    const gpsBadge = alert.liveGps
      ? '<span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Live GPS</span>'
      : '<span class="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Approx</span>';
    const acc =
      alert.accuracyM != null ? `<span class="text-[9px] text-slate-400">±${Math.round(alert.accuracyM)}m</span>` : '';
    const landmark = alert.landmark
      ? `<p class="text-[10px] text-slate-500 mt-1"><i class="fa-solid fa-landmark text-slate-400 mr-1"></i>${alert.landmark}</p>`
      : '';
    const reporter = alert.reporterLabel && alert.reporterLabel !== 'Citizen'
      ? `<span class="text-[10px] text-slate-400"> · ${alert.reporterLabel}</span>`
      : '';

    return `
      <article class="bg-white border border-slate-200 border-l-4 ${s.border} rounded-xl p-3.5 ${isEmergency ? 'ring-1 ring-rose-100' : ''}">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-1.5 mb-1">
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.badge}">${s.label}</span>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">${typeLabel}</span>
              <span class="text-[10px] text-slate-400">${alert.timeAgo}${reporter}</span>
            </div>
            <h4 class="text-sm font-semibold text-slate-900 leading-snug">${alert.title}</h4>
            <p class="text-xs text-slate-600 mt-1 leading-relaxed">${alert.description}</p>
            ${landmark}
            <div class="mt-2 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-2 flex flex-wrap items-center gap-1.5">
              <i class="fa-solid fa-map-pin text-indigo-500 text-[10px]"></i>
              <span class="font-mono text-[10px] font-semibold text-slate-800">${alert.geoTag || alertFeed_formatGeoTag(alert.lat, alert.lon)}</span>
              ${gpsBadge}
              ${acc}
            </div>
          </div>
        </div>
        <button type="button" class="alertFeed-view-map mt-2.5 text-xs font-semibold text-indigo-600 hover:underline cursor-pointer" data-lat="${alert.lat}" data-lng="${alert.lon}" data-id="${alert.id}">
          ${alertFeed_t('viewOnMap')}
        </button>
      </article>
    `;
  }

  // ═══════════════════════════════════════════════════════════
  // INTERACTIVE EVENT LISTENERS ATTACHMENT
  // ═══════════════════════════════════════════════════════════
  function alertFeed_bindEventListeners(alertsList) {
    const feedSlot = document.getElementById('feed-slot');
    if (!feedSlot) return;

    feedSlot.querySelectorAll('.alertFeed-view-map').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (window.foundApp_switchTab) window.foundApp_switchTab('map');
        const lat = parseFloat(btn.getAttribute('data-lat'));
        const lng = parseFloat(btn.getAttribute('data-lng'));
        if (typeof window.mapHub_panToLocation === 'function' && !isNaN(lat) && !isNaN(lng)) {
          setTimeout(() => window.mapHub_panToLocation(lat, lng, 16), 500);
        }
      });
    });

    // Family check-in buttons
    const btnSafe = feedSlot.querySelector('#alertFeed-btn-safe');
    const btnHelp = feedSlot.querySelector('#alertFeed-btn-help');

    if (btnSafe) {
      btnSafe.addEventListener('click', () => {
        alertFeed_triggerSafetyBroadcast('safe');
      });
    }

    if (btnHelp) {
      btnHelp.addEventListener('click', () => {
        alertFeed_triggerSafetyBroadcast('help');
      });
    }

    const btnRefreshGeo = feedSlot.querySelector('#alertFeed-btn-refresh-geo');
    if (btnRefreshGeo) {
      btnRefreshGeo.addEventListener('click', () => alertFeed_refreshDraftGeo());
    }

    const inputAlertType = feedSlot.querySelector('#alertFeed-input-alert-type');
    if (inputAlertType) {
      inputAlertType.addEventListener('change', () => {
        alertFeed_hazardReportState.alertType = inputAlertType.value;
        const cats = { emergency: 'sos', hazard: 'waterlogging', watch: 'waterlogging' };
        alertFeed_hazardReportState.category = cats[inputAlertType.value] || 'waterlogging';
        alertFeed_onStateUpdate(window.appState);
      });
    }

    const btnSubmit = feedSlot.querySelector('#alertFeed-btn-submit');
    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => {
        const inputCategory = feedSlot.querySelector('#alertFeed-input-category');
        const inputDesc = feedSlot.querySelector('#alertFeed-input-description');
        const inputLandmark = feedSlot.querySelector('#alertFeed-input-landmark');
        const inputReporter = feedSlot.querySelector('#alertFeed-input-reporter');
        const inputAlertType = feedSlot.querySelector('#alertFeed-input-alert-type');
        alertFeed_submitCitizenAlert({
          alertType: inputAlertType ? inputAlertType.value : 'hazard',
          category: inputCategory ? inputCategory.value : 'waterlogging',
          description: inputDesc ? inputDesc.value.trim() : '',
          landmark: inputLandmark ? inputLandmark.value.trim() : '',
          reporterLabel: inputReporter ? inputReporter.value.trim() : ''
        });
      });
    }

    const btnReset = feedSlot.querySelector('#alertFeed-btn-hazard-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        alertFeed_hazardReportState = {
          step: 'idle',
          alertType: 'hazard',
          category: 'waterlogging',
          description: '',
          landmark: '',
          reporterLabel: '',
          draftGeo: null,
          lastSubmitted: null,
          fileName: '',
          result: null
        };
        alertFeed_onStateUpdate(window.appState);
      });
    }
  }

  function alertFeed_refreshDraftGeo() {
    const city = (window.appState && window.appState.currentCity) || 'Bengaluru';
    alertFeed_syncDraftGeo(city);
    alertFeed_updateGeoPanelOnly(city);
  }

  // ═══════════════════════════════════════════════════════════
  // TELEMETRY SIMULATION HELPER LOGICS
  // ═══════════════════════════════════════════════════════════

  function alertFeed_resolveLiveCoords(currentCity) {
    if (typeof window.mapHub_ensureLiveTracking === 'function') {
      window.mapHub_ensureLiveTracking();
    }
    const live = typeof window.mapHub_getLivePosition === 'function' ? window.mapHub_getLivePosition() : null;
    if (live && live.live !== false) {
      return { lat: live.lat, lon: live.lng, live: true, accuracy: live.accuracy };
    }
    const base = alertFeed_cityCoords[currentCity] || alertFeed_cityCoords['Bengaluru'];
    return { lat: base.lat, lon: base.lon, live: false, accuracy: null };
  }

  /** Live GPS wins — never replace a live fix with city fallback */
  function alertFeed_syncDraftGeo(city) {
    const resolved = alertFeed_resolveLiveCoords(city);
    const prev = alertFeed_hazardReportState.draftGeo;

    if (resolved.live) {
      alertFeed_hazardReportState.draftGeo = {
        lat: resolved.lat,
        lon: resolved.lon,
        live: true,
        accuracy: resolved.accuracy,
        geoTag: alertFeed_formatGeoTag(resolved.lat, resolved.lon)
      };
      return;
    }

    if (!prev || !prev.live) {
      alertFeed_hazardReportState.draftGeo = {
        lat: resolved.lat,
        lon: resolved.lon,
        live: false,
        accuracy: null,
        geoTag: alertFeed_formatGeoTag(resolved.lat, resolved.lon)
      };
    }
  }

  function alertFeed_updateGeoPanelOnly(city) {
    alertFeed_syncDraftGeo(city);
    const panel = document.getElementById('alertFeed-geo-panel');
    if (!panel || alertFeed_hazardReportState.step !== 'idle') return;
    const fresh = document.createElement('div');
    fresh.innerHTML = alertFeed_drawGeoTagPanel(alertFeed_hazardReportState.draftGeo, city);
    const next = fresh.firstElementChild;
    if (next) {
      panel.replaceWith(next);
      const btn = document.getElementById('alertFeed-btn-refresh-geo');
      if (btn) btn.addEventListener('click', () => alertFeed_refreshDraftGeo());
    }
  }

  // Family safety broadcast using live device GPS when available
  window.alertFeed_triggerSafetyBroadcast = async function(type) {
    const currentCity = (window.appState && window.appState.currentCity) || 'Bengaluru';
    const coords = alertFeed_resolveLiveCoords(currentCity);
    const lat = coords.lat;
    const lon = coords.lon;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const gpsNote = coords.live
      ? `Live GPS${coords.accuracy != null ? ` (±${Math.round(coords.accuracy)}m)` : ''}`
      : 'City center (enable location for live GPS)';

    let payloadString = '';
    if (type === 'safe') {
      payloadString = `ResqNet: I AM SAFE in ${currentCity}. ${gpsNote}. Lat ${lat.toFixed(5)}, Lon ${lon.toFixed(5)}.`;
    } else {
      payloadString = `🚨 CRITICAL SOS in ${currentCity}! ${gpsNote}. Lat ${lat.toFixed(5)}, Lon ${lon.toFixed(5)}. Dispatch nearest rescue unit.`;
    }

    const newLog = {
      type: type,
      time: timeStr,
      lat: lat,
      lon: lon,
      liveGps: coords.live,
      payload: payloadString
    };

    alertFeed_familyTrackerLogs.unshift(newLog);

    if (alertFeed_dbOnline && typeof window.dbApi_createCheckin === 'function') {
      try {
        await window.dbApi_createCheckin({
          city: currentCity,
          checkinType: type,
          lat,
          lon,
          liveGps: coords.live,
          payload: payloadString
        });
      } catch (e) {
        console.warn('alertFeed: check-in save failed', e);
      }
    }

    alertFeed_onStateUpdate(window.appState);
  };

  // Clear Family Safety Check-In logs
  window.alertFeed_clearFamilyLogs = function() {
    alertFeed_familyTrackerLogs = [];
    alertFeed_onStateUpdate(window.appState);
  };

  async function alertFeed_submitCitizenAlert(form) {
    const currentCity = (window.appState && window.appState.currentCity) || 'Bengaluru';
    alertFeed_syncDraftGeo(currentCity);
    const draft = alertFeed_hazardReportState.draftGeo;
    const lat = draft.lat;
    const lon = draft.lon;
    const geoTag = draft.geoTag || alertFeed_formatGeoTag(lat, lon);
    const now = new Date();
    const category = form.category || 'waterlogging';
    let tier = alertFeed_categoryTier[category] || 'standard';
    if (form.alertType === 'emergency') tier = 'severe';
    if (form.alertType === 'watch') tier = tier === 'severe' ? 'severe' : 'relatively';

    const typePrefix = alertFeed_alertTypeLabels[form.alertType] || 'Alert';
    const title = `${typePrefix}: ${alertFeed_categoryLabels[category] || category}`;
    let description = form.description || 'Citizen emergency reported at geo-tagged location.';
    if (form.landmark) description += ` Landmark: ${form.landmark}.`;

    const payload = {
      id: 'comm-' + now.getTime(),
      city: currentCity,
      category,
      alertType: form.alertType || 'hazard',
      tier,
      title,
      description,
      lat,
      lon,
      liveGps: !!draft.live,
      accuracyM: draft.accuracy,
      landmark: form.landmark || '',
      reporterLabel: form.reporterLabel || 'Citizen',
      geoTag,
      reportedAt: now.toISOString()
    };

    await alertFeed_addCommunityReport(payload);

    alertFeed_hazardReportState.lastSubmitted = { geoTag, lat, lon };
    alertFeed_hazardReportState.result = { ok: true };
    alertFeed_hazardReportState.step = 'completed';

    setTimeout(() => {
      alertFeed_hazardReportState = {
        step: 'idle',
        alertType: 'hazard',
        category: 'waterlogging',
        description: '',
        landmark: '',
        reporterLabel: '',
        draftGeo: null,
        lastSubmitted: null,
        fileName: '',
        result: null
      };
      alertFeed_onStateUpdate(window.appState);
    }, 2200);
    alertFeed_onStateUpdate(window.appState);
  }

  // ═══════════════════════════════════════════════════════════
  // INITIALIZATION HANDLERS
  // ═══════════════════════════════════════════════════════════
  function alertFeed_onLiveGpsEvent() {
    if (!window.appState || !window.appState.isLoggedIn) return;
    if (window.appState.currentTab !== 'alerts' || window.appState.isLowBandwidth) return;
    alertFeed_updateGeoPanelOnly(window.appState.currentCity || 'Bengaluru');
  }

  function alertFeed_initModule() {
    alertFeed_injectStyles();

    window.addEventListener('resqnet-live-gps', alertFeed_onLiveGpsEvent);

    if (window.appState) {
      window.appState.subscribe(alertFeed_onStateUpdate);
    }
  }

  // Execute initialization
  alertFeed_initModule();
});
