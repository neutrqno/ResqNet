/**
 * ResqNet — Loud disaster siren (Web Audio) + auto-trigger from live signals
 * Prefix: sirenHub_
 */

const sirenHub_AUTO_MUTE_MS = 30 * 60 * 1000;
const sirenHub_RISK_THRESHOLD = 50;

let sirenHub_audioCtx = null;
let sirenHub_oscillators = [];
let sirenHub_gain = null;
let sirenHub_pulseTimer = null;
let sirenHub_vibrateTimer = null;
let sirenHub_lastThreat = null;
let sirenHub_userUnlocked = false;

function sirenHub_getShell() {
  return document.querySelector('.max-w-md.h-screen') || document.getElementById('foundApp-main-layout')?.parentElement;
}

function sirenHub_getAudioContext() {
  if (!sirenHub_audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    sirenHub_audioCtx = new Ctx();
  }
  return sirenHub_audioCtx;
}

function sirenHub_unlockAudio() {
  const ctx = sirenHub_getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();
  sirenHub_userUnlocked = true;
}

function sirenHub_bindUnlockOnce() {
  if (sirenHub_userUnlocked) return;
  const unlock = () => {
    sirenHub_unlockAudio();
    document.removeEventListener('click', unlock, true);
    document.removeEventListener('touchstart', unlock, true);
    document.removeEventListener('keydown', unlock, true);
  };
  document.addEventListener('click', unlock, true);
  document.addEventListener('touchstart', unlock, true);
  document.addEventListener('keydown', unlock, true);
}

function sirenHub_startSound() {
  const ctx = sirenHub_getAudioContext();
  if (!ctx) return;
  sirenHub_unlockAudio();
  if (sirenHub_pulseTimer) return;

  sirenHub_gain = ctx.createGain();
  sirenHub_gain.gain.value = 0;
  sirenHub_gain.connect(ctx.destination);

  const oscA = ctx.createOscillator();
  const oscB = ctx.createOscillator();
  oscA.type = 'sawtooth';
  oscB.type = 'square';
  oscA.frequency.value = 780;
  oscB.frequency.value = 520;
  oscA.connect(sirenHub_gain);
  oscB.connect(sirenHub_gain);
  oscA.start();
  oscB.start();
  sirenHub_oscillators = [oscA, oscB];

  let phase = 0;
  sirenHub_pulseTimer = setInterval(() => {
    const t = ctx.currentTime;
    phase = !phase;
    oscA.frequency.setTargetAtTime(phase ? 920 : 480, t, 0.04);
    oscB.frequency.setTargetAtTime(phase ? 720 : 360, t, 0.04);
    sirenHub_gain.gain.cancelScheduledValues(t);
    sirenHub_gain.gain.setValueAtTime(phase ? 0.92 : 0.55, t);
  }, 320);

  sirenHub_startVibrate();
}

function sirenHub_stopSound() {
  if (sirenHub_pulseTimer) {
    clearInterval(sirenHub_pulseTimer);
    sirenHub_pulseTimer = null;
  }
  sirenHub_stopVibrate();
  sirenHub_oscillators.forEach((o) => {
    try {
      o.stop();
    } catch {
      /* already stopped */
    }
  });
  sirenHub_oscillators = [];
  if (sirenHub_gain) {
    sirenHub_gain.disconnect();
    sirenHub_gain = null;
  }
}

function sirenHub_startVibrate() {
  if (!navigator.vibrate) return;
  const pattern = [400, 150, 400, 150, 600];
  navigator.vibrate(pattern);
  sirenHub_vibrateTimer = setInterval(() => navigator.vibrate(pattern), 2200);
}

function sirenHub_stopVibrate() {
  if (sirenHub_vibrateTimer) {
    clearInterval(sirenHub_vibrateTimer);
    sirenHub_vibrateTimer = null;
  }
  if (navigator.vibrate) navigator.vibrate(0);
}

function sirenHub_getMutedUntil() {
  try {
    const raw = sessionStorage.getItem('sirenHub_mutedUntil');
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

function sirenHub_isAutoMuted() {
  return Date.now() < sirenHub_getMutedUntil();
}

function sirenHub_evaluateThreat(signalState) {
  const s = signalState || (typeof window.signalsHub_getState === 'function' ? window.signalsHub_getState() : null);
  if (!s || s.loading || s.error) return null;

  const reasons = [];

  if (s.risk && s.risk.score >= sirenHub_RISK_THRESHOLD) {
    reasons.push(`${s.risk.label} disaster risk (${s.risk.score}/100)`);
  }

  const alerts = s.weatherAlerts || s.weather?.alerts || [];
  if (alerts.length > 0) {
    reasons.push(alerts[0].event || 'Official weather alert');
  }

  const bigQuake = (s.earthquakes || []).find((eq) => eq.mag >= 5);
  if (bigQuake) {
    reasons.push(`Earthquake M${bigQuake.mag.toFixed(1)} — ${bigQuake.place || 'nearby'}`);
  }

  const nearEonet = (s.eonet || []).find((e) => e.distanceKm < 400);
  if (nearEonet) {
    reasons.push(`${nearEonet.category}: ${nearEonet.title}`);
  }

  if (s.weather) {
    if (s.weather.windSpeed >= 50) reasons.push(`Extreme wind ${Math.round(s.weather.windSpeed)} km/h`);
    if (s.weather.precipitation >= 10) reasons.push(`Heavy rain ${s.weather.precipitation} mm/h`);
    if (s.weather.weatherCode >= 95) reasons.push('Thunderstorm warning');
  }

  const city = s.city || (window.appState && window.appState.currentCity);
  if (typeof window.alertFeed_getCommunityReports === 'function' && city) {
    const severe = window.alertFeed_getCommunityReports(city).filter(
      (r) => r.tier === 'severe' || r.tier === 'serious'
    );
    if (severe.length > 0) {
      reasons.push(`Community alert: ${severe[0].title}`);
    }
  }

  const unique = [...new Set(reasons)];
  if (unique.length === 0) return null;

  return {
    city: city || 'your area',
    headline: unique[0],
    reasons: unique.slice(0, 5)
  };
}

function sirenHub_overlayHtml() {
  const threat = sirenHub_lastThreat;
  const t = (k) => (typeof window.i18n_t === 'function' ? window.i18n_t(k) : k);
  const title = threat ? t('disasterIncoming') : t('emergencySiren');
  const sub = threat
    ? `${t('disasterIncoming')} — <strong>${threat.city}</strong>`
    : t('emergencySiren');
  const list = threat
    ? `<ul class="text-left text-[11px] text-rose-100 space-y-1.5 mb-5 max-h-28 overflow-y-auto">${threat.reasons
        .map((r) => `<li class="flex gap-2"><span class="text-rose-300">▸</span><span>${r}</span></li>`)
        .join('')}</ul>`
    : '';

  return `
    <div class="max-w-[300px] w-full">
      <div class="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 animate-pulse">
        <i class="fa-solid fa-bell text-2xl text-white"></i>
      </div>
      <h2 class="text-xl font-black text-white mb-1 tracking-tight">${title}</h2>
      <p class="text-xs text-rose-100 mb-3">${sub}</p>
      ${list}
      <button type="button" onclick="sirenHub_goToSafety()" class="w-full bg-white text-rose-600 font-bold py-3 rounded-xl text-sm mb-2 cursor-pointer shadow-lg">
        ${t('goSafeZone')}
      </button>
      <button type="button" onclick="sirenHub_dismiss()" class="w-full bg-rose-800/80 text-white font-semibold py-2.5 rounded-xl text-xs cursor-pointer border border-rose-400/30">
        ${t('silenceSiren')}
      </button>
    </div>`;
}

function sirenHub_showOverlay() {
  const shell = sirenHub_getShell();
  if (!shell) return;
  let overlay = document.getElementById('sirenHub-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'sirenHub-overlay';
    overlay.className =
      'absolute inset-0 z-[200] flex flex-col items-center justify-center p-6 text-center bg-rose-600/95 backdrop-blur-sm';
    overlay.style.animation = 'sirenHub-flash 0.55s infinite alternate';
    shell.appendChild(overlay);
    if (!document.getElementById('sirenHub-styles')) {
      const st = document.createElement('style');
      st.id = 'sirenHub-styles';
      st.textContent = `
        @keyframes sirenHub-flash {
          from { background-color: rgba(225, 29, 72, 0.97); }
          to   { background-color: rgba(127, 29, 29, 0.98); }
        }
      `;
      document.head.appendChild(st);
    }
  }
  overlay.innerHTML = sirenHub_overlayHtml();
  overlay.style.display = 'flex';
}

function sirenHub_hideOverlay() {
  const overlay = document.getElementById('sirenHub-overlay');
  if (overlay) overlay.style.display = 'none';
}

function sirenHub_onAppState(state) {
  if (!state.isLoggedIn) {
    sirenHub_stopSound();
    sirenHub_hideOverlay();
    return;
  }
  if (state.isSirenActive) {
    sirenHub_startSound();
    sirenHub_showOverlay();
  } else {
    sirenHub_stopSound();
    sirenHub_hideOverlay();
  }
}

window.sirenHub_trigger = function (threat) {
  if (!window.foundApp_isLoggedIn || !window.foundApp_isLoggedIn()) return;
  if (threat) sirenHub_lastThreat = threat;
  if (window.appState) window.appState.update('isSirenActive', true);
};

/** Automatic disaster siren disabled — manual bullhorn only */
window.sirenHub_checkAuto = function () {
  return;
};

window.sirenHub_dismiss = function () {
  try {
    sessionStorage.setItem('sirenHub_mutedUntil', String(Date.now() + sirenHub_AUTO_MUTE_MS));
  } catch {
    /* */
  }
  if (window.appState) window.appState.update('isSirenActive', false);
};

window.sirenHub_goToSafety = function () {
  window.sirenHub_dismiss();
  if (typeof window.mapHub_openNearestSafeZone === 'function') {
    window.mapHub_openNearestSafeZone();
  } else if (typeof window.foundApp_switchTab === 'function') {
    window.foundApp_switchTab('map');
  }
};

window.sirenHub_syncOverlay = function (active) {
  if (active) sirenHub_showOverlay();
  else sirenHub_hideOverlay();
};

function sirenHub_init() {
  sirenHub_bindUnlockOnce();
  sirenHub_stopSound();
  sirenHub_hideOverlay();

  if (window.appState) {
    window.appState.isSirenActive = false;
    window.appState.subscribe(sirenHub_onAppState);
    sirenHub_onAppState(window.appState);
  }
}

document.addEventListener('DOMContentLoaded', sirenHub_init);
