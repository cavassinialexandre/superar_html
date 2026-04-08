import { create } from 'zustand'

interface UIStore {
  sidebarCollapsed: boolean
  sidebarMobileOpen: boolean
  toggleSidebar: () => void
  setSidebarMobileOpen: (open: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),
}))
