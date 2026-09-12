import {
  Code,
  MapPin,
  ShoppingCart,
  Building2,
  Compass,
  FileText,
  Link2,
  PenTool,
  Search,
  BarChart3,
  TrendingUp,
  Cpu,
  ShoppingBag,
  Activity,
  Home,
  Briefcase,
  Zap,
  Globe,
  Layers,
  ShieldCheck,
  Target,
  Sparkles,
  Award,
  type LucideIcon,
} from 'lucide-react'

export interface ServiceIconOption { value: string; label: string; icon: LucideIcon }

export const SERVICE_ICONS: ServiceIconOption[] = [
  { value: 'code', label: 'Technical SEO', icon: Code },
  { value: 'map-pin', label: 'Local SEO', icon: MapPin },
  { value: 'shopping-cart', label: 'E-Commerce SEO', icon: ShoppingCart },
  { value: 'building-2', label: 'Enterprise SEO', icon: Building2 },
  { value: 'compass', label: 'SEO Strategy', icon: Compass },
  { value: 'file-text', label: 'On-Page SEO', icon: FileText },
  { value: 'link-2', label: 'Off-Page SEO & Links', icon: Link2 },
  { value: 'pen-tool', label: 'Content SEO', icon: PenTool },
  { value: 'search', label: 'Search & Keywords', icon: Search },
  { value: 'bar-chart', label: 'Analytics & Reporting', icon: BarChart3 },
  { value: 'trending-up', label: 'Growth & ROI', icon: TrendingUp },
  { value: 'cpu', label: 'SaaS & Tech', icon: Cpu },
  { value: 'shopping-bag', label: 'Retail & D2C', icon: ShoppingBag },
  { value: 'activity', label: 'Healthcare & Medical', icon: Activity },
  { value: 'home', label: 'Real Estate', icon: Home },
  { value: 'briefcase', label: 'Professional Services', icon: Briefcase },
  { value: 'zap', label: 'Speed & Performance', icon: Zap },
  { value: 'globe', label: 'International SEO', icon: Globe },
  { value: 'layers', label: 'Architecture', icon: Layers },
  { value: 'shield-check', label: 'Audit & Compliance', icon: ShieldCheck },
  { value: 'target', label: 'Intent Targeting', icon: Target },
  { value: 'sparkles', label: 'AI & Automation', icon: Sparkles },
  { value: 'award', label: 'Authority Building', icon: Award },
]

export const SERVICE_ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  SERVICE_ICONS.map(o => [o.value, o.icon])
)

export const DEFAULT_SERVICE_ICON = Search
