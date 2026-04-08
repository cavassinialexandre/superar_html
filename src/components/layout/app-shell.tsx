import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from './sidebar'
import { useUIStore } from '@/stores/ui-store'
import { MenuIcon } from '@/assets/icons'
import { cn } from '@/lib/cn'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { sidebarCollapsed, setSidebarMobileOpen } = useUIStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <motion.div
        className="min-h-screen flex flex-col"
        animate={{
          marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024
            ? sidebarCollapsed ? 72 : 264
            : 0,
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          onClick={() => setSidebarMobileOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <MenuIcon size={20} />
        </button>
        <main className="flex-1 p-6 pt-16 lg:p-8">
          {children}
        </main>
      </motion.div>
    </div>
  )
}

interface PageContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

const maxWidthMap = {
  md: 'max-w-3xl',
  lg: 'max-w-5xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-[1440px]',
  full: 'max-w-full',
}

export function PageContainer({ children, className, maxWidth = '2xl' }: PageContainerProps) {
  return (
    <div className={cn('mx-auto w-full', maxWidthMap[maxWidth], className)}>
      {children}
    </div>
  )
}
