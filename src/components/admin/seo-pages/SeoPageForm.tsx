'use client'

import { useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Minus, Plus, Eye } from 'lucide-react'
import { AdminInput, AdminTextarea, AdminSelect, AdminLabel } from '@/components/admin/ui/AdminField'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { Repeater, inputCls } from '@/components/admin/ui/Repeater'
import { generateSlug } from '@/lib/page-engine/slugify'
import { getMarket } from '@/lib/market'
import type { FieldValue } from '@/components/admin/content/ContentForm'

// Visually distinct from the shared ContentForm used by Services/Industries/
// Projects/Locations — this content type is deliberately styled to match the
// the previously agreed "Add New Page" layout (green section headers,
// collapsible cards), by explicit request, rather than the app's usual
// white-card admin style.

function GreenSection({ title, badge, children, defaultOpen = true }: { title: string; badge?: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-lg overflow-hidden border border-zinc-200 mb-5">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3 bg-emerald-600 text-white"
      >
        <span className="text-sm font-bold tracking-wide uppercase">{title}</span>
        <span className="flex items-center gap-3">
          {badge}
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      {open && <div className="p-5 bg-white space-y-4">{children}</div>}
    </div>
  )
}

export interface StateOption { id: string; name: string; slug: string; country_code: string }

interface Props {
  id?: string
  initial: Record<string, FieldValue>
  states: StateOption[]
}

export function SeoPageForm({ id, initial, states }: Props) {
  const router = useRouter()
  const market = getMarket()
  const [v, setV] = useState<Record<string, FieldValue>>(initial)
  const [saving, setSaving] = useState<'edit' | 'exit' | false>(false)
  const [slugTouched, setSlugTouched] = useState(Boolean(id))

  const set = (key: string, value: FieldValue) => setV(prev => ({ ...prev, [key]: value }))
  const str = (key: string) => (typeof v[key] === 'string' ? (v[key] as string) : '')

  const selectedState = states.find(s => s.id === str('location_id'))

  // Only this deployment's country belongs in the State dropdown — the .ae site
  // must never offer a UK state. Locations with a blank country_code are kept:
  // the Locations form leaves it empty by default, and silently hiding the
  // admin's own rows would be worse than showing one that needs its code set.
  // The page's current state always stays selectable, whatever its code.
  const marketStates = useMemo(
    () => states.filter(s =>
      !s.country_code ||
      s.country_code.toUpperCase() === market.countryCode ||
      s.id === str('location_id')
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [states, market.countryCode, v.location_id]
  )

  // The URL is `{state slug}/{headline slug}` — recomputed from whichever of
  // state/headline last changed, until the admin hand-edits the slug field.
  function recomputeSlug(stateSlug: string | undefined, headline: string) {
    const parts = [stateSlug, generateSlug(headline)].filter(Boolean)
    return parts.join('/')
  }

  function setHeadline(value: string) {
    setV(prev => ({
      ...prev,
      headline: value,
      ...(slugTouched ? {} : { slug: recomputeSlug(selectedState?.slug, value) }),
    }))
  }

  function setLocation(locationId: string) {
    const state = states.find(s => s.id === locationId)
    setV(prev => ({
      ...prev,
      location_id: locationId,
      ...(slugTouched ? {} : { slug: recomputeSlug(state?.slug, str('headline')) }),
    }))
  }

  async function save(mode: 'edit' | 'exit') {
    // Validate here rather than letting the API's Zod errors stand in for it:
    // the three required fields are spread across collapsible sections, and a
    // round-trip that comes back "Select a state" doesn't say where to look.
    if (market.hasGeo && !str('location_id')) {
      toast.error(marketStates.length === 0
        ? `No ${market.countryName} states exist yet — add a Location first (Admin → Locations)`
        : 'Select a state')
      return
    }
    if (!str('headline').trim()) { toast.error('Title (H1) is required'); return }
    if (!str('slug').trim()) { toast.error('URL slug is required'); return }

    setSaving(mode)
    try {
      const res = await fetch(id ? `/api/admin/seo-pages/${id}` : '/api/admin/seo-pages', {
        method: id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(v),
      })
      const body = await res.json().catch(() => null) as { error?: string; id?: string; details?: Record<string, string[]> } | null
      if (!res.ok) {
        const detail = body?.details ? Object.values(body.details).flat()[0] : undefined
        throw new Error(detail ?? body?.error ?? 'Save failed')
      }
      toast.success(id ? 'SEO Page updated' : 'SEO Page created')
      if (mode === 'exit') { router.push('/admin/seo-pages'); return }
      // "Save & Keep Editing": land on/stay on the edit page for this row.
      if (!id && body?.id) router.push(`/admin/seo-pages/${body.id}`)
      else router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const slug = str('slug')
  const whyChooseUsItems = Array.isArray(v.why_choose_us_json) ? (v.why_choose_us_json as Record<string, string>[]) : []
  const faqItems = Array.isArray(v.faq_json) ? (v.faq_json as Record<string, string>[]) : []

  return (
    <div className="max-w-4xl space-y-0">
      {market.hasGeo && marketStates.length === 0 && (
        <div className="mb-5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong className="font-semibold">No {market.countryName} states available.</strong> An SEO
          page on this site must belong to a state, and no location is set up for this market yet —
          so the form cannot be saved.{' '}
          <Link href="/admin/locations/new" className="underline font-medium">Add a location</Link>{' '}
          first, then come back.
        </div>
      )}
      <GreenSection title="Page Details">
        {/* The global (.com) deployment has no geography — no country, no state. */}
        {market.hasGeo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="Country"
              disabled
              hint="Fixed for this site"
              value={market.countryName}
              onChange={() => {}}
            />
            <AdminSelect
              label="State"
              required
              value={str('location_id')}
              onChange={e => setLocation(e.target.value)}
              options={marketStates.map(s => ({ value: s.id, label: s.name }))}
            />
          </div>
        )}
        <AdminInput
          label="Title (H1)"
          required
          maxCount={120}
          value={str('headline')}
          onChange={e => setHeadline(e.target.value)}
        />
        <div>
          <AdminInput
            label="URL Slug"
            required
            hint={slug ? `seoexpertagency.co.uk/${slug}` : undefined}
            value={slug}
            onChange={e => { setSlugTouched(true); set('slug', e.target.value.toLowerCase()) }}
          />
          {id && (
            <p className="mt-1 text-xs text-amber-600">
              Changing the slug moves this page&apos;s URL. Anything linking to the old
              address will 404 unless you add a redirect.
            </p>
          )}
        </div>
        <AdminInput
          label="Meta Title"
          maxCount={60}
          hint="~60 characters"
          value={str('seo_title')}
          onChange={e => set('seo_title', e.target.value)}
        />
        <AdminInput
          label="Meta Keyword"
          value={str('meta_keyword')}
          onChange={e => set('meta_keyword', e.target.value)}
        />
        <AdminTextarea
          label="Meta Description"
          maxCount={160}
          rows={3}
          hint="~160 characters"
          value={str('seo_description')}
          onChange={e => set('seo_description', e.target.value)}
        />
      </GreenSection>

      <GreenSection title="Content">
        <AdminTextarea
          label="Short Description"
          maxCount={300}
          rows={2}
          hint="Shown as the hero subtitle, directly under the H1"
          value={str('subheadline')}
          onChange={e => set('subheadline', e.target.value)}
        />
        <div>
          <AdminLabel>Long Description</AdminLabel>
          <p className="text-xs text-zinc-500 -mt-1 mb-1.5">The full SEO article/body copy — rendered near the bottom of the page, after the standard site sections.</p>
          <RichTextEditor value={str('overview')} onChange={html => set('overview', html)} />
        </div>
      </GreenSection>

      <GreenSection
        title="Why Choose Us"
        badge={whyChooseUsItems.length > 0 ? <span className="flex items-center gap-1 text-xs font-medium"><Eye size={14} /> Custom</span> : undefined}
      >
        <AdminInput
          label="Section Heading"
          hint='Defaults to "Why Ambitious Brands Choose SEO Expert Agency" if left blank'
          value={str('why_choose_us_heading')}
          onChange={e => set('why_choose_us_heading', e.target.value)}
        />
        <div>
          <AdminLabel>Reasons / USPs</AdminLabel>
          <Repeater
            items={whyChooseUsItems}
            max={12}
            addLabel="+ Add USP"
            blank={{ title: '', description: '' }}
            onChange={items => set('why_choose_us_json', items)}
            render={(item, update) => (
              <div className="space-y-2">
                <input
                  className={inputCls}
                  placeholder="Title"
                  aria-label="Title"
                  value={item.title ?? ''}
                  onChange={e => update({ ...item, title: e.target.value })}
                />
                <textarea
                  className={`${inputCls} min-h-[72px] resize-y`}
                  placeholder="Description"
                  aria-label="Description"
                  value={item.description ?? ''}
                  onChange={e => update({ ...item, description: e.target.value })}
                />
              </div>
            )}
          />
          <p className="mt-1.5 text-xs text-zinc-500">Leave items empty to show the default 6-reason list.</p>
        </div>
      </GreenSection>

      <GreenSection title="FAQ">
        <Repeater
          items={faqItems}
          max={30}
          addLabel="+ Add FAQ"
          blank={{ question: '', answer: '' }}
          onChange={items => set('faq_json', items)}
          render={(item, update) => (
            <div className="space-y-2">
              <input
                className={inputCls}
                placeholder="Question"
                aria-label="Question"
                value={item.question ?? ''}
                onChange={e => update({ ...item, question: e.target.value })}
              />
              <textarea
                className={`${inputCls} min-h-[72px] resize-y`}
                placeholder="Answer"
                aria-label="Answer"
                value={item.answer ?? ''}
                onChange={e => update({ ...item, answer: e.target.value })}
              />
            </div>
          )}
        />
        <p className="text-xs text-zinc-500">Leave empty to hide the FAQ section on this page.</p>
      </GreenSection>

      <GreenSection title="Display Information">
        <AdminSelect
          label="Publish Status"
          value={str('status') || 'draft'}
          onChange={e => set('status', e.target.value)}
          options={[
            { value: 'draft', label: 'Draft — not visible on the site' },
            { value: 'published', label: 'Published — live' },
            { value: 'archived', label: 'Archived — hidden' },
          ]}
        />
      </GreenSection>

      {/* Sticky, not fixed: a `fixed` bar spans the whole viewport regardless of
          the sidebar, painting over its bottom edge (it covers Logout). Sticky
          stays within this max-w-4xl column instead. */}
      <div className="sticky bottom-0 mt-2 bg-white border border-zinc-200 rounded-lg shadow-[0_-2px_8px_rgba(0,0,0,0.04)] px-6 py-3 flex justify-end gap-3 z-10">
        <AdminButton variant="outline" onClick={() => router.push('/admin/seo-pages')}>Cancel</AdminButton>
        <AdminButton variant="success" onClick={() => save('edit')} loading={saving === 'edit'}>
          Save &amp; Keep Editing
        </AdminButton>
        <AdminButton variant="success" onClick={() => save('exit')} loading={saving === 'exit'}>
          Save &amp; Exit
        </AdminButton>
      </div>
    </div>
  )
}
