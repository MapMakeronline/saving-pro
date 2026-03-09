import { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Wallet, Target, ArrowRight } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { useTransactionStore } from '../store/transactionStore'
import { useCategoryStore } from '../store/categoryStore'
import { useGoalStore } from '../store/goalStore'
import { useBudgetStore } from '../store/budgetStore'
import { useAuthStore } from '../store/authStore'
import StatCard from '../components/common/StatCard'
import { SkeletonStatCards, SkeletonChart } from '../components/common/Skeleton'
import { useToastStore } from '../store/toastStore'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' as const } },
}

function formatCurrency(amount: number, currency = 'PLN') {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency }).format(amount)
}

export default function Dashboard() {
  const { t } = useTranslation()
  const { transactions, isLoading, fetchTransactions } = useTransactionStore()
  const { categories, fetchCategories } = useCategoryStore()
  const { goals, fetchGoals } = useGoalStore()
  const { budgets, fetchBudgets } = useBudgetStore()
  const { user, fetchProfile } = useAuthStore()
  const { error: toastError } = useToastStore()
  const alertedBudgets = useRef<Set<string>>(new Set())

  useEffect(() => {
    fetchTransactions({ limit: 100 })
    fetchCategories()
    fetchGoals()
    fetchBudgets()
    if (!user) fetchProfile()
  }, [])

  // Budget exceeded alerts
  useEffect(() => {
    budgets.forEach((b) => {
      if (b.spent > b.amount && !alertedBudgets.current.has(b.id)) {
        alertedBudgets.current.add(b.id)
        toastError(t('dashboard.budgetAlert', { name: b.name }))
      }
    })
  }, [budgets])

  const currency = user?.currency || 'PLN'

  // Totals
  const totalIncome = useMemo(
    () => transactions.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0),
    [transactions]
  )
  const totalExpense = useMemo(
    () => transactions.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0),
    [transactions]
  )
  const balance = totalIncome - totalExpense

  // Last 6 months area chart data
  const areaData = useMemo(() => {
    const months: Record<string, { month: string; income: number; expenses: number }> = {}
    transactions.forEach((t) => {
      const d = new Date(t.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const label = d.toLocaleDateString('pl-PL', { month: 'short', year: '2-digit' })
      if (!months[key]) months[key] = { month: label, income: 0, expenses: 0 }
      if (t.type === 'INCOME') months[key].income += t.amount
      else months[key].expenses += t.amount
    })
    return Object.values(months).slice(-6)
  }, [transactions])

  // Pie chart by category (expenses only)
  const pieData = useMemo(() => {
    const catMap: Record<string, { name: string; value: number }> = {}
    transactions
      .filter((t) => t.type === 'EXPENSE')
      .forEach((t) => {
        const cat = categories.find((c) => c.id === t.categoryId)
        const name = cat?.name || 'Inne'
        if (!catMap[name]) catMap[name] = { name, value: 0 }
        catMap[name].value += t.amount
      })
    return Object.values(catMap).slice(0, 6)
  }, [transactions, categories])

  // Recent 5 transactions
  const recentTransactions = useMemo(
    () => [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
    [transactions]
  )

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <SkeletonStatCards />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><SkeletonChart /></div>
          <SkeletonChart />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">
          {t('dashboard.greeting', { name: user?.name?.split(' ')[0] || 'użytkowniku' })}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Stat cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title={t('dashboard.balance')}
            value={formatCurrency(balance, currency)}
            icon={<Wallet size={20} />}
            trend={balance >= 0 ? 'up' : 'down'}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title={t('common.incomes')}
            value={formatCurrency(totalIncome, currency)}
            icon={<TrendingUp size={20} />}
            trend="up"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title={t('common.expenses')}
            value={formatCurrency(totalExpense, currency)}
            icon={<TrendingDown size={20} />}
            trend="down"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title={t('dashboard.activeGoals')}
            value={goals.length}
            subtitle={`${goals.filter((g) => g.currentAmount >= g.targetAmount).length} ${t('dashboard.completed')}`}
            icon={<Target size={20} />}
          />
        </motion.div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="font-semibold mb-4 dark:text-white">{t('dashboard.incomeVsExpenses')}</h2>
          {areaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v, currency)} />
                <Area type="monotone" dataKey="income" name={t('common.incomes')} stroke="#10b981" fill="#d1fae5" />
                <Area type="monotone" dataKey="expenses" name={t('common.expenses')} stroke="#ef4444" fill="#fee2e2" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400 text-sm text-center py-16">{t('dashboard.noChartData')}</p>
          )}
        </div>

        {/* Pie chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="font-semibold mb-4 dark:text-white">{t('dashboard.expensesByCategory')}</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v, currency)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400 text-sm text-center py-16">{t('dashboard.noExpenses')}</p>
          )}
        </div>
      </div>

      {/* Budget progress */}
      {budgets.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
            <h2 className="font-semibold dark:text-white">{t('dashboard.budgets')}</h2>
            <Link to="/budget-goals" className="text-blue-600 text-sm flex items-center gap-1 hover:underline">
              {t('nav.budgetGoals')} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {budgets.map((b, i) => {
              const pct = b.amount > 0 ? Math.min((b.spent / b.amount) * 100, 100) : 0
              const isOver = b.spent > b.amount
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.06, ease: 'easeOut' }}
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium dark:text-white">{b.name}</span>
                    <span className={isOver ? 'text-red-500 font-semibold' : 'text-slate-500'}>
                      {formatCurrency(b.spent, currency)} / {formatCurrency(b.amount, currency)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                    <motion.div
                      className="h-2 rounded-full"
                      style={{ backgroundColor: isOver ? '#ef4444' : '#3b82f6' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: i * 0.06 + 0.1, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{pct.toFixed(0)}% · {b.period}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent transactions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-semibold dark:text-white">{t('dashboard.recentTransactions')}</h2>
          <Link to="/transactions" className="text-blue-600 text-sm flex items-center gap-1 hover:underline">
            {t('dashboard.seeAll')} <ArrowRight size={14} />
          </Link>
        </div>
        {recentTransactions.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-10">{t('dashboard.noTransactions')}</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {recentTransactions.map((t) => {
              const cat = categories.find((c) => c.id === t.categoryId)
              return (
                <li key={t.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: cat?.color || '#94a3b8' }}
                    >
                      {cat?.name?.[0] || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium dark:text-white">{t.description}</p>
                      <p className="text-xs text-slate-500">
                        {cat?.name || 'Inna'} · {new Date(t.date).toLocaleDateString('pl-PL')}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      t.type === 'INCOME' ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {t.type === 'INCOME' ? '+' : '-'}
                    {formatCurrency(t.amount, currency)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
