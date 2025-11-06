import { useEffect, useState } from 'react';

type Language = 'sv' | 'en' | 'de' | 'pl';

interface UseI18nOptions {
  fallbackLang?: Language;
  cache?: boolean;
}

/**
 * Hook to load and use i18n translations
 * Supports fallback to Swedish if translation key is missing
 * 
 * @example
 * const { t } = useI18n('en');
 * <h1>{t('home.title')}</h1>
 * <p>{t('home.subtitle', 'Default subtitle')}</p>
 */
export function useI18n(
  lang: Language = 'sv',
  options: UseI18nOptions = {}
) {
  const { fallbackLang = 'sv', cache = true } = options;
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [fallbackTranslations, setFallbackTranslations] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load translations
  useEffect(() => {
    const cacheKey = `i18n_${lang}`;
    const fallbackCacheKey = `i18n_${fallbackLang}`;

    const loadTranslations = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check cache first
        let data = null;
        if (cache) {
          const cached = sessionStorage.getItem(cacheKey);
          if (cached) {
            data = JSON.parse(cached);
          }
        }

        // Load from file if not cached
        if (!data) {
          const response = await fetch(`/i18n/${lang}.json`);
          if (!response.ok) {
            throw new Error(`Failed to load translations for ${lang}`);
          }
          data = await response.json();

          // Cache the result
          if (cache) {
            sessionStorage.setItem(cacheKey, JSON.stringify(data));
          }
        }

        setTranslations(data);

        // Load fallback translations if different language
        if (lang !== fallbackLang) {
          let fallbackData = null;

          if (cache) {
            const cached = sessionStorage.getItem(fallbackCacheKey);
            if (cached) {
              fallbackData = JSON.parse(cached);
            }
          }

          if (!fallbackData) {
            const response = await fetch(`/i18n/${fallbackLang}.json`);
            if (response.ok) {
              fallbackData = await response.json();

              if (cache) {
                sessionStorage.setItem(fallbackCacheKey, JSON.stringify(fallbackData));
              }
            }
          }

          if (fallbackData) {
            setFallbackTranslations(fallbackData);
          }
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    };

    loadTranslations();
  }, [lang, fallbackLang, cache]);

  /**
   * Get translation value by key with dot notation support
   * Falls back to Swedish if key not found
   * 
   * @example
   * t('home.hero.title')
   * t('home.hero.title', 'Default Title')
   */
  const t = (key: string, fallback: string = ''): string => {
    // Get value from current language
    const value = getNestedValue(translations, key);
    if (value !== undefined && value !== null) {
      return String(value);
    }

    // Fall back to Swedish if different language
    if (lang !== fallbackLang) {
      const fallbackValue = getNestedValue(fallbackTranslations, key);
      if (fallbackValue !== undefined && fallbackValue !== null) {
        return String(fallbackValue);
      }
    }

    // Use provided fallback or return key itself
    return fallback || key;
  };

  /**
   * Get nested object value using dot notation
   * @example
   * getNestedValue({ a: { b: { c: 'value' } } }, 'a.b.c') // 'value'
   */
  const getNestedValue = (obj: Record<string, any>, path: string): any => {
    return path.split('.').reduce((current, prop) => {
      return current?.[prop];
    }, obj);
  };

  return {
    t,
    loading,
    error,
    language: lang,
    fallbackLanguage: fallbackLang,
  };
}

/**
 * Hook to load page-specific content JSON
 * 
 * @example
 * const { data, loading, error } = usePageContent('home', 'sv');
 */
export function usePageContent<T = any>(
  page: string,
  lang: Language = 'sv'
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/content/pages/${page}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load content for ${page}`);
        }

        const content = await response.json();
        setData(content);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [page, lang]);

  return { data, loading, error };
}

/**
 * Hook to load experience data
 * 
 * @example
 * const { data, loading, error } = useExperience('snowmobile');
 */
export function useExperience<T = any>(slug: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadExperience = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/content/experiences/${slug}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load experience ${slug}`);
        }

        const experience = await response.json();
        setData(experience);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    loadExperience();
  }, [slug]);

  return { data, loading, error };
}
