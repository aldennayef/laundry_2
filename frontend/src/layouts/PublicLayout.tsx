import { Outlet } from 'react-router-dom'
import { PublicFooter } from '../components/common/PublicFooter'
import { PublicNavbar } from '../components/common/PublicNavbar'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}
