'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { EditableText } from '@/components/inline-edit/EditableText'
import { useAdminEdit } from '@/components/inline-edit/AdminEditProvider'
import type { SEOProjectData } from '@/lib/data/agency-data'

interface ProjectCardProps {
  project: SEOProjectData
}

// Mirrors ServiceFeatureCard's onSave pattern: getProjects() only ever returns
// real DB rows (or an empty array — SEO_PROJECTS has no seed fallback, unlike
// services/industries), so `project.id` is always a real row here.
export function ProjectCard({ project }: ProjectCardProps) {
  const { isAdmin, editMode, cards } = useAdminEdit()
  const canEdit = isAdmin && editMode
  const draft = cards.patchFor('projects', project.id)
  const p = {
    industry: (draft?.industry as string | undefined) ?? project.industry,
    timeline: (draft?.timeline as string | undefined) ?? project.timeline,
    title: (draft?.title as string | undefined) ?? project.title,
    client: (draft?.client as string | undefined) ?? project.client,
    summary: (draft?.summary as string | undefined) ?? project.summary,
  }

  // Buffered until "Done Editing" (see AdminEditProvider).
  function save(patch: Record<string, unknown>) {
    cards.patch('projects', project.id, patch, `Edit ${p.title}`)
  }

  return (
    <div className="group card-premium rounded-3xl bg-white border border-slate-200/80 p-7 sm:p-8 flex flex-col justify-between hover:border-primary/40 transition-all duration-200 shadow-md">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold text-primary bg-primary-50 px-3 py-1 rounded-full border border-primary-200/50">
            <EditableText value={p.industry} onSave={canEdit ? v => save({ industry: v }) : undefined} />
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            <EditableText value={p.timeline} onSave={canEdit ? v => save({ timeline: v }) : undefined} />
          </span>
        </div>

        <h3 className="text-lg font-extrabold text-dark group-hover:text-primary transition-colors mb-2 leading-snug">
          <EditableText value={p.title} onSave={canEdit ? v => save({ title: v }) : undefined} />
        </h3>

        <p className="text-xs font-medium text-slate-500 mb-4">
          Client: <span className="text-slate-800 font-semibold">
            <EditableText value={p.client} onSave={canEdit ? v => save({ client: v }) : undefined} />
          </span>
        </p>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          <EditableText multiline value={p.summary} onSave={canEdit ? v => save({ summary: v }) : undefined} />
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
  )
}
