import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Plus, Trash2, Target, TrendingUp, Pencil } from 'lucide-react'
import { useBudgetStore } from '../store/budgetStore'
import { useGoalStore } from '../store/goalStore'
import { useCategoryStore } from '../store/categoryStore'
import { useAuthStore } from '../store/authStore'
import Modal from '../components/common/Modal'
import type { Budget, Goal, CreateBudgetDto, CreateGoalDto } from '../types'

function formatCurrency(amount: number, currency = 'PLN') {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency }).format(amount)
}

function ProgressBar({ value, max, color = '#3b82f6' }: { value: number; max: number; color?: string }) {
  const pct = Math.min((value / max) * 100, 100)
  const isOver = value > max
  return (
    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
      <div
        className="h-2 rounded-full transition-all"
        style={{ width: `${pct}%`, backgroundColor: isOver ? '#ef4444' : color }}
      />
    </div>
  )
}

const emptyBudgetForm: CreateBudgetDto = { name: '', amount: 0, period: 'monthly', categoryId: '' }
const emptyGoalForm: CreateGoalDto = {
  name: '',
  targetAmount: 0,
  currentAmount: 0,
  deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
}

export default function BudgetGoals() {
  const { budgets, fetchBudgets, createBudget, updateBudget, deleteBudget } = useBudgetStore()
  const { goals, fetchGoals, createGoal, updateGoal, deleteGoal } = useGoalStore()
  const { categories, fetchCategories } = useCategoryStore()
  const { user } = useAuthStore()
  const currency = user?.currency || 'PLN'
  const { t: tr } = useTranslation()

  const [tab, setTab] = useState<'budgets' | 'goals'>('budgets')
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [budgetForm, setBudgetForm] = useState<CreateBudgetDto>(emptyBudgetForm)
  const [goalForm, setGoalForm] = useState<CreateGoalDto>(emptyGoalForm)
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null)
  const [depositAmount, setDepositAmount] = useState(0)
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null)
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchBudgets()
    fetchGoals()
    fetchCategories()
  }, [])

  const openBudgetAddModal = () => { setEditingBudgetId(null); setBudgetForm(emptyBudgetForm); setIsBudgetModalOpen(true) }
  const openBudgetEditModal = (b: Budget) => {
    setEditingBudgetId(b.id)
    setBudgetForm({ name: b.name, amount: b.amount, period: b.period, categoryId: b.categoryId || '' })
    setIsBudgetModalOpen(true)
  }
  const openGoalAddModal = () => { setEditingGoalId(null); setGoalForm(emptyGoalForm); setIsGoalModalOpen(true) }
  const openGoalEditModal = (g: Goal) => {
    setEditingGoalId(g.id)
    setGoalForm({
      name: g.name,
      targetAmount: g.targetAmount,
      currentAmount: g.currentAmount,
      deadline: new Date(g.deadline).toISOString().split('T')[0],
    })
    setIsGoalModalOpen(true)
  }

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingBudgetId) {
        await updateBudget(editingBudgetId, { ...budgetForm, amount: Number(budgetForm.amount) })
      } else {
        await createBudget({ ...budgetForm, amount: Number(budgetForm.amount) })
      }
      setIsBudgetModalOpen(false)
      setBudgetForm(emptyBudgetForm)
      setEditingBudgetId(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingGoalId) {
        await updateGoal(editingGoalId, { ...goalForm, targetAmount: Number(goalForm.targetAmount), currentAmount: Number(goalForm.currentAmount) })
      } else {
        await createGoal({ ...goalForm, targetAmount: Number(goalForm.targetAmount), currentAmount: Number(goalForm.currentAmount) })
      }
      setIsGoalModalOpen(false)
      setGoalForm(emptyGoalForm)
      setEditingGoalId(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!depositGoalId) return
    const goal = goals.find((g) => g.id === depositGoalId)
    if (!goal) return
    await updateGoal(depositGoalId, { currentAmount: goal.currentAmount + Number(depositAmount) })
    setDepositGoalId(null)
    setDepositAmount(0)
  }

  return (
    <div>
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">{tr('budgetGoals.title')}</h1>
        </div>
        <button
          onClick={() => tab === 'budgets' ? openBudgetAddModal() : openGoalAddModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          {tab === 'budgets' ? tr('budgetGoals.newBudget') : tr('budgetGoals.newGoal')}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6">
        <div className="flex gap-6">
          {(['budgets', 'goals'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t === 'budgets' ? `Budżety (${budgets.length})` : `Cele (${goals.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Budgets */}
        {tab === 'budgets' && (
          budgets.length === 0 ? (
            <p className="text-center text-slate-400 py-16">{tr('budgetGoals.noBudgets')}</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
            >
              {budgets.map((b) => {
                const cat = categories.find((c) => c.id === b.categoryId)
                const isOver = b.spent > b.amount
                return (
                  <motion.div
                    key={b.id}
                    variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } } }}
                    className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold dark:text-white">{b.name}</h3>
                        {cat && <p className="text-xs text-slate-500">{cat.name}</p>}
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openBudgetEditModal(b)} className="text-slate-300 hover:text-blue-500 transition-colors" title="Edytuj"><Pencil size={14} /></button>
                        <button onClick={() => deleteBudget(b.id)} className="text-slate-300 hover:text-red-500 transition-colors" title="Usuń"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <ProgressBar value={b.spent} max={b.amount} color={isOver ? '#ef4444' : '#3b82f6'} />
                    <div className="flex justify-between mt-2 text-sm">
                      <span className={isOver ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'}>
                        {formatCurrency(b.spent, currency)} wydano
                      </span>
                      <span className="text-slate-500">{formatCurrency(b.amount, currency)} limit</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{Math.min((b.spent / b.amount) * 100, 100).toFixed(0)}% wykorzystano · {b.period}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          )
        )}

        {tab === 'goals' && (
          goals.length === 0 ? (
            <p className="text-center text-slate-400 py-16">{tr('budgetGoals.noGoals')}</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
            >
              {goals.map((g) => {
                const isDone = g.currentAmount >= g.targetAmount
                const daysLeft = Math.ceil((new Date(g.deadline).getTime() - Date.now()) / 86400000)
                return (
                  <motion.div
                    key={g.id}
                    variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } } }}
                    className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <Target size={18} className={isDone ? 'text-green-500' : 'text-blue-500'} />
                        <h3 className="font-semibold dark:text-white">{g.name}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openGoalEditModal(g)} className="text-slate-300 hover:text-blue-500 transition-colors" title="Edytuj"><Pencil size={14} /></button>
                        <button onClick={() => deleteGoal(g.id)} className="text-slate-300 hover:text-red-500 transition-colors" title="Usuń"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <ProgressBar value={g.currentAmount} max={g.targetAmount} color={isDone ? '#10b981' : '#3b82f6'} />
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        {formatCurrency(g.currentAmount, currency)}
                      </span>
                      <span className="text-slate-500">{formatCurrency(g.targetAmount, currency)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-slate-400">
                        {isDone ? '✅ Cel osiągnięty!' : `${daysLeft > 0 ? daysLeft + ' dni pozostało' : 'Termin minął'}`}
                      </span>
                      {!isDone && (
                        <button
                          onClick={() => setDepositGoalId(g.id)}
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <TrendingUp size={12} />
                          Wpłać
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )
        )}
      </div>

      {/* Budget modal */}
      <Modal isOpen={isBudgetModalOpen} onClose={() => { setIsBudgetModalOpen(false); setEditingBudgetId(null) }} title={editingBudgetId ? tr('budgetGoals.editBudget') : tr('budgetGoals.newBudget')}>
        <form onSubmit={handleCreateBudget} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Nazwa</label>
            <input
              type="text"
              value={budgetForm.name}
              onChange={(e) => setBudgetForm({ ...budgetForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Limit kwoty</label>
            <input
              type="number"
              step="0.01"
              min="1"
              value={budgetForm.amount || ''}
              onChange={(e) => setBudgetForm({ ...budgetForm, amount: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Okres</label>
            <select
              value={budgetForm.period}
              onChange={(e) => setBudgetForm({ ...budgetForm, period: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm"
            >
              <option value="monthly">Miesięczny</option>
              <option value="weekly">Tygodniowy</option>
              <option value="yearly">Roczny</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Kategoria</label>
            <select
              value={budgetForm.categoryId}
              onChange={(e) => setBudgetForm({ ...budgetForm, categoryId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm"
              required
            >
              <option value="">Wybierz kategorię...</option>
              {categories.filter((c) => c.type === 'EXPENSE').map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setIsBudgetModalOpen(false); setEditingBudgetId(null) }} className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:text-white">Anuluj</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Zapisywanie...' : editingBudgetId ? 'Zapisz zmiany' : 'Dodaj'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Goal modal */}
      <Modal isOpen={isGoalModalOpen} onClose={() => { setIsGoalModalOpen(false); setEditingGoalId(null) }} title={editingGoalId ? tr('budgetGoals.editGoal') : tr('budgetGoals.newGoal')}>
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Nazwa celu</label>
            <input
              type="text"
              value={goalForm.name}
              onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-slate-300">Cel (kwota)</label>
              <input
                type="number"
                step="0.01"
                min="1"
                value={goalForm.targetAmount || ''}
                onChange={(e) => setGoalForm({ ...goalForm, targetAmount: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-slate-300">Oszczędzone</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={goalForm.currentAmount || ''}
                onChange={(e) => setGoalForm({ ...goalForm, currentAmount: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Termin</label>
            <input
              type="date"
              value={goalForm.deadline}
              onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setIsGoalModalOpen(false); setEditingGoalId(null) }} className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:text-white">Anuluj</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Zapisywanie...' : editingGoalId ? 'Zapisz zmiany' : 'Dodaj'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Deposit modal */}
      <Modal isOpen={!!depositGoalId} onClose={() => setDepositGoalId(null)} title="Wpłać na cel">
        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Kwota do wpłaty</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={depositAmount || ''}
              onChange={(e) => setDepositAmount(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-sm"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setDepositGoalId(null)} className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:text-white">Anuluj</button>
            <button type="submit" className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">Wpłać</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
