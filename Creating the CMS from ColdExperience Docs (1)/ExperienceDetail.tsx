import { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Experience, loadExperienceBySlug } from '@/lib/content';
import { Loader2, MapPin, Clock, DollarSign, ChevronLeft } from 'lucide-react';

// Mock data for detail pages
const mockExperienceDetails: Record<string, Experience> = {
  'ice-plunge': {
    title: 'Ice Plunge Experience',
    slug: 'ice-plunge',
    summary: 'A thrilling introduction to cold water immersion in controlled conditions',
    description: 'Experience the invigorating sensation of controlled ice plunge in our specially prepared facilities. Perfect for beginners looking to explore the benefits of cold water therapy.\n\n**What to Expect:**\n- Professional guidance from certified instructors\n- Controlled environment with safety equipment\n- Gradual immersion techniques\n- Post-immersion wellness session\n\n**Benefits:**\n- Improved circulation and metabolism\n- Enhanced immune system response\n- Mental clarity and focus\n- Stress relief and mood enhancement',
    priceFrom: 499,
    duration: '1 hour',
    season: ['Winter', 'Spring'],
    difficulty: 'Beginner',
    gallery: ['/media/ice-plunge-1.jpg', '/media/ice-plunge-2.jpg'],
    featured: true,
  },
  'arctic-swim': {
    title: 'Arctic Swim Adventure',
    slug: 'arctic-swim',
    summary: 'An advanced cold water swimming experience in pristine Nordic waters',
    description: 'Join our expert guides for an unforgettable Arctic swimming adventure. This experience combines physical challenge with the stunning beauty of Nordic landscapes.\n\n**What to Expect:**\n- Expert-led swimming in natural Nordic waters\n- Professional safety protocols and monitoring\n- Scenic Nordic landscape experience\n- Advanced techniques and endurance building\n\n**Requirements:**\n- Intermediate to advanced swimming ability\n- Physical fitness\n- Mental preparation\n- Previous cold water experience recommended',
    priceFrom: 899,
    duration: '3 hours',
    season: ['Winter', 'Spring', 'Fall'],
    difficulty: 'Advanced',
    gallery: ['/media/arctic-swim-1.jpg', '/media/arctic-swim-2.jpg', '/media/arctic-swim-3.jpg'],
    featured: true,
  },
};

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-red-100 text-red-800',
};

export default function ExperienceDetail() {
  const { t } = useTranslation();
  const [match, params] = useRoute('/experience/:slug');
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const slug = params?.slug as string;

  useEffect(() => {
    if (!slug) return;

    // Simulate loading experience
    setTimeout(() => {
      const exp = mockExperienceDetails[slug];
      setExperience(exp || null);
      setLoading(false);
    }, 500);
  }, [slug]);

  if (!match) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg text-muted-foreground">Experience not found</p>
        <Link href="/experiences">
          <a>
            <Button variant="outline">Back to Experiences</Button>
          </a>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Back Button */}
      <div className="bg-background border-b border-border">
        <div className="container py-4">
          <Link href="/experiences">
            <a className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="h-4 w-4" />
              Back to Experiences
            </a>
          </Link>
        </div>
      </div>

      {/* Gallery Section */}
      <section className="relative w-full h-[500px] bg-muted overflow-hidden">
        {experience.gallery[currentImageIndex] && (
          <img
            src={experience.gallery[currentImageIndex]}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
        )}
        {experience.gallery.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {experience.gallery.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 w-2'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-5xl font-bold mb-2">{experience.title}</h1>
                <p className="text-xl text-muted-foreground">{experience.summary}</p>
              </div>
              <Badge className={difficultyColors[experience.difficulty]}>
                {experience.difficulty}
              </Badge>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-y border-border">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('experiences.duration')}</p>
                  <p className="font-semibold">{experience.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('experiences.priceFrom')}</p>
                  <p className="font-semibold">{experience.priceFrom} SEK</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('experiences.season')}</p>
                  <p className="font-semibold">{experience.season.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-sm max-w-none mb-12">
            <p className="text-lg text-foreground whitespace-pre-wrap leading-relaxed">
              {experience.description}
            </p>
          </div>

          {/* CTA */}
          <div className="flex gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              {t('experiences.bookNow')}
            </Button>
            <Button size="lg" variant="outline">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Related Experiences */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">Other Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(mockExperienceDetails)
              .filter(exp => exp.slug !== slug)
              .slice(0, 2)
              .map(exp => (
                <Link key={exp.slug} href={`/experience/${exp.slug}`}>
                  <a className="group">
                    <div className="h-48 bg-muted rounded-lg overflow-hidden mb-4">
                      {exp.gallery[0] && (
                        <img
                          src={exp.gallery[0]}
                          alt={exp.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{exp.summary}</p>
                  </a>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
