import { useEffect, useState } from 'react'
import { cancelBooking, getBooking } from '../../api/customer'
import { extractErrorMessage } from '../../api/client'
import { useAsync } from '../../hooks/useAsync'
import { Card, CardBody, CardHeader } from '../common/Card'
import { LoadingBlock } from '../common/Spinner'
import { Alert } from '../common/Alert'
import { Button, ExternalButtonLink } from '../common/Button'
import { StatusBadge } from '../common/StatusBadge'
import { Price } from '../common/Price'
import { Modal } from '../common/Modal'
import { BookingTimeline } from './BookingTimeline'
import { formatDate, formatDateTime } from '../../lib/format'
import { canCancelBooking } from '../../lib/status'
import { buildWhatsAppUrl } from '../../lib/whatsapp'
import { Icon } from '../common/Icon'
import type { Booking } from '../../lib/types'

/**
 * Detail booking dalam modal — dipakai pada halaman member single-page
 * agar tidak perlu berpindah rute.
 */
export function BookingDetailModal({
  bookingId,
  onClose,
  onChanged,
}: {
  bookingId: number | null
  onClose: () => void
  onChanged?: () => void
}) {
  const open = bookingId !== null
  const { data: booking, loading, error, reload } = useAsync<Booking | null>(
    () => (bookingId ? getBooking(bookingId) : Promise.resolve(null)),
    [bookingId],
  )

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    setActionError(null)
    setConfirmOpen(false)
  }, [bookingId])

  async function handleCancel() {
    if (!booking) return
    setCancelling(true)
    setActionError(null)
    try {
      await cancelBooking(booking.id)
      setConfirmOpen(false)
      reload()
      onChanged?.()
    } catch (err) {
      setActionError(extractErrorMessage(err))
    } finally {
      setCancelling(false)
    }
  }

  const waUrl = booking ? buildWhatsAppUrl(booking.store, booking) : null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        booking ? (
          <span className="flex flex-wrap items-center gap-3">
            {booking.service?.service_name ?? 'Booking'}
            <StatusBadge status={booking.status} />
          </span>
        ) : (
          'Detail Booking'
        )
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Tutup
          </Button>
          {waUrl && (
            <ExternalButtonLink href={waUrl}>
              <Icon name="message" size={16} /> WhatsApp
            </ExternalButtonLink>
          )}
        </>
      }
    >
      {loading && <LoadingBlock label="Memuat detail booking…" />}
      {error && <Alert tone="error">{error}</Alert>}
      {actionError && <Alert tone="error">{actionError}</Alert>}

      {booking && (
        <div className="space-y-5">
          <p className="font-mono text-xs text-ink-400">Kode: {booking.booking_code}</p>

          <Card>
            <CardHeader title="Detail Pesanan" />
            <CardBody className="grid gap-3 text-sm sm:grid-cols-2">
              <Row label="Cabang" value={booking.store?.store_name ?? '-'} />
              <Row label="Layanan" value={booking.service?.service_name ?? '-'} />
              <Row label="Paket" value={booking.service_type?.service_type_name ?? '-'} />
              <Row label="Tanggal Booking" value={formatDate(booking.booking_date)} />
              <Row
                label="Jadwal Jemput"
                value={booking.pickup_schedule ? formatDateTime(booking.pickup_schedule) : '-'}
              />
              <Row
                label="Jadwal Antar"
                value={booking.delivery_schedule ? formatDateTime(booking.delivery_schedule) : '-'}
              />
              <Row label="Nama" value={booking.cust_name} />
              <Row label="Telepon" value={booking.cust_phone} />
              {booking.cust_address && <Row label="Alamat" value={booking.cust_address} />}
              {booking.notes && <Row label="Catatan" value={booking.notes} />}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Rincian Biaya" />
            <CardBody className="space-y-3 text-sm">
              <Row label="Estimasi" value={<Price value={booking.estimated_amount} />} />
              {booking.service_type_price > 0 && (
                <Row label="Harga Paket" value={<Price value={booking.service_type_price} />} />
              )}
              {booking.discount_amount > 0 && (
                <Row
                  label={`Diskon${booking.voucher ? ` (${booking.voucher.code})` : ''}`}
                  value={
                    <span className="text-jade-600">
                      -<Price value={booking.discount_amount} />
                    </span>
                  }
                />
              )}
              <div className="flex items-center justify-between border-t border-parchment-200 pt-3">
                <span className="font-semibold text-ink-700">Total</span>
                <Price value={booking.final_amount} className="text-lg font-bold text-ink-900" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Riwayat Status" />
            <CardBody>
              <BookingTimeline logs={booking.status_logs ?? []} />
            </CardBody>
          </Card>

          {canCancelBooking(booking.status) && (
            <Button
              variant="secondary"
              className="w-full text-rose-600 ring-rose-200 hover:bg-rose-50"
              onClick={() => setConfirmOpen(true)}
            >
              Batalkan Booking
            </Button>
          )}
        </div>
      )}

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Batalkan booking?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Tidak
            </Button>
            <Button variant="danger" loading={cancelling} onClick={handleCancel}>
              Ya, batalkan
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-600">
          Booking <span className="font-semibold">{booking?.booking_code}</span> akan dibatalkan.
          Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>
    </Modal>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-parchment-200 pb-2">
      <span className="shrink-0 text-ink-500">{label}</span>
      <span className="text-right font-medium text-ink-800">{value}</span>
    </div>
  )
}
