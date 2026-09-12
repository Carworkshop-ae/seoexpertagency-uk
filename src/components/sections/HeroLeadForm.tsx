'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { SEO_SERVICES } from '@/lib/data/agency-data'

// Client component: the server parent passes the published list; the static
// import is the fallback for callers that do not.
type ServiceOption = { id: string; slug: string; name: string }

interface HeroLeadFormProps {
  sourcePageSlug?: string
  heading?: string
  subtitle?: string
  ctaText?: string
  services?: ServiceOption[]
}

export function HeroLeadForm({
  sourcePageSlug = 'homepage-hero',
  heading = 'Get Your Free SEO Audit & Strategy',
  subtitle = 'Discover high-intent keyword opportunities and technical fixes.',
  ctaText = "Let's Grow",
  services,
}: HeroLeadFormProps) {
  const serviceOptions: ServiceOption[] = services ?? SEO_SERVICES
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [service, setService] = useState('Technical SEO')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        website_url: websiteUrl.trim(),
        service_name: service,
        message: message.trim(),
        honeypot,
        source_page_slug: sourcePageSlug,
      }

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string; details?: Record<string, string[]> }
        const msg = data.details
          ? Object.values(data.details).flat().join(', ')
          : (data.error || 'Unable to submit your request. Please check your details.')
        setErrorMessage(msg)
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setErrorMessage('Network error occurred. Please try again or contact us directly.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="card-premium p-6 sm:p-8 rounded-2xl bg-white border border-emerald-200 shadow-lg text-center anim-zoom">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-3">
          <CheckCircle2 size={28} />
        </div>
        <h3 className="text-lg font-extrabold text-dark mb-1">Proposal Request Received</h3>
        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Thank you, <span className="font-semibold text-slate-900">{name}</span>. An SEO strategist will review your website (<span className="font-semibold text-primary">{websiteUrl || 'provided URL'}</span>) and deliver your custom audit within 24 business hours.
        </p>
        <button
          onClick={() => {
            setStatus('idle')
            setName('')
            setEmail('')
            setPhone('')
            setWebsiteUrl('')
            setMessage('')
          }}
          className="text-xs font-bold text-primary hover:underline"
        >
          Submit another inquiry
        </button>
      </div>
    )
  }

  const inputCls =
    'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all'

  return (
    <form
      onSubmit={handleSubmit}
      className="card-premium p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-xl relative"
      noValidate={false}
    >
      <div className="mb-4">
        <h2 className="text-base sm:text-lg font-extrabold text-dark leading-tight">
          {heading}
        </h2>
        <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
      </div>

      {/* Hidden honeypot field for bot protection */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={e => setHoneypot(e.target.value)}
        className="sr-only"
        aria-hidden="true"
      />

      <div className="space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="lead-name" className="block text-[11px] font-semibold text-slate-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lead-name"
              type="text"
              required
              placeholder="e.g. Sarah Jenkins"
              value={name}
              onChange={e => setName(e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="lead-email" className="block text-[11px] font-semibold text-slate-700 mb-1">
              Business Email <span className="text-red-500">*</span>
            </label>
            <input
              id="lead-email"
              type="email"
              required
              placeholder="sarah@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="lead-phone" className="block text-[11px] font-semibold text-slate-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="lead-phone"
              type="tel"
              required
              placeholder="+971 50 123 4567"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="lead-website" className="block text-[11px] font-semibold text-slate-700 mb-1">
              Website URL <span className="text-red-500">*</span>
            </label>
            <input
              id="lead-website"
              type="text"
              required
              placeholder="https://yourcompany.com"
              value={websiteUrl}
              onChange={e => setWebsiteUrl(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label htmlFor="lead-service" className="block text-[11px] font-semibold text-slate-700 mb-1">
            Select SEO Service
          </label>
          <select
            id="lead-service"
            value={service}
            onChange={e => setService(e.target.value)}
            className={inputCls}
          >
            {serviceOptions.map(s => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
            <option value="Complete SEO Retainer">Complete SEO Retainer</option>
            <option value="Enterprise SEO Consultation">Enterprise SEO Consultation</option>
          </select>
        </div>

        <div>
          <label htmlFor="lead-message" className="block text-[11px] font-semibold text-slate-700 mb-1">
            Growth Goal / Requirement
          </label>
          <textarea
            id="lead-message"
            rows={2}
            placeholder="Tell us about your target keywords, competitors, or organic goals..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            className={inputCls}
          />
        </div>

        {status === 'error' && (
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Analyzing Website...
            </>
          ) : (
            <>
              {ctaText}
              <ArrowRight size={14} />
            </>
          )}
        </button>

        <p className="text-slate-400 text-[10px] text-center">
          100% Privacy Guaranteed · Free In-Depth Audit · No Obligation
        </p>
      </div>
    </form>
  )
}
