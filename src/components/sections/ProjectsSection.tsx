import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { SEOProjectData } from '@/lib/data/agency-data'
import { getProjects } from '@/lib/data/content'
import { ProjectCard } from '@/components/sections/ProjectCard'

interface ProjectsSectionProps {
  projects?: SEOProjectData[]
  title?: React.ReactNode
  subtitle?: React.ReactNode
  eyebrow?: React.ReactNode
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
            <ProjectCard key={project.slug} project={project} />
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
