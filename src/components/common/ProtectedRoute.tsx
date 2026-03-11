import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { auth } from '../../lib/firebase'

interface Props {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const { user, isLoading } = useAuthStore((s) => ({ user: s.user, isLoading: s.isLoading }))
  if (isLoading) return null
  if (!user) return <Navigate to="/login" replace />

  // Blokuj dostęp jeśli email niezweryfikowany (tylko dla kont email/hasło)
  // Konta OAuth (Google, GitHub, Facebook, Microsoft) są automatycznie zweryfikowane
  const firebaseUser = auth.currentUser
  const isEmailProvider = firebaseUser?.providerData.some(p => p.providerId === 'password')
  if (isEmailProvider && firebaseUser && !firebaseUser.emailVerified) {
    return <Navigate to="/verify-pending" replace />
  }

  return <>{children}</>
}
