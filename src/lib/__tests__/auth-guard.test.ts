import { describe, it, expect, vi, beforeEach } from 'vitest'

// These tests pin down the authorization invariant behind the "self-signup could
// reach the admin API" defect: a Supabase auth session is not staff membership.
// getActingUser() must resolve staff ONLY from a live row in public.users, and
// must fail closed on anything ambiguous.

const getUser = vi.fn()
const maybeSingle = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: vi.fn(async () => ({ auth: { getUser } })),
}))

vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: vi.fn(() => ({
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle }) }) }),
  })),
}))

const { getActingUser, LEAD_READ_ROLES, LEAD_DELETE_ROLES, SETTINGS_WRITE_ROLES } =
  await import('../auth-guard')

const signedInAs = (id: string) => getUser.mockResolvedValue({ data: { user: { id } } })
const usersRow = (row: unknown, error: unknown = null) => maybeSingle.mockResolvedValue({ data: row, error })

beforeEach(() => {
  getUser.mockReset()
  maybeSingle.mockReset()
})

describe('getActingUser', () => {
  it('returns null when there is no session at all', async () => {
    getUser.mockResolvedValue({ data: { user: null } })
    expect(await getActingUser()).toBeNull()
  })

  it('returns null for a session with no row in public.users', async () => {
    // This is the self-signup case: signUp() on the public anon key yields a
    // valid session, but the account is not staff and must not be treated as any
    // role. Previously this defaulted to 'content_writer'.
    signedInAs('outsider-1')
    usersRow(null)
    expect(await getActingUser()).toBeNull()
  })

  it('returns null for a deactivated account', async () => {
    signedInAs('ex-staff-1')
    usersRow({ role: 'admin', is_active: false })
    expect(await getActingUser()).toBeNull()
  })

  it('fails closed when the users lookup errors', async () => {
    signedInAs('staff-1')
    usersRow(null, { message: 'connection reset' })
    expect(await getActingUser()).toBeNull()
  })

  it('returns null when the row carries no role', async () => {
    signedInAs('staff-1')
    usersRow({ role: null, is_active: true })
    expect(await getActingUser()).toBeNull()
  })

  it('resolves an active staff member to their real role', async () => {
    signedInAs('staff-1')
    usersRow({ role: 'support_staff', is_active: true })
    expect(await getActingUser()).toEqual({ id: 'staff-1', role: 'support_staff' })
  })
})

describe('role allowlists', () => {
  it('excludes content_writer from lead PII, the role a stranger used to be granted', () => {
    expect(LEAD_READ_ROLES).not.toContain('content_writer')
    expect(LEAD_READ_ROLES).not.toContain('seo_editor')
    expect(LEAD_READ_ROLES).not.toContain('editor')
  })

  it('lets support staff read leads but never delete them', () => {
    expect(LEAD_READ_ROLES).toContain('support_staff')
    expect(LEAD_DELETE_ROLES).not.toContain('support_staff')
  })

  it('restricts settings writes to admins, since that table holds email credentials', () => {
    expect(SETTINGS_WRITE_ROLES).toEqual(['super_admin', 'admin'])
  })
})
