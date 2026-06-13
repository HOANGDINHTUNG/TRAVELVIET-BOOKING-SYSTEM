import type { LucideIcon } from 'lucide-react'
import {
  CircleCheck,
  CircleX,
  FileText,
  Info,
  Shield,
  Sparkles,
} from 'lucide-react'

export type ProductTabKey =
  | 'description'
  | 'highlights'
  | 'inclusions'
  | 'exclusions'
  | 'notes'
  | 'policy'

export type ProductTabMeta = {
  icon: LucideIcon
  iconWrap: string
  tabActive: string
  tabIdle: string
  panelGradient: string
  accentText: string
}

export const PRODUCT_TAB_META: Record<ProductTabKey, ProductTabMeta> = {
  description: {
    icon: FileText,
    iconWrap: 'bg-sky-500 text-white shadow-sky-500/35',
    tabActive: 'border-sky-300 bg-sky-600 text-white shadow-md shadow-sky-600/25',
    tabIdle:
      'border-sky-100 bg-sky-50/90 text-sky-900 hover:border-sky-300 hover:bg-sky-100',
    panelGradient: 'from-sky-50/90 via-white to-cyan-50/40',
    accentText: 'text-sky-800',
  },
  highlights: {
    icon: Sparkles,
    iconWrap: 'bg-amber-500 text-white shadow-amber-500/35',
    tabActive:
      'border-amber-300 bg-amber-500 text-white shadow-md shadow-amber-500/25',
    tabIdle:
      'border-amber-100 bg-amber-50/90 text-amber-950 hover:border-amber-300 hover:bg-amber-100',
    panelGradient: 'from-amber-50/90 via-white to-accent/10/35',
    accentText: 'text-amber-900',
  },
  inclusions: {
    icon: CircleCheck,
    iconWrap: 'bg-emerald-500 text-white shadow-emerald-500/35',
    tabActive:
      'border-emerald-300 bg-emerald-600 text-white shadow-md shadow-emerald-600/25',
    tabIdle:
      'border-emerald-100 bg-emerald-50/90 text-emerald-900 hover:border-emerald-300 hover:bg-emerald-100',
    panelGradient: 'from-emerald-50/85 via-white to-teal-50/35',
    accentText: 'text-emerald-900',
  },
  exclusions: {
    icon: CircleX,
    iconWrap: 'bg-rose-500 text-white shadow-rose-500/35',
    tabActive:
      'border-rose-300 bg-rose-500 text-white shadow-md shadow-rose-500/25',
    tabIdle:
      'border-rose-100 bg-rose-50/90 text-rose-900 hover:border-rose-300 hover:bg-rose-100',
    panelGradient: 'from-rose-50/80 via-white to-red-50/30',
    accentText: 'text-rose-900',
  },
  notes: {
    icon: Info,
    iconWrap: 'bg-violet-500 text-white shadow-violet-500/35',
    tabActive:
      'border-violet-300 bg-violet-600 text-white shadow-md shadow-violet-600/25',
    tabIdle:
      'border-violet-100 bg-violet-50/90 text-violet-900 hover:border-violet-300 hover:bg-violet-100',
    panelGradient: 'from-violet-50/85 via-white to-indigo-50/30',
    accentText: 'text-violet-900',
  },
  policy: {
    icon: Shield,
    iconWrap: 'bg-slate-600 text-white shadow-slate-600/35',
    tabActive:
      'border-slate-400 bg-slate-700 text-white shadow-md shadow-slate-700/25',
    tabIdle:
      'border-slate-200 bg-slate-50/95 text-slate-800 hover:border-slate-400 hover:bg-slate-100',
    panelGradient: 'from-slate-50/90 via-white to-slate-100/50',
    accentText: 'text-slate-800',
  },
}
