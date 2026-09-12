import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { ContentForm } from '@/components/admin/content/ContentForm'
import { projectSections } from '@/components/admin/content/specs'

export const metadata = { title: 'New Case Study' }

export default function NewCaseStudyPage() {
  return (
    <>
      <AdminTopbar title="ADD CASE STUDY" />
      <div className="p-6">
        <ContentForm
          basePath="projects"
          publicPrefix="/projects"
          singular="Case Study"
          titleField="title"
          sections={projectSections}
          initial={{ title: '', client: '', industry: '', timeline: '', summary: '', challenge: '', strategy: '', services: [], implementation_json: [], results_json: [], deliverables_json: [], slug: '', status: 'draft', sort_order: 0, seo_title: '', seo_description: '', og_image_url: '' }}
        />
      </div>
    </>
  )
}
