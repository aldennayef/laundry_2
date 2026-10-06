import { Link } from 'react-router-dom'
import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { getDashboard } from '../../api/customer'
import { useAuth } from '../../context/AuthContext'
import { PageHeader } from '../../components/common/PageHeader'
import { LoadingBlock } from '../../components/common/Spinner'
import { Alert } from '../../components/common/Alert'
import { EmptyState } from '../../components/common/EmptyState'
import { ButtonLink } from '../../components/common/Button'
import { Price } from '../../components/common/Price'
import { BookingCard } from '../../components/booking/BookingCard'
import { Card, CardBody, CardHeader } from '../../components/common/Card'

export function DashboardHomePage() {
  useDocumentTitle('Dashboard')
  const { user } = useAuth()
  const { data, loading, error } = useAsync(() => getDashboard(), [])

  if (loading) return <LoadingBlock label="Memuat dashboard…" />
  if (error) return <Alert tone="error">{error}</Alert>
  if (!data) return null

  const tier = data.profile.membership_tier

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title={`Halo, ${data.profile.username ?? data.profile.email.split('@')[0]} 👋`}
        description="Ringkasan aktivitas laundry Anda."
        action={<ButtonLink to="/dashboard/booking/new">+ Booking Baru</ButtonLink>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Booking" value={String(data.total_bookings)} icon="🧺" />
        <StatCard label="Booking Aktif" value={String(data.active_bookings)} icon="⏳" />
        <StatCard label="Poin Loyalitas" value={String(data.loyalty_balance)} icon="⭐" />
        <StatCard
          label="Total Belanja"
          value={<Price value={data.profile.total_spend} />}
          icon="💰"
        />
      </div>

      {tier && (
        <Card>
          <CardBody className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                Membership
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">{tier.tier_name}</p>
              <p className="text-sm text-slate-500">
                Diskon {tier.discount_percent}% • Bonus poin x{tier.bonus_point_multiplier}
              </p>
            </div>
            <Link
              to="/dashboard/loyalty"
              className="text-sm font-semibold text-sky-600 hover:text-sky-700"
            >
              Lihat poin →
            </Link>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader
          title="Booking Terbaru"
          description="5 aktivitas booking terakhir Anda."
          action={
            <Link
              to="/dashboard/bookings"
              className="text-sm font-semibold text-sky-600 hover:text-sky-700"
            >
              Semua booking →
            </Link>
          }
        />
        <CardBody>
          {data.recent_bookings.length === 0 ? (
            <EmptyState
              title="Belum ada booking"
              description="Mulai booking laundry pertama Anda sekarang."
              icon="🧺"
              action={<ButtonLink to="/dashboard/booking/new">Booking Sekarang</ButtonLink>}
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

      <Card>
        <CardHeader title="Profil Singkat" />
        <CardBody className="grid gap-3 text-sm sm:grid-cols-2">
          <InfoRow label="Email" value={data.profile.email} />
          <InfoRow label="Telepon" value={data.profile.phone ?? '-'} />
          <InfoRow label="Cabang" value={user?.store?.store_name ?? '-'} />
          <InfoRow
            label="Bergabung"
            value={data.profile.created_at ? new Date(data.profile.created_at).toLocaleDateString('id-ID') : '-'}
          />
        </CardBody>
      </Card>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: React.ReactNode
  icon: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <span className="text-xl" aria-hidden="true">{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  )
}
