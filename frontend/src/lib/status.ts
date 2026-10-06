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
    className: 'bg-amber-50 text-amber-700 ring-amber-200',
    dot: 'bg-amber-500',
  },
  confirmed: {
    label: 'Dikonfirmasi',
    className: 'bg-blue-50 text-blue-700 ring-blue-200',
    dot: 'bg-blue-500',
  },
  picked_up: {
    label: 'Dijemput',
    className: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    dot: 'bg-indigo-500',
  },
  in_progress: {
    label: 'Diproses',
    className: 'bg-violet-50 text-violet-700 ring-violet-200',
    dot: 'bg-violet-500',
  },
  completed: {
    label: 'Selesai',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    dot: 'bg-emerald-500',
  },
  delivered: {
    label: 'Diantar',
    className: 'bg-teal-50 text-teal-700 ring-teal-200',
    dot: 'bg-teal-500',
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
