'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { AdminSectionCard } from '@/components/admin/ui/AdminSectionCard'
import { AdminInput, AdminTextarea, AdminSelect, AdminLabel } from '@/components/admin/ui/AdminField'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { useActingRole } from '@/components/admin/seo-editor-ui'

export interface SeoBlogFormValues {
  published_at: string
  title: string
  slug: string
  seo_title: string
  meta_keyword: string
  seo_description: string
  image_webp_url: string
  image_alt: string
  excerpt: string
  blockquote: string
  content: string
  tags: string
  status: string
  is_featured: boolean
  category_id: string
}

export const EMPTY_SEO_BLOG: SeoBlogFormValues = {
  published_at: '', title: '', slug: '',
  seo_title: '', meta_keyword: '', seo_description: '', image_webp_url: '',
  image_alt: '', excerpt: '', blockquote: '',
  content: '', tags: '', status: 'draft', is_featured: false,
  category_id: '',
}

// blog_posts.slug is validated server-side against /^[a-z0-9-]+$/ (see
// lib/schemas/seo-blog.ts) — no spaces, no slashes, no punctuation. The shared
// generateSlug() deliberately preserves '/' because SEO pages nest their slug
// under a state, so it can't be reused here.
//
// `live` keeps a trailing hyphen while the admin is still typing; the strict
// pass runs on save.
function blogSlug(text: string, live = false): string {
  const s = text
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-{2,}/g, '-')
  return live ? s.replace(/^-+/, '') : s.replace(/^-+|-+$/g, '')
}

interface BlogCategory { id: string; name: string }

interface Props {
  postId?: string
  initial: SeoBlogFormValues
  categories: BlogCategory[]
}

export function SeoBlogForm({ postId, initial, categories }: Props) {
  const router = useRouter()
  const { isSEOEditor } = useActingRole()
  const [v, setV] = useState<SeoBlogFormValues>(initial)
  const [saving, setSaving] = useState(false)
  // An existing post's slug is its live URL — never re-derive it from the title.
  const [slugTouched, setSlugTouched] = useState(Boolean(postId))

  const set = <K extends keyof SeoBlogFormValues>(key: K, value: SeoBlogFormValues[K]) =>
    setV(prev => ({ ...prev, [key]: value }))

  function setTitle(title: string) {
    setV(prev => ({ ...prev, title, ...(slugTouched ? {} : { slug: blogSlug(title, true) }) }))
  }

  async function uploadImage(file: File, key: 'image_webp_url') {
    const t = toast.loading('Uploading…')
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/media', { method: 'POST', body: form })
      const d = await res.json() as { media?: { url: string }; error?: string }
      if (!res.ok || !d.media) { toast.error(d.error ?? 'Upload failed', { id: t }); return }
      set(key, d.media.url)
      toast.success('Uploaded', { id: t })
    } catch { toast.error('Network error', { id: t }) }
  }

  async function save() {
    if (!v.title.trim()) { toast.error('Title is required'); return }
    const slug = blogSlug(v.slug)
    if (!slug) { toast.error('URL slug is required'); return }
    if (slug !== v.slug) set('slug', slug)

    setSaving(true)
    const payload = {
      published_at: v.published_at ? new Date(v.published_at).toISOString() : null,
      title: v.title.trim(),
      slug,
      seo_title: v.seo_title || null,
      meta_keyword: v.meta_keyword || null,
      seo_description: v.seo_description || null,
      image_webp_url: v.image_webp_url || null,
      image_alt: v.image_alt || null,
      excerpt: v.excerpt || null,
      blockquote: v.blockquote || null,
      content: v.content || null,
      tags: v.tags || null,
      status: v.status,
      is_featured: v.is_featured,
      category_id: v.category_id || null,
    }
    const res = await fetch(postId ? `/api/admin/seo-blog/${postId}` : '/api/admin/seo-blog', {
      method: postId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    if (!res.ok) {
      // A Zod rejection returns `error: 'Invalid data'` plus per-field details.
      // Showing only `error` left the admin with a bare "Invalid data" toast
      // and no idea which field the API objected to.
      const d = await res.json().catch(() => null) as { error?: string; details?: Record<string, string[]> } | null
      const [field, messages] = Object.entries(d?.details ?? {})[0] ?? []
      toast.error(field ? `${field}: ${messages?.[0] ?? 'invalid'}` : d?.error ?? 'Save failed')
      return
    }
    toast.success('Saved')
    router.push('/admin/seo-blog')
    router.refresh()
  }

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://seoexpertagency.co.uk'

  return (
    <div className="max-w-4xl space-y-5">
      <AdminSectionCard title="Blog Details" headerColor="#22C55E">
        <AdminSelect
          label="Category"
          value={v.category_id}
          onChange={e => set('category_id', e.target.value)}
          options={[{ value: '', label: 'Uncategorised' }, ...categories.map(c => ({ value: c.id, label: c.name }))]}
        />
        <AdminInput label="Article Date" type="date" value={v.published_at} onChange={e => set('published_at', e.target.value)} />
        <AdminInput label="Title" required value={v.title} onChange={e => setTitle(e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminInput label="URL" required value={`${siteUrl}/blog/`} disabled readOnly />
          <AdminInput
            label="URL SLUG"
            required
            hint="lowercase, hyphens only"
            value={v.slug}
            onChange={e => { setSlugTouched(true); set('slug', blogSlug(e.target.value, true)) }}
          />
        </div>
        <AdminInput label="Meta Title" required value={v.seo_title} onChange={e => set('seo_title', e.target.value)} maxCount={100} />
        <AdminInput label="Meta Keyword" required value={v.meta_keyword} onChange={e => set('meta_keyword', e.target.value)} />
        <AdminTextarea label="Meta Description" value={v.seo_description} onChange={e => set('seo_description', e.target.value)} maxCount={300} rows={3} />
        <ImageUpload label="Master Image (webp)" required url={v.image_webp_url} accept="image/webp" onFile={f => void uploadImage(f, 'image_webp_url')} />
        <AdminInput label="Image Alt" value={v.image_alt} onChange={e => set('image_alt', e.target.value)} />
        <AdminTextarea label="Short Description" required value={v.excerpt} onChange={e => set('excerpt', e.target.value)} rows={4} />
        <AdminTextarea label="Blockquote" value={v.blockquote} onChange={e => set('blockquote', e.target.value)} rows={3} />
        <div>
          <AdminLabel required>Complete Description</AdminLabel>
          <RichTextEditor value={v.content} onChange={html => set('content', html)} minHeight={260} />
        </div>
        <AdminInput label="Tags (Separate each points with semicolon (;) )" value={v.tags} onChange={e => set('tags', e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isSEOEditor ? (
            <div>
              <AdminLabel>Publish Status</AdminLabel>
              <p className="text-sm text-zinc-500 border border-[#E5E7EB] rounded px-3 py-2 bg-zinc-50">Inactive — pending admin approval</p>
            </div>
          ) : (
            <AdminSelect label="Publish Status" required value={v.status} onChange={e => set('status', e.target.value)} options={[{ value: 'published', label: 'Active' }, { value: 'draft', label: 'Inactive' }, { value: 'archived', label: 'Archived' }]} />
          )}
          <AdminSelect label="Is Featured?" value={v.is_featured ? 'yes' : 'no'} onChange={e => set('is_featured', e.target.value === 'yes')} options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]} />
        </div>
      </AdminSectionCard>

      <div className="flex gap-3">
        <AdminButton variant="success" loading={saving} onClick={() => void save()}>SAVE &amp; EXIT</AdminButton>
        <AdminButton variant="outline" onClick={() => router.push('/admin/seo-blog')}>CANCEL</AdminButton>
      </div>
    </div>
  )
}

function ImageUpload({ label, required, url, accept, onFile }: { label: string; required?: boolean; url: string; accept: string; onFile: (f: File) => void }) {
  return (
    <div>
      <AdminLabel required={required}>{label}</AdminLabel>
      <input
        type="file"
        accept={accept}
        onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = '' }}
        className="block w-full text-sm text-zinc-600 file:mr-3 file:rounded file:border file:border-zinc-300 file:bg-white file:px-3 file:py-1.5 file:text-sm file:text-zinc-700"
      />
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="mt-2 h-20 rounded border border-[#E5E7EB] object-contain" />
      )}
    </div>
  )
}
