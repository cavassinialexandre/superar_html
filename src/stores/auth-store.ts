import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile } from '@/types'

interface AuthStore {
  userName: string
  userId: string
  profiles: UserProfile[]
  isAuthenticated: boolean
  hasProfile: (profile: UserProfile) => boolean
  login: (name: string, profiles: UserProfile[]) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      userName: 'Carlos Silva',
      userId: 'user-1',
      profiles: ['admin', 'evaluator'],
      isAuthenticated: true,
      hasProfile: (profile) => get().profiles.includes(profile),
      login: (name, profiles) => set({ userName: name, profiles, isAuthenticated: true }),
      logout: () => set({ userName: '', profiles: [], isAuthenticated: false }),
    }),
    { name: 'kaizen-auth' }
  )
)
