import { NextResponse } from 'next/server'
import { getActingUser } from '@/lib/auth-guard'
import { SEO_ROLES } from '@/lib/seo-route'
import { getSeoHealth } from '@/lib/seo-health'

// SEO health metrics across every published CMS page. Available to every role
// that can edit SEO (including seo_editor).
export async function GET() {
  try {
    const acting = await getActingUser()
    if (!acting) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!SEO_ROLES.includes(acting.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    return NextResponse.json(await getSeoHealth())
  } catch (err) {
    console.error('GET /api/admin/seo/health:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
