import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Load translation using http -> see /public/locales
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Init i18next
  .init({
    fallbackLng: 'en',
    debug: false,
    supportedLngs: ['en', 'hi', 'pa'],
    
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    
    // Default namespace used
    defaultNS: 'translations',
    
    backend: {
      // Path to load translations from
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;