import { useEffect, useState } from 'react';
import i18next from 'i18next';

export const useTranslation = () => {
  const [language, setLanguage] = useState(i18next.language);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLanguage(lng);
    };

    i18next.on('languageChanged', handleLanguageChange);

    return () => {
      i18next.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const t = (key: string, defaultValue?: string) => {
    return i18next.t(key, defaultValue || key);
  };

  const changeLanguage = (lng: string) => {
    return i18next.changeLanguage(lng);
  };

  return {
    t,
    i18n: i18next,
    language,
    changeLanguage,
  };
};
