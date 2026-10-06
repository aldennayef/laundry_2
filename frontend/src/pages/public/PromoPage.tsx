import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { getBanners } from '../../api/public'
import { PageHeader } from '../../components/common/PageHeader'
import { Section } from '../../components/common/Section'
import { LoadingBlock } from '../../components/common/Spinner'
import { EmptyState } from '../../components/common/EmptyState'
import { Alert } from '../../components/common/Alert'
import { useSettings } from '../../context/SettingsContext'
import { useAuth } from '../../context/AuthContext'
import { ButtonLink } from '../../components/common/Button'
import { formatDate } from '../../lib/format'
import { formatCurrency } from '../../lib/format'
import { Icon } from '../../components/common/Icon'

export function PromoPage() {
  useDocumentTitle('Promo')
  const { isAuthenticated } = useAuth()
  const { currency } = useSettings()
  const { data: banners, loading, error } = useAsync(() => getBanners(), [])

  return (
    <Section>
      <PageHeader
        eyebrow="Penawaran"
        title="Promo & Penawaran Spesial"
        description="Manfaatkan promo terbaru dan kumpulkan poin untuk ditukar dengan voucher."
        action={
          <ButtonLink to={isAuthenticated ? '/dashboard#voucher' : '/register'} variant="gold">
            {isAuthenticated ? 'Voucher Saya' : 'Daftar untuk Klaim'}
          </ButtonLink>
        }
      />

      {loading && <LoadingBlock />}
      {error && <div className="mt-6"><Alert tone="error">{error}</Alert></div>}

      {banners && banners.length === 0 && (
        <div className="mt-8">
          <EmptyState
            title="Belum ada promo"
            description="Promo baru akan segera hadir. Pantau terus halaman ini."
            icon={<Icon name="sparkles" size={26} />}
          />
        </div>
      )}

      {banners && banners.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="group overflow-hidden rounded-2xl border border-parchment-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold-200 hover:shadow-[0_20px_45px_-28px_rgba(28,25,23,0.4)]"
            >
              {banner.image_url && (
                <div className="h-52 overflow-hidden bg-parchment-100">
                  <img
                    src={banner.image_url}
                    alt={banner.title ?? 'Promo'}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-display text-2xl font-medium text-ink-900">{banner.title ?? 'Promo'}</h3>
                {banner.subtitle && <p className="mt-1 text-sm text-ink-500">{banner.subtitle}</p>}
                {(banner.start_date || banner.end_date) && (
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-400">
                    <Icon name="clock" size={13} className="text-gold-500" />
                    Berlaku {formatDate(banner.start_date)} – {formatDate(banner.end_date)}
                  </p>
                )}
                {banner.link_url && (
                  <a
                    href={banner.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold-700 hover:text-gold-600"
                  >
                    Selengkapnya <Icon name="arrowUpRight" size={15} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-14 rounded-2xl border border-parchment-200 bg-white p-8">
        <h2 className="font-display text-2xl font-medium text-ink-900">Cara Mendapatkan Promo</h2>
        <ul className="mt-5 grid gap-3 text-sm text-ink-600 sm:grid-cols-3">
          {[
            'Kumpulkan poin dari setiap transaksi yang selesai.',
            'Tukarkan poin dengan voucher di halaman Voucher.',
            'Gunakan voucher saat booking untuk potongan harga.',
          ].map((line) => (
            <li key={line} className="flex gap-2.5 rounded-xl bg-parchment-50 px-4 py-3">
              <Icon name="check" size={16} className="mt-0.5 shrink-0 text-gold-600" />
              {line}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-ink-400">
          * Contoh voucher tersedia mulai dari potongan {formatCurrency(10000, currency)}.
        </p>
      </div>
    </Section>
  )
}
