import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Download } from 'lucide-react'
import {
  BarChart,
  Bar,
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
import { useAuthStore } from '../store/authStore'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

function formatCurrency(amount: number, currency = 'PLN') {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency }).format(amount)
}

export default function Reports() {
  const { transactions, fetchTransactions } = useTransactionStore()
  const { categories, fetchCategories } = useCategoryStore()
  const { user } = useAuthStore()
  const currency = user?.currency || 'PLN'
  const { t } = useTranslation()

  const [period, setPeriod] = useState<'3m' | '6m' | '12m'>('6m')

  useEffect(() => {
    fetchTransactions({ limit: 500 })
    fetchCategories()
  }, [])

  const monthsBack = period === '3m' ? 3 : period === '6m' ? 6 : 12

  const filtered = useMemo(() => {
    const cutoff = new Date()
    cutoff.setMonth(cutoff.getMonth() - monthsBack)
    return transactions.filter((t) => new Date(t.date) >= cutoff)
  }, [transactions, monthsBack])

  // Monthly bar chart
  const barData = useMemo(() => {
    const months: Record<string, { month: string; income: number; expenses: number }> = {}
    filtered.forEach((t) => {
      const d = new Date(t.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const label = d.toLocaleDateString('pl-PL', { month: 'short', year: '2-digit' })
      if (!months[key]) months[key] = { month: label, income: 0, expenses: 0 }
      if (t.type === 'INCOME') months[key].income += t.amount
      else months[key].expenses += t.amount
    })
    return Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v)
  }, [filtered])

  // Expense by category pie
  const expenseByCategory = useMemo(() => {
    const map: Record<string, { name: string; value: number }> = {}
    filtered.filter((t) => t.type === 'EXPENSE').forEach((t) => {
      const cat = categories.find((c) => c.id === t.categoryId)
      const name = cat?.name || 'Inne'
      if (!map[name]) map[name] = { name, value: 0 }
      map[name].value += t.amount
    })
    return Object.values(map)
  }, [filtered, categories])

  // Top spending categories
  const topCategories = useMemo(() => [...expenseByCategory].sort((a, b) => b.value - a.value).slice(0, 5), [expenseByCategory])

  const totalIncome = filtered.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0)
  const totalExpense = filtered.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0)
  const savings = totalIncome - totalExpense
  const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : '0'

  const exportCSV = () => {
    const header = 'Data,Typ,Opis,Kategoria,Kwota\n'
    const rows = filtered.map((t) => {
      const cat = categories.find((c) => c.id === t.categoryId)
      const date = new Date(t.date).toLocaleDateString('pl-PL')
      const desc = `"${t.description.replace(/"/g, '""')}"`
      return `${date},${t.type === 'INCOME' ? 'Przychód' : 'Wydatek'},${desc},${cat?.name || 'Inne'},${t.amount.toFixed(2)}`
    }).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `saving-pro-${period}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">{t('reports.title')}</h1>
          <p className="text-slate-500 text-sm mt-1">{t('reports.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Download size={14} />
            {t('reports.exportCsv')}
          </button>
          {(['3m', '6m', '12m'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Przychody', value: formatCurrency(totalIncome, currency), color: 'text-green-600' },
            { label: 'Wydatki', value: formatCurrency(totalExpense, currency), color: 'text-red-500' },
            { label: 'Oszczędności', value: formatCurrency(savings, currency), color: savings >= 0 ? 'text-blue-600' : 'text-red-500' },
            { label: 'Stopa oszczędności', value: `${savingsRate}%`, color: 'text-slate-700 dark:text-slate-300' },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
              <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="font-semibold mb-4 dark:text-white">Miesięczny przegląd</h2>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v, currency)} />
                <Bar dataKey="income" name="Przychody" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Wydatki" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400 text-sm text-center py-16">Brak danych w wybranym okresie</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <h2 className="font-semibold mb-4 dark:text-white">Wydatki wg kategorii</h2>
            {expenseByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {expenseByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v, currency)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-sm text-center py-16">Brak wydatków</p>
            )}
          </div>

          {/* Top categories */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <h2 className="font-semibold mb-4 dark:text-white">Top 5 kategorii wydatków</h2>
            {topCategories.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-16">Brak danych</p>
            ) : (
              <ul className="space-y-3">
                {topCategories.map((cat, i) => (
                  <li key={cat.name} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold" style={{ backgroundColor: COLORS[i % COLORS.length] }}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="dark:text-white">{cat.name}</span>
                        <span className="text-slate-500">{formatCurrency(cat.value, currency)}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${(cat.value / (topCategories[0]?.value || 1)) * 100}%`,
                            backgroundColor: COLORS[i % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
