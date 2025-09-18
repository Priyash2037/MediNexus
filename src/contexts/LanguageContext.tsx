import React, { createContext, useState, useContext, ReactNode } from 'react';

// Available languages
export type Language = 'en' | 'hi' | 'pa';

// Language context type
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    'app.name': 'MediNexus',
    'language.english': 'English',
    'language.hindi': 'Hindi',
    'language.punjabi': 'Punjabi',
    
    // Navigation
    'nav.home': 'Home',
    'nav.how_it_works': 'How It Works',
    'nav.benefits': 'Benefits',
    'nav.contact': 'Contact',
    'nav.about_us': 'About Us',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.profile': 'Profile',
    'nav.appointments': 'Appointments',
    'nav.medical_records': 'Medical Records',
    'nav.support': 'Support',
    'nav.logout': 'Logout',
    
    // Landing Page
    'landing.hero.title': 'Healthcare at Your Fingertips',
    'landing.hero.subtitle': 'Connect with doctors from the comfort of your home',
    'landing.cta.doctor': 'I am a Doctor',
    'landing.cta.patient': 'I am a Patient',
    'landing.features.title': 'Why Choose MediNexus?',
    'landing.features.easy_access': 'Easy Access',
    'landing.features.affordable': 'Affordable Care',
    'landing.features.expert_doctors': 'Expert Doctors',
    
    // Authentication
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirm_password': 'Confirm Password',
    'auth.forgot_password': 'Forgot Password?',
    'auth.no_account': 'Don\'t have an account?',
    'auth.have_account': 'Already have an account?',
    'auth.name': 'Full Name',
    'auth.phone': 'Phone Number',
    
    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.appointments': 'Your Appointments',
    'dashboard.upcoming': 'Upcoming',
    'dashboard.past': 'Past',
    'dashboard.book_appointment': 'Book Appointment',
    'dashboard.medical_records': 'Medical Records',
    'dashboard.prescriptions': 'Prescriptions',
    'dashboard.reports': 'Test Reports',
    
    // Video Call
    'video.connecting': 'Connecting...',
    'video.connected': 'Connected',
    'video.end_call': 'End Call',
    'video.mute': 'Mute',
    'video.unmute': 'Unmute',
    'video.camera_on': 'Camera On',
    'video.camera_off': 'Camera Off',
    
    // Chatbot
    'chatbot.title': 'AI Health Assistant',
    'chatbot.welcome': 'Hello! I\'m your healthcare assistant. How can I help you today?',
    'chatbot.placeholder': 'Type your message here...',
    'chatbot.request_call': 'Request Call',
    'chatbot.disclaimer': 'This AI assistant can help with basic health questions, but is not a replacement for professional medical advice.',
  },
  
  hi: {
    // Common
    'app.name': 'मेडीनेक्सस',
    'language.english': 'अंग्रेज़ी',
    'language.hindi': 'हिंदी',
    'language.punjabi': 'पंजाबी',
    
    // Navigation
    'nav.home': 'होम',
    'nav.how_it_works': 'यह कैसे काम करता है',
    'nav.benefits': 'लाभ',
    'nav.contact': 'संपर्क',
    'nav.about_us': 'हमारे बारे में',
    'nav.login': 'लॉगिन',
    'nav.register': 'रजिस्टर',
    'nav.profile': 'प्रोफाइल',
    'nav.appointments': 'अपॉइंटमेंट',
    'nav.medical_records': 'मेडिकल रिकॉर्ड',
    'nav.support': 'सहायता',
    'nav.logout': 'लॉगआउट',
    
    // Landing Page
    'landing.hero.title': 'आपकी उंगलियों पर स्वास्थ्य सेवा',
    'landing.hero.subtitle': 'अपने घर के आराम से डॉक्टरों से जुड़ें',
    'landing.cta.doctor': 'मैं एक डॉक्टर हूँ',
    'landing.cta.patient': 'मैं एक मरीज़ हूँ',
    'landing.features.title': 'मेडीनेक्सस क्यों चुनें?',
    'landing.features.easy_access': 'आसान पहुंच',
    'landing.features.affordable': 'किफायती देखभाल',
    'landing.features.expert_doctors': 'विशेषज्ञ डॉक्टर',
    
    // Authentication
    'auth.login': 'लॉगिन',
    'auth.register': 'रजिस्टर',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.confirm_password': 'पासवर्ड की पुष्टि करें',
    'auth.forgot_password': 'पासवर्ड भूल गए?',
    'auth.no_account': 'खाता नहीं है?',
    'auth.have_account': 'पहले से ही खाता है?',
    'auth.name': 'पूरा नाम',
    'auth.phone': 'फोन नंबर',
    
    // Dashboard
    'dashboard.welcome': 'स्वागत है',
    'dashboard.appointments': 'आपके अपॉइंटमेंट',
    'dashboard.upcoming': 'आगामी',
    'dashboard.past': 'पिछले',
    'dashboard.book_appointment': 'अपॉइंटमेंट बुक करें',
    'dashboard.medical_records': 'मेडिकल रिकॉर्ड',
    'dashboard.prescriptions': 'प्रिस्क्रिप्शन',
    'dashboard.reports': 'टेस्ट रिपोर्ट',
    
    // Video Call
    'video.connecting': 'कनेक्ट हो रहा है...',
    'video.connected': 'कनेक्टेड',
    'video.end_call': 'कॉल समाप्त करें',
    'video.mute': 'म्यूट',
    'video.unmute': 'अनम्यूट',
    'video.camera_on': 'कैमरा चालू',
    'video.camera_off': 'कैमरा बंद',
    
    // Chatbot
    'chatbot.title': 'एआई स्वास्थ्य सहायक',
    'chatbot.welcome': 'नमस्ते! मैं आपका स्वास्थ्य सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?',
    'chatbot.placeholder': 'अपना संदेश यहां टाइप करें...',
    'chatbot.request_call': 'कॉल का अनुरोध करें',
    'chatbot.disclaimer': 'यह एआई सहायक बुनियादी स्वास्थ्य प्रश्नों में मदद कर सकता है, लेकिन यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है।',
  },
  
  pa: {
    // Common
    'app.name': 'ਮੇਡੀਨੇਕਸਸ',
    'language.english': 'ਅੰਗਰੇਜ਼ੀ',
    'language.hindi': 'ਹਿੰਦੀ',
    'language.punjabi': 'ਪੰਜਾਬੀ',
    
    // Navigation
    'nav.home': 'ਹੋਮ',
    'nav.how_it_works': 'ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ',
    'nav.benefits': 'ਲਾਭ',
    'nav.contact': 'ਸੰਪਰਕ',
    'nav.about_us': 'ਸਾਡੇ ਬਾਰੇ',
    'nav.login': 'ਲੌਗਇਨ',
    'nav.register': 'ਰਜਿਸਟਰ',
    'nav.profile': 'ਪ੍ਰੋਫਾਈਲ',
    'nav.appointments': 'ਅਪੌਇੰਟਮੈਂਟ',
    'nav.medical_records': 'ਮੈਡੀਕਲ ਰਿਕਾਰਡ',
    'nav.support': 'ਸਹਾਇਤਾ',
    'nav.logout': 'ਲੌਗਆਊਟ',
    
    // Landing Page
    'landing.hero.title': 'ਤੁਹਾਡੀਆਂ ਉਂਗਲੀਆਂ 'ਤੇ ਸਿਹਤ ਸੰਭਾਲ',
    'landing.hero.subtitle': 'ਆਪਣੇ ਘਰ ਦੀ ਸੁਵਿਧਾ ਤੋਂ ਡਾਕਟਰਾਂ ਨਾਲ ਜੁੜੋ',
    'landing.cta.doctor': 'ਮੈਂ ਇੱਕ ਡਾਕਟਰ ਹਾਂ',
    'landing.cta.patient': 'ਮੈਂ ਇੱਕ ਮਰੀਜ਼ ਹਾਂ',
    'landing.features.title': 'ਮੇਡੀਨੇਕਸਸ ਕਿਉਂ ਚੁਣੋ?',
    'landing.features.easy_access': 'ਆਸਾਨ ਪਹੁੰਚ',
    'landing.features.affordable': 'ਕਿਫਾਇਤੀ ਦੇਖਭਾਲ',
    'landing.features.expert_doctors': 'ਮਾਹਿਰ ਡਾਕਟਰ',
    
    // Authentication
    'auth.login': 'ਲੌਗਇਨ',
    'auth.register': 'ਰਜਿਸਟਰ',
    'auth.email': 'ਈਮੇਲ',
    'auth.password': 'ਪਾਸਵਰਡ',
    'auth.confirm_password': 'ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
    'auth.forgot_password': 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?',
    'auth.no_account': 'ਖਾਤਾ ਨਹੀਂ ਹੈ?',
    'auth.have_account': 'ਪਹਿਲਾਂ ਤੋਂ ਹੀ ਖਾਤਾ ਹੈ?',
    'auth.name': 'ਪੂਰਾ ਨਾਮ',
    'auth.phone': 'ਫੋਨ ਨੰਬਰ',
    
    // Dashboard
    'dashboard.welcome': 'ਜੀ ਆਇਆਂ ਨੂੰ',
    'dashboard.appointments': 'ਤੁਹਾਡੇ ਅਪੌਇੰਟਮੈਂਟ',
    'dashboard.upcoming': 'ਆਉਣ ਵਾਲੇ',
    'dashboard.past': 'ਪਿਛਲੇ',
    'dashboard.book_appointment': 'ਅਪੌਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰੋ',
    'dashboard.medical_records': 'ਮੈਡੀਕਲ ਰਿਕਾਰਡ',
    'dashboard.prescriptions': 'ਨੁਸਖੇ',
    'dashboard.reports': 'ਟੈਸਟ ਰਿਪੋਰਟ',
    
    // Video Call
    'video.connecting': 'ਕਨੈਕਟ ਹੋ ਰਿਹਾ ਹੈ...',
    'video.connected': 'ਕਨੈਕਟਡ',
    'video.end_call': 'ਕਾਲ ਖਤਮ ਕਰੋ',
    'video.mute': 'ਮਿਊਟ',
    'video.unmute': 'ਅਨਮਿਊਟ',
    'video.camera_on': 'ਕੈਮਰਾ ਚਾਲੂ',
    'video.camera_off': 'ਕੈਮਰਾ ਬੰਦ',
    
    // Chatbot
    'chatbot.title': 'ਏਆਈ ਸਿਹਤ ਸਹਾਇਕ',
    'chatbot.welcome': 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
    'chatbot.placeholder': 'ਆਪਣਾ ਸੁਨੇਹਾ ਇੱਥੇ ਟਾਈਪ ਕਰੋ...',
    'chatbot.request_call': 'ਕਾਲ ਦੀ ਬੇਨਤੀ ਕਰੋ',
    'chatbot.disclaimer': 'ਇਹ ਏਆਈ ਸਹਾਇਕ ਬੁਨਿਆਦੀ ਸਿਹਤ ਸਵਾਲਾਂ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹੈ, ਪਰ ਇਹ ਪੇਸ਼ੇਵਰ ਮੈਡੀਕਲ ਸਲਾਹ ਦਾ ਬਦਲ ਨਹੀਂ ਹੈ।',
  }
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => useContext(LanguageContext);