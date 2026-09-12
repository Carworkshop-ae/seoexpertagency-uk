import { Cpu, ShoppingBag, Activity, Home, TrendingUp, Briefcase, type LucideIcon } from 'lucide-react'

export interface IndustryIconOption { value: string; label: string; icon: LucideIcon }

export const INDUSTRY_ICONS: IndustryIconOption[] = [
  { value: 'cpu', label: 'SaaS & Tech', icon: Cpu },
  { value: 'shopping-bag', label: 'E-Commerce & Retail', icon: ShoppingBag },
  { value: 'activity', label: 'Healthcare & Medical', icon: Activity },
  { value: 'home', label: 'Real Estate & Property', icon: Home },
  { value: 'trending-up', label: 'Finance & FinTech', icon: TrendingUp },
  { value: 'briefcase', label: 'Professional Services', icon: Briefcase },
]

export const INDUSTRY_ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  INDUSTRY_ICONS.map(o => [o.value, o.icon])
)

export const DEFAULT_INDUSTRY_ICON = TrendingUp
