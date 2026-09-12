'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { AdminSectionCard } from '@/components/admin/ui/AdminSectionCard'
import { AdminInput, AdminTextarea, AdminSelect, AdminLabel } from '@/components/admin/ui/AdminField'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { ListRepeater } from '@/components/admin/ui/ListRepeater'
import { Repeater, inputCls } from '@/components/admin/ui/Repeater'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { generateSlug } from '@/lib/page-engine/slugify'

export type FieldValue = string | number | string[] | Record<string, string>[] | null

export interface RepeaterField {
  /** Keys rendered as inputs for each row, in order. */
  keys: Array<{ key: string; label: string; textarea?: boolean }>
}

export type FieldSpec =
  | { kind: 'text'; name: string; label: string; required?: boolean; max?: number; hint?: string }
  | { kind: 'textarea'; name: string; label: string; max?: number; rows?: number; hint?: string }
  | { kind: 'rich'; name: string; label: string }
  | { kind: 'list'; name: string; label: string; placeholder?: string; addLabel?: string }
  | { kind: 'repeater'; name: string; label: string; addLabel: string; fields: RepeaterField }

export interface FormSection {
  title: string
  description?: string
  fields: FieldSpec[]
}

interface Props {
  /** Existing row id; omitted when creating. */
  id?: string
  basePath: string
  /** Public URL prefix, e.g. `/projects`. Omit when this content type has no
   *  standalone public page (e.g. services and industries, which only render
   *  as cards on the homepage, and locations, which has no public page at
   *  all) — the URL hint and slug-change warning are hidden instead. */
  publicPrefix?: string
  singular: string
  /** Field holding the human name — used to auto-derive the slug on create. */
  titleField: 'name' | 'title' | 'headline'
  sections: FormSection[]
  initial: Record<string, FieldValue>
}

export function ContentForm({ id, basePath, publicPrefix, singular, titleField, sections, initial }: Props) {
  const router = useRouter()
  const [v, setV] = useState<Record<string, FieldValue>>(initial)
  const [saving, setSaving] = useState(false)
  // On create the slug tracks the title until the editor types one; on edit it
  // is left alone, because changing a published slug breaks its live URL.
  const [slugTouched, setSlugTouched] = useState(Boolean(id))

  const set = (key: string, value: FieldValue) => setV(prev => ({ ...prev, [key]: value }))
  const str = (key: string) => (typeof v[key] === 'string' ? (v[key] as string) : '')

  function setTitle(value: string) {
    setV(prev => ({
      ...prev,
      [titleField]: value,
      ...(slugTouched ? {} : { slug: generateSlug(value) }),
    }))
  }

  async function save() {
    setSaving(true)
    try {
      const res = await fetch(id ? `/api/admin/${basePath}/${id}` : `/api/admin/${basePath}`, {
        method: id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(v),
      })
      const body = await res.json().catch(() => null) as { error?: string; id?: string; details?: Record<string, string[]> } | null
      if (!res.ok) {
        const detail = body?.details ? Object.values(body.details).flat()[0] : undefined
        throw new Error(detail ?? body?.error ?? 'Save failed')
      }
      toast.success(id ? `${singular} updated` : `${singular} created`)
      if (!id && body?.id) router.push(`/admin/${basePath}/${body.id}`)
      else router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  function renderField(f: FieldSpec) {
    switch (f.kind) {
      case 'text':
        return (
          <AdminInput
            key={f.name}
            label={f.label}
            required={f.required}
            maxCount={f.max}
            hint={f.hint}
            value={str(f.name)}
            onChange={e => (f.name === titleField ? setTitle(e.target.value) : set(f.name, e.target.value))}
          />
        )
      case 'textarea':
        return (
          <AdminTextarea
            key={f.name}
            label={f.label}
            maxCount={f.max}
            rows={f.rows}
            hint={f.hint}
            value={str(f.name)}
            onChange={e => set(f.name, e.target.value)}
          />
        )
      case 'rich':
        return (
          <div key={f.name}>
            <AdminLabel>{f.label}</AdminLabel>
            <RichTextEditor value={str(f.name)} onChange={html => set(f.name, html)} />
          </div>
        )
      case 'list':
        return (
          <div key={f.name}>
            <AdminLabel>{f.label}</AdminLabel>
            <ListRepeater
              items={Array.isArray(v[f.name]) ? (v[f.name] as string[]) : []}
              onChange={items => set(f.name, items)}
              placeholder={f.placeholder}
              addLabel={f.addLabel}
            />
          </div>
        )
      case 'repeater': {
        const rows = Array.isArray(v[f.name]) ? (v[f.name] as Record<string, string>[]) : []
        const blank = Object.fromEntries(f.fields.keys.map(k => [k.key, ''])) as Record<string, string>
        return (
          <div key={f.name}>
            <AdminLabel>{f.label}</AdminLabel>
            <Repeater
              items={rows}
              max={30}
              addLabel={f.addLabel}
              blank={blank}
              onChange={items => set(f.name, items)}
              render={(item, update) => (
                <div className="space-y-2">
                  {f.fields.keys.map(k =>
                    k.textarea ? (
                      <textarea
                        key={k.key}
                        className={`${inputCls} min-h-[72px] resize-y`}
                        placeholder={k.label}
                        aria-label={k.label}
                        value={item[k.key] ?? ''}
                        onChange={e => update({ ...item, [k.key]: e.target.value })}
                      />
                    ) : (
                      <input
                        key={k.key}
                        className={inputCls}
                        placeholder={k.label}
                        aria-label={k.label}
                        value={item[k.key] ?? ''}
                        onChange={e => update({ ...item, [k.key]: e.target.value })}
                      />
                    )
                  )}
                </div>
              )}
            />
          </div>
        )
      }
    }
  }

  const slug = str('slug')

  return (
    <div className="max-w-4xl space-y-5">
      {sections.map(section => (
        <AdminSectionCard key={section.title} title={section.title} description={section.description}>
          <div className="space-y-4">{section.fields.map(renderField)}</div>
        </AdminSectionCard>
      ))}

      <AdminSectionCard title="URL & Publishing">
        <div className="space-y-4">
          <div>
            <AdminInput
              label="URL Slug"
              required
              hint={slug && publicPrefix ? `${publicPrefix}/${slug}` : undefined}
              value={slug}
              onChange={e => { setSlugTouched(true); set('slug', e.target.value.toLowerCase()) }}
            />
            {id && publicPrefix && (
              <p className="mt-1 text-xs text-amber-600">
                Changing the slug moves this page&apos;s URL. Anything linking to the old
                address will 404 unless you add a redirect.
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminSelect
              label="Status"
              value={str('status') || 'draft'}
              onChange={e => set('status', e.target.value)}
              options={[
                { value: 'draft', label: 'Draft — not visible on the site' },
                { value: 'published', label: 'Published — live' },
                { value: 'archived', label: 'Archived — hidden' },
              ]}
            />
            <AdminInput
              label="Sort Order"
              type="number"
              hint="Lower numbers appear first"
              value={String(v.sort_order ?? 0)}
              onChange={e => set('sort_order', Number(e.target.value) || 0)}
            />
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        title="Search Engine Listing"
        description="How this page appears in Google. Leave blank to fall back to the page heading and summary."
      >
        <div className="space-y-4">
          <AdminInput
            label="Meta Title"
            maxCount={60}
            hint="~60 characters"
            value={str('seo_title')}
            onChange={e => set('seo_title', e.target.value)}
          />
          <AdminTextarea
            label="Meta Description"
            maxCount={160}
            rows={3}
            hint="~160 characters"
            value={str('seo_description')}
            onChange={e => set('seo_description', e.target.value)}
          />
          <AdminInput
            label="Social Share Image URL"
            value={str('og_image_url')}
            onChange={e => set('og_image_url', e.target.value)}
          />
        </div>
      </AdminSectionCard>

      {/* Sticky, not fixed: a `fixed` bar spans the whole viewport regardless of
          the sidebar, painting over its bottom edge (it covers Logout). Sticky
          stays within this max-w-4xl column instead. */}
      <div className="sticky bottom-0 mt-6 bg-white border border-zinc-200 rounded-lg shadow-[0_-2px_8px_rgba(0,0,0,0.04)] px-6 py-3 flex justify-end gap-3 z-10">
        <AdminButton variant="outline" onClick={() => router.push(`/admin/${basePath}`)}>Cancel</AdminButton>
        <AdminButton onClick={save} loading={saving}>
          {id ? 'Save Changes' : `Create ${singular}`}
        </AdminButton>
      </div>
    </div>
  )
}
