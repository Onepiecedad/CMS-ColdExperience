import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loadHomeContent, type HomeContent } from '@/lib/content';
import { Snowflake, Users, Heart, Loader2 } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  snowflake: <Snowflake className="h-8 w-8" />,
  users: <Users className="h-8 w-8" />,
  heart: <Heart className="h-8 w-8" />,
};

export default function Home() {
  const { t } = useTranslation();
  const [content, setContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeContent()
      .then(setContent)
      .catch(error => {
        console.error('Failed to load home content:', error);
        // Set default content if loading fails
        setContent({
          hero: {
            title: t('home.hero.title'),
            subtitle: t('home.hero.subtitle'),
            image: '/media/hero-image.jpg',
            videoUrl: '/media/hero-video.mp4',
            ctaText: t('home.hero.ctaText'),
            ctaHref: '/experiences',
          },
          about: {
            title: t('home.about.title'),
            description: t('home.about.description'),
            image: '/media/about-image.jpg',
          },
          features: [
            {
              title: t('home.hero.title'),
              description: t('home.about.description'),
              icon: 'snowflake',
            },
          ],
        });
      })
      .finally(() => setLoading(false));
  }, [t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{t('common.appName')} - Content unavailable</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] bg-gradient-to-br from-blue-600 to-blue-800 overflow-hidden">
        <div className="absolute inset-0">
          {content.hero.image && (
            <img
              src={content.hero.image}
              alt={content.hero.title}
              className="w-full h-full object-cover opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent" />
        </div>

        <div className="relative container h-full flex flex-col justify-center items-start">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 max-w-2xl">
            {content.hero.title}
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-xl">
            {content.hero.subtitle}
          </p>
          <Link href={content.hero.ctaHref}>
            <a>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                {content.hero.ctaText}
              </Button>
            </a>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">{content.about.title}</h2>
              <p className="text-lg text-muted-foreground mb-8">
                {content.about.description}
              </p>
              <Link href="/experiences">
                <a>
                  <Button size="lg" variant="default">
                    {t('experiences.bookNow')}
                  </Button>
                </a>
              </Link>
            </div>
            {content.about.image && (
              <div className="h-96 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={content.about.image}
                  alt={content.about.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">
            {t('home.about.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardHeader>
                  <div className="mb-4 text-blue-600">
                    {iconMap[feature.icon] || <Snowflake className="h-8 w-8" />}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-blue-600 text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">
            {t('experiences.title')}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('experiences.description')}
          </p>
          <Link href="/experiences">
            <a>
              <Button size="lg" variant="secondary">
                {t('experiences.bookNow')}
              </Button>
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
}
