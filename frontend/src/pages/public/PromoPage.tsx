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
          <ButtonLink to={isAuthenticated ? '/dashboard/vouchers' : '/register'}>
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
            icon="🎉"
          />
        </div>
      )}

      {banners && banners.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              {banner.image_url && (
                <img src={banner.image_url} alt={banner.title ?? 'Promo'} className="h-48 w-full object-cover" />
              )}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-slate-900">{banner.title ?? 'Promo'}</h3>
                {banner.subtitle && <p className="mt-1 text-sm text-slate-500">{banner.subtitle}</p>}
                {(banner.start_date || banner.end_date) && (
                  <p className="mt-3 text-xs text-slate-400">
                    Berlaku {formatDate(banner.start_date)} – {formatDate(banner.end_date)}
                  </p>
                )}
                {banner.link_url && (
                  <a
                    href={banner.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm font-semibold text-sky-600 hover:text-sky-700"
                  >
                    Selengkapnya →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900">Cara Mendapatkan Promo</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>• Kumpulkan poin dari setiap transaksi yang selesai.</li>
          <li>• Tukarkan poin dengan voucher di halaman Voucher.</li>
          <li>• Gunakan voucher saat membuat booking untuk potongan harga.</li>
        </ul>
        <p className="mt-4 text-xs text-slate-400">
          * Contoh voucher tersedia mulai dari potongan {formatCurrency(10000, currency)}.
        </p>
      </div>
    </Section>
  )
}
