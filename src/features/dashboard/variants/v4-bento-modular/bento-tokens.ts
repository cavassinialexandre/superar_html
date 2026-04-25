export const bento = {
  surface: {
    canvas: '#F0F2F2',
    tile: '#FFFFFF',
    tileBorder: 'rgba(228, 232, 232, 0.55)',
    tileShadow: '0 1px 2px rgba(16, 55, 52, 0.04), 0 8px 22px -10px rgba(16, 55, 52, 0.08)',
    tileShadowHover: '0 8px 18px -4px rgba(16, 55, 52, 0.12), 0 24px 42px -16px rgba(16, 55, 52, 0.18)',
    text: '#0E1413',
    textSoft: '#3E4847',
    textMuted: '#7A8584',
    textSubtle: '#A3ADAC',
    rule: '#EAECEC',
  },
  category: {
    hero: { tint: '#103734', soft: '#E8F5F4', icon: '#103734' },
    kpi: { tint: '#1E7A73', soft: '#E8F5F4', icon: '#1E7A73' },
    podium: { tint: '#DDDD03', soft: '#FEFDE8', icon: '#867F06' },
    chart: { tint: '#3AA39C', soft: '#E8F5F4', icon: '#3AA39C' },
    activity: { tint: '#5EA448', soft: '#ECFDF1', icon: '#5EA448' },
    risk: { tint: '#CE3C5A', soft: '#FEF1F3', icon: '#CE3C5A' },
  },
  font: {
    display: '"Plus Jakarta Sans", system-ui, sans-serif',
    mono: '"JetBrains Mono", "SF Mono", Menlo, monospace',
  },
  radius: {
    tile: '24px',
    inner: '14px',
    chip: '999px',
  },
  motion: {
    tileHover: { duration: 0.32, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    tileEntrance: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
} as const

export const bentoTileBase = {
  background: bento.surface.tile,
  border: `1px solid ${bento.surface.tileBorder}`,
  borderRadius: bento.radius.tile,
  boxShadow: bento.surface.tileShadow,
}
