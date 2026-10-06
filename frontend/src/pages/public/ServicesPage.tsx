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
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">{store.store_name}</p>
              <p>{store.address}</p>
              {store.operating_hours && <p className="mt-1 text-slate-500">{store.operating_hours}</p>}
            </div>
          )}

          {grouped.length === 0 ? (
            <EmptyState
              title="Layanan belum tersedia"
              description="Cabang ini belum memiliki layanan aktif."
              icon="🧺"
            />
          ) : (
            grouped.map(([category, services]) => (
              <div key={category}>
                <h2 className="text-lg font-bold text-slate-900">{category}</h2>
                {services[0]?.description && (
                  <p className="mt-1 text-sm text-slate-500">{services[0].description}</p>
                )}
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5"
                    >
                      <h3 className="text-base font-semibold text-slate-900">{service.service_name}</h3>
                      <p className="mt-1 flex-1 text-sm text-slate-500">{service.description}</p>
                      <div className="mt-4 flex items-baseline gap-1">
                        <Price value={service.price} className="text-lg font-bold text-sky-700" />
                        {service.unit && <span className="text-sm text-slate-500">/{service.unit}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          <div className="rounded-2xl bg-sky-50 px-6 py-8 text-center">
            <h3 className="text-lg font-bold text-slate-900">Siap memesan?</h3>
            <p className="mt-1 text-sm text-slate-600">
              {isAuthenticated
                ? 'Buat booking baru dan pilih jadwal penjemputan.'
                : 'Masuk atau daftar dulu untuk membuat booking.'}
            </p>
            <div className="mt-5">
              <ButtonLink to={isAuthenticated ? '/dashboard/booking/new' : '/login?redirect=%2Fdashboard%2Fbooking%2Fnew'}>
                {isAuthenticated ? 'Booking Sekarang' : 'Masuk untuk Booking'}
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </Section>
  )
}
