import { useState, useEffect, createContext, useContext } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, BarChart2, Bell, CheckCircle, ChevronDown, Globe,
  Lock, Mail, Menu, Moon, RefreshCw, Shield, Star,
  Sun, Target, TrendingUp, X, Zap,
} from 'lucide-react'

/* ─────────────────────────────────────────────
   THEME CONTEXT
───────────────────────────────────────────── */
const ThemeCtx = createContext(true)

function useTheme() {
  const isDark = useContext(ThemeCtx)
  return {
    isDark,
    bg: isDark ? '#030712' : '#f8fafc',
    bgSec: isDark ? '#080d1a' : '#f1f5f9',
    bgCard: isDark ? '#0f1629' : '#ffffff',
    bgCard2: isDark ? '#1a2035' : '#eef2f7',
    bgNav: isDark ? 'rgba(3,7,18,0.92)' : 'rgba(248,250,252,0.92)',
    text: isDark ? 'text-white' : 'text-slate-900',
    textSub: isDark ? 'text-slate-400' : 'text-slate-600',
    textMuted: isDark ? 'text-slate-500' : 'text-slate-500',
    textFaint: isDark ? 'text-slate-600' : 'text-slate-400',
    border: isDark ? 'border-white/6' : 'border-slate-200',
    borderHover: isDark ? 'hover:border-white/10' : 'hover:border-slate-300',
    hoverBg: isDark ? 'hover:bg-white/6' : 'hover:bg-slate-100',
    navText: isDark ? 'text-slate-400' : 'text-slate-600',
    navTextHover: isDark ? 'hover:text-white' : 'hover:text-slate-900',
    gridLine: isDark ? '#ffffff06' : '#0000000a',
    teal: isDark ? 'text-teal-400' : 'text-teal-600',
    tealBorder: isDark ? 'border-teal-500/30' : 'border-teal-600/40',
    tealBg: isDark ? 'bg-teal-500/20' : 'bg-teal-600/15',
  }
}

/* ─────────────────────────────────────────────
   BROWSER DETECTION
───────────────────────────────────────────── */
type Browser = 'chrome' | 'safari' | 'firefox' | 'edge' | 'opera'

function detectBrowser(): Browser {
  const ua = navigator.userAgent
  if (/OPR\/|Opera\//.test(ua)) return 'opera'
  if (/Edg\//.test(ua)) return 'edge'
  if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) return 'chrome'
  if (/Firefox\//.test(ua)) return 'firefox'
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return 'safari'
  return 'chrome'
}

/* ─────────────────────────────────────────────
   SHINY TEXT
───────────────────────────────────────────── */
function Shiny({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme()
  const colors = isDark ? 'from-teal-200 via-white to-teal-200' : 'from-teal-700 via-teal-500 to-teal-700'
  return (
    <span className={`bg-gradient-to-r ${colors} bg-clip-text text-transparent bg-[length:200%_100%] [animation:shine_5s_linear_infinite]`}>
      {children}
      <style>{`@keyframes shine { 0%{background-position:0% 0} 100%{background-position:200% 0} }`}</style>
    </span>
  )
}

/* ─────────────────────────────────────────────
   FAQ
───────────────────────────────────────────── */
const FAQ_DATA = [
  { q: 'Czy Saving Pro jest darmowe?', a: 'Tak! Saving Pro jest w pełni darmowe. Możesz rejestrować transakcje, tworzyć budżety i śledzić cele oszczędnościowe bez żadnych opłat.' },
  { q: 'Czy moje dane są bezpieczne?', a: 'Tak. Wszystkie dane są szyfrowane (SSL/TLS) i przechowywane na bezpiecznych serwerach. Nigdy nie udostępniamy ich osobom trzecim.' },
  { q: 'Czy mogę używać aplikacji w kilku walutach?', a: 'Aktualnie możesz wybrać jedną walutę domyślną (PLN, EUR, USD, GBP, CHF). Obsługa wielu walut jednocześnie jest planowana w kolejnych wersjach.' },
  { q: 'Jak dodać transakcję?', a: 'Przejdź do zakładki „Transakcje" i kliknij przycisk „+ Nowa transakcja". Wypełnij formularz z kwotą, kategorią i datą.' },
  { q: 'Czy mogę eksportować dane?', a: 'Tak – eksport do CSV jest dostępny bezpośrednio ze strony Raporty. Eksport PDF planujemy w kolejnej wersji.' },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  const th = useTheme()
  return (
    <div className={`border-b ${th.border} last:border-0`}>
      <button onClick={() => setOpen(o => !o)} className="w-full text-left py-5 flex justify-between items-center gap-4 group">
        <span className={`font-medium ${th.text} transition-colors text-[15px] leading-snug`}>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.24, ease: 'easeInOut' }}>
          <ChevronDown size={17} className={`${th.textMuted} shrink-0`} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
            <p className={`pb-5 ${th.textSub} text-sm leading-relaxed`}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────────
   LANGUAGE OPTIONS
───────────────────────────────────────────── */
const LANGS = [
  { code: 'pl', label: 'PL', flag: '🇵🇱' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
]

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
const navLinks = [
  { label: 'Możliwości', href: '#features' },
  { label: 'Jak działa', href: '#how' },
  { label: 'FAQ', href: '#faq' },
]

function Navbar({ isDark, toggleDark }: { isDark: boolean; toggleDark: () => void }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { i18n } = useTranslation()
  const th = useTheme()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const changeLang = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('language', code)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? `backdrop-blur-2xl border-b ${th.border}` : ''}`}
      style={scrolled ? { backgroundColor: th.bgNav } : {}}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-[70px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 select-none">
          <img src="/logo.png" alt="Saving Pro" className="w-10 h-10 rounded-[12px] shadow-lg shadow-teal-500/30" />
          <span className={`text-[15px] font-black tracking-tight ${th.text}`}>
            Saving<span className="text-teal-400">Pro</span>
          </span>
        </Link>

        {/* Center links */}
        <ul className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(l => (
            <li key={l.href}>
              <a href={l.href} className={`px-4 py-2 text-sm font-medium ${th.navText} ${th.navTextHover} ${th.hoverBg} rounded-xl transition-all duration-200`}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-2">
          {/* Language switcher */}
          <div className="flex items-center gap-0.5 mr-1">
            {LANGS.map(lang => (
              <button
                key={lang.code}
                onClick={() => changeLang(lang.code)}
                title={lang.flag + ' ' + lang.label}
                className={`px-2 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  i18n.language === lang.code
                    ? `${th.tealBg} ${th.teal} border ${th.tealBorder}`
                    : `${th.navText} border border-transparent ${th.hoverBg}`
                }`}
              >
                {lang.flag} {lang.label}
              </button>
            ))}
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            aria-label={isDark ? 'Tryb jasny' : 'Tryb ciemny'}
            className={`w-9 h-9 flex items-center justify-center rounded-xl ${th.navText} ${th.navTextHover} ${th.hoverBg} transition-all`}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link to="/login" className={`text-sm font-medium ${th.navText} ${th.navTextHover} px-4 py-2 rounded-xl transition-colors duration-200`}>
            Zaloguj się
          </Link>
          <Link
            to="/register"
            className={`group inline-flex items-center gap-2 ${isDark ? 'bg-white text-[#030712] hover:bg-teal-50' : 'bg-slate-900 text-white hover:bg-slate-800'} text-sm font-extrabold px-6 py-3 rounded-2xl transition-all shadow-xl shadow-black/20 hover:-translate-y-0.5`}
          >
            Zacznij za darmo
            <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Burger */}
        <button
          onClick={() => setOpen(o => !o)}
          className={`md:hidden w-10 h-10 flex items-center justify-center rounded-xl ${th.navText} ${th.navTextHover} ${th.hoverBg} transition-all`}
          aria-label="Menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open
              ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><X size={20} /></motion.span>
              : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Menu size={20} /></motion.span>
            }
          </AnimatePresence>
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={`md:hidden overflow-hidden backdrop-blur-2xl border-b ${th.border}`}
            style={{ backgroundColor: th.bgNav }}
          >
            <div className="max-w-7xl mx-auto px-5 py-3 flex flex-col gap-1">
              {navLinks.map((l, i) => (
                <motion.a key={l.href} href={l.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} onClick={() => setOpen(false)} className={`px-4 py-3 text-sm font-medium ${th.navText} ${th.navTextHover} ${th.hoverBg} rounded-xl transition-all`}>
                  {l.label}
                </motion.a>
              ))}
              <div className={`h-px ${isDark ? 'bg-white/6' : 'bg-slate-200'} my-1`} />
              {/* Language + dark toggle row */}
              <div className="flex items-center gap-1.5 px-3 py-1.5">
                {LANGS.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => changeLang(lang.code)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                      i18n.language === lang.code
                        ? `${th.tealBg} ${th.teal} border ${th.tealBorder}`
                        : `${th.navText} border border-transparent ${th.hoverBg}`
                    }`}
                  >
                    {lang.flag} {lang.label}
                  </button>
                ))}
                <button
                  onClick={toggleDark}
                  className={`ml-auto w-8 h-8 flex items-center justify-center rounded-xl ${th.navText} ${th.hoverBg} transition-all`}
                >
                  {isDark ? <Sun size={15} /> : <Moon size={15} />}
                </button>
              </div>
              <Link to="/login" onClick={() => setOpen(false)} className={`px-4 py-3 text-sm font-medium ${th.navText} ${th.navTextHover} ${th.hoverBg} rounded-xl transition-all`}>
                Zaloguj się
              </Link>
              <Link to="/register" onClick={() => setOpen(false)} className="mt-1 flex items-center justify-center gap-2 bg-teal-600 text-white font-extrabold py-3.5 rounded-xl text-sm">
                Zacznij za darmo <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ─────────────────────────────────────────────
   BROWSER WINDOW BAR
───────────────────────────────────────────── */
function WindowBar({ browser }: { browser: Browser }) {
  /* Safari – macOS traffic lights */
  if (browser === 'safari') {
    return (
      <div className="px-4 py-3 flex items-center gap-2 bg-[#111827]/95 border-b border-white/6 backdrop-blur">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        <div className="flex-1 mx-3 bg-white/6 rounded-md px-3 py-1 text-[11px] text-slate-500 text-center tracking-wide">
          app.savingpro.pl/dashboard
        </div>
        <div className="w-14 h-5 rounded bg-white/6" />
      </div>
    )
  }

  /* Firefox */
  if (browser === 'firefox') {
    return (
      <div className="flex flex-col bg-[#1a1b26] border-b border-white/6">
        <div className="flex items-end gap-0.5 px-3 pt-2">
          <div className="flex items-center gap-1.5 bg-[#2a2b3a] rounded-t-lg px-3 py-1.5 border border-b-0 border-white/8">
            <span className="w-3 h-3 rounded-sm bg-orange-500/60 shrink-0" />
            <span className="text-[10px] text-slate-400 max-w-[120px] truncate">Saving Pro — Dashboard</span>
            <span className="ml-1 text-slate-600 text-[10px] cursor-pointer hover:text-slate-400">×</span>
          </div>
          <span className="px-2 pb-1 text-[13px] text-slate-600">+</span>
        </div>
        <div className="px-3 py-2 flex items-center gap-2 bg-[#13141f]">
          <div className="flex gap-1.5 text-slate-600 text-[11px] font-bold">
            <span className="cursor-pointer hover:text-slate-400">←</span>
            <span className="cursor-pointer hover:text-slate-400">→</span>
            <span className="cursor-pointer hover:text-slate-400">↻</span>
          </div>
          <div className="flex-1 bg-[#2a2b3a] rounded-lg px-3 py-1 text-[11px] text-slate-500 flex items-center gap-2">
            <span className="text-green-400 text-[9px]">🔒</span>
            <span>app.savingpro.pl/dashboard</span>
          </div>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-white/5" />
            <div className="w-4 h-4 rounded bg-white/5" />
          </div>
        </div>
      </div>
    )
  }

  /* Edge */
  if (browser === 'edge') {
    return (
      <div className="flex flex-col bg-[#1a2035] border-b border-white/6">
        <div className="flex items-stretch justify-between px-2 pt-1.5">
          <div className="flex items-end gap-0.5">
            <div className="flex items-center gap-1.5 bg-[#0f1629] rounded-t-md px-3 py-1.5 border border-b-0 border-white/8">
              <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: 'linear-gradient(135deg,#0078d4,#50e6ff)' }} />
              <span className="text-[10px] text-slate-400">Saving Pro</span>
              <span className="ml-1 text-slate-600 text-[10px] cursor-pointer hover:text-slate-400">×</span>
            </div>
          </div>
          {/* Windows chrome controls */}
          <div className="flex items-center">
            <div className="w-10 h-8 flex items-center justify-center text-slate-500 hover:bg-white/5 text-[10px] cursor-pointer">—</div>
            <div className="w-10 h-8 flex items-center justify-center text-slate-500 hover:bg-white/5 text-[10px] cursor-pointer">□</div>
            <div className="w-10 h-8 flex items-center justify-center text-slate-500 hover:bg-red-500/80 hover:text-white text-[10px] cursor-pointer">✕</div>
          </div>
        </div>
        <div className="px-3 py-1.5 flex items-center gap-2 bg-[#0f1629]">
          <div className="flex gap-1.5 text-slate-600 text-[11px]">
            <span>←</span><span>→</span><span>↻</span>
          </div>
          <div className="flex-1 bg-[#1a2035] rounded-full px-3 py-1 text-[11px] text-slate-500 flex items-center gap-2">
            <span className="text-green-400 text-[9px]">🔒</span>
            <span>app.savingpro.pl/dashboard</span>
          </div>
          <div className="w-5 h-5 rounded-full shrink-0" style={{ background: 'linear-gradient(135deg,#0078d4,#50e6ff)' }} />
        </div>
      </div>
    )
  }

  /* Opera */
  if (browser === 'opera') {
    return (
      <div className="flex flex-col bg-[#1a1220] border-b border-white/6">
        <div className="flex items-end gap-0.5 px-3 pt-2">
          <div className="flex items-center gap-1.5 bg-[#2a1f30] rounded-t-lg px-3 py-1.5 border border-b-0 border-white/8">
            <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: 'linear-gradient(135deg,#ff1b2d,#ff6640)' }} />
            <span className="text-[10px] text-slate-400 max-w-[120px] truncate">Saving Pro — Dashboard</span>
            <span className="ml-1 text-slate-600 text-[10px] cursor-pointer hover:text-slate-400">×</span>
          </div>
          <span className="px-2 pb-1 text-[13px] text-slate-600">+</span>
        </div>
        <div className="px-3 py-2 flex items-center gap-2 bg-[#12091a]">
          <div className="flex gap-1.5 text-slate-600 text-[11px] font-bold">
            <span className="cursor-pointer hover:text-slate-400">←</span>
            <span className="cursor-pointer hover:text-slate-400">→</span>
            <span className="cursor-pointer hover:text-slate-400">↻</span>
          </div>
          <div className="flex-1 bg-[#2a1f30] rounded-lg px-3 py-1 text-[11px] text-slate-500 flex items-center gap-2">
            <span className="text-green-400 text-[9px]">🔒</span>
            <span>app.savingpro.pl/dashboard</span>
          </div>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-white/5" />
            <div className="w-4 h-4 rounded bg-white/5" />
          </div>
        </div>
      </div>
    )
  }

  /* Chrome (default) */
  return (
    <div className="flex flex-col bg-[#1e1e1e] border-b border-white/6">
      <div className="flex items-stretch justify-between px-2 pt-1.5 gap-2">
        <div className="flex items-end gap-0.5 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 bg-[#2d2d2d] rounded-t-lg px-3 py-1.5 max-w-[200px] border border-b-0 border-white/8">
            <span className="w-3 h-3 rounded-sm bg-teal-500/70 shrink-0" />
            <span className="text-[10px] text-slate-400 truncate">Saving Pro — Dashboard</span>
            <span className="ml-1 text-slate-600 hover:text-slate-300 cursor-pointer text-[10px] shrink-0">×</span>
          </div>
          <span className="px-2 pb-1 text-[14px] text-slate-600 cursor-pointer hover:text-slate-400">+</span>
        </div>
        {/* Windows controls */}
        <div className="flex items-center shrink-0">
          <div className="w-9 h-8 flex items-center justify-center text-slate-500 hover:bg-white/5 text-[10px] cursor-pointer">—</div>
          <div className="w-9 h-8 flex items-center justify-center text-slate-500 hover:bg-white/5 text-[10px] cursor-pointer">□</div>
          <div className="w-9 h-8 flex items-center justify-center text-slate-500 hover:bg-red-500/80 hover:text-white text-[10px] cursor-pointer">✕</div>
        </div>
      </div>
      <div className="px-3 py-1.5 flex items-center gap-2 bg-[#2a2a2a]">
        <div className="flex gap-1.5 text-slate-500 text-[11px] font-bold">
          <span>←</span><span>→</span><span>↻</span>
        </div>
        <div className="flex-1 bg-[#3c3c3c] rounded-full px-3 py-1 text-[11px] text-slate-400 flex items-center gap-2">
          <span className="text-green-400 text-[9px]">🔒</span>
          <span>app.savingpro.pl/dashboard</span>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <div className="w-4 h-4 rounded bg-white/5" />
          <div className="w-4 h-4 rounded bg-white/5" />
          <div className="w-4 h-4 rounded bg-white/5" />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   DASHBOARD MOCKUP
───────────────────────────────────────────── */
function DashboardMockup() {
  const [browser] = useState<Browser>(detectBrowser)
  const bars = [55, 80, 45, 90, 60, 75, 50, 85, 65, 95, 70, 88]
  const th = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div className="absolute -inset-6 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.25),transparent_60%)] blur-[80px] rounded-[40px]" />
      <div
        className="relative rounded-[26px] overflow-hidden border border-white/8 shadow-[0_30px_120px_rgba(0,0,0,0.5)]"
        style={{ backgroundColor: th.bgCard }}
      >
        <WindowBar browser={browser} />

        <div className="flex">
          {/* sidebar */}
          <div
            className="hidden sm:flex flex-col gap-2 w-[54px] border-r border-white/6 py-4 px-2.5 items-center"
            style={{ backgroundColor: th.isDark ? '#0a0f1e' : '#eef2f7' }}
          >
            {[
              { c: '#14b8a6', a: true },
              { c: '#22c55e', a: false },
              { c: '#a855f7', a: false },
              { c: '#f59e0b', a: false },
              { c: '#ef4444', a: false },
            ].map((s, i) => (
              <div
                key={i}
                className={`w-7 h-7 rounded-[12px] ${s.a ? 'opacity-100' : 'opacity-30'} group relative`}
                style={{ backgroundColor: s.c + '22', border: `1px solid ${s.c}44` }}
              >
                <div className="w-full h-full rounded-[12px]" style={{ backgroundColor: s.a ? s.c : 'transparent' }} />
                <span className="absolute inset-0 rounded-[12px] bg-white/0 group-hover:bg-white/6 transition-colors" />
              </div>
            ))}
          </div>

          {/* main content */}
          <div className="flex-1 p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className={`text-[11px] ${th.textMuted} mb-1`}>Dzień dobry, Krzysztof 👋</div>
                <div className={`${th.text} font-extrabold text-lg`}>Przegląd finansów</div>
              </div>
              <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-300 text-[11px] px-3 py-1.5 rounded-full font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Na bieżąco
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Saldo', val: '12 450', unit: 'zł', color: '#14b8a6', icon: '↑', trend: '+8%' },
                { label: 'Wydatki', val: '3 200', unit: 'zł', color: '#ef4444', icon: '↓', trend: '-5%' },
                { label: 'Oszczędności', val: '9 250', unit: 'zł', color: '#22c55e', icon: '↑', trend: '+12%' },
              ].map((c) => (
                <div key={c.label} className={`rounded-[16px] p-3.5 border ${th.border} transition-colors`} style={{ backgroundColor: th.bgCard2 }}>
                  <p className={`text-[10px] ${th.textMuted} mb-2 font-semibold uppercase tracking-wide`}>{c.label}</p>
                  <p className={`${th.text} font-black text-base`}>{c.val} <span className={`text-xs font-medium ${th.textSub}`}>{c.unit}</span></p>
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-[10px] font-semibold" style={{ color: c.color }}>{c.icon} {c.trend}</span>
                    <span className={`text-[10px] ${th.textFaint}`}>vs popr.</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={`rounded-[16px] p-4 border ${th.border}`} style={{ backgroundColor: th.bgCard2 }}>
              <div className="flex items-center justify-between mb-3">
                <p className={`text-xs font-semibold ${th.textSub}`}>Przychody vs wydatki</p>
                <div className={`flex items-center gap-3 text-[10px] ${th.textMuted}`}>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-teal-500 inline-block" />Przychody</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-400/60 inline-block" />Wydatki</span>
                </div>
              </div>
              <div className="flex items-end gap-1.5 h-[78px]">
                {bars.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col-reverse gap-0.5">
                    <motion.div className="w-full rounded-sm bg-teal-500/90" initial={{ height: 0 }} animate={{ height: `${h * 0.62}%` }} transition={{ duration: 0.55, delay: 0.9 + i * 0.035, ease: 'easeOut' }} />
                    <motion.div className="w-full rounded-sm bg-red-400/40" initial={{ height: 0 }} animate={{ height: `${(100 - h) * 0.38}%` }} transition={{ duration: 0.55, delay: 0.95 + i * 0.035, ease: 'easeOut' }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                {['Sty','Lut','Mar','Kwi','Maj','Cze','Lip','Sie','Wrz','Paź','Lis','Gru'].map(m => (
                  <span key={m} className={`text-[8px] ${th.textFaint} text-center flex-1`}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } }),
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }

/* ─────────────────────────────────────────────
   LANDING PAGE
───────────────────────────────────────────── */
export default function LandingPage() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark') ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )
  const [email, setEmail] = useState('')
  const [newsletterSent, setNewsletterSent] = useState(false)

  const toggleDark = () => {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const th = {
    bg: isDark ? '#030712' : '#f8fafc',
    bgSec: isDark ? '#080d1a' : '#f1f5f9',
    bgCard: isDark ? '#0f1629' : '#ffffff',
    border: isDark ? 'border-white/6' : 'border-slate-200',
    borderHover: isDark ? 'hover:border-white/10' : 'hover:border-slate-300',
    text: isDark ? 'text-white' : 'text-slate-900',
    textSub: isDark ? 'text-slate-400' : 'text-slate-600',
    textMuted: isDark ? 'text-slate-500' : 'text-slate-500',
    textFaint: isDark ? 'text-slate-600' : 'text-slate-400',
    hoverBg: isDark ? 'hover:bg-white/6' : 'hover:bg-slate-100',
    gridLine: isDark ? '#ffffff06' : '#0000000a',
    teal: isDark ? 'text-teal-400' : 'text-teal-600',
  }

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setNewsletterSent(true)
      setEmail('')
    }
  }

  return (
    <ThemeCtx.Provider value={isDark}>
      <div
        className="min-h-screen overflow-x-hidden transition-colors duration-300"
        style={{ backgroundColor: th.bg, color: isDark ? 'white' : '#0f172a' }}
      >
        <Navbar isDark={isDark} toggleDark={toggleDark} />

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-[70px] pb-0 px-6 overflow-hidden">
          {/* tło */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[1100px] h-[780px] rounded-full bg-teal-600/16 blur-[140px]" />
            <div className="absolute top-[28%] right-[-8%] w-[560px] h-[560px] rounded-full bg-cyan-600/10 blur-[130px]" />
            <div className="absolute bottom-[-10%] left-[12%] w-[420px] h-[320px] rounded-full bg-teal-900/25 blur-[110px]" />
          </div>
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.6]"
            style={{
              backgroundImage: `linear-gradient(to right, ${th.gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${th.gridLine} 1px, transparent 1px)`,
              backgroundSize: '64px 64px',
            }}
          />
          <div
            className="pointer-events-none absolute bottom-0 inset-x-0 h-72 z-10"
            style={{ background: `linear-gradient(to top, ${th.bg}, transparent)` }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center_top,rgba(255,255,255,0.06),transparent_55%)]" />

          <div className="relative z-[5] w-full max-w-6xl mx-auto text-center pt-16">
            {/* Headline */}
            <motion.h1 variants={fadeUp} custom={0} initial="hidden" animate="visible"
              className="text-5xl sm:text-6xl md:text-[84px] font-black leading-[1.02] tracking-[-2px] mb-7"
            >
              Ogarnij swoje finanse,
              <br />
              <span className={isDark ? 'bg-gradient-to-r from-teal-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent' : 'text-teal-600'}>
                intuicyjnie.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={1} initial="hidden" animate="visible"
              className={`text-lg md:text-xl ${th.textSub} mb-10 max-w-2xl mx-auto leading-relaxed`}
            >
              Śledź przychody i wydatki, działaj według budżetów i realizuj cele oszczędnościowe.<br className="hidden md:block" />
              Prosto, przejrzyście i z finezyjnym designem.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible"
              className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-16"
            >
              <Link to="/register"
                className="group flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-9 py-4 rounded-2xl text-base font-extrabold transition-all shadow-2xl shadow-teal-600/30 hover:shadow-teal-500/50 hover:-translate-y-1"
              >
                Zacznij za darmo
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login"
                className={`flex items-center gap-2 ${th.textSub} hover:text-teal-400 px-9 py-4 rounded-2xl text-base font-medium border ${th.border} ${th.borderHover} ${th.hoverBg} transition-all`}
              >
                Mam już konto
              </Link>
            </motion.div>

            <DashboardMockup />
          </div>
        </section>

        {/* ══ FEATURES ══════════════════════════════════════════════════════ */}
        <section id="features" className="py-28 px-6 relative">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.07),transparent_60%)]" />
          <div className="max-w-6xl mx-auto relative">
            <motion.div className="text-center mb-16" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${th.teal} mb-4`}>Możliwości</p>
              <h2 className={`text-4xl md:text-5xl font-black tracking-tight mb-5 ${th.text}`}>
                Wszystko w jednym miejscu — <Shiny>elegancko</Shiny>
              </h2>
              <p className={`${th.textSub} max-w-xl mx-auto text-[17px] leading-relaxed`}>
                Minimalny design, zero zbędnych opcji. Wszystko skoncentrowane na tym, żebyś kontrolował finanse bez wysiłku.
              </p>
            </motion.div>

            <motion.div className="grid md:grid-cols-3 gap-5" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
              {[
                {
                  icon: <TrendingUp size={22} />,
                  gradient: 'from-teal-500 to-teal-700',
                  glow: 'rgba(20,184,166,0.22)',
                  title: 'Śledzenie wydatków',
                  tag: 'Najpopularniejsze',
                  desc: 'Każda transakcja pod kontrolą. Kategorie, filtry i historia, które prowadzą cię do lepszych decyzji.',
                  features: ['Własne kategorie', 'Historia do przodu i do tyłu', 'Wyszukiwarka i filtry'],
                },
                {
                  icon: <Target size={22} />,
                  gradient: 'from-emerald-500 to-green-600',
                  glow: 'rgba(16,185,129,0.22)',
                  title: 'Budżety i cele',
                  tag: 'Motywujące',
                  desc: 'Ustaw limity miesięczne i cele oszczędnościowe. Otrzymuj jasne alerty zanim wpadasz w zadłużenie.',
                  features: ['Limity na miesiąc', 'Cele progresowe', 'Alerty przed przekroczeniem'],
                },
                {
                  icon: <BarChart2 size={22} />,
                  gradient: 'from-purple-500 to-violet-600',
                  glow: 'rgba(139,92,246,0.22)',
                  title: 'Raporty i wykresy',
                  tag: 'Nowe',
                  desc: 'Interaktywny podgląd trendów w wybranym okresie, z eksportem CSV po jednym kliknięciu.',
                  features: ['Miesięczne i kwartalne wykresy', 'Eksport do CSV', 'Porównanie okresów'],
                },
              ].map((f) => (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  className={`group relative border ${th.border} hover:border-teal-500/40 rounded-[24px] p-7 transition-all duration-500 overflow-hidden flex flex-col`}
                  style={{ backgroundColor: th.bgCard }}
                  whileHover={{ y: -5, boxShadow: `0 26px 90px ${f.glow}` }}
                >
                  {/* Hover overlay – opacity-0 by default, never overridden by style prop */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.14] transition-opacity duration-500 bg-gradient-to-br ${f.gradient} pointer-events-none`} />

                  <div className="relative z-10 flex flex-col flex-1">
                    <div className={`w-12 h-12 rounded-[16px] bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg relative overflow-hidden shrink-0`}>
                      <span className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent" />
                      {f.icon}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className={`text-base font-bold ${th.text}`}>{f.title}</h3>
                      <span className={`text-[10px] font-semibold ${th.textSub} ${isDark ? 'bg-white/6 border-white/8' : 'bg-slate-100 border-slate-200'} px-2.5 py-0.5 rounded-full border`}>{f.tag}</span>
                    </div>
                    <p className={`${th.textSub} text-sm leading-relaxed`}>{f.desc}</p>
                    {/* Checkmarks pushed to bottom */}
                    <ul className="flex flex-col gap-2.5 mt-auto pt-5">
                      {f.features.map(item => (
                        <li key={item} className={`flex items-start gap-2.5 text-xs ${th.textSub}`}>
                          <CheckCircle size={13} className="text-green-400 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══ TRUST STRIP ═══════════════════════════════════════════════════ */}
        <section className={`py-12 border-y ${th.border}`} style={{ backgroundColor: th.bgSec }}>
          <div className="max-w-5xl mx-auto px-6">
            <motion.div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {[
                { icon: <Lock size={16} />, text: 'Szyfrowanie SSL/TLS', color: 'text-green-400' },
                { icon: <Shield size={16} />, text: 'Bezpieczny hosting', color: 'text-teal-400' },
                { icon: <RefreshCw size={16} />, text: 'Automatyczne kopie', color: 'text-purple-400' },
                { icon: <Bell size={16} />, text: 'Alerty budżetowe', color: 'text-yellow-400' },
                { icon: <Globe size={16} />, text: '3 języki interfejsu', color: 'text-cyan-400' },
                { icon: <Zap size={16} />, text: 'Błyskawiczne działanie', color: 'text-orange-400' },
              ].map(({ icon, text, color }) => (
                <motion.div key={text} variants={fadeUp} className={`flex items-center gap-2 text-sm font-medium ${th.textSub}`}>
                  <span className={color}>{icon}</span>
                  <span>{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ══════════════════════════════════════════════════ */}
        <section id="how" className="py-28 px-6 relative">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.06),transparent_60%)]" />
          <div className="max-w-5xl mx-auto relative">
            <motion.div className="text-center mb-16" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${th.teal} mb-4`}>Jak to działa</p>
              <h2 className={`text-4xl md:text-5xl font-black tracking-tight mb-5 ${th.text}`}>Gotowy w <Shiny>3 minuty</Shiny></h2>
              <p className={`${th.textSub} text-[17px]`}>Zero konfiguracji. Zero karty kredytowej. Po prostu zacznij i kontroluj.</p>
            </motion.div>

            <motion.div className="grid md:grid-cols-3 gap-8 relative" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
              <div className="hidden md:block absolute top-[42px] left-[calc(33%+12px)] right-[calc(33%+12px)] h-px bg-gradient-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0" />
              {[
                { n: '01', title: 'Załóż konto', desc: 'Imię, e-mail i hasło. Rejestracja trwa blinkiem oka, nie proś o niepotrzebne rzeczy.', color: 'from-teal-500 to-teal-700', border: 'border-teal-500/25' },
                { n: '02', title: 'Dodaj transakcje', desc: 'Stwórz własne kategorie i zacznij rejestrować, żeby mieć faktyczny obraz swoich finansów.', color: 'from-green-400 to-emerald-600', border: 'border-green-500/25' },
                { n: '03', title: 'Realizuj cele', desc: 'Budżety i cele na żywo, inspeksja wykresów oraz dążenie do stabilności każdego miesiąca.', color: 'from-purple-500 to-violet-600', border: 'border-purple-500/25' },
              ].map((s) => (
                <motion.div key={s.n} variants={fadeUp} className="flex flex-col items-center text-center group">
                  <div className={`relative w-[80px] h-[80px] rounded-[24px] bg-gradient-to-br ${s.color} text-white text-2xl font-black flex items-center justify-center mb-6 shadow-2xl border ${s.border} group-hover:-translate-y-1.5 transition-transform duration-300 overflow-hidden`}>
                    <span className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent" />
                    {s.n}
                  </div>
                  <h3 className={`text-lg font-bold mb-3 ${th.text}`}>{s.title}</h3>
                  <p className={`${th.textSub} text-sm leading-relaxed max-w-[240px]`}>{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div className="text-center mt-14" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }}>
              <Link to="/register" className="group inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-10 py-4 rounded-2xl font-extrabold transition-all shadow-2xl shadow-teal-600/30 hover:shadow-teal-500/50 hover:-translate-y-1">
                Wypróbuj teraz – za darmo
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ══ TESTIMONIALS ══════════════════════════════════════════════════ */}
        <section className={`py-20 px-6 border-y ${th.border}`} style={{ backgroundColor: th.bgSec }}>
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${th.teal} mb-4`}>Opinie użytkowników</p>
              <h2 className={`text-3xl md:text-4xl font-black tracking-tight ${th.text}`}>Co mówią, którzy już odgrali swój budżet?</h2>
            </motion.div>
            <motion.div className="grid md:grid-cols-3 gap-5" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {[
                { name: 'Anna K.', role: 'Freelancerka', avatar: '#3b82f6', text: 'W końcu wiem, na co idą moje pieniądze. Prosta aplikacja, piękny design i zero frustracji. To jest coś dla początkujących, ale i ambitnych.', stars: 5 },
                { name: 'Michał P.', role: 'Student', avatar: '#10b981', text: 'Używam od 3 miesięcy i naprawdę kontroluję wydatki. Alerty budżetowe są genialne, a wykresy pokazują rzeczy, których wcześniej nie widziałem.', stars: 5 },
                { name: 'Kasia M.', role: 'Pracownik IT', avatar: '#8b5cf6', text: 'Szybko działa, eksport CSV jest cenny przy rozliczeniach, a interfejs przyjemny w użyciu. Chętnie polecam przynajmniej do wypróbowania.', stars: 5 },
              ].map((t) => (
                <motion.div key={t.name} variants={fadeUp} className={`rounded-[24px] p-6 border ${th.border} ${th.borderHover} transition-all`} style={{ backgroundColor: th.bgCard }}>
                  <div className="flex mb-3">
                    {Array(t.stars).fill(0).map((_, i) => <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className={`${th.textSub} text-sm leading-relaxed mb-5`}>„{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black shadow-md" style={{ backgroundColor: t.avatar }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${th.text}`}>{t.name}</p>
                      <p className={`text-xs ${th.textMuted}`}>{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══ FAQ ═══════════════════════════════════════════════════════════ */}
        <section id="faq" className="py-28 px-6">
          <div className="max-w-2xl mx-auto">
            <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${th.teal} mb-4`}>FAQ</p>
              <h2 className={`text-4xl font-black tracking-tight ${th.text}`}>Często zadawane pytania</h2>
            </motion.div>
            <motion.div
              className={`rounded-2xl border ${th.border} px-7 py-1`}
              style={{ backgroundColor: th.bgCard }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            >
              {FAQ_DATA.map(item => <FAQItem key={item.q} q={item.q} a={item.a} />)}
            </motion.div>
          </div>
        </section>

        {/* ══ NEWSLETTER ════════════════════════════════════════════════════ */}
        <section className={`py-20 px-6 border-y ${th.border}`} style={{ backgroundColor: th.bgSec }}>
          <div className="max-w-2xl mx-auto text-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-[16px] bg-teal-500/15 border border-teal-500/25 mb-5">
                <Mail size={20} className="text-teal-400" />
              </div>
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${th.teal} mb-3`}>Newsletter</p>
              <h2 className={`text-3xl md:text-4xl font-black tracking-tight mb-4 ${th.text}`}>
                Bądź na bieżąco z nowościami
              </h2>
              <p className={`${th.textSub} mb-8 max-w-sm mx-auto`}>
                Nowe funkcje, wskazówki finansowe i ekskluzywne porady — prosto na Twój e-mail.
              </p>

              {newsletterSent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-3 rounded-2xl font-semibold"
                >
                  <CheckCircle size={16} />
                  Dziękujemy! Sprawdź swoją skrzynkę mailową.
                </motion.div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="twoj@email.pl"
                    required
                    className={`flex-1 border ${th.border} rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-teal-500 ${th.text} placeholder:${th.textMuted}`}
                    style={{ backgroundColor: th.bgCard }}
                  />
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-xl font-extrabold text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-teal-600/20 whitespace-nowrap"
                  >
                    Zapisz się →
                  </button>
                </form>
              )}
              <p className={`mt-4 text-xs ${th.textMuted}`}>Bez spamu. Możesz wypisać się w każdej chwili.</p>
            </motion.div>
          </div>
        </section>

        {/* ══ CTA ═══════════════════════════════════════════════════════════ */}
        <section className="px-6 py-28">
          <motion.div
            className="max-w-4xl mx-auto relative overflow-hidden rounded-[28px] bg-gradient-to-br from-teal-600 to-indigo-700"
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.14),transparent_60%)]" />
            <div className="absolute -top-28 -right-28 w-[360px] h-[360px] rounded-full bg-white/7" />
            <div className="absolute -bottom-32 -left-24 w-[460px] h-[460px] rounded-full bg-indigo-900/35" />
            <div className="relative z-10 py-20 px-8 text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-[11px] font-semibold px-4 py-1.5 rounded-full mb-6">
                <Zap size={11} className="fill-white" /> Dołącz za darmo
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                Zacznij kontrolować<br />swoje finanse — <Shiny>teraz</Shiny>.
              </h2>
              <p className="text-blue-100/80 text-lg mb-10 max-w-md mx-auto">
                Bez karty kredytowej. Bez limitów. Rejestracja w 30 sekund.
              </p>
              <Link to="/register" className="group inline-flex items-center gap-2 bg-white text-teal-700 font-black px-10 py-4 rounded-2xl text-lg hover:bg-teal-50 transition-all shadow-2xl hover:-translate-y-1">
                Załóż darmowe konto
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="mt-5 text-teal-200/60 text-xs">Dołącz do osób, które już wybrali stabilność finansową</p>
            </div>
          </motion.div>
        </section>

        {/* ══ FOOTER ════════════════════════════════════════════════════════ */}
        <footer className={`border-t ${th.border}`} style={{ backgroundColor: th.bg }}>
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="Saving Pro" className="w-8 h-8 rounded-[10px] shadow-lg shadow-teal-500/20" />
                <div>
                  <p className={`text-sm font-black tracking-tight ${th.text}`}>
                    Saving<span className="text-teal-400">Pro</span>
                  </p>
                  <p className={`text-[10px] ${th.textFaint} mt-0.5`}>© {new Date().getFullYear()} Wszelkie prawa zastrzeżone.</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 text-xs ${th.textFaint}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Wszystkie systemy działają
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeCtx.Provider>
  )
}
