import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

type Status = 'loading' | 'success' | 'expired' | 'invalid'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) { setStatus('invalid'); return }

    ;(async () => {
      try {
        const ref = doc(db, 'emailVerifications', token)
        const snap = await getDoc(ref)
        if (!snap.exists()) { setStatus('invalid'); return }

        const data = snap.data()
        if (data.used) { setStatus('success'); return }
        if (new Date(data.expiry) < new Date()) { setStatus('expired'); return }

        await updateDoc(ref, { used: true })
        setStatus('success')
      } catch {
        setStatus('invalid')
      }
    })()
  }, [searchParams])

  const content: Record<Status, { icon: React.ReactNode; title: string; desc: string }> = {
    loading: {
      icon: <Loader size={32} className="text-teal-400 animate-spin" />,
      title: 'Weryfikacja...',
      desc: 'Sprawdzamy link weryfikacyjny.',
    },
    success: {
      icon: <CheckCircle size={32} className="text-teal-400" />,
      title: 'Email zweryfikowany!',
      desc: 'Twoje konto jest aktywne. Możesz się zalogować.',
    },
    expired: {
      icon: <XCircle size={32} className="text-red-400" />,
      title: 'Link wygasł',
      desc: 'Link weryfikacyjny wygasł (ważny 24h). Zarejestruj się ponownie.',
    },
    invalid: {
      icon: <XCircle size={32} className="text-red-400" />,
      title: 'Nieprawidłowy link',
      desc: 'Ten link weryfikacyjny jest nieprawidłowy lub już został użyty.',
    },
  }

  const { icon, title, desc } = content[status]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#030712]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-teal-600/14 blur-[130px]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-[28px] border border-white/8 bg-[#0f1629] shadow-2xl shadow-black/50 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/15 border border-teal-500/25 flex items-center justify-center mx-auto mb-5">
            {icon}
          </div>
          <h2 className="text-2xl font-black text-white mb-2">{title}</h2>
          <p className="text-slate-400 text-sm mb-8">{desc}</p>
          {status !== 'loading' && (
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full bg-teal-600 hover:bg-teal-500 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-teal-600/25 hover:-translate-y-0.5"
            >
              Przejdź do logowania
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  )
}
