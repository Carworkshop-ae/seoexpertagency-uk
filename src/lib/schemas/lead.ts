import { z } from 'zod'

export const CreateLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  phone: z.string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, 'Invalid phone number')
    .trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim().optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
  website_url: z.string().max(500).trim().optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
  service_name: z.string().max(100).trim().optional(),
  service_id: z.string().uuid().optional(),
  location_id: z.string().uuid().optional(),
  message: z.string().max(2000).trim().optional(),
  // Accepted by the schema on purpose: the route inspects it and returns a
  // fake success so a bot cannot tell it was caught. Rejecting here with a
  // validation error would both leak the trap and skip that branch.
  honeypot: z.string().max(200).default(''),
  source_page_slug: z.string().max(500).optional(),
})

export const UpdateLeadStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'in_progress', 'converted', 'closed']),
  notes: z.string().max(2000).optional(),
})

export type CreateLeadInput = z.infer<typeof CreateLeadSchema>
export type UpdateLeadStatusInput = z.infer<typeof UpdateLeadStatusSchema>

