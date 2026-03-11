import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ArrowLeftRight, Tag, Target,
  BarChart2, Settings, User, LogOut, BookOpen, X,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'
import ThemeToggle from '../common/ThemeToggle'
import LanguageSwitcher from '../common/LanguageSwitcher'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const navItems = [
    { to: '/dashboard',    label: t('nav.dashboard'),    icon: LayoutDashboard },
    { to: '/transactions', label: t('nav.transactions'), icon: ArrowLeftRight },
    { to: '/categories',   label: t('nav.categories'),   icon: Tag },
    { to: '/budget-goals', label: t('nav.budgetGoals'),  icon: Target },
    { to: '/reports',      label: t('nav.reports'),      icon: BarChart2 },
    { to: '/tutorial',     label: t('nav.tutorial'),     icon: BookOpen },
  ]

  const bottomItems = [
    { to: '/settings', label: t('nav.settings'), icon: Settings },
    { to: '/profile',  label: t('nav.profile'),  icon: User },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <>
      {onClose && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-30 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-60 flex flex-col
          bg-white dark:bg-[#070d1a]
          border-r border-slate-200 dark:border-white/5
          transition-transform duration-300
          lg:static lg:translate-x-0 lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Saving Pro" className="w-8 h-8 rounded-[9px] shadow-md shadow-teal-500/20" />
            <div>
              <h1 className="text-[15px] font-black text-slate-900 dark:text-white tracking-tight">
                Saving<span className="text-teal-500 dark:text-teal-400">Pro</span>
              </h1>
              {user && (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[120px]">
                  {user.name || user.email}
                </p>
              )}
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors lg:hidden">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => onClose?.()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} />
                  <span className="flex-1">{label}</span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom nav */}
        <div className="px-3 py-4 border-t border-slate-100 dark:border-white/5 space-y-0.5">
          {bottomItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => onClose?.()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} />
                  {label}
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400 ml-auto" />}
                </>
              )}
            </NavLink>
          ))}
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 w-full transition-all"
          >
            <LogOut size={17} />
            {t('common.logout') || 'Wyloguj się'}
          </button>
        </div>
      </aside>
    </>
  )
}
