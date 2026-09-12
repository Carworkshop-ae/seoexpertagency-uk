'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

function cleanEnv(val: string | undefined): string {
  return val ? val.replace(/^["']|["']$/g, '').trim() : ''
}

export function createClientSupabase() {
  const url = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) || 'http://127.0.0.1:54321'
  const anonKey = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || ''

  return createBrowserClient<Database>(url, anonKey)
}
