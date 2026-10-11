import type { APIRoute } from 'astro';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import { SITE_URL } from '@/lib/utils';

export const prerender = true;

export const GET: APIRoute = async () => {
  const reader = createReader(process.cwd(), keystaticConfig);
  const blogs = await reader.collections.blogs.all();

  const urls = [
    { loc: `${SITE_URL}/` },
    { loc: `${SITE_URL}/blog/` },
    ...blogs
      .filter((b) => b.entry.status === 'published')
      .map((b) => ({
        loc: `${SITE_URL}/blog/${b.slug}/`,
        lastmod: b.entry.updatedDate || b.entry.publishDate,
      })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `  <url><loc>${u.loc}</loc>${'lastmod' in u && u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`)
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
