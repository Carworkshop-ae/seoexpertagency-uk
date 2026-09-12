import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getActingUser } from '@/lib/auth-guard'
import { logAudit } from '@/lib/audit'

// POST /api/admin/language-keys/generate-file — builds a {slug: value} map,
// stores it in website_settings (i18n_en) and returns it as a downloadable
// JSON payload. Serverless-safe (no filesystem writes).
export async function POST() {
  try {
    const acting = await getActingUser()
    if (!acting) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const service = createServiceClient()
    const { data, error } = await service
      .from('language_keys')
      .select('slug, value_en')
      .eq('is_published', true)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const en: Record<string, string> = {}
    for (const k of data ?? []) {
      en[k.slug] = k.value_en
    }

    const now = new Date().toISOString()
    await service.from('website_settings').upsert({ key: 'i18n_en', value: en, updated_at: now, updated_by: acting.id })

    await logAudit({ userId: acting.id, action: 'generate', table: 'language_keys', recordId: 'i18n', changes: { count: data?.length ?? 0 } })
    return NextResponse.json({ success: true, count: data?.length ?? 0, en })
  } catch (err) {
    console.error('POST /api/admin/language-keys/generate-file:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
