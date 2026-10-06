import { useAsync } from '../../../hooks/useAsync'
import { getDashboard } from '../../../api/customer'
import { useAuth } from '../../../context/AuthContext'
import { Card, CardBody, CardHeader } from '../../../components/common/Card'
import { LoadingBlock } from '../../../components/common/Spinner'
import { Alert } from '../../../components/common/Alert'
import { Price } from '../../../components/common/Price'
import { formatDate } from '../../../lib/format'
import { Icon } from '../../../components/common/Icon'

export function ProfileSection() {
  const { user } = useAuth()
  const { data, loading, error } = useAsync(() => getDashboard(), [])

  return (
    <Card>
      <CardHeader title="Profil Saya" description="Informasi akun dan status keanggotaan Anda." />
      <CardBody>
        {loading && <LoadingBlock label="Memuat profil…" />}
        {error && <Alert tone="error">{error}</Alert>}

        {data && (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="grid gap-3 text-sm sm:grid-cols-2 lg:col-span-2 lg:content-start">
              <Row label="Nama Pengguna" value={data.profile.username ?? '-'} />
              <Row label="Email" value={data.profile.email} />
              <Row label="Telepon" value={data.profile.phone ?? '-'} />
              <Row label="Status" value={data.profile.is_active ? 'Aktif' : 'Nonaktif'} />
              <Row label="Cabang" value={user?.store?.store_name ?? '-'} />
              <Row label="Terdaftar" value={formatDate(data.profile.created_at)} />
              <Row label="Poin Loyalitas" value={`${data.loyalty_balance} poin`} />
              <Row label="Total Booking" value={String(data.total_bookings)} />
              <Row
                label="Total Belanja"
                value={<Price value={data.profile.total_spend} className="font-semibold text-ink-800" />}
              />
            </div>

            <div className="rounded-2xl border border-parchment-200 bg-parchment-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                Membership
              </p>
              {data.profile.membership_tier ? (
                <>
                  <p className="font-display mt-2 text-3xl font-medium text-ink-900">
                    {data.profile.membership_tier.tier_name}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-ink-600">
                    <li className="flex items-center gap-2">
                      <Icon name="check" size={15} className="text-gold-600" />
                      Diskon {data.profile.membership_tier.discount_percent}%
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="check" size={15} className="text-gold-600" />
                      Bonus poin x{data.profile.membership_tier.bonus_point_multiplier}
                    </li>
                  </ul>
                </>
              ) : (
                <p className="mt-2 text-sm text-ink-500">Anda belum tergabung dalam tier.</p>
              )}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-parchment-200 pb-2">
      <span className="text-ink-500">{label}</span>
      <span className="text-right font-medium text-ink-800">{value}</span>
    </div>
  )
}
