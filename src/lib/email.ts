import { Resend } from 'resend'

const FROM = 'SEO Expert Agency <noreply@seoexpertsagency.co.uk>'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'hello@seoexpertsagency.co.uk'

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

// Lead fields are attacker-controlled: they arrive from a public, unauthenticated
// form and are interpolated into HTML that a staff member opens in their mail
// client. Escape every one of them.
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

interface LeadNotificationParams {
  name: string
  phone: string
  email?: string | null
  message?: string | null
  sourcePageSlug?: string | null
}

export async function sendLeadNotification(lead: LeadNotificationParams): Promise<void> {
  const resend = getResend()
  if (!resend) return

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New SEO Lead: ${lead.name.replace(/[\r\n]/g, ' ')} — ${lead.phone.replace(/[\r\n]/g, ' ')}`,
    html: `
      <h2>New SEO Consultation Inquiry</h2>
      <table>
        <tr><td><strong>Name</strong></td><td>${esc(lead.name)}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${esc(lead.phone)}</td></tr>
        ${lead.email ? `<tr><td><strong>Email</strong></td><td>${esc(lead.email)}</td></tr>` : ''}
        ${lead.message ? `<tr><td><strong>Details</strong></td><td>${esc(lead.message)}</td></tr>` : ''}
        ${lead.sourcePageSlug ? `<tr><td><strong>Source page</strong></td><td>${esc(lead.sourcePageSlug)}</td></tr>` : ''}
      </table>
    `,
  })
}

export async function sendLeadConfirmation(to: string, name: string): Promise<void> {
  const resend = getResend()
  if (!resend) return

  await resend.emails.send({
    from: FROM,
    to,
    subject: 'We received your SEO audit request — SEO Expert Agency',
    html: `
      <h2>Hi ${esc(name)},</h2>
      <p>Thank you for requesting a consultation with SEO Expert Agency. Our senior SEO directors will review your website and prepare your custom search opportunity audit within <strong>24 business hours</strong>.</p>
      <p>If you have any questions in the meantime, call us directly at <a href="tel:+9714800736">+971 4 800 736</a> or reply to this email.</p>
      <p>— The SEO Expert Agency Team</p>
    `,
  })
}
