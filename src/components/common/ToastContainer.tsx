import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useToastStore } from '../../store/toastStore'

const icons = {
  success: <CheckCircle size={18} className="text-green-500" />,
  error: <AlertCircle size={18} className="text-red-500" />,
  warning: <AlertTriangle size={18} className="text-yellow-500" />,
  info: <Info size={18} className="text-blue-500" />,
}

const bars = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
}

export default function ToastContainer() {
  const { toasts, remove } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden flex items-start gap-3 p-4 animate-slide-in"
        >
          <div className="mt-0.5 shrink-0">{icons[toast.type]}</div>
          <p className="flex-1 text-sm text-slate-700 dark:text-slate-200">{toast.message}</p>
          <button
            onClick={() => remove(toast.id)}
            className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={15} />
          </button>
          {/* progress bar */}
          <div className="absolute bottom-0 left-0 h-0.5 w-full">
            <div className={`h-full ${bars[toast.type]} animate-shrink`} />
          </div>
        </div>
      ))}
    </div>
  )
}
