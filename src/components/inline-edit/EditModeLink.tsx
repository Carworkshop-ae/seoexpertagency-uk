'use client'

import Link from 'next/link'
import { useAdminEdit } from './AdminEditProvider'

interface EditModeLinkProps {
  href: string
  className?: string
  children: React.ReactNode
}

// A normal link for visitors; in edit mode it renders as an inert <span> so the
// admin can click into the (EditableText) label to change it without the
// browser following the link. Where the link points is edited in
// Dashboard → Static Pages → Home.
export function EditModeLink({ href, className, children }: EditModeLinkProps) {
  const { isAdmin, editMode } = useAdminEdit()
  if (isAdmin && editMode) return <span className={className}>{children}</span>
  if (/^(tel:|mailto:|https?:)/.test(href)) return <a href={href} className={className}>{children}</a>
  return <Link href={href} className={className}>{children}</Link>
}
