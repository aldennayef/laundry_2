import { useParams } from 'react-router-dom'
import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { getStore } from '../../api/public'
import { PageHeader } from '../../components/common/PageHeader'
import { Section } from '../../components/common/Section'
import { LoadingBlock } from '../../components/common/Spinner'
import { Alert } from '../../components/common/Alert'
import { ButtonLink } from '../../components/common/Button'
import { Price } from '../../components/common/Price'
import { useAuth } from '../../context/AuthContext'

export function StoreDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()
  const storeId = Number(id)
  const { data: store, loading, error } = useAsync(
    () => getStore(storeId),
    [storeId],
  )
  useDocumentTitle(store?.store_name ?? 'Detail Cabang')

  return (
    <Section>
      {loading && <LoadingBlock />}
      {error && <Alert tone="error">{error}</Alert>}

      {store && !loading && (
        <>
          <PageHeader
            eyebrow="Cabang"
            title={store.store_name}
            description={store.address ?? undefined}
            action={
              <ButtonLink to={isAuthenticated ? '/dashboard#booking' : '/login?redirect=/dashboard%23booking'}>
                Booking di Cabang Ini
              </ButtonLink>
            }
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {store.phone && (
              <div className="rounded-2xl border border-parchment-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase text-ink-400">Telepon</p>
                <p className="mt-1 text-sm text-ink-700">{store.phone}</p>
              </div>
            )}
            {store.whatsapp_number && (
              <div className="rounded-2xl border border-parchment-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase text-ink-400">WhatsApp</p>
                <p className="mt-1 text-sm text-ink-700">{store.whatsapp_number}</p>
              </div>
            )}
            {store.operating_hours && (
              <div className="rounded-2xl border border-parchment-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase text-ink-400">Jam Operasional</p>
                <p className="mt-1 text-sm text-ink-700">{store.operating_hours}</p>
              </div>
            )}
          </div>

          <div className="mt-10">
            <h2 className="font-display text-2xl font-medium text-ink-900">Layanan Tersedia</h2>
            {store.services && store.services.length > 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {store.services.map((service) => (
                  <div key={service.id} className="rounded-2xl border border-parchment-200 bg-white p-5">
                    <span className="inline-flex rounded-full bg-gold-50 px-2.5 py-1 text-xs font-medium text-gold-700">
                      {service.category?.category_name ?? 'Layanan'}
                    </span>
                    <h3 className="mt-3 text-base font-semibold text-ink-900">{service.service_name}</h3>
                    <p className="mt-1 text-sm text-ink-500">{service.description}</p>
                    <div className="mt-3 flex items-baseline gap-1">
                      <Price value={service.price} className="text-lg font-bold text-gold-700" />
                      {service.unit && <span className="text-sm text-ink-500">/{service.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink-500">Belum ada layanan untuk cabang ini.</p>
            )}
          </div>

          {store.latitude && store.longitude && (
            <div className="mt-10 overflow-hidden rounded-2xl border border-parchment-200">
              <iframe
                title={`Peta ${store.store_name}`}
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${store.latitude},${store.longitude}&z=16&output=embed`}
              />
            </div>
          )}
        </>
      )}
    </Section>
  )
}
