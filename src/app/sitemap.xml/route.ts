import { BASE_URL, buildSitemapIndexXml } from '@/lib/sitemap-builder'

export const revalidate = 21600

export async function GET() {
  const sitemaps = [
    `${BASE_URL}/sitemap-general.xml`,
    `${BASE_URL}/sitemap-blogs.xml`,
    `${BASE_URL}/sitemap-seo-pages.xml`,
  ]

  const xml = buildSitemapIndexXml(sitemaps)

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=21600, s-maxage=21600',
    },
  })
}
