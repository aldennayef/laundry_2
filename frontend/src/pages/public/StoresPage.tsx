import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useSettings } from '../../context/SettingsContext'
import { PageHeader } from '../../components/common/PageHeader'
import { Section } from '../../components/common/Section'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingBlock } from '../../components/common/Spinner'

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
          <EmptyState title="Belum ada cabang" description="Cabang akan segera ditambahkan." icon="🏬" />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <div
              key={store.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5"
            >
              <h3 className="text-base font-semibold text-slate-900">{store.store_name}</h3>
              <p className="mt-1 text-sm text-slate-500">{store.address ?? 'Alamat belum tersedia'}</p>
              {store.city && <p className="text-sm text-slate-500">{store.city}</p>}
              {store.operating_hours && (
                <p className="mt-3 text-xs text-slate-400">🕒 {store.operating_hours}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                {store.phone && (
                  <a href={`tel:${store.phone}`} className="text-sky-600 hover:text-sky-700">
                    📞 {store.phone}
                  </a>
                )}
              </div>
              <Link
                to={`/store/${store.id}`}
                className="mt-5 inline-block text-sm font-semibold text-sky-600 hover:text-sky-700"
              >
                Lihat detail & layanan →
              </Link>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}
