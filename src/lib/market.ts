// One codebase, three deployments — each domain serves a different market:
//
//   seoexpertagency.com  → global. SEO pages carry NO country or state.
//   seoexpertsagency.co.uk → United Kingdom. Country is fixed to UK; the State
//                          dropdown lists UK locations.
//   seoexpertagency.ae   → United Arab Emirates. Country fixed to UAE; the
//                          State dropdown lists the emirates.
//
// The market is a property of the DEPLOYMENT, not of the content — an admin on
// the .ae site should never be choosing between "United Arab Emirates" and
// "United Kingdom", and an admin on .com should not see a country field at all.
//
// Set NEXT_PUBLIC_MARKET explicitly in each Vercel project (AE | GB | XX).
//
// The fallback deliberately does NOT read `.com` as global. NEXT_PUBLIC_SITE_URL
// is `https://seoexpertagency.com` on the live AE deployment — a `.com` there
// means "nobody has updated this yet", not "this is the global site". Inferring
// XX from it would silently strip the Country and State fields off the very
// site that needs them. Only the two unambiguous TLDs are inferred; the global
// build must declare NEXT_PUBLIC_MARKET=XX, which is right for the one mode
// that removes fields rather than adding them.

export type MarketCode = 'AE' | 'GB' | 'XX'

export interface Market {
  code: MarketCode
  /** ISO-2 stamped on locations and shown in the SEO page's Country field. */
  countryCode: string
  countryName: string
  /** Global has no geography: SEO pages there have no country and no state. */
  hasGeo: boolean
}

const MARKETS: Record<MarketCode, Market> = {
  AE: { code: 'AE', countryCode: 'AE', countryName: 'United Arab Emirates', hasGeo: true },
  GB: { code: 'GB', countryCode: 'GB', countryName: 'United Kingdom', hasGeo: true },
  XX: { code: 'XX', countryCode: 'XX', countryName: 'Global / International', hasGeo: false },
}

// hreflang codes for each market's single language/region — used as the
// self-referencing hreflang tag every page emits by default (see resolveSEO
// in lib/seo.ts). XX (the .com global build) targets en-us per client spec.
const HREFLANG_CODES: Record<MarketCode, string> = {
  AE: 'en-ae',
  GB: 'en-GB',
  XX: 'en-us',
}

export function getHreflangCode(): string {
  return HREFLANG_CODES[getMarket().code]
}

function isMarketCode(value: string): value is MarketCode {
  return value === 'AE' || value === 'GB' || value === 'XX'
}

function resolveCode(): MarketCode {
  // Referenced as a literal so Next inlines it into the client bundle.
  const explicit = (process.env.NEXT_PUBLIC_MARKET ?? '').trim().toUpperCase()
  if (isMarketCode(explicit)) return explicit

  const host = (process.env.NEXT_PUBLIC_SITE_URL ?? '').trim().toLowerCase()
  if (/\.ae(?:[:/]|$)/.test(host)) return 'AE'
  if (/\.uk(?:[:/]|$)/.test(host)) return 'GB'
  return 'AE'
}

export function getMarket(): Market {
  return MARKETS[resolveCode()]
}
