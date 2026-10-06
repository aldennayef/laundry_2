import { useState } from 'react'
import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { getDashboard } from '../../api/customer'
import { useAuth } from '../../context/AuthContext'
import { LoadingBlock } from '../../components/common/Spinner'
import { Alert } from '../../components/common/Alert'
import { Price } from '../../components/common/Price'
import { Card, CardBody, CardHeader } from '../../components/common/Card'
import { BookingCard } from '../../components/booking/BookingCard'
import { EmptyState } from '../../components/common/EmptyState'
import { Icon, type IconName } from '../../components/common/Icon'
import { Modal } from '../../components/common/Modal'
import { BookingsSection } from './sections/BookingsSection'
import { NewBookingSection } from './sections/NewBookingSection'
import { LoyaltySection } from './sections/LoyaltySection'
import { VouchersSection } from './sections/VouchersSection'
import { AddressSection } from './sections/AddressSection'

/**
 * Dashboard member compact: ringkasan utama tetap di halaman,
 * sedangkan workflow detail dibuka sebagai panel modal.
 */
export function MemberPage() {
  useDocumentTitle('Dashboard')
  const { user } = useAuth()
  const { data, loading, error } = useAsync(() => getDashboard(), [])
  const [activePanel, setActivePanel] = useState<PanelId | null>(null)

  if (loading) return <LoadingBlock label="Memuat dashboard…" />
  if (error) return <Alert tone="error">{error}</Alert>
  if (!data) return null

  const tier = data.profile.membership_tier
  const name =
    data.profile.username ?? data.profile.email.split('@')[0] ?? user?.email.split('@')[0] ?? 'Member'

  return (
    <div className="space-y-8">
      {/* Sapaan + saldo */}
      <section className="rounded-3xl border border-parchment-200 bg-white px-6 py-7 sm:px-8 sm:py-9">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              <span className="h-px w-6 bg-gold-400" aria-hidden="true" />
              Dashboard
            </p>
            <h1 className="font-display mt-3 text-3xl font-medium leading-tight text-ink-900 sm:text-4xl">
              Welcome home, {name}
            </h1>
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-ink-600">
              Ringkasan aktivitas laundry Anda. Detail seperti booking, pesanan, voucher, alamat, dan
              profil dibuka seperlunya agar dashboard tetap ringkas.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActivePanel('booking')}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink-950 px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-ink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-500"
          >
            Booking Baru
            <Icon name="arrowRight" size={16} />
          </button>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <BalanceCard
            label="Balance"
            value={<Price value={data.profile.balance} />}
            caption="Saldo tersimpan"
            icon="ticket"
          />
          <BalanceCard
            label="Points"
            value={`${data.loyalty_balance}`}
            caption="Poin loyalitas aktif"
            icon="star"
          />
          <BalanceCard
            label="Bonus"
            value={tier ? `${tier.bonus_point_multiplier}x` : '-'}
            caption={tier ? `Bonus poin ${tier.tier_name}` : 'Belum ada bonus'}
            icon="sparkles"
          />
        </div>
      </section>

      {/* Ringkasan aktivitas */}
      <section className="grid gap-4 sm:grid-cols-3">
        <MiniStat label="Total Booking" value={String(data.total_bookings)} icon="shirt" />
        <MiniStat label="Booking Aktif" value={String(data.active_bookings)} icon="clock" />
        <MiniStat
          label="Total Belanja"
          value={<Price value={data.profile.total_spend} />}
          icon="truck"
        />
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PANELS.map((panel) => (
          <ActionTile
            key={panel.id}
            icon={panel.icon}
            title={panel.title}
            description={panel.description}
            meta={getPanelMeta(panel.id, data)}
            onClick={() => setActivePanel(panel.id)}
          />
        ))}
      </section>

      {/* Pesanan terbaru */}
      <Card>
        <CardHeader
          title="Pesanan Terbaru"
          description="Aktivitas terakhir tanpa membuka daftar penuh."
          action={
            <button
              type="button"
              onClick={() => setActivePanel('pesanan')}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-700 hover:text-gold-600"
            >
              Lihat semua
              <Icon name="arrowRight" size={15} />
            </button>
          }
        />
        <CardBody>
          {data.recent_bookings.length === 0 ? (
            <EmptyState
              title="Belum ada pesanan"
              description="Mulai booking laundry pertama Anda di bagian Booking."
              icon={<Icon name="shirt" size={26} />}
            />
          ) : (
            <div className="space-y-3">
              {data.recent_bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <MemberPanel
        activePanel={activePanel}
        onClose={() => setActivePanel(null)}
        onViewBookings={() => setActivePanel('pesanan')}
      />
    </div>
  )
}

type PanelId = 'booking' | 'pesanan' | 'poin' | 'voucher' | 'alamat'

const PANELS: {
  id: PanelId
  title: string
  description: string
  icon: IconName
  modalTitle: string
}[] = [
  {
    id: 'booking',
    title: 'Booking Baru',
    description: 'Buat pesanan dan jadwalkan jemput.',
    icon: 'shirt',
    modalTitle: 'Booking Baru',
  },
  {
    id: 'pesanan',
    title: 'Pesanan Saya',
    description: 'Pantau status dan riwayat pesanan.',
    icon: 'truck',
    modalTitle: 'Pesanan Saya',
  },
  {
    id: 'poin',
    title: 'Poin & Membership',
    description: 'Lihat saldo poin dan mutasi.',
    icon: 'star',
    modalTitle: 'Poin & Membership',
  },
  {
    id: 'voucher',
    title: 'Voucher',
    description: 'Kelola voucher dan penukaran poin.',
    icon: 'ticket',
    modalTitle: 'Voucher',
  },
  {
    id: 'alamat',
    title: 'Alamat',
    description: 'Simpan alamat penjemputan.',
    icon: 'mapPin',
    modalTitle: 'Alamat Penjemputan',
  },
]

function getPanelMeta(id: PanelId, data: Awaited<ReturnType<typeof getDashboard>>) {
  if (id === 'booking') return 'Mulai cepat'
  if (id === 'pesanan') return `${data.active_bookings} aktif`
  if (id === 'poin') return `${data.loyalty_balance} poin`
  if (id === 'voucher') return 'Katalog & milik saya'
  return 'Buku alamat'
}

function ActionTile({
  icon,
  title,
  description,
  meta,
  onClick,
}: {
  icon: IconName
  title: string
  description: string
  meta: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-32 items-start gap-4 rounded-2xl border border-parchment-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-[0_18px_48px_-36px_rgba(12,10,9,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-500"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-parchment-100 text-gold-600 transition group-hover:bg-ink-900 group-hover:text-gold-300">
        <Icon name={icon} size={19} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-3">
          <span className="font-display text-xl font-medium leading-tight text-ink-900">{title}</span>
          <Icon
            name="arrowUpRight"
            size={17}
            className="mt-1 shrink-0 text-ink-300 transition group-hover:text-ink-800"
          />
        </span>
        <span className="mt-1.5 block text-sm leading-relaxed text-ink-500">{description}</span>
        <span className="mt-4 inline-flex rounded-full bg-parchment-50 px-3 py-1 text-xs font-medium text-ink-500 ring-1 ring-parchment-200">
          {meta}
        </span>
      </span>
    </button>
  )
}

function MemberPanel({
  activePanel,
  onClose,
  onViewBookings,
}: {
  activePanel: PanelId | null
  onClose: () => void
  onViewBookings: () => void
}) {
  const panel = PANELS.find((item) => item.id === activePanel)

  return (
    <Modal open={activePanel !== null} onClose={onClose} title={panel?.modalTitle ?? ''} size="xl">
      {activePanel === 'booking' && <NewBookingSection onViewBookings={onViewBookings} />}
      {activePanel === 'pesanan' && <BookingsSection />}
      {activePanel === 'poin' && <LoyaltySection />}
      {activePanel === 'voucher' && <VouchersSection />}
      {activePanel === 'alamat' && <AddressSection />}
    </Modal>
  )
}

function BalanceCard({
  label,
  value,
  caption,
  icon,
}: {
  label: string
  value: React.ReactNode
  caption: string
  icon: IconName
}) {
  return (
    <div className="rounded-2xl border border-parchment-200 bg-parchment-50 p-5">
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-gold-600 ring-1 ring-parchment-200">
          <Icon name={icon} size={19} />
        </span>
        <span className="text-xs font-medium uppercase tracking-wider text-ink-400">{label}</span>
      </div>
      <p className="font-display mt-4 text-3xl font-medium text-ink-900">{value}</p>
      <p className="mt-1 text-xs text-ink-400">{caption}</p>
    </div>
  )
}

function MiniStat({
  label,
  value,
  icon,
}: {
  label: string
  value: React.ReactNode
  icon: IconName
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-parchment-200 bg-white p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-parchment-100 text-gold-600">
        <Icon name={icon} size={18} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-ink-500">{label}</p>
        <p className="font-display truncate text-xl font-medium text-ink-900">{value}</p>
      </div>
    </div>
  )
}
