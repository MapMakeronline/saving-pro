import type { CSSProperties } from 'react'

function SkeletonBox({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`}
      style={style}
    />
  )
}

export function SkeletonStatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-3">
          <SkeletonBox className="h-4 w-24" />
          <SkeletonBox className="h-8 w-32" />
          <SkeletonBox className="h-3 w-20" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 8 }: { rows?: number }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div className="bg-slate-50 dark:bg-slate-700 px-4 py-3 flex gap-4">
        {[...Array(5)].map((_, i) => (
          <SkeletonBox key={i} className="h-3 w-20" />
        ))}
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <SkeletonBox className="h-3 w-20" />
            <SkeletonBox className="h-3 flex-1" />
            <SkeletonBox className="h-5 w-20 rounded-full" />
            <SkeletonBox className="h-3 w-24 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 space-y-3">
          <div className="flex justify-between">
            <SkeletonBox className="h-5 w-32" />
            <SkeletonBox className="h-5 w-8" />
          </div>
          <SkeletonBox className="h-2 w-full rounded-full" />
          <div className="flex justify-between">
            <SkeletonBox className="h-3 w-24" />
            <SkeletonBox className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonChart() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
      <SkeletonBox className="h-5 w-40 mb-6" />
      <div className="flex items-end gap-3 h-48">
        {[60, 80, 50, 90, 70, 85, 65].map((h, i) => (
          <SkeletonBox key={i} className="flex-1 rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}

export default SkeletonBox
