import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tag,
  Target,
  BarChart2,
  Settings,
  User,
  LogOut,
  BookOpen,
  X,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import ThemeToggle from '../common/ThemeToggle'
import LanguageSwitcher from '../common/LanguageSwitcher'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transakcje', icon: ArrowLeftRight },
  { to: '/categories', label: 'Kategorie', icon: Tag },
  { to: '/budget-goals', label: 'Budżety i cele', icon: Target },
  { to: '/reports', label: 'Raporty', icon: BarChart2 },
  { to: '/tutorial', label: 'Poradnik', icon: BookOpen },
]

const bottomItems = [
  { to: '/settings', label: 'Ustawienia', icon: Settings },
  { to: '/profile', label: 'Profil', icon: User },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleNav = () => {
    if (onClose) onClose()
  }

  return (
    <>
      {/* Overlay on mobile */}
      {onClose && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-64 bg-slate-900 text-white flex flex-col
          transition-transform duration-300
          lg:static lg:translate-x-0 lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Saving Pro" className="w-9 h-9 rounded-[10px]" />
            <div>
              <h1 className="text-xl font-bold text-teal-400">Saving Pro</h1>
              {user && (
                <p className="text-sm text-slate-400 mt-1 truncate">{user.name}</p>
              )}
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-white lg:hidden">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Main nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={handleNav}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom nav */}
        <div className="p-4 border-t border-slate-700 space-y-1">
          {bottomItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={handleNav}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-red-600 hover:text-white w-full transition-colors"
          >
            <LogOut size={18} />
            Wyloguj się
          </button>
        </div>
      </aside>
    </>
  )
}
