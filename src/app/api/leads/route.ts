import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { leadFormLimiter } from '@/lib/rate-limit'
import { sanitizeHTML } from '@/lib/sanitize'
import { sendLeadNotification, sendLeadConfirmation } from '@/lib/email'
import { CreateLeadSchema } from '@/lib/schemas/lead'
import type { InsertFormSubmission } from '@/types'

function checkOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true

  const siteOrigin = (() => {
    try {
      const url = process.env.NEXT_PUBLIC_SITE_URL?.replace(/^["']|["']$/g, '')
      return url && url.startsWith('http') ? new URL(url).origin : null
    } catch {
      return null
    }
  })()

  const allowed = new Set([
    'https://seoexpertsagency.co.uk',
    'https://www.seoexpertsagency.co.uk',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    ...(siteOrigin ? [siteOrigin] : []),
  ])
  return allowed.has(origin)
}

export async function POST(req: NextRequest) {
  try {
    if (!checkOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'

    if (leadFormLimiter) {
      const { success, limit, remaining, reset } = await leadFormLimiter.limit(ip)
      if (!success) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            },
          }
        )
      }
    }

    const body: unknown = await req.json()
    const parsed = CreateLeadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    if (parsed.data.honeypot) {
      return NextResponse.json({ success: true }, { status: 201 })
    }

    const { name, phone, email, website_url, service_name, service_id, location_id, message, source_page_slug } = parsed.data

    const sanitizedMessage = message ? sanitizeHTML(message) : null

    // Human-readable digest for the lead inbox and the notification email.
    // The underlying values are also stored in their own columns below, so this
    // stays a convenience view rather than the only copy of the data.
    const leadDetails = [
      website_url ? `Website: ${website_url}` : null,
      service_name ? `Service: ${service_name}` : null,
      sanitizedMessage ? `Requirement: ${sanitizedMessage}` : null,
    ].filter(Boolean).join(' | ')

    const supabase = createServiceClient()

    const submission: InsertFormSubmission = {
      name,
      phone,
      email: email ?? null,
      website_url: website_url ?? null,
      service_name: service_name ?? null,
      service_id: service_id ?? null,
      location_id: location_id ?? null,
      message: sanitizedMessage,
      source_url: req.headers.get('referer') ?? '/',
      source_page_slug: source_page_slug ?? null,
      ip_address: ip,
      user_agent: req.headers.get('user-agent') ?? null,
      status: 'new',
      notes: leadDetails || null,
    }

    const { error } = await supabase.from('form_submissions').insert(submission)

    if (error) {
      console.error('Lead insert error:', error)
      return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 })
    }

    // Awaited, not fire-and-forget: on a serverless runtime the function can be
    // frozen the moment the response is returned, silently dropping the
    // notification. The lead row is already committed, so a mail failure is
    // logged and swallowed rather than failing the submission.
    await Promise.allSettled([
      sendLeadNotification({
        name,
        phone,
        email,
        message: leadDetails || sanitizedMessage || 'New SEO consultation inquiry',
        sourcePageSlug: source_page_slug,
      }),
      email ? sendLeadConfirmation(email, name) : Promise.resolve(),
    ]).then(results => {
      for (const r of results) {
        if (r.status === 'rejected') console.error('Lead email failed:', r.reason)
      }
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('Lead route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
