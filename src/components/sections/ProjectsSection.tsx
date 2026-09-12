import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { SEOProjectData } from '@/lib/data/agency-data'
import { getProjects } from '@/lib/data/content'

interface ProjectsSectionProps {
  projects?: SEOProjectData[]
  title?: string
  subtitle?: string
  eyebrow?: string
  viewMoreHref?: string
}

export async function ProjectsSection({
  projects: projectsProp,
  title = 'Proven Organic Growth Case Studies',
  subtitle = 'Discover how our technical architecture audits, strategic content hubs, and authority campaigns deliver predictable commercial search impact.',
  eyebrow = 'PROVEN METHODOLOGY',
  viewMoreHref = '/projects',
}: ProjectsSectionProps) {
  const projects = projectsProp ?? await getProjects()
  // No published case studies yet — omit the section rather than rendering an
  // empty grid. Reappears automatically once projects are published in the CMS.
  if (projects.length === 0) return null

  return (
    <section className="py-16 lg:py-24 bg-slate-50/60 border-b border-slate-100" aria-labelledby="projects-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16 max-w-2xl mx-auto">
          {eyebrow && (
            <span className="inline-block text-xs font-extrabold text-primary tracking-wider uppercase mb-2">
              {eyebrow}
            </span>
          )}
          <h2 id="projects-heading" className="display-tight text-balance text-3xl sm:text-4xl font-extrabold text-dark mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-pretty text-slate-600 text-sm sm:text-base leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <div
              key={project.slug}
              className="group card-premium rounded-3xl bg-white border border-slate-200/80 p-7 sm:p-8 flex flex-col justify-between hover:border-primary/40 transition-all duration-200 shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-primary bg-primary-50 px-3 py-1 rounded-full border border-primary-200/50">
                    {project.industry}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {project.timeline}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-dark group-hover:text-primary transition-colors mb-2 leading-snug">
                  {project.title}
                </h3>

                <p className="text-xs font-medium text-slate-500 mb-4">
                  Client: <span className="text-slate-800 font-semibold">{project.client}</span>
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {project.summary}
                </p>

                {/* Client-verified metrics only — omitted when none are approved. */}
                {project.results && project.results.length > 0 && (
                  <div className="space-y-2.5 mb-6 pt-5 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Key Impact Highlights:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {project.results.slice(0, 2).map((res, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                          <p className="text-sm font-extrabold text-primary">{res.metric}</p>
                          <p className="text-[10px] text-slate-600 font-medium truncate">{res.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.services.slice(0, 3).map((s, idx) => (
                    <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                >
                  Read Full Case Study <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {viewMoreHref && (
          <div className="text-center mt-12">
            <Link
              href={viewMoreHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 hover:border-primary px-6 py-3.5 text-xs font-bold text-slate-800 hover:text-primary shadow-sm transition-all"
            >
              View All Case Studies &amp; Results
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
