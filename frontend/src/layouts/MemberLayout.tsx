import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import { Price } from '../components/common/Price'

const MENU = [
  { to: '/dashboard', label: 'Ringkasan', icon: '🏠', end: true },
  { to: '/dashboard/bookings', label: 'Booking Saya', icon: '🧺' },
  { to: '/dashboard/booking/new', label: 'Booking Baru', icon: '➕' },
  { to: '/dashboard/loyalty', label: 'Poin Loyalitas', icon: '⭐' },
  { to: '/dashboard/vouchers', label: 'Voucher', icon: '🎟️' },
  { to: '/dashboard/address', label: 'Alamat', icon: '📍' },
  { to: '/dashboard/profile', label: 'Profil', icon: '👤' },
]

export function MemberLayout() {
  const { user, logout } = useAuth()
  const { siteName } = useSettings()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-600 text-sm font-bold text-white">
              W
            </span>
            <span className="text-lg font-bold text-slate-900">{siteName}</span>
          </NavLink>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {user?.username ?? user?.email}
              </p>
              <p className="text-xs text-slate-500">
                Poin: <Price value={user?.balance ?? 0} className="font-medium" />
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
        <aside className="hidden w-60 shrink-0 lg:block">
          <nav className="sticky top-20 space-y-1">
            {MENU.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-sky-50 text-sky-700'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900'
                  }`
                }
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <nav className="mb-4 flex gap-1 overflow-x-auto pb-1 lg:hidden">
            {MENU.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
                    isActive ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
