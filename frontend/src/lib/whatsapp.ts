import type { Booking, Store } from './types'
import { formatCurrency, formatDate } from './format'

/**
 * Normalisasi nomor WhatsApp Indonesia ke format internasional tanpa tanda
 * baca (contoh: "0812-3456" -> "628123456").
 */
export function normalizeWaNumber(raw: string | null | undefined): string {
  if (!raw) return ''
  let digits = raw.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) digits = digits.slice(1)
  if (digits.startsWith('0')) digits = '62' + digits.slice(1)
  if (digits.startsWith('8')) digits = '62' + digits
  return digits
}

/**
 * Membuat pesan WhatsApp yang merangkum detail booking.
 * Dipakai untuk deeplink ke WhatsApp store setelah booking tersimpan.
 */
export function buildBookingMessage(store: Store | undefined, booking: Booking): string {
  const lines = [
    `*Konfirmasi Booking Washe*`,
    ``,
    `Kode Booking : ${booking.booking_code}`,
    `Status : ${booking.status_label}`,
    `Cabang : ${store?.store_name ?? booking.store?.store_name ?? '-'}`,
    `Layanan : ${booking.service?.service_name ?? '-'}`,
  ]

  if (booking.service_type?.service_type_name) {
    lines.push(`Paket : ${booking.service_type.service_type_name}`)
  }

  lines.push(
    ``,
    `Nama : ${booking.cust_name}`,
    `Telepon : ${booking.cust_phone}`,
  )

  if (booking.cust_address) lines.push(`Alamat : ${booking.cust_address}`)
  if (booking.booking_date) lines.push(`Tanggal Booking : ${formatDate(booking.booking_date)}`)
  if (booking.pickup_schedule) lines.push(`Jadwal Jemput : ${formatDate(booking.pickup_schedule)}`)
  if (booking.delivery_schedule) lines.push(`Jadwal Antar : ${formatDate(booking.delivery_schedule)}`)

  lines.push(
    ``,
    `Estimasi : ${formatCurrency(booking.estimated_amount)}`,
  )

  if (booking.discount_amount > 0) {
    lines.push(`Diskon : -${formatCurrency(booking.discount_amount)}`)
  }

  lines.push(`Total : ${formatCurrency(booking.final_amount)}`)

  if (booking.notes) lines.push(``, `Catatan : ${booking.notes}`)

  lines.push(``, `Mohon konfirmasi booking saya. Terima kasih 🙏`)

  return lines.join('\n')
}

/**
 * URL deeplink WhatsApp. Mengembalikan null jika store tidak punya nomor WA.
 */
export function buildWhatsAppUrl(store: Store | undefined, booking: Booking): string | null {
  const number = normalizeWaNumber(store?.whatsapp_number)
  if (!number) return null
  const text = encodeURIComponent(buildBookingMessage(store, booking))
  return `https://wa.me/${number}?text=${text}`
}
