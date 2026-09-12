import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

function cleanEnv(val: string | undefined): string {
  return val ? val.replace(/^["']|["']$/g, '').trim() : ''
}

// Cookieless anon client for PUBLIC SSR/ISR pages. Because it never touches
// cookies()/headers(), it does NOT opt routes into dynamic rendering — pages
// keep their `revalidate` ISR / static behaviour. RLS `public_read_*` policies
// (status = 'published') allow anon SELECT. Memoised: one client per server
// process, reused across requests (no per-request session needed).
let publicClient: SupabaseClient<Database> | null = null

export function createPublicSupabase(): SupabaseClient<Database> {
  if (!publicClient) {
    const url = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) || 'http://127.0.0.1:54321'
    const anonKey = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || ''

    publicClient = createClient<Database>(
      url,
      anonKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
        global: {
          // Next.js patches global fetch and, on a route with `export const
          // revalidate = N`, applies that same time-based caching to every
          // fetch made during render — including this client's REST calls.
          // That Data Cache entry is SEPARATE from the route's own Full Route
          // Cache, and admin saves only call revalidatePath() (which clears
          // the latter). Left untagged, a publish/edit/delete re-renders the
          // page (Full Route Cache MISS) but still serves pre-edit data from
          // the stale, untouched fetch cache — for up to `revalidate` seconds.
          //
          // Forcing `cache: 'no-store'` here is NOT the fix: these routes use
          // generateStaticParams() + ISR, and a no-store fetch during a
          // supposedly-static render throws "Page changed from static to
          // dynamic at runtime". Instead, tag each request by the table it
          // reads (parsed from the REST path) so content-api.ts / revalidate.ts
          // can purge exactly that table's cached reads on-demand via
          // revalidateTag(), while normal requests keep the segment's
          // time-based caching untouched.
          fetch: (input, init) => {
            const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
            const table = /\/rest\/v1\/([^/?]+)/.exec(url)?.[1]
            return fetch(input, table ? { ...init, next: { tags: [`supabase:${table}`] } } : init)
          },
        },
      }
    )
  }
  return publicClient
}
