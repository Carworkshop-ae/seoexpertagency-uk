'use client'

import Link from 'next/link'
import { Check, Sparkles, ArrowRight } from 'lucide-react'
import type { SEOPackageData } from '@/lib/data/agency-data'
import { EditableText } from '@/components/inline-edit/EditableText'
import { useAdminEdit } from '@/components/inline-edit/AdminEditProvider'

interface PackageCardProps {
  pkg: SEOPackageData
}

// Inline-editable version of the pricing card — name, price, description and
// each feature line save straight to the `packages` table (PATCH
// /api/admin/packages/[id]). Tiers are fixed (no add/remove-tier UI here),
// matching the fixed-3-rows database constraint from migration 006.
export function PackageCard({ pkg }: PackageCardProps) {
  const { cards } = useAdminEdit()
  const isFeatured = pkg.isPopular
  const draft = cards.patchFor('packages', pkg.id)
  const name = (draft?.name as string | undefined) ?? pkg.name
  const price = (draft?.price as string | undefined) ?? pkg.price
  const description = (draft?.description as string | undefined) ?? pkg.description
  const features = (draft?.features_json as string[] | undefined) ?? pkg.features

  // Buffered until "Done Editing" (see AdminEditProvider).
  function save(patch: Record<string, unknown>) {
    cards.patch('packages', pkg.id, patch, `Edit ${name}`)
  }

  function saveFeature(index: number, value: string) {
    const next = features.map((f, i) => (i === index ? value : f))
    save({ features_json: next })
  }

  return (
    <div
      className={[
        'relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-200',
        isFeatured
          ? 'bg-gradient-to-b from-primary to-primary-600 text-white shadow-2xl ring-2 ring-primary lg:-translate-y-2'
          : 'bg-white border border-slate-200/90 text-slate-900 shadow-md hover:shadow-xl hover:border-primary/30',
      ].join(' ')}
    >
      {isFeatured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-dark text-white text-[11px] font-extrabold tracking-wider uppercase shadow-md inline-flex items-center gap-1.5">
          <Sparkles size={13} className="text-primary" />
          Most Popular Choice
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className={['text-base font-extrabold tracking-wider uppercase', isFeatured ? 'text-white' : 'text-slate-900'].join(' ')}>
            <EditableText value={name} onSave={v => save({ name: v })} as="span" />
          </h3>
          <span className={['text-[11px] font-bold px-2.5 py-0.5 rounded-full', isFeatured ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'].join(' ')}>
            {pkg.tier.toUpperCase()} TIER
          </span>
        </div>

        <div className="mb-4">
          <span className={['text-3xl sm:text-4xl font-extrabold tracking-tight', isFeatured ? 'text-white' : 'text-dark'].join(' ')}>
            <EditableText value={price} onSave={v => save({ price: v })} as="span" />
          </span>
          <span className={['text-xs ml-2 font-medium', isFeatured ? 'text-blue-100' : 'text-slate-500'].join(' ')}>
            /{pkg.billingPeriod}
          </span>
        </div>

        <p className={['text-xs sm:text-sm leading-relaxed mb-6', isFeatured ? 'text-blue-50' : 'text-slate-600'].join(' ')}>
          <EditableText value={description} onSave={v => save({ description: v })} as="span" multiline />
        </p>

        <div className={['pt-6 border-t mb-6 space-y-3 text-xs sm:text-sm', isFeatured ? 'border-white/20 text-white' : 'border-slate-100 text-slate-700'].join(' ')}>
          <p className={['text-xs font-bold uppercase tracking-wider mb-3', isFeatured ? 'text-blue-200' : 'text-slate-400'].join(' ')}>
            What&apos;s Included:
          </p>
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <div className={['shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5', isFeatured ? 'bg-white text-primary' : 'bg-primary-50 text-primary'].join(' ')}>
                <Check size={11} strokeWidth={3} />
              </div>
              <EditableText
                value={feature}
                onSave={v => saveFeature(idx, v)}
                as="span"
                multiline
                className="leading-snug"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4">
        <Link
          href={`/contact?package=${pkg.id}`}
          className={[
            'w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all',
            isFeatured ? 'bg-white text-primary hover:bg-slate-50 hover:shadow-lg' : 'bg-primary text-white hover:bg-primary-600 hover:shadow-lg',
          ].join(' ')}
        >
          {pkg.ctaLabel}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
