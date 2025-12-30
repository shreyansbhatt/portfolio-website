# Shreyans Bhatt Portfolio

High-performance portfolio and blog system built with modern web technologies, optimized for showcasing 16+ years of enterprise architecture expertise.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Pages                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Static     │  │  Serverless │  │  Cloudflare         │  │
│  │  Assets     │  │  Functions  │  │  Web Analytics      │  │
│  │  (HTML/CSS) │  │  (Contact)  │  │  (Privacy-first)    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────┴───────────────────────────────┐
│                      Astro 5.0                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Hybrid Rendering: Static + SSR where needed         │   │
│  │  • Home/Blog/Projects: prerender = true (Static)     │   │
│  │  • Contact API: prerender = false (Serverless)       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────┴───────────────────────────────┐
│                    Keystatic CMS                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Profile    │  │   Projects   │  │  Testimonials    │   │
│  │  (Singleton) │  │ (Collection) │  │  (Collection)    │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                Blog Posts (MDX)                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Astro 5.0 | Static-first, hybrid rendering |
| **CMS** | Keystatic | Git-based, type-safe content |
| **Styling** | Tailwind CSS v4 | Zero-runtime, @theme variables |
| **Deployment** | Cloudflare Pages | Edge-first, global CDN |
| **Analytics** | Cloudflare Web Analytics | Privacy-first, no cookies |

## 📁 Project Structure

```
├── src/
│   ├── components/          # Astro components
│   │   ├── HeroSection.astro
│   │   ├── ExperienceSection.astro
│   │   ├── SkillsSection.astro
│   │   ├── TestimonialsSection.astro
│   │   └── ...
│   ├── content/             # Keystatic content (JSON)
│   │   ├── profile/main.json
│   │   ├── projects/*.json
│   │   ├── testimonials/*.json
│   │   └── blogs/
│   ├── layouts/
│   │   └── Layout.astro     # Base layout with JSON-LD
│   ├── lib/
│   │   ├── schemas.ts       # Zod schemas for validation
│   │   └── utils.ts         # Helper functions
│   ├── pages/
│   │   ├── index.astro      # Portfolio homepage
│   │   ├── blog/            # Blog pages
│   │   ├── api/contact.ts   # Contact form endpoint
│   │   └── keystatic/       # CMS admin routes
│   └── styles/
│       └── global.css       # Tailwind v4 theme
├── public/                  # Static assets
├── keystatic.config.ts      # CMS schema definition
└── astro.config.mjs         # Astro configuration
```

## 🎨 Design System

### Colors (Dark Mode Only)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-abyss` | `#0a192f` | Primary background |
| `--color-cyan-glow` | `#64ffda` | AI/Architecture accent |
| `--color-crimson` | `#ff4d4d` | Security/Cyber accent |
| `--color-text-primary` | `#e2e8f0` | Body text |

### Typography

- **Display**: JetBrains Mono (terminal aesthetic)
- **Body**: Inter (clean readability)

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access CMS admin
npm run keystatic
# → http://localhost:4321/keystatic

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Content Management

### Adding a Project

1. Open Keystatic admin: `http://localhost:4321/keystatic`
2. Navigate to Projects → Create
3. Fill in:
   - Client name and role
   - Date range (YYYY-MM format)
   - Tech stack (array)
   - Skills with **project-specific ratings** (0-10)
   - Achievements (bullet points)

### Skill Rating Guide

| Rating | Level | Description |
|--------|-------|-------------|
| 9-10 | Expert | Primary tech, architectural decisions, mentoring |
| 7-8 | Advanced | Deep implementation, complex features |
| 5-6 | Intermediate | Standard usage, moderate depth |
| 3-4 | Basic | Supporting tech, light usage |
| 1-2 | Awareness | Minimal exposure |

### Adding a Testimonial

1. Screenshot LinkedIn recommendation
2. Save to `public/images/testimonials/`
3. Create entry with:
   - Screenshot image path
   - Author details
   - **Text transcription for SEO** (Schema.org reviewBody)

## 🔍 SEO Features

- **JSON-LD Structured Data**:
  - Person schema with `makesOffer` for availability
  - BlogPosting schema for articles
  - Review schema from testimonials
- **Open Graph & Twitter Cards**
- **Sitemap** (auto-generated)
- **Robots.txt** configuration

## 🚢 Deployment

### Cloudflare Pages

1. Connect repository to Cloudflare Pages
2. Configure build:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Set environment variables (if needed)
4. Deploy

### Environment Variables

```env
# Optional: Cloudflare Web Analytics
CF_ANALYTICS_TOKEN=your-token

# Optional: Contact form email service
RESEND_API_KEY=your-api-key
```

## 📝 Content Seeding

To populate with resume data:

1. Review `/src/pages/admin/ingest-prompt.txt`
2. Use the meta-prompt with an LLM to extract data
3. Generate JSON files matching Keystatic schema
4. Validate in CMS admin

## 🧪 Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 95+ |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Time to Interactive | < 3.5s |

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

Built with 🛡️ by Shreyans Bhatt | [LinkedIn](https://linkedin.com/in/shreyans-bhatt) | [GitHub](https://github.com/shreyansbhatt)
