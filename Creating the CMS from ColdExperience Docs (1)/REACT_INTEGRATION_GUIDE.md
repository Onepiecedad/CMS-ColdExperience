# React App Integration Guide

This guide walks through integrating the CMS with your existing React SPA on coldexperience.se.

## Overview

Your React app will be updated to:

1. **Read all content** from JSON files in `/content` and `/i18n`
2. **Use TypeScript types** for type safety
3. **Validate content** with Zod schemas
4. **Support 4 languages** with fallback to Swedish
5. **Cache translations** for performance
6. **Display media** from `/public/media`
7. **Render SEO metadata** dynamically

## Step 1: Copy CMS Files to Your Repository

Copy these files to your ColdExperience React repository:

```bash
# From the CMS project, copy to your React app:

# TypeScript types and utilities
cp src/types/content.ts frontend/src/types/
cp src/hooks/useI18n.ts frontend/src/hooks/
cp src/lib/cms.ts frontend/src/lib/

# Content files
cp -r content/ frontend/public/
cp -r i18n/ frontend/public/

# Configuration
cp config.yml frontend/public/admin/
cp admin.html frontend/public/admin/

# Documentation
cp FULL_SITE_INTEGRATION.md frontend/docs/
cp TEST_CHECKLIST.md frontend/docs/
cp N8N_SETUP.md frontend/docs/
```

Your repository structure should now look like:

```
frontend/
├── public/
│   ├── admin/
│   │   ├── config.yml
│   │   └── index.html
│   ├── content/
│   │   ├── site.json
│   │   ├── pages/
│   │   ├── experiences/
│   │   ├── faq/
│   │   └── blog/
│   ├── i18n/
│   │   ├── sv.json
│   │   ├── en.json
│   │   ├── de.json
│   │   ├── pl.json
│   │   └── glossary.csv
│   └── media/
├── src/
│   ├── types/
│   │   └── content.ts
│   ├── hooks/
│   │   └── useI18n.ts
│   ├── lib/
│   │   └── cms.ts
│   ├── pages/
│   ├── components/
│   └── App.tsx
└── package.json
```

## Step 2: Install Dependencies

Add required dependencies to your `package.json`:

```bash
npm install zod
# or
yarn add zod
# or
pnpm add zod
```

Zod is used for content validation. It's lightweight (~8KB gzipped).

## Step 3: Update App.tsx with Language Support

Update your main App.tsx to support language switching:

```typescript
import { useState, useEffect } from 'react';
import { useI18n } from './hooks/useI18n';
import Home from './pages/Home';
import About from './pages/About';
import Experiences from './pages/Experiences';
import ExperienceDetail from './pages/ExperienceDetail';
import Packages from './pages/Packages';
import Gallery from './pages/Gallery';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Header from './components/Header';
import Footer from './components/Footer';

type Language = 'sv' | 'en' | 'de' | 'pl';

function App() {
  const [lang, setLang] = useState<Language>(() => {
    // Get language from URL or localStorage
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    const storedLang = localStorage.getItem('language');
    return (urlLang || storedLang || 'sv') as Language;
  });

  // Save language preference
  useEffect(() => {
    localStorage.setItem('language', lang);
  }, [lang]);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    // Update URL without reload
    window.history.replaceState({}, '', `?lang=${newLang}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header lang={lang} onLanguageChange={handleLanguageChange} />
      
      <main className="flex-grow">
        {/* Routes would be handled by your router */}
        {/* Pass lang prop to all pages */}
      </main>
      
      <Footer lang={lang} />
    </div>
  );
}

export default App;
```

## Step 4: Update Header Component

```typescript
import { useI18n } from '../hooks/useI18n';
import { Link } from 'react-router-dom'; // or your router

type Language = 'sv' | 'en' | 'de' | 'pl';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Header({ lang, onLanguageChange }: HeaderProps) {
  const { t, loading } = useI18n(lang);

  if (loading) return <header className="h-16" />;

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          {t('common.appName', 'Cold Experience')}
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex gap-8">
          <li><Link to="/">{t('common.home', 'Home')}</Link></li>
          <li><Link to="/about">{t('common.about', 'About')}</Link></li>
          <li><Link to="/experiences">{t('common.experiences', 'Experiences')}</Link></li>
          <li><Link to="/packages">{t('common.packages', 'Packages')}</Link></li>
          <li><Link to="/gallery">{t('common.gallery', 'Gallery')}</Link></li>
          <li><Link to="/faq">{t('common.faq', 'FAQ')}</Link></li>
          <li><Link to="/contact">{t('common.contact', 'Contact')}</Link></li>
        </ul>

        {/* Language Switcher */}
        <div className="flex gap-2">
          {(['sv', 'en', 'de', 'pl'] as const).map(code => (
            <button
              key={code}
              onClick={() => onLanguageChange(code)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                lang === code
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
```

## Step 5: Update Home Page

```typescript
import { usePageContent } from '../hooks/useI18n';
import { HomePage, HomePageSchema } from '../types/content';

type Language = 'sv' | 'en' | 'de' | 'pl';

interface HomeProps {
  lang: Language;
}

export default function Home({ lang }: HomeProps) {
  const { data: home, loading, error } = usePageContent<HomePage>('home');

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error || !home) {
    return <div className="text-red-600 p-4">Failed to load home page</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-r from-blue-900 to-blue-700">
        {home.hero.image && (
          <img
            src={home.hero.image}
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            loading="lazy"
          />
        )}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-5xl font-bold mb-4">{home.hero.title}</h1>
          <p className="text-xl mb-8 max-w-2xl">{home.hero.subtitle}</p>
          <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
            {home.hero.cta}
          </button>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">{home.highlights.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {home.highlights.items.map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">{home.featured.title}</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">{home.featured.description}</p>
          {/* Experience cards would be loaded here */}
        </div>
      </section>
    </div>
  );
}
```

## Step 6: Update Experiences Page

```typescript
import { useEffect, useState } from 'react';
import { loadExperiences } from '../hooks/useI18n';
import { Experience } from '../types/content';
import { Link } from 'react-router-dom';

type Language = 'sv' | 'en' | 'de' | 'pl';

interface ExperiencesProps {
  lang: Language;
}

export default function Experiences({ lang }: ExperiencesProps) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExperiences()
      .then(setExperiences)
      .catch(err => {
        setError(err.message);
        console.error('Failed to load experiences:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Our Experiences</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experiences.map(exp => (
            <Link
              key={exp.slug}
              to={`/experience/${exp.slug}`}
              className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
            >
              {exp.featuredImage && (
                <img
                  src={exp.featuredImage}
                  alt={exp.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition"
                  loading="lazy"
                />
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600">{exp.title}</h3>
                <p className="text-gray-600 mb-4">{exp.summary}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>💰 From {exp.priceFrom} SEK</span>
                  <span>⏱️ {exp.duration}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Step 7: Update Experience Detail Page

```typescript
import { useExperience } from '../hooks/useI18n';
import { Experience } from '../types/content';
import { useParams } from 'react-router-dom';

type Language = 'sv' | 'en' | 'de' | 'pl';

interface ExperienceDetailProps {
  lang: Language;
}

export default function ExperienceDetail({ lang }: ExperienceDetailProps) {
  const { slug } = useParams<{ slug: string }>();
  const { data: experience, loading, error } = useExperience<Experience>(slug!);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error || !experience) {
    return <div className="text-red-600 p-4">Experience not found</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      {experience.featuredImage && (
        <img
          src={experience.featuredImage}
          alt={experience.title}
          className="w-full h-96 object-cover"
          loading="lazy"
        />
      )}

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Title & Meta */}
        <h1 className="text-4xl font-bold mb-4">{experience.title}</h1>
        <div className="flex flex-wrap gap-4 mb-8 text-gray-600">
          <span>💰 From {experience.priceFrom} SEK</span>
          <span>⏱️ {experience.duration}</span>
          <span>❄️ {experience.season}</span>
          <span>📊 {experience.difficulty}</span>
        </div>

        {/* Description */}
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">{experience.description}</p>

        {/* Gallery */}
        {experience.gallery && experience.gallery.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experience.gallery.map((img, idx) => (
                <div key={idx}>
                  <img
                    src={img.image}
                    alt={img.caption}
                    className="w-full h-64 object-cover rounded-lg"
                    loading="lazy"
                  />
                  {img.caption && (
                    <p className="text-sm text-gray-600 mt-2">{img.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Itinerary */}
        {experience.itinerary && experience.itinerary.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Itinerary</h2>
            <div className="space-y-4">
              {experience.itinerary.map((item, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-bold text-lg">{item.time} - {item.activity}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What's Included */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {experience.includes && (
            <div>
              <h3 className="text-xl font-bold mb-4">✅ Includes</h3>
              <ul className="space-y-2">
                {experience.includes.map((item, idx) => (
                  <li key={idx} className="text-gray-700">• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {experience.notIncluded && (
            <div>
              <h3 className="text-xl font-bold mb-4">❌ Not Included</h3>
              <ul className="space-y-2">
                {experience.notIncluded.map((item, idx) => (
                  <li key={idx} className="text-gray-700">• {item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition">
          Book This Experience
        </button>
      </div>
    </div>
  );
}
```

## Step 8: Update Other Pages (About, Packages, Gallery, FAQ, Contact)

Follow the same pattern for other pages:

1. Import `usePageContent` hook
2. Load page data from CMS
3. Handle loading/error states
4. Render content with proper fallbacks

See `EXAMPLE_COMPONENTS.md` for complete examples of all pages.

## Step 9: Add SEO Support

Update your HTML head with dynamic SEO metadata:

```typescript
import { useEffect } from 'react';
import { usePageContent } from '../hooks/useI18n';
import { HomePage } from '../types/content';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

function useSEO(seo: SEOProps) {
  useEffect(() => {
    // Update page title
    document.title = seo.title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seo.description);

    // Update Open Graph tags
    const updateOGTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOGTag('og:title', seo.title);
    updateOGTag('og:description', seo.description);
    if (seo.image) updateOGTag('og:image', seo.image);
    if (seo.url) updateOGTag('og:url', seo.url);
  }, [seo]);
}

export default function Home() {
  const { data: home } = usePageContent('home');

  useSEO({
    title: home?.seo?.title || 'Cold Experience',
    description: home?.seo?.description || '',
    image: home?.hero?.image,
    url: window.location.href,
  });

  // ... rest of component
}
```

## Step 10: Test Integration

### Test 1: Home Page Loads

```bash
# Start your dev server
npm start

# Visit http://localhost:3000
# Verify:
# - Hero section displays
# - Content matches JSON file
# - Images load
# - No console errors
```

### Test 2: Language Switching

```bash
# Click language switcher
# Verify:
# - Content changes to selected language
# - Falls back to Swedish if translation missing
# - URL updates with ?lang=en
# - Preference saved in localStorage
```

### Test 3: Experience Detail

```bash
# Click on an experience
# Verify:
# - Detail page loads
# - All fields display correctly
# - Gallery images show
# - Itinerary displays
# - No missing data
```

### Test 4: Media Loading

```bash
# Verify all images load:
# - Hero images
# - Experience galleries
# - Team photos
# - Gallery images
# - Check Network tab for 404s
```

### Test 5: SEO Metadata

```bash
# View page source (Ctrl+U)
# Verify:
# - <title> tag updated
# - <meta name="description"> present
# - Open Graph tags present
# - All SEO fields populated
```

## Step 11: Deploy to Production

### Netlify Deployment

```bash
# 1. Commit all changes
git add .
git commit -m "feat: integrate CMS with React app"
git push origin main

# 2. Netlify automatically builds and deploys
# 3. Verify build succeeds in Netlify dashboard
# 4. Check live site at https://coldexperience.se
```

### Vercel Deployment

```bash
# 1. Connect repository to Vercel
# 2. Vercel automatically deploys on push
# 3. Verify deployment in Vercel dashboard
# 4. Check live site
```

## Troubleshooting

### Content Not Loading

**Problem**: Pages show "Failed to load content"

**Solutions**:
- Verify JSON files are in `/public/content/`
- Check browser console for 404 errors
- Verify file paths match in hooks
- Clear browser cache (Ctrl+Shift+Delete)

### Translations Not Working

**Problem**: Content shows in Swedish only

**Solutions**:
- Verify i18n JSON files exist in `/public/i18n/`
- Check language code is correct (sv, en, de, pl)
- Verify translation keys exist in all files
- Check fallback logic in useI18n hook

### Images Not Displaying

**Problem**: Images show broken image icon

**Solutions**:
- Verify image paths start with `/media/`
- Check images exist in `/public/media/`
- Verify image filenames are correct
- Check file extensions (jpg, png, webp)

### Build Fails

**Problem**: npm run build fails

**Solutions**:
- Check for TypeScript errors: `npm run type-check`
- Verify all imports are correct
- Check for missing dependencies
- Review build logs in Netlify/Vercel

## Performance Optimization

1. **Image Optimization**
   - Use WebP format for images
   - Compress with TinyPNG or similar
   - Add `loading="lazy"` to images

2. **Code Splitting**
   - Use React.lazy() for page components
   - Implement Suspense boundaries
   - Lazy load heavy components

3. **Caching**
   - useI18n hook caches translations
   - cms.ts loader caches content
   - Set appropriate cache headers

4. **Bundle Size**
   - Tree-shake unused code
   - Use production builds
   - Monitor bundle size with webpack-bundle-analyzer

## Next Steps

1. ✅ Copy CMS files to your React repo
2. ✅ Install Zod dependency
3. ✅ Update App.tsx with language support
4. ✅ Update all page components
5. ✅ Add SEO support
6. ✅ Test all pages and languages
7. ✅ Deploy to production
8. ✅ Set up n8n auto-translation workflow
9. ✅ Invite Gustav to Decap CMS
10. ✅ Monitor live site

---

**Your React app is now fully integrated with the CMS!** 🎉
