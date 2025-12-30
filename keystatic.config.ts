import { config, fields, collection, singleton } from '@keystatic/core';

// ============================================================
// KEYSTATIC CONFIG: The "Digital Twin" Data Schema
// Capturing the full depth of a 16+ year career
// ============================================================

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: {
      name: 'Shreyans Bhatt Portfolio',
    },
    navigation: {
      'Identity': ['profile'],
      'Career': ['projects'],
      'Social Proof': ['testimonials'],
      'Content': ['blogs'],
    },
  },

  singletons: {
    // ============================================================
    // PROFILE SINGLETON: The "Core Identity" Micro-Service
    // ============================================================
    profile: singleton({
      label: 'Profile',
      path: 'src/content/profile/main',
      entryLayout: 'form',
      format: { data: 'json' },
      schema: {
        // Basic Info
        name: fields.text({
          label: 'Full Name',
          validation: { isRequired: true, length: { min: 1, max: 100 } },
        }),
        title: fields.text({
          label: 'Professional Title',
          description: 'e.g., "Principal Solution Architect"',
          validation: { isRequired: true, length: { min: 1, max: 150 } },
        }),
        tagline: fields.text({
          label: 'Tagline',
          description: 'High-impact one-liner for the hero section',
          validation: { isRequired: true, length: { min: 1, max: 300 } },
          multiline: true,
        }),
        email: fields.text({
          label: 'Email',
          description: 'Will be obfuscated in frontend',
          validation: { isRequired: true },
        }),
        phone: fields.text({
          label: 'Phone',
          description: 'Optional - will be obfuscated',
        }),
        avatarImage: fields.image({
          label: 'Avatar Image',
          directory: 'public/images/profile',
          publicPath: '/images/profile',
        }),
        location: fields.text({
          label: 'Location',
          description: 'City, Country',
          validation: { isRequired: true, length: { min: 1, max: 100 } },
        }),
        timezone: fields.text({
          label: 'Timezone',
          description: 'e.g., "UTC+5:30" - Essential for remote/async work',
          validation: { isRequired: true, length: { min: 1, max: 50 } },
        }),

        // Availability Status - Drives global beacon
        availabilityStatus: fields.select({
          label: 'Availability Status',
          description: 'Drives the global status beacon',
          options: [
            { label: '🟢 Available', value: 'Available' },
            { label: '🟡 Open to Discuss', value: 'Open to Discuss' },
            { label: '🔴 Busy', value: 'Busy' },
          ],
          defaultValue: 'Open to Discuss',
        }),

        // Open To - Multi-select for Schema.org makesOffer
        openTo: fields.multiselect({
          label: 'Open To',
          description: 'Types of engagements you are seeking',
          options: [
            { label: 'Full-time', value: 'Full-time' },
            { label: 'Contract', value: 'Contract' },
            { label: 'Freelance', value: 'Freelance' },
            { label: 'Advisory', value: 'Advisory' },
          ],
        }),

        // Work Modes
        workModes: fields.multiselect({
          label: 'Preferred Work Modes',
          options: [
            { label: 'Remote', value: 'Remote' },
            { label: 'Hybrid', value: 'Hybrid' },
            { label: 'Onsite', value: 'Onsite' },
          ],
        }),

        // Social Links
        socialLinks: fields.object({
          linkedin: fields.url({ label: 'LinkedIn URL' }),
          github: fields.url({ label: 'GitHub URL' }),
          twitter: fields.url({ label: 'Twitter/X URL' }),
          medium: fields.url({ label: 'Medium URL' }),
        }, {
          label: 'Social Links',
          description: 'Where Recruiters/CTOs live',
        }),

        // Aspirations - Structured goals
        aspirations: fields.array(
          fields.object({
            goal: fields.text({
              label: 'Goal',
              validation: { isRequired: true, length: { min: 1, max: 200 } },
            }),
            timeline: fields.select({
              label: 'Timeline',
              description: 'Immediate = Learning now, Strategic = 1-3 years, Visionary = Long-term',
              options: [
                { label: 'Immediate', value: 'Immediate' },
                { label: 'Strategic', value: 'Strategic' },
                { label: 'Visionary', value: 'Visionary' },
              ],
              defaultValue: 'Strategic',
            }),
            icon: fields.text({
              label: 'Icon (Optional)',
              description: 'Emoji or icon name',
            }),
          }),
          {
            label: 'Aspirations',
            description: 'Career goals with timeline classification',
            itemLabel: (props) => props.fields.goal.value || 'New Aspiration',
          }
        ),

        // Extended Bio
        bio: fields.document({
          label: 'Full Bio',
          description: 'Extended biography in MDX format',
          formatting: true,
          links: true,
        }),
      },
    }),
  },

  collections: {
    // ============================================================
    // PROJECTS COLLECTION: The "Evidence Locker"
    // ============================================================
    projects: collection({
      label: 'Projects',
      path: 'src/content/projects/*',
      slugField: 'slug',
      format: { data: 'json' },
      entryLayout: 'form',
      columns: ['clientName', 'role', 'startDate', 'isFeatured'],
      schema: {
        slug: fields.slug({
          name: { label: 'URL Slug' },
        }),

        // Meta Information
        clientName: fields.text({
          label: 'Client/Company Name',
          description: 'Actual client name (will be masked if confidential)',
          validation: { isRequired: true, length: { min: 1, max: 150 } },
        }),
        displayName: fields.text({
          label: 'Display Name (Optional)',
          description: 'Override name for confidential projects, e.g., "Global Financial Services Client"',
        }),
        role: fields.text({
          label: 'Your Role',
          validation: { isRequired: true, length: { min: 1, max: 100 } },
        }),
        startDate: fields.text({
          label: 'Start Date',
          description: 'Format: YYYY-MM',
          validation: { isRequired: true },
        }),
        endDate: fields.text({
          label: 'End Date',
          description: 'Format: YYYY-MM or "Present"',
          validation: { isRequired: true },
        }),

        // Engagement Details
        engagementType: fields.select({
          label: 'Engagement Type',
          options: [
            { label: 'Permanent', value: 'Permanent' },
            { label: 'Contract', value: 'Contract' },
          ],
          defaultValue: 'Permanent',
        }),
        workMode: fields.select({
          label: 'Work Mode',
          options: [
            { label: 'Remote', value: 'Remote' },
            { label: 'Hybrid', value: 'Hybrid' },
            { label: 'Onsite', value: 'Onsite' },
          ],
          defaultValue: 'Hybrid',
        }),
        teamSize: fields.integer({
          label: 'Team Size',
          description: 'Number of people on the team',
          validation: { min: 1 },
        }),
        location: fields.text({
          label: 'Location',
          description: 'City, Country',
        }),

        // Visibility Controls
        isConfidential: fields.checkbox({
          label: 'Confidential Project',
          description: 'If checked, displayName will be used and client name masked in Schema.org',
          defaultValue: false,
        }),
        isFeatured: fields.checkbox({
          label: 'Featured on Homepage',
          description: 'Show this project in the hero section',
          defaultValue: false,
        }),
        isDraft: fields.checkbox({
          label: 'Draft',
          description: 'Hide from public view',
          defaultValue: false,
        }),

        // Company Context
        companyDescription: fields.text({
          label: 'Company Description',
          description: 'Brief description of the client company',
          multiline: true,
        }),

        // Deep Dive: Technical
        techStack: fields.array(
          fields.text({ label: 'Technology' }),
          {
            label: 'Tech Stack',
            description: 'Technologies used in this project',
            itemLabel: (props) => props.value || 'Technology',
          }
        ),

        // Deep Dive: Skills with Project-Specific Ratings
        skills: fields.array(
          fields.object({
            name: fields.text({
              label: 'Skill Name',
              validation: { isRequired: true },
            }),
            rating: fields.integer({
              label: 'Proficiency (0-10)',
              description: 'How deeply you used this skill IN THIS PROJECT',
              validation: { isRequired: true, min: 0, max: 10 },
            }),
          }),
          {
            label: 'Skills Applied',
            description: 'Skills with project-specific proficiency ratings (not general expertise)',
            itemLabel: (props) => `${props.fields.name.value || 'Skill'} (${props.fields.rating.value || 0}/10)`,
          }
        ),

        // Achievements
        achievements: fields.array(
          fields.text({ label: 'Achievement', multiline: true }),
          {
            label: 'Key Achievements',
            description: 'Bullet points of impact and accomplishments',
            itemLabel: (props) => props.value?.slice(0, 50) + '...' || 'Achievement',
          }
        ),

        // Deep Dive: Impact (MDX)
        impact: fields.document({
          label: 'Project Impact',
          description: 'Detailed description of project impact in MDX format',
          formatting: true,
          links: true,
        }),

        // References
        projectReference: fields.url({
          label: 'Project Reference URL',
          description: 'Link to public project, product, or case study',
        }),
        relatedTestimonial: fields.relationship({
          label: 'Related Testimonial',
          description: 'Link to a testimonial about this project',
          collection: 'testimonials',
        }),
      },
    }),

    // ============================================================
    // TESTIMONIALS COLLECTION: Social Proof Engine
    // ============================================================
    testimonials: collection({
      label: 'Testimonials',
      path: 'src/content/testimonials/*',
      slugField: 'slug',
      format: { data: 'json' },
      entryLayout: 'form',
      columns: ['authorName', 'authorCompany', 'date'],
      schema: {
        slug: fields.slug({
          name: { label: 'URL Slug' },
        }),

        // Visual Proof
        screenshot: fields.image({
          label: 'LinkedIn Recommendation Screenshot',
          description: 'Upload the screenshot of the LinkedIn recommendation',
          directory: 'public/images/testimonials',
          publicPath: '/images/testimonials',
          validation: { isRequired: true },
        }),

        // Meta Information
        authorName: fields.text({
          label: 'Author Name',
          validation: { isRequired: true, length: { min: 1, max: 100 } },
        }),
        authorRole: fields.text({
          label: 'Author Role/Title',
          validation: { isRequired: true, length: { min: 1, max: 150 } },
        }),
        authorCompany: fields.text({
          label: 'Author Company',
          validation: { isRequired: true, length: { min: 1, max: 150 } },
        }),
        date: fields.date({
          label: 'Recommendation Date',
          validation: { isRequired: true },
        }),

        // SEO Layer - NOT for UI, but for Schema.org
        textContent: fields.text({
          label: 'Text Content (SEO Only)',
          description: 'CRITICAL: Transcribe the screenshot text here for Schema.org reviewBody. This is NOT displayed in UI but allows search engines to read the image content.',
          validation: { isRequired: true },
          multiline: true,
        }),

        // Relationship
        relatedProject: fields.relationship({
          label: 'Related Project',
          description: 'The project this testimonial refers to',
          collection: 'projects',
        }),
      },
    }),

    // ============================================================
    // BLOGS COLLECTION: Thought Leadership Engine
    // ============================================================
    blogs: collection({
      label: 'Blog Posts',
      path: 'src/content/blogs/*',
      slugField: 'slug',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'category', 'status', 'publishDate'],
      schema: {
        slug: fields.slug({
          name: { label: 'URL Slug' },
        }),
        title: fields.text({
          label: 'Title',
          validation: { isRequired: true, length: { min: 1, max: 200 } },
        }),
        publishDate: fields.date({
          label: 'Publish Date',
          validation: { isRequired: true },
        }),
        updatedDate: fields.date({
          label: 'Last Updated',
          description: 'Critical for SEO freshness signals',
        }),
        seoDescription: fields.text({
          label: 'SEO Description',
          description: 'Meta description (50-160 characters)',
          validation: { isRequired: true, length: { min: 50, max: 160 } },
        }),
        coverImage: fields.image({
          label: 'Cover Image',
          directory: 'public/images/blog',
          publicPath: '/images/blog',
        }),

        // Taxonomy
        category: fields.select({
          label: 'Category',
          description: 'Primary category (rigid enum)',
          options: [
            { label: 'AI Engineering', value: 'AI Engineering' },
            { label: 'Offensive Security', value: 'Offensive Security' },
            { label: 'System Design', value: 'System Design' },
            { label: 'Leadership', value: 'Leadership' },
          ],
          defaultValue: 'System Design',
        }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            description: 'Flexible tags for granular topics (RAG, Zero Trust, NextJS, etc.)',
            itemLabel: (props) => props.value || 'Tag',
          }
        ),

        // Series Support
        series: fields.conditional(
          fields.checkbox({
            label: 'Part of a Series',
            defaultValue: false,
          }),
          {
            true: fields.object({
              seriesName: fields.text({
                label: 'Series Name',
                validation: { isRequired: true },
              }),
              partNumber: fields.integer({
                label: 'Part Number',
                validation: { isRequired: true, min: 1 },
              }),
            }),
            false: fields.empty(),
          }
        ),

        // Status
        status: fields.select({
          label: 'Status',
          options: [
            { label: '📝 Draft', value: 'draft' },
            { label: '✅ Published', value: 'published' },
            { label: '📦 Archived', value: 'archived' },
          ],
          defaultValue: 'draft',
        }),

        // Content (MDX)
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'public/images/blog',
            publicPath: '/images/blog',
          },
          tables: true,
        }),
      },
    }),
  },
});
