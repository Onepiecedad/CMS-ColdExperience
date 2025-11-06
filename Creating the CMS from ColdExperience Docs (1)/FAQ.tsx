import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { type FAQ } from '@/lib/content';
import { Loader2 } from 'lucide-react';

// Mock FAQ data
const mockFAQs: FAQ[] = [
  {
    question: 'Is cold water immersion safe?',
    answer: 'Yes, when done properly with expert guidance. Our experienced instructors ensure all participants follow safety protocols and are monitored throughout the experience. We recommend consulting with your doctor before participating, especially if you have any health conditions.',
    category: 'Safety',
    order: 1,
  },
  {
    question: 'What should I bring to an experience?',
    answer: 'We provide all necessary equipment including wetsuits and safety gear. We recommend bringing:\n\n- Towel and change of clothes\n- Waterproof bag for personal items\n- Water bottle\n- Snacks\n- Any personal medications\n\nWear comfortable clothes that you don\'t mind getting wet.',
    category: 'General',
    order: 2,
  },
  {
    question: 'What is the age requirement?',
    answer: 'Participants must be at least 16 years old. Minors aged 16-18 must have parental consent and supervision. For younger children, we offer family-friendly experiences with modified activities.',
    category: 'General',
    order: 3,
  },
  {
    question: 'Do I need swimming experience?',
    answer: 'No, but basic swimming ability is recommended for some experiences. Our Beginner experiences are designed for those with no prior cold water experience. We offer training and support for all skill levels.',
    category: 'General',
    order: 4,
  },
  {
    question: 'How far in advance should I book?',
    answer: 'We recommend booking at least 2 weeks in advance to ensure availability. During peak season (December-February), we recommend booking 4-6 weeks ahead. Last-minute bookings may be available depending on group size and weather conditions.',
    category: 'Booking',
    order: 5,
  },
  {
    question: 'What if the weather is bad?',
    answer: 'We monitor weather conditions closely and may reschedule experiences if conditions are unsafe. You will be notified at least 24 hours in advance. Rescheduling is free, and you can also request a full refund if the new date doesn\'t work for you.',
    category: 'General',
    order: 6,
  },
];

export default function FAQ() {
  const { t } = useTranslation();
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading FAQs
    setTimeout(() => {
      setFAQs(mockFAQs.sort((a, b) => a.order - b.order));
      setLoading(false);
    }, 500);
  }, []);

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));
  const filteredFAQs = selectedCategory
    ? faqs.filter(faq => faq.category === selectedCategory)
    : faqs;

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
          <h1 className="text-5xl font-bold mb-4">{t('faq.title')}</h1>
          <p className="text-xl text-blue-100">{t('faq.description')}</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container max-w-3xl">
          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="mb-8 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full">
            {filteredFAQs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground whitespace-pre-wrap">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No FAQs found for this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
