import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Plus, Trash2, Filter, Pencil, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useTransactionStore } from '../store/transactionStore'
import { useCategoryStore } from '../store/categoryStore'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import Modal from '../components/common/Modal'
import { SkeletonTable } from '../components/common/Skeleton'
import type { CreateTransactionDto, Transaction, TransactionType } from '../types'

function formatCurrency(amount: number, currency = 'PLN') {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency }).format(amount)
}

const PAGE_SIZE = 20

const PRESET_CATEGORIES = {
  INCOME: [
    { name: 'Pensja', icon: '💼', color: '#14b8a6' },
    { name: 'Premia', icon: '🎁', color: '#6366f1' },
    { name: 'Freelance', icon: '💻', color: '#8b5cf6' },
    { name: 'Zwrot', icon: '↩️', color: '#06b6d4' },
    { name: 'Inne', icon: '💰', color: '#64748b' },
  ],
  EXPENSE: [
    { name: 'Jedzenie', icon: '🍕', color: '#f59e0b' },
    { name: 'Zakupy', icon: '🛍️', color: '#ec4899' },
    { name: 'Transport', icon: '🚗', color: '#3b82f6' },
    { name: 'Rachunki', icon: '🧾', color: '#ef4444' },
    { name: 'Rozrywka', icon: '🎬', color: '#8b5cf6' },
    { name: 'Zdrowie', icon: '💊', color: '#10b981' },
    { name: 'Mieszkanie', icon: '🏠', color: '#f97316' },
    { name: 'Inne', icon: '💸', color: '#64748b' },
  ],
}

const emptyForm: CreateTransactionDto = {
  amount: 0,
  type: 'EXPENSE',
  description: '',
  date: new Date().toISOString().split('T')[0],
  categoryId: '',
}

export default function Transactions() {
  const { transactions, isLoading, fetchTransactions, createTransaction, updateTransaction, deleteTransaction } = useTransactionStore()
  const { categories, fetchCategories, createCategory } = useCategoryStore()
  const { user } = useAuthStore()
  const { error: toastError } = useToastStore()
  const { t } = useTranslation()
  const currency = user?.currency || 'PLN'

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CreateTransactionDto>(emptyForm)
  const [selectedPreset, setSelectedPreset] = useState<string>('')
  const [filterType, setFilterType] = useState<TransactionType | 'ALL'>('ALL')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterSearch, setFilterSearch] = useState('')
  const [page, setPage] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchTransactions({ limit: 200 })
    fetchCategories()
  }, [])

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (filterType !== 'ALL' && tx.type !== filterType) return false
      if (filterCategory && tx.categoryId !== filterCategory) return false
      if (filterSearch && !tx.description.toLowerCase().includes(filterSearch.toLowerCase())) return false
      return true
    })
  }, [transactions, filterType, filterCategory, filterSearch])

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  )

  useEffect(() => { setPage(1) }, [filterType, filterCategory, filterSearch])

  const openAddModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setSelectedPreset('')
    setIsModalOpen(true)
  }

  const openEditModal = (tx: Transaction) => {
    setEditingId(tx.id)
    const cat = categories.find((c) => c.id === tx.categoryId)
    setSelectedPreset(cat?.name || '')
    setForm({
      amount: tx.amount,
      type: tx.type,
      description: tx.description,
      date: new Date(tx.date).toISOString().split('T')[0],
      categoryId: tx.categoryId || '',
    })
    setIsModalOpen(true)
  }

  // Find or create a category by preset name
  const resolveCategory = async (presetName: string, type: TransactionType): Promise<string> => {
    const presets = PRESET_CATEGORIES[type]
    const preset = presets.find((p) => p.name === presetName)
    if (!preset) return ''

    const existing = categories.find((c) => c.name === presetName && c.type === type)
    if (existing) return existing.id

    // Create it on the fly
    await createCategory({ name: presetName, color: preset.color, type })
    await fetchCategories()
    const created = categories.find((c) => c.name === presetName && c.type === type)
    return created?.id || ''
  }

  const handlePresetSelect = (presetName: string) => {
    setSelectedPreset(presetName)
    const cat = categories.find((c) => c.name === presetName && c.type === form.type)
    setForm((f) => ({ ...f, categoryId: cat?.id || '' }))
  }

  const handleTypeChange = (type: TransactionType) => {
    setForm((f) => ({ ...f, type, categoryId: '' }))
    setSelectedPreset('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      let categoryId = form.categoryId
      if (!categoryId && selectedPreset) {
        categoryId = await resolveCategory(selectedPreset, form.type)
      }
      const payload = { ...form, amount: Number(form.amount), categoryId }
      if (editingId) {
        await updateTransaction(editingId, payload)
      } else {
        await createTransaction(payload)
      }
      setIsModalOpen(false)
      setForm(emptyForm)
      setEditingId(null)
    } catch {
      toastError('Błąd podczas zapisywania transakcji')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Usunąć tę transakcję?')) {
      await deleteTransaction(id)
    }
  }

  const inputClass = 'w-full px-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-teal-500 dark:focus:border-teal-500/60 transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'

  const presets = PRESET_CATEGORIES[form.type]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a1020] flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">{t('transactions.title')}</h1>
          <p className="text-slate-400 text-xs mt-0.5">{filtered.length} {t('transactions.title').toLowerCase()}</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-teal-600/20 hover:-translate-y-0.5"
        >
          <Plus size={16} />
          {t('transactions.new')}
        </button>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 bg-white dark:bg-[#0a1020] border-b border-slate-200 dark:border-white/5 flex flex-wrap gap-2.5 items-center">
        <Filter size={15} className="text-slate-400 shrink-0" />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as TransactionType | 'ALL')}
          className="px-3 py-1.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-700 dark:text-white outline-none"
        >
          <option value="ALL">Wszystkie</option>
          <option value="INCOME">Przychody</option>
          <option value="EXPENSE">Wydatki</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-700 dark:text-white outline-none"
        >
          <option value="">Wszystkie kategorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Szukaj..."
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-700 dark:text-white outline-none w-44 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      {/* Table */}
      <div className="p-6">
        {isLoading ? (
          <SkeletonTable rows={8} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-sm">Brak transakcji. Dodaj pierwszą!</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0f1629] rounded-2xl shadow-sm dark:shadow-none overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Data</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Opis</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Kategoria</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Kwota</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <motion.tbody
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
              >
                {paginated.map((tx, i) => {
                  const cat = categories.find((c) => c.id === tx.categoryId)
                  return (
                    <motion.tr
                      key={tx.id}
                      variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0, transition: { duration: 0.18 } } }}
                      className={`hover:bg-slate-50 dark:hover:bg-white/2 transition-colors ${i < paginated.length - 1 ? 'border-b border-slate-100 dark:border-white/4' : ''}`}
                    >
                      <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString('pl-PL')}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-white">{tx.description}</td>
                      <td className="px-5 py-3.5">
                        {cat ? (
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                            style={{ backgroundColor: `${cat.color}cc` }}
                          >
                            {cat.name}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                      <td className={`px-5 py-3.5 text-right font-bold tabular-nums ${tx.type === 'INCOME' ? 'text-teal-600 dark:text-teal-400' : 'text-red-500 dark:text-red-400'}`}>
                        {tx.type === 'INCOME' ? '+' : '−'}{formatCurrency(tx.amount, currency)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditModal(tx)} className="text-slate-300 dark:text-slate-600 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(tx.id)} className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </motion.tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-slate-400">
              Strona {page} z {Math.ceil(filtered.length / PAGE_SIZE)} · {filtered.length} wyników
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-700 dark:text-white disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
              >
                <ChevronLeft size={13} /> Poprzednia
              </button>
              <button
                onClick={() => setPage((p) => Math.min(Math.ceil(filtered.length / PAGE_SIZE), p + 1))}
                disabled={page >= Math.ceil(filtered.length / PAGE_SIZE)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-700 dark:text-white disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
              >
                Następna <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingId(null) }}
        title={editingId ? 'Edytuj transakcję' : 'Nowa transakcja'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type toggle */}
          <div className="flex rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5 p-1">
            {(['EXPENSE', 'INCOME'] as TransactionType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeChange(type)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  form.type === type
                    ? type === 'INCOME'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-red-500 text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                {type === 'INCOME' ? 'Przychód' : 'Wydatek'}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wide">Kwota</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                {currency === 'PLN' ? 'zł' : currency === 'EUR' ? '€' : '$'}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.amount === 0 ? '' : form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                placeholder="0.00"
                className={`${inputClass} pl-8`}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wide">Opis</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="np. Biedronka, Spotify..."
              className={inputClass}
              required
            />
          </div>

          {/* Category presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wide">Kategoria</label>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => {
                const isSelected = selectedPreset === p.name
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handlePresetSelect(p.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'text-white border-transparent shadow-sm'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                    style={isSelected ? { backgroundColor: p.color, borderColor: p.color } : {}}
                  >
                    <span>{p.icon}</span>
                    {p.name}
                    {isSelected && <Check size={11} strokeWidth={3} />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wide">Data</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={inputClass}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); setEditingId(null) }}
              className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl text-sm font-semibold text-slate-700 dark:text-white transition-all"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Zapisywanie...' : editingId ? 'Zapisz zmiany' : 'Dodaj'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
