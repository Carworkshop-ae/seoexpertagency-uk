import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Calendar, User } from 'lucide-react'
import { createPublicSupabase } from '@/lib/supabase/public'
import { PageHeader } from '@/components/sections/PageHeader'
import { Card } from '@/components/ui/Card'
import { CTABanner } from '@/components/sections/CTABanner'
import { generateCollectionSchema } from '@/lib/page-engine/schema'
import type { BlogPost } from '@/types'

export const metadata: Metadata = {
  title: 'SEO Blog & Organic Search Insights | SEO Expert Agency',
  description:
    'Actionable SEO guides, technical breakdowns, algorithm update analysis, and proven organic growth frameworks.',
}

export const revalidate = 3600

const FALLBACK_BLOG_POSTS: Array<Partial<BlogPost> & { title: string; slug: string; excerpt: string; category?: string; content?: string }> = [
  {
    id: 'post-1',
    title: 'How to Scale Organic Search Traffic for B2B SaaS in 2026',
    slug: 'scale-organic-search-saas',
    excerpt: 'A comprehensive playbook on building bottom-of-funnel comparison hubs, programmatically ranking integration pages, and capturing qualified enterprise pipeline.',
    category: 'SaaS SEO',
    published_at: new Date('2026-08-15').toISOString(),
  },
  {
    id: 'post-2',
    title: 'Core Web Vitals & Technical SEO: The Engineering Guide',
    slug: 'core-web-vitals-technical-seo-guide',
    excerpt: 'Step-by-step optimization strategies for INP, LCP, and CLS metrics across modern Next.js and headless e-commerce architectures.',
    category: 'Technical SEO',
    published_at: new Date('2026-08-10').toISOString(),
  },
  {
    id: 'post-3',
    title: 'Topical Authority Frameworks: Moving Beyond Keyword Density',
    slug: 'topical-authority-frameworks',
    excerpt: 'How search engine natural language processing algorithms evaluate domain semantic depth, entity associations, and E-E-A-T signals.',
    category: 'Content Strategy',
    published_at: new Date('2026-08-01').toISOString(),
  },
  {
    id: 'post-4',
    title: 'E-Commerce Faceted Navigation: Complete SEO Best Practices',
    slug: 'ecommerce-faceted-navigation-seo',
    excerpt: 'Eliminating index bloat and parameter crawl traps while ranking lucrative long-tail commercial filter variations.',
    category: 'E-Commerce SEO',
    published_at: new Date('2026-07-25').toISOString(),
  },
  {
    id: 'post-5',
    title: 'High-Impact Digital PR: Earning Editorial Links That Move Rankings',
    slug: 'digital-pr-link-building-strategy',
    excerpt: 'How to create proprietary data studies and linkable assets that journalists naturally cite, generating penalty-proof domain authority.',
    category: 'Link Building',
    published_at: new Date('2026-07-18').toISOString(),
  },
  {
    id: 'post-6',
    title: 'Local 3-Pack Dominance: Multi-Location SEO Playbook',
    slug: 'local-3-pack-dominance-playbook',
    excerpt: 'Proximity signals, citation synchronization, and localized landing page architecture for multi-city businesses.',
    category: 'Local SEO',
    published_at: new Date('2026-07-10').toISOString(),
  },
]

export default async function BlogPage() {
  const supabase = createPublicSupabase()
  const { data: dbPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(12)

  const posts = (dbPosts && dbPosts.length > 0)
    ? dbPosts
    : (FALLBACK_BLOG_POSTS as unknown as BlogPost[])

  const schema = generateCollectionSchema({
    name: 'SEO Expert Agency Blog & Insights',
    description: 'Actionable guides and technical search marketing frameworks.',
    path: '/blog',
    items: posts.map(p => ({ name: p.title, path: `/blog/${p.slug}` })),
  })

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'SEO Blog' }]}
        eyebrow="SEARCH MARKETING RESEARCH"
        title="SEO Insights, Strategy & Technical Analysis"
        subtitle="Actionable playbooks, algorithm tear-downs, and data-backed search strategies written by senior SEO directors."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => {
            const image = post.image_webp_url || post.featured_image
            return (
              <Card key={post.id} padding="none" hover className="overflow-hidden flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <div>
                  <Link href={`/blog/${post.slug}`} className="relative h-48 bg-slate-100 block overflow-hidden">
                    {image ? (
                      <Image
                        src={image}
                        alt={post.image_alt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-800 flex items-center justify-center text-white/80 p-6">
                        <BookOpen size={36} className="text-white/40" />
                      </div>
                    )}
                  </Link>

                  <div className="p-6">
                    <span className="text-[10px] font-bold text-primary bg-primary-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                      SEO Research
                    </span>
                    <h2 className="font-bold text-dark mb-2 leading-snug line-clamp-2 text-base hover:text-primary transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    {post.excerpt && (
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 mt-auto">
                  <span className="font-semibold text-slate-600 flex items-center gap-1">
                    <User size={12} /> SEO Expert Team
                  </span>
                  {post.published_at && (
                    <time dateTime={post.published_at} className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(post.published_at).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      <CTABanner
        title="Ready to Scale Your Organic Search Traffic?"
        subtitle="Book a free consultation and get a tailored technical audit and keyword growth roadmap."
        ctaLabel="Get Free Strategy Consultation"
        ctaHref="/contact"
      />
    </div>
  )
}
