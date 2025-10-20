/**
 * Generate sitemap.xml from WordPress REST API
 *
 * Env vars (optional):
 * - SITE_URL: Base site URL to prefix each <loc> (default: https://blogs.writtenlyhub.com)
 * - WP_API_BASE_URL: WordPress API base (default: https://www.writtenlyhub.com/wp-json/wp/v2)
 */
import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios';

const SITE_URL = (process.env.SITE_URL || 'https://blogs.writtenlyhub.com').replace(/\/$/, '');
const WP_API_BASE_URL = (process.env.WP_API_BASE_URL || 'https://www.writtenlyhub.com/wp-json/wp/v2').replace(/\/$/, '');

const PER_PAGE = 100;

async function fetchAll(endpoint, params = {}) {
  let page = 1;
  let results = [];
  while (true) {
    const url = `${WP_API_BASE_URL}${endpoint}`;
    const res = await axios.get(url, {
      params: { per_page: PER_PAGE, page, ...params },
      validateStatus: s => s >= 200 && s < 300 || s === 400, // WP returns 400 for out-of-range pages
    });

    if (res.status !== 200) break;
    const data = res.data || [];
    results = results.concat(data);

    const totalPages = Number(res.headers['x-wp-totalpages'] || 0) || (data.length < PER_PAGE ? page : page + 1);
    if (page >= totalPages || data.length === 0) break;
    page += 1;
  }
  return results;
}

function xmlEscape(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDateISO(dateStr) {
  try {
    return new Date(dateStr).toISOString().slice(0, 10); // YYYY-MM-DD
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

async function buildSitemap() {
  console.log('[sitemap] Generating sitemap.xml');

  // Fetch published posts with embeds for potential future use
  const posts = await fetchAll('/posts', { status: 'publish', _embed: true });

  // Base routes for the SPA
  const urls = [
    {
      loc: `${SITE_URL}/`,
      lastmod: formatDateISO(new Date().toISOString()),
      changefreq: 'daily',
      priority: '0.8',
    },
  ];

  for (const p of posts) {
    const slug = p.slug || '';
    if (!slug) continue;

    const url = `${SITE_URL}/${xmlEscape(slug)}`;
    urls.push({
      loc: url,
      lastmod: formatDateISO(p.modified_gmt || p.modified || p.date_gmt || p.date || new Date().toISOString()),
      changefreq: 'monthly',
      priority: '0.6',
    });
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(u =>
      [
        '  <url>',
        `    <loc>${xmlEscape(u.loc)}</loc>`,
        `    <lastmod>${xmlEscape(u.lastmod)}</lastmod>`,
        `    <changefreq>${u.changefreq}</changefreq>`,
        `    <priority>${u.priority}</priority>`,
        '  </url>',
      ].join('\n')
    ),
    '</urlset>',
    '',
  ].join('\n');

  const outPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(outPath, xml, 'utf-8');
  console.log(`[sitemap] Wrote ${urls.length} URLs to ${outPath}`);
}

buildSitemap().catch(err => {
  console.error('[sitemap] Failed to generate sitemap:', err?.message || err);
  process.exit(1);
});
