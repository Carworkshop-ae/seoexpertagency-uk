import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase/server'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { Wrench, FileText, Briefcase, Inbox } from 'lucide-react'
import { getRecentActivity } from '@/lib/recent-activity'

export const metadata = { title: 'Dashboard' }

// Activity is always live — never serve a cached snapshot of who changed what.
export const dynamic = 'force-dynamic'

async function getStats() {
  const supabase = await createServerSupabase()

  const [
    { count: servicesPublished }, { count: postsPublished }, { count: projectsPublished },
    { count: leadsNew },
    activity,
  ] = await Promise.all([
    supabase.from('services').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('form_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    getRecentActivity(15),
  ])

  return { servicesPublished, postsPublished, projectsPublished, leadsNew, activity }
}

export default async function AdminDashboardPage() {
  const s = await getStats()

  const stats = [
    // No admin page anymore — services are edited inline on the homepage —
    // so this card is a plain stat, not a link.
    { label: 'Published Services', value: s.servicesPublished ?? 0, href: null, icon: Wrench, color: 'text-[#4472C4] bg-[#EEF3FB]' },
    { label: 'Published Posts', value: s.postsPublished ?? 0, href: '/admin/seo-blog', icon: FileText, color: 'text-green-600 bg-green-50' },
    { label: 'Published Case Studies', value: s.projectsPublished ?? 0, href: '/admin/projects', icon: Briefcase, color: 'text-[#E8601C] bg-orange-50' },
    { label: 'New Leads', value: s.leadsNew ?? 0, href: '/admin/leads?status=new', icon: Inbox, color: 'text-[#EF4444] bg-red-50' },
  ]

  return (
    <>
      <AdminTopbar title="Dashboard" />
      <div className="p-6 lg:p-8 space-y-6">
        {/* Brand card — ServiceMyCar-style centered logo panel */}
        <div className="flex">
          <div className="rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] shadow-sm px-10 py-8">
            <p className="text-3xl font-extrabold leading-tight whitespace-nowrap">
              <span className="text-[#4472C4]">SEO</span> <span className="text-[#1F2937]">Expert Agency</span>
            </p>
            <p className="text-[11px] tracking-wide text-[#6B7280] font-bold mt-1">
              DATA-DRIVEN SEARCH ENGINE OPTIMIZATION
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(c => {
            const Icon = c.icon
            const cardBody = (
              <>
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${c.color}`}><Icon size={18} /></span>
                <p className="text-3xl font-extrabold text-[#1F2937] mt-3">{c.value.toLocaleString('en-AE')}</p>
                <p className="text-xs text-[#6B7280] mt-0.5 font-medium">{c.label}</p>
              </>
            )
            return c.href ? (
              <Link key={c.label} href={c.href} className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-5 hover:shadow-md transition-all">
                {cardBody}
              </Link>
            ) : (
              <div key={c.label} className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-5">
                {cardBody}
              </div>
            )
          })}
        </div>

        <AdminCard title="Recent Activity" bodyClassName="!p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-white uppercase tracking-wider" style={{ backgroundColor: '#1F2937' }}>
                  <th className="px-5 py-3">Page</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Created By</th>
                  <th className="px-5 py-3">Edited By</th>
                  <th className="px-5 py-3">Date / Time</th>
                </tr>
              </thead>
              <tbody>
                {s.activity.map(a => (
                  <tr key={a.key} className="border-b border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]">
                    <td className="px-5 py-3 font-medium text-[#1F2937]">
                      {a.href
                        ? <Link href={a.href} className="hover:text-[#4472C4]">{a.title}</Link>
                        : <span className="text-[#9CA3AF]">{a.title}</span>}
                    </td>
                    <td className="px-5 py-3 text-[#6B7280] text-xs">{a.typeLabel}</td>
                    <td className="px-5 py-3 text-[#374151] text-xs">{a.createdBy}</td>
                    <td className="px-5 py-3 text-xs">
                      {a.editedBy
                        ? <span className="text-[#374151]">{a.editedBy}</span>
                        : <span className="text-[#9CA3AF]">—</span>}
                    </td>
                    <td className="px-5 py-3 text-[#6B7280] text-xs whitespace-nowrap">
                      {new Date(a.lastChangeAt).toLocaleString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: true,
                        timeZone: 'Asia/Dubai',
                      })}
                    </td>
                  </tr>
                ))}
                {!s.activity.length && (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-[#9CA3AF]">No activity yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </AdminCard>
      </div>
    </>
  )
}
