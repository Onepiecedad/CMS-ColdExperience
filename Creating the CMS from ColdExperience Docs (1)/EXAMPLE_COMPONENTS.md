# Example React Components Using CMS

This guide shows how to integrate the CMS hooks and loaders into your React components.

## Home Page Component

```typescript
import { useI18n, usePageContent } from '@/hooks/useI18n';
import { HomePage } from '@/types/content';

export function Home() {
  const { t, loading: i18nLoading } = useI18n('sv');
  const { data: home, loading: contentLoading } = usePageContent<HomePage>('home');

  if (i18nLoading || contentLoading) {
    return <div>Loading...</div>;
  }

  if (!home) {
    return <div>Failed to load content</div>;
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
          />
        )}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-5xl font-bold mb-4">{home.hero.title}</h1>
          <p className="text-xl mb-8 max-w-2xl text-center">{home.hero.subtitle}</p>
          <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-bold hover:bg-gray-100">
            {home.hero.cta}
          </button>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{home.highlights.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {home.highlights.items.map((item, idx) => (
            <div key={idx} className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-16 px-4 bg-blue-50">
        <h2 className="text-3xl font-bold text-center mb-4">{home.featured.title}</h2>
        <p className="text-center text-gray-600 mb-12">{home.featured.description}</p>
        {/* Experience cards would go here */}
      </section>
    </div>
  );
}
```

## Experience Detail Component

```typescript
import { useExperience } from '@/hooks/useI18n';
import { Experience } from '@/types/content';
import { useParams } from 'react-router-dom';

export function ExperienceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: experience, loading, error } = useExperience<Experience>(slug!);

  if (loading) return <div>Loading...</div>;
  if (error || !experience) return <div>Experience not found</div>;

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      {experience.featuredImage && (
        <img
          src={experience.featuredImage}
          alt={experience.title}
          className="w-full h-96 object-cover"
        />
      )}

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Title & Meta */}
        <h1 className="text-4xl font-bold mb-4">{experience.title}</h1>
        <div className="flex gap-4 mb-8 text-gray-600">
          <span>💰 From {experience.priceFrom} SEK</span>
          <span>⏱️ {experience.duration}</span>
          <span>❄️ {experience.season}</span>
          <span>📊 {experience.difficulty}</span>
        </div>

        {/* Description */}
        <p className="text-lg text-gray-700 mb-8">{experience.description}</p>

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
                <div key={idx} className="border-l-4 border-blue-500 pl-4">
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
        <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700">
          Book This Experience
        </button>
      </div>
    </div>
  );
}
```

## Language Switcher Component

```typescript
import { useI18n } from '@/hooks/useI18n';
import { useState } from 'react';

type Language = 'sv' | 'en' | 'de' | 'pl';

export function LanguageSwitcher() {
  const [lang, setLang] = useState<Language>('sv');
  const { t } = useI18n(lang);

  const languages: { code: Language; label: string }[] = [
    { code: 'sv', label: 'Svenska' },
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
    { code: 'pl', label: 'Polski' },
  ];

  return (
    <div className="flex gap-2">
      {languages.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`px-4 py-2 rounded ${
            lang === code
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
```

## FAQ Component

```typescript
import { useI18n } from '@/hooks/useI18n';
import { useState } from 'react';
import { FaqItem } from '@/types/content';

export function FAQ({ items }: { items: FaqItem[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="border rounded-lg">
            <button
              onClick={() => setExpanded(expanded === idx ? null : idx)}
              className="w-full px-6 py-4 text-left font-bold hover:bg-gray-50 flex justify-between items-center"
            >
              <span>{item.question}</span>
              <span className="text-2xl">{expanded === idx ? '−' : '+'}</span>
            </button>

            {expanded === idx && (
              <div className="px-6 py-4 bg-gray-50 border-t">
                <p className="text-gray-700">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## About Page Component

```typescript
import { usePageContent } from '@/hooks/useI18n';
import { AboutPage } from '@/types/content';

export function About() {
  const { data: about, loading } = usePageContent<AboutPage>('about');

  if (loading) return <div>Loading...</div>;
  if (!about) return <div>Failed to load content</div>;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{about.title}</h1>
          <p className="text-xl">{about.description}</p>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{about.team.title}</h2>
          <p className="text-gray-600 mb-12">{about.team.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {about.team.members.map((member, idx) => (
              <div key={idx} className="text-center">
                {member.image && (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-2xl font-bold">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-700">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-blue-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{about.mission.title}</h2>
          <p className="text-lg text-gray-700">{about.mission.description}</p>
        </div>
      </section>
    </div>
  );
}
```

## Packages Page Component

```typescript
import { usePageContent } from '@/hooks/useI18n';
import { z } from 'zod';

const PackagesPageSchema = z.object({
  title: z.string(),
  description: z.string(),
  packages: z.array(
    z.object({
      key: z.string(),
      title: z.string(),
      summary: z.string(),
      priceFrom: z.number(),
      duration: z.string(),
      featured: z.boolean().optional(),
      includes: z.array(z.string()).optional(),
    })
  ),
});

type PackagesPage = z.infer<typeof PackagesPageSchema>;

export function Packages() {
  const { data: packages, loading } = usePageContent<PackagesPage>('packages');

  if (loading) return <div>Loading...</div>;
  if (!packages) return <div>Failed to load content</div>;

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">{packages.title}</h1>
        <p className="text-center text-gray-600 mb-12">{packages.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {packages.packages.map((pkg) => (
            <div
              key={pkg.key}
              className={`border-2 rounded-lg p-6 ${
                pkg.featured ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
              }`}
            >
              {pkg.featured && (
                <div className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">
                  Featured
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
              <p className="text-gray-600 mb-4">{pkg.summary}</p>

              <div className="mb-6">
                <div className="text-3xl font-bold text-blue-600">
                  From {pkg.priceFrom} SEK
                </div>
                <p className="text-gray-600">{pkg.duration}</p>
              </div>

              {pkg.includes && (
                <div className="mb-6">
                  <h4 className="font-bold mb-2">Includes:</h4>
                  <ul className="space-y-1">
                    {pkg.includes.map((item, idx) => (
                      <li key={idx} className="text-gray-700">✓ {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Using Content Loader with Validation

```typescript
import { loadHomePage, loadExperiences } from '@/lib/cms';
import { HomePage, HomePageSchema } from '@/types/content';
import { useEffect, useState } from 'react';

export function HomeWithValidation() {
  const [home, setHome] = useState<HomePage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHomePage()
      .then(data => {
        // Data is already validated by loadHomePage
        setHome(data);
      })
      .catch(err => {
        setError(err.message);
        console.error('Failed to load home page:', err);
      });
  }, []);

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  if (!home) {
    return <div>Loading...</div>;
  }

  // home is guaranteed to be valid HomePage type
  return (
    <div>
      <h1>{home.hero.title}</h1>
      {/* ... rest of component */}
    </div>
  );
}
```

## Translation with Fallback

```typescript
import { useI18n } from '@/hooks/useI18n';

export function Header() {
  const lang = 'en'; // or get from context/URL
  const { t, loading, error } = useI18n(lang, {
    fallbackLang: 'sv',
    cache: true,
  });

  if (loading) return <div>Loading...</div>;

  return (
    <header className="bg-white shadow">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {t('common.appName', 'Cold Experience')}
        </h1>
        <ul className="flex gap-6">
          <li><a href="/">{t('common.home', 'Home')}</a></li>
          <li><a href="/about">{t('common.about', 'About')}</a></li>
          <li><a href="/packages">{t('common.packages', 'Packages')}</a></li>
          <li><a href="/contact">{t('common.contact', 'Contact')}</a></li>
        </ul>
      </nav>
    </header>
  );
}
```

## Best Practices

1. **Always validate content** - Use Zod schemas to catch errors early
2. **Implement loading states** - Show spinners while content loads
3. **Handle errors gracefully** - Fallback to Swedish or default values
4. **Cache translations** - Use sessionStorage to avoid repeated requests
5. **Lazy load images** - Use `loading="lazy"` for images
6. **Optimize bundle** - Tree-shake unused types and utilities
7. **Test fallbacks** - Verify behavior when translations are missing
8. **Monitor performance** - Track load times and cache hit rates

---

**Your components are ready to use with the CMS!**
