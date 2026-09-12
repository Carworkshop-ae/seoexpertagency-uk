export interface SEOServiceData {
  id: string
  slug: string
  name: string
  shortDescription: string
  icon: string
  startingPrice: string
  heroBadge: string
  headline: string
  subheadline: string
  overview: string
  problemsSolved: Array<{ title: string; description: string }>
  benefits: Array<{ title: string; description: string }>
  deliverables: string[]
  process: Array<{ step: string; title: string; description: string }>
  faqs: Array<{ question: string; answer: string }>
}

export interface SEOIndustryData {
  id: string
  slug: string
  name: string
  shortDescription: string
  icon: string
  heroBadge: string
  headline: string
  subheadline: string
  overview: string
  challenges: Array<{ title: string; description: string }>
  strategy: Array<{ title: string; description: string }>
  recommendedServices: string[]
  deliverables: string[]
  faqs: Array<{ question: string; answer: string }>
}

export interface SEOProjectData {
  id: string
  slug: string
  title: string
  client: string
  industry: string
  timeline: string
  services: string[]
  summary: string
  challenge: string
  strategy: string
  implementation: Array<{ phase: string; title: string; details: string }>
  // Only ever populated with client-verified figures. Optional by design: a
  // case study without measurable, sign-off'd results omits the results block
  // entirely rather than showing placeholder numbers.
  results?: Array<{ metric: string; label: string }>
  deliverables: string[]
}

export interface SEOPackageData {
  id: string
  name: string
  tier: 'basic' | 'silver' | 'gold'
  price: string
  billingPeriod: string
  description: string
  isPopular?: boolean
  ctaLabel: string
  features: string[]
}

export interface SEOLocationData {
  id: string
  slug: string
  name: string
  region: string
  countryCode: string
  heroBadge: string
  headline: string
  subheadline: string
  overview: string
  localFactors: Array<{ title: string; description: string }>
  deliverables: string[]
  faqs: Array<{ question: string; answer: string }>
}

/* ─── Core SEO Services ─────────────────────────────────────────────────── */

export const SEO_SERVICES: SEOServiceData[] = [
  {
    id: 'technical-seo',
    slug: 'technical-seo',
    name: 'Technical SEO',
    shortDescription: 'Deep crawl audits, Core Web Vitals optimization, indexability fixes, and robust schema architecture.',
    icon: 'code',
    startingPrice: '$1,499/mo',
    heroBadge: 'INFRASTRUCTURE & SPEED',
    headline: 'Technical SEO Audits & Architecture Optimization',
    subheadline: 'Eliminate crawl errors, accelerate load times, and build a flawless technical foundation for search engine indexing.',
    overview: 'Search engines reward websites with clean architectures, lightning-fast Core Web Vitals, and unambiguous semantic markup. Our technical SEO engineers perform comprehensive log analysis, server-level audits, and architectural overhauls to ensure zero indexing friction.',
    problemsSolved: [
      { title: 'Crawl Budget Inefficiencies', description: 'Eliminating redirect chains, orphan pages, and index bloat that waste Googlebot crawl resources.' },
      { title: 'Core Web Vitals Degradation', description: 'Resolving Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS) bottlenecks.' },
      { title: 'JavaScript Rendering Issues', description: 'Ensuring client-side dynamic frameworks render and index seamlessly across search engine web crawlers.' },
      { title: 'Structured Data Discrepancies', description: 'Implementing advanced JSON-LD nested schemas for rich snippet qualification and entity validation.' },
    ],
    benefits: [
      { title: 'Accelerated Indexing', description: 'New pages and updates are discovered and ranked faster by primary search engines.' },
      { title: 'Superior Mobile Performance', description: 'Sub-second mobile loading speeds that directly boost mobile search rankings.' },
      { title: 'Rich Snippet Enhancements', description: 'Expanded SERP real estate through FAQ, Breadcrumb, Product, and Organization schemas.' },
      { title: 'Scalable Site Architecture', description: 'Hierarchical taxonomy designed to support tens of thousands of pages without structural decay.' },
    ],
    deliverables: [
      'Comprehensive Technical Audit & Prioritized Action Roadmap',
      'Core Web Vitals & PageSpeed Performance Fixes',
      'XML Sitemap & Robots.txt Re-architecture',
      'Canonicalization & Duplicate Content Resolution',
      'Advanced JSON-LD Structured Data Implementation',
      'Server Log File Analysis & Crawl Pattern Monitoring',
    ],
    process: [
      { step: '01', title: 'Deep Technical Discovery', description: 'Full site crawl, log file audit, JavaScript rendering verification, and Core Web Vitals measurement.' },
      { step: '02', title: 'Architectural Blueprint', description: 'Creation of a developer-ready prioritized remediation sprint with code snippets and URL mappings.' },
      { step: '03', title: 'Implementation & Testing', description: 'Direct developer collaboration or CMS deployment followed by staging and production validation.' },
      { step: '04', title: 'Continuous Crawl Monitoring', description: '24/7 automated indexing health alerts, regression tests, and monthly technical health checkpoints.' },
    ],
    faqs: [
      { question: 'What is included in a Technical SEO audit?', answer: 'Our technical audit evaluates crawlability, indexation status, HTTP status codes, canonical tags, mobile usability, Core Web Vitals, site architecture, XML sitemaps, robots.txt, schema markup, and JavaScript rendering.' },
      { question: 'How quickly do technical fixes impact rankings?', answer: 'Crawl error fixes and indexation improvements often reflect in Search Console within 2 to 4 weeks, with ranking momentum compounding as search engines re-index updated pages.' },
      { question: 'Do you work directly with our engineering team?', answer: 'Yes. We provide production-ready tickets with precise technical specifications, code examples, and staging environment verification.' },
    ],
  },
  {
    id: 'local-seo',
    slug: 'local-seo',
    name: 'Local SEO',
    shortDescription: 'Google Business Profile dominance, geo-targeted localized pages, citation networks, and localized intent capture.',
    icon: 'map-pin',
    startingPrice: '$999/mo',
    heroBadge: 'GEO-TARGETED DOMINANCE',
    headline: 'Local SEO & Google Maps Optimization',
    subheadline: 'Capture high-intent local customers, dominate the Local 3-Pack, and drive qualified phone calls and foot traffic.',
    overview: 'Over 46% of all Google searches have local intent. We optimize your local digital footprint from Google Business Profile category refinement and citation hygiene to localized landing page architectures and proximity signals.',
    problemsSolved: [
      { title: 'Low Local 3-Pack Visibility', description: 'Struggling to appear in the top 3 map results for lucrative "near me" and city-specific queries.' },
      { title: 'Inconsistent NAP Citations', description: 'Conflicting Name, Address, and Phone data across business directories undermining search engine trust.' },
      { title: 'Thin Geo-Landing Pages', description: 'Generic location pages that fail Google quality guidelines and lack local authority signals.' },
      { title: 'Review Velocity & Sentiment Gaps', description: 'Missing a scalable system to generate authentic customer reviews with relevant service keywords.' },
    ],
    benefits: [
      { title: 'Google Maps Top 3 Placement', description: 'High-visibility placement in the map pack where the majority of local clicks and calls originate.' },
      { title: 'Hyper-Targeted Local Traffic', description: 'Attract customers actively seeking your specific services within your target service radius.' },
      { title: 'Multi-Location Scalability', description: 'Standardized local SEO frameworks for multi-branch, regional, and national brands.' },
      { title: 'Transparent Local Tracking', description: 'Geo-grid rank tracking showing exact keyword positions block-by-block across your target region.' },
    ],
    deliverables: [
      'Google Business Profile Full Audit & Optimization',
      'Local Geo-Grid Keyword Rank Tracking & Competitor Heatmaps',
      'NAP Citation Cleanup & Top 50 Directory Distribution',
      'Localized Service Landing Page Architecture',
      'Local Business & Schema.org Geo Coordinates Markup',
      'Review Generation & Reputation Management Strategy',
    ],
    process: [
      { step: '01', title: 'Local Proximity Audit', description: 'Mapping current geo-grid rankings, reviewing GBP category hierarchy, and checking directory citation consistency.' },
      { step: '02', title: 'GBP & Directory Optimization', description: 'Optimizing GBP attributes, service lists, geo-tagged photography, and syncing 50+ tier-1 citation directories.' },
      { step: '03', title: 'Geo-Landing Page Execution', description: 'Building genuine localized content enriched with local neighborhood references and LocalBusiness schema.' },
      { step: '04', title: 'Review & Authority Scaling', description: 'Deploying structured review acquisition campaigns and local community backlink partnerships.' },
    ],
    faqs: [
      { question: 'How long does it take to rank in Google Maps?', answer: 'Initial improvements in the local map pack typically appear within 45 to 90 days following GBP optimization and citation alignment.' },
      { question: 'Can you handle multiple office locations?', answer: 'Yes. We manage local SEO strategies for single-location businesses as well as multi-city and enterprise chains with hundreds of branches.' },
      { question: 'What is NAP consistency?', answer: 'NAP stands for Name, Address, and Phone Number. Consistent NAP information across all internet directories is a fundamental local trust factor.' },
    ],
  },
  {
    id: 'ecommerce-seo',
    slug: 'ecommerce-seo',
    name: 'E-Commerce SEO',
    shortDescription: 'Product page architecture, category faceted navigation SEO, commercial keyword mapping, and revenue scaling.',
    icon: 'shopping-cart',
    startingPrice: '$1,999/mo',
    heroBadge: 'COMMERCIAL REVENUE GROWTH',
    headline: 'E-Commerce SEO for High-Growth Online Stores',
    subheadline: 'Turn organic search into your most profitable revenue channel with scalable category optimization and high-intent product ranking.',
    overview: 'E-commerce SEO requires a specialized approach balancing huge URL catalogs, faceted navigation, stock fluctuations, and intense commercial search intent. We build high-converting category taxonomies and product page authority structures that drive sustainable sales.',
    problemsSolved: [
      { title: 'Faceted Navigation Index Bloat', description: 'Thousands of duplicate filter URL parameter combinations diluting domain crawl budget and equity.' },
      { title: 'Out-of-Stock Product Handling', description: 'Loss of accumulated ranking authority and backlinks when product lines change or sell out.' },
      { title: 'Thin Category Descriptions', description: 'Category pages lacking semantic depth, helpful buyer guidance, and structured commercial relevance.' },
      { title: 'High Paid CAC Dependency', description: 'Over-reliance on escalating Google Shopping and Meta Ad costs eating into e-commerce margins.' },
    ],
    benefits: [
      { title: 'Increased Organic Revenue', description: 'Targeting bottom-of-funnel transactional queries with high commercial buying intent.' },
      { title: 'Sustainable Acquisition Channel', description: 'Compounding organic traffic reducing reliance on expensive paid ad spend.' },
      { title: 'Optimized Category Taxonomies', description: 'Structured category and sub-category hierarchy designed to rank for broad and long-tail terms.' },
      { title: 'Rich Merchant Snippets', description: 'Product schema integration displaying prices, star ratings, and stock availability directly on SERPs.' },
    ],
    deliverables: [
      'E-Commerce Catalog & Architecture Audit',
      'Faceted Filter & Parameter Handling Strategy',
      'Transactional Keyword Mapping & Semantic Category Content',
      'Product Schema (AggregateRating, Offer, InStock, SKU)',
      'Internal Linking Automation & Breadcrumb Optimization',
      'E-Commerce Revenue & Assisted Conversion Tracking',
    ],
    process: [
      { step: '01', title: 'Catalog & Taxonomy Audit', description: 'Evaluating store architecture, indexation rules, faceted navigation, and historical revenue drivers.' },
      { step: '02', title: 'Commercial Keyword Mapping', description: 'Mapping high-value search intent to parent categories, sub-categories, collections, and flagship products.' },
      { step: '03', title: 'On-Page & Schema Integration', description: 'Optimizing product titles, category descriptions, merchant feeds, and Product JSON-LD structured data.' },
      { step: '04', title: 'Authority & Internal Link Building', description: 'Developing thematic collection hubs and earning authoritative product review backlinks.' },
    ],
    faqs: [
      { question: 'Which e-commerce platforms do you support?', answer: 'We support Shopify, Magento / Adobe Commerce, WooCommerce, BigCommerce, Salesforce Commerce Cloud, and headless Next.js / modern custom storefronts.' },
      { question: 'How do you handle out-of-stock items?', answer: 'We implement strategic redirects, internal link suppression, and related product merchandising to preserve accumulated page authority.' },
    ],
  },
  {
    id: 'enterprise-seo',
    slug: 'enterprise-seo',
    name: 'Enterprise SEO',
    shortDescription: 'Scalable automation, cross-department governance, multi-domain architectures, and high-volume index management.',
    icon: 'building-2',
    startingPrice: '$3,499/mo',
    heroBadge: 'SCALE & COMPLEXITY',
    headline: 'Enterprise SEO for High-Volume Brands',
    subheadline: 'Bespoke organic growth frameworks engineered for complex architectures, large tech stacks, and multi-market enterprise operations.',
    overview: 'Enterprise websites operate under unique complexities: legacy technology stacks, multiple regional domains, cross-functional stakeholders, and hundreds of thousands of URLs. We provide executive-level strategic consulting and automated SEO governance.',
    problemsSolved: [
      { title: 'Cross-Department Alignment', description: 'Bridging the gap between engineering, product, legal, and marketing teams to execute SEO initiatives.' },
      { title: 'Crawl Governance at Scale', description: 'Managing millions of URLs to ensure search engines prioritize high-revenue pages efficiently.' },
      { title: 'International & Hreflang Conflicts', description: 'Resolving multi-region and multi-language canonical and localization routing conflicts.' },
      { title: 'Release Regression Risks', description: 'Preventing sudden traffic drops caused by unvetted CMS updates, migrations, and site releases.' },
    ],
    benefits: [
      { title: 'Enterprise-Grade Execution', description: 'Dedicated senior SEO strategists, dedicated technical architects, and proactive risk management.' },
      { title: 'Global Multi-Market Reach', description: 'Flawless international search architecture driving qualified organic traffic across global regions.' },
      { title: 'Custom Analytics & Attribution', description: 'Executive dashboards showing organic contribution to customer pipeline and enterprise revenue.' },
      { title: 'Automated SEO Testing', description: 'CI/CD integration to catch SEO regressions before new code hits production.' },
    ],
    deliverables: [
      'Enterprise Architecture & Multi-Domain Strategy',
      'Hreflang & International Search Governance',
      'Cross-Functional Stakeholder Roadmaps & Training',
      'Executive Search Visibility & Pipeline Attribution Dashboards',
      'Continuous Crawl Diagnostics & Algorithmic Monitoring',
      'Custom Automated SEO Testing Rules for CI/CD Pipelines',
    ],
    process: [
      { step: '01', title: 'Enterprise Discovery & Tech Audit', description: 'Comprehensive audit of server infrastructure, CDN layers, CMS systems, and cross-team dependencies.' },
      { step: '02', title: 'Executive Strategic Roadmap', description: 'Prioritizing high-impact initiatives categorized by engineering effort versus projected revenue return.' },
      { step: '03', title: 'Systematic Sprint Deployment', description: 'Collaborating directly with enterprise scrum teams to implement structural and content updates.' },
      { step: '04', title: 'Governance & Global Expansion', description: 'Deploying continuous monitoring, automated SEO alerts, and global market expansion playbooks.' },
    ],
    faqs: [
      { question: 'What qualifies as an Enterprise SEO project?', answer: 'Websites with over 50,000 pages, multi-region/multi-language operations, complex tech stacks, or organizations requiring multi-department governance.' },
      { question: 'Do you offer white-label or embedded team models?', answer: 'Yes. We frequently act as an extension of internal enterprise growth and engineering teams.' },
    ],
  },
  {
    id: 'seo-strategy',
    slug: 'seo-strategy',
    name: 'SEO Strategy & Roadmapping',
    shortDescription: 'Market research, search intent mapping, competitive gap analysis, and tailored 12-month organic roadmaps.',
    icon: 'compass',
    startingPrice: '$1,299/mo',
    heroBadge: 'DATA-DRIVEN DIRECTION',
    headline: 'Strategic SEO Audits & Growth Roadmapping',
    subheadline: 'A comprehensive, data-backed roadmap designed to outrank competitors and capture high-converting search market share.',
    overview: 'Executing random SEO tactics without a clear strategic roadmap leads to wasted budgets and stagnant rankings. We analyze your industry competitive landscape, uncover high-intent search gaps, and create a structured 12-month strategic plan.',
    problemsSolved: [
      { title: 'Unfocused SEO Tactics', description: 'Executing disjointed SEO activities without clear prioritization or revenue correlation.' },
      { title: 'Competitive Search Blindspots', description: 'Failing to identify where competitors are winning market share and capturing your audience.' },
      { title: 'Wasted Content Budgets', description: 'Publishing articles that drive no organic traffic because keyword intent was never validated.' },
      { title: 'Lack of Clear KPI Tracking', description: 'No clear mechanism to measure ROI, keyword velocity, or organic pipeline contributions.' },
    ],
    benefits: [
      { title: 'Clear 12-Month Roadmap', description: 'A sprint-by-sprint plan outlining exact content, technical, and authority initiatives.' },
      { title: 'Competitive Advantage', description: 'Deep insights into competitor backlink profiles, content gaps, and search vulnerabilities.' },
      { title: 'Budget Efficiency', description: 'Focusing resources strictly on high-impact keywords that directly drive qualified business.' },
      { title: 'Executive Alignment', description: 'Clear forecasts and progress milestones easily communicated to leadership and investors.' },
    ],
    deliverables: [
      'Full Competitor Search Gap & Market Share Analysis',
      'Total Addressable Search Market & Intent Mapping',
      'Prioritized 12-Month Organic Growth Roadmap',
      'Content Pillar & Thematic Architecture Framework',
      'Target Persona & Customer Journey Keyword Matrix',
      'Quarterly Milestone & ROI Forecasting Model',
    ],
    process: [
      { step: '01', title: 'Market & Competitor Extraction', description: 'Analyzing top 5 organic competitors, SERP feature volatility, and historical search trends.' },
      { step: '02', title: 'Total Intent Architecture', description: 'Categorizing hundreds of keywords across informational, commercial, and transactional intent.' },
      { step: '03', title: 'Opportunity Prioritization', description: 'Scoring opportunities based on search volume, commercial value, and ranking difficulty.' },
      { step: '04', title: 'Action Plan Delivery', description: 'Presenting a step-by-step roadmap with clear resource allocations, timelines, and measurable KPIs.' },
    ],
    faqs: [
      { question: 'What is the deliverable of an SEO Strategy engagement?', answer: 'You receive a complete 12-month strategic roadmap including keyword gap analysis, technical recommendations, content editorial calendars, backlink acquisition plans, and executive KPIs.' },
      { question: 'Can our internal team execute the strategy?', answer: 'Yes. We can deliver the roadmap for your internal team to execute with quarterly advisory, or manage full end-to-end execution.' },
    ],
  },
  {
    id: 'on-page-seo',
    slug: 'on-page-seo',
    name: 'On-Page SEO',
    shortDescription: 'Information architecture, semantic keyword optimization, internal link meshes, and conversion rate optimization.',
    icon: 'file-text',
    startingPrice: '$1,199/mo',
    heroBadge: 'PAGE-LEVEL PERFECTION',
    headline: 'On-Page SEO & Content Optimization',
    subheadline: 'Craft perfectly optimized pages that satisfy search engine algorithms while compelling human visitors to convert.',
    overview: 'On-page SEO extends far beyond inserting keywords into title tags. We optimize information architecture, semantic entity relationships, heading hierarchies, multimedia elements, and internal linking structures to establish absolute topical relevance.',
    problemsSolved: [
      { title: 'Keyword Cannibalization', description: 'Multiple internal pages competing for the same search terms and dividing ranking equity.' },
      { title: 'Weak Heading & Semantic Structure', description: 'Pages that fail to communicate clear topical hierarchies and entities to Google NLP algorithms.' },
      { title: 'Low Click-Through Rates (CTR)', description: 'Generic metadata that fails to stand out on crowded search engine results pages.' },
      { title: 'Sub-Optimal Conversion Paths', description: 'Visitors arriving from search engines but bouncing due to poor layout, UX, and weak CTAs.' },
    ],
    benefits: [
      { title: 'Higher SERP Click-Through Rates', description: 'Compelling title tags and meta descriptions engineered for maximum CTR and search engagement.' },
      { title: 'Topical Authority Establishment', description: 'Semantic content coverage satisfying Google Helpful Content and E-E-A-T guidelines.' },
      { title: 'Maximized Page Authority Flow', description: 'Strategic internal linking directing equity to your highest-value conversion pages.' },
      { title: 'Enhanced User Engagement', description: 'Structured layouts and rich media that decrease bounce rates and increase session duration.' },
    ],
    deliverables: [
      'Full Site On-Page & Semantic Content Audit',
      'Title Tag, Meta Description & Open Graph Optimization',
      'H1-H6 Heading Hierarchy & NLP Entity Integration',
      'Internal Linking Mesh Strategy & Anchor Text Optimization',
      'Image Optimization, Alt Text & Multimedia Enhancement',
      'Conversion-Focused Call-to-Action (CTA) Placement',
    ],
    process: [
      { step: '01', title: 'Page-Level Diagnostic', description: 'Auditing existing content depth, semantic entity coverage, user engagement signals, and metadata.' },
      { step: '02', title: 'Semantic Keyword Expansion', description: 'Identifying secondary keywords, related entities, and search intent nuances using natural language processing tools.' },
      { step: '03', title: 'On-Page Restructuring', description: 'Refining headings, body copy, tables, multimedia, and metadata for search and conversion clarity.' },
      { step: '04', title: 'Internal Link Mesh', description: 'Interlinking related topic clusters to pass authority smoothly to your core commercial offerings.' },
    ],
    faqs: [
      { question: 'Will on-page changes disrupt our current rankings?', answer: 'Our on-page optimizations are data-backed and designed to enhance ranking signals without removing established keyword relevance.' },
      { question: 'How do you measure on-page SEO success?', answer: 'We track keyword position velocity, organic impressions, organic click-through rates (CTR), average time on page, and conversion rates.' },
    ],
  },
  {
    id: 'off-page-seo',
    slug: 'off-page-seo',
    name: 'Off-Page SEO & Link Building',
    shortDescription: 'High-authority digital PR, editorial outreach, brand mentions, and contextual backlink acquisition.',
    icon: 'link-2',
    startingPrice: '$1,799/mo',
    heroBadge: 'AUTHORITY & TRUST',
    headline: 'High-Authority Link Building & Digital PR',
    subheadline: 'Earn natural, high-impact editorial backlinks from industry-leading publications to build unassailable domain authority.',
    overview: 'Backlinks remain one of Google\'s top ranking signals. However, low-quality spam links can trigger manual penalties. We focus exclusively on white-hat digital PR, editorial outreach, industry research curation, and relationship-driven placements.',
    problemsSolved: [
      { title: 'Stagnant Domain Authority', description: 'High-quality on-page content that fails to rank on page 1 due to lack of domain trust and backlink weight.' },
      { title: 'Toxic Backlink Profiles', description: 'Historical legacy spam links holding back organic performance and risking algorithmic suppression.' },
      { title: 'Competitor Authority Gaps', description: 'Competitors holding commanding ranking leads due to superior high-tier media mentions.' },
      { title: 'Wasted PR Investment', description: 'Press coverage that fails to secure SEO value, canonical links, and referral equity.' },
    ],
    benefits: [
      { title: '100% White-Hat Editorial Links', description: 'Securing genuine contextual placements on high-DR, high-traffic industry publications.' },
      { title: 'Compounded Domain Authority', description: 'Elevating site-wide domain trust so all current and future published content ranks faster.' },
      { title: 'Referral Traffic & Brand Awareness', description: 'Placements in authoritative media that drive direct customer traffic and industry credibility.' },
      { title: 'Clean, Penalty-Proof Profile', description: 'Rigorous link quality standards protecting your brand against algorithm shifts.' },
    ],
    deliverables: [
      'Comprehensive Backlink Profile & Toxic Link Audit',
      'Competitor Backlink Intersect & Gap Analysis',
      'Data-Driven Digital PR & Original Research Campaigns',
      'Targeted Editorial Outreach & Guest Placements',
      'Unlinked Brand Mention Claiming & Reclamation',
      'Monthly Transparent Link Acquisition Reporting',
    ],
    process: [
      { step: '01', title: 'Profile & Competitor Analysis', description: 'Reviewing current backlink health, anchor text distribution, and competitor link acquisition strategies.' },
      { step: '02', title: 'Asset & Story Ideation', description: 'Developing data studies, industry insights, and linkable assets that journalists and editors naturally reference.' },
      { step: '03', title: 'Targeted Outreach', description: 'Pitching personalized angles to tier-1 industry publishers, journalists, and authoritative webmasters.' },
      { step: '04', title: 'Quality Verification & Reporting', description: 'Verifying every link against strict traffic, relevance, indexation, and authority criteria.' },
    ],
    faqs: [
      { question: 'Do you buy links or use Private Blog Networks (PBNs)?', answer: 'No. We strictly adhere to Google guidelines and never use PBNs, automated spam, or low-quality link farms. All placements are earned through manual editorial outreach.' },
      { question: 'How many links will we get per month?', answer: 'We prioritize link quality and authority over raw quantity. Monthly deliverables vary by package tier, typically ranging from 4 to 15+ premium placements.' },
    ],
  },
  {
    id: 'content-seo',
    slug: 'content-seo',
    name: 'Content SEO & Topic Clusters',
    shortDescription: 'High-intent keyword content hubs, thought leadership articles, topical authority frameworks, and E-E-A-T optimization.',
    icon: 'pen-tool',
    startingPrice: '$1,399/mo',
    heroBadge: 'TOPICAL AUTHORITY',
    headline: 'Content SEO & Topical Authority Strategy',
    subheadline: 'Publish authoritative, search-optimized content that answers buyer queries and establishes industry leadership.',
    overview: 'Modern search engines prioritize topical authority over isolated keyword density. We build complete topic clusters and pillar pages that thoroughly answer user intent, satisfy Google E-E-A-T standards, and guide readers toward conversion.',
    problemsSolved: [
      { title: 'Random, Unranked Blog Posts', description: 'Spending resources writing blog posts that never generate meaningful organic traffic or leads.' },
      { title: 'Shallow Content Depth', description: 'Generic articles that fail Google Helpful Content assessments and lack unique value.' },
      { title: 'Missing Topic Authority', description: 'Having fragmented content that fails to convince search engines that you are the definitive industry expert.' },
      { title: 'Weak Reader Conversion', description: 'Informational traffic reading articles and leaving without taking any commercial action.' },
    ],
    benefits: [
      { title: 'Dominant Topical Authority', description: 'Comprehensive coverage of key themes establishing your brand as the leading authority.' },
      { title: 'High-Intent Pipeline Growth', description: 'Content mapped directly across the buyer journey from awareness to purchase consideration.' },
      { title: 'Full E-E-A-T Compliance', description: 'Demonstrated Experience, Expertise, Authoritativeness, and Trustworthiness in every piece.' },
      { title: 'Long-Term Compounding Traffic', description: 'Evergreen search assets that continue to attract qualified organic visitors for years.' },
    ],
    deliverables: [
      'Comprehensive Topic Cluster & Pillar Strategy',
      'Editorial Calendar with Search Intent Mapping',
      'Expert-Led, SEO-Optimized Long-Form Articles',
      'Original Graphics, Infographics & Visual Data Points',
      'Author Bio, Fact-Checking & E-E-A-T Signal Integration',
      'Content Performance & Attribution Analytics',
    ],
    process: [
      { step: '01', title: 'Topical Authority Mapping', description: 'Mapping core pillar topics and sub-topics needed to completely cover your domain expertise.' },
      { step: '02', title: 'Briefing & Intent Structuring', description: 'Creating detailed content briefs with target headings, search questions, entities, and conversion CTAs.' },
      { step: '03', title: 'Expert Content Production', description: 'Drafting in-depth, original, and well-researched content crafted by industry subject matter specialists.' },
      { step: '04', title: 'Optimization & Cross-Linking', description: 'Publishing with semantic markup, rich media, and systematic internal links to core commercial pages.' },
    ],
    faqs: [
      { question: 'How is your content different from generic AI content?', answer: 'We combine expert human domain knowledge, proprietary industry data, original research, and strategic search optimization that algorithms reward and readers trust.' },
      { question: 'Who owns the content produced?', answer: 'You own 100% of all content, graphics, and research assets produced during our engagement.' },
    ],
  },
]

/* ─── Industries We Serve ───────────────────────────────────────────────── */

export const SEO_INDUSTRIES: SEOIndustryData[] = [
  {
    id: 'saas',
    slug: 'saas',
    name: 'SaaS & Tech SEO',
    shortDescription: 'High-intent B2B search capture, product-led SEO hubs, comparison pages, and trial conversion funnels.',
    icon: 'cpu',
    heroBadge: 'B2B SOFTWARE GROWTH',
    headline: 'SaaS SEO That Drives Demos, Trials & Pipeline',
    subheadline: 'Scale customer acquisition with high-intent product comparison hubs, feature pages, and bottom-of-funnel keyword dominance.',
    overview: 'SaaS SEO is uniquely challenging due to high competitive saturation and complex B2B buyer journeys. We focus on high-intent product-led content, "alternative to" comparison hubs, integration directories, and bottom-of-funnel terms that drive qualified pipeline rather than vanity impressions.',
    challenges: [
      { title: 'High CPC in Paid Channels', description: 'Escalating Google Ads costs making paid acquisition unsustainable for customer payback periods.' },
      { title: 'Complex Buyer Personas', description: 'Multiple decision-makers (CTOs, developers, end-users) requiring tailored search entry points.' },
      { title: 'Aggressive Aggregator Competition', description: 'Review sites like G2 and Capterra dominating top commercial software keywords.' },
    ],
    strategy: [
      { title: 'Alternative & Comparison Engine', description: 'Building high-converting "X vs Y" and "Best X Alternatives" comparison architectures.' },
      { title: 'Product-Led Topic Hubs', description: 'Developing programmatic template hubs for integrations, use-cases, and workflow templates.' },
      { title: 'B2B Digital PR & Tech Backlinks', description: 'Earning editorial backlinks on high-DR developer, startup, and business technology platforms.' },
    ],
    recommendedServices: ['technical-seo', 'content-seo', 'on-page-seo', 'off-page-seo'],
    deliverables: [
      'SaaS Competitor Search Landscape & CAC Analysis',
      'Bottom-of-Funnel Product Comparison Hub Architecture',
      'Integration & Use-Case Programmatic SEO Blueprint',
      'High-DR Tech Publication Digital PR Outreach',
      'Demo & Trial Conversion Funnel Optimization',
    ],
    faqs: [
      { question: 'How do you measure SaaS SEO ROI?', answer: 'We track product signups, demo requests, trial activations, pipeline revenue, and Customer Acquisition Cost (CAC) reduction.' },
      { question: 'Can you rank above G2 and Capterra?', answer: 'Yes. By providing deeper comparisons, interactive feature matrices, and proprietary benchmark data, we consistently win top SERP spots.' },
    ],
  },
  {
    id: 'ecommerce',
    slug: 'ecommerce',
    name: 'E-Commerce & Retail',
    shortDescription: 'Product catalog optimization, category hierarchy SEO, faceted filter indexing, and organic revenue scaling.',
    icon: 'shopping-bag',
    heroBadge: 'DIRECT-TO-CONSUMER & RETAIL',
    headline: 'E-Commerce SEO That Maximizes Store Revenue',
    subheadline: 'Scale organic sales with structured category taxonomies, merchant schema feeds, and high-converting product optimization.',
    overview: 'Online retail is a high-volume, dynamic environment. We implement technical indexing solutions for large SKU catalogs and craft rich collection landing pages that outrank marketplace giants for high-value transactional queries.',
    challenges: [
      { title: 'Crawl Inefficiencies & Parameter Bloat', description: 'Filter combinations and pagination eating crawl budget and creating duplicate content.' },
      { title: 'Fast-Moving Product Life Cycles', description: 'Preserving ranking power when seasonal inventory changes or items go out of stock.' },
      { title: 'Competing with Mega Marketplaces', description: 'Standing out against Amazon and large retailers for competitive product categories.' },
    ],
    strategy: [
      { title: 'Faceted Navigation Governance', description: 'Configuring canonicals, noindex rules, and selective indexation for high-demand filter terms.' },
      { title: 'Topical Category Content', description: 'Enriching collection pages with buying guides, buyer FAQs, and semantic sub-category links.' },
      { title: 'Rich Merchant Schema Integration', description: 'Deploying structured data that showcases ratings, pricing, and availability in search results.' },
    ],
    recommendedServices: ['ecommerce-seo', 'technical-seo', 'on-page-seo', 'off-page-seo'],
    deliverables: [
      'Catalog Indexation & Faceted Filter Optimization',
      'Transactional Keyword Collection Architecture',
      'Product Schema & Merchant Center Optimization',
      'E-Commerce Authority Link Acquisition',
    ],
    faqs: [
      { question: 'How long until we see revenue increases?', answer: 'E-commerce improvements often demonstrate measurable organic revenue growth within 3 to 6 months of category and technical optimization.' },
    ],
  },
  {
    id: 'healthcare',
    slug: 'healthcare',
    name: 'Healthcare & Medical',
    shortDescription: 'Medical E-E-A-T compliance, clinic local SEO, patient trust building, and certified healthcare content.',
    icon: 'activity',
    heroBadge: 'MEDICAL & HEALTHCARE E-E-A-T',
    headline: 'Healthcare SEO That Builds Patient Trust',
    subheadline: 'Strict YMYL (Your Money Your Life) search compliance, clinical expert verification, and local patient acquisition.',
    overview: 'Healthcare websites face Google\'s strictest quality standards under YMYL algorithms. We ensure your medical content meets rigorous E-E-A-T criteria, showcases doctor credentials, and captures local patients looking for specialized treatments.',
    challenges: [
      { title: 'Strict YMYL Algorithm Standards', description: 'Severe ranking penalties for medical content lacking verifiable doctor authorship and peer citations.' },
      { title: 'Local Patient Proximity Competition', description: 'Competing against hospital networks in local map packs for high-value surgical and clinical queries.' },
      { title: 'Patient Privacy & Ethical Compliance', description: 'Adhering to medical advertising regulations while maintaining conversion-optimized booking flows.' },
    ],
    strategy: [
      { title: 'Physician Author & Reviewer Schema', description: 'Implementing MedicalScholarlyArticle and Person schema verifying doctor credentials and licenses.' },
      { title: 'Condition & Treatment Topic Hubs', description: 'Creating comprehensive, fact-checked patient resources with peer-reviewed medical citations.' },
      { title: 'Clinic Local 3-Pack Optimization', description: 'Dominating local clinic map results with verified attributes, doctor profiles, and patient reviews.' },
    ],
    recommendedServices: ['local-seo', 'content-seo', 'technical-seo', 'on-page-seo'],
    deliverables: [
      'Healthcare E-E-A-T & Medical Schema Audit',
      'Verified Clinical Author Attribution System',
      'Local Clinic Map Pack & Directory Synchronization',
      'Condition-Specific Patient Content Architecture',
    ],
    faqs: [
      { question: 'Do doctors need to review the content?', answer: 'Yes. For medical SEO compliance, we work with your certified medical practitioners or board-certified editors to review and sign off on all health content.' },
    ],
  },
  {
    id: 'real-estate',
    slug: 'real-estate',
    name: 'Real Estate & Property',
    shortDescription: 'Neighborhood landing pages, property listing SEO, developer project launches, and investor lead generation.',
    icon: 'home',
    heroBadge: 'PROPERTY & DEVELOPMENTS',
    headline: 'Real Estate SEO for Agencies & Developers',
    subheadline: 'Capture luxury home buyers, international investors, and high-intent property searchers with localized market pages.',
    overview: 'Real estate search intent is hyper-localized and highly competitive. We design neighborhood guides, master community pages, and developer project hubs that rank for high-value off-plan and luxury property queries.',
    challenges: [
      { title: 'Aggregator Monopolies', description: 'Competing against giant real estate portals with millions of indexed property listings.' },
      { title: 'Fast Listing Turnover', description: 'Sold listings expiring quickly and leading to 404 errors and lost ranking equity.' },
      { title: 'International Buyer Targeting', description: 'Attracting high-net-worth foreign investors searching across different languages and regions.' },
    ],
    strategy: [
      { title: 'Community & Neighborhood Pillar Hubs', description: 'Building comprehensive lifestyle, school, and ROI guides for specific areas and developments.' },
      { title: 'Off-Plan Project Launch SEO', description: 'Dominating search results for newly announced property developments and master communities.' },
      { title: 'RealEstateListing & Place Schema', description: 'Embedding geo-coordinates, developer credentials, and architectural property schema.' },
    ],
    recommendedServices: ['local-seo', 'technical-seo', 'content-seo', 'off-page-seo'],
    deliverables: [
      'Community & Neighborhood Landing Page Blueprint',
      'Off-Plan Development Launch SEO Playbook',
      'Real Estate Listing Schema & Map Integration',
      'Investor-Focused Digital PR & Property Media Outreach',
    ],
    faqs: [
      { question: 'How do you outrank real estate portals?', answer: 'By creating deep, community-specific guides, video walkthroughs, and specialized investment analysis that generic portals cannot match.' },
    ],
  },
  {
    id: 'finance',
    slug: 'finance',
    name: 'Finance & FinTech',
    shortDescription: 'FinTech product SEO, compliance-ready content, financial calculator ranking, and B2B finance acquisition.',
    icon: 'trending-up',
    heroBadge: 'FINTECH & FINANCIAL SERVICES',
    headline: 'Finance SEO for FinTech & Advisory Brands',
    subheadline: 'Build unmatched search authority for high-stakes financial queries with rigorous regulatory and E-E-A-T compliance.',
    overview: 'Financial topics require bulletproof trust and authoritative signals. We build interactive calculator tools, regulatory-compliant educational resources, and institutional-grade backlink profiles.',
    challenges: [
      { title: 'Rigorous Financial YMYL Standards', description: 'Google requires clear expert authorship, disclosures, and institutional credibility.' },
      { title: 'Regulatory Compliance Constraints', description: 'Balancing strict financial advertising rules with engaging, ranking-optimized copy.' },
      { title: 'High Search Competition', description: 'Competing against established banking institutions and major financial news portals.' },
    ],
    strategy: [
      { title: 'Interactive Financial Tool Hubs', description: 'Building mortgage, loan, and investment calculators that earn natural high-authority links.' },
      { title: 'Accredited Expert Author Signals', description: 'Showcasing CFA, CFP, and financial advisor credentials with verified Person schema.' },
      { title: 'Institutional Digital PR', description: 'Placing commentary and financial market data studies in tier-1 business and economics media.' },
    ],
    recommendedServices: ['technical-seo', 'content-seo', 'off-page-seo', 'seo-strategy'],
    deliverables: [
      'Financial YMYL Compliance Audit & Schema Framework',
      'Interactive Calculator & Tool SEO Optimization',
      'Accredited Advisor E-E-A-T Content Review Process',
      'Tier-1 Finance & Business Media Digital PR Placements',
    ],
    faqs: [
      { question: 'How do you handle compliance and disclaimers?', answer: 'All content templates include standardized legal disclosures, dynamic disclaimer components, and regulatory review sign-off steps.' },
    ],
  },
  {
    id: 'professional-services',
    slug: 'professional-services',
    name: 'Professional Services',
    shortDescription: 'Legal, consulting, accounting, and corporate service client acquisition through authority search dominance.',
    icon: 'briefcase',
    heroBadge: 'CORPORATE & LEGAL ADVISORY',
    headline: 'SEO for Law Firms, Consultants & Corporate Advisory',
    subheadline: 'Attract corporate decision-makers, high-value retainers, and specialized legal or consulting inquiries.',
    overview: 'For corporate advisory firms, search volume is often lower, but transaction values are exceptionally high. We focus on high-intent commercial B2B terms, partner thought leadership, and corporate case study optimization.',
    challenges: [
      { title: 'Niche, Low-Volume Search Intent', description: 'High-value queries having low monthly volume but requiring precise commercial relevance.' },
      { title: 'Partner Credibility Demonstration', description: 'Communicating senior partner credentials and complex regulatory specializations effectively.' },
      { title: 'Lengthy B2B Sales Cycles', description: 'Nurturing multi-stakeholder corporate evaluation committees through search touchpoints.' },
    ],
    strategy: [
      { title: 'Practice Area Authority Silos', description: 'Structuring dedicated practice area hubs with regulatory commentary and partner insights.' },
      { title: 'Corporate Case Study Architecture', description: 'Optimizing proof-of-work case studies for corporate problem searches.' },
      { title: 'Industry Leadership PR', description: 'Earning backlinks through legal, consulting, and corporate governance journals.' },
    ],
    recommendedServices: ['seo-strategy', 'content-seo', 'local-seo', 'off-page-seo'],
    deliverables: [
      'Practice Area Taxonomy & Content Blueprint',
      'Partner Bio & Legal Service Schema Integration',
      'B2B Decision-Maker Search Journey Mapping',
      'High-Authority Corporate Digital PR Placements',
    ],
    faqs: [
      { question: 'Is SEO effective for corporate law and advisory firms?', answer: 'Yes. While search volumes are specialized, a single qualified corporate client acquisition can deliver substantial ROI on the annual SEO retainer.' },
    ],
  },
]

/* ─── Projects / Case Studies ───────────────────────────────────────────── */

// Case studies are client-supplied and CMS-managed (admin → Projects).
// Intentionally empty: we publish no case study until the client name and
// any figures shown have been verified and approved for publication.
// The shape above is the contract the CMS and the /projects templates share.
export const SEO_PROJECTS: SEOProjectData[] = []

/* ─── Packages / Pricing ────────────────────────────────────────────────── */

export const SEO_PACKAGES: SEOPackageData[] = [
  {
    id: 'basic',
    name: 'BASIC',
    tier: 'basic',
    price: '$1,490',
    billingPeriod: 'per month',
    description: 'Essential SEO foundation and steady organic growth for emerging businesses and local service brands.',
    ctaLabel: 'Get Started with Basic',
    features: [
      'Comprehensive Initial Technical Audit',
      'Up to 25 Target Keywords Monitored',
      'On-Page Optimization for up to 10 Key Pages/mo',
      '2 In-Depth SEO Articles (1,500+ words/mo)',
      'Google Business Profile & Local 3-Pack Optimization',
      '3 High-Quality Contextual Backlinks/mo',
      'Monthly Performance & Keyword Velocity Report',
      'Dedicated SEO Account Manager',
    ],
  },
  {
    id: 'silver',
    name: 'SILVER',
    tier: 'silver',
    price: '$2,890',
    billingPeriod: 'per month',
    description: 'Our most popular comprehensive growth package for scaling companies targeting competitive commercial keywords.',
    isPopular: true,
    ctaLabel: 'Claim Growth Package',
    features: [
      'Everything in Basic Package',
      'Up to 75 Target Keywords Monitored',
      'On-Page Optimization for up to 25 Pages/mo',
      '4 In-Depth SEO Articles & Topic Clusters/mo',
      'Full Core Web Vitals & Technical Maintenance',
      '7 High-Authority Editorial Backlinks/mo',
      'Competitor Search Gap & Content Tracking',
      'Interactive Conversion Rate (CRO) Recommendations',
      'Bi-Weekly Strategy Calls & Custom Dashboard',
    ],
  },
  {
    id: 'gold',
    name: 'GOLD',
    tier: 'gold',
    price: '$4,990',
    billingPeriod: 'per month',
    description: 'Enterprise-grade search domination for high-growth e-commerce, multi-location, and high-volume brands.',
    ctaLabel: 'Scale with Enterprise Gold',
    features: [
      'Everything in Silver Package',
      'Unlimited Target Keywords Monitored',
      'Comprehensive Site-Wide Architecture Governance',
      '8 In-Depth SEO Articles & Pillar Page Hubs/mo',
      'Custom Programmatic / Faceted Navigation SEO',
      '15+ Premium Tier-1 Digital PR Backlinks/mo',
      'Multi-Location / Multi-Region International SEO',
      'Direct Slack/Teams Channel with Senior Strategist',
      'Weekly Sprint Reviews & Executive KPI Reporting',
    ],
  },
]

/* ─── Location SEO Data ─────────────────────────────────────────────────── */

export const SEO_LOCATIONS: SEOLocationData[] = [
  {
    id: 'uae',
    slug: 'uae',
    name: 'United Arab Emirates (UAE)',
    region: 'Middle East',
    countryCode: 'AE',
    heroBadge: 'UAE & DUBAI SEARCH DOMINANCE',
    headline: 'SEO Agency in the UAE & Dubai',
    subheadline: 'Data-driven search engine optimization tailored to the competitive UAE market, capturing high-intent consumers and B2B leaders.',
    overview: 'The UAE is one of the most dynamic and digitally connected markets in the world. Operating across Dubai, Abu Dhabi, and the Northern Emirates requires a sophisticated grasp of localized search intent, multilingual considerations, and aggressive commercial competition.',
    localFactors: [
      { title: 'Bilingual Search Landscape', description: 'Optimizing for dual English and Arabic search patterns to capture the full breadth of UAE consumers and business leaders.' },
      { title: 'Hyper-Competitive Commercial Verticals', description: 'Winning top spots in saturated UAE sectors like Real Estate, Financial Services, E-Commerce, and Luxury Goods.' },
      { title: 'Proximity & Map Pack Dominance', description: 'Fine-tuning Google Business Profiles across Dubai, Abu Dhabi, Sharjah, and key freezones.' },
    ],
    deliverables: [
      'UAE Market & Search Intent Gap Audit',
      'Bilingual Keyword Mapping & Content Strategy',
      'UAE Directory & Local Authority Citation Distribution',
      'Dubai & Abu Dhabi Geo-Grid Ranking Tracking',
      'Localized Schema & Geo-Coordinate Embedding',
    ],
    faqs: [
      { question: 'Do you provide SEO across all UAE Emirates?', answer: 'Yes. We optimize campaigns targeting Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain.' },
      { question: 'Can you optimize for both English and Arabic search queries?', answer: 'Yes. We provide native bilingual search optimization respecting cultural and regional linguistic nuances.' },
    ],
  },
  {
    id: 'uk',
    slug: 'uk',
    name: 'United Kingdom (UK)',
    region: 'Europe',
    countryCode: 'GB',
    heroBadge: 'UK NATIONAL & LONDON SEARCH',
    headline: 'SEO Agency in the United Kingdom',
    subheadline: 'Scale organic search visibility across London, Manchester, Birmingham, and throughout the UK with high-authority strategies.',
    overview: 'The UK digital landscape is highly mature and fiercely contested. We provide UK-tailored technical architecture, high-tier British media digital PR, and localized regional targeting designed to capture valuable market share.',
    localFactors: [
      { title: 'Mature SERP Features & E-E-A-T', description: 'Overcoming rigorous quality standards in a market where search engines heavily scrutinize brand authority.' },
      { title: 'Regional City Hubs', description: 'Targeting regional economic powerhouses including London, Manchester, Birmingham, Leeds, and Edinburgh.' },
      { title: 'UK Editorial Link Networks', description: 'Securing contextual coverage across reputable British digital publications and industry journals.' },
    ],
    deliverables: [
      'UK National & Regional Search Competitive Audit',
      'High-Authority UK Digital PR & Editorial Link Acquisition',
      'Localized City-Specific Landing Page Frameworks',
      'Core Web Vitals & Fast European CDN Integration',
      'UK Commercial SERP Feature & Snippet Capture',
    ],
    faqs: [
      { question: 'Do you work with UK-based and international brands entering the UK?', answer: 'Yes. We assist both established UK enterprises and international companies scaling into the British market.' },
      { question: 'How do you acquire UK backlinks?', answer: 'Through targeted digital PR campaigns, proprietary data journalism, and direct outreach to British editors and industry journalists.' },
    ],
  },
  {
    id: 'global',
    slug: 'global',
    name: 'Global / International',
    region: 'Worldwide',
    countryCode: 'GLOBAL',
    heroBadge: 'INTERNATIONAL SEARCH EXPANSION',
    headline: 'International & Global SEO Agency',
    subheadline: 'Expand your organic market footprint across multiple countries, languages, and search engines with international SEO governance.',
    overview: 'Expanding internationally requires precise technical execution: ccTLDs vs subdirectories, correct hreflang tag deployment, server latency reduction, and culturally authentic localized content.',
    localFactors: [
      { title: 'Hreflang & Multi-Region Governance', description: 'Eliminating cross-border duplicate content issues and routing searchers to the exact regional URL version.' },
      { title: 'Localized Search Engine Algorithms', description: 'Optimizing for regional search engine preferences (Google, Bing, Yandex, Baidu).' },
      { title: 'Global CDN & Low-Latency Caching', description: 'Ensuring sub-second load times regardless of user location across North America, Europe, Asia, and the Middle East.' },
    ],
    deliverables: [
      'Global Multi-Domain & Subdirectory Architecture Blueprint',
      'Hreflang XML Sitemap & Tag Validation',
      'Multi-Language Keyword Intent Translation & Optimization',
      'International Backlink Equity Distribution Strategy',
    ],
    faqs: [
      { question: 'Should we use ccTLDs, subdomains, or subdirectories?', answer: 'We analyze your domain authority, infrastructure costs, and brand goals to determine the optimal international URL structure.' },
    ],
  },
]

/* ─── Frequently Asked Questions ────────────────────────────────────────── */

export const HOMEPAGE_FAQS = [
  {
    question: 'How long does SEO take to produce measurable business results?',
    answer: 'While technical fixes and indexation updates can show early movement within 30 to 60 days, significant commercial ranking momentum and compounding organic revenue growth typically mature between 3 to 6 months. SEO is a compounding investment where authority builds over time.',
  },
  {
    question: 'What is included in your monthly SEO agency retainers?',
    answer: 'Our retainers provide end-to-end execution: comprehensive technical audits and ongoing site maintenance, keyword research and intent mapping, on-page optimization, monthly high-authority editorial content production, white-hat digital PR and backlink acquisition, and transparent monthly performance reporting with direct access to your dedicated strategist.',
  },
  {
    question: 'How do you differ from generic SEO agencies?',
    answer: 'We focus strictly on business metrics (qualified leads, demo requests, and direct organic revenue) rather than vanity keyword rankings. We use 100% white-hat techniques, provide completely transparent monthly deliverables, never lock clients into hostile long-term contracts, and build custom strategies tailored to your exact industry.',
  },
  {
    question: 'Do you guarantee #1 rankings on Google?',
    answer: 'No ethical SEO agency can guarantee specific #1 positions because search engine algorithms are proprietary and dynamic. However, we guarantee proven, data-backed methodologies, transparent deliverables, and a track record of consistently outranking competitors in competitive verticals.',
  },
  {
    question: 'How do you measure and report on SEO performance?',
    answer: 'You receive a 24/7 real-time dashboard tracking keyword position velocity, organic impressions, click-through rates, organic traffic growth, and conversion/revenue attribution, alongside scheduled bi-weekly or monthly strategy reviews with your dedicated team.',
  },
  {
    question: 'Can you work alongside our internal developers and copywriters?',
    answer: 'Yes. We regularly collaborate with in-house engineering and content teams, providing production-ready tickets, content briefs, and technical guidance, or we can handle complete turnkey execution if you prefer hands-off management.',
  },
]
