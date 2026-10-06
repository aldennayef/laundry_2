import { useMemo, useState } from 'react'
import { useAsync } from '../../../hooks/useAsync'
import { getBookings } from '../../../api/customer'
import { Card, CardBody, CardHeader } from '../../../components/common/Card'
import { LoadingBlock } from '../../../components/common/Spinner'
import { Alert } from '../../../components/common/Alert'
import { EmptyState } from '../../../components/common/EmptyState'
import { BookingCard } from '../../../components/booking/BookingCard'
import { BookingDetailModal } from '../../../components/booking/BookingDetailModal'
import type { Booking, BookingStatus } from '../../../lib/types'
import { Icon } from '../../../components/common/Icon'

const FILTERS: { key: 'all' | 'active' | 'done' | 'cancelled'; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'active', label: 'Aktif' },
  { key: 'done', label: 'Selesai' },
  { key: 'cancelled', label: 'Dibatalkan' },
]

const ACTIVE: BookingStatus[] = ['pending', 'confirmed', 'picked_up', 'in_progress']
const DONE: BookingStatus[] = ['completed', 'delivered']

export function BookingsSection() {
  const { data: bookings, loading, error, reload } = useAsync(() => getBookings(), [])
  const [filter, setFilter] = useState<'all' | 'active' | 'done' | 'cancelled'>('all')
  const [selected, setSelected] = useState<Booking | null>(null)

  const filtered = useMemo(() => {
    const list = bookings ?? []
    if (filter === 'active') return list.filter((b) => ACTIVE.includes(b.status))
    if (filter === 'done') return list.filter((b) => DONE.includes(b.status))
    if (filter === 'cancelled') return list.filter((b) => b.status === 'cancelled')
    return list
  }, [bookings, filter])

  return (
    <>
      <Card>
        <CardHeader
          title="Pesanan Saya"
          description="Lihat dan kelola semua pesanan laundry Anda."
          action={
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFilter(item.key)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                    filter === item.key
                      ? 'bg-ink-900 text-white'
                      : 'bg-parchment-50 text-ink-600 ring-1 ring-parchment-200 hover:bg-parchment-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          }
        />
        <CardBody>
          {loading && <LoadingBlock label="Memuat pesanan…" />}
          {error && <Alert tone="error">{error}</Alert>}

          {!loading && !error && filtered.length === 0 && (
            <EmptyState
              title={filter === 'all' ? 'Belum ada pesanan' : 'Tidak ada pesanan di kategori ini'}
              description="Mulai booking laundry pertama Anda di bagian Booking di atas."
              icon={<Icon name="shirt" size={26} />}
            />
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {filtered.map((booking) => (
                <BookingCard key={booking.id} booking={booking} onSelect={setSelected} />
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <BookingDetailModal
        bookingId={selected?.id ?? null}
        onClose={() => setSelected(null)}
        onChanged={reload}
      />
    </>
  )
}
