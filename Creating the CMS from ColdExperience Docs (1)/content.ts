export interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
    image: string;
    videoUrl: string;
    ctaText: string;
    ctaHref: string;
  };
  about: {
    title: string;
    description: string;
    image: string;
  };
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

export interface Experience {
  title: string;
  slug: string;
  summary: string;
  description: string;
  priceFrom: number;
  duration: string;
  season: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  gallery: string[];
  featured: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
  category: 'General' | 'Safety' | 'Booking' | 'Health';
  order: number;
}

export const loadHomeContent = async (): Promise<HomeContent> => {
  try {
    const response = await fetch('/content/pages/home.json');
    if (!response.ok) throw new Error('Failed to load home content');
    return await response.json();
  } catch (error) {
    console.error('Error loading home content:', error);
    throw error;
  }
};

export const loadExperiences = async (): Promise<Experience[]> => {
  try {
    // In a real implementation, this would load from the file system
    // For now, we'll fetch from a hypothetical API endpoint
    const response = await fetch('/api/experiences');
    if (!response.ok) throw new Error('Failed to load experiences');
    return await response.json();
  } catch (error) {
    console.error('Error loading experiences:', error);
    return [];
  }
};

export const loadExperienceBySlug = async (slug: string): Promise<Experience | null> => {
  try {
    const response = await fetch(`/content/experiences/${slug}.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Error loading experience ${slug}:`, error);
    return null;
  }
};

export const loadFAQs = async (): Promise<FAQ[]> => {
  try {
    // In a real implementation, this would load from the file system
    const response = await fetch('/api/faqs');
    if (!response.ok) throw new Error('Failed to load FAQs');
    return await response.json();
  } catch (error) {
    console.error('Error loading FAQs:', error);
    return [];
  }
};

export const loadFAQBySlug = async (slug: string): Promise<FAQ | null> => {
  try {
    const response = await fetch(`/content/faq/${slug}.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Error loading FAQ ${slug}:`, error);
    return null;
  }
};
