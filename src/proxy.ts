import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  let res = NextResponse.next({ request: req })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          res = NextResponse.next({ request: req })
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = req.nextUrl.pathname
  // NOTE: '/api/admin/...' does not start with '/admin', so these are tracked
  // separately. Both are covered by the matcher at the bottom of this file.
  const isAdminApiPath = pathname.startsWith('/api/admin')
  const isAdminPagePath = pathname.startsWith('/admin')
  const isLoginPath = pathname === '/admin/login'

  const denyUnauthenticated = () =>
    isAdminApiPath
      ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      : NextResponse.redirect(new URL('/admin/login', req.url))

  // Staff membership is a row in public.users, not merely a Supabase session:
  // signUp() on the public anon key yields a valid session with no such row.
  // Resolve it once, up front, so both the login redirect and the guards below
  // agree on who counts as staff.
  let staff: { role: string; is_active: boolean } | null = null
  if (user) {
    const { data } = await supabase
      .from('users')
      .select('role, is_active')
      .eq('id', user.id)
      .maybeSingle()
    if (data && data.is_active !== false) staff = data as { role: string; is_active: boolean }
  }

  if ((isAdminPagePath || isAdminApiPath) && !isLoginPath && !staff) {
    return denyUnauthenticated()
  }

  // Only bounce real staff away from the login page. A signed-in non-staff user
  // must be able to stay here, or they would ping-pong between /admin/login and
  // /admin forever.
  if (isLoginPath && staff) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  // Role restriction: seo_editor may reach ONLY the modules below (allowlist,
  // not blocklist) — everything else under /admin including the dashboard itself
  // is denied. /admin/pages/static is the Static Page SEO editor (separate from
  // the /admin/static-page-seo list view) and must stay allowed alongside it.
  // Keep in step with SEO_EDITOR_ALLOWED in components/admin/AdminSidebar.tsx,
  // which only hides the links — this is what enforces the restriction.
  if (staff && !isLoginPath) {
    if (staff.role === 'seo_editor') {
      // Services/Industries have no admin pages anymore — editing happens
      // inline on the homepage, which only needs the API routes below
      // (already allowed), not an admin page.
      const allowedPages = [
        '/admin/projects', '/admin/locations',
        '/admin/seo-blog', '/admin/static-page-seo', '/admin/pages/static', '/admin/search-content',
      ]
      const allowedApi = [
        '/api/admin/services', '/api/admin/industries', '/api/admin/projects', '/api/admin/locations',
        '/api/admin/seo-blog', '/api/admin/static-page-seo', '/api/admin/pages/static',
        '/api/admin/search-content', '/api/admin/media', '/api/admin/me', '/api/admin/logout',
      ]

      if (pathname.startsWith('/api/admin/')) {
        if (!allowedApi.some(p => pathname === p || pathname.startsWith(p + '/'))) {
          return NextResponse.json({ error: 'Forbidden — SEO editors cannot access this' }, { status: 403 })
        }
      } else if (pathname.startsWith('/admin')) {
        if (!allowedPages.some(p => pathname === p || pathname.startsWith(p + '/'))) {
          return NextResponse.redirect(new URL('/admin/projects?error=access_denied', req.url))
        }
      }
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
