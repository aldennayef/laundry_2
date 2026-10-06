import { useMemo, useState } from 'react'
import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { getStore } from '../../api/public'
import { useSettings } from '../../context/SettingsContext'
import { useAuth } from '../../context/AuthContext'
import { PageHeader } from '../../components/common/PageHeader'
import { Section } from '../../components/common/Section'
import { LoadingBlock } from '../../components/common/Spinner'
import { EmptyState } from '../../components/common/EmptyState'
import { ButtonLink } from '../../components/common/Button'
import { Select } from '../../components/common/Field'
import { Price } from '../../components/common/Price'
import { Alert } from '../../components/common/Alert'
import { Icon } from '../../components/common/Icon'

export function ServicesPage() {
  useDocumentTitle('Layanan')
  const { stores } = useSettings()
  const { isAuthenticated } = useAuth()
  const [storeId, setStoreId] = useState<number | ''>(stores[0]?.id ?? '')

  const activeStoreId = storeId || stores[0]?.id
  const { data: store, loading, error } = useAsync(
    () => (activeStoreId ? getStore(Number(activeStoreId)) : Promise.resolve(null)),
    [activeStoreId],
  )

  const grouped = useMemo(() => {
    if (!store?.services) return []
    const map = new Map<string, typeof store.services>()
    for (const service of store.services) {
      const key = service.category?.category_name ?? 'Lainnya'
      const list = map.get(key) ?? []
      list.push(service)
      map.set(key, list)
    }
    return Array.from(map.entries())
  }, [store])

  return (
    <Section>
      <PageHeader
        eyebrow="Katalog"
        title="Layanan & Harga"
        description="Pilih cabang untuk melihat daftar layanan, harga, dan estimasi pengerjaan."
        action={
          stores.length > 0 && (
            <div className="w-full sm:w-64">
              <Select
                label="Cabang"
                value={String(activeStoreId ?? '')}
                onChange={(e) => setStoreId(Number(e.target.value))}
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.store_name}
                  </option>
                ))}
              </Select>
            </div>
          )
        }
      />

      {stores.length === 0 && (
        <div className="mt-8">
          <Alert tone="warning">Belum ada cabang aktif. Silakan cek kembali nanti.</Alert>
        </div>
      )}

      {loading && <LoadingBlock />}
      {error && (
        <div className="mt-8">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      {store && !loading && (
        <div className="mt-8 space-y-10">
          {store.address && (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-parchment-200 bg-white px-6 py-5 text-sm text-ink-600">
              <span className="font-display text-xl font-medium text-ink-900">{store.store_name}</span>
              <span className="flex items-center gap-1.5">
                <Icon name="mapPin" size={14} className="text-gold-500" /> {store.address}
              </span>
              {store.operating_hours && (
                <span className="flex items-center gap-1.5 text-ink-500">
                  <Icon name="clock" size={14} className="text-gold-500" /> {store.operating_hours}
                </span>
              )}
            </div>
          )}

          {grouped.length === 0 ? (
            <EmptyState
              title="Layanan belum tersedia"
              description="Cabang ini belum memiliki layanan aktif."
              icon={<Icon name="shirt" size={26} />}
            />
          ) : (
            grouped.map(([category, services]) => (
              <div key={category}>
                <h2 className="font-display text-2xl font-medium text-ink-900">{category}</h2>
                {services[0]?.description && (
                  <p className="mt-1 text-sm text-ink-500">{services[0].description}</p>
                )}
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="group flex flex-col rounded-2xl border border-parchment-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-200 hover:shadow-[0_18px_40px_-26px_rgba(28,25,23,0.35)]"
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="font-display text-xl font-medium text-ink-900">
                          {service.service_name}
                        </h3>
                        <Icon
                          name="sparkle"
                          size={18}
                          className="mt-1 shrink-0 text-parchment-300 transition-colors group-hover:text-gold-400"
                        />
                      </div>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                        {service.description}
                      </p>
                      <div className="mt-5 flex items-baseline gap-1.5 border-t border-parchment-200 pt-4">
                        <Price value={service.price} className="text-lg font-semibold text-gold-700" />
                        {service.unit && <span className="text-sm text-ink-500">/ {service.unit}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          <div className="relative overflow-hidden rounded-[1.75rem] bg-ink-950 px-6 py-12 text-center text-white">
            <h3 className="font-display text-3xl font-medium">Siap memesan?</h3>
            <p className="mx-auto mt-3 max-w-md text-sm text-ink-300">
              {isAuthenticated
                ? 'Buat booking baru dan pilih jadwal penjemputan.'
                : 'Masuk atau daftar dulu untuk membuat booking.'}
            </p>
            <div className="mt-5">
              <ButtonLink to={isAuthenticated ? '/dashboard#booking' : '/login?redirect=/dashboard%23booking'} variant="gold" size="lg">
                {isAuthenticated ? 'Booking Sekarang' : 'Masuk untuk Booking'}
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </Section>
  )
}
