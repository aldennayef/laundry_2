import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { createBooking } from '../../../api/customer'
import { extractErrorMessage } from '../../../api/client'
import { useAsync } from '../../../hooks/useAsync'
import { useSettings } from '../../../context/SettingsContext'
import { useAuth } from '../../../context/AuthContext'
import { getAddresses, getMyVouchers } from '../../../api/customer'
import { getStore } from '../../../api/public'
import { Card, CardBody, CardHeader } from '../../../components/common/Card'
import { Button, ExternalButtonLink } from '../../../components/common/Button'
import { Input, Select, Textarea } from '../../../components/common/Field'
import { Alert } from '../../../components/common/Alert'
import { LoadingBlock } from '../../../components/common/Spinner'
import { Price } from '../../../components/common/Price'
import { Modal } from '../../../components/common/Modal'
import { StatusBadge } from '../../../components/common/StatusBadge'
import { formatCurrency, todayIso } from '../../../lib/format'
import { buildWhatsAppUrl } from '../../../lib/whatsapp'
import type { Booking, VoucherRedemption } from '../../../lib/types'
import { Icon } from '../../../components/common/Icon'

export function NewBookingSection({ onViewBookings }: { onViewBookings?: () => void }) {
  const [params] = useSearchParams()
  const { user } = useAuth()
  const { stores, currency } = useSettings()

  const presetStoreId = Number(params.get('store') ?? 0)

  const [storeId, setStoreId] = useState<number | ''>(presetStoreId || stores[0]?.id || '')
  const [serviceId, setServiceId] = useState<number | ''>('')
  const [serviceTypeId, setServiceTypeId] = useState<number | ''>('')
  const [voucherId, setVoucherId] = useState<number | ''>('')

  const [custName, setCustName] = useState(user?.username ?? '')
  const [custPhone, setCustPhone] = useState(user?.phone ?? '')
  const [custAddress, setCustAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [bookingDate, setBookingDate] = useState(todayIso())
  const [pickupSchedule, setPickupSchedule] = useState('')
  const [deliverySchedule, setDeliverySchedule] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Booking | null>(null)

  const activeStoreId = Number(storeId || 0)

  const { data: storeDetail, loading: storeLoading } = useAsync(
    () => (activeStoreId ? getStore(activeStoreId) : Promise.resolve(null)),
    [activeStoreId],
  )

  const { data: addressData } = useAsync(() => getAddresses(), [])
  const { data: myVouchers } = useAsync(() => getMyVouchers(), [])

  const services = useMemo(() => storeDetail?.services ?? [], [storeDetail])
  const categories = useMemo(() => {
    const map = new Map<string, typeof services>()
    for (const service of services) {
      const key = service.category?.category_name ?? 'Lainnya'
      const list = map.get(key) ?? []
      list.push(service)
      map.set(key, list)
    }
    return Array.from(map.entries())
  }, [services])

  const selectedService = services.find((s) => s.id === Number(serviceId))

  const usableVouchers = useMemo<VoucherRedemption[]>(() => {
    const list = myVouchers ?? []
    return list.filter((redemption) => {
      if (redemption.status !== 'active') return false
      const voucher = redemption.voucher
      if (!voucher) return false
      if (voucher.store_id && voucher.store_id !== activeStoreId) return false
      if (voucher.service_id && voucher.service_id !== Number(serviceId)) return false
      return true
    })
  }, [myVouchers, activeStoreId, serviceId])

  const selectedVoucher = usableVouchers.find((r) => r.voucher.id === Number(voucherId))?.voucher ?? null

  const estimatedAmount = selectedService ? selectedService.price : 0
  const discountAmount = useMemo(() => {
    if (!selectedVoucher) return 0
    if (estimatedAmount < selectedVoucher.min_order_amount) return 0
    const raw =
      selectedVoucher.discount_type === 'percent'
        ? (estimatedAmount * selectedVoucher.discount_value) / 100
        : selectedVoucher.discount_value
    const capped = selectedVoucher.max_discount_amount
      ? Math.min(raw, selectedVoucher.max_discount_amount)
      : raw
    return Math.min(capped, estimatedAmount)
  }, [selectedVoucher, estimatedAmount])

  const finalAmount = Math.max(estimatedAmount - discountAmount, 0)

  function handleStoreChange(value: string) {
    setStoreId(value ? Number(value) : '')
    setServiceId('')
    setServiceTypeId('')
    setVoucherId('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!activeStoreId || !serviceId) {
      setError('Lengkapi cabang dan layanan terlebih dahulu.')
      return
    }

    setSubmitting(true)
    try {
      const booking = await createBooking({
        store_id: activeStoreId,
        service_id: Number(serviceId),
        service_type_id: serviceTypeId ? Number(serviceTypeId) : null,
        voucher_id: voucherId ? Number(voucherId) : null,
        cust_name: custName,
        cust_phone: custPhone,
        cust_address: custAddress || null,
        notes: notes || null,
        booking_date: bookingDate,
        pickup_schedule: pickupSchedule || null,
        delivery_schedule: deliverySchedule || null,
      })
      setResult(booking)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (stores.length === 0) {
    return (
      <div className="space-y-4">
        <Alert tone="warning">
          Belum ada cabang aktif sehingga booking tidak dapat dibuat. Silakan hubungi admin.
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && <Alert tone="error">{error}</Alert>}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Pilih Cabang & Layanan" />
            <CardBody className="space-y-4">
              <Select
                label="Cabang"
                required
                value={String(storeId)}
                onChange={(e) => handleStoreChange(e.target.value)}
              >
                <option value="">— Pilih cabang —</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.store_name}
                  </option>
                ))}
              </Select>

              {storeLoading && <LoadingBlock label="Memuat layanan…" />}

              {!storeLoading && storeDetail && (
                <Select
                  label="Layanan"
                  required
                  value={String(serviceId)}
                  onChange={(e) => {
                    setServiceId(e.target.value ? Number(e.target.value) : '')
                    setVoucherId('')
                  }}
                >
                  <option value="">— Pilih layanan —</option>
                  {categories.map(([category, list]) => (
                    <optgroup key={category} label={category}>
                      {list.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.service_name} — {formatCurrency(service.price, currency)}
                          {service.unit ? `/${service.unit}` : ''}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </Select>
              )}

              {selectedService && (
                <div className="rounded-xl bg-parchment-50 px-4 py-3 text-sm text-ink-600">
                  <p className="font-medium text-ink-800">{selectedService.service_name}</p>
                  {selectedService.description && <p>{selectedService.description}</p>}
                  <p className="mt-1">
                    Harga: <Price value={selectedService.price} className="font-semibold" />
                    {selectedService.unit ? `/${selectedService.unit}` : ''}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Detail Penjemputan" />
            <CardBody className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Nama Penerima"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="Nama lengkap"
                />
                <Input
                  label="Nomor Telepon"
                  required
                  type="tel"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <Textarea
                label="Alamat Penjemputan"
                value={custAddress}
                onChange={(e) => setCustAddress(e.target.value)}
                placeholder="Alamat lengkap untuk penjemputan"
                rows={2}
              />

              {addressData && addressData.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {addressData.map((address) => (
                    <button
                      key={address.id}
                      type="button"
                      onClick={() => setCustAddress(address.address)}
                      className="inline-flex items-center gap-1 rounded-full bg-parchment-100 px-3 py-1 text-xs font-medium text-ink-600 hover:bg-parchment-200"
                    >
                      <Icon name="mapPin" size={12} /> {address.label ?? 'Alamat'}: {address.address.slice(0, 24)}
                      {address.address.length > 24 ? '…' : ''}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  label="Tanggal Booking"
                  type="date"
                  required
                  min={todayIso()}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
                <Input
                  label="Jadwal Jemput"
                  type="date"
                  min={todayIso()}
                  value={pickupSchedule}
                  onChange={(e) => setPickupSchedule(e.target.value)}
                />
                <Input
                  label="Jadwal Antar"
                  type="date"
                  min={pickupSchedule || todayIso()}
                  value={deliverySchedule}
                  onChange={(e) => setDeliverySchedule(e.target.value)}
                />
              </div>

              <Textarea
                label="Catatan (opsional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: pisahkan pakaian putih, jangan pakai pewangi."
                rows={2}
              />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Voucher" description="Pilih voucher yang Anda miliki." />
            <CardBody className="space-y-3">
              {usableVouchers.length === 0 ? (
                <p className="text-sm text-ink-500">
                  Tidak ada voucher yang bisa dipakai untuk layanan ini.
                </p>
              ) : (
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-parchment-200 p-3 text-sm">
                    <input
                      type="radio"
                      name="voucher"
                      className="mt-1"
                      checked={voucherId === ''}
                      onChange={() => setVoucherId('')}
                    />
                    <span className="font-medium text-ink-700">Tanpa voucher</span>
                  </label>
                  {usableVouchers.map((redemption) => {
                    const voucher = redemption.voucher
                    const eligible = estimatedAmount >= voucher.min_order_amount
                    return (
                      <label
                        key={redemption.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm ${
                          eligible ? 'border-parchment-200' : 'border-parchment-200 opacity-60'
                        }`}
                      >
                        <input
                          type="radio"
                          name="voucher"
                          className="mt-1"
                          disabled={!eligible}
                          checked={voucherId === voucher.id}
                          onChange={() => setVoucherId(voucher.id)}
                        />
                        <span>
                          <span className="block font-mono text-xs text-ink-400">{voucher.code}</span>
                          <span className="block font-medium text-ink-700">{voucher.description}</span>
                          <span className="block text-xs text-ink-500">
                            Min. belanja {formatCurrency(voucher.min_order_amount, currency)}
                            {!eligible && ' — belum memenuhi syarat'}
                          </span>
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Ringkasan" />
            <CardBody className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-500">Estimasi</span>
                <Price value={estimatedAmount} className="font-medium text-ink-800" />
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-ink-500">Diskon</span>
                  <span className="font-medium text-jade-600">
                    -<Price value={discountAmount} />
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-parchment-200 pt-3">
                <span className="font-semibold text-ink-700">Total Estimasi</span>
                <Price value={finalAmount} className="text-lg font-bold text-ink-900" />
              </div>
              <Button type="submit" className="w-full" size="lg" loading={submitting}>
                Buat Booking
              </Button>
              <p className="text-center text-xs text-ink-400">
                Setelah tersimpan, Anda akan diarahkan ke WhatsApp cabang untuk konfirmasi.
              </p>
            </CardBody>
          </Card>
        </div>
      </form>

      <SuccessModal
        booking={result}
        onClose={() => setResult(null)}
        onView={() => {
          setResult(null)
          if (onViewBookings) {
            onViewBookings()
            return
          }
          document.getElementById('pesanan')?.scrollIntoView({ behavior: 'smooth' })
        }}
      />
    </div>
  )
}

function SuccessModal({
  booking,
  onClose,
  onView,
}: {
  booking: Booking | null
  onClose: () => void
  onView: () => void
}) {
  const waUrl = booking ? buildWhatsAppUrl(booking.store, booking) : null

  return (
    <Modal
      open={booking !== null}
      onClose={onClose}
      title="Booking Berhasil Dibuat"
      footer={
        <>
          <Button variant="ghost" onClick={onView}>
            Lihat Booking
          </Button>
          {waUrl && (
            <ExternalButtonLink href={waUrl}>
              <Icon name="message" size={16} /> Konfirmasi via WhatsApp
            </ExternalButtonLink>
          )}
        </>
      }
    >
      {booking && (
        <div className="space-y-4">
          <Alert tone="success">
            Booking Anda telah tersimpan. Kode booking: <strong>{booking.booking_code}</strong>
          </Alert>
          <div className="flex items-center justify-between">
            <StatusBadge status={booking.status} />
            <Price value={booking.final_amount} className="text-lg font-bold text-ink-900" />
          </div>
          <p className="text-sm text-ink-600">
            Silakan lanjutkan konfirmasi melalui WhatsApp cabang
            {booking.store?.store_name ? ` ${booking.store.store_name}` : ''} agar pesanan segera
            diproses.
          </p>
          {!waUrl && (
            <Alert tone="warning">
              Nomor WhatsApp cabang belum tersedia. Silakan hubungi cabang melalui telepon.
            </Alert>
          )}
        </div>
      )}
    </Modal>
  )
}
