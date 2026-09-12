import { Footer } from '@/components/layout/Footer'
import { getSettings } from '@/lib/hooks/useSettings'

// Every public route lives under this group and shares the same Footer. The
// group exists because the retired brand catch-all needed a different footer;
// it is kept because per-route footer variation is still plausible, and the
// nesting costs nothing.
export default async function DefaultFooterLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <>
      {children}
      <Footer settings={settings} />
    </>
  )
}
