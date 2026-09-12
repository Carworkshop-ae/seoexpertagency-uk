import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

function cleanEnv(val: string | undefined): string {
  return val ? val.replace(/^["']|["']$/g, '').trim() : ''
}

export function createServiceClient() {
  const serviceKey = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)
  const url = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) || 'http://127.0.0.1:54321'

  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  return createClient<Database>(
    url,
    serviceKey,
    { auth: { persistSession: false } }
  )
}
