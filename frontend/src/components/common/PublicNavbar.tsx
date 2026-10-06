import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSettings } from '../../context/SettingsContext'
import { Button, ButtonLink } from './Button'

const NAV_ITEMS = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/layanan', label: 'Layanan' },
  { to: '/store', label: 'Cabang' },
  { to: '/promo', label: 'Promo' },
  { to: '/blog', label: 'Artikel' },
  { to: '/tentang', label: 'Tentang' },
]

export function PublicNavbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const { siteName, settings, companyProfile } = useSettings()
  const navigate = useNavigate()

  const logo = settings?.logo_url ?? companyProfile?.logo_url ?? null

  async function handleLogout() {
    setOpen(false)
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          {logo ? (
            <img src={logo} alt={siteName} className="h-8 w-auto" />
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-600 text-sm font-bold text-white">
              W
            </span>
          )}
          <span className="text-lg font-bold text-slate-900">{siteName}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {isAuthenticated ? (
            <>
              <ButtonLink to="/dashboard" variant="secondary">
                {user?.username ?? user?.email ?? 'Akun'}
              </ButtonLink>
              <ButtonLink to="/dashboard/booking/new">Booking Sekarang</ButtonLink>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Keluar
              </Button>
            </>
          ) : (
            <>
              <ButtonLink to="/login" variant="secondary">
                Masuk
              </ButtonLink>
              <ButtonLink to="/register">Daftar</ButtonLink>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 lg:hidden">
          <nav className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <ButtonLink to="/dashboard" variant="secondary" className="w-full">
                  Dashboard
                </ButtonLink>
                <ButtonLink to="/dashboard/booking/new" className="w-full">
                  Booking Sekarang
                </ButtonLink>
                <Button variant="ghost" className="w-full" onClick={handleLogout}>
                  Keluar
                </Button>
              </>
            ) : (
              <>
                <ButtonLink to="/login" variant="secondary" className="w-full">
                  Masuk
                </ButtonLink>
                <ButtonLink to="/register" className="w-full">
                  Daftar
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
