import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { User, Calendar, ArrowLeft } from 'lucide-react'
import { createPublicSupabase } from '@/lib/supabase/public'
import { createServiceClient } from '@/lib/supabase/service'
import { sanitizeHTML } from '@/lib/sanitize'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { CTABanner } from '@/components/sections/CTABanner'
import { resolveSEO, seoToMetadata } from '@/lib/seo'

interface PageProps {
  params: Promise<{ slug: string }>
}

const FALLBACK_POST_CONTENT: Record<string, { title: string; excerpt: string; content: string; category: string; date: string }> = {
  'scale-organic-search-saas': {
    title: 'How to Scale Organic Search Traffic for B2B SaaS in 2026',
    excerpt: 'A comprehensive playbook on building bottom-of-funnel comparison hubs, programmatically ranking integration pages, and capturing qualified enterprise pipeline.',
    category: 'SaaS SEO',
    date: '2026-08-15',
    content: `
      <h2>The Shift in B2B SaaS Organic Search</h2>
      <p>For modern B2B SaaS organizations, organic search can no longer rely on top-of-funnel definition articles. The true growth engine is bottom-of-the-funnel (BoFU) commercial intent: users actively comparing tools, seeking migrations, or looking for specific API integrations.</p>
      
      <h2>1. Building Programmatic Integration Hubs</h2>
      <p>Modern software buyers search for <em>"[Your Tool] + [Integration]"</em> or <em>"How to connect [Tool A] with [Tool B]"</em>. By creating dynamic, schema-rich integration directories with genuine setup instructions, you capture ultra-high-converting buyer traffic.</p>
      
      <h2>2. "Vs" and Alternative Landing Page Clusters</h2>
      <p>Competitor comparison pages must be balanced, honest, and feature-rich. By creating structured comparison tables and addressing feature nuances transparently, you establish authoritative trust while capturing users on the verge of purchasing.</p>

      <h2>3. Technical Architecture for Scaled SaaS</h2>
      <p>Ensure that single-page applications or Next.js frontends properly render semantic HTML on the server. Fast time-to-first-byte (TTFB) and structured schema are non-negotiable for enterprise visibility.</p>
    `,
  },
  'core-web-vitals-technical-seo-guide': {
    title: 'Core Web Vitals & Technical SEO: The Engineering Guide',
    excerpt: 'Step-by-step optimization strategies for INP, LCP, and CLS metrics across modern Next.js and headless architectures.',
    category: 'Technical SEO',
    date: '2026-08-10',
    content: `
      <h2>Interaction to Next Paint (INP) Mastery</h2>
      <p>With INP replacing FID as a core ranking metric, minimizing main thread blocking during user interactions is critical. Long JavaScript tasks must be broken down using scheduler APIs and requestIdleCallback.</p>
      
      <h2>Largest Contentful Paint (LCP) Optimizations</h2>
      <p>Preload your critical hero assets, leverage modern image formats like AVIF and WebP, and ensure server response times remain under 200ms with edge caching.</p>

      <h2>Cumulative Layout Shift (CLS) Prevention</h2>
      <p>Always declare explicit width and height dimensions on media containers and reserve dynamic space for ad units and client-rendered widgets.</p>
    `,
  },
  'topical-authority-frameworks': {
    title: 'Topical Authority Frameworks: Moving Beyond Keyword Density',
    excerpt: 'How search engine natural language processing algorithms evaluate domain semantic depth, entity associations, and E-E-A-T signals.',
    category: 'Content Strategy',
    date: '2026-08-01',
    content: `
      <h2>Entity-Based Semantic Indexing</h2>
      <p>Search engines no longer match strings; they match concepts, entities, and relationships. Building topical authority requires covering an entire knowledge domain comprehensively.</p>
      
      <h2>Topic Cluster Architecture</h2>
      <p>Organize your content into dedicated Pillar pages linked hierarchically to specialized sub-topic articles. This internal link flow signals complete domain competence to web crawlers.</p>
    `,
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = createPublicSupabase()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, seo_title, seo_description, featured_image, image_webp_url, seo_json')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  const fallback = FALLBACK_POST_CONTENT[slug]
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seoexpertagency.com'

  if (!post && !fallback) return { title: 'Post Not Found | SEO Expert Agency' }

  const title = post?.seo_title ?? post?.title ?? fallback?.title ?? 'SEO Insights'
  const description = post?.seo_description ?? post?.excerpt ?? fallback?.excerpt ?? ''
  const url = `${siteUrl}/blog/${slug}`

  const seo = resolveSEO(post?.seo_json, {
    title: `${title} | SEO Expert Agency`,
    description,
    url,
    ogImage: post?.image_webp_url || post?.featured_image,
  })
  const meta = seoToMetadata(seo, url)
  return { ...meta, openGraph: { ...meta.openGraph, type: 'article' } }
}

export const revalidate = 3600

export async function generateStaticParams() {
  const fallbackSlugs = Object.keys(FALLBACK_POST_CONTENT).map(slug => ({ slug }))
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return fallbackSlugs
  try {
    const supabase = createServiceClient()
    const { data } = await supabase.from('blog_posts').select('slug').eq('status', 'published')
    const dbSlugs = (data ?? []).map(p => ({ slug: p.slug }))
    return [...fallbackSlugs, ...dbSlugs]
  } catch {
    return fallbackSlugs
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = createPublicSupabase()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  const fallback = FALLBACK_POST_CONTENT[slug]

  if (!post && !fallback) notFound()

  const title = post?.title ?? fallback!.title
  const excerpt = post?.excerpt ?? fallback!.excerpt
  const htmlContent = post?.content ? sanitizeHTML(post.content) : (fallback?.content || '')
  const publishedAt = post?.published_at ?? fallback?.date ?? new Date().toISOString()
  const featuredImage = post?.image_webp_url || post?.featured_image
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seoexpertagency.com'

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    image: featuredImage ? [featuredImage] : undefined,
    datePublished: publishedAt,
    dateModified: post?.updated_at || publishedAt,
    publisher: {
      '@type': 'Organization',
      name: 'SEO Expert Agency',
      url: siteUrl,
    },
    author: {
      '@type': 'Organization',
      name: 'SEO Expert Agency Research Team',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="bg-slate-50 py-3.5 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: title },
            ]}
          />
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <header className="mb-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mb-4"
          >
            <ArrowLeft size={14} /> Back to all articles
          </Link>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark tracking-tight leading-tight mb-4">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-4 border-t border-slate-100">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <User size={14} className="text-primary" /> SEO Expert Agency Research Team
            </span>
            <span>·</span>
            <time dateTime={publishedAt} className="flex items-center gap-1.5">
              <Calendar size={14} className="text-primary" />
              {new Date(publishedAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </div>
        </header>

        {featuredImage && (
          <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden mb-10 shadow-lg border border-slate-200/80">
            <Image
              src={featuredImage}
              alt={post?.image_alt || title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </div>
        )}

        <div
          className="rich-content text-slate-700 leading-relaxed text-base sm:text-lg"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>

      <CTABanner
        title="Want Expert Execution for Your SEO Strategy?"
        subtitle="Schedule a free discovery audit and roadmap presentation with our search directors."
        ctaLabel="Get Free SEO Consultation"
        ctaHref="/contact"
      />
    </>
  )
}
