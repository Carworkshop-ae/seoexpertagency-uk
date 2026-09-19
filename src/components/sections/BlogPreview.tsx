import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BookOpen } from 'lucide-react'
import type { BlogPost } from '@/types'

const DEFAULT_SEO_POSTS: Array<Partial<BlogPost> & { title: string; slug: string; excerpt: string; category?: string }> = [
  {
    id: 'post-1',
    title: 'How to Scale Organic Search Traffic for B2B SaaS in 2026',
    slug: 'scale-organic-search-saas',
    excerpt: 'A comprehensive playbook on building bottom-of-funnel comparison hubs, programmatically ranking integration pages, and capturing qualified enterprise pipeline.',
    category: 'SaaS SEO',
    published_at: new Date().toISOString(),
  },
  {
    id: 'post-2',
    title: 'Core Web Vitals & Technical SEO: The Developer Guide',
    slug: 'core-web-vitals-technical-seo-guide',
    excerpt: 'Step-by-step optimization strategies for INP, LCP, and CLS metrics across Next.js and headless e-commerce architectures.',
    category: 'Technical SEO',
    published_at: new Date().toISOString(),
  },
  {
    id: 'post-3',
    title: 'Topical Authority Frameworks: Moving Beyond Keyword Density',
    slug: 'topical-authority-frameworks',
    excerpt: 'How search engine natural language processing algorithms evaluate domain semantic depth, entity associations, and E-E-A-T signals.',
    category: 'Content Strategy',
    published_at: new Date().toISOString(),
  },
]

interface BlogPreviewProps {
  posts?: BlogPost[]
  title?: React.ReactNode
  subtitle?: React.ReactNode
  eyebrow?: React.ReactNode
}

export function BlogPreview({
  posts,
  title = 'Latest SEO Insights & Search Research',
  subtitle = 'Actionable guides, technical breakdowns, and algorithm analysis from our search marketing strategists.',
  eyebrow = 'KNOWLEDGE & INSIGHTS',
}: BlogPreviewProps) {
  const displayPosts = posts && posts.length > 0 ? posts : (DEFAULT_SEO_POSTS as unknown as BlogPost[])

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-slate-100" aria-labelledby="blog-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16">
          <div className="max-w-2xl">
            {eyebrow && (
              <span className="inline-block text-xs font-extrabold text-primary tracking-wider uppercase mb-2">
                {eyebrow}
              </span>
            )}
            <h2 id="blog-heading" className="display-tight text-balance text-3xl sm:text-4xl font-extrabold text-dark">
              {title}
            </h2>
            {subtitle && (
              <p className="text-pretty text-slate-600 text-sm sm:text-base mt-2">
                {subtitle}
              </p>
            )}
          </div>
          <Link
            href="/blog"
            className="text-xs font-bold text-primary hover:underline mt-4 md:mt-0 inline-flex items-center gap-1.5 shrink-0"
          >
            Browse All Articles <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayPosts.slice(0, 3).map(post => {
            const image = post.image_webp_url || post.featured_image
            return (
              <article
                key={post.id}
                className="group card-premium overflow-hidden flex flex-col justify-between rounded-2xl bg-white border border-slate-200/80 hover:border-primary/40 transition-all duration-200"
              >
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
                    <h3 className="font-bold text-dark mb-2 leading-snug line-clamp-2 text-base group-hover:text-primary transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    {post.excerpt && (
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 mt-auto">
                  <span className="font-semibold text-slate-600">SEO Expert Team</span>
                  {post.published_at && (
                    <time dateTime={post.published_at}>
                      {new Date(post.published_at).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
