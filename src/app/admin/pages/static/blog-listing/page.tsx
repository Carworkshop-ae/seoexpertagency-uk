'use client'

import { ListingPageEditor } from '@/components/admin/ListingPageEditor'

export default function BlogListingEditor() {
  return (
    <ListingPageEditor
      slug="blog-listing"
      title="Blog List Page"
      viewHref="/blog"
      defaults={{
        h1: 'SEO Insights & Guides',
        subtitle: 'Technical guides, strategy breakdowns and search industry analysis from our team.',
        cta_headline: 'Ready to Grow Your Search Visibility?',
        cta_button_text: 'Get a Free SEO Consultation',
        cta_button_link: '/contact',
      }}
    />
  )
}
