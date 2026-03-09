import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring, useInView } from 'framer-motion'
import {
  ArrowRight, BarChart2, CheckCircle, ChevronDown, Globe,
  Menu, Shield, Sparkles, Star, Target, TrendingUp,
  X, Zap, Lock, RefreshCw, Bell,
} from 'lucide-react'

/* ─────────────────────────────────────────────
   ANIMATED COUNTER (bez zmian, tylko mały polish)
───────────────────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { stiffness: 64, damping: 22 })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (inView) motionVal.set(to)
  }, [inView, to, motionVal])

  useEffect(() => {
    return spring.onChange((v) => {
      setDisplay(Math.round(v).toLocaleString('pl-PL'))
    })
  }, [spring])

  return <span ref={ref}>{display}{suffix}</span>
}

/* ─────────────────────────────────────────────
   FAKE SHINY TEXT (nowy drobny element wizualny)
───────────────────────────────────────────── */
function Shiny({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-teal-200 via-white to-teal-200 bg-clip-text text-transparent bg-[length:200%_100%] [animation:shine_5s_linear_infinite]">
      {children}
      <style>{`
        @keyframes shine { 0%{background-position:0% 0} 100%{background-position:200% 0} }
      `}</style>
    </span>
  )
}

/* ─────────────────────────────────────────────
   FAQ (bez zmian)
───────────────────────────────────────────── */
const FAQ = [
  { q: 'Czy Saving Pro jest darmowe?', a: 'Tak! Saving Pro jest w pełni darmowe. Możesz rejestrować transakcje, tworzyć budżety i śledzić cele oszczędnościowe bez żadnych opłat.' },
  { q: 'Czy moje dane są bezpieczne?', a: 'Tak. Wszystkie dane są szyfrowane (SSL/TLS) i przechowywane na bezpiecznych serwerach. Nigdy nie udostępniamy ich osobom trzecim.' },
  { q: 'Czy mogę używać aplikacji w kilku walutach?', a: 'Aktualnie możesz wybrać jedną walutę domyślną (PLN, EUR, USD, GBP, CHF). Obsługa wielu walut jednocześnie jest planowana w kolejnych wersjach.' },
  { q: 'Jak dodać transakcję?', a: 'Przejdź do zakładki „Transakcje" i kliknij przycisk „+ Nowa transakcja". Wypełnij formularz z kwotą, kategorią i datą.' },
  { q: 'Czy mogę eksportować dane?', a: 'Tak – eksport do CSV jest dostępny bezpośrednio ze strony Raporty. Eksport PDF planujemy w kolejnej wersji.' },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/6 last:border-0">
      <button onClick={() => setOpen(o => !o)} className="w-full text-left py-5 flex justify-between items-center gap-4 group">
        <span className="font-medium text-slate-200 group-hover:text-white transition-colors text-[15px] leading-snug">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.24, ease: 'easeInOut' }}>
          <ChevronDown size={17} className="text-slate-500 shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
            <p className="pb-5 text-slate-400 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────────
   NAVBAR (lepszy design + subtelny gradient)
───────────────────────────────────────────── */
const navLinks = [
  { label: 'Możliwości', href: '#features' },
  { label: 'Jak działa', href: '#how' },
  { label: 'FAQ', href: '#faq' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#030712]/90 backdrop-blur-2xl border-b border-white/6' : ''}`}>
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-[70px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 select-none">
          <img src="/logo.png" alt="Saving Pro" className="w-10 h-10 rounded-[12px] shadow-lg shadow-teal-500/30" />
          <span className="text-[15px] font-black tracking-tight text-white">
            Saving<span className="text-teal-400">Pro</span>
          </span>
        </Link>

        {/* Center links */}
        <ul className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(l => (
            <li key={l.href}>
              <a href={l.href} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/6 rounded-xl transition-all duration-200">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white px-4 py-2 rounded-xl transition-colors duration-200">
            Zaloguj się
          </Link>
          <Link to="/register" className="group inline-flex items-center gap-2 bg-white text-[#030712] text-sm font-extrabold px-6 py-3 rounded-2xl transition-all hover:bg-teal-50 shadow-xl shadow-black/20 hover:-translate-y-0.5">
            Zacznij za darmo
            <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Burger */}
        <button onClick={() => setOpen(o => !o)} className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-white/6 transition-all" aria-label="Menu">
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
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="md:hidden overflow-hidden bg-[#030712]/98 backdrop-blur-2xl border-b border-white/6">
            <div className="max-w-7xl mx-auto px-5 py-3 flex flex-col gap-1">
              {navLinks.map((l, i) => (
                <motion.a key={l.href} href={l.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} onClick={() => setOpen(false)} className="px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/6 rounded-xl transition-all">
                  {l.label}
                </motion.a>
              ))}
              <div className="h-px bg-white/6 my-1" />
              <Link to="/login" onClick={() => setOpen(false)} className="px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/6 rounded-xl transition-all">Zaloguj się</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="mt-1 flex items-center justify-center gap-2 bg-white text-[#030712] font-extrabold py-3.5 rounded-xl text-sm">
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
   DASHBOARD MOCKUP (bardziej „produkcyjny” design)
───────────────────────────────────────────── */
function DashboardMockup() {
  const bars = [55, 80, 45, 90, 60, 75, 50, 85, 65, 95, 70, 88]
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* glow z gradientem */}
      <div className="absolute -inset-6 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.25),transparent_60%)] blur-[80px] rounded-[40px]" />
      <div className="relative rounded-[26px] overflow-hidden border border-white/8 bg-[#0f1629] shadow-[0_30px_120px_rgba(0,0,0,0.5)]">
        {/* window bar */}
        <div className="px-4 py-3 flex items-center gap-2 bg-[#111827]/95 border-b border-white/6 backdrop-blur">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          <div className="flex-1 mx-3 bg-white/6 rounded-md px-3 py-1 text-[11px] text-slate-500 text-center tracking-wide">
            app.savingpro.pl/dashboard
          </div>
          <div className="w-14 h-5 rounded bg-white/6" />
        </div>

        {/* sidebar + content */}
        <div className="flex">
          {/* sidebar */}
          <div className="hidden sm:flex flex-col gap-2 w-[54px] bg-[#0a0f1e] border-r border-white/6 py-4 px-2.5 items-center">
            {[
              { c: '#14b8a6', a: true },
              { c: '#22c55e', a: false },
              { c: '#a855f7', a: false },
              { c: '#f59e0b', a: false },
              { c: '#ef4444', a: false },
            ].map((s, i) => (
              <div key={i} className={`w-7 h-7 rounded-[12px] ${s.a ? 'opacity-100' : 'opacity-25'} group relative`} style={{ backgroundColor: s.c + '22', border: `1px solid ${s.c}44` }}>
                <div className="w-full h-full rounded-[12px]" style={{ backgroundColor: s.a ? s.c : 'transparent' }} />
                <span className="absolute inset-0 rounded-[12px] bg-white/0 group-hover:bg-white/6 transition-colors" />
              </div>
            ))}
          </div>

          {/* main content */}
          <div className="flex-1 p-5">
            {/* top row */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[11px] text-slate-500 mb-1">Dzień dobry, Krzysztof 👋</div>
                <div className="text-white font-extrabold text-lg">Przegląd finansów</div>
              </div>
              <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-300 text-[11px] px-3 py-1.5 rounded-full font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Na bieżąco
              </div>
            </div>

            {/* stat cards */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Saldo', val: '12 450', unit: 'zł', color: '#14b8a6', icon: '↑', trend: '+8%' },
                { label: 'Wydatki', val: '3 200', unit: 'zł', color: '#ef4444', icon: '↓', trend: '-5%' },
                { label: 'Oszczędności', val: '9 250', unit: 'zł', color: '#22c55e', icon: '↑', trend: '+12%' },
              ].map((c) => (
                <div key={c.label} className="bg-[#1a2035] rounded-[16px] p-3.5 border border-white/6 hover:border-white/10 transition-colors">
                  <p className="text-[10px] text-slate-500 mb-2 font-semibold uppercase tracking-wide">{c.label}</p>
                  <p className="text-white font-black text-base">{c.val} <span className="text-xs font-medium text-slate-400">{c.unit}</span></p>
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-[10px] font-semibold" style={{ color: c.color }}>{c.icon} {c.trend}</span>
                    <span className="text-[10px] text-slate-600">vs popr.</span>
                  </div>
                </div>
              ))}
            </div>

            {/* chart */}
            <div className="bg-[#1a2035] rounded-[16px] p-4 border border-white/6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-slate-300">Przychody vs wydatki</p>
                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-teal-500 inline-block" />Przychody</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-400/60 inline-block" />Wydatki</span>
                </div>
              </div>
              <div className="flex items-end gap-1.5 h-[78px]">
                {bars.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col-reverse gap-0.5">
                    <motion.div
                      className="w-full rounded-sm bg-teal-500/90"
                      initial={{ height: 0 }}
                      animate={{ height: `${h * 0.62}%` }}
                      transition={{ duration: 0.55, delay: 0.9 + i * 0.035, ease: 'easeOut' }}
                    />
                    <motion.div
                      className="w-full rounded-sm bg-red-400/40"
                      initial={{ height: 0 }}
                      animate={{ height: `${(100 - h) * 0.38}%` }}
                      transition={{ duration: 0.55, delay: 0.95 + i * 0.035, ease: 'easeOut' }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                {['Sty','Lut','Mar','Kwi','Maj','Cze','Lip','Sie','Wrz','Paź','Lis','Gru'].map(m => (
                  <span key={m} className="text-[8px] text-slate-600 text-center flex-1">{m}</span>
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
   LANDING PAGE (bardziej modny, z ładniejszymi warstwami)
───────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } }),
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">
      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-[70px] pb-0 px-6 overflow-hidden">
        {/* tło */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[1100px] h-[780px] rounded-full bg-teal-600/16 blur-[140px]" />
          <div className="absolute top-[28%] right-[-8%] w-[560px] h-[560px] rounded-full bg-cyan-600/10 blur-[130px]" />
          <div className="absolute bottom-[-10%] left-[12%] w-[420px] h-[320px] rounded-full bg-teal-900/25 blur-[110px]" />
        </div>
        {/* siatka + spadek */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.6]" />
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-72 bg-gradient-to-t from-[#030712] to-transparent z-10" />
        {/* subtelny radial accent */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center_top,rgba(255,255,255,0.06),transparent_55%)]" />

        <div className="relative z-[5] w-full max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible"
            className="inline-flex items-center gap-2 text-teal-300 text-[11px] font-semibold px-4 py-2 rounded-full mb-8 border border-teal-500/25 bg-teal-500/8 backdrop-blur"
          >
            <Sparkles size={11} className="fill-teal-300" />
            100% darmowe · bez karty kredytowej · <Shiny>od zaraz</Shiny>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="visible"
            className="text-5xl sm:text-6xl md:text-[84px] font-black leading-[1.02] tracking-[-2px] mb-7"
          >
            Ogarnij swoje finanse,
            <br />
            <span className="bg-gradient-to-r from-teal-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              intuicyjnie.
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible"
            className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Śledź przychody i wydatki, działaj według budżetów i realizuj cele oszczędnościowe.<br className="hidden md:block" />
            Prosto, przejrzyście i z finezyjnym designem.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible"
            className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-16"
          >
            <Link to="/register"
              className="group flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-9 py-4 rounded-2xl text-base font-extrabold transition-all shadow-2xl shadow-teal-600/30 hover:shadow-teal-500/50 hover:-translate-y-1"
            >
              Zacznij za darmo
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login"
              className="flex items-center gap-2 text-slate-400 hover:text-white px-9 py-4 rounded-2xl text-base font-medium border border-white/10 hover:border-white/25 hover:bg-white/6 transition-all"
            >
              Mam już konto
            </Link>
          </motion.div>

          {/* Dashboard */}
          <DashboardMockup />
        </div>
      </section>

      {/* ══ STATS ═════════════════════════════════════════════════════════ */}
      <section className="py-20 border-y border-white/6 bg-[#030712] relative">
        {/* subtelny szkicowy gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#14b8a60a_1px,transparent_1px)] bg-[size:120px_120px]" />
        <div className="max-w-5xl mx-auto px-6 relative">
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
            {[
              { val: 0, suffix: '% opłat', label: 'Całkowicie darmowe', color: 'text-yellow-400' },
              { val: 3, suffix: ' języki', label: 'PL, EN, DE', color: 'text-teal-400' },
              { val: 100, suffix: '%', label: 'Bezpieczeństwo SSL', color: 'text-green-400' },
              { val: 0, suffix: ' limitów', label: 'Nieograniczone transakcje', color: 'text-purple-400' },
            ].map((s) => (
              <motion.div key={s.label} variants={fadeUp} className="flex flex-col items-center gap-2">
                <p className={`text-3xl md:text-[40px] font-black ${s.color}`}>
                  <Counter to={s.val} suffix={s.suffix} />
                </p>
                <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ FEATURES ══════════════════════════════════════════════════════ */}
      <section id="features" className="py-28 px-6 relative">
        {/* lekkie tło z błękitnymi szkłami */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.07),transparent_60%)]" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div className="text-center mb-16" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400 mb-4">Możliwości</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
              Wszystko w jednym miejscu — <Shiny>elegancko</Shiny>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-[17px] leading-relaxed">
              Minimalny design, zero zbędnych opcji. Wszystko skoncentrowane na tym, żebyś kontrolował finanse bez wysiłku.
            </p>
          </motion.div>

          <motion.div className="grid md:grid-cols-3 gap-5" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
            {[
              {
                icon: <TrendingUp size={22} />,
                gradient: 'from-teal-500 to-teal-700',
                glow: 'rgba(20,184,166,0.18)',
                title: 'Śledzenie wydatków',
                tag: 'Najpopularniejsze',
                desc: 'Każda transakcja pod kontrolą. Kategorie, filtry i historia, które prowadzą cię do lepszych decyzji.',
                features: ['Własne kategorie', 'Historia do przodu i do tyłu', 'Wyszukiwarka i filtry'],
              },
              {
                icon: <Target size={22} />,
                gradient: 'from-emerald-500 to-green-600',
                glow: 'rgba(16,185,129,0.18)',
                title: 'Budżety i cele',
                tag: 'Motywujące',
                desc: 'Ustaw limity miesięczne i cele oszczędnościowe. Otrzymuj jasne alerty zanim wpadasz w zadłużenie.',
                features: ['Limity na miesiąc', 'Cele progresowe', 'Alerty przed przekroczeniem'],
              },
              {
                icon: <BarChart2 size={22} />,
                gradient: 'from-purple-500 to-violet-600',
                glow: 'rgba(139,92,246,0.18)',
                title: 'Raporty i wykresy',
                tag: 'Nowe',
                desc: 'Interaktywny podgląd trendów w wybranym okresie, z eksportem CSV po jednym kliknięciu.',
                features: ['Miesięczne i kwartalne wykresy', 'Eksport do CSV', 'Porównanie okresów'],
              },
            ].map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="group relative bg-[#0f1629] border border-white/6 rounded-[24px] p-7 hover:border-white/10 transition-all duration-500 overflow-hidden"
                whileHover={{ y: -5, boxShadow: `0 26px 90px ${f.glow}` }}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${f.gradient}`} style={{ opacity: 0 }} />
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-[16px] bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg relative overflow-hidden`}>
                    <span className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent" />
                    {f.icon}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-base font-bold text-white">{f.title}</h3>
                    <span className="text-[10px] font-semibold text-slate-300 bg-white/6 px-2.5 py-0.5 rounded-full border border-white/8">{f.tag}</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{f.desc}</p>
                  <ul className="flex flex-col gap-2.5">
                    {f.features.map(item => (
                      <li key={item} className="flex items-center gap-2.5 text-xs text-slate-400">
                        <CheckCircle size={13} className="text-green-400 shrink-0" />
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
      <section className="py-12 border-y border-white/6 bg-[#080d1a]">
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
              <motion.div key={text} variants={fadeUp} className={`flex items-center gap-2 text-sm font-medium text-slate-400 ${color}`}>
                <span className={color}>{icon}</span>
                <span className="text-slate-400">{text}</span>
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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400 mb-4">Jak to działa</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">Gotowy w <Shiny>3 minuty</Shiny></h2>
            <p className="text-slate-400 text-[17px]">Zero konfiguracji. Zero karty kredytowej. Po prostu zacznij i kontroluj.</p>
          </motion.div>

          <motion.div className="grid md:grid-cols-3 gap-8 relative" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
            {/* connector */}
            <div className="hidden md:block absolute top-[42px] left-[calc(33%+12px)] right-[calc(33%+12px)] h-px bg-gradient-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0" />

            {[
              { n: '01', title: 'Załóż konto', desc: 'Imię, e-mail i hasło. Rejestracja trwa blinkiem oka, nie proś o niepotrzebne rzeczy.', color: 'from-teal-500 to-teal-700', border: 'border-teal-500/25', glow: 'rgba(20,184,166,0.18)' },
              { n: '02', title: 'Dodaj transakcje', desc: 'Stwórz własne kategorie i zacznij rejestrować, żeby mieć faktyczny obraz swoich finansów.', color: 'from-green-400 to-emerald-600', border: 'border-green-500/25', glow: 'rgba(16,185,129,0.18)' },
              { n: '03', title: 'Realizuj cele', desc: 'Budżety i cele na żywo, inspeksja wykresów oraz dążenie do stabilności każdego miesiąca.', color: 'from-purple-500 to-violet-600', border: 'border-purple-500/25', glow: 'rgba(139,92,246,0.18)' },
            ].map((s) => (
              <motion.div key={s.n} variants={fadeUp} className="flex flex-col items-center text-center group">
                <div className={`relative w-[80px] h-[80px] rounded-[24px] bg-gradient-to-br ${s.color} text-white text-2xl font-black flex items-center justify-center mb-6 shadow-2xl border ${s.border} group-hover:-translate-y-1.5 transition-transform duration-300 overflow-hidden`}>
                  <span className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent" />
                  {s.n}
                </div>
                <h3 className="text-lg font-bold mb-3 text-white">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-[240px]">{s.desc}</p>
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
      <section className="py-20 px-6 bg-[#080d1a] border-y border-white/6">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400 mb-4">Opinie użytkowników</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Co mówią, którzy już odgrali swój budżet?</h2>
          </motion.div>
          <motion.div className="grid md:grid-cols-3 gap-5" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {[
              { name: 'Anna K.', role: 'Freelancerka', avatar: '#3b82f6', text: 'W końcu wiem, na co idą moje pieniądze. Prosta aplikacja, piękny design i zero frustracji. To jest coś dla początkujących, ale i ambitnych.', stars: 5 },
              { name: 'Michał P.', role: 'Student', avatar: '#10b981', text: 'Używam od 3 miesięcy i naprawdę kontroluję wydatki. Alerty budżetowe są genialne, a wykresy pokazują rzeczy, których wcześniej nie widziałem.', stars: 5 },
              { name: 'Kasia M.', role: 'Pracownik IT', avatar: '#8b5cf6', text: 'Szybko działa, eksport CSV jest cenny przy rozliczeniach, a interfejs przyjemny w użyciu. Chętnie polecam przynajmniej do wypróbowania.', stars: 5 },
            ].map((t) => (
              <motion.div key={t.name} variants={fadeUp} className="bg-[#0f1629] rounded-[24px] p-6 border border-white/6 hover:border-white/10 transition-all">
                <div className="flex mb-3">
                  {Array(t.stars).fill(0).map((_, i) => <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">„{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black shadow-md" style={{ backgroundColor: t.avatar }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400 mb-4">FAQ</p>
            <h2 className="text-4xl font-black tracking-tight">Często zadawane pytania</h2>
          </motion.div>
          <motion.div className="bg-[#0f1629] rounded-2xl border border-white/6 px-7 py-1" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            {FAQ.map(item => <FAQItem key={item.q} q={item.q} a={item.a} />)}
          </motion.div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════════════════ */}
      <section className="px-6 pb-28">
        <motion.div
          className="max-w-4xl mx-auto relative overflow-hidden rounded-[28px] bg-gradient-to-br from-teal-600 to-indigo-700"
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          {/* finezja */}
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
      <footer className="border-t border-white/6 bg-[#030712]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Saving Pro" className="w-8 h-8 rounded-[10px] shadow-lg shadow-teal-500/20" />
              <div>
                <p className="text-sm font-black tracking-tight text-white">
                  Saving<span className="text-teal-400">Pro</span>
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5">© {new Date().getFullYear()} Wszelkie prawa zastrzeżone.</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#features" className="hover:text-slate-200 transition-colors">Możliwości</a>
              <a href="#faq" className="hover:text-slate-200 transition-colors">FAQ</a>
              <Link to="/login" className="hover:text-slate-200 transition-colors">Logowanie</Link>
              <Link to="/register" className="hover:text-slate-200 transition-colors">Rejestracja</Link>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Wszystkie systemy działają
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
