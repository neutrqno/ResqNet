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
  settings: 'Settings',
  changePlace: 'Location',
  tabAlerts: 'Alerts',
  tabMap: 'Live Map',
  tabNgo: 'NGO',
  loginTitle: 'Login to your Account',
  loginTitleOtp: 'Enter verification code',
  signIn: 'Sign in',
  signInContinue: 'Sign in',
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

/** Auth, navigation, and primary screen labels per language */
const i18n_UI_PACKS = {
  hi: {
    loginTitle: 'अपने खाते में लॉगिन करें', loginTitleOtp: 'सत्यापन कोड दर्ज करें', signIn: 'साइन इन', signInContinue: 'साइन इन',
    phonePlaceholder: 'मोबाइल नंबर', invalidPhone: 'वैध 10 अंकों का मोबाइल नंबर दर्ज करें।', invalidOtp: 'गलत कोड। पुनः प्रयास करें।',
    noAccount: 'खाता नहीं है?', signUp: 'साइन अप', signUpHint: 'ऊपर मोबाइल नंबर दर्ज करें — OTP से सत्यापित करें (डेमो: 4040)।',
    changeNumber: 'वापस', otpHint: 'इस नंबर पर कोड भेजा गया', didNotReceive: 'कोड नहीं मिला?', resendOtp: 'पुनः भेजें', devBypass: 'डेमो OTP:',
    appTagline: 'आपातकालीन आपदा नेटवर्क', activeProtocol: 'सक्रिय आपात प्रोटोकॉल', tabAlerts: 'अलर्ट', tabMap: 'लाइव मैप', tabNgo: 'एनजीओ',
    language: 'भाषा', settings: 'सेटिंग्स', changePlace: 'स्थान', lbwLabel: 'LBW', lbwMode: 'कम बैंडविड्थ मोड', sirenTitle: 'आपात सायरन (ध्वनि के लिए टैप करें)',
    alertsTitle: 'अलर्ट', alertsSubtitle: 'नागरिक जियो-टैग अलर्ट · लाइव सिग्नल', communityReports: 'नागरिक अलर्ट',
    loadingSignals: 'मौसम, भूकंप और खतरे के सिग्नल लोड हो रहे हैं…', refresh: 'रीफ़्रेश',
    safeZones: 'सुरक्षित क्षेत्र', mapSubtitle: 'आश्रय · भूकंप · NASA · लाइव GPS', centerOnMe: 'मेरे स्थान पर', nearestSafeZone: 'निकटतम सुरक्षित क्षेत्र',
    helpDeskTitle: 'सहायता केंद्र', helpDeskSub: 'संकट मार्गदर्शन और त्वरित कार्रवाई'
  },
  bn: {
    loginTitle: 'আপনার অ্যাকাউন্টে লগইন', loginTitleOtp: 'যাচাইকরণ কোড লিখুন', signIn: 'সাইন ইন', signInContinue: 'সাইন ইন',
    phonePlaceholder: 'মোবাইল নম্বর', invalidPhone: 'বৈধ ১০ অঙ্কের মোবাইল নম্বর দিন।', invalidOtp: 'ভুল কোড। আবার চেষ্টা করুন।',
    noAccount: 'অ্যাকাউন্ট নেই?', signUp: 'সাইন আপ', signUpHint: 'উপরে মোবাইল নম্বর দিন — OTP দিয়ে যাচাই (ডেমো: 4040)।',
    changeNumber: 'পিছনে', otpHint: 'এই নম্বরে কোড পাঠানো হয়েছে', didNotReceive: 'কোড পাননি?', resendOtp: 'আবার পাঠান', devBypass: 'ডেমো OTP:',
    appTagline: 'জরুরি দুর্যোগ নেটওয়ার্ক', activeProtocol: 'সক্রিয় জরুরি প্রোটোকল', tabAlerts: 'সতর্কতা', tabMap: 'লাইভ মানচিত্র', tabNgo: 'এনজিও',
    language: 'ভাষা', lbwLabel: 'LBW', lbwMode: 'কম ব্যান্ডউইথ মোড', sirenTitle: 'জরুরি সাইরেন',
    alertsTitle: 'সতর্কতা', alertsSubtitle: 'নাগরিক জিও-ট্যাগ সতর্কতা · লাইভ সিগন্যাল', communityReports: 'নাগরিক সতর্কতা',
    loadingSignals: 'আবহাওয়া, ভূমিকম্প ও ঝুঁকির সিগন্যাল লোড হচ্ছে…', refresh: 'রিফ্রেশ',
    safeZones: 'নিরাপদ এলাকা', mapSubtitle: 'আশ্রয় · ভূমিকম্প · NASA · লাইভ GPS', centerOnMe: 'আমার অবস্থান', nearestSafeZone: 'নিকটতম নিরাপদ এলাকা',
    helpDeskTitle: 'সহায়তা ডেস্ক', helpDeskSub: 'সংকট নির্দেশনা ও দ্রুত পদক্ষেপ'
  },
  te: {
    loginTitle: 'మీ ఖాతాకు లాగిన్', loginTitleOtp: 'ధృవీకరణ కోడ్ నమోదు చేయండి', signIn: 'సైన్ ఇన్', signInContinue: 'సైన్ ఇన్',
    phonePlaceholder: 'మొబైల్ నంబర్', invalidPhone: 'చెల్లుబాటు అయ్యే 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.', invalidOtp: 'తప్పు కోడ్. మళ్లీ ప్రయత్నించండి.',
    noAccount: 'ఖాతా లేదా?', signUp: 'సైన్ అప్', signUpHint: 'పైన మొబైల్ నంబర్ నమోదు చేయండి — OTP తో ధృవీకరణ (డెమో: 4040).',
    changeNumber: 'వెనక్కి', otpHint: 'ఈ నంబర్‌కు కోడ్ పంపబడింది', didNotReceive: 'కోడ్ రాలేదా?', resendOtp: 'మళ్లీ పంపు', devBypass: 'డెమో OTP:',
    appTagline: 'అత్యవసర విపత్తు నెట్‌వర్క్', activeProtocol: 'సక్రియ అత్యవసర ప్రోటోకాల్', tabAlerts: 'హెచ్చరికలు', tabMap: 'లైవ్ మ్యాప్', tabNgo: 'ఎన్జీఓ',
    language: 'భాష', lbwLabel: 'LBW', lbwMode: 'తక్కువ బ్యాండ్‌విడ్త్ మోడ్', sirenTitle: 'అత్యవసర సైరన్',
    alertsTitle: 'హెచ్చరికలు', alertsSubtitle: 'పౌర జియో-ట్యాగ్ హెచ్చరికలు · లైవ్ సిగ్నల్స్', communityReports: 'పౌర హెచ్చరికలు',
    loadingSignals: 'వాతావరణం, భూకంపాలు & ప్రమాద సిగ్నల్స్ లోడ్ అవుతున్నాయి…', refresh: 'రిఫ్రెష్',
    safeZones: 'సురక్షిత ప్రాంతాలు', mapSubtitle: 'ఆశ్రయాలు · భూకంపాలు · NASA · లైవ్ GPS', centerOnMe: 'నా స్థానం', nearestSafeZone: 'సమీప సురక్షిత ప్రాంతం',
    helpDeskTitle: 'సహాయ డెస్క్', helpDeskSub: 'సంక్షోభ మార్గదర్శకత్వం & త్వరిత చర్యలు'
  },
  mr: {
    loginTitle: 'तुमच्या खात्यात लॉगिन', loginTitleOtp: 'पडताळणी कोड प्रविष्ट करा', signIn: 'साइन इन', signInContinue: 'साइन इन',
    phonePlaceholder: 'मोबाइल नंबर', invalidPhone: 'वैध 10 अंकी मोबाइल नंबर प्रविष्ट करा.', invalidOtp: 'चुकीचा कोड. पुन्हा प्रयत्न करा.',
    noAccount: 'खाते नाही?', signUp: 'साइन अप', signUpHint: 'वर मोबाइल नंबर प्रविष्ट करा — OTP ने पडताळणी (डेमो: 4040).',
    changeNumber: 'मागे', otpHint: 'या नंबरवर कोड पाठवला', didNotReceive: 'कोड मिळाला नाही?', resendOtp: 'पुन्हा पाठवा', devBypass: 'डेमो OTP:',
    appTagline: 'आपत्कालीन आपत्ती नेटवर्क', activeProtocol: 'सक्रिय आपत्कालीन प्रोटोकॉल', tabAlerts: 'सूचना', tabMap: 'लाइव नकाशा', tabNgo: 'एनजीओ',
    language: 'भाषा', lbwLabel: 'LBW', lbwMode: 'कमी बँडविड्थ मोड', sirenTitle: 'आपत्कालीन सायरन',
    alertsTitle: 'सूचना', alertsSubtitle: 'नागरिक जिओ-टॅग सूचना · लाइव्ह सिग्नल', communityReports: 'नागरिक सूचना',
    loadingSignals: 'हवामान, भूकंप आणि धोका सिग्नल लोड होत आहेत…', refresh: 'रिफ्रेश',
    safeZones: 'सुरक्षित क्षेत्र', mapSubtitle: 'आश्रय · भूकंप · NASA · लाइव्ह GPS', centerOnMe: 'माझे स्थान', nearestSafeZone: 'जवळचे सुरक्षित क्षेत्र',
    helpDeskTitle: 'मदत केंद्र', helpDeskSub: 'संकट मार्गदर्शन आणि जलद कृती'
  },
  ta: {
    loginTitle: 'உங்கள் கணக்கில் உள்நுழை', loginTitleOtp: 'சரிபார்ப்பு குறியீட்டை உள்ளிடவும்', signIn: 'உள்நுழை', signInContinue: 'உள்நுழை',
    phonePlaceholder: 'மொபைல் எண்', invalidPhone: 'செல்லுபடியாகும் 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்.', invalidOtp: 'தவறான குறியீடு. மீண்டும் முயற்சிக்கவும்.',
    noAccount: 'கணக்கு இல்லையா?', signUp: 'பதிவு', signUpHint: 'மேலே மொபைல் எண்ணை உள்ளிடவும் — OTP மூலம் சரிபார்ப்பு (டெமோ: 4040).',
    changeNumber: 'பின்செல்', otpHint: 'இந்த எண்ணுக்கு குறியீடு அனுப்பப்பட்டது', didNotReceive: 'குறியீடு வரவில்லை?', resendOtp: 'மீண்டும் அனுப்பு', devBypass: 'டெமோ OTP:',
    appTagline: 'அவசர பேரிடர் வலையமைப்பு', activeProtocol: 'செயலில் அவசர நெறிமுறை', tabAlerts: 'எச்சரிக்கை', tabMap: 'நேரடி வரைபடம்', tabNgo: 'என்ஜிஓ',
    language: 'மொழி', lbwLabel: 'LBW', lbwMode: 'குறைந்த அலைவரிசை முறை', sirenTitle: 'அவசர சைரன்',
    alertsTitle: 'எச்சரிக்கை', alertsSubtitle: 'குடிமக்கள் ஜியோ-டேக் எச்சரிக்கை · நேரடி சிக்னல்', communityReports: 'குடிமக்கள் எச்சரிக்கை',
    loadingSignals: 'வானிலை, நிலநடுப்பு & ஆபத்து சிக்னல்கள் ஏற்றுகிறது…', refresh: 'புதுப்பி',
    safeZones: 'பாதுகாப்பு மண்டலங்கள்', mapSubtitle: 'தஞ்சம் · நிலநடுப்பு · NASA · நேரடி GPS', centerOnMe: 'என் இடம்', nearestSafeZone: 'அருகிலுள்ள பாதுகாப்பு மண்டலம்',
    helpDeskTitle: 'உதவி மையம்', helpDeskSub: 'நெருக்கடி வழிகாட்டுதல் & விரைவு நடவடிக்கை'
  },
  ur: {
    loginTitle: 'اپنے اکاؤنٹ میں لاگ ان', loginTitleOtp: 'تصدیقی کوڈ درج کریں', signIn: 'سائن ان', signInContinue: 'سائن ان',
    phonePlaceholder: 'موبائل نمبر', invalidPhone: 'درست 10 ہندسوں کا موبائل نمبر درج کریں۔', invalidOtp: 'غلط کوڈ۔ دوبارہ کوشش کریں۔',
    noAccount: 'اکاؤنٹ نہیں؟', signUp: 'سائن اپ', signUpHint: 'اوپر موبائل نمبر درج کریں — OTP سے تصدیق (ڈیمو: 4040)۔',
    changeNumber: 'واپس', otpHint: 'اس نمبر پر کوڈ بھیجا گیا', didNotReceive: 'کوڈ نہیں ملا؟', resendOtp: 'دوبارہ بھیجیں', devBypass: 'ڈیمو OTP:',
    appTagline: 'ہنگامی آفت نیٹ ورک', activeProtocol: 'فعال ہنگامی پروٹوکول', tabAlerts: 'الرٹ', tabMap: 'لائیو نقشہ', tabNgo: 'این جی او',
    language: 'زبان', lbwLabel: 'LBW', lbwMode: 'کم بینڈوڈتھ موڈ', sirenTitle: 'ہنگامی سائرن',
    alertsTitle: 'الرٹ', alertsSubtitle: 'شہری جیو-ٹیگ الرٹ · لائیو سگنل', communityReports: 'شہری الرٹ',
    loadingSignals: 'موسم، زلزلہ اور خطرے کے سگنل لوڈ ہو رہے ہیں…', refresh: 'ریفریش',
    safeZones: 'محفوظ علاقے', mapSubtitle: 'پناہ · زلزلہ · NASA · لائیو GPS', centerOnMe: 'میرا مقام', nearestSafeZone: 'قریبی محفوظ علاقہ',
    helpDeskTitle: 'ہیلپ ڈیسک', helpDeskSub: 'بحران رہنمائی اور فوری اقدامات'
  },
  gu: {
    loginTitle: 'તમારા ખાતામાં લૉગિન', loginTitleOtp: 'ચકાસણી કોડ દાખલ કરો', signIn: 'સાઇન ઇન', signInContinue: 'સાઇન ઇન',
    phonePlaceholder: 'મોબાઇલ નંબર', invalidPhone: 'માન્ય 10 અંકનો મોબાઇલ નંબર દાખલ કરો.', invalidOtp: 'ખોટો કોડ. ફરી પ્રયાસ કરો.',
    noAccount: 'ખાતું નથી?', signUp: 'સાઇન અપ', signUpHint: 'ઉપર મોબાઇલ નંબર દાખલ કરો — OTP થી ચકાસણી (ડેમો: 4040).',
    changeNumber: 'પાછા', otpHint: 'આ નંબર પર કોડ મોકલ્યો', didNotReceive: 'કોડ ન મળ્યો?', resendOtp: 'ફરી મોકલો', devBypass: 'ડેમો OTP:',
    appTagline: 'કટોકટી આપત્તિ નેટવર્ક', activeProtocol: 'સક્રિય કટોકટી પ્રોટોકોલ', tabAlerts: 'અલર્ટ', tabMap: 'લાઇવ મેપ', tabNgo: 'એનજીઓ',
    language: 'ભાષા', lbwLabel: 'LBW', lbwMode: 'ઓછી બેન્ડવિડ્થ મોડ', sirenTitle: 'કટોકટી સાયરન',
    alertsTitle: 'અલર્ટ', alertsSubtitle: 'નાગરિક જિયો-ટેગ અલર્ટ · લાઇવ સિગ્નલ', communityReports: 'નાગરિક અલર્ટ',
    loadingSignals: 'હવામાન, ભૂકંપ અને જોખમ સિગ્નલ લોડ થઈ રહ્યા છે…', refresh: 'રિફ્રેશ',
    safeZones: 'સુરક્ષિત વિસ્તાર', mapSubtitle: 'આશ્રય · ભૂકંપ · NASA · લાઇવ GPS', centerOnMe: 'મારું સ્થાન', nearestSafeZone: 'નજીકનો સુરક્ષિત વિસ્તાર',
    helpDeskTitle: 'મદદ ડેસ્ક', helpDeskSub: 'સંકટ માર્ગદર્શન અને ઝડપી ક્રિયાઓ'
  },
  kn: {
    loginTitle: 'ನಿಮ್ಮ ಖಾತೆಗೆ ಲಾಗಿನ್', loginTitleOtp: 'ಪರಿಶೀಲನಾ ಕೋಡ್ ನಮೂದಿಸಿ', signIn: 'ಸೈನ್ ಇನ್', signInContinue: 'ಸೈನ್ ಇನ್',
    phonePlaceholder: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', invalidPhone: 'ಮಾನ್ಯ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ.', invalidOtp: 'ತಪ್ಪಾದ ಕೋಡ್. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    noAccount: 'ಖಾತೆ ಇಲ್ಲವೇ?', signUp: 'ಸೈನ್ ಅಪ್', signUpHint: 'ಮೇಲೆ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ — OTP ನಿಂದ ಪರಿಶೀಲನೆ (ಡೆಮೋ: 4040).',
    changeNumber: 'ಹಿಂದೆ', otpHint: 'ಈ ಸಂಖ್ಯೆಗೆ ಕೋಡ್ ಕಳುಹಿಸಲಾಗಿದೆ', didNotReceive: 'ಕೋಡ್ ಬರಲಿಲ್ಲವೇ?', resendOtp: 'ಮತ್ತೆ ಕಳುಹಿಸಿ', devBypass: 'ಡೆಮೋ OTP:',
    appTagline: 'ತುರ್ತು ವಿಪತ್ತು ಜಾಲ', activeProtocol: 'ಸಕ್ರಿಯ ತುರ್ತು ಪ್ರೋಟೋಕಾಲ್', tabAlerts: 'ಎಚ್ಚರಿಕೆ', tabMap: 'ಲೈವ್ ನಕ್ಷೆ', tabNgo: 'ಎನ್‌ಜಿಒ',
    language: 'ಭಾಷೆ', lbwLabel: 'LBW', lbwMode: 'ಕಡಿಮೆ ಬ್ಯಾಂಡ್‌ವಿಡ್ತ್ ಮೋಡ್', sirenTitle: 'ತುರ್ತು ಸೈರನ್',
    alertsTitle: 'ಎಚ್ಚರಿಕೆ', alertsSubtitle: 'ನಾಗರಿಕ ಜಿಯೋ-ಟ್ಯಾಗ್ ಎಚ್ಚರಿಕೆ · ಲೈವ್ ಸಿಗ್ನಲ್', communityReports: 'ನಾಗರಿಕ ಎಚ್ಚರಿಕೆ',
    loadingSignals: 'ಹವಾಮಾನ, ಭೂಕಂಪ ಮತ್ತು ಅಪಾಯ ಸಿಗ್ನಲ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ…', refresh: 'ರಿಫ್ರೆಶ್',
    safeZones: 'ಸುರಕ್ಷಿತ ವಲಯಗಳು', mapSubtitle: 'ಆಶ್ರಯ · ಭೂಕಂಪ · NASA · ಲೈವ್ GPS', centerOnMe: 'ನನ್ನ ಸ್ಥಾನ', nearestSafeZone: 'ಹತ್ತಿರದ ಸುರಕ್ಷಿತ ವಲಯ',
    helpDeskTitle: 'ಸಹಾಯ ಡೆಸ್ಕ್', helpDeskSub: 'ಬಿಕ್ಕಟ್ಟು ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ತ್ವರಿತ ಕ್ರಿಯೆ'
  },
  ml: {
    loginTitle: 'നിങ്ങളുടെ അക്കൗണ്ടിൽ ലോഗിൻ', loginTitleOtp: 'സ്ഥിരീകരണ കോഡ് നൽകുക', signIn: 'സൈൻ ഇൻ', signInContinue: 'സൈൻ ഇൻ',
    phonePlaceholder: 'മൊബൈൽ നമ്പർ', invalidPhone: 'സാധുവായ 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക.', invalidOtp: 'തെറ്റായ കോഡ്. വീണ്ടും ശ്രമിക്കുക.',
    noAccount: 'അക്കൗണ്ട് ഇല്ലേ?', signUp: 'സൈൻ അപ്പ്', signUpHint: 'മുകളിൽ മൊബൈൽ നമ്പർ നൽകുക — OTP വഴി സ്ഥിരീകരണം (ഡെമോ: 4040).',
    changeNumber: 'പിന്നോട്ട്', otpHint: 'ഈ നമ്പറിലേക്ക് കോഡ് അയച്ചു', didNotReceive: 'കോഡ് ലഭിച്ചില്ലേ?', resendOtp: 'വീണ്ടും അയയ്ക്കുക', devBypass: 'ഡെമോ OTP:',
    appTagline: 'അടിയന്തര ദുരന്ത നെറ്റ്‌വർക്ക്', activeProtocol: 'സജീവ അടിയന്തര പ്രോട്ടോക്കോൾ', tabAlerts: 'മുന്നറിയിപ്പ്', tabMap: 'ലൈവ് മാപ്', tabNgo: 'എൻജിഒ',
    language: 'ഭാഷ', lbwLabel: 'LBW', lbwMode: 'കുറഞ്ഞ ബാൻഡ്‌വിഡ്ത് മോഡ്', sirenTitle: 'അടിയന്തര സൈറൻ',
    alertsTitle: 'മുന്നറിയിപ്പ്', alertsSubtitle: 'പൗര ജിയോ-ടാഗ് മുന്നറിയിപ്പ് · ലൈവ് സിഗ്നൽ', communityReports: 'പൗര മുന്നറിയിപ്പ്',
    loadingSignals: 'കാലാവസ്ഥ, ഭൂകമ്പം & അപകട സിഗ്നൽ ലോഡ് ചെയ്യുന്നു…', refresh: 'പുതുക്കുക',
    safeZones: 'സുരക്ഷിത മേഖലകൾ', mapSubtitle: 'ആശ്രയം · ഭൂകമ്പം · NASA · ലൈവ് GPS', centerOnMe: 'എന്റെ സ്ഥാനം', nearestSafeZone: 'അടുത്ത സുരക്ഷിത മേഖല',
    helpDeskTitle: 'സഹായ ഡെസ്ക്', helpDeskSub: 'പ്രതിസന്ധി മാർഗനിർദേശവും വേഗത്തിലുള്ള നടപടികളും'
  },
  pa: {
    loginTitle: 'ਆਪਣੇ ਖਾਤੇ ਵਿੱਚ ਲੌਗਇਨ', loginTitleOtp: 'ਪੁਸ਼ਟੀਕਰਨ ਕੋਡ ਦਰਜ ਕਰੋ', signIn: 'ਸਾਈਨ ਇਨ', signInContinue: 'ਸਾਈਨ ਇਨ',
    phonePlaceholder: 'ਮੋਬਾਈਲ ਨੰਬਰ', invalidPhone: 'ਵੈਧ 10 ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ।', invalidOtp: 'ਗਲਤ ਕੋਡ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    noAccount: 'ਖਾਤਾ ਨਹੀਂ?', signUp: 'ਸਾਈਨ ਅੱਪ', signUpHint: 'ਉੱਪਰ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ — OTP ਨਾਲ ਪੁਸ਼ਟੀ (ਡੈਮੋ: 4040)।',
    changeNumber: 'ਪਿੱਛੇ', otpHint: 'ਇਸ ਨੰਬਰ ਤੇ ਕੋਡ ਭੇਜਿਆ', didNotReceive: 'ਕੋਡ ਨਹੀਂ ਮਿਲਿਆ?', resendOtp: 'ਦੁਬਾਰਾ ਭੇਜੋ', devBypass: 'ਡੈਮੋ OTP:',
    appTagline: 'ਐਮਰਜੈਂਸੀ ਆਪਦਾ ਨੈੱਟਵਰਕ', activeProtocol: 'ਸਕ੍ਰਿਆ ਐਮਰਜੈਂਸੀ ਪ੍ਰੋਟੋਕੋਲ', tabAlerts: 'ਚੇਤਾਵਨੀ', tabMap: 'ਲਾਈਵ ਨਕਸ਼ਾ', tabNgo: 'ਐਨਜੀਓ',
    language: 'ਭਾਸ਼ਾ', lbwLabel: 'LBW', lbwMode: 'ਘੱਟ ਬੈਂਡਵਿਡਥ ਮੋਡ', sirenTitle: 'ਐਮਰਜੈਂਸੀ ਸਾਇਰਨ',
    alertsTitle: 'ਚੇਤਾਵਨੀ', alertsSubtitle: 'ਨਾਗਰਿਕ ਜੀਓ-ਟੈਗ ਚੇਤਾਵਨੀ · ਲਾਈਵ ਸਿਗਨਲ', communityReports: 'ਨਾਗਰਿਕ ਚੇਤਾਵਨੀ',
    loadingSignals: 'ਮੌਸਮ, ਭੂਕੰਪ ਅਤੇ ਖਤਰੇ ਦੇ ਸਿਗਨਲ ਲੋਡ ਹੋ ਰਹੇ ਹਨ…', refresh: 'ਰਿਫ੍ਰੈਸ਼',
    safeZones: 'ਸੁਰੱਖਿਅਤ ਇਲਾਕੇ', mapSubtitle: 'ਆਸ਼ਰੇ · ਭੂਕੰਪ · NASA · ਲਾਈਵ GPS', centerOnMe: 'ਮੇਰਾ ਸਥਾਨ', nearestSafeZone: 'ਨਜ਼ਦੀਕੀ ਸੁਰੱਖਿਅਤ ਇਲਾਕਾ',
    helpDeskTitle: 'ਮਦਦ ਡੈਸਕ', helpDeskSub: 'ਸੰਕਟ ਮਾਰਗਦਰਸ਼ਨ ਅਤੇ ਤੇਜ਼ ਕਾਰਵਾਈ'
  },
  or: {
    loginTitle: 'ଆପଣଙ୍କ ଆକାଉଣ୍ଟରେ ଲଗଇନ୍', loginTitleOtp: 'ଯାଞ୍ଚ କୋଡ୍ ପ୍ରବେଶ କରନ୍ତୁ', signIn: 'ସାଇନ୍ ଇନ୍', signInContinue: 'ସାଇନ୍ ଇନ୍',
    phonePlaceholder: 'ମୋବାଇଲ୍ ନମ୍ବର', invalidPhone: 'ବୈଧ ୧୦ ଅଙ୍କର ମୋବାଇଲ୍ ନମ୍ବର ପ୍ରବେଶ କରନ୍ତୁ।', invalidOtp: 'ଭୁଲ କୋଡ୍। ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।',
    noAccount: 'ଆକାଉଣ୍ଟ ନାହିଁ?', signUp: 'ସାଇନ୍ ଅପ୍', signUpHint: 'ଉପରେ ମୋବାଇଲ୍ ନମ୍ବର ପ୍ରବେଶ କରନ୍ତୁ — OTP ଦ୍ୱାରା ଯାଞ୍ଚ (ଡେମୋ: 4040)।',
    changeNumber: 'ପଛକୁ', otpHint: 'ଏହି ନମ୍ବରକୁ କୋଡ୍ ପଠାଗଲା', didNotReceive: 'କୋଡ୍ ମିଳିଲା ନାହିଁ?', resendOtp: 'ପୁଣି ପଠାନ୍ତୁ', devBypass: 'ଡେମୋ OTP:',
    appTagline: 'ଜରୁରୀକାଳୀନ ବିପର୍ଯ୍ୟୟ ନେଟୱର୍କ', activeProtocol: 'ସକ୍ରିୟ ଜରୁରୀକାଳୀନ ପ୍ରୋଟୋକଲ', tabAlerts: 'ସତର୍କତା', tabMap: 'ଲାଇଭ ମାନଚିତ୍ର', tabNgo: 'ଏନଜିଓ',
    language: 'ଭାଷା', lbwLabel: 'LBW', lbwMode: 'କମ୍ ବ୍ୟାଣ୍ଡୱିଡ୍ଥ ମୋଡ୍', sirenTitle: 'ଜରୁରୀକାଳୀନ ସାଇରେନ୍',
    alertsTitle: 'ସତର୍କତା', alertsSubtitle: 'ନାଗରିକ ଜିଓ-ଟ୍ୟାଗ୍ ସତର୍କତା · ଲାଇଭ ସିଗ୍ନାଲ', communityReports: 'ନାଗରିକ ସତର୍କତା',
    loadingSignals: 'ପାଣିପାଗ, ଭୂକମ୍ପ ଓ ବିପଦ ସିଗ୍ନାଲ ଲୋଡ୍ ହେଉଛି…', refresh: 'ରିଫ୍ରେଶ୍',
    safeZones: 'ସୁରକ୍ଷିତ ଅଞ୍ଚଳ', mapSubtitle: 'ଆଶ୍ରୟ · ଭୂକମ୍ପ · NASA · ଲାଇଭ GPS', centerOnMe: 'ମୋ ସ୍ଥାନ', nearestSafeZone: 'ନିକଟତମ ସୁରକ୍ଷିତ ଅଞ୍ଚଳ',
    helpDeskTitle: 'ସହାୟତା ଡେସ୍କ', helpDeskSub: 'ସଙ୍କଟ ମାର୍ଗଦର୍ଶନ ଓ ଦ୍ରୁତ କାର୍ଯ୍ୟ'
  },
  as: {
    loginTitle: 'আপোনাৰ একাউণ্টত লগইন', loginTitleOtp: 'সত্যাপন কড প্ৰবিষ্ট কৰক', signIn: 'ছাইন ইন', signInContinue: 'ছাইন ইন',
    phonePlaceholder: 'মবাইল নম্বৰ', invalidPhone: 'বৈধ ১০ অংকৰ মবাইল নম্বৰ দিয়ক।', invalidOtp: 'ভুল কড। পুনৰ চেষ্টা কৰক।',
    noAccount: 'একাউণ্ট নাই?', signUp: 'ছাইন আপ', signUpHint: 'ওপৰত মবাইল নম্বৰ দিয়ক — OTP ৰে সত্যাপন (ডেমো: 4040)।',
    changeNumber: 'পিছলৈ', otpHint: 'এই নম্বৰলৈ কড পঠোৱা হৈছে', didNotReceive: 'কড নাপালে?', resendOtp: 'পুনৰ পঠাওক', devBypass: 'ডেমো OTP:',
    appTagline: 'জৰুৰীকালীন দুৰ্যোগ নেটৱৰ্ক', activeProtocol: 'সক্ৰিয় জৰুৰীকালীন প্ৰটোকল', tabAlerts: 'সতৰ্কবাণী', tabMap: 'লাইভ মানচিত্ৰ', tabNgo: 'এনজিঅ',
    language: 'ভাষা', lbwLabel: 'LBW', lbwMode: 'কম বেণ্ডউইথ মড', sirenTitle: 'জৰুৰীকালীন ছাইৰেন',
    alertsTitle: 'সতৰ্কবাণী', alertsSubtitle: 'নাগৰিক জিঅ-টেগ সতৰ্কবাণী · লাইভ ছিগনেল', communityReports: 'নাগৰিক সতৰ্কবাণী',
    loadingSignals: 'বতৰ, ভূকম্প আৰু বিপদৰ ছিগনেল লড হৈছে…', refresh: 'ৰিফ্ৰেছ',
    safeZones: 'সুৰক্ষিত অঞ্চল', mapSubtitle: 'আশ্ৰয় · ভূকম্প · NASA · লাইভ GPS', centerOnMe: 'মোৰ স্থান', nearestSafeZone: 'নিকটতম সুৰক্ষিত অঞ্চল',
    helpDeskTitle: 'সহায় ডেস্ক', helpDeskSub: 'সংকট নিৰ্দেশনা আৰু দ্ৰুত কাৰ্য্য'
  },
  ja: {
    loginTitle: 'アカウントにログイン', loginTitleOtp: '認証コードを入力', signIn: 'サインイン', signInContinue: 'サインイン',
    phonePlaceholder: '携帯番号', invalidPhone: '有効な10桁の携帯番号を入力してください。', invalidOtp: 'コードが無効です。もう一度お試しください。',
    noAccount: 'アカウントをお持ちでない方', signUp: '登録', signUpHint: '上に携帯番号を入力 — OTPで認証（デモ: 4040）。',
    changeNumber: '戻る', otpHint: '次の番号にコードを送信', didNotReceive: '届きませんか？', resendOtp: '再送信', devBypass: 'デモOTP:',
    appTagline: '緊急災害ネットワーク', activeProtocol: '緊急プロトコル作動中', tabAlerts: 'アラート', tabMap: 'ライブマップ', tabNgo: 'NGO',
    language: '言語', lbwLabel: 'LBW', lbwMode: '低帯域モード', sirenTitle: '緊急サイレン',
    alertsTitle: 'アラート', alertsSubtitle: '市民ジオタグアラート · ライブ信号', communityReports: '市民アラート',
    loadingSignals: '天気・地震・危険信号を読み込み中…', refresh: '更新',
    safeZones: '安全地帯', mapSubtitle: '避難所 · 地震 · NASA · GPS', centerOnMe: '現在地', nearestSafeZone: '最寄りの安全地帯',
    helpDeskTitle: 'ヘルプデスク', helpDeskSub: '危機対応ガイドとクイック操作'
  },
  es: {
    loginTitle: 'Inicia sesión en tu cuenta', loginTitleOtp: 'Introduce el código', signIn: 'Entrar', signInContinue: 'Entrar',
    phonePlaceholder: 'Número móvil', invalidPhone: 'Introduce un móvil válido de 10 dígitos.', invalidOtp: 'Código incorrecto. Inténtalo de nuevo.',
    noAccount: '¿No tienes cuenta?', signUp: 'Registrarse', signUpHint: 'Introduce tu móvil arriba — verificación OTP (demo: 4040).',
    changeNumber: 'Atrás', otpHint: 'Código enviado al número', didNotReceive: '¿No lo recibiste?', resendOtp: 'Reenviar', devBypass: 'OTP demo:',
    appTagline: 'Red de emergencia', activeProtocol: 'Protocolo de emergencia activo', tabAlerts: 'Alertas', tabMap: 'Mapa en vivo', tabNgo: 'ONG',
    language: 'Idioma', lbwLabel: 'LBW', lbwMode: 'Modo bajo ancho de banda', sirenTitle: 'Sirena de emergencia',
    alertsTitle: 'alertas', alertsSubtitle: 'Alertas ciudadanas geo · señales en vivo', communityReports: 'Alertas ciudadanas',
    loadingSignals: 'Cargando clima, terremotos y señales…', refresh: 'Actualizar',
    safeZones: 'Zonas seguras', mapSubtitle: 'Refugios · terremotos · NASA · GPS', centerOnMe: 'Mi ubicación', nearestSafeZone: 'Zona segura más cercana',
    helpDeskTitle: 'Mesa de ayuda', helpDeskSub: 'Guía de crisis y acciones rápidas'
  },
  fr: {
    loginTitle: 'Connexion à votre compte', loginTitleOtp: 'Entrez le code', signIn: 'Connexion', signInContinue: 'Connexion',
    phonePlaceholder: 'Numéro mobile', invalidPhone: 'Entrez un mobile valide à 10 chiffres.', invalidOtp: 'Code incorrect. Réessayez.',
    noAccount: 'Pas de compte ?', signUp: 'Inscription', signUpHint: 'Entrez votre mobile ci-dessus — vérification OTP (démo : 4040).',
    changeNumber: 'Retour', otpHint: 'Code envoyé au numéro', didNotReceive: 'Pas reçu ?', resendOtp: 'Renvoyer', devBypass: 'OTP démo :',
    appTagline: 'Réseau d\'urgence', activeProtocol: 'Protocole d\'urgence actif', tabAlerts: 'Alertes', tabMap: 'Carte live', tabNgo: 'ONG',
    language: 'Langue', lbwLabel: 'LBW', lbwMode: 'Mode faible bande passante', sirenTitle: 'Sirène d\'urgence',
    alertsTitle: 'alertes', alertsSubtitle: 'Alertes citoyennes géo · signaux live', communityReports: 'Alertes citoyennes',
    loadingSignals: 'Chargement météo, séismes et signaux…', refresh: 'Actualiser',
    safeZones: 'Zones sûres', mapSubtitle: 'Refuges · séismes · NASA · GPS', centerOnMe: 'Ma position', nearestSafeZone: 'Zone sûre la plus proche',
    helpDeskTitle: 'Service d\'aide', helpDeskSub: 'Guide de crise et actions rapides'
  },
  de: {
    loginTitle: 'Bei Ihrem Konto anmelden', loginTitleOtp: 'Code eingeben', signIn: 'Anmelden', signInContinue: 'Anmelden',
    phonePlaceholder: 'Handynummer', invalidPhone: 'Gültige 10-stellige Handynummer eingeben.', invalidOtp: 'Falscher Code. Erneut versuchen.',
    noAccount: 'Kein Konto?', signUp: 'Registrieren', signUpHint: 'Handynummer oben eingeben — OTP-Verifizierung (Demo: 4040).',
    changeNumber: 'Zurück', otpHint: 'Code an Nummer gesendet', didNotReceive: 'Nicht erhalten?', resendOtp: 'Erneut senden', devBypass: 'Demo-OTP:',
    appTagline: 'Notfall-Netzwerk', activeProtocol: 'Aktives Notfallprotokoll', tabAlerts: 'Warnungen', tabMap: 'Live-Karte', tabNgo: 'NGO',
    language: 'Sprache', lbwLabel: 'LBW', lbwMode: 'Niedrige Bandbreite', sirenTitle: 'Notfallsirene',
    alertsTitle: 'Warnungen', alertsSubtitle: 'Bürger-Geo-Alerts · Live-Signale', communityReports: 'Bürger-Alerts',
    loadingSignals: 'Wetter, Erdbeben & Gefahrensignale laden…', refresh: 'Aktualisieren',
    safeZones: 'Sichere Zonen', mapSubtitle: 'Unterkünfte · Beben · NASA · GPS', centerOnMe: 'Mein Standort', nearestSafeZone: 'Nächste sichere Zone',
    helpDeskTitle: 'Hilfe', helpDeskSub: 'Krisenführung & Schnellaktionen'
  },
  ar: {
    loginTitle: 'تسجيل الدخول إلى حسابك', loginTitleOtp: 'أدخل رمز التحقق', signIn: 'تسجيل الدخول', signInContinue: 'تسجيل الدخول',
    phonePlaceholder: 'رقم الجوال', invalidPhone: 'أدخل رقم جوال صالح من 10 أرقام.', invalidOtp: 'رمز غير صحيح. حاول مرة أخرى.',
    noAccount: 'ليس لديك حساب؟', signUp: 'التسجيل', signUpHint: 'أدخل رقم جوالك أعلاه — التحقق عبر OTP (تجريبي: 4040).',
    changeNumber: 'رجوع', otpHint: 'تم إرسال الرمز إلى الرقم', didNotReceive: 'لم يصل؟', resendOtp: 'إعادة الإرسال', devBypass: 'OTP تجريبي:',
    appTagline: 'شبكة الكوارث الطارئة', activeProtocol: 'بروتوكول طوارئ نشط', tabAlerts: 'تنبيهات', tabMap: 'خريطة مباشرة', tabNgo: 'منظمة',
    language: 'اللغة', lbwLabel: 'LBW', lbwMode: 'وضع النطاق الضيق', sirenTitle: 'صفارة الطوارئ',
    alertsTitle: 'تنبيهات', alertsSubtitle: 'تنبيهات المواطنين · إشارات مباشرة', communityReports: 'تنبيهات المواطنين',
    loadingSignals: 'جاري تحميل الطقس والزلازل والإشارات…', refresh: 'تحديث',
    safeZones: 'مناطق آمنة', mapSubtitle: 'ملاجئ · زلازل · NASA · GPS', centerOnMe: 'موقعي', nearestSafeZone: 'أقرب منطقة آمنة',
    helpDeskTitle: 'مكتب المساعدة', helpDeskSub: 'إرشاد الأزمات وإجراءات سريعة'
  },
  pt: {
    loginTitle: 'Entrar na sua conta', loginTitleOtp: 'Digite o código', signIn: 'Entrar', signInContinue: 'Entrar',
    phonePlaceholder: 'Número móvel', invalidPhone: 'Digite um móvel válido de 10 dígitos.', invalidOtp: 'Código inválido. Tente novamente.',
    noAccount: 'Sem conta?', signUp: 'Cadastrar', signUpHint: 'Digite o móvel acima — verificação OTP (demo: 4040).',
    changeNumber: 'Voltar', otpHint: 'Código enviado para o número', didNotReceive: 'Não recebeu?', resendOtp: 'Reenviar', devBypass: 'OTP demo:',
    appTagline: 'Rede de emergência', activeProtocol: 'Protocolo de emergência ativo', tabAlerts: 'Alertas', tabMap: 'Mapa ao vivo', tabNgo: 'ONG',
    language: 'Idioma', lbwLabel: 'LBW', lbwMode: 'Modo baixa largura de banda', sirenTitle: 'Sirene de emergência',
    alertsTitle: 'alertas', alertsSubtitle: 'Alertas cidadãos geo · sinais ao vivo', communityReports: 'Alertas cidadãos',
    loadingSignals: 'Carregando clima, terremotos e sinais…', refresh: 'Atualizar',
    safeZones: 'Zonas seguras', mapSubtitle: 'Abrigos · terremotos · NASA · GPS', centerOnMe: 'Minha localização', nearestSafeZone: 'Zona segura mais próxima',
    helpDeskTitle: 'Central de ajuda', helpDeskSub: 'Orientação de crise e ações rápidas'
  },
  ru: {
    loginTitle: 'Вход в аккаунт', loginTitleOtp: 'Введите код', signIn: 'Войти', signInContinue: 'Войти',
    phonePlaceholder: 'Номер телефона', invalidPhone: 'Введите действительный 10-значный номер.', invalidOtp: 'Неверный код. Повторите.',
    noAccount: 'Нет аккаунта?', signUp: 'Регистрация', signUpHint: 'Введите номер выше — проверка OTP (демо: 4040).',
    changeNumber: 'Назад', otpHint: 'Код отправлен на номер', didNotReceive: 'Не получили?', resendOtp: 'Отправить снова', devBypass: 'Демо OTP:',
    appTagline: 'Сеть ЧС', activeProtocol: 'Активный протокол ЧС', tabAlerts: 'Оповещения', tabMap: 'Карта', tabNgo: 'НКО',
    language: 'Язык', lbwLabel: 'LBW', lbwMode: 'Режим низкой полосы', sirenTitle: 'Сирена ЧС',
    alertsTitle: 'оповещения', alertsSubtitle: 'Гражданские geo-оповещения · live', communityReports: 'Гражданские оповещения',
    loadingSignals: 'Загрузка погоды, землетрясений и сигналов…', refresh: 'Обновить',
    safeZones: 'Безопасные зоны', mapSubtitle: 'Убежища · землетрясения · NASA · GPS', centerOnMe: 'Моё место', nearestSafeZone: 'Ближайшая безопасная зона',
    helpDeskTitle: 'Справка', helpDeskSub: 'Кризисные инструкции и быстрые действия'
  },
  zh: {
    loginTitle: '登录您的账户', loginTitleOtp: '输入验证码', signIn: '登录', signInContinue: '登录',
    phonePlaceholder: '手机号码', invalidPhone: '请输入有效的10位手机号。', invalidOtp: '验证码错误，请重试。',
    noAccount: '没有账户？', signUp: '注册', signUpHint: '在上方输入手机号 — OTP验证（演示码：4040）。',
    changeNumber: '返回', otpHint: '验证码已发送至号码', didNotReceive: '没收到？', resendOtp: '重新发送', devBypass: '演示OTP：',
    appTagline: '应急灾害网络', activeProtocol: '紧急协议已激活', tabAlerts: '警报', tabMap: '实时地图', tabNgo: '非政府组织',
    language: '语言', lbwLabel: 'LBW', lbwMode: '低带宽模式', sirenTitle: '紧急警报',
    alertsTitle: '警报', alertsSubtitle: '市民地理标记警报 · 实时信号', communityReports: '市民警报',
    loadingSignals: '正在加载天气、地震和危险信号…', refresh: '刷新',
    safeZones: '安全区', mapSubtitle: '避难所 · 地震 · NASA · GPS', centerOnMe: '我的位置', nearestSafeZone: '最近安全区',
    helpDeskTitle: '帮助台', helpDeskSub: '危机指南与快速操作'
  },
  ko: {
    loginTitle: '계정에 로그인', loginTitleOtp: '인증 코드 입력', signIn: '로그인', signInContinue: '로그인',
    phonePlaceholder: '휴대폰 번호', invalidPhone: '유효한 10자리 휴대폰 번호를 입력하세요.', invalidOtp: '잘못된 코드입니다. 다시 시도하세요.',
    noAccount: '계정이 없으신가요?', signUp: '가입', signUpHint: '위에 휴대폰 번호 입력 — OTP 인증 (데모: 4040).',
    changeNumber: '뒤로', otpHint: '번호로 코드 전송됨', didNotReceive: '받지 못하셨나요?', resendOtp: '재전송', devBypass: '데모 OTP:',
    appTagline: '긴급 재난 네트워크', activeProtocol: '긴급 프로토콜 활성', tabAlerts: '알림', tabMap: '실시간 지도', tabNgo: 'NGO',
    language: '언어', lbwLabel: 'LBW', lbwMode: '저대역폭 모드', sirenTitle: '긴급 사이렌',
    alertsTitle: '알림', alertsSubtitle: '시민 지오 태그 알림 · 실시간 신호', communityReports: '시민 알림',
    loadingSignals: '날씨, 지진 및 위험 신호 로딩 중…', refresh: '새로고침',
    safeZones: '안전 구역', mapSubtitle: '대피소 · 지진 · NASA · GPS', centerOnMe: '내 위치', nearestSafeZone: '가장 가까운 안전 구역',
    helpDeskTitle: '도움말', helpDeskSub: '위기 안내 및 빠른 조치'
  },
  vi: {
    loginTitle: 'Đăng nhập tài khoản', loginTitleOtp: 'Nhập mã xác minh', signIn: 'Đăng nhập', signInContinue: 'Đăng nhập',
    phonePlaceholder: 'Số di động', invalidPhone: 'Nhập số di động hợp lệ 10 chữ số.', invalidOtp: 'Mã sai. Thử lại.',
    noAccount: 'Chưa có tài khoản?', signUp: 'Đăng ký', signUpHint: 'Nhập số di động ở trên — xác minh OTP (demo: 4040).',
    changeNumber: 'Quay lại', otpHint: 'Mã đã gửi đến số', didNotReceive: 'Chưa nhận?', resendOtp: 'Gửi lại', devBypass: 'OTP demo:',
    appTagline: 'Mạng thảm họa', activeProtocol: 'Giao thức khẩn cấp đang hoạt động', tabAlerts: 'Cảnh báo', tabMap: 'Bản đồ trực tiếp', tabNgo: 'NGO',
    language: 'Ngôn ngữ', lbwLabel: 'LBW', lbwMode: 'Chế độ băng thông thấp', sirenTitle: 'Còi khẩn cấp',
    alertsTitle: 'cảnh báo', alertsSubtitle: 'Cảnh báo công dân geo · tín hiệu trực tiếp', communityReports: 'Cảnh báo công dân',
    loadingSignals: 'Đang tải thời tiết, động đất & tín hiệu…', refresh: 'Làm mới',
    safeZones: 'Vùng an toàn', mapSubtitle: 'Nơi trú ẩn · động đất · NASA · GPS', centerOnMe: 'Vị trí của tôi', nearestSafeZone: 'Vùng an toàn gần nhất',
    helpDeskTitle: 'Trợ giúp', helpDeskSub: 'Hướng dẫn khủng hoảng & thao tác nhanh'
  },
  id: {
    loginTitle: 'Masuk ke akun Anda', loginTitleOtp: 'Masukkan kode verifikasi', signIn: 'Masuk', signInContinue: 'Masuk',
    phonePlaceholder: 'Nomor ponsel', invalidPhone: 'Masukkan nomor ponsel 10 digit yang valid.', invalidOtp: 'Kode salah. Coba lagi.',
    noAccount: 'Belum punya akun?', signUp: 'Daftar', signUpHint: 'Masukkan nomor ponsel di atas — verifikasi OTP (demo: 4040).',
    changeNumber: 'Kembali', otpHint: 'Kode dikirim ke nomor', didNotReceive: 'Tidak terima?', resendOtp: 'Kirim ulang', devBypass: 'OTP demo:',
    appTagline: 'Jaringan bencana', activeProtocol: 'Protokol darurat aktif', tabAlerts: 'Peringatan', tabMap: 'Peta langsung', tabNgo: 'LSM',
    language: 'Bahasa', lbwLabel: 'LBW', lbwMode: 'Mode bandwidth rendah', sirenTitle: 'Sirene darurat',
    alertsTitle: 'peringatan', alertsSubtitle: 'Peringatan warga geo · sinyal langsung', communityReports: 'Peringatan warga',
    loadingSignals: 'Memuat cuaca, gempa & sinyal bahaya…', refresh: 'Segarkan',
    safeZones: 'Zona aman', mapSubtitle: 'Tempat perlindungan · gempa · NASA · GPS', centerOnMe: 'Lokasi saya', nearestSafeZone: 'Zona aman terdekat',
    helpDeskTitle: 'Meja bantuan', helpDeskSub: 'Panduan krisis & tindakan cepat'
  }
};

const i18n_LOCALES = Object.fromEntries(
  Object.entries(i18n_UI_PACKS).map(([code, pack]) => [code, i18n_mergeLocale(pack)])
);

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
  const langLabel = window.i18n_t('language');
  document.querySelectorAll('.i18n-language-select').forEach((sel) => {
    const prev = sel.value || i18n_currentLang;
    sel.innerHTML = i18n_LANGUAGES.map(
      (l) => `<option value="${l.code}">${l.native}</option>`
    ).join('');
    sel.value = i18n_LANGUAGES.some((l) => l.code === prev) ? prev : i18n_currentLang;
    sel.setAttribute('aria-label', langLabel);
    sel.title = langLabel;
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

function i18n_notifyLanguageChange(code) {
  document.dispatchEvent(new CustomEvent('resqnet-lang-change', { detail: { code } }));
  if (window.appState) {
    window.appState.currentLanguage = code;
    window.appState.listeners.forEach((cb) => cb(window.appState));
  }
}

window.i18n_setLanguage = function (code) {
  if (!i18n_LANGUAGES.some((l) => l.code === code)) code = 'en';
  if (code === i18n_currentLang) {
    window.i18n_applyDom();
    return;
  }
  i18n_currentLang = code;
  try {
    localStorage.setItem(i18n_STORAGE_KEY, code);
  } catch {
    /* */
  }
  i18n_setDocumentDirection(code);
  window.i18n_applyDom();
  i18n_notifyLanguageChange(code);
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
