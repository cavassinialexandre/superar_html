import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UnitId } from '@/types'

interface UnitStore {
  selectedUnit: UnitId | null
  setUnit: (unit: UnitId) => void
  clearUnit: () => void
}

export const useUnitStore = create<UnitStore>()(
  persist(
    (set) => ({
      selectedUnit: null,
      setUnit: (unit) => set({ selectedUnit: unit }),
      clearUnit: () => set({ selectedUnit: null }),
    }),
    { name: 'kaizen-unit' }
  )
)
