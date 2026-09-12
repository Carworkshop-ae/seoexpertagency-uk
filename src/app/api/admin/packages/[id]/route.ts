import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getActingUser } from '@/lib/auth-guard'
import { createServiceClient } from '@/lib/supabase/service'
import { logAudit } from '@/lib/audit'
import { revalidatePage } from '@/lib/revalidate'

interface RouteContext {
  params: Promise<{ id: string }>
}

// GET/PATCH only — no DELETE, no create route alongside it. Tiers are fixed
// at exactly 3 (see supabase/migrations/006_packages.sql); this only ever
// edits an existing row's fields.
const UpdateSchema = z.object({
  name: z.string().min(1).max(60).trim().optional(),
  price: z.string().min(1).max(30).trim().optional(),
  billing_period: z.string().min(1).max(30).trim().optional(),
  description: z.string().max(500).trim().optional().nullable(),
  cta_label: z.string().max(60).trim().optional().nullable(),
  features_json: z.array(z.string().max(300)).max(20).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
})

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const acting = await getActingUser()
    if (!acting) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const service = createServiceClient()
    const { data, error } = await service.from('packages').select('*').eq('id', id).maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ package: data })
  } catch (err) {
    console.error('GET /api/admin/packages/[id]:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const acting = await getActingUser()
    if (!acting) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const rawBody = (await req.json()) as Record<string, unknown>
    const parsed = UpdateSchema.safeParse(rawBody)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    // Only touch keys the caller actually sent — same reasoning as the
    // generic content-api.ts PATCH: a schema-default must never silently
    // reset a field the caller didn't mean to change.
    const update: Record<string, unknown> = { ...parsed.data }
    for (const key of Object.keys(update)) {
      if (!(key in rawBody)) delete update[key]
    }
    update.updated_at = new Date().toISOString()

    const service = createServiceClient()
    const { data, error } = await service
      .from('packages')
      .update(update as never)
      .eq('id', id)
      .select('id, tier, status')
      .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await revalidatePage('package')
    await logAudit({ userId: acting.id, action: 'update', table: 'packages', recordId: id })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PATCH /api/admin/packages/[id]:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
