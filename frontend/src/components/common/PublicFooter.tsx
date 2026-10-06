import { Link } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'

const CURRENT_YEAR = new Date().getFullYear()

export function PublicFooter() {
  const { settings, companyProfile, siteName } = useSettings()

  const address = settings?.address ?? companyProfile?.address
  const phone = settings?.phone ?? companyProfile?.phone
  const email = settings?.email ?? companyProfile?.email
  const social = companyProfile?.social_media ?? {}
  const socialEntries = Object.entries(social).filter(([, value]) => Boolean(value))

  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-500 text-sm font-bold text-white">
              W
            </span>
            <span className="text-lg font-bold text-white">{siteName}</span>
          </div>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
            {companyProfile?.description ??
              'Layanan laundry & dry cleaning antar-jemput. Bersih, cepat, dan terpercaya.'}
          </p>
          {socialEntries.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {socialEntries.map(([key, value]) => (
                <a
                  key={key}
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="capitalize text-sky-400 hover:text-sky-300"
                >
                  {key}
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Navigasi</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li><Link to="/layanan" className="hover:text-white">Layanan</Link></li>
            <li><Link to="/store" className="hover:text-white">Cabang</Link></li>
            <li><Link to="/promo" className="hover:text-white">Promo</Link></li>
            <li><Link to="/blog" className="hover:text-white">Artikel</Link></li>
            <li><Link to="/tentang" className="hover:text-white">Tentang Kami</Link></li>
            <li><Link to="/kontak" className="hover:text-white">Kontak</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Hubungi Kami</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            {address && <li>{address}</li>}
            {phone && (
              <li>
                <a href={`tel:${phone}`} className="hover:text-white">{phone}</a>
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`} className="hover:text-white">{email}</a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-5 text-center text-xs text-slate-500">
        © {CURRENT_YEAR} {siteName}. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  )
}
