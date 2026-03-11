import { useState, useEffect } from 'react'
import { Palette, Globe, DollarSign, Bell, Shield, Trash2, AlertTriangle, X } from 'lucide-react'
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

const NOTIFICATION_ITEMS = [
  { key: 'budgetExceeded', label: 'Przekroczenie budżetu', desc: 'Powiadom gdy wydatki przekroczą limit' },
  { key: 'goalReached', label: 'Cel oszczędnościowy osiągnięty', desc: 'Świętuj razem z nami!' },
  { key: 'weeklySummary', label: 'Tygodniowe podsumowanie', desc: 'Raport wydatków co tydzień' },
]

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#0f1629] rounded-2xl p-6 shadow-sm dark:shadow-none">
      <h2 className="font-semibold dark:text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {icon} {title}
      </h2>
      {children}
    </div>
  )
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${enabled ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

export default function Settings() {
  const { user, fetchProfile, logout } = useAuthStore()
  const toast = useToastStore()
  const navigate = useNavigate()

  const [currency, setCurrency] = useState(user?.currency || 'PLN')
  const [language, setLanguage] = useState(user?.language || 'pl')
  const [saving, setSaving] = useState(false)
  const [notifications, setNotifications] = useState<Record<string, boolean>>({})
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (user) {
      setCurrency(user.currency || 'PLN')
      setLanguage(user.language || 'pl')
    }
  }, [user])

  useEffect(() => {
    authService.getNotifications().then(setNotifications).catch(() => {})
  }, [])

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

  const toggleNotification = async (key: string, value: boolean) => {
    // Request browser permission when enabling any notification
    if (value && 'Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        toast.info('Musisz zezwolić na powiadomienia w przeglądarce.')
        return
      }
    }
    const updated = { ...notifications, [key]: value }
    setNotifications(updated)
    try {
      await authService.updateNotifications(updated)
      toast.success(value ? 'Powiadomienie włączone' : 'Powiadomienie wyłączone')
    } catch {
      setNotifications({ ...notifications })
      toast.error('Nie udało się zaktualizować powiadomień.')
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'USUŃ') return
    setDeleting(true)
    try {
      await authService.deleteAccount()
      toast.success('Konto zostało usunięte.')
      navigate('/')
    } catch (err: any) {
      const code = err?.code || ''
      if (code === 'auth/requires-recent-login') {
        toast.error('Wyloguj się i zaloguj ponownie, aby usunąć konto.')
      } else {
        toast.error('Nie udało się usunąć konta. Spróbuj ponownie.')
      }
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const selectClass = 'w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500'

  return (
    <div>
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1629]">
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
              className="bg-teal-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50 transition-colors font-medium"
            >
              {saving ? 'Zapisywanie...' : 'Zapisz'}
            </button>
          </div>
        </Section>

        {/* Powiadomienia */}
        <Section icon={<Bell size={16} />} title="Powiadomienia">
          <div className="space-y-1">
            {NOTIFICATION_ITEMS.map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                <div>
                  <p className="text-sm font-medium dark:text-white">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <Toggle
                  enabled={!!notifications[item.key]}
                  onChange={(v) => toggleNotification(item.key, v)}
                />
              </div>
            ))}
            {'Notification' in window && Notification.permission === 'denied' && (
              <p className="text-xs text-amber-500 mt-2 flex items-center gap-1">
                <AlertTriangle size={12} /> Powiadomienia zablokowane w przeglądarce. Odblokuj je w ustawieniach.
              </p>
            )}
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
                onClick={() => setShowDeleteModal(true)}
                className="text-sm px-4 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-1"
              >
                <Trash2 size={13} /> Usuń
              </button>
            </div>
          </div>
        </Section>
      </div>

      {/* Delete account modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1629] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <h2 className="text-lg font-bold dark:text-white">Usuń konto</h2>
              </div>
              <button onClick={() => { setShowDeleteModal(false); setDeleteConfirmText('') }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Ta operacja jest <strong>nieodwracalna</strong>. Wszystkie Twoje dane zostaną permanentnie usunięte: transakcje, kategorie, budżety i cele oszczędnościowe.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 dark:text-slate-300">
                Wpisz <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded text-red-600">USUŃ</span> aby potwierdzić
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="USUŃ"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteConfirmText('') }}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'USUŃ' || deleting}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={14} />
                {deleting ? 'Usuwanie...' : 'Usuń konto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
