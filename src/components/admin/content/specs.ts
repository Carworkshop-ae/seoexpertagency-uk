import type { FormSection } from './ContentForm'

// Field specs per content type. These mirror the public templates in
// src/app/(public)/(default-footer)/{services,industries,projects,locations},
// so a section added to a template gets a field here and nowhere else.

const TITLE_DESC = {
  keys: [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description', textarea: true },
  ],
}

const heroSection = (noun: string): FormSection => ({
  title: 'Page Hero',
  description: `The headline block at the top of the ${noun} page.`,
  fields: [
    { kind: 'text', name: 'hero_badge', label: 'Eyebrow / Badge', max: 60, hint: 'Small label above the heading' },
    { kind: 'text', name: 'headline', label: 'H1 Headline', max: 120 },
    { kind: 'textarea', name: 'subheadline', label: 'Supporting Paragraph', max: 300, rows: 2 },
    { kind: 'rich', name: 'overview', label: 'Introduction' },
  ],
})

const closingSection: FormSection = {
  title: 'Deliverables & FAQs',
  fields: [
    { kind: 'list', name: 'deliverables_json', label: 'What&apos;s Included', placeholder: 'Deliverable', addLabel: '+ Add deliverable' },
    {
      kind: 'repeater', name: 'faq_json', label: 'Frequently Asked Questions', addLabel: '+ Add FAQ',
      fields: { keys: [{ key: 'question', label: 'Question' }, { key: 'answer', label: 'Answer', textarea: true }] },
    },
  ],
}

// Services and Industries no longer have a dedicated admin form — they're
// edited inline on the homepage (ServiceFeatureCard/IndustryFeatureCard +
// AddServiceCard/AddIndustryCard, all hitting the same /api/admin/services
// and /api/admin/industries routes this spec system used to feed).

export const projectSections: FormSection[] = [
  {
    title: 'Case Study Details',
    fields: [
      { kind: 'text', name: 'title', label: 'Case Study Title', required: true, max: 120 },
      { kind: 'text', name: 'client', label: 'Client', max: 120, hint: 'Only with the client&apos;s permission' },
      { kind: 'text', name: 'industry', label: 'Industry', max: 120 },
      { kind: 'text', name: 'timeline', label: 'Engagement Length', max: 60, hint: 'e.g. 9 month engagement' },
      { kind: 'textarea', name: 'summary', label: 'Summary', max: 400, rows: 3 },
      { kind: 'list', name: 'services', label: 'Services Used', placeholder: 'Service name', addLabel: '+ Add service' },
    ],
  },
  {
    title: 'The Work',
    fields: [
      { kind: 'rich', name: 'challenge', label: 'The Challenge' },
      { kind: 'rich', name: 'strategy', label: 'Our Strategy' },
      {
        kind: 'repeater', name: 'implementation_json', label: 'Implementation Phases', addLabel: '+ Add phase',
        fields: {
          keys: [
            { key: 'phase', label: 'Phase label (e.g. Phase 1)' },
            { key: 'title', label: 'Phase title' },
            { key: 'details', label: 'What was done', textarea: true },
          ],
        },
      },
    ],
  },
  {
    title: 'Verified Results',
    description:
      'Add a figure ONLY if the client has verified it and approved its publication. Leave this empty and the results section is hidden — never publish an estimate, a projection, or an illustrative number.',
    fields: [
      {
        kind: 'repeater', name: 'results_json', label: 'Verified Metrics', addLabel: '+ Add verified metric',
        fields: { keys: [{ key: 'metric', label: 'Figure (e.g. +142%)' }, { key: 'label', label: 'What it measures' }] },
      },
      { kind: 'list', name: 'deliverables_json', label: 'Deliverables', placeholder: 'Deliverable', addLabel: '+ Add deliverable' },
    ],
  },
]

// SEO Pages use a bespoke form (src/components/admin/seo-pages/SeoPageForm.tsx),
// not this ContentForm-driven spec system — its fields don't mirror any public
// template 1:1 the way the other four do, and it's styled deliberately
// differently by request. No seoPageSections export here.

export const locationSections: FormSection[] = [
  {
    title: 'Location Details',
    fields: [
      { kind: 'text', name: 'name', label: 'Location Name', required: true, max: 80 },
      { kind: 'text', name: 'region', label: 'Region', max: 80, hint: 'e.g. Middle East, Europe' },
      { kind: 'text', name: 'country_code', label: 'Country Code', max: 2, hint: 'ISO-2, e.g. AE, GB' },
      { kind: 'textarea', name: 'address', label: 'Address', max: 300, rows: 2 },
    ],
  },
  heroSection('location'),
  {
    title: 'Local Search Factors',
    description:
      'What genuinely differs about search in this market. Keep it specific — near-duplicate pages that only swap the place name are doorway pages, and Google treats them as such.',
    fields: [
      { kind: 'repeater', name: 'local_factors_json', label: 'Local Ranking Factors', addLabel: '+ Add factor', fields: TITLE_DESC },
    ],
  },
  closingSection,
]
