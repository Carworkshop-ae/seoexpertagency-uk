import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getActingUser } from '@/lib/auth-guard'
import { logAudit } from '@/lib/audit'
import { generateSlug } from '@/lib/page-engine/slugify'

// Clones an SEO page as a starting point for a new one. Always lands as a
// draft — publishing a duplicate automatically would put two pages with
// near-identical content live at once.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const acting = await getActingUser()
    if (!acting) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const service = createServiceClient()
    const { data: source, error: fetchError } = await service.from('seo_pages').select('*').eq('id', id).maybeSingle()
    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })
    if (!source) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const headline = source.headline ? `${source.headline} (Copy)` : 'Untitled Page (Copy)'
    // A short random suffix avoids a retry loop on a slug collision — the
    // admin can rename the slug to something cleaner from the edit screen.
    const slug = `${generateSlug(headline)}-${Math.random().toString(36).slice(2, 7)}`

    const { data, error } = await service
      .from('seo_pages')
      .insert({
        headline,
        slug,
        subheadline: source.subheadline,
        overview: source.overview,
        why_choose_us_heading: source.why_choose_us_heading,
        why_choose_us_json: source.why_choose_us_json,
        faq_json: source.faq_json,
        seo_json: source.seo_json,
        seo_title: source.seo_title,
        seo_description: source.seo_description,
        meta_keyword: source.meta_keyword,
        og_image_url: source.og_image_url,
        sort_order: source.sort_order,
        status: 'draft',
        created_by: acting.id,
      } as never)
      .select('id')
      .single()

    if (error || !data) return NextResponse.json({ error: error?.message ?? 'Duplicate failed' }, { status: 500 })

    const row = data as { id: string }
    await logAudit({ userId: acting.id, action: 'create', table: 'seo_pages', recordId: row.id })
    return NextResponse.json({ success: true, id: row.id }, { status: 201 })
  } catch (err) {
    console.error('POST /api/admin/seo-pages/[id]/duplicate:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
