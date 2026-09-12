import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SEO Expert Agency',
    short_name: 'SEO Agency',
    description: 'Data-driven search engine optimization and technical SEO consultancy.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#0066FF',
    // Installability requires a declared 192px and 512px icon. The previous
    // entries pointed at 1024px files that were JPEG bytes behind a .png
    // extension, so the declared type was wrong too.
    //
    // `maskable` is deliberately NOT declared: a maskable icon needs ~20% of
    // safe padding around the mark, and cropping the existing logo to that
    // spec is a design decision, not a build step. Android will letterbox
    // these instead of cropping the logo badly.
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
