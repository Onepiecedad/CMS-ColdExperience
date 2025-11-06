import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type Experience } from '@/lib/content';
import { Loader2, MapPin, Clock, DollarSign } from 'lucide-react';

// Mock data - in production this would come from loadExperiences()
const mockExperiences: Experience[] = [
  {
    title: 'Ice Plunge Experience',
    slug: 'ice-plunge',
    summary: 'A thrilling introduction to cold water immersion in controlled conditions',
    description: 'Experience the invigorating sensation of controlled ice plunge in our specially prepared facilities.',
    priceFrom: 499,
    duration: '1 hour',
    season: ['Winter', 'Spring'],
    difficulty: 'Beginner',
    gallery: ['/media/ice-plunge-1.jpg', '/media/ice-plunge-2.jpg'],
    featured: true,
  },
  {
    title: 'Arctic Swim Adventure',
    slug: 'arctic-swim',
    summary: 'An advanced cold water swimming experience in pristine Nordic waters',
    description: 'Join our expert guides for an unforgettable Arctic swimming adventure.',
    priceFrom: 899,
    duration: '3 hours',
    season: ['Winter', 'Spring', 'Fall'],
    difficulty: 'Advanced',
    gallery: ['/media/arctic-swim-1.jpg', '/media/arctic-swim-2.jpg', '/media/arctic-swim-3.jpg'],
    featured: true,
  },
];

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-red-100 text-red-800',
};

export default function Experiences() {
  const { t } = useTranslation();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading experiences
    setTimeout(() => {
      setExperiences(mockExperiences);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container">
          <h1 className="text-5xl font-bold mb-4">{t('experiences.title')}</h1>
          <p className="text-xl text-blue-100">{t('experiences.description')}</p>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map(experience => (
              <Card key={experience.slug} className="overflow-hidden hover:shadow-lg transition-shadow">
                {experience.gallery[0] && (
                  <div className="h-48 overflow-hidden bg-muted">
                    <img
                      src={experience.gallery[0]}
                      alt={experience.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="line-clamp-2">{experience.title}</CardTitle>
                    <Badge className={difficultyColors[experience.difficulty]}>
                      {experience.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {experience.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{experience.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          {t('experiences.priceFrom')} {experience.priceFrom} SEK
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {experience.season.map(s => (
                          <Badge key={s} variant="outline" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <Link href={`/experience/${experience.slug}`}>
                      <a>
                        <Button className="w-full" variant="default">
                          {t('experiences.bookNow')}
                        </Button>
                      </a>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
