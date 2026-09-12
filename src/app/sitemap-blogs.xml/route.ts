import { NextRequest } from 'next/server'
import { getBlogsSitemapUrls, buildCategorySitemapResponse } from '@/lib/sitemap-builder'

export const revalidate = 21600

export async function GET(req: NextRequest) {
  return buildCategorySitemapResponse(req, 'sitemap-blogs.xml', getBlogsSitemapUrls)
}
