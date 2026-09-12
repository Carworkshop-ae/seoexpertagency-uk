import { describe, it, expect } from 'vitest'
import {
  CreateServiceSchema, CreateProjectSchema, CreateLocationSchema, CreateIndustrySchema,
} from '../content'

describe('CreateServiceSchema', () => {
  it('accepts a minimal service and applies defaults', () => {
    const parsed = CreateServiceSchema.parse({ name: 'Technical SEO' })
    expect(parsed.status).toBe('draft')
    expect(parsed.sort_order).toBe(0)
    expect(parsed.faq_json).toEqual([])
    expect(parsed.problems_json).toEqual([])
  })

  it('rejects a service with no name', () => {
    expect(CreateServiceSchema.safeParse({ name: '' }).success).toBe(false)
  })

  it('validates nested process steps', () => {
    const parsed = CreateServiceSchema.parse({
      name: 'Local SEO',
      process_json: [{ step: '01', title: 'Audit', description: 'Crawl the site.' }],
    })
    expect(parsed.process_json[0].title).toBe('Audit')
  })

  it('rejects a process step missing its description', () => {
    const res = CreateServiceSchema.safeParse({
      name: 'Local SEO',
      process_json: [{ step: '01', title: 'Audit' }],
    })
    expect(res.success).toBe(false)
  })
})

describe('CreateProjectSchema', () => {
  // A case study with no client-verified figures is the expected default;
  // the public template hides the results block when this is empty.
  it('defaults results_json to empty', () => {
    const parsed = CreateProjectSchema.parse({ title: 'Case Study' })
    expect(parsed.results_json).toEqual([])
  })

  it('accepts verified metrics when supplied', () => {
    const parsed = CreateProjectSchema.parse({
      title: 'Case Study',
      results_json: [{ metric: '+42%', label: 'Organic sessions' }],
    })
    expect(parsed.results_json).toHaveLength(1)
  })

  it('rejects a metric without a label', () => {
    expect(CreateProjectSchema.safeParse({
      title: 'Case Study',
      results_json: [{ metric: '+42%' }],
    }).success).toBe(false)
  })

  it('requires a title', () => {
    expect(CreateProjectSchema.safeParse({}).success).toBe(false)
  })
})

describe('CreateLocationSchema', () => {
  it('defaults region and country_code to empty strings', () => {
    const parsed = CreateLocationSchema.parse({ name: 'United Kingdom' })
    expect(parsed.region).toBe('')
    expect(parsed.country_code).toBe('')
  })

  it('rejects a country code longer than two characters', () => {
    expect(CreateLocationSchema.safeParse({ name: 'UK', country_code: 'GBR' }).success).toBe(false)
  })
})

describe('CreateIndustrySchema', () => {
  it('defaults recommended_services to empty', () => {
    expect(CreateIndustrySchema.parse({ name: 'SaaS' }).recommended_services).toEqual([])
  })

  it('accepts a list of service slugs', () => {
    const parsed = CreateIndustrySchema.parse({
      name: 'SaaS',
      recommended_services: ['technical-seo', 'content-seo'],
    })
    expect(parsed.recommended_services).toHaveLength(2)
  })
})
