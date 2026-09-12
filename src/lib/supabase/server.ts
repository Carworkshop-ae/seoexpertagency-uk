// ADMIN ONLY — uses cookies(), which forces dynamic rendering. Never import
// this from a public (public) page; use createPublicSupabase() there instead.
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

function cleanEnv(val: string | undefined): string {
  return val ? val.replace(/^["']|["']$/g, '').trim() : ''
}

export async function createServerSupabase() {
  const cookieStore = await cookies()
  const url = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) || 'http://127.0.0.1:54321'
  const anonKey = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || ''

  return createServerClient<Database>(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component — cookies can't be set, ignored
          }
        },
      },
    }
  )
}
