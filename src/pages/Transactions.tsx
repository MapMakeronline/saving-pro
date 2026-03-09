import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Plus, Trash2, Filter, Pencil, ChevronLeft, ChevronRight } from 'lucide-react'
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

const emptyForm: CreateTransactionDto = {
  amount: 0,
  type: 'EXPENSE',
  description: '',
  date: new Date().toISOString().split('T')[0],
  categoryId: '',
}

export default function Transactions() {
  const { transactions, isLoading, fetchTransactions, createTransaction, updateTransaction, deleteTransaction } = useTransactionStore()
  const { categories, fetchCategories } = useCategoryStore()
  const { user } = useAuthStore()
  const { error: toastError } = useToastStore()
  const { t } = useTranslation()
  const currency = user?.currency || 'PLN'

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CreateTransactionDto>(emptyForm)
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
    return transactions.filter((t) => {
      if (filterType !== 'ALL' && t.type !== filterType) return false
      if (filterCategory && t.categoryId !== filterCategory) return false
      if (filterSearch && !t.description.toLowerCase().includes(filterSearch.toLowerCase())) return false
      return true
    })
  }, [transactions, filterType, filterCategory, filterSearch])

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  )

  useEffect(() => {
    setPage(1)
  }, [filterType, filterCategory, filterSearch])

  const openAddModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  const openEditModal = (t: Transaction) => {
    setEditingId(t.id)
    setForm({
      amount: t.amount,
      type: t.type,
      description: t.description,
      date: new Date(t.date).toISOString().split('T')[0],
      categoryId: t.categoryId || '',
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.categoryId) return
    setIsSubmitting(true)
    try {
      if (editingId) {
        await updateTransaction(editingId, { ...form, amount: Number(form.amount) })
      } else {
        await createTransaction({ ...form, amount: Number(form.amount) })
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

  return (
    <div>
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">{t('transactions.title')}</h1>
          <p className="text-slate-500 text-sm mt-1">{filtered.length} transakcji</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          {t('transactions.new')}
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-3">
        <Filter size={16} className="text-slate-400 self-center" />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as TransactionType | 'ALL')}
          className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-white"
        >
          <option value="ALL">Wszystkie typy</option>
          <option value="INCOME">Przychody</option>
          <option value="EXPENSE">Wydatki</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-white"
        >
          <option value="">Wszystkie kategorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Szukaj opisu..."
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
          className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-white w-48"
        />
      </div>

      {/* Table */}
      <div className="p-6">
        {isLoading ? (
          <SkeletonTable rows={8} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p>Brak transakcji. Dodaj pierwszą!</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Data</th>
                  <th className="text-left px-4 py-3 font-medium">Opis</th>
                  <th className="text-left px-4 py-3 font-medium">Kategoria</th>
                  <th className="text-right px-4 py-3 font-medium">Kwota</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <motion.tbody
                className="divide-y divide-slate-100 dark:divide-slate-700"
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
              >
                {paginated.map((t) => {
                  const cat = categories.find((c) => c.id === t.categoryId)
                  return (
                    <motion.tr
                      key={t.id}
                      variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0, transition: { duration: 0.18 } } }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                        {new Date(t.date).toLocaleDateString('pl-PL')}
                      </td>
                      <td className="px-4 py-3 dark:text-white">{t.description}</td>
                      <td className="px-4 py-3">
                        {cat && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs text-white"
                            style={{ backgroundColor: cat.color || '#94a3b8' }}
                          >
                            {cat.name}
                          </span>
                        )}
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-500'}`}>
                        {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount, currency)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(t)}
                            className="text-slate-400 hover:text-blue-500 transition-colors"
                            title="Edytuj"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                            title="Usuń"
                          >
                            <Trash2 size={15} />
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
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Strona {page} z {Math.ceil(filtered.length / PAGE_SIZE)} · {filtered.length} wyników
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:text-white disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft size={14} />
                Poprzednia
              </button>
              <button
                onClick={() => setPage((p) => Math.min(Math.ceil(filtered.length / PAGE_SIZE), p + 1))}
                disabled={page >= Math.ceil(filtered.length / PAGE_SIZE)}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:text-white disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Następna
                <ChevronRight size={14} />
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-slate-300">Typ</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm"
              >
                <option value="EXPENSE">Wydatek</option>
                <option value="INCOME">Przychód</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-slate-300">Kwota</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.amount || ''}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Opis</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Kategoria</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm"
              required
            >
              <option value="">Wybierz kategorię...</option>
              {categories
                .filter((c) => c.type === form.type)
                .map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Data</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); setEditingId(null) }}
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors dark:text-white"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Zapisywanie...' : editingId ? 'Zapisz zmiany' : 'Dodaj'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
