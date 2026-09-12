import { NextResponse } from 'next/server'
import { getActingUser } from '@/lib/auth-guard'
import { createServiceClient } from '@/lib/supabase/service'

// List-only — packages are seeded once by migration and edited in place;
// there is no create endpoint since the 3 tiers are fixed (see
// supabase/migrations/006_packages.sql).
export async function GET() {
  try {
    const acting = await getActingUser()
    if (!acting) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const service = createServiceClient()
    const { data, error } = await service.from('packages').select('*').order('sort_order', { ascending: true })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ packages: data ?? [] })
  } catch (err) {
    console.error('GET /api/admin/packages:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
