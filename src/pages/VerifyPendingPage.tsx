import { motion } from 'framer-motion'
import { Mail, LogOut, RefreshCw } from 'lucide-react'
import { auth } from '../lib/firebase'
import { sendEmailVerification } from 'firebase/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function VerifyPendingPage() {
  const [resent, setResent] = useState(false)
  const [checking, setChecking] = useState(false)
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  const isDark =
    document.documentElement.classList.contains('dark') ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const handleResend = async () => {
    const user = auth.currentUser
    if (user) {
      await sendEmailVerification(user)
      setResent(true)
    }
  }

  const handleCheck = async () => {
    setChecking(true)
    await auth.currentUser?.reload()
    if (auth.currentUser?.emailVerified) {
      navigate('/dashboard')
    } else {
      setChecking(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ backgroundColor: isDark ? '#030712' : '#f8fafc' }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[130px]"
          style={{ background: isDark ? 'rgba(20,184,166,0.08)' : 'rgba(20,184,166,0.12)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md text-center"
      >
        <div
          className="rounded-[28px] shadow-2xl p-8"
          style={{ backgroundColor: isDark ? '#0f1629' : '#ffffff' }}
        >
          <div className="w-16 h-16 rounded-2xl bg-teal-500/15 border border-teal-500/25 flex items-center justify-center mx-auto mb-5">
            <Mail size={28} className="text-teal-400" />
          </div>

          <h2 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Zweryfikuj adres e-mail
          </h2>
          <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Wysłaliśmy link weryfikacyjny na:
          </p>
          <p className="text-teal-400 font-semibold text-sm mb-6">
            {auth.currentUser?.email}
          </p>
          <p className={`text-xs mb-8 leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            Kliknij w link w mailu żeby aktywować konto.<br />
            Sprawdź też folder SPAM.
          </p>

          <div className="space-y-2.5">
            <button
              onClick={handleCheck}
              disabled={checking}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-teal-600/25 hover:-translate-y-0.5 cursor-pointer"
            >
              <RefreshCw size={15} className={checking ? 'animate-spin' : ''} />
              {checking ? 'Sprawdzam...' : 'Już zweryfikowałem'}
            </button>

            {!resent ? (
              <button
                onClick={handleResend}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isDark ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                Wyślij link ponownie
              </button>
            ) : (
              <p className="text-teal-400 text-sm py-3">✓ Link wysłany ponownie</p>
            )}

            <button
              onClick={handleLogout}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isDark ? 'text-slate-500 hover:text-red-400' : 'text-slate-400 hover:text-red-500'
              }`}
            >
              <LogOut size={14} />
              Wyloguj się
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
