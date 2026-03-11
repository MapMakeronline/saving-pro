import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, AlertCircle, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store/authStore'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const { register, loginWithGoogle, loginWithGithub, loginWithFacebook, loginWithMicrosoft, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleProvider = async (fn: () => Promise<void>) => {
    clearError()
    try {
      await fn()
      navigate('/dashboard')
    } catch { /* error shown via store */ }
  }

  const isDark =
    document.documentElement.classList.contains('dark') ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const th = {
    bg: isDark ? '#030712' : '#f8fafc',
    bgCard: isDark ? '#0f1629' : '#ffffff',
    text: isDark ? 'text-white' : 'text-slate-900',
    textSub: isDark ? 'text-slate-400' : 'text-slate-600',
    textMuted: isDark ? 'text-slate-500' : 'text-slate-500',
    label: isDark ? 'text-slate-400' : 'text-slate-500',
    input: isDark
      ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-teal-500/60 focus:bg-white/8'
      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white',
    teal: isDark ? 'text-teal-400' : 'text-teal-600',
    gridLine: isDark ? '#ffffff06' : '#0000000a',
    shadow: isDark ? 'shadow-black/50' : 'shadow-slate-200/80',
    logoName: isDark ? 'text-white' : 'text-slate-900',
    link: isDark ? 'text-slate-500' : 'text-slate-500',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setValidationError('')
    if (!EMAIL_RE.test(formData.email)) {
      setValidationError(t('auth.invalidEmail'))
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError(t('auth.passwordMismatch'))
      return
    }
    try {
      await register(formData.email, formData.password, formData.name)
      setEmailSent(true)
    } catch {
      // error is set in store
    }
  }

  const displayError = validationError || error

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ backgroundColor: th.bg }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[130px]"
            style={{ background: isDark ? 'rgba(20,184,166,0.08)' : 'rgba(20,184,166,0.12)' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md"
        >
          <div className={`rounded-[28px] shadow-2xl ${th.shadow} p-8 text-center`} style={{ backgroundColor: th.bgCard }}>
            <div className="w-16 h-16 rounded-2xl bg-teal-500/15 border border-teal-500/25 flex items-center justify-center mx-auto mb-5">
              <Mail size={28} className={th.teal} />
            </div>
            <h2 className={`text-2xl font-black ${th.text} mb-2`}>{t('auth.checkInbox')}</h2>
            <p className={`${th.textSub} text-sm mb-2`}>{t('auth.verificationSentTo')}</p>
            <p className={`${th.teal} font-semibold text-sm mb-6`}>{formData.email}</p>
            <p className={`${th.textMuted} text-xs mb-8 leading-relaxed`}>{t('auth.verificationHint')}</p>
            <button
              onClick={() => navigate('/login')}
              className="group w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-teal-600/25 hover:-translate-y-0.5 cursor-pointer"
            >
              {t('auth.goToLogin')}
              <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ backgroundColor: th.bg }}>
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[130px]"
          style={{ background: isDark ? 'rgba(20,184,166,0.08)' : 'rgba(20,184,166,0.12)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[110px]"
          style={{ background: isDark ? 'rgba(6,182,212,0.05)' : 'rgba(6,182,212,0.08)' }} />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `linear-gradient(to right, ${th.gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${th.gridLine} 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className={`rounded-[28px] shadow-2xl ${th.shadow} p-8`} style={{ backgroundColor: th.bgCard }}>

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="flex items-center gap-2.5 mb-6">
              <img src="/logo.png" alt="Saving Pro" className="w-10 h-10 rounded-[12px] shadow-lg shadow-teal-500/30" />
              <span className={`text-[15px] font-black tracking-tight ${th.logoName}`}>
                Saving<span className={th.teal}>Pro</span>
              </span>
            </Link>
            <h1 className={`text-2xl font-black ${th.text} tracking-tight`}>{t('auth.registerFreeTitle')}</h1>
            <p className={`${th.textSub} text-sm mt-1.5`}>{t('auth.registerFreeSubtitle')}</p>
          </div>

          {/* Error */}
          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/25 text-red-500 px-4 py-3 rounded-xl mb-5 text-sm"
            >
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              {displayError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className={`block text-xs font-semibold ${th.label} mb-1.5 uppercase tracking-wide`}>{t('auth.fullName')}</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('auth.namePlaceholder')}
                required
                className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all ${th.input}`}
              />
            </div>

            {/* Email */}
            <div>
              <label className={`block text-xs font-semibold ${th.label} mb-1.5 uppercase tracking-wide`}>{t('auth.email')}</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="ty@email.pl"
                required
                className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all ${th.input}`}
              />
            </div>

            {/* Password */}
            <div>
              <label className={`block text-xs font-semibold ${th.label} mb-1.5 uppercase tracking-wide`}>{t('auth.password')}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                  minLength={6}
                  className={`w-full px-4 py-3 pr-11 border rounded-xl text-sm outline-none transition-all ${th.input}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${th.textMuted} hover:text-slate-400 transition-colors cursor-pointer`}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className={`block text-xs font-semibold ${th.label} mb-1.5 uppercase tracking-wide`}>{t('auth.confirmPassword')}</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                  className={`w-full px-4 py-3 pr-11 border rounded-xl text-sm outline-none transition-all ${th.input}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${th.textMuted} hover:text-slate-400 transition-colors cursor-pointer`}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-teal-600/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 mt-2 cursor-pointer"
            >
              {isLoading ? t('auth.creatingAccount') : (
                <>
                  {t('auth.registerBtn')}
                  <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className={`flex-1 h-px ${isDark ? 'bg-white/8' : 'bg-slate-200'}`} />
            <span className={`text-xs font-medium ${th.textMuted}`}>{t('auth.orDivider')}</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-white/8' : 'bg-slate-200'}`} />
          </div>

          {/* Social buttons grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <button type="button" onClick={() => handleProvider(loginWithGoogle)} disabled={isLoading}
              className={`flex items-center justify-center gap-2.5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer disabled:opacity-50 ${isDark ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm'}`}>
              <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" onClick={() => handleProvider(loginWithGithub)} disabled={isLoading}
              className={`flex items-center justify-center gap-2.5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer disabled:opacity-50 ${isDark ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm'}`}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </button>
            <button type="button" onClick={() => handleProvider(loginWithFacebook)} disabled={isLoading}
              className={`flex items-center justify-center gap-2.5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer disabled:opacity-50 ${isDark ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm'}`}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.931-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
              Facebook
            </button>
            <button type="button" onClick={() => handleProvider(loginWithMicrosoft)} disabled={isLoading}
              className={`flex items-center justify-center gap-2.5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer disabled:opacity-50 ${isDark ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm'}`}>
              <svg width="17" height="17" viewBox="0 0 21 21" fill="none">
                <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
              </svg>
              Microsoft
            </button>
          </div>

          <p className={`text-center mt-5 ${th.link} text-sm`}>
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className={`${th.teal} hover:opacity-80 font-semibold transition-opacity cursor-pointer`}>
              {t('auth.loginBtn')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
