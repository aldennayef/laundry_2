import { Link } from 'react-router-dom'
import type { Booking } from '../../lib/types'
import { StatusBadge } from '../common/StatusBadge'
import { Price } from '../common/Price'
import { Icon } from '../common/Icon'
import { formatDate } from '../../lib/format'

const SHELL =
  'group block w-full rounded-2xl border border-parchment-200 bg-white p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-200 hover:shadow-[0_18px_40px_-28px_rgba(28,25,23,0.4)]'

export function BookingCard({
  booking,
  onSelect,
}: {
  booking: Booking
  /** Jika diisi, kartu menjadi tombol yang memanggil handler (mis. membuka modal detail). */
  onSelect?: (booking: Booking) => void
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] tracking-wide text-ink-400">{booking.booking_code}</p>
          <h3 className="font-display mt-1 text-xl font-medium text-ink-900">
            {booking.service?.service_name ?? 'Layanan'}
          </h3>
          <p className="text-sm text-ink-500">{booking.store?.store_name}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-parchment-200 pt-4 text-sm text-ink-500">
        <span className="flex items-center gap-1.5">
          <Icon name="clock" size={15} className="text-gold-500" />
          {formatDate(booking.booking_date ?? booking.created_at)}
        </span>
        <span className="ml-auto font-semibold text-ink-900">
          <Price value={booking.final_amount} />
        </span>
        <Icon
          name="arrowRight"
          size={16}
          className="text-ink-300 transition-transform group-hover:translate-x-1 group-hover:text-gold-500"
        />
      </div>
    </>
  )

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(booking)}
        className={SHELL}
        aria-label={`Lihat detail booking ${booking.booking_code}`}
      >
        {body}
      </button>
    )
  }

  return (
    <Link to={`/dashboard/bookings/${booking.id}`} className={SHELL}>
      {body}
    </Link>
  )
}
