/**
 * ResqNet Mobile - Foundation State Engine & Controller
 * 
 * Strict Code Isolation Contract: 
 * All top-level variables and functions are prefixed with 'foundApp_'.
 */

// ═══════════════════════════════════════════════════════════
// GLOBAL STATE ENGINE
// ═══════════════════════════════════════════════════════════
window.appState = {
  currentCity: 'Bengaluru',
  currentLanguage: 'en',
  isLoggedIn: false,
  isLowBandwidth: false,
  isSirenActive: false,
  currentTab: 'alerts', // Default tab layout
  listeners: [],
  subscribe(callback) { this.listeners.push(callback); },
  update(key, value) { this[key] = value; this.listeners.forEach(cb => cb(this)); }
};

window.foundApp_isLoggedIn = function () {
  return !!(window.appState && window.appState.isLoggedIn);
};

// ═══════════════════════════════════════════════════════════
// EMERGENCY DATA DICTIONARY (City-aware, dynamic stream)
// ═══════════════════════════════════════════════════════════
const foundApp_emergencyData = {
  'Bengaluru': {
    sos: [
      '**[SOS - 18:02]** Severe waterlogging reported at Silk Board junction. Underpass submerged. Avoid.',
      '**[SOS - 17:45]** Major tree uprooting blocks traffic on Outer Ring Road near Bellandur.',
      '**[SOS - 16:30]** Localized power grid failure in Kengeri. Restoration in progress.'
    ],
    helplines: [
      'State Emergency Desk: 112',
      'BBMP Control Center: 080-22221188',
      'Disaster Management Unit: 080-22340676',
      'Red Cross Emergency: 080-22264424'
    ],
    shelters: [
      'Shelter A: Government Primary School, 5th Main Rd, Kengeri (Active)',
      'Shelter B: HSR Layout Community Hall, Sector 3 (Active)',
      'Shelter C: Sports Complex Arena, Koramangala 4th Block (Active)'
    ]
  },
  'Mumbai': {
    sos: [
      '**[SOS - 18:15]** High Tide Warning (4.8m) at Marine Drive. Strictly stay away from shorelines.',
      '**[SOS - 17:10]** Water logging at Hindmata Junction. Slow-moving traffic advised.',
      '**[SOS - 15:40]** Landslide reported near Western Express Highway (Jogeshwari). Cleaning in progress.'
    ],
    helplines: [
      'Disaster Response Desk: 112',
      'BMC Disaster Control: 022-22694725',
      'Traffic Police Hotline: 022-24937747',
      'Ambulance Network Services: 108'
    ],
    shelters: [
      'Shelter A: Municipal Secondary School, Dadar West (Active)',
      'Shelter B: Transit Camp Grounds, Dharavi (Active)',
      'Shelter C: St. Xavier College Main Hall, Dhobi Talao (Active)'
    ]
  },
  'Chennai': {
    sos: [
      '**[SOS - 18:00]** Cyclone alert active. Heavy torrential rain expected overnight.',
      '**[SOS - 16:50]** Adyar River bank warning. Residents in low-lying zones must relocate.',
      '**[SOS - 14:20]** Massive water accumulation on Velachery Main Rd. Power grids offline for safety.'
    ],
    helplines: [
      'Corporation Emergency: 1913',
      'Emergency Services Center: 112',
      'Chennai Corp Central Desk: 044-25619206',
      'Coastal Security Taskforce: 044-28447738'
    ],
    shelters: [
      'Shelter A: Corporation Girls School, Velachery (Active)',
      'Shelter B: Community Welfare Hall, Mylapore (Active)',
      'Shelter C: State High School Complex, Saidapet (Active)'
    ]
  },
  'Delhi': {
    sos: [
      '**[SOS - 18:20]** Yamuna water level crosses danger threshold near Old Railway Bridge.',
      '**[SOS - 17:05]** Severe AQI alert (460+). Wear N95 masks; avoid outdoor cardio.',
      '**[SOS - 14:15]** Flooded underpass at Pul Prahladpur. Route completely closed.'
    ],
    helplines: [
      'National Disaster helpline: 112',
      'Delhi Disaster Control: 011-22444555',
      'DDMA Central Control Desk: 1077',
      'Delhi Police Emergency Desk: 100'
    ],
    shelters: [
      'Shelter A: Night Shelter Complex, Kashmere Gate (Active)',
      'Shelter B: Community Recreation Center, Saket (Active)',
      'Shelter C: Government Boys School, Yamuna Vihar (Active)'
    ]
  },
  'Kolkata': {
    sos: [
      '**[SOS - 17:50]** Water logging reported at Amherst Street and Thanthania regions.',
      '**[SOS - 16:15]** Safety inspection warning for old structures in North Kolkata.',
      '**[SOS - 13:40]** High-voltage electrical line snap in Garia. Repair teams on site.'
    ],
    helplines: [
      'Emergency Helpline Desk: 112',
      'KMC Control Room Desk: 033-22861212',
      'Kolkata Police Command: 033-22143000',
      'Disaster Management Wing: 033-22143526'
    ],
    shelters: [
      'Shelter A: KMC School Hall, Amherst St (Active)',
      'Shelter B: Citizen Center Hall, Gariahat (Active)',
      'Shelter C: Multi-Cyclone Shelter Building, Behala (Active)'
    ]
  },
  'Hyderabad': {
    sos: [
      '**[SOS - 18:10]** Flash floods warning active for low-lying Musi River colonies.',
      '**[SOS - 15:30]** Heavy rain water accumulation under Begumpet and Khairatabad underpasses.',
      '**[SOS - 12:20]** Tree fall blocks arterial lanes at Jubilee Hills Road No 36.'
    ],
    helplines: [
      'State Disaster helpline: 112',
      'GHMC Control Room Desk: 040-21111111',
      'Water Board Help Desk: 155313',
      'State Fire & Emergency: 101'
    ],
    shelters: [
      'Shelter A: GHMC Sports Complex Hall, Secunderabad (Active)',
      'Shelter B: Community Hall Complex, Amberpet (Active)',
      'Shelter C: Government Model High School, Khairatabad (Active)'
    ]
  },
  'Pune': {
    sos: [
      '**[SOS - 18:05]** Mutha river discharge increased. Sinhagad road residents alert.',
      '**[SOS - 16:40]** High landslide risk active in Bhor Ghat pass. Avoid hilly tracks.',
      '**[SOS - 14:10]** Massive vehicle logjam in Yerwada due to road water logging.'
    ],
    helplines: [
      'State Response Center: 112',
      'PMC Central Disaster Desk: 020-25501269',
      'Pune Police Control Room: 020-26126296',
      'Fire Emergency Service: 101'
    ],
    shelters: [
      'Shelter A: PMC Primary School, Sinhagad Road (Active)',
      'Shelter B: Deccan Gymkhana Pavilion Hall (Active)',
      'Shelter C: Samaj Mandir Hall, Yerwada (Active)'
    ]
  },
  'Ahmedabad': {
    sos: [
      '**[SOS - 18:30]** Sabarmati riverfront lower promenade closed due to water discharge.',
      '**[SOS - 17:15]** Mithakhali underpass flooded. Traffic routed to flyovers.',
      '**[SOS - 13:50]** Dust storm warning for outer ring road sections. Reduce speed.'
    ],
    helplines: [
      'Unified Emergency Desk: 112',
      'AMC Control Room Desk: 079-25391811',
      'State Disaster Mgmt Cell: 079-27551911',
      'Ambulance Network Desk: 108'
    ],
    shelters: [
      'Shelter A: AMC Primary School, Paldi (Active)',
      'Shelter B: Community Center Hall, Gota (Active)',
      'Shelter C: Sports Arena Pavilion, Navrangpura (Active)'
    ]
  }
};

// ═══════════════════════════════════════════════════════════
// INITIALIZATION FLOW
// ═══════════════════════════════════════════════════════════
function foundApp_init() {
  // Subscribe our primary rendering engine to window.appState updates
  window.appState.subscribe(foundApp_render);

  // Set initial rendering status
  foundApp_render(window.appState);

  // Configure OTP input box auto-focus shift loop
  const otpInputs = [
    document.getElementById('otp-d1'),
    document.getElementById('otp-d2'),
    document.getElementById('otp-d3'),
    document.getElementById('otp-d4')
  ];

  otpInputs.forEach((input, index) => {
    // Listen to value inputting
    input.addEventListener('input', (e) => {
      const val = e.target.value;
      
      // Filter out non-numeric characters
      e.target.value = val.replace(/[^\d]/g, '');

      if (e.target.value.length === 1 && index < 3) {
        otpInputs[index + 1].focus();
      }

      // Auto-submit OTP verification once all four blocks are filled
      const fullCode = otpInputs.map(inp => inp.value).join('');
      if (fullCode.length === 4) {
        foundApp_verifyOTP();
      }
    });

    // Listen to backspaces and back-navigation
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });

    // Support keypress on Enter to submit code manually
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        foundApp_verifyOTP();
      }
    });
  });

  // Enable keypress Enter in phone number input box
  const phoneInput = document.getElementById('auth-phone-input');
  phoneInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      foundApp_sendOTP();
    }
  });

  // Start continuous cosmetic system time update
  foundApp_updateTime();
  setInterval(foundApp_updateTime, 30000);
}

// ═══════════════════════════════════════════════════════════
// AUTHENTICATION LOGIC
// ═══════════════════════════════════════════════════════════
function foundApp_setAuthTitle(key) {
  const el = document.getElementById('auth-page-title');
  if (!el) return;
  if (typeof window.i18n_t === 'function') {
    el.textContent = window.i18n_t(key);
    el.setAttribute('data-i18n', key);
  }
}

function foundApp_showAuthSignUpHint() {
  const msg =
    typeof window.i18n_t === 'function'
      ? window.i18n_t('signUpHint')
      : 'Enter your mobile number and tap Sign in to receive an OTP.';
  const phone = document.getElementById('auth-phone-input');
  if (phone) phone.focus();
  alert(msg);
}

function foundApp_sendOTP() {
  const phoneInput = document.getElementById('auth-phone-input');
  const errorText = document.getElementById('auth-phone-error');
  const rawNum = phoneInput.value.trim();

  // Validate standard 10-digit number
  if (/^\d{10}$/.test(rawNum)) {
    errorText.classList.add('hidden');
    
    // Slide transition to OTP step
    document.getElementById('auth-step-phone').classList.add('hidden');
    
    const otpStep = document.getElementById('auth-step-otp');
    otpStep.classList.remove('hidden');
    otpStep.classList.add('fade-in');

    foundApp_setAuthTitle('loginTitleOtp');

    // Update SMS phone suffix
    document.getElementById('otp-phone-suffix').textContent = ' ****' + rawNum.slice(-4);

    // Clear and focus first OTP input box
    foundApp_clearOTPInputs();
    document.getElementById('otp-d1').focus();
  } else {
    // Validation failure animation
    errorText.classList.remove('hidden');
    
    const formBox = document.getElementById('foundApp-auth-form');
    formBox.classList.add('shake');
    setTimeout(() => formBox.classList.remove('shake'), 450);
  }
}

function foundApp_verifyOTP() {
  const d1 = document.getElementById('otp-d1').value;
  const d2 = document.getElementById('otp-d2').value;
  const d3 = document.getElementById('otp-d3').value;
  const d4 = document.getElementById('otp-d4').value;
  const fullCode = d1 + d2 + d3 + d4;

  const errorText = document.getElementById('auth-otp-error');
  const authScreen = document.getElementById('foundApp-auth-screen');

  if (fullCode === '4040') {
    errorText.classList.add('hidden');
    
    // Beautiful fade out transition of the login page
    authScreen.classList.add('opacity-0', 'pointer-events-none', 'transition-all', 'duration-500');
    
    setTimeout(() => {
      authScreen.classList.add('hidden');
    }, 500);

    // Unveil the main UI canvas
    const mainLayout = document.getElementById('foundApp-main-layout');
    mainLayout.classList.remove('hidden');
    mainLayout.classList.add('flex', 'fade-in');

    window.appState.isLoggedIn = true;
    window.appState.isSirenActive = false;

    // Start live device GPS for map, SOS, and hazard reports
    if (typeof window.mapHub_ensureLiveTracking === 'function') {
      window.mapHub_ensureLiveTracking();
    }

    window.appState.listeners.forEach((cb) => cb(window.appState));
    foundApp_triggerTabChangeCallbacks();
  } else {
    // Show validation failure
    errorText.classList.remove('hidden');
    foundApp_clearOTPInputs();
    document.getElementById('otp-d1').focus();

    const formBox = document.getElementById('foundApp-auth-form');
    formBox.classList.add('shake');
    setTimeout(() => formBox.classList.remove('shake'), 450);
  }
}

function foundApp_backToPhone() {
  document.getElementById('auth-step-otp').classList.add('hidden');
  
  const phoneStep = document.getElementById('auth-step-phone');
  phoneStep.classList.remove('hidden');
  phoneStep.classList.add('fade-in');

  foundApp_setAuthTitle('loginTitle');
  document.getElementById('auth-phone-input').focus();
  document.getElementById('auth-otp-error').classList.add('hidden');
}

function foundApp_resendOTP() {
  const resendBtn = document.getElementById('auth-resend-btn');
  const resendTimer = document.getElementById('auth-resend-timer');

  resendBtn.disabled = true;
  resendTimer.classList.remove('hidden');

  let seconds = 30;
  resendTimer.textContent = `(${seconds}s)`;

  const intervalId = setInterval(() => {
    seconds--;
    if (seconds > 0) {
      resendTimer.textContent = `(${seconds}s)`;
    } else {
      clearInterval(intervalId);
      resendBtn.disabled = false;
      resendTimer.classList.add('hidden');
    }
  }, 1000);
}

function foundApp_clearOTPInputs() {
  document.getElementById('otp-d1').value = '';
  document.getElementById('otp-d2').value = '';
  document.getElementById('otp-d3').value = '';
  document.getElementById('otp-d4').value = '';
}

// ═══════════════════════════════════════════════════════════
// LAYOUT & STATE INTERACTION ROUTING
// ═══════════════════════════════════════════════════════════
function foundApp_switchTab(tabName) {
  window.appState.update('currentTab', tabName);
  foundApp_triggerTabChangeCallbacks();
}

function foundApp_onCityChange(cityName) {
  window.appState.update('currentCity', cityName);
  foundApp_triggerCityChangeCallbacks();
}

function foundApp_toggleLowBandwidth() {
  const nextVal = !window.appState.isLowBandwidth;
  window.appState.update('isLowBandwidth', nextVal);
}

function foundApp_toggleSiren() {
  const nextVal = !window.appState.isSirenActive;
  if (nextVal && typeof window.sirenHub_trigger === 'function') {
    window.sirenHub_trigger(null);
  } else {
    window.appState.update('isSirenActive', nextVal);
  }
}

// ═══════════════════════════════════════════════════════════
// REACTIVE RENDER ENGINE
// ═══════════════════════════════════════════════════════════
function foundApp_render(state) {
  if (typeof window.i18n_applyDom === 'function') window.i18n_applyDom();
  if (!state.isLoggedIn) return;

  // 1. Sync Dropdown Value
  const dropdown = document.getElementById('city-dropdown');
  if (dropdown && dropdown.value !== state.currentCity) {
    dropdown.value = state.currentCity;
  }

  // 2. Render Low-Bandwidth Mode Switch
  const lbwTrack = document.getElementById('lbw-track');
  const lbwThumb = document.getElementById('lbw-thumb');
  const lbwLabel = document.getElementById('lbw-label');

  if (lbwTrack && lbwThumb && lbwLabel) {
    if (state.isLowBandwidth) {
      lbwThumb.style.transform = 'translateX(20px)';
      lbwTrack.style.backgroundColor = '#4f46e5'; // Indigo-600
      lbwLabel.classList.remove('text-slate-400');
      lbwLabel.classList.add('text-indigo-600');
    } else {
      lbwThumb.style.transform = 'translateX(0px)';
      lbwTrack.style.backgroundColor = '#e2e8f0'; // Slate-200
      lbwLabel.classList.remove('text-indigo-600');
      lbwLabel.classList.add('text-slate-400');
    }
  }

  // 3. Render Emergency Siren Button
  const sirenBtn = document.getElementById('siren-btn');
  const sirenIcon = document.getElementById('siren-icon');

  if (sirenBtn && sirenIcon) {
    if (state.isSirenActive) {
      // Emergency Active Classes
      sirenBtn.className = "w-8 h-8 rounded-full bg-rose-500 border border-rose-600 flex items-center justify-center pulse-ring shadow-lg shadow-rose-500/25 transition-all cursor-pointer";
      sirenIcon.className = "fa-solid fa-volume-high text-white fa-bounce";
    } else {
      // Normal Standby Classes
      sirenBtn.className = "w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center hover:border-rose-400/50 hover:bg-rose-50/20 transition-all active:scale-90 cursor-pointer";
      sirenIcon.className = "fa-solid fa-bullhorn text-slate-500 text-xs transition-colors";
    }
  }

  // 4. Content Containers & Dual rendering router
  const lbwView = document.getElementById('lbw-stream-view');
  const mapSlot = document.getElementById('map-slot');
  const feedSlot = document.getElementById('feed-slot');
  const portalSlot = document.getElementById('portal-slot');

  if (state.isLowBandwidth) {
    // Hide standard graphic slots
    if (mapSlot) mapSlot.classList.add('hidden');
    if (feedSlot) feedSlot.classList.add('hidden');
    if (portalSlot) portalSlot.classList.add('hidden');

    // Reveal plain text stream container
    if (lbwView) {
      lbwView.classList.remove('hidden');
      foundApp_renderLowBandwidthStream(lbwView, state);
    }
  } else {
    // Hide plain text stream container
    if (lbwView) lbwView.classList.add('hidden');

    // Hide normal slots, reveal active slot
    if (mapSlot) mapSlot.classList.add('hidden');
    if (feedSlot) feedSlot.classList.add('hidden');
    if (portalSlot) portalSlot.classList.add('hidden');

    if (state.currentTab === 'alerts' && feedSlot) feedSlot.classList.remove('hidden');
    if (state.currentTab === 'map' && mapSlot) mapSlot.classList.remove('hidden');
    if (state.currentTab === 'volunteer' && portalSlot) portalSlot.classList.remove('hidden');
  }

  // 5. Render active bottom navbar tabs
  const tabBtnAlerts = document.getElementById('tab-btn-alerts');
  const tabBtnMap = document.getElementById('tab-btn-map');
  const tabBtnVolunteer = document.getElementById('tab-btn-volunteer');

  if (tabBtnAlerts && tabBtnMap && tabBtnVolunteer) {
    // Reset all
    tabBtnAlerts.className = "flex-1 flex flex-col items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer tab-btn-inactive";
    tabBtnMap.className = "flex-1 flex flex-col items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer tab-btn-inactive";
    tabBtnVolunteer.className = "flex-1 flex flex-col items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer tab-btn-inactive";

    // Set active style
    if (state.currentTab === 'alerts') {
      tabBtnAlerts.className = "flex-1 flex flex-col items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer tab-btn-active";
    } else if (state.currentTab === 'map') {
      tabBtnMap.className = "flex-1 flex flex-col items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer tab-btn-active";
    } else if (state.currentTab === 'volunteer') {
      tabBtnVolunteer.className = "flex-1 flex flex-col items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer tab-btn-active";
    }
  }
}

// ═══════════════════════════════════════════════════════════
// LOW-BANDWIDTH PLAIN-TEXT RENDERER
// ═══════════════════════════════════════════════════════════
function foundApp_renderLowBandwidthStream(container, state) {
  const city = state.currentCity;
  const data = foundApp_emergencyData[city] || foundApp_emergencyData['Bengaluru'];

  // Construct raw plain text HTML stream
  let html = `
    <div class="space-y-4">
      
      <!-- Bandwidth Information Banner -->
      <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs font-black text-indigo-700 uppercase tracking-wider flex items-center gap-1">
            <i class="fa-solid fa-tower-broadcast animate-pulse"></i> Text-Only Stream Mode
          </span>
          <span class="bg-indigo-100 text-indigo-800 text-[9px] font-bold px-2 py-0.5 rounded-full select-none">
            Active
          </span>
        </div>
        <p class="text-[10px] text-slate-500 mt-1 leading-relaxed">
          Broadcasting critical SOS alerts, emergency direct numbers, and local shelter points in lightweight plain-text stream to conserve battery & cellular bandwidth.
        </p>
      </div>

      <!-- City Scope Label -->
      <div class="flex items-center justify-between px-1">
        <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Disaster Region Scopes</span>
        <span class="text-xs font-bold text-slate-700 flex items-center gap-1">
          <i class="fa-solid fa-location-crosshairs text-[10px] text-rose-500"></i> ${city} Hub
        </span>
      </div>

      <!-- Bold SOS Triggers -->
      <div class="space-y-2">
        <h3 class="text-xs font-black uppercase text-rose-600 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
          <i class="fa-solid fa-triangle-exclamation text-[10px]"></i> Active SOS Triggers
        </h3>
        <div class="space-y-2">
  `;

  data.sos.forEach(sosText => {
    // Process markdown double asterisks into strong red bolding
    const parsedText = sosText.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-extrabold text-rose-600">$1</strong>');
    html += `
      <div class="bg-white border border-slate-200 rounded-xl p-3 shadow-sm font-mono text-[11px] text-slate-800 leading-normal">
        ${parsedText}
      </div>
    `;
  });

  html += `
        </div>
      </div>

      <!-- Emergency Phone Networks -->
      <div class="space-y-2">
        <h3 class="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
          <i class="fa-solid fa-phone text-[10px] text-indigo-600 animate-bounce"></i> Emergency Phone Networks
        </h3>
        <div class="bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-1.5">
  `;

  data.helplines.forEach(phoneEntry => {
    const parts = phoneEntry.split(':');
    const name = parts[0] ? parts[0].trim() : 'Helpline';
    const number = parts[1] ? parts[1].trim() : '112';
    const numericOnly = number.replace(/[^\d]/g, '');

    html += `
      <div class="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-b-0">
        <span class="text-slate-500 font-semibold">${name}:</span>
        <a href="tel:${numericOnly}" class="text-indigo-600 font-black hover:underline bg-indigo-50 px-2 py-0.5 rounded select-all transition-all">${number}</a>
      </div>
    `;
  });

  html += `
        </div>
      </div>

      <!-- Raw Address Locations for Shelter Points -->
      <div class="space-y-2">
        <h3 class="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
          <i class="fa-solid fa-house-chimney-crack text-[10px] text-indigo-600"></i> Shelter Points (Address Locations)
        </h3>
        <div class="space-y-2">
  `;

  data.shelters.forEach(shelter => {
    const parts = shelter.split(':');
    const title = parts[0] ? parts[0].trim() : 'Emergency Shelter';
    const addr = parts[1] ? parts[1].trim() : 'Contact authority';

    html += `
      <div class="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
        <div class="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 select-none"></span> ${title}
        </div>
        <div class="text-[10.5px] text-slate-500 mt-1 font-mono leading-relaxed select-all">
          ${addr}
        </div>
      </div>
    `;
  });

  let signalsBlock = '';
  if (typeof window.signalsHub_getTextSummary === 'function') {
    const sigText = window.signalsHub_getTextSummary(city);
    if (sigText) {
      const parsedSig = sigText.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-extrabold text-amber-700">$1</strong>');
      signalsBlock = `
      <div class="space-y-2">
        <h3 class="text-xs font-black uppercase text-amber-700 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
          <i class="fa-solid fa-cloud-bolt text-[10px]"></i> Live disaster signals
        </h3>
        <div class="bg-amber-50 border border-amber-100 rounded-xl p-3 font-mono text-[11px] text-slate-800 leading-normal">
          ${parsedSig}
        </div>
      </div>`;
    }
  }

  html += `
        </div>
      </div>
      ${signalsBlock}

    </div>
  `;

  container.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════
// OTHER COMPONENT EVENTS NOTIFIERS (STUBS)
// ═══════════════════════════════════════════════════════════
function foundApp_triggerTabChangeCallbacks() {
  // Stub for mapHub.js, alertFeed.js, helpPortal.js to hook into and update their renderers
  if (typeof foundApp_onTabChanged === 'function') {
    foundApp_onTabChanged(window.appState.currentTab);
  }
}

function foundApp_triggerCityChangeCallbacks() {
  // Stub for other components to re-render local feeds when city changes
  if (typeof foundApp_onCityChanged === 'function') {
    foundApp_onCityChanged(window.appState.currentCity);
  }
}

// ═══════════════════════════════════════════════════════════
// COSMETIC HELPER UTILITIES
// ═══════════════════════════════════════════════════════════
function foundApp_updateTime() {
  const timeEl = document.getElementById('status-time');
  if (timeEl) {
    const now = new Date();
    let hrs = now.getHours();
    let mins = now.getMinutes();
    hrs = hrs < 10 ? '0' + hrs : hrs;
    mins = mins < 10 ? '0' + mins : mins;
    timeEl.textContent = `${hrs}:${mins}`;
  }
}

// Bind DOM loaded trigger
document.addEventListener('DOMContentLoaded', foundApp_init);
