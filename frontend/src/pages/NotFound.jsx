import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NotFound() {
  const { user, isAdmin } = useAuth()
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-7xl">🔍</div>
        <h1 className="text-4xl font-bold text-slate-800">404</h1>
        <p className="text-slate-500">Page not found.</p>
        <Link to={user ? (isAdmin ? '/admin/dashboard' : '/dashboard') : '/login'} className="btn-primary inline-block mt-2">
          Go Home
        </Link>
      </div>
    </div>
  )
}
