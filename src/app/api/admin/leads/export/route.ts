import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getActingUser, LEAD_READ_ROLES } from '@/lib/auth-guard'
import { z } from 'zod'

const StatusSchema = z.enum(['new', 'contacted', 'in_progress', 'converted', 'closed'])

// Neutralise spreadsheet formula injection. `name` and `message` come from the
// public contact form, and this CSV is opened in Excel/Sheets by staff — a value
// beginning with = + - @ (or a leading tab/CR, which those apps strip) would
// otherwise be evaluated as a formula. Prefixing with a single quote forces text.
function csvCell(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value)
  const safe = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str
  return `"${safe.replace(/"/g, '""')}"`
}

export async function GET(req: NextRequest) {
  try {
    const acting = await getActingUser()
    if (!acting) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!LEAD_READ_ROLES.includes(acting.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const url = new URL(req.url)
    const rawStatus = url.searchParams.get('status')
    const parsedStatus = rawStatus ? StatusSchema.safeParse(rawStatus) : null
    const status = parsedStatus?.success ? parsedStatus.data : null

    const client = createServiceClient()
    let query = client.from('form_submissions').select('*').order('created_at', { ascending: false })
    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const rows = (data ?? [])
    const headers = ['id', 'name', 'phone', 'email', 'status', 'message', 'source_url', 'created_at']
    const csv = [
      headers.join(','),
      ...rows.map(r =>
        headers.map(h => csvCell((r as Record<string, unknown>)[h])).join(',')
      ),
    ].join('\n')

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (err) {
    console.error('GET /api/admin/leads/export:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
