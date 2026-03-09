import { useState, useEffect } from 'react'
import { User, Mail, Globe, DollarSign, Lock, Save } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import { authService } from '../services/authService'

const CURRENCIES = ['PLN', 'EUR', 'USD', 'GBP', 'CHF']
const LANGUAGES = [
  { code: 'pl', label: 'Polski' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
]

export default function Profile() {
  const { user, fetchProfile } = useAuthStore()
  const toast = useToastStore()

  const [form, setForm] = useState({ name: '', currency: 'PLN', language: 'pl' })
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, currency: user.currency || 'PLN', language: user.language || 'pl' })
    } else {
      fetchProfile()
    }
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await authService.updateProfile({ name: form.name, currency: form.currency, language: form.language })
      await fetchProfile()
      toast.success('Profil zaktualizowany!')
    } catch {
      toast.error('Nie udało się zapisać profilu.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <div>
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <h1 className="text-2xl font-bold dark:text-white">Profil</h1>
        <p className="text-slate-500 text-sm mt-1">Zarządzaj swoim kontem</p>
      </div>

      <div className="p-6 max-w-2xl space-y-6">
        {/* Avatar / info */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-lg font-semibold dark:text-white">{user?.name || '—'}</p>
            <p className="text-sm text-slate-500 flex items-center gap-1"><Mail size={13} />{user?.email || '—'}</p>
            <p className="text-xs text-slate-400 mt-1">
              Konto od: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pl-PL') : '—'}
            </p>
          </div>
        </div>

        {/* Edit form */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="font-semibold dark:text-white mb-4 flex items-center gap-2"><User size={16} /> Dane konta</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-slate-300">Imię i nazwisko</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300 flex items-center gap-1"><DollarSign size={13} /> Waluta</label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className={inputClass}
                >
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300 flex items-center gap-1"><Globe size={13} /> Język</label>
                <select
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                  className={inputClass}
                >
                  {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              <Save size={15} />
              {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </button>
          </form>
        </div>

        {/* Password change - UI only */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="font-semibold dark:text-white mb-4 flex items-center gap-2"><Lock size={16} /> Zmiana hasła</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (pwForm.next !== pwForm.confirm) {
                toast.error('Hasła nie są identyczne')
                return
              }
              toast.info('Zmiana hasła — funkcja wkrótce dostępna')
              setPwForm({ current: '', next: '', confirm: '' })
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-slate-300">Obecne hasło</label>
              <input type="password" value={pwForm.current} onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })} className={inputClass} placeholder="••••••••" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Nowe hasło</label>
                <input type="password" value={pwForm.next} onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })} className={inputClass} placeholder="••••••••" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Potwierdź</label>
                <input type="password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} className={inputClass} placeholder="••••••••" required />
              </div>
            </div>
            <button type="submit" className="flex items-center gap-2 bg-slate-700 text-white px-5 py-2 rounded-lg hover:bg-slate-600 transition-colors text-sm font-medium">
              <Lock size={15} /> Zmień hasło
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
