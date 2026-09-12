import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/sections/PageHeader'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { CTABanner } from '@/components/sections/CTABanner'
import { FAQSection } from '@/components/sections/FAQSection'
import { getProjects } from '@/lib/data/content'
import { generateCollectionSchema } from '@/lib/page-engine/schema'

export const metadata: Metadata = {
  title: 'Case Studies & Proven Results | SEO Expert Agency',
  description:
    'How we approach organic growth engagements — our technical audit, content, and authority frameworks, and the case studies we publish as clients approve them.',
}

export const revalidate = 3600

export default async function ProjectsDirectoryPage() {
  const projects = await getProjects()
  const schema = generateCollectionSchema({
    name: 'SEO Case Studies & Proven Work',
    description: 'Verified organic search growth case studies.',
    path: '/projects',
    items: projects.map(p => ({ name: p.title, path: `/projects/${p.slug}` })),
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Projects & Case Studies' }]}
        eyebrow="PROVEN ORGANIC RESULTS"
        title="SEO Case Studies & Client Success Stories"
        subtitle="Detailed breakdowns of how our data-backed search strategies, technical audits, and content frameworks solve complex ranking challenges."
      />

      {/* Projects Showcase — renders nothing until case studies are published */}
      <ProjectsSection />

      {projects.length === 0 && (
        <section className="py-16 lg:py-20 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="display-tight text-balance text-2xl sm:text-3xl font-extrabold text-dark mb-3">
              Case Studies In Preparation
            </h2>
            <p className="text-pretty text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
              We publish a client engagement only once the client has reviewed and
              approved the write-up and any figures it reports. Our current studies
              are going through that approval now. In the meantime, we&apos;re happy to
              walk you through relevant work directly on a call.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-600 px-6 py-3.5 text-xs font-bold text-white shadow-[0_6px_20px_rgba(0,102,255,0.3)] transition-all"
            >
              Request Relevant Case Studies
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* Process */}
      <ProcessSteps />

      {/* FAQ */}
      <FAQSection />

      {/* Conversion Banner */}
      <CTABanner
        title="Ready to Achieve Similar Organic Search Growth?"
        subtitle="Book a discovery call to review our methodologies and see what we can accomplish for your website."
        ctaLabel="Get Your Free Growth Roadmap"
        ctaHref="/contact"
      />
    </>
  )
}
