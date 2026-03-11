import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ArrowLeftRight, Tag, Target, BarChart2,
  Settings, ChevronRight, ChevronLeft, Check, Play,
  TrendingUp, TrendingDown, PiggyBank, FileText, Bell, Lock
} from 'lucide-react'

const STEPS = [
  {
    id: 1,
    icon: <LayoutDashboard size={32} className="text-teal-500" />,
    color: 'teal',
    title: 'Panel główny',
    subtitle: 'Twój finansowy cockpit',
    description: 'Dashboard pokazuje Ci najważniejsze informacje na jeden rzut oka: bilans konta, przychody i wydatki bieżącego miesiąca, aktywne cele oszczędnościowe oraz ostatnie transakcje.',
    tips: [
      { icon: <TrendingUp size={14} />, text: 'Wykres porównuje przychody z wydatkami w czasie' },
      { icon: <PiggyBank size={14} />, text: 'Widzisz postęp swoich celów oszczędnościowych' },
      { icon: <Target size={14} />, text: 'Budżety wyświetlają alert gdy zbliżasz się do limitu' },
    ],
  },
  {
    id: 2,
    icon: <ArrowLeftRight size={32} className="text-indigo-500" />,
    color: 'indigo',
    title: 'Transakcje',
    subtitle: 'Rejestruj każdy wydatek i przychód',
    description: 'Dodawaj transakcje w kilka sekund. Wybierz gotową kategorię z emoji, wpisz kwotę i datę. Możesz filtrować, wyszukiwać i paginować historię.',
    tips: [
      { icon: <TrendingDown size={14} />, text: 'Wydatki i przychody — przełączaj jednym kliknięciem' },
      { icon: <Tag size={14} />, text: 'Preset kategorii z emoji przyspiesza dodawanie' },
      { icon: <FileText size={14} />, text: 'Opcjonalny opis do każdej transakcji' },
    ],
  },
  {
    id: 3,
    icon: <Tag size={32} className="text-amber-500" />,
    color: 'amber',
    title: 'Kategorie',
    subtitle: 'Organizuj swoje finanse',
    description: 'Twórz własne kategorie wydatków i przychodów z wybranym kolorem i ikoną. Kategorie pomagają w analizie — gdzie idą Twoje pieniądze?',
    tips: [
      { icon: <Tag size={14} />, text: 'Osobne kategorie dla wydatków i przychodów' },
      { icon: <BarChart2 size={14} />, text: 'Wykres kołowy w raportach bazuje na kategoriach' },
      { icon: <Check size={14} />, text: 'Edytuj i usuwaj kategorie w dowolnym momencie' },
    ],
  },
  {
    id: 4,
    icon: <Target size={32} className="text-green-500" />,
    color: 'green',
    title: 'Budżety i cele',
    subtitle: 'Planuj i osiągaj',
    description: 'Ustaw miesięczny limit wydatków (budżet) lub cel oszczędnościowy z terminem. Wpłacaj środki na cel i śledź postęp na pasku. Aplikacja powiadomi gdy zbliżasz się do limitu budżetu.',
    tips: [
      { icon: <TrendingDown size={14} />, text: 'Budżet śledzi wydatki w wybranej kategorii' },
      { icon: <PiggyBank size={14} />, text: 'Cel — odkładaj dowolne kwoty i śledź postęp' },
      { icon: <Bell size={14} />, text: 'Alert gdy osiągniesz 80% limitu budżetu' },
    ],
  },
  {
    id: 5,
    icon: <BarChart2 size={32} className="text-purple-500" />,
    color: 'purple',
    title: 'Raporty',
    subtitle: 'Analizuj i eksportuj',
    description: 'Przeglądaj wykresy słupkowe miesięcznych wydatków i przychodów, wykres kołowy kategorii oraz wskaźnik oszczędności. Eksportuj dane do CSV.',
    tips: [
      { icon: <BarChart2 size={14} />, text: 'Wybierz okres: 3, 6 lub 12 miesięcy' },
      { icon: <FileText size={14} />, text: 'Eksport CSV — otwórz w Excelu lub Google Sheets' },
      { icon: <TrendingUp size={14} />, text: 'Top 5 kategorii wydatków w bieżącym miesiącu' },
    ],
  },
  {
    id: 6,
    icon: <Settings size={32} className="text-slate-500" />,
    color: 'slate',
    title: 'Ustawienia i profil',
    subtitle: 'Dostosuj do siebie',
    description: 'Zmień motyw (jasny/ciemny), język (PL/EN/DE), walutę (PLN/EUR/USD/GBP/CHF), włącz powiadomienia i zarządzaj kontem. W profilu możesz zmienić hasło.',
    tips: [
      { icon: <Lock size={14} />, text: 'Zmiana hasła bezpośrednio w profilu' },
      { icon: <Bell size={14} />, text: 'Powiadomienia o budżetach i celach' },
      { icon: <Settings size={14} />, text: 'Usunięcie konta usuwa wszystkie dane permanentnie' },
    ],
  },
]

const colorMap: Record<string, string> = {
  teal: 'from-teal-500/20 to-teal-500/5 border-teal-500/20 dark:border-teal-500/30',
  indigo: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 dark:border-indigo-500/30',
  amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 dark:border-amber-500/30',
  green: 'from-green-500/20 to-green-500/5 border-green-500/20 dark:border-green-500/30',
  purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/20 dark:border-purple-500/30',
  slate: 'from-slate-500/20 to-slate-500/5 border-slate-500/20 dark:border-slate-500/30',
}

const dotMap: Record<string, string> = {
  teal: 'bg-teal-500',
  indigo: 'bg-indigo-500',
  amber: 'bg-amber-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  slate: 'bg-slate-400',
}

export default function Tutorial() {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div>
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1629]">
        <h1 className="text-2xl font-bold dark:text-white">Tutorial</h1>
        <p className="text-slate-500 text-sm mt-1">Poznaj wszystkie funkcje aplikacji</p>
      </div>

      <div className="p-6 max-w-2xl">
        {/* Progress dots */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              className={`transition-all duration-200 rounded-full ${i === step ? `w-6 h-2.5 ${dotMap[current.color]}` : 'w-2.5 h-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
            />
          ))}
          <span className="ml-2 text-xs text-slate-400">{step + 1} / {STEPS.length}</span>
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className={`bg-gradient-to-br ${colorMap[current.color]} border rounded-2xl p-8 mb-6`}
          >
            <div className="flex items-start gap-5">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex-shrink-0">
                {current.icon}
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                  Krok {current.id} z {STEPS.length}
                </p>
                <h2 className="text-xl font-bold dark:text-white mb-0.5">{current.title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{current.subtitle}</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                  {current.description}
                </p>
                <ul className="space-y-2.5">
                  {current.tips.map((tip, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                      <span className="text-slate-400 dark:text-slate-500 flex-shrink-0">{tip.icon}</span>
                      {tip.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} /> Wstecz
          </button>

          {isLast ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              <Play size={15} /> Zacznij używać
            </button>
          ) : (
            <button
              onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
                current.color === 'teal' ? 'bg-teal-600 hover:bg-teal-700' :
                current.color === 'indigo' ? 'bg-indigo-600 hover:bg-indigo-700' :
                current.color === 'amber' ? 'bg-amber-500 hover:bg-amber-600' :
                current.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                current.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                'bg-slate-600 hover:bg-slate-700'
              }`}
            >
              Dalej <ChevronRight size={16} />
            </button>
          )}
        </div>

        {/* All steps overview */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              className={`p-3 rounded-xl border text-left transition-all ${
                i === step
                  ? 'border-teal-500/50 bg-teal-50 dark:bg-teal-500/10'
                  : i < step
                  ? 'border-green-200 dark:border-green-500/20 bg-green-50 dark:bg-green-500/5'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1629] hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">#{s.id}</span>
                {i < step && <Check size={12} className="text-green-500" />}
                {i === step && <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
              </div>
              <p className="text-xs font-semibold dark:text-white">{s.title}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
