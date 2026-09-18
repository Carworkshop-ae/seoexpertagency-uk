'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminLabel } from '@/components/admin/ui/AdminField'
import { CharCounter } from '@/components/admin/ui/CharCounter'
import { DEFAULT_SETTINGS, type SiteSettings } from '@/types/settings'
import { ExternalLink } from 'lucide-react'

const TABS: Array<{ id: string; label: string }> = [
  { id: 'general', label: 'General' },
  { id: 'contact-buttons', label: 'WhatsApp & Call' },
  { id: 'social', label: 'Social Media' },
  { id: 'announcement', label: 'Announcement' },
  { id: 'seo', label: 'SEO & Analytics' },
  { id: 'email', label: 'Email / SMTP' },
]

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-zinc-400">Loading…</div>}>
      <SettingsInner />
    </Suspense>
  )
}

function SettingsInner() {
  const sp = useSearchParams()
  const router = useRouter()
  const activeTab = sp.get('tab') ?? 'general'

  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch('/api/admin/settings')
        if (cancelled) return
        if (res.ok) {
          const d = await res.json() as { settings: Record<string, unknown> }
          setSettings({ ...DEFAULT_SETTINGS, ...(d.settings as Partial<SiteSettings>) })
        }
      } catch { /* ignore */ } finally { if (!cancelled) setLoading(false) }
    })()
    return () => { cancelled = true }
  }, [])

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const saveKey = useCallback(async (key: keyof SiteSettings, value: unknown) => {
    try {
      const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value }) })
      toast[res.ok ? 'success' : 'error'](res.ok ? 'Saved' : 'Save failed')
    } catch { toast.error('Network error') }
  }, [])

  const saveKeys = useCallback(async (keys: Array<keyof SiteSettings>) => {
    const t = toast.loading('Saving…')
    try {
      const payload = keys.map(k => ({ key: k, value: settings[k] }))
      const res = await fetch('/api/admin/settings/bulk', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ settings: payload }) })
      toast[res.ok ? 'success' : 'error'](res.ok ? 'Settings saved' : 'Save failed', { id: t })
    } catch { toast.error('Network error', { id: t }) }
  }, [settings])

  function toggle<K extends keyof SiteSettings>(key: K) {
    const next = !settings[key] as SiteSettings[K]
    set(key, next)
    void saveKey(key, next)
  }

  const saveEmail = useCallback(async () => {
    const keys: Array<keyof SiteSettings> = ['admin_email', 'email_provider', 'resend_api_key', 'resend_from_email', 'resend_from_name', 'smtp_host', 'smtp_port', 'smtp_user', 'smtp_password', 'smtp_from_email', 'smtp_from_name']
    const t = toast.loading('Saving…')
    try {
      const payload = keys
        .filter(k => !((k === 'resend_api_key' || k === 'smtp_password') && String(settings[k] ?? '').includes('•')))
        .map(k => ({ key: k, value: settings[k] }))
      const res = await fetch('/api/admin/settings/bulk', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ settings: payload }) })
      toast[res.ok ? 'success' : 'error'](res.ok ? 'Email settings saved' : 'Save failed', { id: t })
    } catch { toast.error('Network error', { id: t }) }
  }, [settings])

  const sendTestEmail = useCallback(async () => {
    const t = toast.loading('Sending test email…')
    try {
      const res = await fetch('/api/admin/settings/test-email', { method: 'POST' })
      const d = await res.json() as { sentTo?: string; error?: string }
      toast[res.ok ? 'success' : 'error'](res.ok ? `Test email sent to ${d.sentTo}` : (d.error ?? 'Failed'), { id: t })
    } catch { toast.error('Network error', { id: t }) }
  }, [])

  function goTab(id: string) { router.push(`/admin/settings?tab=${id}`) }

  if (loading) return <div className="p-8 text-zinc-400">Loading settings…</div>

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-zinc-900 mb-1">Website Settings</h1>
      <p className="text-sm text-zinc-500 mb-6">Manage website configuration, business contact, social media, and email settings.</p>

      <div className="flex flex-wrap gap-0 border-b border-zinc-200 mb-6 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => goTab(t.id)}
            className={['px-4 py-2.5 text-sm font-medium whitespace-nowrap -mb-px border-b-2 transition-colors', activeTab === t.id ? 'border-[#4472C4] text-[#4472C4]' : 'border-transparent text-zinc-500 hover:text-zinc-800'].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && <GeneralTab settings={settings} set={set} saveKeys={saveKeys} onSave={() => saveKeys(['site_name', 'site_tagline', 'site_logo_url', 'site_favicon_url'])} />}
      {activeTab === 'contact-buttons' && <ContactButtonsTab settings={settings} set={set} toggle={toggle} onSave={() => saveKeys(['whatsapp_enabled', 'whatsapp_number', 'whatsapp_message', 'whatsapp_position', 'call_enabled', 'call_number', 'call_position'])} />}
      {activeTab === 'social' && <SocialTab settings={settings} set={set} onSave={() => saveKeys(['social_instagram_url', 'social_facebook_url', 'social_linkedin_url', 'social_youtube_url', 'social_tiktok_url', 'social_twitter_url', 'social_google_business_url'])} />}
      {activeTab === 'announcement' && <AnnouncementTab settings={settings} set={set} toggle={toggle} onSave={() => saveKeys(['announcement_bar_enabled', 'announcement_bar_text', 'announcement_bar_bg_color', 'announcement_bar_text_color', 'announcement_bar_link'])} />}
      {activeTab === 'seo' && <SeoTab settings={settings} set={set} onSave={() => saveKeys(['ga4_id', 'gtm_id', 'gsc_meta', 'default_meta_title', 'default_meta_description', 'default_og_image'])} />}
      {activeTab === 'email' && <EmailTab settings={settings} set={set} onSave={saveEmail} onTest={sendTestEmail} />}
    </div>
  )
}

/* ─── Shared field components ─────────────────────────────────────────────── */

type SetFn = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void

const inputCls = 'w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#4472C4] focus:border-transparent transition-all'

function Field({ label, value, onChange, placeholder, helper, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; helper?: string; type?: string }) {
  return (
    <div>
      <AdminLabel>{label}</AdminLabel>
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} className={inputCls} />
      {helper && <p className="text-xs text-zinc-400 mt-1">{helper}</p>}
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer py-0.5">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <button type="button" onClick={onChange} role="switch" aria-checked={checked} className={['relative w-11 h-6 rounded-full transition-colors shrink-0', checked ? 'bg-[#22C55E]' : 'bg-zinc-300'].join(' ')}>
        <span className={['absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow', checked ? 'translate-x-5' : ''].join(' ')} />
      </button>
    </label>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <AdminLabel>{label}</AdminLabel>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-10 h-10 rounded-lg border border-zinc-300 cursor-pointer" aria-label={`${label} color`} />
        <input value={value} onChange={e => onChange(e.target.value)} className={`${inputCls} w-32 font-mono`} />
      </div>
    </div>
  )
}

function Radio({ name, options, value, onChange }: { name: string; options: Array<{ value: string; label: string }>; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => {
        const on = value === o.value
        return (
          <label key={o.value} className={['flex items-center gap-2 text-sm px-3 py-2 rounded-lg border cursor-pointer transition-colors', on ? 'border-[#4472C4] bg-[#EEF3FB] text-[#274E96]' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'].join(' ')}>
            <input type="radio" name={name} checked={on} onChange={() => onChange(o.value)} className="accent-[#4472C4]" />
            {o.label}
          </label>
        )
      })}
    </div>
  )
}

/* ─── Tabs ────────────────────────────────────────────────────────────────── */

function GeneralTab({ settings, set, saveKeys, onSave }: { settings: SiteSettings; set: SetFn; saveKeys: (keys: Array<keyof SiteSettings>) => void; onSave: () => void }) {
  const heroRows: Array<[keyof SiteSettings, keyof SiteSettings]> = [
    ['hero_stat_1_value', 'hero_stat_1_label'],
    ['hero_stat_2_value', 'hero_stat_2_label'],
    ['hero_stat_3_value', 'hero_stat_3_label'],
    ['hero_stat_4_value', 'hero_stat_4_label'],
  ]
  return (
    <div className="max-w-2xl space-y-5">
      <AdminCard title="Site Identity">
        <div className="space-y-4">
          <Field label="Site Name" value={settings.site_name} onChange={v => set('site_name', v)} />
          <Field label="Site Tagline" value={settings.site_tagline} onChange={v => set('site_tagline', v)} />
          <MediaPicker label="Site Logo" value={settings.site_logo_url} onChange={v => set('site_logo_url', v)} />
          <MediaPicker label="Favicon (32×32)" value={settings.site_favicon_url} onChange={v => set('site_favicon_url', v)} />
          <AdminButton variant="orange" onClick={onSave}>Save General Settings</AdminButton>
        </div>
      </AdminCard>

      <AdminCard title="Business Information (Footer & Contact)">
        <div className="space-y-4">
          <Field label="Business Address" value={settings.footer_business_address} onChange={v => set('footer_business_address', v)} placeholder="Al Quoz Industrial Area, Dubai, UAE" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Primary Phone" value={settings.footer_business_phone} onChange={v => set('footer_business_phone', v)} placeholder="+97150…" />
            <Field label="Secondary Phone (optional)" value={settings.footer_business_phone2} onChange={v => set('footer_business_phone2', v)} />
          </div>
          <Field label="Business Email" value={settings.footer_business_email} onChange={v => set('footer_business_email', v)} placeholder="info@seoexpertsagency.co.uk" />
          <AdminButton variant="orange" onClick={() => saveKeys(['footer_business_address', 'footer_business_phone', 'footer_business_phone2', 'footer_business_email'])}>Save Business Info</AdminButton>
        </div>
      </AdminCard>

      <AdminCard title="Hero Stats Cards" description="The 4 stat cells shown in the home hero's right-side card.">
        <div className="space-y-3">
          {heroRows.map(([vKey, lKey], i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <Field label={`Stat ${i + 1} Value`} value={settings[vKey] as string} onChange={v => set(vKey, v)} />
              <Field label={`Stat ${i + 1} Label`} value={settings[lKey] as string} onChange={v => set(lKey, v)} />
            </div>
          ))}
          <AdminButton variant="orange" onClick={() => saveKeys(heroRows.flat())}>Save Hero Stats</AdminButton>
        </div>
      </AdminCard>
    </div>
  )
}

function ContactButtonsTab({ settings, set, toggle, onSave }: { settings: SiteSettings; set: SetFn; toggle: (k: keyof SiteSettings) => void; onSave: () => void }) {
  const sameSide = settings.whatsapp_enabled && settings.call_enabled && settings.whatsapp_position === settings.call_position
  const waLink = `https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings.whatsapp_message)}`
  const telLink = `tel:${settings.call_number.replace(/[^0-9+]/g, '')}`

  return (
    <div className="grid lg:grid-cols-3 gap-5 items-start">
      <div className="lg:col-span-2 space-y-5">
        <AdminCard title="WhatsApp Button">
          <div className="space-y-4">
            <Toggle label="Enable WhatsApp Button" checked={settings.whatsapp_enabled} onChange={() => toggle('whatsapp_enabled')} />
            <Field label="WhatsApp Number" value={settings.whatsapp_number} onChange={v => set('whatsapp_number', v)} placeholder="+971501234567" helper="Include country code" />
            <Field label="Pre-filled Message" value={settings.whatsapp_message} onChange={v => set('whatsapp_message', v)} helper="Shown when the customer opens WhatsApp" />
            <div><AdminLabel>Button Position</AdminLabel><Radio name="wa_pos" value={settings.whatsapp_position} onChange={v => set('whatsapp_position', v as SiteSettings['whatsapp_position'])} options={[{ value: 'bottom-right', label: 'Bottom Right' }, { value: 'bottom-left', label: 'Bottom Left' }]} /></div>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-[#4472C4] hover:underline">Test WhatsApp Link <ExternalLink size={13} /></a>
          </div>
        </AdminCard>

        <AdminCard title="Call Button">
          <div className="space-y-4">
            <Toggle label="Enable Call Button" checked={settings.call_enabled} onChange={() => toggle('call_enabled')} />
            <Field label="Call Number" value={settings.call_number} onChange={v => set('call_number', v)} placeholder="+971501234567" />
            <div><AdminLabel>Button Position</AdminLabel><Radio name="call_pos" value={settings.call_position} onChange={v => set('call_position', v as SiteSettings['call_position'])} options={[{ value: 'bottom-left', label: 'Bottom Left' }, { value: 'bottom-right', label: 'Bottom Right' }]} /></div>
            {sameSide && <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">WhatsApp and Call are on the same side — Call appears above WhatsApp.</p>}
            <a href={telLink} className="inline-flex items-center gap-1 text-sm text-[#4472C4] hover:underline">Test Call Link <ExternalLink size={13} /></a>
          </div>
        </AdminCard>

        <AdminButton variant="orange" onClick={onSave}>Save WhatsApp &amp; Call Settings</AdminButton>
      </div>

      <AdminCard title="Live Preview">
        <div className="relative mx-auto w-44 h-80 rounded-3xl border-4 border-zinc-800 bg-zinc-50 overflow-hidden">
          <div className="text-center text-[10px] text-zinc-400 pt-4">Your website</div>
          {settings.whatsapp_enabled && <div className={['absolute w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white text-xs bottom-3', settings.whatsapp_position === 'bottom-left' ? 'left-3' : 'right-3'].join(' ')}>W</div>}
          {settings.call_enabled && <div className={['absolute w-10 h-10 rounded-full bg-[#4472C4] flex items-center justify-center text-white text-xs', settings.call_position === 'bottom-left' ? 'left-3' : 'right-3', sameSide ? 'bottom-16' : 'bottom-3'].join(' ')}>📞</div>}
        </div>
        <p className="text-xs text-zinc-400 text-center mt-3">Updates live as you change settings.</p>
      </AdminCard>
    </div>
  )
}

function SocialTab({ settings, set, onSave }: { settings: SiteSettings; set: SetFn; onSave: () => void }) {
  const fields: Array<{ key: keyof SiteSettings; label: string }> = [
    { key: 'social_instagram_url', label: 'Instagram URL' }, { key: 'social_facebook_url', label: 'Facebook URL' },
    { key: 'social_linkedin_url', label: 'LinkedIn URL' }, { key: 'social_youtube_url', label: 'YouTube URL' },
    { key: 'social_tiktok_url', label: 'TikTok URL' }, { key: 'social_twitter_url', label: 'Twitter / X URL' },
    { key: 'social_google_business_url', label: 'Google Business URL' },
  ]
  return (
    <div className="max-w-2xl">
      <AdminCard title="Social Media Links">
        <div className="space-y-4">
          {fields.map(f => (
            <Field key={f.key} label={f.label} value={(settings[f.key] as string | null) ?? ''} onChange={v => set(f.key, (v || null) as SiteSettings[typeof f.key])} placeholder="https://…" />
          ))}
          <p className="text-xs text-zinc-400">Leave empty to hide the icon in the footer.</p>
          <AdminButton variant="orange" onClick={onSave}>Save Social Links</AdminButton>
        </div>
      </AdminCard>
    </div>
  )
}

function AnnouncementTab({ settings, set, toggle, onSave }: { settings: SiteSettings; set: SetFn; toggle: (k: keyof SiteSettings) => void; onSave: () => void }) {
  return (
    <div className="max-w-2xl">
      <AdminCard title="Announcement Bar">
        <div className="space-y-4">
          <Toggle label="Enable Announcement Bar" checked={settings.announcement_bar_enabled} onChange={() => toggle('announcement_bar_enabled')} />
          <Field label="Announcement Text" value={settings.announcement_bar_text} onChange={v => set('announcement_bar_text', v)} placeholder="Free technical SEO audit this month" />
          <div className="grid grid-cols-2 gap-3">
            <ColorField label="Background Color" value={settings.announcement_bar_bg_color} onChange={v => set('announcement_bar_bg_color', v)} />
            <ColorField label="Text Color" value={settings.announcement_bar_text_color} onChange={v => set('announcement_bar_text_color', v)} />
          </div>
          <Field label="Link URL (optional)" value={settings.announcement_bar_link ?? ''} onChange={v => set('announcement_bar_link', (v || null) as SiteSettings['announcement_bar_link'])} placeholder="/contact" />
          <div>
            <AdminLabel>Live Preview</AdminLabel>
            <div className="rounded-lg px-4 py-2 text-center text-sm font-medium" style={{ backgroundColor: settings.announcement_bar_bg_color, color: settings.announcement_bar_text_color }}>
              {settings.announcement_bar_text || 'Your announcement here'}
            </div>
          </div>
          <AdminButton variant="orange" onClick={onSave}>Save Announcement Bar</AdminButton>
        </div>
      </AdminCard>
    </div>
  )
}

function SeoTab({ settings, set, onSave }: { settings: SiteSettings; set: SetFn; onSave: () => void }) {
  return (
    <div className="max-w-2xl space-y-5">
      <AdminCard title="Google Analytics">
        <div className="space-y-4">
          <Field label="GA4 Measurement ID" value={settings.ga4_id} onChange={v => set('ga4_id', v)} placeholder="G-XXXXXXXXXX" helper="From analytics.google.com" />
          <Field label="GTM Container ID" value={settings.gtm_id} onChange={v => set('gtm_id', v)} placeholder="GTM-XXXXXXX" />
        </div>
      </AdminCard>
      <AdminCard title="Google Search Console">
        <Field label="Verification Meta Tag" value={settings.gsc_meta} onChange={v => set('gsc_meta', v)} placeholder='<meta name="google-site-verification" content="…">' helper="Paste the full meta tag from Search Console" />
      </AdminCard>
      <AdminCard title="Default SEO Fallbacks">
        <div className="space-y-4">
          <div>
            <Field label="Default Meta Title" value={settings.default_meta_title} onChange={v => set('default_meta_title', v)} />
            <CharCounter length={settings.default_meta_title.length} max={60} />
          </div>
          <div>
            <Field label="Default Meta Description" value={settings.default_meta_description} onChange={v => set('default_meta_description', v)} />
            <CharCounter length={settings.default_meta_description.length} max={160} />
          </div>
          <MediaPicker label="Default OG Image" value={settings.default_og_image} onChange={v => set('default_og_image', v)} />
          <p className="text-xs text-zinc-400">Used on pages without custom SEO settings.</p>
          <AdminButton variant="orange" onClick={onSave}>Save SEO &amp; Analytics</AdminButton>
        </div>
      </AdminCard>
    </div>
  )
}

function EmailTab({ settings, set, onSave, onTest }: { settings: SiteSettings; set: SetFn; onSave: () => void; onTest: () => void }) {
  const isResend = settings.email_provider !== 'smtp'
  return (
    <div className="max-w-2xl space-y-5">
      <AdminCard title="Lead Notification Email">
        <Field label="Admin Email (receives leads)" value={settings.admin_email} onChange={v => set('admin_email', v)} helper="New lead notifications are sent here" />
      </AdminCard>
      <AdminCard title="Email Provider">
        <div className="space-y-4">
          <Radio name="email_provider" value={settings.email_provider} onChange={v => set('email_provider', v as SiteSettings['email_provider'])} options={[{ value: 'resend', label: 'Resend' }, { value: 'smtp', label: 'Custom SMTP' }]} />
          {isResend ? (
            <>
              <Field label="Resend API Key" type="password" value={settings.resend_api_key} onChange={v => set('resend_api_key', v)} placeholder="re_xxxxxxxxxxxx" helper="Stored securely — shown masked after saving" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="From Email" value={settings.resend_from_email} onChange={v => set('resend_from_email', v)} placeholder="noreply@seoexpertsagency.co.uk" />
                <Field label="From Name" value={settings.resend_from_name} onChange={v => set('resend_from_name', v)} placeholder="SEO Expert Agency" />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="SMTP Host" value={settings.smtp_host} onChange={v => set('smtp_host', v)} placeholder="smtp.gmail.com" />
                <Field label="SMTP Port" value={settings.smtp_port} onChange={v => set('smtp_port', v)} placeholder="587" />
                <Field label="SMTP User" value={settings.smtp_user} onChange={v => set('smtp_user', v)} />
                <Field label="SMTP Password" type="password" value={settings.smtp_password} onChange={v => set('smtp_password', v)} />
                <Field label="From Email" value={settings.smtp_from_email} onChange={v => set('smtp_from_email', v)} />
                <Field label="From Name" value={settings.smtp_from_name} onChange={v => set('smtp_from_name', v)} />
              </div>
              <p className="text-xs text-amber-700">Test email currently supports the Resend provider only.</p>
            </>
          )}
          <div className="flex items-center gap-3">
            <AdminButton variant="orange" onClick={onSave}>Save Email Settings</AdminButton>
            <AdminButton variant="outline" onClick={onTest}>🧪 Send Test Email</AdminButton>
          </div>
        </div>
      </AdminCard>
    </div>
  )
}
