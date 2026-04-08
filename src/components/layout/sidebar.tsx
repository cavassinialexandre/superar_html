import { useLocation, useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useUIStore } from '@/stores/ui-store'
import { useUnitStore } from '@/stores/unit-store'
import { useAuthStore } from '@/stores/auth-store'
import {
  DashboardIcon, GroupsIcon, HistoryIcon,
  SettingsIcon, ChevronLeftIcon, FactoryIcon, XIcon,
  UserIcon, AuditIcon, MenuIcon, RepeatIcon,
} from '@/assets/icons'
import { groupTypes } from '@/mocks/data'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { path: '/history', label: 'Histórico', icon: HistoryIcon },
]

const adminSubItems = [
  { tab: 'users', label: 'Usuários', icon: UserIcon },
  { tab: 'management-areas', label: 'Gerências e Áreas', icon: FactoryIcon },
  { tab: 'group-types', label: 'Tipos de Grupo', icon: GroupsIcon },
  { tab: 'checklists', label: 'Checklists', icon: AuditIcon },
  { tab: 'groups', label: 'Grupos', icon: GroupsIcon },
]

const unitNames = {
  puma: 'Puma',
  'monte-alegre': 'Monte Alegre',
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, sidebarMobileOpen, setSidebarMobileOpen } = useUIStore()
  const { selectedUnit, clearUnit } = useUnitStore()
  const { userName } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const isActive = (path: string) => location.pathname.startsWith(path)

  const handleNav = (path: string) => {
    navigate({ to: path })
    setSidebarMobileOpen(false)
  }

  const handleAdminNav = (tab: string) => {
    navigate({ to: '/admin', search: { tab } })
    setSidebarMobileOpen(false)
  }

  const handleSwitchUnit = () => {
    clearUnit()
    navigate({ to: '/' })
    setSidebarMobileOpen(false)
  }

  const currentAdminTab = location.pathname.startsWith('/admin')
    ? new URLSearchParams(location.search).get('tab') || 'users'
    : null

  const currentGroupType = location.pathname === '/groups'
    ? new URLSearchParams(location.search).get('type')
    : null

  const activeGroupTypes = groupTypes.filter(t => t.status === 'active')

  const isGeralActive = location.pathname === '/groups' && !currentGroupType

  const handleGeralNav = () => {
    navigate({ to: '/groups' })
    setSidebarMobileOpen(false)
  }

  const handleGroupTypeNav = (typeId: string) => {
    navigate({ to: '/groups', search: { type: typeId } })
    setSidebarMobileOpen(false)
  }

  const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2)

  const sidebarContent = (
    <div className="flex flex-col h-full relative">
      {/* Decorative ambient glow */}
      <div className="absolute -top-24 -right-12 w-48 h-48 rounded-full bg-emerald-500/6 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -left-16 w-32 h-32 rounded-full bg-emerald-400/4 blur-3xl pointer-events-none" />

      {/* Header — Logo only */}
      <div className={cn('flex items-center gap-3.5 px-5 pt-7 pb-8', sidebarCollapsed && 'px-4 justify-center pb-6')}>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white/12 to-white/6 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-[0_0_24px_rgba(0,166,80,0.1)]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#DDDD03" opacity="0.9" />
            <path d="M2 17l10 5 10-5" stroke="#00A650" strokeWidth="1.5" />
            <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <h1 className="font-heading text-[15px] font-bold text-white whitespace-nowrap tracking-tight">
                Superar Digital
              </h1>
              <p className="text-[10px] text-white/50 font-semibold tracking-[0.15em] whitespace-nowrap mt-0.5">
                KAIZEN/TPM 4.0
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section label: MENU */}
      {!sidebarCollapsed && (
        <div className="px-5 mb-3">
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/50 font-semibold">
            Menu
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNav(item.path)}
            className={cn(
              'relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer group',
              sidebarCollapsed && 'justify-center px-2',
              isActive(item.path)
                ? 'bg-[rgba(255,255,255,0.06)] font-medium'
                : 'text-white/60 hover:text-white hover:bg-[rgba(255,255,255,0.03)] font-medium',
            )}
          >
            {isActive(item.path) && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-[#d4af37] to-[#b8860b]"
              />
            )}
            <span className={cn(
              'flex items-center justify-center w-8 h-8 rounded-lg transition-all flex-shrink-0',
              isActive(item.path)
                ? 'bg-gradient-to-br from-[rgba(212,175,55,0.2)] to-[rgba(184,134,11,0.1)] text-[#d4af37]'
                : 'text-white/50 group-hover:text-white/70',
            )}>
              <item.icon size={20} />
            </span>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className={cn(
                    'whitespace-nowrap overflow-hidden',
                    isActive(item.path) && 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] bg-clip-text text-transparent',
                  )}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}

        {/* Section label: GRUPOS */}
        {!sidebarCollapsed && (
          <div className="pt-5 pb-1 px-2">
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/50 font-semibold">
              Grupos
            </p>
          </div>
        )}

        {/* Collapsed groups divider */}
        {sidebarCollapsed && (
          <div className="py-2 px-2">
            <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </div>
        )}

        {/* Geral collapsed icon */}
        {sidebarCollapsed && (
          <button
            onClick={handleGeralNav}
            className={cn(
              'relative w-full flex items-center justify-center px-2 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer group',
              isGeralActive
                ? 'bg-[rgba(255,255,255,0.06)] text-white font-medium'
                : 'text-white/60 hover:text-white hover:bg-[rgba(255,255,255,0.03)] font-medium',
            )}
          >
            {isGeralActive && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-[#d4af37] to-[#b8860b]"
              />
            )}
            <span className={cn(
              'flex items-center justify-center w-8 h-8 rounded-lg transition-all',
              isGeralActive
                ? 'bg-gradient-to-br from-[rgba(212,175,55,0.2)] to-[rgba(184,134,11,0.1)] text-[#d4af37]'
                : 'text-white/50 group-hover:text-white/70',
            )}>
              <DashboardIcon size={20} />
            </span>
          </button>
        )}

        {/* Group type collapsed icons */}
        {sidebarCollapsed && activeGroupTypes.map((gt) => (
          <button
            key={gt.id}
            onClick={() => handleGroupTypeNav(gt.id)}
            className={cn(
              'relative w-full flex items-center justify-center px-2 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer group',
              currentGroupType === gt.id
                ? 'bg-[rgba(255,255,255,0.06)] text-white font-medium'
                : 'text-white/60 hover:text-white hover:bg-[rgba(255,255,255,0.03)] font-medium',
            )}
          >
            {currentGroupType === gt.id && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-[#d4af37] to-[#b8860b]"
              />
            )}
            <span className={cn(
              'flex items-center justify-center w-8 h-8 rounded-lg transition-all',
              currentGroupType === gt.id
                ? 'bg-gradient-to-br from-[rgba(212,175,55,0.2)] to-[rgba(184,134,11,0.1)] text-[#d4af37]'
                : 'text-white/50 group-hover:text-white/70',
            )}>
              <GroupsIcon size={20} />
            </span>
          </button>
        ))}

        {/* Group type sub-items */}
        {!sidebarCollapsed && (
          <div className="space-y-1 py-1">
            {/* Geral item */}
            <button
              onClick={handleGeralNav}
              className={cn(
                'relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer group',
                isGeralActive
                  ? 'bg-[rgba(255,255,255,0.06)] font-medium'
                  : 'text-white/60 hover:text-white hover:bg-[rgba(255,255,255,0.03)] font-medium',
              )}
            >
              {isGeralActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-[#d4af37] to-[#b8860b]"
                />
              )}
              <span className={cn(
                'flex items-center justify-center w-8 h-8 rounded-lg transition-all flex-shrink-0',
                isGeralActive
                  ? 'bg-gradient-to-br from-[rgba(212,175,55,0.2)] to-[rgba(184,134,11,0.1)] text-[#d4af37]'
                  : 'text-white/50 group-hover:text-white/70',
              )}>
                <DashboardIcon size={20} />
              </span>
              <span className={cn(
                'whitespace-nowrap overflow-hidden',
                isGeralActive && 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] bg-clip-text text-transparent',
              )}>Geral</span>
            </button>

            {activeGroupTypes.map((gt) => (
              <button
                key={gt.id}
                onClick={() => handleGroupTypeNav(gt.id)}
                className={cn(
                  'relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer group',
                  currentGroupType === gt.id
                    ? 'bg-[rgba(255,255,255,0.06)] font-medium'
                    : 'text-white/60 hover:text-white hover:bg-[rgba(255,255,255,0.03)] font-medium',
                )}
              >
                {currentGroupType === gt.id && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-[#d4af37] to-[#b8860b]"
                  />
                )}
                <span className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-lg transition-all flex-shrink-0',
                  currentGroupType === gt.id
                    ? 'bg-gradient-to-br from-[rgba(212,175,55,0.2)] to-[rgba(184,134,11,0.1)] text-[#d4af37]'
                    : 'text-white/50 group-hover:text-white/70',
                )}>
                  <GroupsIcon size={20} />
                </span>
                <span className={cn(
                  'whitespace-nowrap overflow-hidden',
                  currentGroupType === gt.id && 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] bg-clip-text text-transparent',
                )}>{gt.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Section label: ADMINISTRAÇÃO */}
        {!sidebarCollapsed && (
          <div className="pt-5 pb-1 px-2">
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/50 font-semibold">
              Administração
            </p>
          </div>
        )}

        {/* Collapsed admin divider */}
        {sidebarCollapsed && (
          <div className="py-2 px-2">
            <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </div>
        )}

        {/* Admin collapsed icons */}
        {sidebarCollapsed && adminSubItems.map((item) => (
          <button
            key={item.tab}
            onClick={() => handleAdminNav(item.tab)}
            className={cn(
              'relative w-full flex items-center justify-center px-2 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer group',
              currentAdminTab === item.tab
                ? 'bg-[rgba(255,255,255,0.06)] text-white font-medium'
                : 'text-white/60 hover:text-white hover:bg-[rgba(255,255,255,0.03)] font-medium',
            )}
          >
            {currentAdminTab === item.tab && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-[#d4af37] to-[#b8860b]"
              />
            )}
            <span className={cn(
              'flex items-center justify-center w-8 h-8 rounded-lg transition-all',
              currentAdminTab === item.tab
                ? 'bg-gradient-to-br from-[rgba(212,175,55,0.2)] to-[rgba(184,134,11,0.1)] text-[#d4af37]'
                : 'text-white/50 group-hover:text-white/70',
            )}>
              <item.icon size={20} />
            </span>
          </button>
        ))}

        {/* Admin Sub-items */}
        {!sidebarCollapsed && (
          <div className="space-y-1 py-1">
            {adminSubItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => handleAdminNav(item.tab)}
                className={cn(
                  'relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer group',
                  currentAdminTab === item.tab
                    ? 'bg-[rgba(255,255,255,0.06)] font-medium'
                    : 'text-white/60 hover:text-white hover:bg-[rgba(255,255,255,0.03)] font-medium',
                )}
              >
                {currentAdminTab === item.tab && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-[#d4af37] to-[#b8860b]"
                  />
                )}
                <span className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-lg transition-all flex-shrink-0',
                  currentAdminTab === item.tab
                    ? 'bg-gradient-to-br from-[rgba(212,175,55,0.2)] to-[rgba(184,134,11,0.1)] text-[#d4af37]'
                    : 'text-white/50 group-hover:text-white/70',
                )}>
                  <item.icon size={20} />
                </span>
                <span className={cn(
                  'whitespace-nowrap overflow-hidden',
                  currentAdminTab === item.tab
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] bg-clip-text text-transparent'
                    : '',
                )}>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className={cn('p-4 space-y-3', sidebarCollapsed && 'px-3')}>
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent" />

        {/* Desktop footer */}
        <div className="hidden lg:flex flex-col items-center">
          <div className="mb-2">
            <div className={cn(
              'rounded-full bg-gradient-to-br from-[#103734] to-[#0c2926] border-2 border-[rgba(212,175,55,0.3)] shadow-lg flex items-center justify-center text-[#d4af37] font-bold transition-all duration-200',
              sidebarCollapsed ? 'w-9 h-9 text-xs' : 'h-11 w-11 text-sm',
            )}>
              {initials}
            </div>
          </div>

          {/* Collapsed unit switch */}
          {sidebarCollapsed && selectedUnit && (
            <button
              onClick={handleSwitchUnit}
              className="mt-1 flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <span className="text-[11px] font-semibold text-white/50 truncate max-w-[56px] text-center leading-tight">
                {unitNames[selectedUnit]}
              </span>
              <RepeatIcon size={14} className="text-white/50 group-hover:text-white/70 transition-colors" />
            </button>
          )}

          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col items-center w-full overflow-hidden space-y-3"
              >
                <p className="text-sm font-semibold text-white text-center">
                  {userName}
                </p>

                {selectedUnit && (
                  <motion.button
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleSwitchUnit}
                    className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-full bg-gradient-to-r from-[rgba(212,175,55,0.12)] to-[rgba(20,184,166,0.08)] border border-[rgba(212,175,55,0.25)] hover:border-[rgba(212,175,55,0.5)] hover:from-[rgba(212,175,55,0.2)] hover:to-[rgba(20,184,166,0.15)] transition-all duration-300 cursor-pointer group"
                  >
                    <FactoryIcon size={14} className="text-[#d4af37] flex-shrink-0" />
                    <span className="text-xs font-medium text-white/90 truncate">
                      {unitNames[selectedUnit]}
                    </span>
                    <RepeatIcon size={12} className="text-white/40 group-hover:text-[#d4af37] transition-colors flex-shrink-0" />
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile footer */}
        <div className="lg:hidden flex flex-col items-center space-y-3">
          <div className="mb-2">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#103734] to-[#0c2926] border-2 border-[rgba(212,175,55,0.3)] shadow-lg flex items-center justify-center text-[#d4af37] font-bold text-sm">
              {initials}
            </div>
          </div>
          <p className="text-sm font-semibold text-white">{userName}</p>

          {selectedUnit && (
            <motion.button
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleSwitchUnit}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-full bg-gradient-to-r from-[rgba(212,175,55,0.12)] to-[rgba(20,184,166,0.08)] border border-[rgba(212,175,55,0.25)] hover:border-[rgba(212,175,55,0.5)] hover:from-[rgba(212,175,55,0.2)] hover:to-[rgba(20,184,166,0.15)] transition-all duration-300 cursor-pointer group"
            >
              <FactoryIcon size={14} className="text-[#d4af37] flex-shrink-0" />
              <span className="text-xs font-medium text-white/90 truncate">
                {unitNames[selectedUnit]}
              </span>
              <RepeatIcon size={12} className="text-white/40 group-hover:text-[#d4af37] transition-colors flex-shrink-0" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden lg:flex flex-col fixed top-0 left-0 h-screen z-40 border-r border-[rgba(255,255,255,0.06)] overflow-hidden bg-gradient-to-b from-[#103734] via-[#0c2926] to-[#081c1a]"
        animate={{ width: sidebarCollapsed ? 72 : 264 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {sidebarContent}
      </motion.aside>

      {/* Floating collapse/expand button — desktop only */}
      <motion.button
        onClick={toggleSidebar}
        className="hidden lg:flex fixed top-[35px] z-50 w-[26px] h-[26px] items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 ring-1 ring-yellow-600/30 shadow-[0_2px_10px_rgba(180,160,0,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] text-yellow-950 hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-500 hover:shadow-[0_3px_14px_rgba(180,160,0,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] active:scale-95 transition-all duration-200 cursor-pointer"
        animate={{ left: sidebarCollapsed ? 56 : 248 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {sidebarCollapsed ? <MenuIcon size={12} /> : <ChevronLeftIcon size={12} />}
      </motion.button>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarMobileOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarMobileOpen && (
          <motion.aside
            className="lg:hidden fixed top-0 left-0 h-screen w-[280px] z-50 border-r border-[rgba(255,255,255,0.06)] overflow-hidden bg-gradient-to-b from-[#103734] via-[#0c2926] to-[#081c1a]"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={() => setSidebarMobileOpen(false)}
              className="absolute top-5 right-4 w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/50 hover:text-white/80 transition-all cursor-pointer"
            >
              <XIcon size={16} />
            </button>
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
