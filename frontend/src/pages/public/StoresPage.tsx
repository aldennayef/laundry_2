import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useSettings } from '../../context/SettingsContext'
import { PageHeader } from '../../components/common/PageHeader'
import { Section } from '../../components/common/Section'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingBlock } from '../../components/common/Spinner'
import { Icon } from '../../components/common/Icon'

export function StoresPage() {
  useDocumentTitle('Cabang')
  const { stores, loading } = useSettings()

  return (
    <Section>
      <PageHeader
        eyebrow="Lokasi"
        title="Cabang Washe"
        description="Temukan cabang terdekat dan lihat informasi layanan yang tersedia."
      />

      {loading ? (
        <LoadingBlock />
      ) : stores.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="Belum ada cabang" description="Cabang akan segera ditambahkan." icon={<Icon name="mapPin" size={26} />} />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <div
              key={store.id}
              className="group flex flex-col rounded-2xl border border-parchment-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-200 hover:shadow-[0_18px_40px_-26px_rgba(28,25,23,0.35)]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-parchment-100 text-gold-600">
                <Icon name="mapPin" size={20} />
              </span>
              <h3 className="font-display mt-4 text-2xl font-medium text-ink-900">
                {store.store_name}
              </h3>
              <p className="mt-1.5 flex-1 text-sm text-ink-500">
                {store.address ?? 'Alamat belum tersedia'}
                {store.city ? `, ${store.city}` : ''}
              </p>
              {store.operating_hours && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-400">
                  <Icon name="clock" size={13} className="text-gold-500" /> {store.operating_hours}
                </p>
              )}
              {store.phone && (
                <a
                  href={`tel:${store.phone}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-ink-600 hover:text-gold-700"
                >
                  <Icon name="phone" size={14} className="text-gold-500" /> {store.phone}
                </a>
              )}
              <Link
                to={`/store/${store.id}`}
                className="mt-5 inline-flex items-center gap-1.5 border-t border-parchment-200 pt-4 text-sm font-medium text-gold-700 transition-colors hover:text-gold-600"
              >
                Lihat detail & layanan
                <Icon name="arrowRight" size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}
