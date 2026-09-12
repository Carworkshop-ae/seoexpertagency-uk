import { NextRequest } from 'next/server'
import { getGeneralSitemapUrls, buildCategorySitemapResponse } from '@/lib/sitemap-builder'

export const revalidate = 21600

export async function GET(req: NextRequest) {
  return buildCategorySitemapResponse(req, 'sitemap-general.xml', getGeneralSitemapUrls)
}
