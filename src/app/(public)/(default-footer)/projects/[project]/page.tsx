import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, Layers, BarChart3, Clock, Building } from 'lucide-react'
import { HeroSection } from '@/components/sections/HeroSection'
import { HeroLeadForm } from '@/components/sections/HeroLeadForm'
import { CTABanner } from '@/components/sections/CTABanner'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { getProjects } from '@/lib/data/content'
import { generateServicePageSchema } from '@/lib/page-engine/schema'
import { CustomSchemas } from '@/components/seo/CustomSchemas'
import { getProjectSeo } from '@/lib/get-page-seo'
import { getHreflangCode } from '@/lib/market'

interface ProjectPageProps {
  params: Promise<{ project: string }>
}

export async function generateStaticParams() {
  return (await getProjects()).map(p => ({ project: p.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const projects = await getProjects()
  const { project: slug } = await params
  const project = projects.find(p => p.slug === slug)

  if (!project) {
    return { title: 'Case Study Not Found | SEO Expert Agency' }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seoexpertsagency.co.uk'
  const url = `${siteUrl}/projects/${project.slug}`

  return {
    title: `${project.title} — Case Study | SEO Expert Agency`,
    description: project.summary,
    alternates: {
      canonical: url,
      languages: { [getHreflangCode()]: url, 'x-default': url },
    },
    openGraph: {
      title: `${project.title} — Case Study | SEO Expert Agency`,
      description: project.summary,
      url,
      type: 'article',
    },
  }
}

export const revalidate = 3600

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const projects = await getProjects()
  const { project: slug } = await params
  const project = projects.find(p => p.slug === slug)

  if (!project) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seoexpertsagency.co.uk'
  const projectUrl = `${siteUrl}/projects/${project.slug}`

  const seoJson = await getProjectSeo(slug)
  const schema = generateServicePageSchema({
    service: project.title,
    url: projectUrl,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Projects', url: '/projects' },
      { name: project.title, url: `/projects/${project.slug}` },
    ],
  })

  const otherProjects = projects.filter(p => p.slug !== project.slug)
  const hasResults = Boolean(project.results && project.results.length > 0)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <CustomSchemas seoJson={seoJson} faqs={undefined} />

      {/* 1. Project Hero */}
      <HeroSection
        breadcrumb={
          <Breadcrumb
            tone="dark"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Projects', href: '/projects' },
              { label: project.title },
            ]}
          />
        }
        badge="CASE STUDY"
        h1={project.title}
        subtitle={project.summary}
        ctaLabel="Request Similar Growth Strategy"
        ctaHref="#case-form"
        rightSlot={
          <HeroLeadForm
            sourcePageSlug={`case-study-${project.slug}`}
            heading="Scale Your Organic Traffic"
            subtitle="Get custom roadmap modeled on our proven frameworks."
          />
        }
      />

      {/* 2. Client Overview & Engagement Details */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Building size={14} className="text-primary" /> Client
              </p>
              <p className="text-sm font-bold text-dark">{project.client}</p>
            </div>

            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Layers size={14} className="text-primary" /> Industry
              </p>
              <p className="text-sm font-bold text-dark">{project.industry}</p>
            </div>

            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Clock size={14} className="text-primary" /> Timeline
              </p>
              <p className="text-sm font-bold text-dark">{project.timeline}</p>
            </div>

            {project.results && project.results.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <BarChart3 size={14} className="text-primary" /> Core Impact
                </p>
                <p className="text-sm font-extrabold text-primary">{project.results[0].metric}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. The Challenge & The Strategy */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <span className="text-xs font-extrabold text-red-600 tracking-wider uppercase mb-2 inline-block">
              THE INITIAL BOTTLENECK
            </span>
            <h2 className="display-tight text-balance text-2xl sm:text-3xl font-extrabold text-dark mb-4">
              The Challenge &amp; Baseline Situation
            </h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed leading-relaxed">
              {project.challenge}
            </p>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <span className="text-xs font-extrabold text-primary tracking-wider uppercase mb-2 inline-block">
              OUR STRATEGIC HYPOTHESIS
            </span>
            <h2 className="display-tight text-balance text-2xl sm:text-3xl font-extrabold text-dark mb-4">
              The Strategic Search Roadmap
            </h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed leading-relaxed">
              {project.strategy}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Phased Implementation Breakdown */}
      <section className="py-16 lg:py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold text-primary tracking-wider uppercase mb-2 inline-block">
              EXECUTION DETAIL
            </span>
            <h2 className="display-tight text-balance text-2xl sm:text-3xl font-extrabold text-dark">
              Step-by-Step Phased Implementation
            </h2>
          </div>

          <div className="space-y-6">
            {project.implementation.map((phase, idx) => (
              <div key={idx} className="card-premium p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-extrabold text-primary bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-200/60">
                    {phase.phase}
                  </span>
                  <h3 className="font-bold text-base text-dark">{phase.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-1">
                  {phase.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Verified Results & Deliverables */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold text-primary tracking-wider uppercase mb-2 inline-block">
              {hasResults ? 'QUANTIFIABLE IMPACT' : 'ENGAGEMENT SCOPE'}
            </span>
            <h2 className="display-tight text-balance text-2xl sm:text-3xl font-extrabold text-dark">
              {hasResults ? 'Verified Outcomes & Deliverables' : 'Project Deliverables'}
            </h2>
          </div>

          {/* Figures appear only where the client has verified and approved them. */}
          {hasResults && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {project.results!.map((r, i) => (
                <div key={i} className="card-premium p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-primary-50 to-white border border-primary-200/60 text-center">
                  <p className="text-3xl sm:text-4xl font-extrabold text-primary mb-1">{r.metric}</p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700">{r.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="card-premium p-8 rounded-3xl bg-slate-50 border border-slate-200/80 max-w-3xl mx-auto">
            <h3 className="text-base font-extrabold text-dark mb-4">Completed Project Assets:</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              {project.deliverables.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Services Used */}
      <section className="py-12 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Services Deployed in This Engagement:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {project.services.map((s, i) => (
              <span
                key={i}
                className="bg-white border border-slate-200 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Other Case Studies */}
      {otherProjects.length > 0 && (
        <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="display-tight text-balance text-2xl font-extrabold text-dark mb-8 text-center">
              Explore More Case Studies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {otherProjects.map(p => (
                <div key={p.slug} className="card-premium p-6 rounded-2xl bg-slate-50/50 border border-slate-200/80 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-primary bg-white px-2 py-0.5 rounded-md border border-slate-200 mb-2 inline-block">
                      {p.industry}
                    </span>
                    <h3 className="font-bold text-base text-dark mb-2">{p.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-4">{p.summary}</p>
                  </div>
                  <Link href={`/projects/${p.slug}`} className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 mt-auto">
                    View Case Study <ArrowRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Conversion CTA Banner */}
      <CTABanner
        title="Ready to Build Your Organic Success Story?"
        subtitle="Schedule a free technical & keyword roadmap presentation with our senior SEO directors."
        ctaLabel="Get Your Free Roadmap"
        ctaHref="/contact"
      />
    </>
  )
}
