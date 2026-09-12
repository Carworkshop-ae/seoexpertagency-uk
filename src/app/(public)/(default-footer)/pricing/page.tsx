import type { Metadata } from 'next'
import { PageHeader } from '@/components/sections/PageHeader'
import { PackagesSection } from '@/components/sections/PackagesSection'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { FAQSection } from '@/components/sections/FAQSection'
import { CTABanner } from '@/components/sections/CTABanner'

export const metadata: Metadata = {
  title: 'Transparent SEO Pricing & Retainers | SEO Expert Agency',
  description:
    'Explore transparent, predictable SEO packages: Basic, Silver, and Gold tiers. No long-term lock-in contracts, 100% white-hat organic growth.',
}

export const revalidate = 86400

export default function PricingPage() {
  return (
    <>
      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Pricing' }]}
        eyebrow="TRANSPARENT ENGAGEMENT TIERS"
        title="Predictable, High-ROI SEO Packages"
        subtitle="Every tier is designed to deliver demonstrable search performance and outrank your commercial competitors."
      />

      <PackagesSection />

      <WhyChooseUs />

      <ProcessSteps />

      <FAQSection />

      <CTABanner
        title="Need a Custom Enterprise Scope?"
        subtitle="We build bespoke multi-market search strategies and dedicated embedded SEO team solutions."
        ctaLabel="Request Custom Retainer"
        ctaHref="/contact"
      />
    </>
  )
}
