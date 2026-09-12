import { z } from 'zod'
import { getActingUser, type ActingUser } from '@/lib/auth-guard'
import type { ApprovalStatus, UserRole } from '@/types'

// Roles that may approve/reject content and assign SEO users to pages.
export const APPROVER_ROLES: UserRole[] = ['super_admin', 'admin', 'editor']

// Deleting generated pages is destructive and irreversible, so it is reserved
// for super_admin alone — narrower than APPROVER_ROLES on purpose.
export function canDeletePages(role: UserRole): boolean {
  return role === 'super_admin'
}

// Roles whose saves land in the approval queue instead of going live-approved.
export const SUBMITTER_ROLES: UserRole[] = ['seo_editor', 'content_writer']

export function canApprove(role: UserRole): boolean {
  return APPROVER_ROLES.includes(role)
}

// Approvers' saves are auto-approved; submitters' saves go to pending review.
export function nextStatusOnSave(role: UserRole): ApprovalStatus {
  return canApprove(role) ? 'approved' : 'pending'
}

// Submitters can never move a row's live-visibility status — their writes to
// `status` are dropped, new rows always start `draft`. Approvers pass through.
type ContentStatus = 'draft' | 'published' | 'archived'
export function statusForRoleOnSave(role: UserRole, requestedStatus: ContentStatus | undefined, currentStatus?: ContentStatus): ContentStatus | undefined {
  if (canApprove(role)) return requestedStatus ?? currentStatus
  return currentStatus ?? 'draft'
}

// Homepage ranking is an approver-only decision, same reasoning as status:
// submitters' writes to `priority` are dropped, existing value is kept as-is.
export function priorityForRoleOnSave(role: UserRole, requestedPriority: number | null | undefined, currentPriority?: number | null): number | null | undefined {
  if (canApprove(role)) return requestedPriority ?? currentPriority
  return currentPriority ?? null
}

export const APPROVAL_ACTIONS = ['approve', 'reject', 'resubmission_required'] as const
export type ApprovalAction = (typeof APPROVAL_ACTIONS)[number]

export function statusForAction(action: ApprovalAction): ApprovalStatus {
  return action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'resubmission_required'
}

// Returns the acting user when they may delete pages (super_admin), else null.
export async function assertPageDeleter(): Promise<ActingUser | null> {
  const acting = await getActingUser()
  if (!acting || !canDeletePages(acting.role)) return null
  return acting
}

// Returns the acting user when they hold an approver role, else null.
// Route handlers: `const approver = await assertApprover(); if (!approver) return 403`.
export async function assertApprover(): Promise<ActingUser | null> {
  const acting = await getActingUser()
  if (!acting || !canApprove(acting.role)) return null
  return acting
}

// Payload for the approve/reject endpoints.
export const ApproveSchema = z.object({
  action: z.enum(['approve', 'reject', 'resubmission_required']),
})
