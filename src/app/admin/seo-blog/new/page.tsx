import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { SeoBlogForm, EMPTY_SEO_BLOG } from '@/components/admin/seo-blog/SeoBlogForm'
import { createServiceClient } from '@/lib/supabase/service'

export const metadata = { title: 'Add New Blog' }
export const dynamic = 'force-dynamic'

export default async function NewSeoBlogPage() {
  const service = createServiceClient()
  const { data: categories } = await service.from('blog_categories').select('id, name').order('name')

  return (
    <>
      <AdminTopbar title="ADD NEW BLOG" />
      <div className="p-6">
        <SeoBlogForm initial={EMPTY_SEO_BLOG} categories={categories ?? []} />
      </div>
    </>
  )
}
