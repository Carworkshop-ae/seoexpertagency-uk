'use client'

import { MediaPicker } from '@/components/admin/MediaPicker'
import { FAQRepeater } from '@/components/admin/FAQRepeater'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { useStaticPage } from '@/components/admin/useStaticPage'
import { AdminInput, AdminLabel } from '@/components/admin/ui/AdminField'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminSectionCard } from '@/components/admin/ui/AdminSectionCard'
import { Repeater, inputCls } from '@/components/admin/ui/Repeater'
import { EditorChrome, StatusCard, SeoCard, InfoCard } from '@/components/admin/EditorChrome'
import { StaticSeoCard } from '@/components/admin/StaticSeoCard'
import { EditorSkeleton } from '@/components/admin/ui/EditorSkeleton'
import { mergeAboutContent, type AboutContent, type AboutPillar, type HomeUSP } from '@/lib/data/static-pages-schema'

// This editor covers everything the live /about page renders (hero,
// philosophy, pillars, why-choose-us, faq, cta-banner) plus a few
// dashboard-only sections (main_content, mission, stats) not yet wired into
// the public page — see mergeAboutContent's note on preserving those.
interface Stat { value: string; label: string }
interface AboutEditorContent extends Omit<AboutContent, 'hero'> {
  hero: AboutContent['hero'] & { image_url: string | null }
  main_content: string
  mission: { visible: boolean; heading: string; content: string; values: AboutPillar[] }
  stats: { visible: boolean; items: Stat[] }
}

const merge = (s: Partial<AboutEditorContent> | null): AboutEditorContent => {
  const base = mergeAboutContent(s)
  return {
    ...base,
    hero: { ...base.hero, image_url: s?.hero?.image_url ?? null },
    main_content: s?.main_content ?? '',
    mission: { visible: true, heading: 'Our Mission', content: '', values: [
      { icon: '🎯', title: 'Our Mission', description: 'To make organic search growth measurable, honest and repeatable.' },
      { icon: '💎', title: 'Our Vision', description: 'To be the SEO partner ambitious brands recommend by name.' },
      { icon: '🤝', title: 'Our Values', description: 'Transparency, technical rigour and long-term thinking.' },
    ], ...s?.mission },
    // Empty by default: publish a number here only once it is real and verifiable.
    stats: { visible: false, items: [], ...s?.stats },
  }
}

export default function AboutEditor() {
  const p = useStaticPage<AboutEditorContent>('about', 'About', merge)
  const c = p.content
  if (p.loading) return <EditorSkeleton />

  return (
    <EditorChrome
      breadcrumb={[{ label: 'Pages', href: '/admin/pages' }, { label: 'About' }]}
      title="About Page" saving={p.saving}
      onSaveDraft={() => void p.save('draft')} onPublish={() => void p.save('published')}
      sidebar={<>
        <StatusCard status={p.status} onChange={p.setStatus} viewHref="/about" savedLabel={p.savedLabel} />
        <SeoCard slug="about" title={p.seoTitle} description={p.seoDesc} onTitle={p.setSeoTitle} onDescription={p.setSeoDesc} />
        <InfoCard rows={[{ k: 'Type', v: 'Static — About' }, { k: 'URL', v: '/about', mono: true }]} />
      </>}
    >
      <div className="space-y-4">
        <AdminSectionCard title="Hero">
          <AdminInput label="H1 Heading" required maxCount={60} value={c.hero.h1} onChange={e => p.patch('hero', { h1: e.target.value })} />
          <AdminInput label="Subheadline" value={c.hero.subheadline} onChange={e => p.patch('hero', { subheadline: e.target.value })} />
          <MediaPicker label="Hero Image" value={c.hero.image_url} onChange={v => p.patch('hero', { image_url: v })} />
        </AdminSectionCard>

        <AdminSectionCard title="Philosophy">
          <AdminInput label="Heading" value={c.philosophy.heading} onChange={e => p.patch('philosophy', { heading: e.target.value })} />
          <div><AdminLabel>Intro Paragraph</AdminLabel><textarea value={c.philosophy.intro_paragraph} onChange={e => p.patch('philosophy', { intro_paragraph: e.target.value })} rows={3} className={inputCls} /></div>
          <AdminInput label="Technical Standard Heading" value={c.philosophy.tech_heading} onChange={e => p.patch('philosophy', { tech_heading: e.target.value })} />
          <div><AdminLabel>Technical Standard Paragraph</AdminLabel><textarea value={c.philosophy.tech_paragraph} onChange={e => p.patch('philosophy', { tech_paragraph: e.target.value })} rows={3} className={inputCls} /></div>
        </AdminSectionCard>

        <AdminSectionCard title="Core Pillars">
          <Repeater<AboutPillar> items={c.pillars} max={6} addLabel="+ Add Pillar" onChange={pillars => p.setContent(prev => ({ ...prev, pillars }))} blank={{ icon: '⭐', title: '', description: '' }}
            render={(it, upd) => (
              <div className="grid grid-cols-[3rem_1fr] gap-2 flex-1">
                <input value={it.icon} onChange={e => upd({ icon: e.target.value })} className={inputCls} />
                <div className="space-y-2">
                  <input value={it.title} onChange={e => upd({ title: e.target.value })} className={inputCls} placeholder="Title" />
                  <input value={it.description} onChange={e => upd({ description: e.target.value })} className={inputCls} placeholder="Description" />
                </div>
              </div>
            )} />
        </AdminSectionCard>

        <AdminSectionCard title="Main Content" description="Dashboard-only for now — not yet rendered on the public page.">
          <RichTextEditor value={c.main_content} onChange={v => p.setContent(prev => ({ ...prev, main_content: v }))} placeholder="Tell your story…" />
        </AdminSectionCard>

        <AdminSectionCard title="Mission & Values" description="Dashboard-only for now — not yet rendered on the public page." visible={c.mission.visible} onVisibleChange={v => p.patch('mission', { visible: v })}>
          <AdminInput label="Section Heading" value={c.mission.heading} onChange={e => p.patch('mission', { heading: e.target.value })} />
          <div><AdminLabel>Mission Content</AdminLabel><RichTextEditor value={c.mission.content} onChange={v => p.patch('mission', { content: v })} placeholder="Our mission…" minHeight={140} /></div>
          <Repeater<AboutPillar> items={c.mission.values} max={6} addLabel="+ Add Value" onChange={values => p.patch('mission', { values })} blank={{ icon: '🎯', title: '', description: '' }}
            render={(it, upd) => (
              <div className="grid grid-cols-[3rem_1fr] gap-2 flex-1">
                <input value={it.icon} onChange={e => upd({ icon: e.target.value })} className={inputCls} />
                <div className="space-y-2">
                  <input value={it.title} onChange={e => upd({ title: e.target.value })} className={inputCls} placeholder="Title" />
                  <input value={it.description} onChange={e => upd({ description: e.target.value })} className={inputCls} placeholder="Description" />
                </div>
              </div>
            )} />
        </AdminSectionCard>

        <AdminSectionCard title="Stats / Achievements" description="Dashboard-only for now — not yet rendered on the public page." visible={c.stats.visible} onVisibleChange={v => p.patch('stats', { visible: v })}>
          <Repeater<Stat> items={c.stats.items} max={8} addLabel="+ Add Stat" onChange={items => p.patch('stats', { items })} blank={{ value: '', label: '' }}
            render={(it, upd) => (
              <div className="grid grid-cols-2 gap-2 flex-1">
                <input value={it.value} onChange={e => upd({ value: e.target.value })} className={inputCls} placeholder="10,000+" />
                <input value={it.label} onChange={e => upd({ label: e.target.value })} className={inputCls} placeholder="Clients Served" />
              </div>
            )} />
        </AdminSectionCard>

        <AdminSectionCard title="Why Choose Us" visible={c.why_choose_us.visible} onVisibleChange={v => p.patch('why_choose_us', { visible: v })}>
          <AdminInput label="Section Heading" value={c.why_choose_us.heading} onChange={e => p.patch('why_choose_us', { heading: e.target.value })} />
          <Repeater<HomeUSP> items={c.why_choose_us.items} max={6} addLabel="+ Add Reason" onChange={items => p.patch('why_choose_us', { items })} blank={{ icon: '✅', title: '', description: '' }}
            render={(it, upd) => (
              <div className="grid grid-cols-[3rem_1fr] gap-2 flex-1">
                <input value={it.icon} onChange={e => upd({ icon: e.target.value })} className={inputCls} />
                <div className="space-y-2">
                  <input value={it.title} onChange={e => upd({ title: e.target.value })} className={inputCls} placeholder="Reason title" />
                  <input value={it.description} onChange={e => upd({ description: e.target.value })} className={inputCls} placeholder="Reason description" />
                </div>
              </div>
            )} />
        </AdminSectionCard>

        <AdminSectionCard title="FAQ" visible={c.faq.visible} onVisibleChange={v => p.patch('faq', { visible: v })}>
          <AdminInput label="Section Heading" value={c.faq.heading} onChange={e => p.patch('faq', { heading: e.target.value })} />
          <FAQRepeater items={c.faq.faqs.map(f => ({ question: f.q, answer: f.a }))} onChange={v => p.patch('faq', { faqs: v.map(i => ({ q: i.question, a: i.answer })) })} />
        </AdminSectionCard>

        <AdminSectionCard title="CTA Banner" visible={c.cta_banner.visible} onVisibleChange={v => p.patch('cta_banner', { visible: v })}>
          <AdminInput label="Headline" value={c.cta_banner.headline} onChange={e => p.patch('cta_banner', { headline: e.target.value })} />
          <AdminInput label="Subheadline" value={c.cta_banner.subheadline} onChange={e => p.patch('cta_banner', { subheadline: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <AdminInput label="Button Text" value={c.cta_banner.button_text} onChange={e => p.patch('cta_banner', { button_text: e.target.value })} />
            <AdminInput label="Button Link" value={c.cta_banner.button_link} onChange={e => p.patch('cta_banner', { button_link: e.target.value })} />
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="SEO (Advanced)" defaultOpen={false}>
          <StaticSeoCard seoJson={p.seoJson} setSeoJson={p.setSeoJson} saveSeo={() => void p.saveSeo()} saving={p.saving}
            pageUrl="https://seoexpertsagency.co.uk/about" defaultTitle={c.hero.h1} defaultDescription={c.hero.subheadline} autoSchemas={['Organization', 'FAQPage (from FAQs)']}
            subTitle={p.subTitle} setSubTitle={p.setSubTitle} metaKeyword={p.metaKeyword} setMetaKeyword={p.setMetaKeyword}
            h3Text={p.h3Text} setH3Text={p.setH3Text} shortDescription={p.shortDescription} setShortDescription={p.setShortDescription} />
        </AdminSectionCard>

        <div className="flex justify-end gap-2 pt-2">
          <AdminButton variant="outline" loading={p.saving} onClick={() => void p.save('draft')}>Save Draft</AdminButton>
          <AdminButton variant="orange" loading={p.saving} onClick={() => void p.save('published')}>Publish</AdminButton>
        </div>
      </div>
    </EditorChrome>
  )
}
