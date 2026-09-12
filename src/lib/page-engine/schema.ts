const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/^["']|["']$/g, '').trim()
const DEFAULT_SITE_URL = rawSiteUrl && rawSiteUrl.startsWith('http') ? rawSiteUrl : 'https://seoexpertagency.com'
const SITE_NAME = 'SEO Expert Agency'
const PHONE = '+971 4 800 736'

interface SchemaContext {
  service?: string
  industry?: string
  location?: string
  price?: number | string
  url: string
  faqs?: Array<{ question: string; answer: string }>
  breadcrumbs?: Array<{ name: string; url: string }>
}

export function generateServicePageSchema(ctx: SchemaContext): Record<string, unknown> {
  const graph: Record<string, unknown>[] = []

  const name = [ctx.service, ctx.location ? `in ${ctx.location}` : null].filter(Boolean).join(' ')
  const description = `${ctx.service || 'Search Engine Optimization'} by ${SITE_NAME}. Professional data-driven SEO services.`

  graph.push({
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'ProfessionalService',
      name: SITE_NAME,
      url: DEFAULT_SITE_URL,
      telephone: PHONE,
      areaServed: ctx.location ? [ctx.location, 'AE', 'GB', 'Global'] : ['AE', 'GB', 'Global'],
    },
    areaServed: ctx.location ?? 'Global',
    ...(ctx.price
      ? {
          offers: {
            '@type': 'Offer',
            price: ctx.price.toString().replace(/[^0-9.]/g, ''),
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
    url: ctx.url,
  })

  if (ctx.breadcrumbs && ctx.breadcrumbs.length > 0) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: ctx.breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: b.url.startsWith('http') ? b.url : `${DEFAULT_SITE_URL}${b.url}`,
      })),
    })
  }

  if (ctx.faqs && ctx.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: ctx.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    })
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

/** Business details for Organization JSON-LD, sourced from website_settings. */
export interface OrganizationDetails {
  siteName?: string
  phone?: string | null
  email?: string | null
  address?: string | null
  socialUrls?: Array<string | null | undefined>
}

// Structured data asserts these facts to search engines, so every field is
// omitted rather than guessed when the setting is blank. Pass the values from
// getSettings(); the defaults exist only so the schema is still valid when
// settings cannot be loaded.
export function generateOrganizationSchema(details: OrganizationDetails = {}): Record<string, unknown> {
  const sameAs = (details.socialUrls ?? []).filter((u): u is string => Boolean(u && u.trim()))

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: details.siteName || SITE_NAME,
    url: DEFAULT_SITE_URL,
    ...(details.phone ? { telephone: details.phone } : {}),
    ...(details.email ? { email: details.email } : {}),
    areaServed: ['AE', 'GB', 'US', 'Global'],
    logo: `${DEFAULT_SITE_URL}/icon-512.png`,
    ...(sameAs.length > 0 ? { sameAs } : {}),
    // A free-text address from settings cannot be split into PostalAddress
    // parts reliably, so it is emitted as the single `address` string schema.org
    // permits rather than inventing locality/country fields.
    ...(details.address ? { address: details.address } : {}),
  }
}

/** Maps SiteSettings-shaped input onto OrganizationDetails. */
export function organizationDetailsFromSettings(s: {
  site_name?: string
  footer_business_phone?: string
  footer_business_email?: string
  footer_business_address?: string
  social_linkedin_url?: string | null
  social_twitter_url?: string | null
  social_facebook_url?: string | null
  social_instagram_url?: string | null
  social_youtube_url?: string | null
}): OrganizationDetails {
  return {
    siteName: s.site_name,
    phone: s.footer_business_phone,
    email: s.footer_business_email,
    address: s.footer_business_address,
    socialUrls: [
      s.social_linkedin_url, s.social_twitter_url, s.social_facebook_url,
      s.social_instagram_url, s.social_youtube_url,
    ],
  }
}

export function generateCollectionSchema(params: {
  name: string
  description: string
  path: string
  items: Array<{ name: string; path: string }>
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: params.name,
    description: params.description,
    url: `${DEFAULT_SITE_URL}${params.path}`,
    hasPart: params.items.map(item => ({
      '@type': 'WebPage',
      name: item.name,
      url: `${DEFAULT_SITE_URL}${item.path}`,
    })),
  }
}
