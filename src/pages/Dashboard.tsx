import { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Wallet, Target, ArrowRight } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useTransactionStore } from '../store/transactionStore'
import { useCategoryStore } from '../store/categoryStore'
import { useGoalStore } from '../store/goalStore'
import { useBudgetStore } from '../store/budgetStore'
import { useAuthStore } from '../store/authStore'
import StatCard from '../components/common/StatCard'
import { SkeletonStatCards, SkeletonChart } from '../components/common/Skeleton'
import { useToastStore } from '../store/toastStore'

const COLORS = ['#14b8a6', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

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

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-[#0f1629] rounded-2xl shadow-sm dark:shadow-none ${className}`}>
      {children}
    </div>
  )
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

  useEffect(() => {
    budgets.forEach((b) => {
      if (b.spent > b.amount && !alertedBudgets.current.has(b.id)) {
        alertedBudgets.current.add(b.id)
        toastError(t('dashboard.budgetAlert', { name: b.name }))
      }
    })
  }, [budgets])

  const currency = user?.currency || 'PLN'

  const totalIncome = useMemo(
    () => transactions.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0),
    [transactions]
  )
  const totalExpense = useMemo(
    () => transactions.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0),
    [transactions]
  )
  const balance = totalIncome - totalExpense

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

  const recentTransactions = useMemo(
    () => [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
    [transactions]
  )

  const isDark = document.documentElement.classList.contains('dark')
  const tooltipStyle = {
    backgroundColor: isDark ? '#0f1629' : '#fff',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
    borderRadius: '12px',
    color: isDark ? '#fff' : '#0f172a',
    boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
  }

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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          {t('dashboard.greeting', { name: user?.name?.split(' ')[0] || 'użytkowniku' })}
        </h1>
        <p className="text-slate-400 text-sm mt-1">{t('dashboard.subtitle')}</p>
      </div>

      {/* Stat cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <StatCard title={t('dashboard.balance')} value={formatCurrency(balance, currency)}
            icon={<Wallet size={19} />} trend={balance >= 0 ? 'up' : 'down'} accent="teal" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title={t('common.incomes')} value={formatCurrency(totalIncome, currency)}
            icon={<TrendingUp size={19} />} trend="up" accent="green" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title={t('common.expenses')} value={formatCurrency(totalExpense, currency)}
            icon={<TrendingDown size={19} />} trend="down" accent="red" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title={t('dashboard.activeGoals')} value={goals.length}
            subtitle={`${goals.filter((g) => g.currentAmount >= g.targetAmount).length} ${t('dashboard.completed')}`}
            icon={<Target size={19} />} accent="purple" />
        </motion.div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel className="lg:col-span-2 p-6">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm mb-5">{t('dashboard.incomeVsExpenses')}</h2>
          {areaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#ffffff08' : '#f1f5f9'} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v, currency)} />
                <Area type="monotone" dataKey="income" name={t('common.incomes')} stroke="#14b8a6" strokeWidth={2} fill="url(#incomeGrad)" />
                <Area type="monotone" dataKey="expenses" name={t('common.expenses')} stroke="#ef4444" strokeWidth={2} fill="url(#expenseGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400 text-sm text-center py-16">{t('dashboard.noChartData')}</p>
          )}
        </Panel>

        <Panel className="p-6">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm mb-5">{t('dashboard.expensesByCategory')}</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={75} strokeWidth={0}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v, currency)} />
                <Legend wrapperStyle={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400 text-sm text-center py-16">{t('dashboard.noExpenses')}</p>
          )}
        </Panel>
      </div>

      {/* Budget progress */}
      {budgets.length > 0 && (
        <Panel>
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-white/5">
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">{t('dashboard.budgets')}</h2>
            <Link to="/budget-goals" className="text-teal-500 dark:text-teal-400 hover:opacity-70 text-xs flex items-center gap-1 transition-opacity">
              {t('nav.budgetGoals')} <ArrowRight size={13} />
            </Link>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {budgets.map((b, i) => {
              const pct = b.amount > 0 ? Math.min((b.spent / b.amount) * 100, 100) : 0
              const isOver = b.spent > b.amount
              return (
                <motion.div key={b.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.06 }}
                >
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{b.name}</span>
                    <span className={isOver ? 'text-red-500 font-bold' : 'text-slate-400'}>
                      {formatCurrency(b.spent, currency)} / {formatCurrency(b.amount, currency)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5">
                    <motion.div
                      className="h-1.5 rounded-full"
                      style={{ backgroundColor: isOver ? '#ef4444' : '#14b8a6' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: i * 0.06 + 0.1 }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{pct.toFixed(0)}% · {b.period}</p>
                </motion.div>
              )
            })}
          </div>
        </Panel>
      )}

      {/* Recent transactions */}
      <Panel>
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-white/5">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm">{t('dashboard.recentTransactions')}</h2>
          <Link to="/transactions" className="text-teal-500 dark:text-teal-400 hover:opacity-70 text-xs flex items-center gap-1 transition-opacity">
            {t('dashboard.seeAll')} <ArrowRight size={13} />
          </Link>
        </div>
        {recentTransactions.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-12">{t('dashboard.noTransactions')}</p>
        ) : (
          <ul>
            {recentTransactions.map((tx, i) => {
              const cat = categories.find((c) => c.id === tx.categoryId)
              return (
                <li key={tx.id}
                  className={`flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-white/2 transition-colors ${i < recentTransactions.length - 1 ? 'border-b border-slate-100 dark:border-white/4' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                      style={{
                        backgroundColor: cat?.color ? `${cat.color}20` : '#f1f5f9',
                        color: cat?.color || '#94a3b8',
                      }}
                    >
                      {cat?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{tx.description}</p>
                      <p className="text-xs text-slate-400">
                        {cat?.name || 'Inna'} · {new Date(tx.date).toLocaleDateString('pl-PL')}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold tabular-nums ${tx.type === 'INCOME' ? 'text-teal-600 dark:text-teal-400' : 'text-red-500 dark:text-red-400'}`}>
                    {tx.type === 'INCOME' ? '+' : '−'}{formatCurrency(tx.amount, currency)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </Panel>
    </div>
  )
}
