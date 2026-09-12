import { describe, it, expect } from 'vitest'
import { resolveSEO, seoToMetadata, renderSchemas } from '../seo'

const defaults = {
  title: 'Default Title',
  description: 'Default description.',
  url: 'https://example.test/page',
}

describe('resolveSEO', () => {
  it('falls back to the supplied defaults when the overlay is empty', () => {
    const seo = resolveSEO({}, defaults)
    expect(seo.title).toBe('Default Title')
    expect(seo.canonical).toBe('https://example.test/page')
    expect(seo.robots).toBe('index,follow')
    expect(seo.hreflang).toEqual([])
  })

  it('lets the admin overlay win over the defaults', () => {
    const seo = resolveSEO(
      { meta_title: 'Custom', canonical: 'https://example.test/other', robots: 'noindex,follow' },
      defaults
    )
    expect(seo.title).toBe('Custom')
    expect(seo.canonical).toBe('https://example.test/other')
    expect(seo.robots).toBe('noindex,follow')
  })

  it('treats a null overlay as empty rather than throwing', () => {
    expect(resolveSEO(null, defaults).title).toBe('Default Title')
  })

  it('carries hreflang entries through', () => {
    const seo = resolveSEO({ hreflang: [{ lang: 'en-GB', url: 'https://example.test/gb' }] }, defaults)
    expect(seo.hreflang).toEqual([{ lang: 'en-GB', url: 'https://example.test/gb' }])
  })
})

describe('seoToMetadata', () => {
  it('always supplies an OG image, because Next does not inherit one', () => {
    const meta = seoToMetadata(resolveSEO({}, defaults))
    expect(meta.openGraph?.images).toBeDefined()
  })

  it('emits twitter metadata alongside openGraph', () => {
    const meta = seoToMetadata(resolveSEO({ meta_title: 'Shared' }, defaults))
    expect(meta.twitter).toMatchObject({ card: 'summary_large_image', title: 'Shared' })
  })

  it('renders hreflang as alternates.languages', () => {
    const seo = resolveSEO({ hreflang: [{ lang: 'en-AE', url: 'https://example.test/ae' }] }, defaults)
    expect(seoToMetadata(seo).alternates?.languages).toEqual({ 'en-AE': 'https://example.test/ae' })
  })

  it('omits alternates.languages when no hreflang is set', () => {
    expect(seoToMetadata(resolveSEO({}, defaults)).alternates?.languages).toBeUndefined()
  })

  it('maps a noindex robots string onto the object form', () => {
    const meta = seoToMetadata(resolveSEO({ robots: 'noindex,nofollow' }, defaults))
    expect(meta.robots).toMatchObject({ index: false, follow: false })
  })
})

describe('renderSchemas', () => {
  it('passes through valid custom JSON-LD', () => {
    const out = renderSchemas([{ type: 'custom', json: '{"@type":"Thing"}' }])
    expect(out).toEqual(['{"@type":"Thing"}'])
  })

  it('skips custom entries that are not valid JSON', () => {
    expect(renderSchemas([{ type: 'custom', json: '{oops' }])).toEqual([])
  })

  it('builds a FAQPage from the page context', () => {
    const out = renderSchemas(
      [{ type: 'FAQPage', auto: true }],
      { faqs: [{ question: 'Q?', answer: 'A.' }] }
    )
    expect(out).toHaveLength(1)
    const parsed = JSON.parse(out[0]) as { '@type': string; mainEntity: unknown[] }
    expect(parsed['@type']).toBe('FAQPage')
    expect(parsed.mainEntity).toHaveLength(1)
  })

  it('drops an auto FAQPage when the page has no FAQs', () => {
    expect(renderSchemas([{ type: 'FAQPage', auto: true }], { faqs: [] })).toEqual([])
  })

  it('returns nothing for an empty entry list', () => {
    expect(renderSchemas([])).toEqual([])
  })
})
