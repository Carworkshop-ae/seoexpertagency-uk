'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { SEO_SERVICES } from '@/lib/data/agency-data'

// Client component: the server parent passes the published list; the static
// import is the fallback for callers that do not.
type ServiceOption = { id: string; slug: string; name: string }

interface ContactFormProps {
  services?: ServiceOption[]
  heroH1?: ReactNode
  heroSubtitle?: ReactNode
}

export function ContactForm({
  services,
  heroH1 = 'Get in Touch With Our SEO Strategists',
  heroSubtitle = 'Request a comprehensive technical audit, discuss custom retainers, or explore strategic partnerships.',
}: ContactFormProps) {
  const serviceOptions: ServiceOption[] = services ?? SEO_SERVICES
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [service, setService] = useState('Technical SEO')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        website_url: websiteUrl.trim(),
        service_name: service,
        message: message.trim(),
        honeypot,
        source_page_slug: 'contact-page',
      }

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error ?? 'Submission failed. Please check your information.')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed. Please try again.')
    }
  }

  const inputCls =
    'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all'

  return (
    <div>
      <div className="bg-mesh py-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
          <h1 className="display-tight text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark mt-4">
            {heroH1}
          </h1>
          <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-2xl">
            {heroSubtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Form Column */}
          <div className="lg:col-span-7">
            {status === 'success' ? (
              <div className="card-premium p-8 rounded-3xl bg-white border border-emerald-200 shadow-xl text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-extrabold text-dark mb-2">
                  Thank You, {name}!
                </h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-md mx-auto">
                  Our SEO directors have received your inquiry for{' '}
                  <span className="font-semibold text-primary">{websiteUrl || 'your website'}</span>. We will review your search landscape and respond within 24 business hours.
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
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary-600"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="card-premium p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl"
              >
                <h2 className="text-xl font-extrabold text-dark mb-1">
                  Request a Custom SEO Proposal
                </h2>
                <p className="text-xs text-slate-500 mb-6">
                  Fill in your website details below to receive a free organic traffic gap analysis.
                </p>

                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={e => setHoneypot(e.target.value)}
                  className="sr-only"
                  aria-hidden="true"
                />

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Sarah Jenkins"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Business Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="sarah@company.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+971 50 123 4567"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Website URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="https://company.com"
                        value={websiteUrl}
                        onChange={e => setWebsiteUrl(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Service Requirement
                    </label>
                    <select
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
                      <option value="Enterprise Technical Audit">Enterprise Technical Audit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Growth Goals &amp; Competitors
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share your primary target markets, top competitors, or current organic bottlenecks..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className={inputCls}
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-sm shadow-md transition-all disabled:opacity-60"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Submitting Inquiry...
                      </>
                    ) : (
                      <>
                        Request Strategy Proposal
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card-premium p-7 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-6">Our Agency Headquarters</h3>
              <div className="space-y-5 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-primary shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-white">Dubai HQ</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Level 24, Boulevard Plaza Tower 1, Downtown Dubai, UAE
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-primary shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-white">London Hub</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      100 Bishopsgate, City of London, EC2N 4AG, United Kingdom
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                  <Phone size={18} className="text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Direct Consultation Line</p>
                    <a href="tel:+9714800736" className="text-sm font-bold text-white hover:text-primary transition-colors">
                      +971 4 800 736
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Email Address</p>
                    <a href="mailto:hello@seoexpertagency.com" className="text-sm font-bold text-white hover:text-primary transition-colors">
                      hello@seoexpertagency.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Working Hours</p>
                    <p className="text-xs font-semibold text-slate-200">
                      Mon – Fri: 9:00 AM – 6:00 PM (GST / GMT)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-premium p-6 rounded-2xl bg-white border border-slate-200/80">
              <h4 className="font-bold text-sm text-dark mb-2">What Happens After You Submit?</h4>
              <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside leading-relaxed">
                <li>A Senior SEO Director reviews your website architecture and backlink profile.</li>
                <li>We analyze competitor keyword gaps in your target commercial vertical.</li>
                <li>We deliver a free 20-page audit and customized 12-month growth roadmap.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
