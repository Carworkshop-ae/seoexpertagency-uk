import { describe, it, expect } from 'vitest'
import { generateServicePageSchema, generateOrganizationSchema, organizationDetailsFromSettings, generateCollectionSchema } from '../schema'

describe('generateServicePageSchema', () => {
  const ctx = {
    service: 'Technical SEO Audit & Architecture',
    url: 'https://seoexpertagency.co.uk/services/technical-seo',
    price: '1500',
    breadcrumbs: [{ name: 'Services', url: '/services' }, { name: 'Technical SEO', url: '/services/technical-seo' }],
    faqs: [{ question: 'How long does SEO take to see results?', answer: 'Typically 3 to 6 months.' }],
  }

  it('produces @context https://schema.org', () => {
    const schema = generateServicePageSchema(ctx)
    expect(schema['@context']).toBe('https://schema.org')
  })

  it('includes Service type in graph', () => {
    const schema = generateServicePageSchema(ctx)
    const graph = schema['@graph'] as Array<Record<string, unknown>>
    const service = graph.find(n => n['@type'] === 'Service')
    expect(service).toBeDefined()
    expect(service?.name).toContain('Technical SEO')
  })

  it('includes price in offers when provided', () => {
    const schema = generateServicePageSchema(ctx)
    const graph = schema['@graph'] as Array<Record<string, unknown>>
    const service = graph.find(n => n['@type'] === 'Service')
    expect(service?.offers).toBeDefined()
    const offers = service?.offers as Record<string, unknown>
    expect(offers.priceCurrency).toBe('USD')
    expect(offers.price).toBe('1500')
  })

  it('includes BreadcrumbList in graph', () => {
    const schema = generateServicePageSchema(ctx)
    const graph = schema['@graph'] as Array<Record<string, unknown>>
    const breadcrumb = graph.find(n => n['@type'] === 'BreadcrumbList')
    expect(breadcrumb).toBeDefined()
  })

  it('includes FAQPage when faqs provided', () => {
    const schema = generateServicePageSchema(ctx)
    const graph = schema['@graph'] as Array<Record<string, unknown>>
    const faq = graph.find(n => n['@type'] === 'FAQPage')
    expect(faq).toBeDefined()
  })
})

describe('generateOrganizationSchema', () => {
  it('returns ProfessionalService schema for SEO Expert Agency', () => {
    const schema = generateOrganizationSchema()
    expect(schema['@type']).toBe('ProfessionalService')
    expect(schema.name).toBe('SEO Expert Agency')
    expect(schema.url).toBe('https://seoexpertagency.co.uk')
  })

  // Structured data asserts facts to search engines, so an unset business
  // detail must be absent rather than guessed.
  it('omits contact and social fields when settings are blank', () => {
    const schema = generateOrganizationSchema()
    expect(schema).not.toHaveProperty('telephone')
    expect(schema).not.toHaveProperty('email')
    expect(schema).not.toHaveProperty('address')
    expect(schema).not.toHaveProperty('sameAs')
  })

  it('emits contact and social fields supplied by settings', () => {
    const schema = generateOrganizationSchema({
      siteName: 'Acme SEO',
      phone: '+44 20 7946 0000',
      email: 'hello@acme.test',
      address: '1 Example Street, London',
      socialUrls: ['https://linkedin.com/company/acme', null, '', undefined],
    })
    expect(schema.name).toBe('Acme SEO')
    expect(schema.telephone).toBe('+44 20 7946 0000')
    expect(schema.email).toBe('hello@acme.test')
    expect(schema.address).toBe('1 Example Street, London')
    // Blank/nullish handles are filtered out, not emitted as empty strings.
    expect(schema.sameAs).toEqual(['https://linkedin.com/company/acme'])
  })
})

describe('organizationDetailsFromSettings', () => {
  it('maps website_settings keys onto organization details', () => {
    const details = organizationDetailsFromSettings({
      site_name: 'Acme SEO',
      footer_business_phone: '+971 4 000 0000',
      footer_business_email: 'hi@acme.test',
      footer_business_address: 'Dubai, UAE',
      social_linkedin_url: 'https://linkedin.com/company/acme',
      social_twitter_url: null,
    })
    expect(details.siteName).toBe('Acme SEO')
    expect(details.phone).toBe('+971 4 000 0000')
    expect(details.email).toBe('hi@acme.test')
    expect(details.address).toBe('Dubai, UAE')
    expect(details.socialUrls).toContain('https://linkedin.com/company/acme')
  })
})

describe('generateCollectionSchema', () => {
  it('generates CollectionPage schema for directory listings', () => {
    const schema = generateCollectionSchema({
      name: 'SEO Services Directory',
      description: 'Explore all data-driven search marketing services.',
      path: '/services',
      items: [{ name: 'Technical SEO', path: '/services/technical-seo' }],
    })
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('CollectionPage')
    expect(schema.name).toBe('SEO Services Directory')
  })
})
