import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

export const initI18n = async () => {
  if (i18next.isInitialized) return;

  await i18next
    .use(HttpBackend)
    .use(LanguageDetector)
    .init({
      fallbackLng: 'sv',
      supportedLngs: ['sv', 'en', 'de', 'pl'],
      ns: ['translation'],
      defaultNS: 'translation',
      backend: {
        loadPath: '/i18n/{{lng}}.json',
      },
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      },
    });
};

export const getTranslation = (key: string, defaultValue?: string) => {
  return i18next.t(key, defaultValue || key);
};

export const getCurrentLanguage = () => {
  return i18next.language;
};

export const changeLanguage = (lng: string) => {
  return i18next.changeLanguage(lng);
};

export const getAvailableLanguages = () => {
  return ['sv', 'en', 'de', 'pl'];
};

export const getLanguageName = (code: string): string => {
  const names: Record<string, string> = {
    sv: 'Svenska',
    en: 'English',
    de: 'Deutsch',
    pl: 'Polski',
  };
  return names[code] || code;
};

export default i18next;
