// Country options for admin modules that scope content by market (FAQs today).
//
// Replaces the previous `geo.ts`, whose STATES_BY_COUNTRY emirate list existed
// only for the retired /[state]/* routes. Add a row here as the business opens
// a market — the backing columns are TEXT, so no schema change is needed.

export interface CountryOption {
  code: string
  name: string
  flag: string
}

export const COUNTRIES: CountryOption[] = [
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'XX', name: 'Global / International', flag: '🌍' },
]

export function countryName(code: string): string {
  return COUNTRIES.find(c => c.code === code)?.name ?? code
}

export function countryFlag(code: string): string {
  return COUNTRIES.find(c => c.code === code)?.flag ?? '🏳️'
}
