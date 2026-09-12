import Link from 'next/link'
import { Sparkles, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import type { SiteSettings } from '@/types/settings'

interface FooterProps {
  settings: SiteSettings
  footerPages?: unknown
  brandsOverride?: unknown
}

export async function Footer({ settings }: FooterProps) {
  const bgColor = settings.footer_background_color || '#0A1128'
  const textColor = settings.footer_text_color || '#FFFFFF'

  const phone = settings.footer_business_phone || '+971 4 800 736'
  const email = settings.footer_business_email || 'hello@seoexpertagency.com'
  const address = settings.footer_business_address || 'Level 24, Boulevard Plaza Tower 1, Downtown Dubai, UAE'

  return (
    <footer
      style={{ backgroundColor: bgColor, color: textColor }}
      role="contentinfo"
      className="relative overflow-hidden font-sans border-t border-slate-800"
    >
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Top brand & newsletter strip */}
        <div className="pb-12 mb-12 border-b border-slate-800/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                <Sparkles size={16} />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                SEO<span className="text-primary">Expert</span><span className="text-slate-400 font-normal text-sm ml-1">Agency</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              {settings.footer_tagline || 'Leading data-driven search engine optimization agency delivering predictable organic revenue growth and high-intent customer acquisition.'}
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-col sm:flex-row items-start sm:items-center justify-start lg:justify-end gap-3">
            <div className="text-left sm:text-right">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ready to grow?</p>
              <p className="text-sm font-bold text-white">Get your free custom SEO strategy audit</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-bold shadow-lg transition-all"
            >
              Request Free Audit
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 2-Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 text-xs">
          {/* Col 1: Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li><Link href="/" className="hover:text-white hover:underline transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white hover:underline transition-colors">About Our Agency</Link></li>
              <li><Link href="/projects" className="hover:text-white hover:underline transition-colors">Projects &amp; Case Studies</Link></li>
              <li><Link href="/pricing" className="hover:text-white hover:underline transition-colors">Pricing &amp; Packages</Link></li>
              <li><Link href="/blog" className="hover:text-white hover:underline transition-colors">SEO Blog &amp; Insights</Link></li>
              <li><Link href="/faq" className="hover:text-white hover:underline transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/contact" className="hover:text-white hover:underline transition-colors">Contact Our Team</Link></li>
            </ul>
          </div>

          {/* Col 2: Contact Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Contact &amp; HQ
            </h4>
            <div className="space-y-3 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed">{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-primary shrink-0" />
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">{phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-primary shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright notice and legal links */}
        <div className="mt-14 pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>
            {settings.footer_copyright_text || '© 2026 SEO Expert Agency. All rights reserved.'}
          </p>
          <div className="flex gap-5 shrink-0 font-medium">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/faq" className="hover:text-slate-300 transition-colors">FAQs</Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
