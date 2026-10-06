import { useAsync } from '../../../hooks/useAsync'
import { getLoyalty } from '../../../api/customer'
import { Card, CardBody, CardHeader } from '../../../components/common/Card'
import { LoadingBlock } from '../../../components/common/Spinner'
import { Alert } from '../../../components/common/Alert'
import { EmptyState } from '../../../components/common/EmptyState'
import { formatCurrency, formatDateTime } from '../../../lib/format'
import { useSettings } from '../../../context/SettingsContext'
import { Icon } from '../../../components/common/Icon'

export function LoyaltySection() {
  const { currency } = useSettings()
  const { data, loading, error } = useAsync(() => getLoyalty(), [])

  return (
    <Card>
      <CardHeader
        title="Poin Loyalitas"
        description="Kumpulkan poin dari setiap transaksi dan tukarkan dengan voucher."
      />
      <CardBody className="space-y-5">
        {loading && <LoadingBlock label="Memuat poin…" />}
        {error && <Alert tone="error">{error}</Alert>}

        {data && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-ink-900 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">
                  Total Poin
                </p>
                <p className="font-display mt-2 text-4xl font-medium">{data.balance}</p>
                <p className="mt-1 text-xs text-ink-300">poin tersedia</p>
              </div>
              <div className="rounded-2xl border border-parchment-200 p-6">
                <p className="text-sm font-medium text-ink-700">Cara Mendapatkan Poin</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {data.spend_per_point
                    ? `Setiap belanja ${formatCurrency(data.spend_per_point, currency)} Anda mendapatkan 1 poin.`
                    : 'Aturan poin belum diatur untuk cabang Anda.'}
                </p>
              </div>
            </div>

            {data.transactions.length === 0 ? (
              <EmptyState title="Belum ada transaksi poin" icon={<Icon name="star" size={26} />} />
            ) : (
              <ul className="divide-y divide-parchment-200">
                {data.transactions.map((tx) => (
                  <li key={tx.id} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-ink-800">
                        {tx.note ?? (tx.type === 'earn' ? 'Poin masuk' : 'Poin keluar')}
                      </p>
                      <p className="text-xs text-ink-400">
                        {formatDateTime(tx.created_at)}
                        {tx.booking_code ? ` • ${tx.booking_code}` : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold ${
                          tx.points >= 0 ? 'text-jade-600' : 'text-rose-600'
                        }`}
                      >
                        {tx.points >= 0 ? '+' : ''}
                        {tx.points}
                      </p>
                      <p className="text-xs text-ink-400">Saldo: {tx.balance_after}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </CardBody>
    </Card>
  )
}
