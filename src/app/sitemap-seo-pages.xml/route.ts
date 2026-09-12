import { NextRequest } from 'next/server'
import { getSeoPagesSitemapUrls, buildCategorySitemapResponse } from '@/lib/sitemap-builder'

export const revalidate = 21600

export async function GET(req: NextRequest) {
  return buildCategorySitemapResponse(req, 'sitemap-seo-pages.xml', getSeoPagesSitemapUrls)
}
