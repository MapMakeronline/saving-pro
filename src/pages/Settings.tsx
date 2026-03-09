import { useState, useEffect } from 'react'
import { Palette, Globe, DollarSign, Bell, Shield, Trash2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import { authService } from '../services/authService'
import ThemeToggle from '../components/common/ThemeToggle'
import { useNavigate } from 'react-router-dom'

const CURRENCIES = [
  { code: 'PLN', label: 'Polski złoty (PLN)' },
  { code: 'EUR', label: 'Euro (EUR)' },
  { code: 'USD', label: 'Dolar amerykański (USD)' },
  { code: 'GBP', label: 'Funt brytyjski (GBP)' },
  { code: 'CHF', label: 'Frank szwajcarski (CHF)' },
]

const LANGUAGES = [
  { code: 'pl', label: '🇵🇱 Polski' },
  { code: 'en', label: '🇬🇧 English' },
  { code: 'de', label: '🇩🇪 Deutsch' },
]

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
      <h2 className="font-semibold dark:text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {icon} {title}
      </h2>
      {children}
    </div>
  )
}

export default function Settings() {
  const { user, fetchProfile, logout } = useAuthStore()
  const toast = useToastStore()
  const navigate = useNavigate()

  const [currency, setCurrency] = useState(user?.currency || 'PLN')
  const [language, setLanguage] = useState(user?.language || 'pl')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setCurrency(user.currency || 'PLN')
      setLanguage(user.language || 'pl')
    }
  }, [user])

  const savePreferences = async () => {
    setSaving(true)
    try {
      await authService.updateProfile({ currency, language })
      await fetchProfile()
      toast.success('Ustawienia zapisane!')
    } catch {
      toast.error('Nie udało się zapisać ustawień.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = () => {
    toast.info('Usuwanie konta — funkcja wkrótce dostępna')
  }

  const selectClass = 'w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <div>
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <h1 className="text-2xl font-bold dark:text-white">Ustawienia</h1>
        <p className="text-slate-500 text-sm mt-1">Dostosuj aplikację do swoich potrzeb</p>
      </div>

      <div className="p-6 max-w-2xl space-y-5">

        {/* Wygląd */}
        <Section icon={<Palette size={16} />} title="Wygląd">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium dark:text-white">Motyw</p>
              <p className="text-xs text-slate-500 mt-0.5">Jasny lub ciemny interfejs</p>
            </div>
            <div className="w-40">
              <ThemeToggle />
            </div>
          </div>
        </Section>

        {/* Język i waluta */}
        <Section icon={<Globe size={16} />} title="Język i waluta">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-slate-300 flex items-center gap-1">
                <Globe size={13} /> Język aplikacji
              </label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className={selectClass}>
                {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-slate-300 flex items-center gap-1">
                <DollarSign size={13} /> Domyślna waluta
              </label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={selectClass}>
                {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
            </div>
            <button
              onClick={savePreferences}
              disabled={saving}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
            >
              {saving ? 'Zapisywanie...' : 'Zapisz'}
            </button>
          </div>
        </Section>

        {/* Powiadomienia */}
        <Section icon={<Bell size={16} />} title="Powiadomienia">
          <div className="space-y-3">
            {[
              { label: 'Przekroczenie budżetu', desc: 'Powiadom gdy wydatki przekroczą limit' },
              { label: 'Cel oszczędnościowy osiągnięty', desc: 'Świętuj razem z nami!' },
              { label: 'Tygodniowe podsumowanie', desc: 'Raport wydatków co tydzień' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div>
                  <p className="text-sm font-medium dark:text-white">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <button
                  onClick={() => toast.info('Powiadomienia — wkrótce dostępne')}
                  className="text-xs px-3 py-1 rounded-full border border-slate-300 dark:border-slate-600 text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  Wkrótce
                </button>
              </div>
            ))}
          </div>
        </Section>

        {/* Bezpieczeństwo / konto */}
        <Section icon={<Shield size={16} />} title="Konto i bezpieczeństwo">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium dark:text-white">Wyloguj się ze wszystkich urządzeń</p>
                <p className="text-xs text-slate-500">Unieważni wszystkie aktywne sesje</p>
              </div>
              <button
                onClick={() => { logout(); navigate('/login') }}
                className="text-sm px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Wyloguj
              </button>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-700">
              <div>
                <p className="text-sm font-medium text-red-600">Usuń konto</p>
                <p className="text-xs text-slate-500">Permanentnie usuwa wszystkie dane</p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="text-sm px-4 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1"
              >
                <Trash2 size={13} /> Usuń
              </button>
            </div>
          </div>
        </Section>
      </div>
    </div>
  )
}
