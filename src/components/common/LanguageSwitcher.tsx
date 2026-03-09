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
        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
      >
        <Globe size={18} />
        <span>{current.name}</span>
        <span className="ml-auto text-xs text-slate-500">{current.label}</span>
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-1 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden z-50">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => change(l.code)}
              className={`flex items-center justify-between w-full px-3 py-2 text-sm transition-colors ${
                l.code === current.code
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span>{l.name}</span>
              <span className="text-xs opacity-70">{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
