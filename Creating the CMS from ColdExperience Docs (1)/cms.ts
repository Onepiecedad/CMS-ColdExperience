import {
  HomePage,
  HomePageSchema,
  AboutPage,
  AboutPageSchema,
  Experience,
  ExperienceSchema,
  FaqItem,
  FaqItemSchema,
  BlogPost,
  BlogPostSchema,
  SiteConfig,
  SiteConfigSchema,
  validateContent,
  validateContentWithFallback,
} from '../types/content';

/**
 * CMS Content Loader
 * Loads and validates content from JSON/MD files
 * Supports caching and fallback logic
 */

const CACHE = new Map<string, any>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_TIMESTAMPS = new Map<string, number>();

/**
 * Load JSON content from path
 * @example
 * const home = await loadJSON<HomePage>('/content/pages/home.json', HomePageSchema);
 */
export async function loadJSON<T = unknown>(
  path: string,
  schema?: any,
  options: { cache?: boolean; cacheTTL?: number } = {}
): Promise<T> {
  const { cache = true, cacheTTL = CACHE_TTL } = options;

  // Check cache
  if (cache && CACHE.has(path)) {
    const timestamp = CACHE_TIMESTAMPS.get(path) || 0;
    if (Date.now() - timestamp < cacheTTL) {
      return CACHE.get(path);
    }
  }

  try {
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to load ${path}: ${response.statusText}`);
    }

    let data = await response.json();

    // Validate if schema provided
    if (schema) {
      data = validateContent(schema, data);
    }

    // Cache the result
    if (cache) {
      CACHE.set(path, data);
      CACHE_TIMESTAMPS.set(path, Date.now());
    }

    return data as T;
  } catch (error) {
    console.error(`Error loading ${path}:`, error);
    throw error;
  }
}

/**
 * Load content with fallback to Swedish if translation missing
 */
export async function loadContentWithFallback<T = unknown>(
  path: string,
  fallbackPath: string,
  schema?: any
): Promise<T> {
  try {
    return await loadJSON<T>(path, schema);
  } catch (error) {
    console.warn(`Failed to load ${path}, falling back to ${fallbackPath}:`, error);
    return await loadJSON<T>(fallbackPath, schema);
  }
}

/**
 * Load site configuration
 */
export async function loadSiteConfig(): Promise<SiteConfig> {
  return loadJSON<SiteConfig>(
    '/content/site.json',
    SiteConfigSchema,
    { cache: true }
  );
}

/**
 * Load home page content
 */
export async function loadHomePage(lang: string = 'sv'): Promise<HomePage> {
  return loadJSON<HomePage>(
    `/content/pages/home.json`,
    HomePageSchema,
    { cache: true }
  );
}

/**
 * Load about page content
 */
export async function loadAboutPage(lang: string = 'sv'): Promise<AboutPage> {
  return loadJSON<AboutPage>(
    `/content/pages/about.json`,
    AboutPageSchema,
    { cache: true }
  );
}

/**
 * Load all experiences
 */
export async function loadExperiences(): Promise<Experience[]> {
  // This would need to be implemented based on your file structure
  // For now, load individual experiences
  const experiences = ['snowmobile', 'aurora-hunt', 'dog-sled', 'accommodation'];
  
  const results = await Promise.all(
    experiences.map(slug => loadExperience(slug))
  );

  return results.filter(exp => exp !== null) as Experience[];
}

/**
 * Load single experience by slug
 */
export async function loadExperience(slug: string): Promise<Experience | null> {
  try {
    return await loadJSON<Experience>(
      `/content/experiences/${slug}.json`,
      ExperienceSchema,
      { cache: true }
    );
  } catch (error) {
    console.error(`Failed to load experience ${slug}:`, error);
    return null;
  }
}

/**
 * Load FAQ items
 */
export async function loadFaqItems(): Promise<FaqItem[]> {
  // This would need to be implemented based on your file structure
  // For now, return empty array
  return [];
}

/**
 * Load blog posts
 */
export async function loadBlogPosts(): Promise<BlogPost[]> {
  // This would need to be implemented based on your file structure
  // For now, return empty array
  return [];
}

/**
 * Load translations for a language
 */
export async function loadTranslations(lang: string = 'sv'): Promise<Record<string, any>> {
  return loadJSON<Record<string, any>>(
    `/i18n/${lang}.json`,
    undefined,
    { cache: true }
  );
}

/**
 * Load glossary for translation
 */
export async function loadGlossary(): Promise<Map<string, Map<string, string>>> {
  try {
    const response = await fetch('/i18n/glossary.csv');
    if (!response.ok) {
      throw new Error('Failed to load glossary');
    }

    const csv = await response.text();
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');

    const glossary = new Map<string, Map<string, string>>();

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const sv = values[0]?.trim();
      const en = values[1]?.trim();
      const de = values[2]?.trim();
      const pl = values[3]?.trim();

      if (sv) {
        glossary.set(sv, new Map([
          ['en', en || sv],
          ['de', de || sv],
          ['pl', pl || sv],
        ]));
      }
    }

    return glossary;
  } catch (error) {
    console.error('Error loading glossary:', error);
    return new Map();
  }
}

/**
 * Clear all caches
 */
export function clearCache(): void {
  CACHE.clear();
  CACHE_TIMESTAMPS.clear();
}

/**
 * Clear cache for specific path
 */
export function clearCachePath(path: string): void {
  CACHE.delete(path);
  CACHE_TIMESTAMPS.delete(path);
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: CACHE.size,
    keys: Array.from(CACHE.keys()),
  };
}

/**
 * Path helpers
 */
export const contentPath = {
  site: () => '/content/site.json',
  page: (name: string) => `/content/pages/${name}.json`,
  experience: (slug: string) => `/content/experiences/${slug}.json`,
  faq: (slug: string) => `/content/faq/${slug}.md`,
  blog: (slug: string) => `/content/blog/${slug}.md`,
  i18n: (lang: string) => `/i18n/${lang}.json`,
  glossary: () => '/i18n/glossary.csv',
};
