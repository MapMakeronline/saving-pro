interface Props {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  accent?: 'teal' | 'green' | 'red' | 'purple'
}

export default function StatCard({ title, value, subtitle, icon, trend, trendValue, accent = 'teal' }: Props) {
  const trendColor =
    trend === 'up' ? 'text-emerald-600 dark:text-emerald-400'
    : trend === 'down' ? 'text-red-500 dark:text-red-400'
    : 'text-slate-400'

  const accentMap = {
    teal:   'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400',
    green:  'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    red:    'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400',
    purple: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
  }

  return (
    <div className="bg-white dark:bg-[#0f1629] rounded-2xl p-5 shadow-sm dark:shadow-none">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1.5 truncate">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          {trendValue && <p className={`text-xs mt-1 font-medium ${trendColor}`}>{trendValue}</p>}
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ml-3 ${accentMap[accent]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
