import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { getDashboard } from '../../api/customer'
import { Card, CardBody, CardHeader } from '../../components/common/Card'
import { PageHeader } from '../../components/common/PageHeader'
import { LoadingBlock } from '../../components/common/Spinner'
import { Alert } from '../../components/common/Alert'
import { ButtonLink } from '../../components/common/Button'
import { Price } from '../../components/common/Price'
import { formatDate } from '../../lib/format'

export function ProfilePage() {
  useDocumentTitle('Profil')
  const { data, loading, error } = useAsync(() => getDashboard(), [])

  if (loading) return <LoadingBlock label="Memuat profil…" />
  if (error) return <Alert tone="error">{error}</Alert>
  if (!data) return null

  const profile = data.profile

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Akun"
        title="Profil Saya"
        description="Informasi akun dan status keanggotaan Anda."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Data Akun" />
          <CardBody className="grid gap-3 text-sm sm:grid-cols-2">
            <Row label="Nama Pengguna" value={profile.username ?? '-'} />
            <Row label="Email" value={profile.email} />
            <Row label="Telepon" value={profile.phone ?? '-'} />
            <Row label="Status" value={profile.is_active ? 'Aktif' : 'Nonaktif'} />
            <Row label="Cabang" value={profile.store?.store_name ?? '-'} />
            <Row label="Terdaftar" value={formatDate(profile.created_at)} />
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Poin & Belanja" />
            <CardBody className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Poin Loyalitas</span>
                <span className="font-semibold text-amber-600">⭐ {data.loyalty_balance}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Belanja</span>
                <Price value={profile.total_spend} className="font-semibold text-slate-800" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Booking</span>
                <span className="font-semibold text-slate-800">{data.total_bookings}</span>
              </div>
            </CardBody>
          </Card>

          {profile.membership_tier && (
            <Card>
              <CardHeader title="Membership" />
              <CardBody className="space-y-1 text-sm">
                <p className="text-lg font-bold text-slate-900">{profile.membership_tier.tier_name}</p>
                <p className="text-slate-500">
                  Diskon {profile.membership_tier.discount_percent}%
                </p>
                <p className="text-slate-500">
                  Bonus poin x{profile.membership_tier.bonus_point_multiplier}
                </p>
              </CardBody>
            </Card>
          )}

          <ButtonLink to="/dashboard/booking/new" className="w-full">
            + Booking Baru
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-800">{value}</span>
    </div>
  )
}
