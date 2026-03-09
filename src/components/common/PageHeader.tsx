interface Props {
  children: React.ReactNode
  title: string
  action?: React.ReactNode
}

export default function PageHeader({ children, title, action }: Props) {
  return (
    <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">{title}</h1>
        <div className="text-slate-500 dark:text-slate-400 text-sm mt-1">{children}</div>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
