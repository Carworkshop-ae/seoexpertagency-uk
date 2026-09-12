import type { Database } from './database'

export type Service = Database['public']['Tables']['services']['Row']
export type Industry = Database['public']['Tables']['industries']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Location = Database['public']['Tables']['locations']['Row']
export type StaticPage = Database['public']['Tables']['static_pages']['Row']
export type FormSubmission = Database['public']['Tables']['form_submissions']['Row']
export type BlogPost = Database['public']['Tables']['blog_posts']['Row']
export type BlogCategory = Database['public']['Tables']['blog_categories']['Row']
export type BlogTag = Database['public']['Tables']['blog_tags']['Row']
export type Media = Database['public']['Tables']['media']['Row']
export type WebsiteSetting = Database['public']['Tables']['website_settings']['Row']
export type AuditLog = Database['public']['Tables']['audit_logs']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Faq = Database['public']['Tables']['faqs']['Row']
export type LanguageKey = Database['public']['Tables']['language_keys']['Row']
export type SearchContent = Database['public']['Tables']['search_content']['Row']
export type SeoPage = Database['public']['Tables']['seo_pages']['Row']

export type InsertService = Database['public']['Tables']['services']['Insert']
export type InsertIndustry = Database['public']['Tables']['industries']['Insert']
export type InsertProject = Database['public']['Tables']['projects']['Insert']
export type InsertLocation = Database['public']['Tables']['locations']['Insert']
export type InsertSeoPage = Database['public']['Tables']['seo_pages']['Insert']
export type InsertFormSubmission = Database['public']['Tables']['form_submissions']['Insert']
export type InsertBlogPost = Database['public']['Tables']['blog_posts']['Insert']

export type UpdateService = Database['public']['Tables']['services']['Update']
export type UpdateIndustry = Database['public']['Tables']['industries']['Update']
export type UpdateProject = Database['public']['Tables']['projects']['Update']
export type UpdateLocation = Database['public']['Tables']['locations']['Update']
export type UpdateSeoPage = Database['public']['Tables']['seo_pages']['Update']
export type UpdateFormSubmission = Database['public']['Tables']['form_submissions']['Update']
export type UpdateBlogPost = Database['public']['Tables']['blog_posts']['Update']

export type ContentStatus = 'draft' | 'published' | 'archived'
export type LeadStatus = 'new' | 'contacted' | 'in_progress' | 'converted' | 'closed'
export type UserRole = 'super_admin' | 'admin' | 'editor' | 'content_writer' | 'support_staff' | 'seo_editor'
export type ApprovalStatus = 'pending' | 'approved' | 'resubmission_required' | 'rejected'

// The CMS-managed marketing content types, which share an admin module shape
// and a public template shape. Used to key revalidation and SEO helpers.
export type ContentEntity = 'service' | 'industry' | 'project' | 'location'

export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  resubmission_required: 'Resubmission Required',
  rejected: 'Rejected',
}

export interface FAQItem {
  question: string
  answer: string
}

export interface TrustStat {
  value: string
  label: string
}

// Editable overlay stored in a content row's content_json, for copy that does
// not warrant its own column.
export interface PageContent {
  main_content?: string | null
  faqs?: Array<{ q: string; a: string }>
  /** Editable H2 above the services grid. Defaults to "Our Services". */
  services_heading?: string | null
  /** Icon key (see src/lib/service-icons.ts). */
  icon?: string | null
}

// Static page section model stored in static_pages.sections_json
export type StaticSectionType = 'hero' | 'text' | 'service_cards' | 'faq' | 'cta'

export interface StaticSection {
  id: string
  type: StaticSectionType
  data: Record<string, unknown>
}
