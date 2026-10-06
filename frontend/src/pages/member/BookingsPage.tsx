import { useMemo, useState } from 'react'
import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { getBookings } from '../../api/customer'
import { PageHeader } from '../../components/common/PageHeader'
import { LoadingBlock } from '../../components/common/Spinner'
import { Alert } from '../../components/common/Alert'
import { EmptyState } from '../../components/common/EmptyState'
import { ButtonLink } from '../../components/common/Button'
import { BookingCard } from '../../components/booking/BookingCard'
import type { BookingStatus } from '../../lib/types'

const FILTERS: { key: 'all' | 'active' | 'done' | 'cancelled'; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'active', label: 'Aktif' },
  { key: 'done', label: 'Selesai' },
  { key: 'cancelled', label: 'Dibatalkan' },
]

const ACTIVE: BookingStatus[] = ['pending', 'confirmed', 'picked_up', 'in_progress']
const DONE: BookingStatus[] = ['completed', 'delivered']

export function BookingsPage() {
  useDocumentTitle('Booking Saya')
  const { data: bookings, loading, error } = useAsync(() => getBookings(), [])
  const [filter, setFilter] = useState<'all' | 'active' | 'done' | 'cancelled'>('all')

  const filtered = useMemo(() => {
    const list = bookings ?? []
    if (filter === 'active') return list.filter((b) => ACTIVE.includes(b.status))
    if (filter === 'done') return list.filter((b) => DONE.includes(b.status))
    if (filter === 'cancelled') return list.filter((b) => b.status === 'cancelled')
    return list
  }, [bookings, filter])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Booking"
        title="Booking Saya"
        description="Lihat dan kelola semua booking laundry Anda."
        action={<ButtonLink to="/dashboard/booking/new">+ Booking Baru</ButtonLink>}
      />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === item.key
                ? 'bg-sky-600 text-white'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading && <LoadingBlock label="Memuat booking…" />}
      {error && <Alert tone="error">{error}</Alert>}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          title={filter === 'all' ? 'Belum ada booking' : 'Tidak ada booking di kategori ini'}
          description="Mulai booking laundry pertama Anda sekarang."
          icon="🧺"
          action={<ButtonLink to="/dashboard/booking/new">Booking Sekarang</ButtonLink>}
        />
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  )
}
