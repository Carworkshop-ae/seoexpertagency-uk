// Shared shape for the Home page's `static_pages.content_json`. Used by both
// the admin dashboard editor (src/app/admin/pages/static/home/page.tsx) and
// the public homepage loader (getHomeContent in content.ts), so the two never
// drift out of sync on what a "home content" object looks like.

export interface HomeStat { icon: string; value: string; label: string; sublabel?: string }
export interface HomeStep { icon: string; title: string; description: string }
export interface HomeUSP { icon: string; title: string; description: string }
export interface HomeReview { name: string; rating: number; service: string; text: string }
export interface HomeFAQ { q: string; a: string }
export interface HomeTestimonial { quote: string; name: string; role: string; rating?: number }
/** Editable copy for a section whose only per-page-varying fields are its own
 *  header — the cards/rows underneath come from their own table (services,
 *  packages, industries, projects, blog_posts) or the FAQ block above. */
export interface HomeSectionHeader { title: string; subtitle: string; eyebrow: string }

export interface HomeContent {
  hero: { badge: string; h1: string; subheadline: string; cta_primary_text: string; cta_primary_link: string; cta_secondary_text: string; cta_secondary_link: string; image_url: string | null }
  trust_bar: { visible: boolean; stats: HomeStat[] }
  services: { visible: boolean; heading: string }
  how_it_works: { visible: boolean; heading: string; steps: HomeStep[] }
  why_choose_us: { visible: boolean; heading: string; items: HomeUSP[] }
  reviews: { visible: boolean; heading: string; reviews: HomeReview[] }
  blog_preview: { visible: boolean; heading: string; count: number }
  locations: { visible: boolean; heading: string }
  faq: { visible: boolean; heading: string; faqs: HomeFAQ[] }
  cta_banner: { visible: boolean; badge: string; headline: string; subheadline: string; button_text: string; button_link: string; secondary_text: string; secondary_link: string; bg_color: string }
  process_steps: { title: string; subtitle: string; eyebrow: string; steps: HomeStep[] }
  testimonials: { title: string; subtitle: string; eyebrow: string; items: HomeTestimonial[] }
  final_cta: { badge: string; heading: string; subtitle: string; cta_text: string; phone_text: string; phone_link: string }
  services_section: HomeSectionHeader
  packages_section: HomeSectionHeader
  industries_section: HomeSectionHeader
  projects_section: HomeSectionHeader
  blog_section: HomeSectionHeader
  faq_section: HomeSectionHeader
}

// Fallback copy shown when static_pages.content_json is empty — set to match
// the homepage's original hardcoded copy exactly, so wiring the page up to
// this schema is visually a no-op until an admin actually edits something.
export const HOME_DEFAULTS: HomeContent = {
  hero: { badge: 'RESULT-DRIVEN SEO AGENCY', h1: 'Grow Your Business With Data-Driven SEO', subheadline: 'We help ambitious brands scale organic search traffic, dominate high-intent keywords, and convert qualified visitors into predictable revenue.', cta_primary_text: 'Get a Free SEO Consultation', cta_primary_link: '#lead-form', cta_secondary_text: 'Explore Our Services', cta_secondary_link: '/#services', image_url: null },
  trust_bar: { visible: true, stats: [
    { icon: '📈', value: 'Data-Driven SEO', label: 'Search Strategies', sublabel: 'Custom tailored roadmaps' },
    { icon: '🛡️', value: '100% White-Hat', label: 'Safe Link Building', sublabel: 'Penalty-proof compliance' },
    { icon: '📊', value: 'Transparent ROI', label: 'Live Analytics & KPIs', sublabel: 'No vanity metric fluff' },
    { icon: '🏆', value: 'Senior Strategists', label: 'Dedicated SEO Team', sublabel: 'Direct expert access' },
  ] },
  services: { visible: true, heading: 'Our Core SEO Services' },
  how_it_works: { visible: true, heading: 'How We Work', steps: [
    { icon: '🔍', title: 'Audit & Discovery', description: 'Full technical crawl, keyword gap and competitor analysis.' },
    { icon: '🗺️', title: 'Strategy & Roadmap', description: 'A prioritised plan mapped to commercial search intent.' },
    { icon: '🔧', title: 'Execution', description: 'Technical fixes, content production and authority building.' },
    { icon: '📈', title: 'Measure & Iterate', description: 'Monthly reporting against agreed KPIs, and refinement.' },
  ] },
  why_choose_us: { visible: true, heading: 'Why Ambitious Brands Choose SEO Expert Agency', items: [
    { icon: '🔓', title: 'No Hostile Lock-In Contracts', description: 'We earn your business every month through demonstrable organic traffic growth and revenue impact.' },
    { icon: '👥', title: 'Dedicated Senior Strategists', description: 'Work directly with seasoned SEO directors and technical architects, not entry-level account coordinators.' },
    { icon: '🛡️', title: '100% White-Hat Techniques', description: 'We adhere strictly to Google Webmaster Guidelines, ensuring penalty-proof rankings that stand the test of time.' },
    { icon: '📊', title: 'Transparent Real-Time Dashboards', description: '24/7 access to live rank tracking, keyword velocity, and multi-touch pipeline revenue attribution.' },
    { icon: '💻', title: 'Deep Engineering Expertise', description: 'We provide production-ready code tickets and direct developer collaboration for complex modern tech stacks.' },
    { icon: '🎯', title: 'Commercial Intent Focus', description: 'We target high-converting commercial queries that drive qualified sales pipelines rather than vanity impressions.' },
  ] },
  reviews: { visible: true, heading: 'What Our Clients Say', reviews: [] },
  blog_preview: { visible: true, heading: 'Latest from Our Blog', count: 3 },
  locations: { visible: true, heading: 'Where We Work' },
  faq: { visible: true, heading: 'Common Questions', faqs: [] },
  cta_banner: { visible: true, badge: 'Zero Obligation · Custom Strategy', headline: 'Ready to Grow Your Search Visibility?', subheadline: 'Schedule a 30-minute discovery call with our senior SEO strategists and receive a free comprehensive technical & keyword opportunity audit.', button_text: 'Get Your Free SEO Consultation', button_link: '/contact', secondary_text: 'Call Us Directly', secondary_link: 'tel:+9714800736', bg_color: '#0066FF' },
  process_steps: {
    title: 'Our Proven 4-Step SEO Framework',
    subtitle: 'A systematic, repeatable methodology that turns search engines into your most predictable customer acquisition channel.',
    eyebrow: 'HOW WE DELIVER RESULTS',
    steps: [
      { icon: '', title: 'Discovery & Deep Audit', description: 'We perform deep technical crawl diagnostics, log file reviews, and comprehensive competitor keyword gap analysis.' },
      { icon: '', title: 'Strategic Architecture', description: 'We map out a sprint-by-sprint 12-month roadmap prioritizing high-impact quick wins and long-term search dominance.' },
      { icon: '', title: 'Execution & Optimization', description: 'Our team implements technical fixes, Core Web Vitals optimizations, semantic content clusters, and structured schema.' },
      { icon: '', title: 'Authority & Revenue Scale', description: 'We earn tier-1 editorial backlinks through digital PR and continuously optimize conversion funnels for maximum pipeline.' },
    ],
  },
  testimonials: {
    title: 'Trusted by Growth-Focused Teams',
    subtitle: 'Real feedback from clients who partnered with us to turn organic search into a predictable revenue channel.',
    eyebrow: 'CLIENT REVIEWS',
    items: [
      { quote: 'Our organic traffic more than doubled within two quarters, and for the first time we could actually trace pipeline revenue back to specific keyword rankings.', name: 'VP of Marketing', role: 'B2B SaaS company', rating: 5 },
      { quote: 'What stood out was the transparency — weekly rank tracking, clear technical audits, and a team that explained the "why" behind every recommendation.', name: 'Director of E-Commerce', role: 'Online retail brand', rating: 5 },
      { quote: 'We had tried two other agencies before this. The difference was having senior strategists actually doing the work instead of handing it off to juniors.', name: 'Founder', role: 'Professional services firm', rating: 5 },
    ],
  },
  final_cta: {
    badge: 'Scale Your Organic Revenue',
    heading: "Let's Build Your Search Growth Strategy",
    subtitle: 'Get in touch today for an in-depth competitive search audit, technical roadmap, and predictable organic growth plan.',
    cta_text: 'Book a Free Consultation',
    phone_text: 'Call +971 4 800 736',
    phone_link: 'tel:+9714800736',
  },
  services_section: { title: 'Our Core SEO Services', subtitle: 'Data-backed search optimization strategies engineered to scale high-intent traffic, dominate keywords, and grow organic revenue.', eyebrow: 'WHAT WE DELIVER' },
  packages_section: { title: 'Predictable, Transparent SEO Packages', subtitle: 'Choose the ideal engagement tier engineered to outpace your competitors and scale organic customer acquisition.', eyebrow: 'TRANSPARENT PRICING' },
  industries_section: { title: 'Tailored SEO for High-Growth Industries', subtitle: 'Every industry operates under distinct search dynamics. We build bespoke search strategies that address the exact buyer intent and competitive barriers of your market.', eyebrow: 'SPECIALIZED EXPERTISE' },
  projects_section: { title: 'Proven Organic Growth Case Studies', subtitle: 'Discover how our technical architecture audits, strategic content hubs, and authority campaigns deliver predictable commercial search impact.', eyebrow: 'PROVEN METHODOLOGY' },
  blog_section: { title: 'Latest SEO Insights & Search Research', subtitle: 'Actionable guides, technical breakdowns, and algorithm analysis from our search marketing strategists.', eyebrow: 'KNOWLEDGE & INSIGHTS' },
  faq_section: { title: 'Frequently Asked Questions', subtitle: 'Clear answers to common questions about our data-driven SEO methodologies, retainers, and timelines.', eyebrow: 'QUESTIONS & ANSWERS' },
}

export function mergeHomeContent(saved: Partial<HomeContent> | null | undefined): HomeContent {
  const c = saved ?? {}
  return {
    hero: { ...HOME_DEFAULTS.hero, ...c.hero },
    trust_bar: { ...HOME_DEFAULTS.trust_bar, ...c.trust_bar },
    services: { ...HOME_DEFAULTS.services, ...c.services },
    how_it_works: { ...HOME_DEFAULTS.how_it_works, ...c.how_it_works },
    why_choose_us: { ...HOME_DEFAULTS.why_choose_us, ...c.why_choose_us },
    reviews: { ...HOME_DEFAULTS.reviews, ...c.reviews },
    blog_preview: { ...HOME_DEFAULTS.blog_preview, ...c.blog_preview },
    locations: { ...HOME_DEFAULTS.locations, ...c.locations },
    faq: { ...HOME_DEFAULTS.faq, ...c.faq },
    cta_banner: { ...HOME_DEFAULTS.cta_banner, ...c.cta_banner },
    process_steps: { ...HOME_DEFAULTS.process_steps, ...c.process_steps },
    testimonials: { ...HOME_DEFAULTS.testimonials, ...c.testimonials },
    final_cta: { ...HOME_DEFAULTS.final_cta, ...c.final_cta },
    services_section: { ...HOME_DEFAULTS.services_section, ...c.services_section },
    packages_section: { ...HOME_DEFAULTS.packages_section, ...c.packages_section },
    industries_section: { ...HOME_DEFAULTS.industries_section, ...c.industries_section },
    projects_section: { ...HOME_DEFAULTS.projects_section, ...c.projects_section },
    blog_section: { ...HOME_DEFAULTS.blog_section, ...c.blog_section },
    faq_section: { ...HOME_DEFAULTS.faq_section, ...c.faq_section },
  }
}

// ─── About page ──────────────────────────────────────────────────────────────

export interface AboutPillar { icon: string; title: string; description: string }
export interface AboutContent {
  hero: { h1: string; subheadline: string }
  philosophy: { heading: string; intro_paragraph: string; tech_heading: string; tech_paragraph: string }
  pillars: AboutPillar[]
  process_steps: { title: string; subtitle: string; eyebrow: string; steps: HomeStep[] }
  why_choose_us: { visible: boolean; heading: string; items: HomeUSP[] }
  faq: { visible: boolean; heading: string; faqs: HomeFAQ[] }
  cta_banner: { visible: boolean; headline: string; subheadline: string; button_text: string; button_link: string }
}

export const ABOUT_DEFAULTS: AboutContent = {
  hero: { h1: 'Engineering Predictable Organic Search Growth', subheadline: 'We partner with ambitious enterprises and high-growth brands to transform search engines into their highest-ROI customer acquisition channel.' },
  philosophy: {
    heading: 'Moving Beyond Superficial SEO Metrics',
    intro_paragraph: 'Traditional search marketing agencies often drown clients in vanity reports filled with impression metrics and ranking spikes for irrelevant queries. At SEO Expert Agency, we founded our consultancy on a radically transparent premise: SEO only matters when it drives qualified pipeline, organic revenue, and measurable enterprise value.',
    tech_heading: 'Our Technical Engineering Standard',
    tech_paragraph: 'Modern search engines are sophisticated neural information retrieval systems. Winning competitive commercial queries requires full-stack technical excellence: lightning-fast Core Web Vitals, pristine semantic schema architectures, crawl-budget optimization for millions of URLs, and structured topical entity authority.',
  },
  pillars: [
    { icon: '📈', title: 'Data-Driven Engineering', description: 'We treat SEO as a technical engineering discipline. Every recommendation is anchored in log analysis, crawl diagnostics, and statistical keyword intent.' },
    { icon: '🛡️', title: '100% White-Hat Integrity', description: 'Zero shortcuts or private blog networks. We build durable search visibility through authentic digital PR, editorial relevance, and flawless technical hygiene.' },
    { icon: '🎯', title: 'Commercial Intent Focus', description: 'We prioritize search queries that drive qualified sales pipelines, inbound demos, and high-margin transactions over vanity impression spikes.' },
    { icon: '👥', title: 'Senior Strategist Direct Access', description: 'Every client partners directly with seasoned SEO directors and technical leads who have hands-on experience scaling high-traffic enterprise architectures.' },
  ],
  process_steps: { ...HOME_DEFAULTS.process_steps },
  why_choose_us: { visible: true, heading: 'Why Ambitious Brands Choose SEO Expert Agency', items: HOME_DEFAULTS.why_choose_us.items },
  faq: { visible: true, heading: 'Frequently Asked Questions', faqs: [] },
  cta_banner: { visible: true, headline: 'Ready to Partner With an Engineering-Grade SEO Agency?', subheadline: 'Schedule a free technical diagnostic and strategy presentation with our senior directors.', button_text: 'Book Strategy Discovery', button_link: '/contact' },
}

// `...c` is spread first so fields the admin dashboard's fuller AboutContent
// form manages but this public-page schema doesn't render yet (main_content,
// mission, stats) survive an inline save from the public page untouched.
export function mergeAboutContent(saved: Partial<AboutContent> | null | undefined): AboutContent {
  const c = saved ?? {}
  return {
    ...c,
    hero: { ...ABOUT_DEFAULTS.hero, ...c.hero },
    philosophy: { ...ABOUT_DEFAULTS.philosophy, ...c.philosophy },
    pillars: c.pillars && c.pillars.length > 0 ? c.pillars : ABOUT_DEFAULTS.pillars,
    process_steps: { ...ABOUT_DEFAULTS.process_steps, ...c.process_steps },
    why_choose_us: { ...ABOUT_DEFAULTS.why_choose_us, ...c.why_choose_us },
    faq: { ...ABOUT_DEFAULTS.faq, ...c.faq },
    cta_banner: { ...ABOUT_DEFAULTS.cta_banner, ...c.cta_banner },
  }
}

// ─── Contact page ────────────────────────────────────────────────────────────
// Scoped to the hero only in this pass — the rest of the admin schema
// (office details, map, form copy) doesn't yet match the live page's
// hardcoded two-office layout, and reconciling those is a bigger content-model
// change than a text-copy fix.

export interface ContactContent {
  hero: { h1: string; subheadline: string }
}

export const CONTACT_DEFAULTS: ContactContent = {
  hero: { h1: 'Get in Touch With Our SEO Strategists', subheadline: 'Request a comprehensive technical audit, discuss custom retainers, or explore strategic partnerships.' },
}

// `...c` preserves the admin dashboard's other Contact fields (details, maps,
// form, faq) that this public-page schema doesn't render yet.
export function mergeContactContent(saved: Partial<ContactContent> | null | undefined): ContactContent {
  const c = saved ?? {}
  return { ...c, hero: { ...CONTACT_DEFAULTS.hero, ...c.hero } }
}

// ─── Privacy & Terms (shared shape, different content per slug) ─────────────

export interface PolicyContent { h1: string; last_updated: string; content: string }

export const PRIVACY_DEFAULTS: PolicyContent = {
  h1: 'Privacy Policy',
  last_updated: 'January 2026',
  content: `<h2>1. Introduction</h2>
<p>SEO Expert Agency (“we”, “our”, or “us”) is committed to respecting and protecting the privacy of our website visitors, clients, and prospective partners. This Privacy Policy details how we collect, process, and safeguard your data when using our website and services.</p>
<h2>2. Information We Collect</h2>
<p>When you request an SEO audit, submit an inquiry form, or subscribe to our research insights, we may collect:</p>
<ul>
<li>Full Name and Job Title</li>
<li>Business Email Address and Phone Number</li>
<li>Company Name and Website URL</li>
<li>Search marketing objectives, target markets, and project details</li>
<li>Technical data such as IP address, browser type, and interaction metrics</li>
</ul>
<h2>3. How We Use Your Data</h2>
<p>We process your data strictly to:</p>
<ul>
<li>Deliver customized search engine optimization audits and proposals</li>
<li>Communicate project deliverables, reporting dashboards, and updates</li>
<li>Maintain website security, fraud prevention, and rate-limiting safeguards</li>
<li>Comply with applicable legal and statutory regulations</li>
</ul>
<h2>4. Data Confidentiality &amp; Non-Disclosure</h2>
<p>We strictly enforce non-disclosure and confidentiality standards. We do not sell, rent, or trade your personal or business data to third-party advertisers or brokers.</p>
<h2>5. Your Rights &amp; Contact</h2>
<p>You have the right to request access to, correction of, or deletion of your personal data stored in our systems. To submit a data request, please contact our privacy compliance team at <a href="mailto:privacy@seoexpertsagency.co.uk">privacy@seoexpertsagency.co.uk</a>.</p>`,
}

export const TERMS_DEFAULTS: PolicyContent = {
  h1: 'Terms of Service',
  last_updated: 'January 2026',
  content: `<h2>1. Scope of Agreement</h2>
<p>These Terms of Service (“Terms”) govern the professional search engine optimization services, consulting retainers, and digital roadmaps provided by SEO Expert Agency (“Agency”, “we”, “us”) to the Client.</p>
<h2>2. Agency Commitments &amp; Standards</h2>
<p>The Agency agrees to execute all services in accordance with recognized industry best practices and strict compliance with Google Webmaster Guidelines. We do not engage in black-hat link schemes, deceptive cloaking, or automated spam tactics.</p>
<h2>3. Client Responsibilities</h2>
<p>To achieve optimal ranking results, the Client agrees to provide timely access to necessary CMS platforms, analytics properties, Search Console accounts, and technical developer resources where direct implementation is required.</p>
<h2>4. Invoicing &amp; Payment Terms</h2>
<p>Monthly SEO retainers are billed in advance at the start of each service cycle. Customized enterprise projects and one-time technical architecture audits are billed according to the payment schedule agreed upon in the individual Statement of Work (SOW).</p>
<h2>5. Month-to-Month Flexibility &amp; Cancellation</h2>
<p>Unless explicitly specified in an enterprise multi-year agreement, our standard retainer tiers operate with month-to-month flexibility. Either party may cancel the recurring agreement with 30 days’ written notice prior to the next billing cycle.</p>
<h2>6. Intellectual Property</h2>
<p>All custom content, technical audits, schema markup, and strategy documentation created specifically for the Client become the exclusive property of the Client upon full payment of relevant invoices.</p>`,
}

export function mergePolicyContent(defaults: PolicyContent, saved: Partial<PolicyContent> | null | undefined): PolicyContent {
  return { ...defaults, ...saved }
}

// ─── FAQ page ────────────────────────────────────────────────────────────────
// Scoped to the hero and CTA banner in this pass — the admin editor's
// category-grouped FAQ list doesn't yet match the live page's flat extended
// list (HOMEPAGE_FAQS + a few FAQ-page-only questions); reconciling those is
// left for a follow-up.

export interface FaqPageContent {
  hero: { h1: string; subheadline: string }
  cta_banner: { visible: boolean; headline: string; subheadline: string; button_text: string; button_link: string }
}

export const FAQ_PAGE_DEFAULTS: FaqPageContent = {
  hero: { h1: 'Frequently Asked SEO Questions', subheadline: 'Everything you need to know about our data-driven search marketing methodology, deliverables, and retainers.' },
  cta_banner: { visible: true, headline: 'Have a Question Not Listed Here?', subheadline: 'Schedule a 15-minute consultation with our senior SEO architects to discuss your specific website needs.', button_text: 'Ask Our SEO Team', button_link: '/contact' },
}

// `...c` preserves the admin dashboard's `categories` field (this public-page
// schema doesn't render it yet — see note above) across an inline save.
export function mergeFaqPageContent(saved: Partial<FaqPageContent> | null | undefined): FaqPageContent {
  const c = saved ?? {}
  return {
    ...c,
    hero: { ...FAQ_PAGE_DEFAULTS.hero, ...c.hero },
    cta_banner: { ...FAQ_PAGE_DEFAULTS.cta_banner, ...c.cta_banner },
  }
}
