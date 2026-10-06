import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { getLoyalty } from '../../api/customer'
import { Card, CardBody, CardHeader } from '../../components/common/Card'
import { PageHeader } from '../../components/common/PageHeader'
import { LoadingBlock } from '../../components/common/Spinner'
import { Alert } from '../../components/common/Alert'
import { EmptyState } from '../../components/common/EmptyState'
import { formatCurrency, formatDateTime } from '../../lib/format'
import { useSettings } from '../../context/SettingsContext'

export function LoyaltyPage() {
  useDocumentTitle('Poin Loyalitas')
  const { currency } = useSettings()
  const { data, loading, error } = useAsync(() => getLoyalty(), [])

  if (loading) return <LoadingBlock label="Memuat poin…" />
  if (error) return <Alert tone="error">{error}</Alert>
  if (!data) return null

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Loyalitas"
        title="Poin Loyalitas"
        description="Kumpulkan poin dari setiap transaksi dan tukarkan dengan voucher menarik."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-white">
          <p className="text-sm text-amber-50">Total Poin Anda</p>
          <p className="mt-2 text-4xl font-bold">{data.balance}</p>
          <p className="mt-1 text-xs text-amber-50">poin</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Cara Mendapatkan Poin</p>
          <p className="mt-2 text-sm text-slate-700">
            {data.spend_per_point
              ? `Setiap belanja ${formatCurrency(data.spend_per_point, currency)} Anda mendapatkan 1 poin.`
              : 'Aturan poin belum diatur untuk cabang Anda.'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader title="Riwayat Poin" description="Mutasi poin terbaru Anda." />
        <CardBody>
          {data.transactions.length === 0 ? (
            <EmptyState title="Belum ada transaksi poin" icon="⭐" />
          ) : (
            <ul className="divide-y divide-slate-100">
              {data.transactions.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {tx.note ?? (tx.type === 'earn' ? 'Poin masuk' : 'Poin keluar')}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDateTime(tx.created_at)}
                      {tx.booking_code ? ` • ${tx.booking_code}` : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        tx.points >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {tx.points >= 0 ? '+' : ''}
                      {tx.points}
                    </p>
                    <p className="text-xs text-slate-400">Saldo: {tx.balance_after}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
