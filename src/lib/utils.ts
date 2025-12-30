import type { Profile, Project, Testimonial, Blog, PersonJsonLd, BlogPostJsonLd } from './schemas';

const SITE_URL = 'https://shreyansbhatt.com';

/**
 * Generate Person JSON-LD for Schema.org
 * Maps profile data including availability (makesOffer) and testimonials (endorsement)
 */
export function generatePersonJsonLd(
  profile: Profile,
  testimonials: Testimonial[] = []
): PersonJsonLd {
  const sameAs: string[] = [];
  if (profile.socialLinks.linkedin) sameAs.push(profile.socialLinks.linkedin);
  if (profile.socialLinks.github) sameAs.push(profile.socialLinks.github);
  if (profile.socialLinks.twitter) sameAs.push(profile.socialLinks.twitter);
  if (profile.socialLinks.medium) sameAs.push(profile.socialLinks.medium);

  // Map openTo to Schema.org Offer objects
  const makesOffer = profile.openTo.map((engagement) => ({
    '@type': 'Offer' as const,
    itemOffered: {
      '@type': 'Service' as const,
      name: `${engagement} Engagement`,
    },
  }));

  // Map testimonials to Schema.org Review objects
  const endorsement = testimonials.map((t) => ({
    '@type': 'Review' as const,
    author: {
      '@type': 'Person' as const,
      name: t.authorName,
      jobTitle: t.authorRole,
    },
    reviewBody: t.textContent, // SEO text from testimonial
    datePublished: t.date,
  }));

  // Parse location into city/country
  const locationParts = profile.location.split(',').map((s) => s.trim());
  const addressLocality = locationParts[0] || profile.location;
  const addressCountry = locationParts[1] || 'India';

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    description: profile.tagline,
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    image: profile.avatarImage ? `${SITE_URL}${profile.avatarImage}` : undefined,
    url: SITE_URL,
    sameAs,
    address: {
      '@type': 'PostalAddress',
      addressLocality,
      addressCountry,
    },
    makesOffer,
    endorsement: endorsement.length > 0 ? endorsement : undefined,
  };
}

/**
 * Generate BlogPosting JSON-LD for individual blog posts
 */
export function generateBlogPostJsonLd(
  blog: Blog,
  authorName: string,
  content?: string
): BlogPostJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.seoDescription,
    datePublished: blog.publishDate,
    dateModified: blog.updatedDate || blog.publishDate,
    author: {
      '@type': 'Person',
      name: authorName,
      url: SITE_URL,
    },
    image: blog.coverImage ? `${SITE_URL}${blog.coverImage}` : undefined,
    publisher: {
      '@type': 'Person',
      name: authorName,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${blog.slug}`,
    },
    keywords: blog.tags.join(', '),
    articleSection: blog.category,
  };
}

/**
 * Generate WebSite JSON-LD for the overall site
 */
export function generateWebsiteJsonLd(profile: Profile) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${profile.name} - ${profile.title}`,
    description: profile.tagline,
    url: SITE_URL,
    author: {
      '@type': 'Person',
      name: profile.name,
    },
  };
}

/**
 * Generate BreadcrumbList JSON-LD for navigation
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Obfuscate email for frontend display (anti-scraping)
 */
export function obfuscateEmail(email: string): string {
  return email.replace('@', '[at]').replace('.', '[dot]');
}

/**
 * Decode obfuscated email (for mailto links via JS)
 */
export function decodeEmail(obfuscated: string): string {
  return obfuscated.replace('[at]', '@').replace('[dot]', '.');
}

/**
 * Get display name for project (handles confidentiality)
 */
export function getProjectDisplayName(project: Project): string {
  if (project.isConfidential && project.displayName) {
    return project.displayName;
  }
  return project.clientName;
}

/**
 * Format date range for projects
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const formatMonth = (date: string) => {
    if (date === 'Present') return 'Present';
    const [year, month] = date.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };
  return `${formatMonth(startDate)} – ${formatMonth(endDate)}`;
}

/**
 * Calculate project duration in months
 */
export function calculateDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate + '-01');
  const end = endDate === 'Present' ? new Date() : new Date(endDate + '-01');
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return Math.max(1, months);
}

/**
 * Format duration for display
 */
export function formatDuration(months: number): string {
  if (months < 12) {
    return `${months} month${months === 1 ? '' : 's'}`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) {
    return `${years} year${years === 1 ? '' : 's'}`;
  }
  return `${years} yr${years === 1 ? '' : 's'} ${remainingMonths} mo`;
}

/**
 * Get availability status emoji and color class
 */
export function getAvailabilityDisplay(status: string): { emoji: string; colorClass: string; label: string } {
  switch (status) {
    case 'Available':
      return { emoji: '🟢', colorClass: 'text-green-400', label: 'Available for Work' };
    case 'Open to Discuss':
      return { emoji: '🟡', colorClass: 'text-yellow-400', label: 'Open to Discuss' };
    case 'Busy':
      return { emoji: '🔴', colorClass: 'text-red-400', label: 'Currently Busy' };
    default:
      return { emoji: '⚪', colorClass: 'text-gray-400', label: 'Status Unknown' };
  }
}

/**
 * Group projects by year for timeline display
 */
export function groupProjectsByYear(projects: Project[]): Map<number, Project[]> {
  const grouped = new Map<number, Project[]>();
  
  projects
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
    .forEach((project) => {
      const year = parseInt(project.startDate.split('-')[0]);
      if (!grouped.has(year)) {
        grouped.set(year, []);
      }
      grouped.get(year)!.push(project);
    });
  
  return grouped;
}

/**
 * Calculate total years of experience from projects
 */
export function calculateTotalExperience(projects: Project[]): number {
  if (projects.length === 0) return 0;
  
  const sortedProjects = [...projects].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const earliestStart = new Date(sortedProjects[0].startDate + '-01');
  const now = new Date();
  
  const years = (now.getFullYear() - earliestStart.getFullYear()) + 
    (now.getMonth() - earliestStart.getMonth()) / 12;
  
  return Math.round(years);
}

/**
 * Aggregate skills across all projects with max rating
 */
export function aggregateSkills(projects: Project[]): Array<{ name: string; maxRating: number; projectCount: number }> {
  const skillMap = new Map<string, { maxRating: number; projectCount: number }>();
  
  projects.forEach((project) => {
    project.skills.forEach((skill) => {
      const existing = skillMap.get(skill.name);
      if (existing) {
        existing.maxRating = Math.max(existing.maxRating, skill.rating);
        existing.projectCount++;
      } else {
        skillMap.set(skill.name, { maxRating: skill.rating, projectCount: 1 });
      }
    });
  });
  
  return Array.from(skillMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.maxRating - a.maxRating || b.projectCount - a.projectCount);
}
