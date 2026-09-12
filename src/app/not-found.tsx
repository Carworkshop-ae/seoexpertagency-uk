import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Home } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Page Not Found | SEO Expert Agency',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-slate-50">
      <div className="max-w-md card-premium p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl">
        <p className="text-7xl font-extrabold text-primary mb-2 tracking-tight">404</p>
        <h1 className="text-2xl font-extrabold text-dark mb-3">Page Not Found</h1>
        <p className="text-xs sm:text-sm text-slate-600 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Head back home or contact our strategists.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary-600 transition-all"
          >
            <Home size={15} /> Back to Homepage
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:border-primary hover:text-primary bg-slate-50 transition-all"
          >
            Contact Us <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
