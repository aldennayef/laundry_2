import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import { Icon } from '../../components/common/Icon'

const CURRENT_YEAR = new Date().getFullYear()

const PERKS = [
  { icon: 'truck' as const, text: 'Antar jemput gratis di area layanan' },
  { icon: 'star' as const, text: 'Kumpulkan poin dari setiap transaksi' },
  { icon: 'message' as const, text: 'Konfirmasi pesanan via WhatsApp' },
]

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
    <div className="flex min-h-screen flex-col bg-parchment-50">
      <div className="grid flex-1 lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-ink-950 p-12 text-white lg:flex">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-gold-500/20 blur-[120px]" />
            <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-gold-600/10 blur-[130px]" />
          </div>
          <Link to="/" className="relative flex items-center gap-2.5">
            <span className="font-display grid h-9 w-9 place-items-center rounded-full bg-white/10 text-base font-semibold text-gold-300 ring-1 ring-white/10">
              W
            </span>
            <span className="font-display text-xl font-semibold tracking-wide">{siteName}</span>
          </Link>
          <div className="relative">
            <h2 className="font-display max-w-md text-4xl font-medium leading-tight">
              Laundry premium, hanya dengan beberapa sentuhan.
            </h2>
            <ul className="mt-8 space-y-4 text-sm text-ink-300">
              {PERKS.map((perk) => (
                <li key={perk.text} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gold-500/15 text-gold-300">
                    <Icon name={perk.icon} size={16} />
                  </span>
                  {perk.text}
                </li>
              ))}
            </ul>
          </div>
          <p className="relative text-xs text-ink-500">
            © {CURRENT_YEAR} {siteName}
          </p>
        </div>

        <div className="flex flex-col justify-center px-4 py-12 sm:px-10">
          <div className="mx-auto w-full max-w-md">
            <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
              <span className="font-display grid h-9 w-9 place-items-center rounded-full bg-ink-900 text-base font-semibold text-gold-300">
                W
              </span>
              <span className="font-display text-xl font-semibold tracking-wide text-ink-900">
                {siteName}
              </span>
            </Link>
            <h1 className="font-display text-3xl font-medium text-ink-900">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-ink-500">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 text-sm text-ink-500">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
