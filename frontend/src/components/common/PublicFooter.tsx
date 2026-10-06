import { Link } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import { Icon } from './Icon'

const CURRENT_YEAR = new Date().getFullYear()

const NAV = [
  { to: '/layanan', label: 'Layanan' },
  { to: '/store', label: 'Cabang' },
  { to: '/promo', label: 'Promo' },
  { to: '/blog', label: 'Artikel' },
  { to: '/tentang', label: 'Tentang Kami' },
  { to: '/kontak', label: 'Kontak' },
]

export function PublicFooter() {
  const { settings, companyProfile, siteName } = useSettings()

  const address = settings?.address ?? companyProfile?.address
  const phone = settings?.phone ?? companyProfile?.phone
  const email = settings?.email ?? companyProfile?.email
  const social = companyProfile?.social_media ?? {}
  const socialEntries = Object.entries(social).filter(([, value]) => Boolean(value))

  return (
    <footer className="border-t border-white/10 bg-ink-950 text-ink-300">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="font-display grid h-9 w-9 place-items-center rounded-md bg-white/5 text-base font-semibold text-accent-300 ring-1 ring-white/10">
              W
            </span>
            <span className="font-display text-2xl font-semibold leading-none text-white">
              {siteName}
            </span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-400">
            {companyProfile?.description ??
              'Layanan laundry & dry cleaning premium dengan antar-jemput. Bersih, wangi, dan rapi — tanpa Anda perlu keluar rumah.'}
          </p>
          {socialEntries.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {socialEntries.map(([key, value]) => (
                <a
                  key={key}
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-white/10 px-3.5 py-1.5 text-xs capitalize text-ink-300 transition-colors hover:border-accent-500/50 hover:text-accent-200"
                >
                  {key}
                  <Icon name="arrowUpRight" size={13} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
            Navigasi
          </h4>
          <ul className="mt-5 space-y-3 text-sm">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-ink-400 transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
            Hubungi Kami
          </h4>
          <ul className="mt-5 space-y-3.5 text-sm text-ink-400">
            {address && (
              <li className="flex gap-2.5">
                <Icon name="mapPin" size={16} className="mt-0.5 shrink-0 text-ink-500" />
                <span>{address}</span>
              </li>
            )}
            {phone && (
              <li className="flex gap-2.5">
                <Icon name="phone" size={16} className="mt-0.5 shrink-0 text-ink-500" />
                <a href={`tel:${phone}`} className="transition-colors hover:text-white">
                  {phone}
                </a>
              </li>
            )}
            {email && (
              <li className="flex gap-2.5">
                <Icon name="mail" size={16} className="mt-0.5 shrink-0 text-ink-500" />
                <a href={`mailto:${email}`} className="transition-colors hover:text-white">
                  {email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-ink-500 sm:flex-row sm:px-8">
          <span>
            © {CURRENT_YEAR} {siteName}. Seluruh hak cipta dilindungi.
          </span>
          <span className="flex items-center gap-2">
            <Icon name="shield" size={13} className="text-accent-400" />
            Dibuat dengan teliti untuk kenyamanan Anda
          </span>
        </div>
      </div>
    </footer>
  )
}
