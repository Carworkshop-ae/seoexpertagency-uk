import { createServerSupabase } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import type { UserRole } from '@/types'

export interface ActingUser { id: string; role: UserRole }

// Roles permitted to read customer lead PII (name, phone, email, IP, user agent).
// Mirrors the `admin_read_leads` RLS policy in 001_baseline.sql — the admin lead
// routes query with the service-role client, which bypasses RLS, so the policy
// alone does not protect them and this list is what actually enforces it.
export const LEAD_READ_ROLES: UserRole[] = ['super_admin', 'admin', 'support_staff']

// Destroying a lead is narrower than reading one — mirrors `admin_delete_leads`.
export const LEAD_DELETE_ROLES: UserRole[] = ['super_admin', 'admin']

// website_settings holds resend_api_key and smtp_password, plus site-wide values
// (GTM/GA ids, nav, announcement bar link) that render into every public page.
// Both reading and writing it are admin-only, matching `admin_all_settings`.
export const SETTINGS_READ_ROLES: UserRole[] = ['super_admin', 'admin']
export const SETTINGS_WRITE_ROLES: UserRole[] = ['super_admin', 'admin']

// Resolve the authenticated admin user and their role (from the users table).
//
// A Supabase auth session is NOT by itself authorization. Staff membership is
// defined solely by a row in public.users, so a session with no matching row —
// or one whose account has been deactivated — resolves to null and is treated
// exactly like an anonymous caller.
//
// This previously defaulted a missing row to 'content_writer', which meant anyone
// who could obtain a session (signUp is public on the anon key) was handed a
// working staff role across every route that only checked for a session.
export async function getActingUser(): Promise<ActingUser | null> {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const service = createServiceClient()
  const { data, error } = await service
    .from('users')
    .select('role, is_active')
    .eq('id', user.id)
    .maybeSingle()

  // Fail closed: a lookup error must never be read as "no restrictions".
  if (error || !data) return null
  if (data.is_active === false) return null
  if (!data.role) return null

  return { id: user.id, role: data.role as UserRole }
}
