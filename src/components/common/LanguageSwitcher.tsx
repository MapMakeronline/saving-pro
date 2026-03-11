import { useState } from 'react'
import { Globe } from 'lucide-react'
import i18n from 'i18next'

const languages = [
  { code: 'pl', label: 'PL', name: 'Polski' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
]

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const current = languages.find((l) => l.code === i18n.language) ?? languages[0]

  const change = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('language', code)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all"
      >
        <Globe size={17} />
        <span>{current.name}</span>
        <span className="ml-auto text-xs text-slate-400">{current.label}</span>
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-1 w-full bg-white dark:bg-[#0f1629] border border-slate-200 dark:border-white/8 rounded-xl shadow-lg overflow-hidden z-50">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => change(l.code)}
              className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium transition-colors ${
                l.code === current.code
                  ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{l.name}</span>
              <span className="text-xs opacity-60">{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
