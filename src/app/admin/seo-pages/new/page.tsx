import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { SeoPageForm } from '@/components/admin/seo-pages/SeoPageForm'

export const metadata = { title: 'New SEO Page' }
export const dynamic = 'force-dynamic'

export default async function NewSeoPagePage() {
  return (
    <>
      <AdminTopbar title="ADD SEO PAGE" />
      <div className="p-6">
        <SeoPageForm
          initial={{
            headline: '', subheadline: '', overview: '',
            meta_keyword: '', why_choose_us_heading: '', why_choose_us_json: [], faq_json: [],
            slug: '', status: 'draft', sort_order: 0,
            seo_title: '', seo_description: '', og_image_url: '',
          }}
        />
      </div>
    </>
  )
}
