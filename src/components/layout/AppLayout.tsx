import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.14, ease: 'easeIn' } },
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Desktop sidebar (always shown) */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar (drawer) */}
      <div className="lg:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 overflow-auto min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-20 flex items-center gap-4 px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
          >
            <Menu size={22} />
          </button>
          <span className="font-bold text-blue-500 text-lg">Saving Pro</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
