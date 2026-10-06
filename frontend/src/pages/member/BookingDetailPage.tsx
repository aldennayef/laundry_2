import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { cancelBooking, getBooking } from '../../api/customer'
import { extractErrorMessage } from '../../api/client'
import { Card, CardBody, CardHeader } from '../../components/common/Card'
import { PageHeader } from '../../components/common/PageHeader'
import { LoadingBlock } from '../../components/common/Spinner'
import { Alert } from '../../components/common/Alert'
import { Button, ExternalButtonLink } from '../../components/common/Button'
import { StatusBadge } from '../../components/common/StatusBadge'
import { Price } from '../../components/common/Price'
import { BookingTimeline } from '../../components/booking/BookingTimeline'
import { Modal } from '../../components/common/Modal'
import { formatDate, formatDateTime } from '../../lib/format'
import { canCancelBooking } from '../../lib/status'
import { buildWhatsAppUrl } from '../../lib/whatsapp'

export function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: booking, loading, error, reload } = useAsync(() => getBooking(id ?? ''), [id])
  useDocumentTitle(booking ? `Booking ${booking.booking_code}` : 'Detail Booking')

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  async function handleCancel() {
    if (!booking) return
    setCancelling(true)
    setActionError(null)
    try {
      await cancelBooking(booking.id)
      setConfirmOpen(false)
      reload()
    } catch (err) {
      setActionError(extractErrorMessage(err))
    } finally {
      setCancelling(false)
    }
  }

  if (loading) return <LoadingBlock label="Memuat detail booking…" />
  if (error) return <Alert tone="error">{error}</Alert>
  if (!booking) return null

  const waUrl = buildWhatsAppUrl(booking.store, booking)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Detail Booking"
        title={booking.service?.service_name ?? 'Booking'}
        description={`Kode: ${booking.booking_code}`}
        action={<StatusBadge status={booking.status} />}
      />

      {actionError && <Alert tone="error">{actionError}</Alert>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Detail Pesanan" />
            <CardBody className="grid gap-3 text-sm sm:grid-cols-2">
              <Row label="Cabang" value={booking.store?.store_name ?? '-'} />
              <Row label="Layanan" value={booking.service?.service_name ?? '-'} />
              <Row label="Paket" value={booking.service_type?.service_type_name ?? '-'} />
              <Row label="Tanggal Booking" value={formatDate(booking.booking_date)} />
              <Row label="Jadwal Jemput" value={booking.pickup_schedule ? formatDateTime(booking.pickup_schedule) : '-'} />
              <Row label="Jadwal Antar" value={booking.delivery_schedule ? formatDateTime(booking.delivery_schedule) : '-'} />
              <Row label="Nama" value={booking.cust_name} />
              <Row label="Telepon" value={booking.cust_phone} />
              {booking.cust_address && <Row label="Alamat" value={booking.cust_address} />}
              {booking.notes && <Row label="Catatan" value={booking.notes} />}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Riwayat Status" />
            <CardBody>
              <BookingTimeline logs={booking.status_logs ?? []} />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
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
                  value={<span className="text-emerald-600">-<Price value={booking.discount_amount} /></span>}
                />
              )}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="font-semibold text-slate-700">Total</span>
                <Price value={booking.final_amount} className="text-lg font-bold text-slate-900" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-2">
              {waUrl && (
                <ExternalButtonLink href={waUrl} className="w-full">
                  💬 Hubungi via WhatsApp
                </ExternalButtonLink>
              )}
              {canCancelBooking(booking.status) && (
                <Button
                  variant="secondary"
                  className="w-full text-rose-600 ring-rose-200 hover:bg-rose-50"
                  onClick={() => setConfirmOpen(true)}
                >
                  Batalkan Booking
                </Button>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

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
        <p className="text-sm text-slate-600">
          Booking <span className="font-semibold">{booking.booking_code}</span> akan dibatalkan. Tindakan
          ini tidak dapat dibatalkan.
        </p>
      </Modal>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
      <span className="shrink-0 text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-800">{value}</span>
    </div>
  )
}
