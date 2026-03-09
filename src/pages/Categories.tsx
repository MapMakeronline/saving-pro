import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { useCategoryStore } from '../store/categoryStore'
import Modal from '../components/common/Modal'
import type { Category, CreateCategoryDto, CategoryType } from '../types'

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.18, ease: 'easeOut' as const } },
}

const PRESET_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

const emptyForm: CreateCategoryDto = {
  name: '',
  type: 'EXPENSE',
  color: '#3b82f6',
  icon: '💰',
}

export default function Categories() {
  const { categories, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategoryStore()
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CreateCategoryDto>(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingId) {
        await updateCategory(editingId, form)
      } else {
        await createCategory(form)
      }
      setIsModalOpen(false)
      setForm(emptyForm)
      setEditingId(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const openAddModal = () => { setEditingId(null); setForm(emptyForm); setIsModalOpen(true) }
  const openEditModal = (cat: Category) => {
    setEditingId(cat.id)
    setForm({ name: cat.name, type: cat.type, color: cat.color || '#3b82f6', icon: cat.icon || '' })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Usunąć tę kategorię?')) {
      await deleteCategory(id)
    }
  }

  const income = categories.filter((c) => c.type === 'INCOME')
  const expenses = categories.filter((c) => c.type === 'EXPENSE')

  return (
    <div>
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">{t('categories.title')}</h1>
          <p className="text-slate-500 text-sm mt-1">{categories.length} kategorii</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          {t('categories.new')}
        </button>
      </div>

      <div className="p-6 space-y-8">
        {/* Expense categories */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Wydatki ({expenses.length})
          </h2>
          {expenses.length === 0 ? (
            <p className="text-slate-400 text-sm">{t('categories.noExpenses')}</p>
          ) : (
          <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {expenses.map((cat) => (
                <motion.div
                  key={cat.id}
                  variants={itemVariants}
                  className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
                      style={{ backgroundColor: cat.color + '30', color: cat.color }}
                    >
                      {cat.icon || cat.name[0]}
                    </div>
                    <span className="font-medium dark:text-white text-sm">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-blue-500 transition-all"
                      title="Edytuj"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
                      title="Usuń"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Income categories */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Przychody ({income.length})
          </h2>
          {income.length === 0 ? (
            <p className="text-slate-400 text-sm">{t('categories.noIncomes')}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {income.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
                      style={{ backgroundColor: cat.color + '30', color: cat.color }}
                    >
                      {cat.icon || cat.name[0]}
                    </div>
                    <span className="font-medium dark:text-white text-sm">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-blue-500 transition-all"
                      title="Edytuj"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
                      title="Usuń"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Add modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingId(null) }} title={editingId ? t('categories.edit') : t('categories.new')}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Nazwa</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Typ</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as CategoryType })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm"
            >
              <option value="EXPENSE">Wydatek</option>
              <option value="INCOME">Przychód</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Ikona (emoji)</label>
            <input
              type="text"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm"
              placeholder="💰"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-slate-300">Kolor</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({ ...form, color })}
                  className={`w-7 h-7 rounded-full transition-transform ${form.color === color ? 'scale-125 ring-2 ring-offset-2 ring-blue-500' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
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
