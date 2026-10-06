import { Link } from 'react-router-dom'
import type { Booking } from '../../lib/types'
import { StatusBadge } from '../common/StatusBadge'
import { Price } from '../common/Price'
import { formatDate } from '../../lib/format'

export function BookingCard({ booking }: { booking: Booking }) {
  return (
    <Link
      to={`/dashboard/bookings/${booking.id}`}
      className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-sky-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-slate-400">{booking.booking_code}</p>
          <h3 className="mt-1 text-base font-semibold text-slate-900">
            {booking.service?.service_name ?? 'Layanan'}
          </h3>
          <p className="text-sm text-slate-500">{booking.store?.store_name}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-slate-500">
        <span>📅 {formatDate(booking.booking_date ?? booking.created_at)}</span>
        <span className="font-semibold text-slate-800">
          <Price value={booking.final_amount} />
        </span>
      </div>
    </Link>
  )
}
