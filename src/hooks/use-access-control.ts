import { useState, useCallback } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import type { UserProfile } from '@/types'

export function useAccessControl() {
  const { profiles } = useAuthStore()
  const [deniedMessage, setDeniedMessage] = useState<string | null>(null)

  const checkAccess = useCallback((requiredProfile: UserProfile): boolean => {
    if (profiles.includes(requiredProfile)) return true
    setDeniedMessage('Acesso negado. Você não tem o perfil necessário para acessar essa funcionalidade.')
    setTimeout(() => setDeniedMessage(null), 4000)
    return false
  }, [profiles])

  const hasProfile = useCallback((profile: UserProfile): boolean => {
    return profiles.includes(profile)
  }, [profiles])

  const dismissDenied = useCallback(() => setDeniedMessage(null), [])

  return { checkAccess, hasProfile, deniedMessage, dismissDenied }
}
