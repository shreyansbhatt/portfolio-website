import { z } from 'zod';

// ============================================================
// ENUMS
// ============================================================

export const AvailabilityStatusEnum = z.enum([
  'Available',
  'Busy',
  'Open to Discuss',
]);

export const OpenToEnum = z.enum([
  'Full-time',
  'Contract',
  'Freelance',
  'Advisory',
]);

export const WorkModeEnum = z.enum([
  'Remote',
  'Hybrid',
  'Onsite',
]);

export const EngagementTypeEnum = z.enum([
  'Permanent',
  'Contract',
]);

export const AspirationTimelineEnum = z.enum([
  'Immediate',
  'Strategic',
  'Visionary',
]);

export const BlogCategoryEnum = z.enum([
  'AI Engineering',
  'Offensive Security',
  'System Design',
  'Leadership',
]);

export const BlogStatusEnum = z.enum([
  'draft',
  'published',
  'archived',
]);

// ============================================================
// COMPOSITE SCHEMAS
// ============================================================

export const SocialLinksSchema = z.object({
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  twitter: z.string().url().optional(),
  medium: z.string().url().optional(),
});

export const AspirationSchema = z.object({
  goal: z.string().min(1).max(200),
  timeline: AspirationTimelineEnum,
  icon: z.string().optional(),
});

export const SkillRatingSchema = z.object({
  name: z.string().min(1).max(50),
  rating: z.number().int().min(0).max(10),
});

export const SeriesSchema = z.object({
  seriesName: z.string().min(1).max(100),
  partNumber: z.number().int().positive(),
});

// ============================================================
// MAIN CONTENT SCHEMAS
// ============================================================

export const ProfileSchema = z.object({
  name: z.string().min(1).max(100),
  title: z.string().min(1).max(150),
  tagline: z.string().min(1).max(300),
  email: z.string().email(),
  phone: z.string().optional(),
  avatarImage: z.string().optional(),
  location: z.string().min(1).max(100),
  timezone: z.string().min(1).max(50),
  availabilityStatus: AvailabilityStatusEnum,
  openTo: z.array(OpenToEnum).min(1),
  workModes: z.array(WorkModeEnum).min(1),
  socialLinks: SocialLinksSchema,
  aspirations: z.array(AspirationSchema).min(1).max(10),
  bio: z.string().optional(),
});

export const ProjectSchema = z.object({
  slug: z.string().min(1).max(100),
  clientName: z.string().min(1).max(150),
  displayName: z.string().optional(),
  role: z.string().min(1).max(100),
  startDate: z.string().regex(/^\d{4}-\d{2}$/), // YYYY-MM format
  endDate: z.string().regex(/^(\d{4}-\d{2}|Present)$/),
  engagementType: EngagementTypeEnum,
  workMode: WorkModeEnum,
  teamSize: z.number().int().positive().optional(),
  location: z.string().optional(),
  isConfidential: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isDraft: z.boolean().default(false),
  companyDescription: z.string().optional(),
  techStack: z.array(z.string()).min(1),
  skills: z.array(SkillRatingSchema).min(1),
  achievements: z.array(z.string()).optional(),
  projectReference: z.string().url().optional(),
  relatedTestimonial: z.string().optional(),
});

export const TestimonialSchema = z.object({
  slug: z.string().min(1).max(100),
  screenshot: z.string(),
  authorName: z.string().min(1).max(100),
  authorRole: z.string().min(1).max(150),
  authorCompany: z.string().min(1).max(150),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  textContent: z.string().min(1), // For Schema.org SEO - not rendered
  relatedProject: z.string().optional(),
});

export const BlogSchema = z.object({
  slug: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  publishDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updatedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  seoDescription: z.string().min(50).max(160),
  coverImage: z.string().optional(),
  category: BlogCategoryEnum,
  tags: z.array(z.string()).min(1).max(10),
  series: SeriesSchema.optional(),
  status: BlogStatusEnum.default('draft'),
  readingTime: z.number().int().positive().optional(),
});

// ============================================================
// JSON-LD SCHEMAS (Schema.org)
// ============================================================

export const PersonJsonLdSchema = z.object({
  '@context': z.literal('https://schema.org'),
  '@type': z.literal('Person'),
  name: z.string(),
  jobTitle: z.string(),
  description: z.string(),
  email: z.string().email(),
  telephone: z.string().optional(),
  image: z.string().url().optional(),
  url: z.string().url(),
  sameAs: z.array(z.string().url()),
  address: z.object({
    '@type': z.literal('PostalAddress'),
    addressLocality: z.string(),
    addressCountry: z.string(),
  }),
  makesOffer: z.array(z.object({
    '@type': z.literal('Offer'),
    itemOffered: z.object({
      '@type': z.literal('Service'),
      name: z.string(),
    }),
  })),
  hasCredential: z.array(z.object({
    '@type': z.literal('EducationalOccupationalCredential'),
    name: z.string(),
    credentialCategory: z.string().optional(),
  })).optional(),
  endorsement: z.array(z.object({
    '@type': z.literal('Review'),
    author: z.object({
      '@type': z.literal('Person'),
      name: z.string(),
      jobTitle: z.string().optional(),
    }),
    reviewBody: z.string(),
    datePublished: z.string(),
  })).optional(),
});

export const BlogPostJsonLdSchema = z.object({
  '@context': z.literal('https://schema.org'),
  '@type': z.literal('BlogPosting'),
  headline: z.string(),
  description: z.string(),
  datePublished: z.string(),
  dateModified: z.string().optional(),
  author: z.object({
    '@type': z.literal('Person'),
    name: z.string(),
    url: z.string().url(),
  }),
  image: z.string().url().optional(),
  publisher: z.object({
    '@type': z.literal('Person'),
    name: z.string(),
    url: z.string().url(),
  }),
  mainEntityOfPage: z.object({
    '@type': z.literal('WebPage'),
    '@id': z.string().url(),
  }),
  keywords: z.string().optional(),
  articleSection: z.string().optional(),
});

// ============================================================
// TYPE EXPORTS
// ============================================================

export type AvailabilityStatus = z.infer<typeof AvailabilityStatusEnum>;
export type OpenTo = z.infer<typeof OpenToEnum>;
export type WorkMode = z.infer<typeof WorkModeEnum>;
export type EngagementType = z.infer<typeof EngagementTypeEnum>;
export type AspirationTimeline = z.infer<typeof AspirationTimelineEnum>;
export type BlogCategory = z.infer<typeof BlogCategoryEnum>;
export type BlogStatus = z.infer<typeof BlogStatusEnum>;

export type SocialLinks = z.infer<typeof SocialLinksSchema>;
export type Aspiration = z.infer<typeof AspirationSchema>;
export type SkillRating = z.infer<typeof SkillRatingSchema>;
export type Series = z.infer<typeof SeriesSchema>;

export type Profile = z.infer<typeof ProfileSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Testimonial = z.infer<typeof TestimonialSchema>;
export type Blog = z.infer<typeof BlogSchema>;

export type PersonJsonLd = z.infer<typeof PersonJsonLdSchema>;
export type BlogPostJsonLd = z.infer<typeof BlogPostJsonLdSchema>;
