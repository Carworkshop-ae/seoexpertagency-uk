import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getProjects } from '@/lib/data/content'

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/^["']|["']$/g, '').trim()
export const BASE_URL = rawSiteUrl && rawSiteUrl.startsWith('http') ? rawSiteUrl : 'https://seoexpertagency.co.uk'
export const MAX_SITEMAP_URLS = 10000

export interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: string
  priority?: number
}

export function buildSitemapXml(urls: SitemapUrl[]): string {
  const entries = urls.map(u => {
    let item = `  <url>\n    <loc>${escapeXml(u.loc)}</loc>`
    if (u.lastmod) item += `\n    <lastmod>${u.lastmod}</lastmod>`
    if (u.changefreq) item += `\n    <changefreq>${u.changefreq}</changefreq>`
    if (typeof u.priority === 'number') item += `\n    <priority>${u.priority.toFixed(1)}</priority>`
    item += `\n  </url>`
    return item
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`
}

export function buildSitemapIndexXml(sitemaps: string[]): string {
  const now = new Date().toISOString()
  const entries = sitemaps.map(loc =>
    `  <sitemap>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`
  ).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

const SITEMAP_HEADERS = {
  'Content-Type': 'application/xml',
  'Cache-Control': 'public, max-age=21600, s-maxage=21600',
}

export async function buildCategorySitemapResponse(req: NextRequest, sitemapName: string, getUrls: () => Promise<SitemapUrl[]>): Promise<Response> {
  const urls = await getUrls()
  const pageParam = req.nextUrl.searchParams.get('page')

  if (urls.length <= MAX_SITEMAP_URLS && !pageParam) {
    return new Response(buildSitemapXml(urls), { headers: SITEMAP_HEADERS })
  }

  const pages = chunk(urls, MAX_SITEMAP_URLS)

  if (pageParam) {
    const idx = parseInt(pageParam, 10) - 1
    const page = pages[idx] ?? []
    return new Response(buildSitemapXml(page), { headers: SITEMAP_HEADERS })
  }

  const sitemaps = pages.map((_, i) => `${BASE_URL}/${sitemapName}?page=${i + 1}`)
  return new Response(buildSitemapIndexXml(sitemaps), { headers: SITEMAP_HEADERS })
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}

export async function getGeneralSitemapUrls(): Promise<SitemapUrl[]> {
  // Reads published CMS rows, falling back to the static catalogue when the
  // tables are empty — so the sitemap always matches what the site renders.
  const SEO_PROJECTS = await getProjects()

  const now = new Date().toISOString()
  const urls: SitemapUrl[] = [
    { loc: BASE_URL, lastmod: now, changefreq: 'weekly', priority: 1.0 },
    { loc: `${BASE_URL}/about`, lastmod: now, changefreq: 'monthly', priority: 0.8 },
    { loc: `${BASE_URL}/pricing`, lastmod: now, changefreq: 'weekly', priority: 0.9 },
    { loc: `${BASE_URL}/projects`, lastmod: now, changefreq: 'weekly', priority: 0.9 },
    { loc: `${BASE_URL}/faq`, lastmod: now, changefreq: 'monthly', priority: 0.6 },
    { loc: `${BASE_URL}/contact`, lastmod: now, changefreq: 'monthly', priority: 0.8 },
    { loc: `${BASE_URL}/privacy`, lastmod: now, changefreq: 'yearly', priority: 0.3 },
    { loc: `${BASE_URL}/terms`, lastmod: now, changefreq: 'yearly', priority: 0.3 },
  ]

  // Add all projects
  for (const p of SEO_PROJECTS) {
    urls.push({
      loc: `${BASE_URL}/projects/${p.slug}`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.8,
    })
  }

  return urls
}

export async function getBlogsSitemapUrls(): Promise<SitemapUrl[]> {
  const urls: SitemapUrl[] = [
    { loc: `${BASE_URL}/blog`, lastmod: new Date().toISOString(), changefreq: 'daily', priority: 0.8 },
  ]

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return urls

  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false })

    if (data) {
      for (const post of data) {
        urls.push({
          loc: `${BASE_URL}/blog/${post.slug}`,
          lastmod: new Date(post.updated_at).toISOString(),
          changefreq: 'monthly',
          priority: 0.7,
        })
      }
    }
  } catch {
    // Fallback gracefully
  }

  return urls
}

export async function getSeoPagesSitemapUrls(): Promise<SitemapUrl[]> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return []

  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('seo_pages')
      .select('slug, updated_at')
      .eq('status', 'published')

    return (data ?? []).map(p => ({
      loc: `${BASE_URL}/${p.slug}`,
      lastmod: new Date(p.updated_at).toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
    }))
  } catch {
    return []
  }
}
