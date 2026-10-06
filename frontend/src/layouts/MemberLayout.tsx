import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import { getDashboard } from '../api/customer'
import { useAsync } from '../hooks/useAsync'
import { Icon } from '../components/common/Icon'
import { Modal } from '../components/common/Modal'
import { ProfileSection } from '../pages/member/sections/ProfileSection'

export function MemberLayout() {
  const { user, logout } = useAuth()
  const { siteName } = useSettings()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)

  const { data } = useAsync(() => getDashboard(), [])

  const displayName =
    data?.profile.username ?? user?.username ?? data?.profile.email?.split('@')[0] ?? 'Member'
  const initials = displayName.slice(0, 1).toUpperCase()
  const role = data?.profile.membership_tier?.tier_name ?? user?.role ?? 'Member'
  const hasNotification = (data?.active_bookings ?? 0) > 0

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-parchment-50">
      {/* Header atas — brand, search, notifikasi, chat, avatar, logout */}
      <header className="sticky top-0 z-30 border-b border-parchment-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3.5 sm:px-6 lg:gap-5">
          <NavLink to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="font-display grid h-10 w-10 place-items-center rounded-full bg-ink-900 text-lg font-semibold text-gold-300">
              W
            </span>
            <span className="font-display hidden text-2xl font-semibold tracking-wide text-ink-900 sm:block">
              {siteName}
            </span>
          </NavLink>

          <label htmlFor="member-search" className="sr-only">
            Cari pesanan atau layanan
          </label>
          <div className="relative hidden flex-1 sm:block">
            <Icon
              name="search"
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              id="member-search"
              type="search"
              placeholder="Cari pesanan atau layanan…"
              className="w-full rounded-full border border-parchment-200 bg-parchment-50 py-2.5 pl-11 pr-4 text-sm text-ink-800 placeholder:text-ink-400 focus:border-gold-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-100"
            />
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none sm:gap-2.5">
            <button
              type="button"
              aria-label="Notifikasi"
              className="relative grid h-10 w-10 place-items-center rounded-full text-ink-500 transition-colors hover:bg-parchment-100 hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-500"
            >
              <Icon name="bell" size={20} />
              {hasNotification && (
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-gold-500 ring-2 ring-white" />
              )}
            </button>
            <button
              type="button"
              aria-label="Pesan"
              className="grid h-10 w-10 place-items-center rounded-full text-ink-500 transition-colors hover:bg-parchment-100 hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-500"
            >
              <Icon name="message" size={20} />
            </button>

            <div className="mx-1 hidden h-8 w-px bg-parchment-200 sm:block" aria-hidden="true" />

            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              aria-label="Buka profil member"
              className="flex min-h-11 items-center gap-3 rounded-full px-1.5 py-1 text-left transition-colors hover:bg-parchment-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-500 sm:pr-3"
            >
              <span className="font-display grid h-9 w-9 place-items-center rounded-full bg-ink-900 text-sm font-semibold text-gold-300">
                {initials}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold leading-tight text-ink-900">
                  {displayName}
                </span>
                <span className="block text-xs leading-tight text-ink-400">{role}</span>
              </span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              aria-label="Logout"
              className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-ink-500 transition-colors hover:bg-parchment-100 hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-500"
            >
              <Icon name="logout" size={18} />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        <Outlet />
      </main>

      <Modal open={profileOpen} onClose={() => setProfileOpen(false)} title="Profil Member" size="lg">
        <ProfileSection />
      </Modal>
    </div>
  )
}
