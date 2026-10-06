import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'

const CURRENT_YEAR = new Date().getFullYear()

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}) {
  const { siteName } = useSettings()

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="grid flex-1 lg:grid-cols-2">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-800 p-12 text-white lg:flex">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/20 text-sm font-bold">
              W
            </span>
            <span className="text-lg font-bold">{siteName}</span>
          </Link>
          <div>
            <h2 className="text-3xl font-bold leading-tight">
              Laundry bersih & rapi, hanya dengan beberapa klik.
            </h2>
            <ul className="mt-6 space-y-3 text-sm text-sky-100">
              <li>🚚 Antra jemput gratis di area layanan</li>
              <li>⭐ Kumpulkan poin setiap transaksi</li>
              <li>💬 Konfirmasi pesanan langsung ke WhatsApp cabang</li>
            </ul>
          </div>
          <p className="text-xs text-sky-200">© {CURRENT_YEAR} {siteName}</p>
        </div>

        <div className="flex flex-col justify-center px-4 py-12 sm:px-10">
          <div className="mx-auto w-full max-w-md">
            <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-600 text-sm font-bold text-white">
                W
              </span>
              <span className="text-lg font-bold text-slate-900">{siteName}</span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            <div className="mt-6">{children}</div>
            {footer && <div className="mt-6 text-sm text-slate-500">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
