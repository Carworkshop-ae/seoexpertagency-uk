import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getActingUser, LEAD_READ_ROLES, LEAD_DELETE_ROLES } from '@/lib/auth-guard'
import { z } from 'zod'
import { logAudit } from '@/lib/audit'

const UpdateLeadSchema = z.object({
  status: z.enum(['new', 'contacted', 'in_progress', 'converted', 'closed']).optional(),
  notes: z.string().max(5000).nullable().optional(),
}).refine(d => d.status !== undefined || d.notes !== undefined, { message: 'Nothing to update' })

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const acting = await getActingUser()
    if (!acting) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!LEAD_READ_ROLES.includes(acting.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body: unknown = await req.json()
    const parsed = UpdateLeadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const update: { status?: 'new' | 'contacted' | 'in_progress' | 'converted' | 'closed'; notes?: string | null } = {}
    if (parsed.data.status !== undefined) update.status = parsed.data.status
    if (parsed.data.notes !== undefined) update.notes = parsed.data.notes

    const client = createServiceClient()
    const { data, error } = await client.from('form_submissions').update(update).eq('id', id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await logAudit({ userId: acting.id, action: 'update', table: 'form_submissions', recordId: id })
    return NextResponse.json({ lead: data })
  } catch (err) {
    console.error('PATCH /api/admin/leads/[id]:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const acting = await getActingUser()
    if (!acting) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!LEAD_DELETE_ROLES.includes(acting.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const client = createServiceClient()
    const { error } = await client.from('form_submissions').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await logAudit({ userId: acting.id, action: 'delete', table: 'form_submissions', recordId: id })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/leads/[id]:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
