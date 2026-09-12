import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { SeoPageForm } from '@/components/admin/seo-pages/SeoPageForm'
import { createServiceClient } from '@/lib/supabase/service'

export const metadata = { title: 'New SEO Page' }
export const dynamic = 'force-dynamic'

export default async function NewSeoPagePage() {
  const service = createServiceClient()
  const { data: locations } = await service.from('locations').select('id, name, slug, country_code').order('name')
  const states = (locations ?? []).map(l => ({ id: l.id, name: l.name, slug: l.slug, country_code: l.country_code }))

  return (
    <>
      <AdminTopbar title="ADD SEO PAGE" />
      <div className="p-6">
        <SeoPageForm
          states={states}
          initial={{
            location_id: '', headline: '', subheadline: '', overview: '',
            meta_keyword: '', why_choose_us_heading: '', why_choose_us_json: [], faq_json: [],
            slug: '', status: 'draft', sort_order: 0,
            seo_title: '', seo_description: '', og_image_url: '',
          }}
        />
      </div>
    </>
  )
}
