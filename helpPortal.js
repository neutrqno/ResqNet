/**
 * ResqNet Mobile - Emergency Help Desk FAB & Volunteer Mission Command
 * 
 * Strict Code Isolation Contract:
 * All variables and functions are prefixed with 'helpPortal_'.
 * Target Containers: <div id="portal-slot"></div> and <div id="chatbot-slot"></div>
 */

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════════════════════
  // GLOBAL MODULE STATE & CACHES
  // ═══════════════════════════════════════════════════════════
  let helpPortal_isRegistered = false;
  let helpPortal_registeredUser = {
    name: '',
    mobile: '',
    skills: []
  };

  let helpPortal_xp = 0;
  let helpPortal_missionsCompleted = 0;
  let helpPortal_incidentsCache = [];
  let helpPortal_incidentsLoading = false;
  const helpPortal_callSign = "RESQ-882";
  
  // Set to keep track of accepted mission IDs (Stateful)
  let helpPortal_acceptedMissions = {}; // ID (string) -> Boolean (accepted)
  
  // Chatbot overlay visibility state
  let helpPortal_isChatOpen = false;

  // Static time getter for chat messages
  function helpPortal_getCurrentTime() {
    const now = new Date();
    let hrs = now.getHours();
    let mins = now.getMinutes();
    hrs = hrs < 10 ? '0' + hrs : hrs;
    mins = mins < 10 ? '0' + mins : mins;
    return `${hrs}:${mins}`;
  }

  // Pre-seeded chat log
  let helpPortal_chatHistory = [
    {
      sender: 'bot',
      text: "Welcome to the **Emergency Help Desk**. Tap a quick reply below or ask about shelters, first aid, floods, or how to send an SOS.",
      time: helpPortal_getCurrentTime()
    }
  ];

  let helpPortal_isTyping = false;

  function helpPortal_t(key) {
    return typeof window.i18n_t === 'function' ? window.i18n_t(key) : key;
  }

  // ═══════════════════════════════════════════════════════════
  // CITIZEN INCIDENTS → NGO RESPONSE MISSIONS (no fake missions)
  // ═══════════════════════════════════════════════════════════
  function helpPortal_skillsFromCategory(category) {
    const map = {
      sos: ['Search & Rescue (SAR)', 'First Aid / Medical'],
      fire: ['Search & Rescue (SAR)'],
      medical: ['First Aid / Medical'],
      trapped: ['Search & Rescue (SAR)'],
      waterlogging: ['Search & Rescue (SAR)'],
      treefall: ['Search & Rescue (SAR)'],
      powergrid: ['Search & Rescue (SAR)'],
      structural: ['Search & Rescue (SAR)']
    };
    return map[category] || ['Search & Rescue (SAR)'];
  }

  function helpPortal_urgencyFromReport(report) {
    if (report.alertType === 'emergency' || report.category === 'sos') return 'CRITICAL';
    if (report.tier === 'severe') return 'CRITICAL';
    if (report.tier === 'serious') return 'HIGH';
    return 'MEDIUM';
  }

  function helpPortal_reportToMission(report) {
    return {
      id: 'ngo-' + report.id,
      reportId: report.id,
      title: report.title,
      desc: report.description,
      landmark: report.landmark || '',
      geoTag: report.geoTag,
      lat: report.lat,
      lon: report.lon,
      liveGps: report.liveGps,
      accuracyM: report.accuracyM,
      timeAgo: report.timeAgo,
      reporterLabel: report.reporterLabel,
      alertType: report.alertType,
      skills: helpPortal_skillsFromCategory(report.category),
      urgency: helpPortal_urgencyFromReport(report),
      distance: report.geoTag || `${report.lat?.toFixed(5)}, ${report.lon?.toFixed(5)}`
    };
  }

  async function helpPortal_loadCitizenIncidents(city) {
    helpPortal_incidentsLoading = true;
    if (typeof window.dbApi_fetchReports === 'function') {
      try {
        const online = typeof window.dbApi_isOnline === 'function' ? await window.dbApi_isOnline() : false;
        if (online) {
          helpPortal_incidentsCache = await window.dbApi_fetchReports(city);
          helpPortal_incidentsLoading = false;
          return helpPortal_incidentsCache.map(helpPortal_reportToMission);
        }
      } catch (e) {
        console.warn('helpPortal: could not load incidents from API', e);
      }
    }
    const reports =
      typeof window.alertFeed_getCommunityReports === 'function'
        ? window.alertFeed_getCommunityReports(city)
        : [];
    helpPortal_incidentsCache = reports;
    helpPortal_incidentsLoading = false;
    return reports.map(helpPortal_reportToMission);
  }

  // ═══════════════════════════════════════════════════════════
  // MODULE STYLING INJECTION
  // ═══════════════════════════════════════════════════════════
  function helpPortal_injectStyles() {
    if (document.getElementById('helpPortal-dynamic-styles')) return;

    const styleEl = document.createElement('style');
    styleEl.id = 'helpPortal-dynamic-styles';
    styleEl.textContent = `
      /* Premium glassmorphic background & panel styling */
      .helpPortal-glass-card {
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(51, 65, 85, 0.5);
      }
      
      /* Smooth sliding transitions */
      .helpPortal-chat-card {
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-out;
      }
      
      /* Scrollbar styling for chat log */
      .helpPortal-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
      .helpPortal-scrollbar::-webkit-scrollbar-track {
        background: rgba(15, 23, 42, 0.2);
      }
      .helpPortal-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(100, 116, 139, 0.4);
        border-radius: 4px;
      }
      .helpPortal-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(100, 116, 139, 0.6);
      }
      
      /* Beacon pulse animation */
      .helpPortal-beacon-pulse {
        animation: helpPortal-beacon-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
      }
      @keyframes helpPortal-beacon-ring {
        0% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.7); }
        70% { box-shadow: 0 0 0 12px rgba(244, 63, 94, 0); }
        100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
      }
      
      /* Subtle hover slide */
      .helpPortal-chip-btn {
        transition: all 0.2s ease;
      }
      .helpPortal-chip-btn:hover {
        transform: translateY(-1px);
      }
      .helpPortal-chip-btn:active {
        transform: translateY(0);
      }
      
      /* XP progress bar transition */
      .helpPortal-xp-bar {
        transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      
      /* Typing indicator dot animation */
      .helpPortal-typing-dot {
        animation: helpPortal-dot-bounce 1.4s infinite ease-in-out both;
      }
      .helpPortal-typing-dot:nth-child(1) { animation-delay: -0.32s; }
      .helpPortal-typing-dot:nth-child(2) { animation-delay: -0.16s; }
      @keyframes helpPortal-dot-bounce {
        0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
        40% { transform: scale(1); opacity: 1; }
      }

      /* Accepted task border flash */
      .helpPortal-task-accepted {
        border: 1px solid rgba(16, 185, 129, 0.5) !important;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.05);
        background-color: rgba(240, 253, 250, 0.8) !important;
      }
    `;
    document.head.appendChild(styleEl);
  }

  // ═══════════════════════════════════════════════════════════
  // VIEW REGISTRATION & STATE OBSERVER BINDINGS
  // ═══════════════════════════════════════════════════════════
  function helpPortal_onStateUpdate(state) {
    // 1. Handle Chatbot FAB & Overlay Visibility
    // Hide FAB & overlay if auth gate is visible (i.e. user is not logged in)
    const authScreen = document.getElementById('foundApp-auth-screen');
    const isAuthVisible = authScreen && !authScreen.classList.contains('hidden');
    
    const fab = document.getElementById('helpPortal-fab');
    const chatOverlay = document.getElementById('helpPortal-chat-overlay');
    
    if (isAuthVisible) {
      if (fab) fab.classList.add('hidden');
      if (chatOverlay) {
        chatOverlay.classList.add('hidden', 'opacity-0', 'translate-y-4');
        helpPortal_isChatOpen = false;
      }
    } else {
      if (fab) fab.classList.remove('hidden');
      
      // Auto pre-populate user phone from auth screen into registration if empty
      const regMobileInput = document.getElementById('helpPortal-reg-mobile');
      if (regMobileInput && !regMobileInput.value) {
        const authMobile = document.getElementById('auth-phone-input') ? document.getElementById('auth-phone-input').value : '';
        if (authMobile) {
          regMobileInput.value = authMobile;
        }
      }
    }

    // 2. Handle Volunteer Tab Display Routing
    const portalSlot = document.getElementById('portal-slot');
    if (!portalSlot) return;

    // Respect standard tab toggling & Low Bandwidth overrides
    if (!state.isLoggedIn) {
      portalSlot.innerHTML = '';
      return;
    }

    const shouldDisplay = (state.currentTab === 'volunteer') && (!state.isLowBandwidth);
    if (!shouldDisplay) {
      portalSlot.innerHTML = '';
      return;
    }

    helpPortal_renderPortal(portalSlot, state);
  }

  // Hook global stubs from foundation.js to react dynamically
  window.foundApp_onTabChanged = function(tabName) {
    if (window.appState) {
      helpPortal_onStateUpdate(window.appState);
    }
  };

  window.foundApp_onCityChanged = function(cityName) {
    if (window.appState) {
      helpPortal_onStateUpdate(window.appState);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // HELP DESK FAB & OVERLAY
  // ═══════════════════════════════════════════════════════════
  function helpPortal_applyChatbotI18n() {
    const fab = document.getElementById('helpPortal-fab');
    const titleEl = document.getElementById('helpPortal-chat-title');
    const subEl = document.getElementById('helpPortal-chat-subtitle');
    if (fab) fab.title = helpPortal_t('helpDeskTitle');
    if (titleEl) titleEl.textContent = helpPortal_t('helpDeskTitle');
    if (subEl) subEl.textContent = helpPortal_t('helpDeskSub');
  }

  function helpPortal_initChatbotDom() {
    const chatbotSlot = document.getElementById('chatbot-slot');
    if (!chatbotSlot) return;

    // Guard double-initialization
    if (document.getElementById('helpPortal-fab')) return;

    const html = `
      <!-- Floating Action Button -->
      <button id="helpPortal-fab" 
              class="absolute bottom-4 right-4 pointer-events-auto w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white flex items-center justify-center shadow-xl shadow-rose-600/30 transition-all active:scale-95 cursor-pointer z-50 helpPortal-beacon-pulse hidden"
              title="${helpPortal_t('helpDeskTitle')}">
        <span class="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-25"></span>
        <i class="fa-solid fa-headset text-xl z-10"></i>
      </button>
      
      <!-- Slide-up Floating Chat Overlay -->
      <div id="helpPortal-chat-overlay" 
           class="absolute bottom-20 right-4 pointer-events-auto w-[330px] h-[400px] helpPortal-glass-card rounded-2xl flex flex-col shadow-2xl z-50 helpPortal-chat-card translate-y-4 opacity-0 hidden overflow-hidden">
        
        <!-- Header -->
        <div class="px-4 py-3 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <div>
              <p id="helpPortal-chat-title" class="text-xs font-black text-white leading-none uppercase tracking-wider">${helpPortal_t('helpDeskTitle')}</p>
              <p id="helpPortal-chat-subtitle" class="text-[9px] font-bold text-slate-400 mt-0.5 leading-none">${helpPortal_t('helpDeskSub')}</p>
            </div>
          </div>
          <button id="helpPortal-chat-close" 
                  class="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-90 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer">
            <i class="fa-solid fa-xmark text-[10px]"></i>
          </button>
        </div>
        
        <!-- Messages Area -->
        <div id="helpPortal-chat-messages" 
             class="flex-1 overflow-y-auto px-4 py-3 space-y-3 helpPortal-scrollbar bg-slate-950/20 text-xs">
        </div>

        <!-- Typing Indicator -->
        <div id="helpPortal-typing-indicator" class="px-4 py-2.5 bg-slate-950/30 flex items-center gap-2 text-[10px] text-slate-400 hidden select-none">
          <i class="fa-solid fa-circle-notch fa-spin text-indigo-400"></i>
          <span>Looking up guidance…</span>
          <div class="flex items-center gap-0.5 mt-0.5">
            <span class="w-1.5 h-1.5 bg-slate-500 rounded-full helpPortal-typing-dot"></span>
            <span class="w-1.5 h-1.5 bg-slate-500 rounded-full helpPortal-typing-dot"></span>
            <span class="w-1.5 h-1.5 bg-slate-500 rounded-full helpPortal-typing-dot"></span>
          </div>
        </div>
        
        <!-- Easy-tap Quick Replies -->
        <div class="px-3.5 py-2.5 bg-slate-950/40 border-t border-slate-800/80 flex gap-1.5 overflow-x-auto whitespace-nowrap helpPortal-scrollbar select-none">
          <button class="helpPortal-chip-btn text-[9.5px] font-extrabold bg-slate-800 hover:bg-indigo-900 border border-slate-700/60 hover:border-indigo-700/60 text-slate-300 hover:text-indigo-200 px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer transition-all">
            🚨 Send SOS
          </button>
          <button class="helpPortal-chip-btn text-[9.5px] font-extrabold bg-slate-800 hover:bg-indigo-900 border border-slate-700/60 hover:border-indigo-700/60 text-slate-300 hover:text-indigo-200 px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer transition-all">
            📍 Find Camp
          </button>
          <button class="helpPortal-chip-btn text-[9.5px] font-extrabold bg-slate-800 hover:bg-indigo-900 border border-slate-700/60 hover:border-indigo-700/60 text-slate-300 hover:text-indigo-200 px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer transition-all">
            🩹 First Aid
          </button>
        </div>
        
        <!-- Text Input and Trigger -->
        <div class="p-2 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
          <input type="text" 
                 id="helpPortal-chat-input" 
                 placeholder="Ask about shelters, SOS, or first aid…" 
                 class="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all" />
          <button id="helpPortal-chat-send" 
                  class="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20 transition-all cursor-pointer">
            <i class="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </div>
        
      </div>
    `;
    
    chatbotSlot.innerHTML = html;
    helpPortal_bindChatbotEvents();
    helpPortal_renderChatHistory();
  }

  function helpPortal_bindChatbotEvents() {
    const fab = document.getElementById('helpPortal-fab');
    const overlay = document.getElementById('helpPortal-chat-overlay');
    const closeBtn = document.getElementById('helpPortal-chat-close');
    const sendBtn = document.getElementById('helpPortal-chat-send');
    const inputEl = document.getElementById('helpPortal-chat-input');
    
    if (fab) {
      fab.addEventListener('click', () => {
        helpPortal_toggleChat();
      });
    }
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        helpPortal_toggleChat();
      });
    }
    
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        helpPortal_handleUserInput();
      });
    }
    
    if (inputEl) {
      inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          helpPortal_handleUserInput();
        }
      });
    }
    
    // Bind quick reply chips dynamically
    const chips = overlay.querySelectorAll('.helpPortal-chip-btn');
    chips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        const text = e.currentTarget.textContent.trim();
        let query = text;
        if (text.includes("🚨 Send SOS")) query = "🚨 Send Emergency SOS";
        else if (text.includes("📍 Find Camp")) query = "Find Nearest Camp";
        else if (text.includes("🩹 First Aid")) query = "First Aid Guide";
        
        helpPortal_triggerQuickReply(query);
      });
    });
  }

  function helpPortal_toggleChat() {
    const overlay = document.getElementById('helpPortal-chat-overlay');
    if (!overlay) return;

    if (helpPortal_isChatOpen) {
      // Animate Close
      overlay.classList.remove('translate-y-0', 'opacity-100');
      overlay.classList.add('translate-y-4', 'opacity-0');
      setTimeout(() => {
        overlay.classList.add('hidden');
      }, 300);
      helpPortal_isChatOpen = false;
    } else {
      // Animate Open
      overlay.classList.remove('hidden');
      // Force Reflow
      overlay.offsetHeight;
      overlay.classList.remove('translate-y-4', 'opacity-0');
      overlay.classList.add('translate-y-0', 'opacity-100');
      helpPortal_isChatOpen = true;
      helpPortal_scrollToBottom();
      
      // Auto-focus input
      const inputEl = document.getElementById('helpPortal-chat-input');
      if (inputEl) setTimeout(() => inputEl.focus(), 150);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // CHATBOT CONVERSATIONAL NLP CORE
  // ═══════════════════════════════════════════════════════════
  function helpPortal_parseMarkdown(text) {
    let html = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<span class="italic text-slate-300">$1</span>');
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  function helpPortal_renderChatHistory() {
    const msgArea = document.getElementById('helpPortal-chat-messages');
    if (!msgArea) return;
    
    let html = '';
    helpPortal_chatHistory.forEach(msg => {
      const isUser = msg.sender === 'user';
      const parsedText = helpPortal_parseMarkdown(msg.text);
      
      if (isUser) {
        html += `
          <!-- User bubble -->
          <div class="flex flex-col items-end slide-up">
            <div class="bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-2xl rounded-tr-none px-3.5 py-2.5 max-w-[85%] shadow-md select-text">
              <p class="leading-normal font-medium">${parsedText}</p>
            </div>
            <span class="text-[8px] font-bold text-slate-400 mt-1 mr-1">${msg.time}</span>
          </div>
        `;
      } else {
        html += `
          <!-- Bot bubble -->
          <div class="flex items-start gap-2.5 slide-up">
            <div class="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mt-0.5 select-none flex-shrink-0">
              <i class="fa-solid fa-life-ring text-[10px]"></i>
            </div>
            <div class="flex flex-col">
              <div class="bg-slate-800 text-slate-200 rounded-2xl rounded-tl-none px-3.5 py-2.5 max-w-[85%] border border-slate-750 shadow-md select-text">
                <p class="leading-relaxed">${parsedText}</p>
              </div>
              <span class="text-[8px] font-bold text-slate-400 mt-1 ml-1">${msg.time}</span>
            </div>
          </div>
        `;
      }
    });
    
    msgArea.innerHTML = html;
    helpPortal_scrollToBottom();
  }

  function helpPortal_scrollToBottom() {
    const msgArea = document.getElementById('helpPortal-chat-messages');
    if (msgArea) {
      msgArea.scrollTop = msgArea.scrollHeight;
    }
  }

  function helpPortal_handleUserInput() {
    const inputEl = document.getElementById('helpPortal-chat-input');
    if (!inputEl) return;
    
    const val = inputEl.value.trim();
    if (!val) return;
    
    inputEl.value = '';
    helpPortal_triggerResponseFlow(val);
  }

  function helpPortal_triggerQuickReply(queryText) {
    helpPortal_triggerResponseFlow(queryText);
  }

  function helpPortal_triggerResponseFlow(query) {
    // 1. Add user message
    helpPortal_chatHistory.push({
      sender: 'user',
      text: query,
      time: helpPortal_getCurrentTime()
    });
    
    helpPortal_renderChatHistory();
    
    // 2. Trigger typing indicator
    const typingIndicator = document.getElementById('helpPortal-typing-indicator');
    if (typingIndicator) {
      typingIndicator.classList.remove('hidden');
      helpPortal_scrollToBottom();
    }
    
    setTimeout(() => {
      // Hide typing
      if (typingIndicator) typingIndicator.classList.add('hidden');
      
      // Select best local-context response
      const answer = helpPortal_nlpKeywordRouter(query);
      
      helpPortal_chatHistory.push({
        sender: 'bot',
        text: answer,
        time: helpPortal_getCurrentTime()
      });
      
      helpPortal_renderChatHistory();
    }, 850);
  }

  function helpPortal_nlpKeywordRouter(query) {
    const q = query.toLowerCase();
    const city = (window.appState && window.appState.currentCity) || 'Bengaluru';
    
    // Inter-module compatibility event trigger
    if (q.includes('sos') || q.includes('emergency') || q.includes('help')) {
      if (typeof window.mapHub_ensureLiveTracking === 'function') {
        window.mapHub_ensureLiveTracking();
      }
      if (typeof window.alertFeed_triggerSafetyBroadcast === 'function') {
        window.alertFeed_triggerSafetyBroadcast('help');
      }
      const live = typeof window.mapHub_getLivePosition === 'function' ? window.mapHub_getLivePosition() : null;
      const gpsLine = live
        ? `**Live GPS:** ${live.lat.toFixed(5)}°, ${live.lng.toFixed(5)}°${live.accuracy != null ? ` (±${Math.round(live.accuracy)}m)` : ''}`
        : `**GPS:** Allow location access for your real coordinates (showing ${city} area until fix).`;

      return `🚨 **SOS SENT**\n\n${gpsLine}\n\nFamily circle and responders in **${city}** have been notified with your current position.\n\nStay put if safe. Conserve battery. Tap pipes or walls if trapped so search teams can locate you.`;
    }

    if (q.includes('first aid') || q.includes('bleed') || q.includes('wound') || q.includes('cpr') || q.includes('injury') || q.includes('medical') || q.includes('doctor')) {
      return `🩹 **EMERGENCY FIRST AID DIRECTIVES**\n\n- **Severe Bleeding**: Apply firm, continuous pressure with a clean cloth. Elevate the limb. *Do not release pressure to check the wound.* \n- **Fractures**: Immobilize the limb. Do not attempt to reset broken bones.\n- **Burns**: Flush with cool water for 10 minutes. Do not apply ice or home remedies.`;
    }

    if (q.includes('camp') || q.includes('shelter') || q.includes('refuge') || q.includes('nearest') || q.includes('safe zone')) {
      if (typeof window.mapHub_openNearestSafeZone === 'function') {
        setTimeout(() => window.mapHub_openNearestSafeZone(), 400);
      }
      return `🏠 **SAFE ZONES IN ${city.toUpperCase()}**\n\nOpen shelters are on **Live Map** (Leaflet + OpenStreetMap). Routing you to the **nearest safe zone** now.\n\nGreen = shelters. Red = community hazard reports.`;
    }

    if (q.includes('water') || q.includes('flood') || q.includes('rain') || q.includes('monsoon')) {
      return `🌊 **FLOOD SURVIVAL INSTRUCTIONS**\n\n- **Rule 1**: Never walk or drive through flowing water. Just 6 inches of rushing water can sweep you away.\n- **Power Off**: Switch off household main circuits if water enters your home.\n- **Clean Water**: Drink *only* sealed bottled water or water purified with chlorine tablets. Local taps may be contaminated.`;
    }

    if (q.includes('earthquake') || q.includes('seismic') || q.includes('quake') || q.includes('tremor') || q.includes('shindo')) {
      return `🧱 **SEISMIC SHOCKWAVE DISCIPLINE**\n\n- **DROP, COVER, AND HOLD ON**. Get under heavy wooden desks.\n- If outdoors, stay away from historical brick facades, power lines, and tree limbs.\n- Anticipate aftershocks. Keep heavy-soled shoes close to your bed to avoid foot cuts from broken window glass.`;
    }

    // Default Fallback
    return `📋 **HELP DESK**\n\nFor *"${query}"* in **${city}**:\n\n1. Use **Live Map** for shelters and walking routes (OpenStreetMap).\n2. **Report a hazard** on Alerts so NGOs see it.\n3. Turn on **LBW** if your connection is weak.\n4. Open **NGO** tab to respond to citizen-reported incidents.`;
  }

  // ═══════════════════════════════════════════════════════════
  // VOLUNTEER COORDINATION & ONBOARDING HUB
  // ═══════════════════════════════════════════════════════════
  async function helpPortal_renderPortal(container, state) {
    if (!helpPortal_isRegistered) {
      helpPortal_renderRegistration(container);
      return;
    }
    const city = state.currentCity || 'Bengaluru';
    container.innerHTML = `
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
        <i class="fa-solid fa-circle-notch fa-spin text-indigo-500 text-xl mb-2"></i>
        <p class="text-xs text-slate-500">${helpPortal_t('loadingIncidents')}</p>
      </div>`;
    const missions = await helpPortal_loadCitizenIncidents(city);
    helpPortal_renderActiveTasks(container, state, missions);
  }

  // 1. Volunteer Onboarding Form Layout
  function helpPortal_renderRegistration(container) {
    const authMobile = document.getElementById('auth-phone-input') ? document.getElementById('auth-phone-input').value : '';
    
    let html = `
      <div id="helpPortal-registration-card" class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm slide-up select-none">
        
        <!-- Gamified Header -->
        <div class="flex items-center gap-2 mb-2">
          <div class="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
            <i class="fa-solid fa-hand-holding-heart text-indigo-600 text-xs"></i>
          </div>
          <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">NGO Response Network</span>
        </div>
        
        <h3 class="text-sm font-black text-slate-900 leading-snug mb-1">${helpPortal_t('ngoRegisterTitle')}</h3>
        <p class="text-[11px] text-slate-500 leading-relaxed mb-4">${helpPortal_t('ngoRegisterDesc')}</p>
        
        <!-- Interactive Fields Form -->
        <div class="space-y-4">
          
          <!-- Name Input -->
          <div class="flex flex-col gap-1">
            <label class="text-[9px] font-black uppercase text-slate-400 tracking-wider">Full Legal Name</label>
            <input type="text" 
                   id="helpPortal-reg-name" 
                   placeholder="Enter your name..." 
                   value="${helpPortal_registeredUser.name}"
                   class="bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 rounded-xl px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none transition-all" />
          </div>
          
          <!-- Mobile Input -->
          <div class="flex flex-col gap-1">
            <label class="text-[9px] font-black uppercase text-slate-400 tracking-wider">Registered Cell Number</label>
            <div class="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-600 transition-all">
              <span class="px-3.5 text-slate-500 text-xs font-semibold border-r border-slate-200 py-2.5">+91</span>
              <input type="tel" 
                     id="helpPortal-reg-mobile" 
                     placeholder="Enter 10-digit number" 
                     maxlength="10"
                     value="${helpPortal_registeredUser.mobile || authMobile}"
                     class="flex-1 bg-transparent px-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none" />
            </div>
          </div>
          
          <!-- Checkbox Skills Grid -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] font-black uppercase text-slate-400 tracking-wider">Responder Skillsets</label>
            
            <div class="grid grid-cols-2 gap-2.5">
              <label class="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl p-3 cursor-pointer transition-all active:scale-[0.98]">
                <input type="checkbox" name="helpPortal-skills" value="First Aid / Medical" class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500">
                <span class="text-[10px] font-extrabold text-slate-700 leading-tight">First Aid / Medical</span>
              </label>
              
              <label class="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl p-3 cursor-pointer transition-all active:scale-[0.98]">
                <input type="checkbox" name="helpPortal-skills" value="4x4 Offroad Transport" class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500">
                <span class="text-[10px] font-extrabold text-slate-700 leading-tight">4x4 Transport</span>
              </label>
              
              <label class="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl p-3 cursor-pointer transition-all active:scale-[0.98]">
                <input type="checkbox" name="helpPortal-skills" value="Search & Rescue (SAR)" class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500">
                <span class="text-[10px] font-extrabold text-slate-700 leading-tight">Search & Rescue</span>
              </label>
              
              <label class="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl p-3 cursor-pointer transition-all active:scale-[0.98]">
                <input type="checkbox" name="helpPortal-skills" value="Food & Ration Distribution" class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500">
                <span class="text-[10px] font-extrabold text-slate-700 leading-tight">Food Distribution</span>
              </label>
            </div>
          </div>

          <!-- Error Feedback Container -->
          <p id="helpPortal-reg-error" class="text-rose-600 text-xs hidden flex items-center gap-1 font-bold">
            <i class="fa-solid fa-circle-exclamation text-xs"></i> <span id="helpPortal-reg-error-text">Please resolve errors.</span>
          </p>

          <!-- Submit Trigger -->
          <button id="helpPortal-reg-submit"
                  class="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold py-3.5 rounded-2xl transition-all shadow-md shadow-indigo-600/10 text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer">
            <i class="fa-solid fa-id-card-clip"></i> Register P2P Relief Force
          </button>
          
        </div>
      </div>
    `;

    container.innerHTML = html;
    
    // Bind Submit Click
    const submitBtn = container.querySelector('#helpPortal-reg-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        helpPortal_processRegistration(container);
      });
    }
  }

  function helpPortal_processRegistration(container) {
    const nameInput = container.querySelector('#helpPortal-reg-name');
    const mobileInput = container.querySelector('#helpPortal-reg-mobile');
    const errorBox = container.querySelector('#helpPortal-reg-error');
    const errorText = container.querySelector('#helpPortal-reg-error-text');
    const cardShell = container.querySelector('#helpPortal-registration-card');

    const name = nameInput ? nameInput.value.trim() : '';
    const mobile = mobileInput ? mobileInput.value.trim() : '';
    
    // Get Checked Skills
    const skillCheckboxes = container.querySelectorAll('input[name="helpPortal-skills"]:checked');
    let skills = [];
    skillCheckboxes.forEach(cb => {
      skills.push(cb.value);
    });

    // Validation checks
    if (!name) {
      helpPortal_showRegError("Please enter your legal name.", errorBox, errorText, cardShell);
      nameInput.focus();
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      helpPortal_showRegError("Enter a valid 10-digit mobile number.", errorBox, errorText, cardShell);
      mobileInput.focus();
      return;
    }

    if (skills.length === 0) {
      helpPortal_showRegError("Please select at least one responder skill.", errorBox, errorText, cardShell);
      return;
    }

    // Success flow! Save state
    helpPortal_isRegistered = true;
    helpPortal_registeredUser = { name, mobile, skills };
    errorBox.classList.add('hidden');

    // Trigger state update re-render
    helpPortal_onStateUpdate(window.appState);
  }

  function helpPortal_showRegError(msg, errorBox, errorText, cardShell) {
    errorText.textContent = msg;
    errorBox.classList.remove('hidden');
    
    // Shake animation
    if (cardShell) {
      cardShell.classList.add('shake');
      setTimeout(() => cardShell.classList.remove('shake'), 450);
    }
  }

  function helpPortal_renderActiveTasks(container, state, missions) {
    const currentCity = state.currentCity || 'Bengaluru';
    const list = missions || [];

    let emptyBlock = '';
    if (list.length === 0) {
      emptyBlock = `
        <div class="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center">
          <i class="fa-solid fa-inbox text-slate-300 text-3xl mb-3"></i>
          <p class="text-sm font-semibold text-slate-700">${helpPortal_t('noIncidents')} ${currentCity}</p>
          <p class="text-xs text-slate-500 mt-2 leading-relaxed max-w-[260px] mx-auto">${helpPortal_t('noIncidentsHint')}</p>
          <button type="button" id="helpPortal-go-alerts" class="mt-4 text-xs font-bold text-indigo-600 underline cursor-pointer">${helpPortal_t('goAlerts')}</button>
        </div>`;
    }

    let html = `
      <div class="space-y-4 slide-up select-none">
        
        <!-- NGO responder card -->
        <div class="bg-gradient-to-tr from-slate-900 to-indigo-950 border border-slate-800 rounded-2xl p-4 text-white shadow-xl mb-4 relative overflow-hidden">
          <!-- Pulse backdrop grid -->
          <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: radial-gradient(#6366f1 1px, transparent 1px); background-size: 10px 10px;"></div>
          
          <!-- User Profile Badge -->
          <div class="flex items-center gap-3 relative z-10">
            <div class="w-12 h-12 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center shadow-inner">
              <i class="fa-solid fa-shield-halved text-indigo-400 text-xl animate-pulse"></i>
            </div>
            <div>
              <div class="flex flex-col min-w-0">
                <span class="text-xs font-black text-white leading-tight tracking-tight truncate">${helpPortal_registeredUser.name}</span>
                <span class="bg-indigo-600/40 border border-indigo-500/50 text-indigo-300 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full select-none w-max mt-0.5">
                  Call Sign: ${helpPortal_callSign}
                </span>
              </div>
            </div>
          </div>
          
          <!-- XP and Progress metrics -->
          <div class="grid grid-cols-3 gap-2 mt-4 border-t border-slate-800/80 pt-3 relative z-10 text-center text-xs">
            <div>
              <p class="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest leading-none">GRID XP</p>
              <p class="text-indigo-400 font-black font-mono mt-1 text-sm">${helpPortal_xp} XP</p>
            </div>
            <div>
              <p class="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest leading-none">MISSIONS</p>
              <p class="text-white font-black font-mono mt-1 text-sm">${helpPortal_missionsCompleted}</p>
            </div>
            <div>
              <p class="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest leading-none">RANK</p>
              <p class="text-rose-400 font-black mt-1 text-[10px] uppercase">${helpPortal_xp >= 200 ? 'VETERAN' : 'NOVICE'}</p>
            </div>
          </div>
          
          <!-- XP Progress Bar -->
          <div class="mt-3.5 relative z-10">
            <div class="flex items-center justify-between text-[9px] text-slate-400 font-bold mb-1">
              <span>NEXT RANK PROGRESS</span>
              <span>${helpPortal_xp % 100} / 100 XP</span>
            </div>
            <div class="w-full h-1.5 bg-slate-950 rounded-full border border-slate-800/40 overflow-hidden">
              <div class="h-full bg-gradient-to-r from-indigo-500 to-rose-500 helpPortal-xp-bar rounded-full" style="width: ${helpPortal_xp % 100}%;"></div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between px-1">
          <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1">
            <i class="fa-solid fa-building-flag text-[10.5px] text-indigo-600"></i> ${helpPortal_t('ngoResponse')} · ${currentCity}
          </h3>
          <span class="text-[9.5px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">${list.length} incident${list.length === 1 ? '' : 's'}</span>
        </div>
        <p class="text-[10px] text-slate-500 px-1 -mt-2">${helpPortal_t('ngoIncidentsSame')}</p>

        ${emptyBlock}

        <div class="space-y-3.5 ${list.length === 0 ? 'hidden' : ''}" id="helpPortal-mission-list">
          ${list.map((mission) => helpPortal_drawMissionCard(mission)).join('')}
        </div>

      </div>
    `;

    container.innerHTML = html;
    helpPortal_bindMissionAcceptEvents(container, currentCity);

    const goAlerts = container.querySelector('#helpPortal-go-alerts');
    if (goAlerts && typeof window.foundApp_switchTab === 'function') {
      goAlerts.addEventListener('click', () => window.foundApp_switchTab('alerts'));
    }
  }

  function helpPortal_drawMissionCard(mission) {
    const isAccepted = helpPortal_acceptedMissions[mission.id] || false;
    
    // Urgency coloring
    let urgencyBadge = '';
    if (mission.urgency === 'CRITICAL') {
      urgencyBadge = '<span class="bg-rose-100 text-rose-700 border border-rose-200/60 font-black text-[9px] px-2 py-0.5 rounded-md uppercase">CRITICAL</span>';
    } else if (mission.urgency === 'HIGH') {
      urgencyBadge = '<span class="bg-amber-100 text-amber-700 border border-amber-200/60 font-black text-[9px] px-2 py-0.5 rounded-md uppercase">HIGH</span>';
    } else {
      urgencyBadge = '<span class="bg-indigo-50 text-indigo-700 border border-indigo-150 font-black text-[9px] px-2 py-0.5 rounded-md uppercase">MEDIUM</span>';
    }

    // Card boundary class
    const cardClass = isAccepted ? 'helpPortal-task-accepted bg-teal-50/50' : 'bg-white';

    // Skill icons matching
    let skillIcon = 'fa-circle-dot';
    const firstSkill = mission.skills[0];
    if (firstSkill.includes('Medical')) skillIcon = 'fa-kit-medical text-rose-500';
    else if (firstSkill.includes('Transport')) skillIcon = 'fa-truck-monster text-amber-500';
    else if (firstSkill.includes('SAR')) skillIcon = 'fa-person-shelter text-indigo-500';
    else if (firstSkill.includes('Food')) skillIcon = 'fa-cookie-bite text-orange-500';

    return `
      <!-- Mission Card -->
      <div class="border border-slate-200 rounded-2xl p-4 shadow-sm transition-all duration-300 ${cardClass}" data-id="${mission.id}">
        <div class="flex items-start justify-between gap-2.5">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5 mb-1.5 flex-wrap">
              ${urgencyBadge}
              <span class="text-[9px] font-bold text-slate-400 font-mono">#${mission.reportId || mission.id}</span>
            </div>
            
            <h4 class="text-xs font-black text-slate-900 leading-snug">${mission.title}</h4>
            <p class="text-[10px] text-slate-500 mt-1 leading-relaxed">${mission.desc}</p>
            ${mission.landmark ? `<p class="text-[10px] text-slate-500 mt-1"><i class="fa-solid fa-landmark text-slate-400 mr-1"></i>${mission.landmark}</p>` : ''}
            <div class="mt-2 bg-indigo-50/80 border border-indigo-100 rounded-lg px-2 py-1.5">
              <span class="text-[9px] font-bold text-indigo-800 uppercase">${helpPortal_t('geoTag')}</span>
              <p class="font-mono text-[10px] text-slate-800 mt-0.5">${mission.geoTag || mission.distance}</p>
              <span class="text-[9px] text-slate-500">${mission.liveGps ? 'Live GPS' : 'Approx.'}${mission.accuracyM != null ? ` · ±${Math.round(mission.accuracyM)}m` : ''} · ${mission.timeAgo || ''}</span>
            </div>
            <div class="flex items-center gap-3 mt-2 flex-wrap">
              <span class="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                <i class="fa-solid ${skillIcon} text-[9px]"></i> ${firstSkill}
              </span>
              <button type="button" class="helpPortal-view-map text-[9px] font-bold text-indigo-600 underline cursor-pointer" data-lat="${mission.lat}" data-lng="${mission.lon}">${helpPortal_t('mapBtn')}</button>
            </div>
          </div>
          
          <!-- Interactive Action Block -->
          <div class="flex-shrink-0 mt-0.5">
            ${isAccepted ? `
              <!-- Active Lock Badge -->
              <span class="bg-emerald-600 text-white font-extrabold text-[10px] px-3 py-2 rounded-xl flex items-center gap-1 shadow-md shadow-emerald-600/10 cursor-default select-none animate-pulse">
                <i class="fa-solid fa-circle-check text-xs"></i> Locked
              </span>
            ` : `
              <!-- Accept Click Button -->
              <button class="helpPortal-accept-btn bg-indigo-600 hover:bg-indigo-500 active:scale-[0.96] text-white font-extrabold py-2 px-3.5 rounded-xl text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-all shadow-md shadow-indigo-600/10" data-id="${mission.id}" data-lat="${mission.lat}" data-lng="${mission.lon}">
                ${helpPortal_t('deploy')} <i class="fa-solid fa-arrow-right text-[8.5px]"></i>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }

  function helpPortal_bindMissionAcceptEvents(container, currentCity) {
    const list = container.querySelector('#helpPortal-mission-list');
    if (!list) return;

    list.querySelectorAll('.helpPortal-view-map').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lat = parseFloat(btn.getAttribute('data-lat'));
        const lng = parseFloat(btn.getAttribute('data-lng'));
        if (typeof window.foundApp_switchTab === 'function') window.foundApp_switchTab('map');
        if (typeof window.mapHub_panToLocation === 'function' && !isNaN(lat) && !isNaN(lng)) {
          setTimeout(() => window.mapHub_panToLocation(lat, lng, 17), 400);
        }
      });
    });

    list.querySelectorAll('.helpPortal-accept-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const lat = parseFloat(e.currentTarget.getAttribute('data-lat'));
        const lng = parseFloat(e.currentTarget.getAttribute('data-lng'));
        helpPortal_acceptMission(id, lat, lng);
      });
    });
  }

  function helpPortal_acceptMission(missionId, lat, lon) {
    helpPortal_acceptedMissions[missionId] = true;
    helpPortal_xp += 50;
    helpPortal_missionsCompleted += 1;

    if (typeof window.foundApp_switchTab === 'function') window.foundApp_switchTab('map');
    if (typeof window.mapHub_panToLocation === 'function' && !isNaN(lat) && !isNaN(lon)) {
      setTimeout(() => window.mapHub_panToLocation(lat, lon, 17), 450);
    }

    helpPortal_onStateUpdate(window.appState);
  }

  // ═══════════════════════════════════════════════════════════
  // INITIALIZATION HANDLERS
  // ═══════════════════════════════════════════════════════════
  function helpPortal_initModule() {
    helpPortal_injectStyles();
    helpPortal_initChatbotDom();
    helpPortal_applyChatbotI18n();

    document.addEventListener('resqnet-lang-change', helpPortal_applyChatbotI18n);

    if (window.appState) {
      window.appState.subscribe(helpPortal_onStateUpdate);
      helpPortal_onStateUpdate(window.appState);
    }
  }

  // Auto boot module
  helpPortal_initModule();
});
