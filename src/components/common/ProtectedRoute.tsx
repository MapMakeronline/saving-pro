import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

interface Props {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const { user, isLoading } = useAuthStore((s) => ({ user: s.user, isLoading: s.isLoading }))
  if (isLoading) return null
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}
