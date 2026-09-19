import { createServiceClient } from '@/lib/supabase/service'

// Recent Activity reads from `audit_logs` rather than from `generated_pages`,
// so it covers every content type an SEO editor touches — SEO pages, brand and
// service pages, model pages, blog posts, static pages, FAQs.
//
// Rows are aggregated per page, not per audit event: a page edited five times
// appears once, showing who created it and who last edited it. No table carries
// an `updated_by` column (only `website_settings` does), so edit attribution can
// only come from the audit log; the tables' own `created_by`/`author_id` columns
// serve as a fallback for pages created before the audit window.

export interface ActivityRow {
  /** `${table_name}:${record_id}` — stable React key. */
  key: string
  /** Human label for the kind of content, e.g. "SEO Page" / "Blog Post". */
  typeLabel: string
  title: string
  /** Admin edit link, null when the table has no editor route. */
  href: string | null
  createdBy: string
  /** null when the page has never been edited since creation. */
  editedBy: string | null
  lastChangeAt: string
}

interface TableMeta {
  label: string
  /** Column the audit log's `record_id` matches. */
  idColumn: 'id' | 'slug' | 'key'
  /** Column holding the display title. */
  titleColumn: string
  /** Column naming the creator, used when the audit window has no create event. */
  createdByColumn?: string
  /** Builds the admin edit URL from the record id. */
  href: ((recordId: string) => string) | null
}

// Only content tables appear in the feed — leads, media, users and settings are
// operational noise for this panel.
type ContentTable =
  | 'blog_posts' | 'static_pages' | 'services' | 'industries'
  | 'projects' | 'faqs' | 'search_content' | 'seo_pages'

const TABLES: Record<ContentTable, TableMeta> = {
  // No admin page anymore — edited inline on the homepage — so no edit link.
  services: { label: 'Service', idColumn: 'id', titleColumn: 'name', href: null },
  industries: { label: 'Industry', idColumn: 'id', titleColumn: 'name', href: null },
  projects: { label: 'Case Study', idColumn: 'id', titleColumn: 'title', href: id => `/admin/projects/${id}` },
  seo_pages: { label: 'SEO Page', idColumn: 'id', titleColumn: 'headline', href: id => `/admin/seo-pages/${id}` },
  blog_posts: { label: 'Blog Post', idColumn: 'id', titleColumn: 'title', createdByColumn: 'author_id', href: id => `/admin/seo-blog/${id}` },
  static_pages: { label: 'Static Page', idColumn: 'slug', titleColumn: 'title', href: slug => `/admin/pages/static/${slug}` },
  faqs: { label: 'FAQ', idColumn: 'id', titleColumn: 'name', href: id => `/admin/faqs/${id}` },
  search_content: { label: 'Search Content', idColumn: 'id', titleColumn: 'title', href: () => '/admin/search-content' },
}

// Events scanned before grouping. Must be well above the row count, because many
// events on one page collapse into a single row.
const AUDIT_WINDOW = 400

const CREATE_ACTIONS = new Set(['create', 'generate'])
const EDIT_ACTIONS = new Set(['update', 'publish', 'unpublish'])

interface AuditEvent {
  action: string
  table_name: string
  record_id: string
  user_id: string | null
  created_at: string
}

/** Latest content changes, one row per page, newest change first. */
export async function getRecentActivity(limit = 15): Promise<ActivityRow[]> {
  const service = createServiceClient()

  const { data: logs } = await service
    .from('audit_logs')
    .select('action, table_name, record_id, user_id, created_at')
    .in('table_name', Object.keys(TABLES))
    .order('created_at', { ascending: false })
    .limit(AUDIT_WINDOW)

  if (!logs?.length) return []

  // Group by page, preserving the descending order the query returned.
  const groups = new Map<string, AuditEvent[]>()
  for (const log of logs as AuditEvent[]) {
    const key = `${log.table_name}:${log.record_id}`
    const existing = groups.get(key)
    if (existing) existing.push(log)
    else groups.set(key, [log])
  }

  // A deleted page has no title or link left to show, so drop it rather than
  // filling the panel with "(deleted)" rows. The events remain in audit_logs.
  const pages = [...groups.entries()]
    .filter(([, events]) => events[0].action !== 'delete')
    .slice(0, limit)

  // Resolve titles and creator columns with one query per table, not per row.
  const byTable = new Map<ContentTable, string[]>()
  for (const [, events] of pages) {
    const table = events[0].table_name as ContentTable
    byTable.set(table, [...(byTable.get(table) ?? []), events[0].record_id])
  }

  const titles = new Map<string, string>()
  const createdByFallback = new Map<string, string>()

  await Promise.all([...byTable.entries()].map(async ([table, ids]) => {
    const meta = TABLES[table]
    if (!meta) return
    const columns = [meta.idColumn, meta.titleColumn, meta.createdByColumn].filter(Boolean).join(', ')
    const { data } = await service
      .from(table)
      .select(columns)
      .in(meta.idColumn, [...new Set(ids)])
    for (const row of (data ?? []) as unknown as Array<Record<string, string | null>>) {
      const key = `${table}:${row[meta.idColumn]}`
      const title = row[meta.titleColumn]
      if (title) titles.set(key, title)
      const creator = meta.createdByColumn ? row[meta.createdByColumn] : null
      if (creator) createdByFallback.set(key, creator)
    }
  }))

  // Every user id we need — audit actors plus the fallback columns — in one query.
  const userIds = new Set<string>()
  for (const [key, events] of pages) {
    for (const e of events) if (e.user_id) userIds.add(e.user_id)
    const fallback = createdByFallback.get(key)
    if (fallback) userIds.add(fallback)
  }

  const { data: users } = userIds.size
    ? await service.from('users').select('id, full_name').in('id', [...userIds])
    : { data: [] as Array<{ id: string; full_name: string }> }
  const userName = new Map((users ?? []).map(u => [u.id, u.full_name]))
  const nameOf = (id: string | null | undefined) => (id && userName.get(id)) || null

  return pages.map(([key, events]) => {
    const table = events[0].table_name as ContentTable
    const meta = TABLES[table]
    const recordId = events[0].record_id

    // `events` is newest-first: the last create is the earliest one, and the
    // first edit is the most recent.
    const created = [...events].reverse().find(e => CREATE_ACTIONS.has(e.action))
    const edited = events.find(e => EDIT_ACTIONS.has(e.action))

    const title = titles.get(key)
    return {
      key,
      typeLabel: meta?.label ?? table,
      title: title ?? '(untitled)',
      href: title && meta?.href ? meta.href(recordId) : null,
      createdBy: nameOf(created?.user_id) ?? nameOf(createdByFallback.get(key)) ?? 'System',
      editedBy: nameOf(edited?.user_id),
      lastChangeAt: events[0].created_at,
    }
  })
}
