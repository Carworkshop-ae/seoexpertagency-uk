import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { getHreflangCode } from '@/lib/market'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0066FF',
}

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL
const siteUrl = rawUrl && (rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))
  ? rawUrl
  : 'https://seoexpertagency.co.uk'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SEO Expert Agency — Data-Driven Search Engine Optimization',
    template: '%s',
  },
  description:
    'Data-driven SEO agency delivering predictable organic search traffic, high-intent keyword dominance, and measurable commercial revenue growth.',
  keywords: [
    'SEO agency',
    'technical SEO',
    'local SEO',
    'enterprise SEO',
    'e-commerce SEO',
    'digital PR',
    'search engine optimization',
    'SEO consultancy',
  ],
  authors: [{ name: 'SEO Expert Agency', url: siteUrl }],
  creator: 'SEO Expert Agency',
  publisher: 'SEO Expert Agency',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'SEO Expert Agency',
    title: 'SEO Expert Agency — Data-Driven Search Engine Optimization',
    description:
      'Data-driven SEO agency delivering predictable organic search traffic, high-intent keyword dominance, and measurable commercial revenue growth.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'SEO Expert Agency' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Expert Agency — Data-Driven Search Engine Optimization',
    description:
      'Data-driven SEO agency delivering predictable organic search traffic, high-intent keyword dominance, and measurable commercial revenue growth.',
    images: ['/og-default.jpg'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl, languages: { [getHreflangCode()]: siteUrl, 'x-default': siteUrl } },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', type: 'image/png' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
