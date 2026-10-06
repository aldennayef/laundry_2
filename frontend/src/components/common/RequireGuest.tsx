import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LoadingBlock } from './Spinner'

/** Halaman auth (login/register): jika sudah login, alihkan ke dashboard/redirect. */
export function RequireGuest() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <LoadingBlock label="Memeriksa sesi…" />
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
