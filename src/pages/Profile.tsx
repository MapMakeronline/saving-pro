import { useState, useEffect } from 'react'
import { User, Mail, Globe, DollarSign, Lock, Save, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import { authService } from '../services/authService'
import { auth } from '../lib/firebase'

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
  const [changingPw, setChangingPw] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pwSuccess, setPwSuccess] = useState(false)

  // Check if user has email/password provider
  const isEmailProvider = auth.currentUser?.providerData.some((p) => p.providerId === 'password')

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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwForm.next.length < 6) {
      toast.error('Nowe hasło musi mieć co najmniej 6 znaków.')
      return
    }
    if (pwForm.next !== pwForm.confirm) {
      toast.error('Hasła nie są identyczne.')
      return
    }
    setChangingPw(true)
    try {
      await authService.changePassword(pwForm.current, pwForm.next)
      setPwForm({ current: '', next: '', confirm: '' })
      setPwSuccess(true)
      setTimeout(() => setPwSuccess(false), 3000)
      toast.success('Hasło zostało zmienione!')
    } catch (err: any) {
      const code = err?.code || ''
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        toast.error('Obecne hasło jest nieprawidłowe.')
      } else if (code === 'auth/too-many-requests') {
        toast.error('Za dużo prób. Spróbuj ponownie później.')
      } else {
        toast.error('Nie udało się zmienić hasła.')
      }
    } finally {
      setChangingPw(false)
    }
  }

  const inputClass = 'w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500'

  return (
    <div>
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1629]">
        <h1 className="text-2xl font-bold dark:text-white">Profil</h1>
        <p className="text-slate-500 text-sm mt-1">Zarządzaj swoim kontem</p>
      </div>

      <div className="p-6 max-w-2xl space-y-6">
        {/* Avatar / info */}
        <div className="bg-white dark:bg-[#0f1629] rounded-2xl p-6 shadow-sm dark:shadow-none flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
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
        <div className="bg-white dark:bg-[#0f1629] rounded-2xl p-6 shadow-sm dark:shadow-none">
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
              className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              <Save size={15} />
              {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </button>
          </form>
        </div>

        {/* Password change */}
        <div className="bg-white dark:bg-[#0f1629] rounded-2xl p-6 shadow-sm dark:shadow-none">
          <h2 className="font-semibold dark:text-white mb-1 flex items-center gap-2"><Lock size={16} /> Zmiana hasła</h2>

          {!isEmailProvider ? (
            <p className="text-sm text-slate-500 mt-2">
              Twoje konto jest połączone z zewnętrznym dostawcą (Google/GitHub). Zmiana hasła nie jest dostępna.
            </p>
          ) : (
            <>
              {pwSuccess && (
                <div className="flex items-center gap-2 text-teal-600 bg-teal-50 dark:bg-teal-500/10 dark:text-teal-400 rounded-lg px-4 py-2 mb-4 text-sm">
                  <CheckCircle size={15} /> Hasło zostało zmienione pomyślnie.
                </div>
              )}
              <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
                <div className="relative">
                  <label className="block text-sm font-medium mb-1 dark:text-slate-300">Obecne hasło</label>
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={pwForm.current}
                    onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                    className={inputClass + ' pr-10'}
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-8 text-slate-400 hover:text-slate-600">
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1 dark:text-slate-300">Nowe hasło</label>
                    <input
                      type={showNext ? 'text' : 'password'}
                      value={pwForm.next}
                      onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
                      className={inputClass + ' pr-10'}
                      placeholder="min. 6 znaków"
                      required
                    />
                    <button type="button" onClick={() => setShowNext(!showNext)} className="absolute right-3 top-8 text-slate-400 hover:text-slate-600">
                      {showNext ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1 dark:text-slate-300">Potwierdź</label>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={pwForm.confirm}
                      onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                      className={`${inputClass} pr-10 ${pwForm.confirm && pwForm.confirm !== pwForm.next ? 'border-red-400 focus:ring-red-400' : ''}`}
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-8 text-slate-400 hover:text-slate-600">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    {pwForm.confirm && pwForm.confirm !== pwForm.next && (
                      <p className="text-xs text-red-500 mt-1">Hasła nie są identyczne</p>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={changingPw}
                  className="flex items-center gap-2 bg-slate-700 dark:bg-slate-600 text-white px-5 py-2 rounded-lg hover:bg-slate-600 dark:hover:bg-slate-500 disabled:opacity-50 transition-colors text-sm font-medium"
                >
                  <Lock size={15} />
                  {changingPw ? 'Zmienianie...' : 'Zmień hasło'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
