/**
 * ResqNet — 24-language UI (i18n)
 * Prefix: i18n_
 */

const i18n_STORAGE_KEY = 'resqnet_lang_v1';

const i18n_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' }
];

const i18n_EN = {
  appTagline: 'Emergency Disaster Network',
  activeProtocol: 'Active Emergency Protocol',
  language: 'Language',
  tabAlerts: 'Alerts',
  tabMap: 'Live Map',
  tabNgo: 'NGO',
  loginTitle: 'Login to your Account',
  loginTitleOtp: 'Enter verification code',
  signIn: 'Sign in',
  signInContinue: 'Sign in',
  orSignInWith: '- Or sign in with -',
  noAccount: "Don't have an account?",
  signUp: 'Sign up',
  signUpHint: 'Use your mobile number above — we verify with OTP (demo code 4040).',
  mobileNumber: 'Mobile Number',
  phonePlaceholder: 'Mobile number',
  sendOtp: 'Send OTP',
  verifyEnter: 'Sign in',
  changeNumber: 'Change Number',
  resendOtp: 'Resend OTP',
  otpLabel: 'Enter 4-Digit OTP',
  otpSent: 'OTP Sent!',
  otpHint: 'Code sent to mobile ending in',
  invalidOtp: "Invalid OTP. Try bypass code '4040'.",
  invalidPhone: 'Enter a valid 10-digit mobile number.',
  termsLine: 'By continuing, you agree to our Terms & Privacy',
  devBypass: 'Developer Bypass OTP:',
  sirenTitle: 'Manual emergency siren (tap to sound)',
  lbwMode: 'Low Bandwidth Mode',
  lbwLabel: 'LBW',
  alertsTitle: 'alerts',
  alertsSubtitle: 'Citizen geo-tagged alerts · live signals · SQL',
  citizenEmergency: 'Citizen emergency alert',
  citizenEmergencyDesc: 'Report danger with a geo tag so responders find you on the map.',
  communityReports: 'Citizen alerts',
  noReportsYet: 'No reports yet in',
  noReportsHint: 'Be the first to report a hazard — others will see it here and on the map.',
  reportPublished: 'Citizen alert published',
  reportPublishedHint: 'Geo-tagged and visible on Alerts + map for',
  reportAnother: 'Report another',
  alertLevel: 'Alert level',
  incidentType: 'Incident type',
  landmark: 'Landmark (optional)',
  yourName: 'Your name (optional)',
  whatHappening: 'What is happening?',
  publishGeo: 'Publish geo-tagged report',
  sendEmergency: 'Send emergency alert',
  geoTag: 'Geo tag',
  refreshGps: 'Refresh GPS',
  previewMap: 'Preview map',
  liveGps: 'Live GPS',
  cityFallback: 'City fallback',
  acquiringGps: 'Acquiring GPS for geo tag…',
  familyCheckin: 'Family check-in',
  familyCheckinDesc: 'Sends your live GPS location when available.',
  iAmSafe: 'I am safe',
  requestHelp: 'Request help',
  viewOnMap: 'View geo tag on map →',
  syncing: 'Syncing…',
  sqlBadge: 'SQL',
  offlineBadge: 'Offline · local',
  loadingDb: 'Loading reports from database…',
  emergencySos: 'Emergency SOS',
  hazardReport: 'Hazard report',
  situationWatch: 'Situation watch',
  ngoRegisterTitle: 'Register as NGO responder',
  ngoRegisterDesc: 'View and deploy to citizen-reported incidents only — same alerts as Alerts tab.',
  ngoResponse: 'NGO response',
  ngoIncidentsSame: 'Same reports as Alerts — geo-tagged citizen emergencies only.',
  noIncidents: 'No citizen incidents in',
  noIncidentsHint: 'Missions appear only when someone submits a geo-tagged alert on Alerts. None are pre-created.',
  goAlerts: 'Go to Alerts →',
  loadingIncidents: 'Loading citizen-reported incidents…',
  deploy: 'Deploy',
  mapBtn: 'Map',
  safeZones: 'Safe zones',
  mapSubtitle: 'Shelters · quakes · NASA events · live GPS',
  centerOnMe: 'Center on me',
  nearestSafeZone: 'Nearest safe zone',
  mapLegend: 'Green shelters · red citizen geo alerts · amber quakes · violet EONET',
  helpDeskTitle: 'Help Desk',
  helpDeskSub: 'Crisis guidance & quick actions',
  disasterIncoming: 'Disaster incoming',
  emergencySiren: 'Emergency siren',
  silenceSiren: 'Silence siren (30 min auto-snooze)',
  goSafeZone: 'Go to nearest safe zone',
  loadingSignals: 'Loading live weather, earthquakes & hazard signals…',
  refresh: 'Refresh',
  didNotReceive: "Didn't receive?"
};

function i18n_mergeLocale(partial) {
  return Object.assign({}, i18n_EN, partial);
}

const i18n_LOCALES = {
  hi: i18n_mergeLocale({
    loginTitle: 'अपने खाते में लॉगिन करें',
    loginTitleOtp: 'सत्यापन कोड दर्ज करें',
    signIn: 'साइन इन',
    orSignInWith: '- या इसके साथ साइन इन करें -',
    noAccount: 'खाता नहीं है?',
    signUp: 'साइन अप',
    appTagline: 'आपातकालीन आपदा नेटवर्क',
    activeProtocol: 'सक्रिय आपात प्रोटोकॉल',
    tabAlerts: 'अलर्ट',
    tabMap: 'लाइव मैप',
    tabNgo: 'एनजीओ',
    sendOtp: 'OTP भेजें',
    verifyEnter: 'सत्यापित करें',
    citizenEmergency: 'नागरिक आपात अलर्ट',
    communityReports: 'नागरिक अलर्ट',
    iAmSafe: 'मैं सुरक्षित हूँ',
    requestHelp: 'मदद चाहिए',
    language: 'भाषा'
  }),
  bn: i18n_mergeLocale({
    appTagline: 'জরুরি দুর্যোগ নেটওয়ার্ক',
    tabAlerts: 'সতর্কতা',
    tabMap: 'লাইভ মানচিত্র',
    tabNgo: 'এনজিও',
    sendOtp: 'OTP পাঠান',
    verifyEnter: 'যাচাই করুন',
    citizenEmergency: 'নাগরিক জরুরি সতর্কতা',
    iAmSafe: 'আমি নিরাপদ',
    requestHelp: 'সাহায্য চাই',
    language: 'ভাষা'
  }),
  te: i18n_mergeLocale({
    appTagline: 'అత్యవసర విపత్తు నెట్‌వర్క్',
    tabAlerts: 'హెచ్చరికలు',
    tabMap: 'లైవ్ మ్యాప్',
    tabNgo: 'ఎన్జీఓ',
    sendOtp: 'OTP పంపు',
    verifyEnter: 'ధృవీకరించు',
    language: 'భాష'
  }),
  mr: i18n_mergeLocale({
    appTagline: 'आपत्कालीन आपत्ती नेटवर्क',
    tabAlerts: 'सूचना',
    tabMap: 'लाइव नकाशा',
    tabNgo: 'एनजीओ',
    sendOtp: 'OTP पाठवा',
    language: 'भाषा'
  }),
  ta: i18n_mergeLocale({
    appTagline: 'அவசர பேரிடர் வலையமைப்பு',
    tabAlerts: 'எச்சரிக்கை',
    tabMap: 'நேரடி வரைபடம்',
    tabNgo: 'என்ஜிஓ',
    sendOtp: 'OTP அனுப்பு',
    verifyEnter: 'சரிபார்',
    language: 'மொழி'
  }),
  ur: i18n_mergeLocale({
    appTagline: 'ہنگامی آفت نیٹ ورک',
    tabAlerts: 'الرٹ',
    tabMap: 'لائیو نقشہ',
    tabNgo: 'این جی او',
    sendOtp: 'OTP بھیجیں',
    language: 'زبان'
  }),
  gu: i18n_mergeLocale({
    appTagline: 'કટોકટી આપત્તિ નેટવર્ક',
    tabAlerts: 'અલર્ટ',
    tabMap: 'લાઇવ મેપ',
    tabNgo: 'એનજીઓ',
    language: 'ભાષા'
  }),
  kn: i18n_mergeLocale({
    appTagline: 'ತುರ್ತು ವಿಪತ್ತು ಜಾಲ',
    tabAlerts: 'ಎಚ್ಚರಿಕೆ',
    tabMap: 'ಲೈವ್ ನಕ್ಷೆ',
    tabNgo: 'ಎನ್‌ಜಿಒ',
    language: 'ಭಾಷೆ'
  }),
  ml: i18n_mergeLocale({
    appTagline: 'അടിയന്തര ദുരന്ത നെറ്റ്‌വർക്ക്',
    tabAlerts: 'മുന്നറിയിപ്പ്',
    tabMap: 'ലൈവ് മാപ്',
    tabNgo: 'എൻജിഒ',
    language: 'ഭാഷ'
  }),
  pa: i18n_mergeLocale({
    appTagline: 'ਐਮਰਜੈਂਸੀ ਆਪਦਾ ਨੈੱਟਵਰਕ',
    tabAlerts: 'ਚੇਤਾਵਨੀ',
    tabMap: 'ਲਾਈਵ ਨਕਸ਼ਾ',
    tabNgo: 'ਐਨਜੀਓ',
    language: 'ਭਾਸ਼ਾ'
  }),
  or: i18n_mergeLocale({
    appTagline: 'ଜରୁରୀକାଳୀନ ବିପର୍ଯ୍ୟୟ ନେଟୱର୍କ',
    tabAlerts: 'ସତର୍କତା',
    tabMap: 'ଲାଇଭ ମାନଚିତ୍ର',
    tabNgo: 'ଏନଜିଓ',
    language: 'ଭାଷା'
  }),
  as: i18n_mergeLocale({
    appTagline: 'জৰুৰীকালীন দুৰ্যোগ নেটৱৰ্ক',
    tabAlerts: 'সতৰ্কবাণী',
    tabMap: 'লাইভ মানচিত্ৰ',
    tabNgo: 'এনজিঅ',
    language: 'ভাষা'
  }),
  ja: i18n_mergeLocale({
    appTagline: '緊急災害ネットワーク',
    tabAlerts: 'アラート',
    tabMap: 'ライブマップ',
    tabNgo: 'NGO',
    sendOtp: 'OTP送信',
    verifyEnter: '確認して入る',
    language: '言語'
  }),
  es: i18n_mergeLocale({
    appTagline: 'Red de emergencia',
    tabAlerts: 'Alertas',
    tabMap: 'Mapa en vivo',
    tabNgo: 'ONG',
    sendOtp: 'Enviar OTP',
    verifyEnter: 'Verificar',
    language: 'Idioma'
  }),
  fr: i18n_mergeLocale({
    appTagline: 'Réseau d\'urgence',
    tabAlerts: 'Alertes',
    tabMap: 'Carte live',
    tabNgo: 'ONG',
    sendOtp: 'Envoyer OTP',
    language: 'Langue'
  }),
  de: i18n_mergeLocale({
    appTagline: 'Notfall-Netzwerk',
    tabAlerts: 'Warnungen',
    tabMap: 'Live-Karte',
    tabNgo: 'NGO',
    language: 'Sprache'
  }),
  ar: i18n_mergeLocale({
    appTagline: 'شبكة الكوارث الطارئة',
    tabAlerts: 'تنبيهات',
    tabMap: 'خريطة مباشرة',
    tabNgo: 'منظمة',
    sendOtp: 'إرسال OTP',
    language: 'اللغة'
  }),
  pt: i18n_mergeLocale({
    appTagline: 'Rede de emergência',
    tabAlerts: 'Alertas',
    tabMap: 'Mapa ao vivo',
    tabNgo: 'ONG',
    language: 'Idioma'
  }),
  ru: i18n_mergeLocale({
    appTagline: 'Сеть ЧС',
    tabAlerts: 'Оповещения',
    tabMap: 'Карта',
    tabNgo: 'НКО',
    language: 'Язык'
  }),
  zh: i18n_mergeLocale({
    appTagline: '应急灾害网络',
    tabAlerts: '警报',
    tabMap: '实时地图',
    tabNgo: '非政府',
    sendOtp: '发送OTP',
    language: '语言'
  }),
  ko: i18n_mergeLocale({
    appTagline: '긴급 재난 네트워크',
    tabAlerts: '알림',
    tabMap: '실시간 지도',
    tabNgo: 'NGO',
    language: '언어'
  }),
  vi: i18n_mergeLocale({
    appTagline: 'Mạng thảm họa',
    tabAlerts: 'Cảnh báo',
    tabMap: 'Bản đồ',
    tabNgo: 'NGO',
    language: 'Ngôn ngữ'
  }),
  id: i18n_mergeLocale({
    appTagline: 'Jaringan bencana',
    tabAlerts: 'Peringatan',
    tabMap: 'Peta langsung',
    tabNgo: 'LSM',
    language: 'Bahasa'
  })
};

let i18n_currentLang = 'en';

function i18n_getPack(code) {
  if (code === 'en') return i18n_EN;
  return i18n_LOCALES[code] || i18n_EN;
}

window.i18n_t = function (key, vars) {
  let s = i18n_getPack(i18n_currentLang)[key] || i18n_EN[key] || key;
  if (vars) {
    Object.keys(vars).forEach((k) => {
      s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), vars[k]);
    });
  }
  return s;
};

window.i18n_getLanguages = function () {
  return i18n_LANGUAGES;
};

window.i18n_getLanguage = function () {
  return i18n_currentLang;
};

function i18n_setDocumentDirection(code) {
  const rtl = code === 'ar' || code === 'ur';
  document.documentElement.lang = code;
  document.documentElement.dir = rtl ? 'rtl' : 'ltr';
}

function i18n_populateSelectors() {
  document.querySelectorAll('.i18n-language-select').forEach((sel) => {
    const prev = sel.value || i18n_currentLang;
    sel.innerHTML = i18n_LANGUAGES.map(
      (l) => `<option value="${l.code}">${l.native}</option>`
    ).join('');
    sel.value = i18n_LANGUAGES.some((l) => l.code === prev) ? prev : 'en';
  });
}

window.i18n_applyDom = function () {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const otpStep = document.getElementById('auth-step-otp');
    if (el.id === 'auth-page-title' && otpStep && !otpStep.classList.contains('hidden')) {
      el.textContent = window.i18n_t('loginTitleOtp');
      return;
    }
    const key = el.getAttribute('data-i18n');
    const attr = el.getAttribute('data-i18n-attr');
    const text = window.i18n_t(key);
    if (attr) el.setAttribute(attr, text);
    else el.textContent = text;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = window.i18n_t(el.getAttribute('data-i18n-placeholder'));
  });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = window.i18n_t(el.getAttribute('data-i18n-title'));
  });
  i18n_populateSelectors();
};

window.i18n_setLanguage = function (code) {
  if (!i18n_LANGUAGES.some((l) => l.code === code)) code = 'en';
  i18n_currentLang = code;
  try {
    localStorage.setItem(i18n_STORAGE_KEY, code);
  } catch {
    /* */
  }
  i18n_setDocumentDirection(code);
  window.i18n_applyDom();
  if (window.appState) {
    window.appState.currentLanguage = code;
    window.appState.listeners.forEach((cb) => cb(window.appState));
  }
};

function i18n_init() {
  try {
    const saved = localStorage.getItem(i18n_STORAGE_KEY);
    if (saved && i18n_LANGUAGES.some((l) => l.code === saved)) i18n_currentLang = saved;
  } catch {
    /* */
  }
  i18n_setDocumentDirection(i18n_currentLang);
  if (window.appState) window.appState.currentLanguage = i18n_currentLang;
  i18n_populateSelectors();
  window.i18n_applyDom();
}

document.addEventListener('DOMContentLoaded', i18n_init);
