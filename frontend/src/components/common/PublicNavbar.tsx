import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSettings } from '../../context/SettingsContext'
import { Button, ButtonLink } from './Button'
import { Icon } from './Icon'

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
    <header className="sticky top-0 z-40 border-b border-ink-200/80 bg-white/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          {logo ? (
            <img src={logo} alt={siteName} className="h-8 w-auto" />
          ) : (
            <span className="grid h-9 w-9 place-items-center rounded-md bg-ink-950 font-display text-base font-semibold text-accent-300 shadow-[0_14px_26px_-18px_rgba(12,10,9,0.85)]">
              W
            </span>
          )}
          <span className="font-display text-2xl font-semibold leading-none text-ink-950">
            {siteName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `relative px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-ink-950' : 'text-ink-500 hover:text-ink-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <span
                    className={`absolute inset-x-3.5 bottom-1 h-px bg-accent-500 transition-transform duration-200 ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {isAuthenticated ? (
            <>
              <ButtonLink to="/dashboard" variant="ghost" size="sm">
                {user?.username ?? user?.email ?? 'Akun'}
              </ButtonLink>
              <ButtonLink to="/dashboard#booking" variant="gold" size="sm">
                Booking
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink to="/login" variant="ghost" size="sm">
                Masuk
              </ButtonLink>
              <ButtonLink to="/register" variant="gold" size="sm">
                Daftar
              </ButtonLink>
            </>
          )}
        </div>

        <button
          type="button"
          className="min-h-11 min-w-11 rounded-md p-2 text-ink-700 transition-colors hover:bg-ink-100 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu"
        >
          <Icon name={open ? 'close' : 'menu'} size={24} />
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-200 bg-white px-5 pb-5 pt-3 lg:hidden">
          <nav className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                    isActive ? 'bg-ink-950 text-white' : 'text-ink-600 hover:bg-ink-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <ButtonLink to="/dashboard" variant="secondary" className="w-full">
                  Dashboard
                </ButtonLink>
                <ButtonLink to="/dashboard#booking" variant="gold" className="w-full">
                  Booking
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
                <ButtonLink to="/register" variant="gold" className="w-full">
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
