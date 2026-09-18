import { NextRequest, NextResponse } from 'next/server'
import type { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/service'
import { getActingUser } from '@/lib/auth-guard'
import { logAudit } from '@/lib/audit'
import { revalidatePage, type RevalidateType } from '@/lib/revalidate'
import { generateSlug } from '@/lib/page-engine/slugify'
import type { Json } from '@/types/database'
import type { ContentStatus } from '@/types'

// Shared CRUD for the four CMS-managed marketing content tables. They differ
// only in table name, validation schema and which paths a save invalidates, so
// the handlers are built once here rather than copied four times.
//
// Follows the same shape as the other admin routes: getActingUser() → Zod parse
// → service-role client → revalidate → audit.

export type ContentTable = 'services' | 'industries' | 'projects' | 'locations' | 'seo_pages'

export interface ContentResource<TCreate extends z.ZodTypeAny, TUpdate extends z.ZodTypeAny> {
  table: ContentTable
  /** Key under which the list endpoint returns rows, e.g. `services`. */
  collection: string
  revalidateAs: RevalidateType
  createSchema: TCreate
  updateSchema: TUpdate
  /** Columns returned by the list endpoint. */
  listColumns: string
  /** Column a blank slug is derived from, and that list search matches on. */
  titleColumn: 'name' | 'title' | 'headline'
  /** Set for resources with a `created_by` column — stamped from the acting
   * user on create. Not offered on update; a page's original author doesn't
   * change when someone else edits it. */
  tracksCreator?: boolean
}

type Row = Record<string, unknown>

function slugFrom(data: Row, titleColumn: string): string | undefined {
  const slug = data.slug
  if (typeof slug === 'string' && slug.trim()) return generateSlug(slug)
  const title = data[titleColumn]
  return typeof title === 'string' && title.trim() ? generateSlug(title) : undefined
}

export function listHandler(r: ContentResource<z.ZodTypeAny, z.ZodTypeAny>) {
  return async function GET(req: NextRequest) {
    try {
      const acting = await getActingUser()
      if (!acting) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

      const sp = req.nextUrl.searchParams
      const service = createServiceClient()
      let query = service.from(r.table).select(r.listColumns).order('sort_order', { ascending: true }).order('created_at', { ascending: true }).order('id', { ascending: true })

      const status = sp.get('status')
      if (status) query = query.eq('status', status as ContentStatus)
      if (sp.get('q')) query = query.ilike(r.titleColumn, `%${sp.get('q')!}%`)

      const { data, error } = await query.limit(500)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ [r.collection]: data })
    } catch (err) {
      console.error(`GET /api/admin/${r.table}:`, err)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}

export function createHandler(r: ContentResource<z.ZodTypeAny, z.ZodTypeAny>) {
  return async function POST(req: NextRequest) {
    try {
      const acting = await getActingUser()
      if (!acting) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

      const rawBody = (await req.json()) as Row
      const parsed = r.createSchema.safeParse(rawBody)
      if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten().fieldErrors }, { status: 400 })
      }

      const payload = parsed.data as Row
      const slug = slugFrom(payload, r.titleColumn)
      if (!slug) return NextResponse.json({ error: 'A slug or title is required' }, { status: 400 })

      const service = createServiceClient()

      // The schema defaults sort_order to 0, so every row created without an
      // explicit position would tie at 0. Append new rows after the last one.
      if (!('sort_order' in rawBody)) {
        const { data: last } = await service
          .from(r.table)
          .select('sort_order')
          .order('sort_order', { ascending: false })
          .limit(1)
          .maybeSingle()
        payload.sort_order = ((last as { sort_order?: number } | null)?.sort_order ?? -1) + 1
      }
      const { data, error } = await service
        .from(r.table)
        .insert({ ...payload, slug, ...(r.tracksCreator ? { created_by: acting.id } : {}) } as never)
        .select('id, slug, status')
        .single()

      // 23505 = unique_violation; the only realistic collision here is the slug.
      if (error?.code === '23505') {
        return NextResponse.json({ error: `The slug "${slug}" is already in use` }, { status: 409 })
      }
      if (error || !data) return NextResponse.json({ error: error?.message ?? 'Create failed' }, { status: 500 })

      const row = data as { id: string; slug: string; status: string }
      if (row.status === 'published') await revalidatePage(r.revalidateAs, row.slug)
      await logAudit({ userId: acting.id, action: 'create', table: r.table, recordId: row.id })
      return NextResponse.json({ success: true, id: row.id, slug: row.slug }, { status: 201 })
    } catch (err) {
      console.error(`POST /api/admin/${r.table}:`, err)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}

export function detailHandlers(r: ContentResource<z.ZodTypeAny, z.ZodTypeAny>) {
  type Ctx = { params: Promise<{ id: string }> }

  async function GET(_req: NextRequest, { params }: Ctx) {
    try {
      const acting = await getActingUser()
      if (!acting) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

      const { id } = await params
      const service = createServiceClient()
      const { data, error } = await service.from(r.table).select('*').eq('id', id).maybeSingle()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json({ [r.collection.replace(/ies$/, 'y').replace(/s$/, '')]: data })
    } catch (err) {
      console.error(`GET /api/admin/${r.table}/[id]:`, err)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }

  async function PATCH(req: NextRequest, { params }: Ctx) {
    try {
      const acting = await getActingUser()
      if (!acting) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

      const { id } = await params
      const rawBody = (await req.json()) as Row
      const parsed = r.updateSchema.safeParse(rawBody)
      if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten().fieldErrors }, { status: 400 })
      }

      const payload = parsed.data as Row
      // The create/update schemas share field definitions that carry
      // `.default(...)` (status, sort_order, every *_json array). Zod applies
      // those defaults for a key that is simply ABSENT from the request too —
      // `.partial()` only makes the key optional, it does not suppress the
      // default. Left unchecked, a PATCH that only touches `headline` would
      // silently reset `status` to 'draft' and every array field to `[]`.
      // Keep only the keys the caller actually sent.
      for (const key of Object.keys(payload)) {
        if (!(key in rawBody)) delete payload[key]
      }
      // Only re-derive the slug when one was explicitly supplied — renaming a
      // published row must not silently move its URL.
      const update: Row = { ...payload, updated_at: new Date().toISOString() }
      if (typeof payload.slug === 'string' && payload.slug.trim()) update.slug = generateSlug(payload.slug)
      else delete update.slug

      const service = createServiceClient()
      const { data, error } = await service
        .from(r.table)
        .update(update as never)
        .eq('id', id)
        .select('id, slug, status')
        .single()

      if (error?.code === '23505') {
        return NextResponse.json({ error: `The slug "${String(update.slug)}" is already in use` }, { status: 409 })
      }
      if (error || !data) return NextResponse.json({ error: error?.message ?? 'Not found' }, { status: 404 })

      const row = data as { id: string; slug: string; status: string }
      // Revalidate regardless of status: unpublishing must clear the live page.
      await revalidatePage(r.revalidateAs, row.slug)
      await logAudit({ userId: acting.id, action: 'update', table: r.table, recordId: row.id, changes: payload as Json })
      return NextResponse.json({ success: true })
    } catch (err) {
      console.error(`PATCH /api/admin/${r.table}/[id]:`, err)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }

  async function DELETE(_req: NextRequest, { params }: Ctx) {
    try {
      const acting = await getActingUser()
      if (!acting) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      // Deletion removes a live URL — restrict it the way page deletion was.
      if (acting.role !== 'super_admin' && acting.role !== 'admin') {
        return NextResponse.json({ error: 'Only admins may delete content' }, { status: 403 })
      }

      const { id } = await params
      const service = createServiceClient()
      const { data: existing } = await service.from(r.table).select('slug').eq('id', id).maybeSingle()

      const { error } = await service.from(r.table).delete().eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      const slug = (existing as { slug?: string } | null)?.slug
      if (slug) await revalidatePage(r.revalidateAs, slug)
      await logAudit({ userId: acting.id, action: 'delete', table: r.table, recordId: id })
      return NextResponse.json({ success: true })
    } catch (err) {
      console.error(`DELETE /api/admin/${r.table}/[id]:`, err)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }

  return { GET, PATCH, DELETE }
}
