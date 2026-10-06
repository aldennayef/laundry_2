import type { BookingStatus } from './types'

export const BOOKING_STATUS_ORDER: BookingStatus[] = [
  'pending',
  'confirmed',
  'picked_up',
  'in_progress',
  'completed',
  'delivered',
]

export const BOOKING_STATUS_META: Record<
  BookingStatus,
  { label: string; className: string; dot: string }
> = {
  pending: {
    label: 'Menunggu Konfirmasi',
    className: 'bg-gold-50 text-gold-800 ring-gold-200',
    dot: 'bg-gold-500',
  },
  confirmed: {
    label: 'Dikonfirmasi',
    className: 'bg-ink-50 text-ink-800 ring-ink-200',
    dot: 'bg-ink-500',
  },
  picked_up: {
    label: 'Dijemput',
    className: 'bg-parchment-100 text-ink-700 ring-parchment-300',
    dot: 'bg-ink-600',
  },
  in_progress: {
    label: 'Diproses',
    className: 'bg-jade-600/10 text-jade-700 ring-jade-600/20',
    dot: 'bg-jade-600',
  },
  completed: {
    label: 'Selesai',
    className: 'bg-jade-600/10 text-jade-700 ring-jade-600/20',
    dot: 'bg-jade-600',
  },
  delivered: {
    label: 'Diantar',
    className: 'bg-gold-100 text-gold-800 ring-gold-200',
    dot: 'bg-gold-600',
  },
  cancelled: {
    label: 'Dibatalkan',
    className: 'bg-rose-50 text-rose-700 ring-rose-200',
    dot: 'bg-rose-500',
  },
}

export function statusMeta(status: BookingStatus) {
  return BOOKING_STATUS_META[status] ?? BOOKING_STATUS_META.pending
}

export function canCancelBooking(status: BookingStatus): boolean {
  return status === 'pending' || status === 'confirmed'
}
