import { notFound } from 'next/navigation'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { SeoBlogForm, type SeoBlogFormValues } from '@/components/admin/seo-blog/SeoBlogForm'
import { createServiceClient } from '@/lib/supabase/service'

export const metadata = { title: 'Edit Blog Page' }
export const dynamic = 'force-dynamic'

export default async function EditSeoBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = createServiceClient()
  const { data: post } = await service.from('blog_posts').select('*').eq('id', id).maybeSingle()
  if (!post) notFound()
  const { data: categories } = await service.from('blog_categories').select('id, name').order('name')

  const initial: SeoBlogFormValues = {
    published_at: post.published_at ? post.published_at.slice(0, 10) : '',
    title: post.title,
    slug: post.slug,
    seo_title: post.seo_title ?? '',
    meta_keyword: post.meta_keyword ?? '',
    seo_description: post.seo_description ?? '',
    image_webp_url: post.image_webp_url ?? '',
    image_alt: post.image_alt ?? '',
    excerpt: post.excerpt ?? '',
    blockquote: post.blockquote ?? '',
    content: post.content ?? '',
    tags: post.tags ?? '',
    status: post.status,
    is_featured: post.is_featured ?? false,
    category_id: post.category_id ?? '',
  }

  return (
    <>
      <AdminTopbar title="EDIT BLOG PAGE" />
      <div className="p-6">
        <SeoBlogForm postId={id} initial={initial} categories={categories ?? []} />
      </div>
    </>
  )
}
