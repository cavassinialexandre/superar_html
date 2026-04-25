import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

export interface DashboardVariantProps {
  unitLabel: string
}

export interface DashboardVariantMeta {
  id: string
  label: string
  tagline: string
  accent: string
  toneLabel: string
  Component: LazyExoticComponent<ComponentType<DashboardVariantProps>>
}

export const dashboardVariants: DashboardVariantMeta[] = [
  {
    id: 'v2-cinematic',
    label: 'Cinemático',
    tagline: 'Hero dark · podium glass',
    accent: '#1E7A73',
    toneLabel: 'HÍBRIDO',
    Component: lazy(() => import('./variants/v2-hero-dark-cinematic/cinematic-dashboard')),
  },
  {
    id: 'v4-bento',
    label: 'Bento',
    tagline: 'Tiles modulares · Apple-style',
    accent: '#5EA448',
    toneLabel: 'LIGHT',
    Component: lazy(() => import('./variants/v4-bento-modular/bento-dashboard')),
  },
  {
    id: 'v7-editorial-cinema',
    label: 'Editorial Cinema',
    tagline: 'Hero dark + reporte editorial cream',
    accent: '#155F59',
    toneLabel: 'HÍBRIDO',
    Component: lazy(() => import('./variants/v7-editorial-cinema/editorial-cinema-dashboard')),
  },
  {
    id: 'v8-editorial-cards',
    label: 'Editorial Cards',
    tagline: 'Hero dark + grid editorial em cards',
    accent: '#103734',
    toneLabel: 'HÍBRIDO',
    Component: lazy(() => import('./variants/v8-editorial-cards/editorial-cards-dashboard')),
  },
]

export const variantIds = dashboardVariants.map((v) => v.id)
