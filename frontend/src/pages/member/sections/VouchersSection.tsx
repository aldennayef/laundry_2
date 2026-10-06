import { useState } from 'react'
import { useAsync } from '../../../hooks/useAsync'
import { getMyVouchers, getVoucherCatalog, redeemVoucher } from '../../../api/customer'
import { extractErrorMessage } from '../../../api/client'
import { useAuth } from '../../../context/AuthContext'
import { Card, CardBody, CardHeader } from '../../../components/common/Card'
import { LoadingBlock } from '../../../components/common/Spinner'
import { Alert } from '../../../components/common/Alert'
import { EmptyState } from '../../../components/common/EmptyState'
import { Button } from '../../../components/common/Button'
import { formatCurrency, formatDate } from '../../../lib/format'
import { useSettings } from '../../../context/SettingsContext'
import type { Voucher } from '../../../lib/types'
import { Icon } from '../../../components/common/Icon'

export function VouchersSection() {
  const { currency } = useSettings()
  const { user, updateUser } = useAuth()

  const mine = useAsync(() => getMyVouchers(), [])
  const catalog = useAsync(() => getVoucherCatalog(), [])

  const [busyId, setBusyId] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleRedeem(voucher: Voucher) {
    setBusyId(voucher.id)
    setError(null)
    setMessage(null)
    try {
      await redeemVoucher(voucher.id)
      setMessage(`Voucher ${voucher.code} berhasil ditukar.`)
      mine.reload()
      if (user) {
        updateUser({
          ...user,
          balance: Math.max(0, user.balance - (voucher.point_cost ?? 0)),
        })
      }
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader title="Voucher Saya" description="Gunakan saat booking untuk potongan harga." />
        <CardBody className="space-y-4">
          {mine.loading && <LoadingBlock />}
          {mine.data && mine.data.length > 0 ? (
            <div className="space-y-3">
              {mine.data.map((redemption) => (
                <div
                  key={redemption.id}
                  className="rounded-xl border border-dashed border-gold-300 bg-gold-50/50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gold-700">{redemption.voucher.code}</span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium capitalize text-ink-600">
                      {redemption.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-ink-800">
                    {redemption.voucher.description}
                  </p>
                  <p className="mt-1 text-xs text-ink-500">
                    Min. belanja {formatCurrency(redemption.voucher.min_order_amount, currency)}
                  </p>
                  <p className="mt-1 text-xs text-ink-400">
                    Ditukar {formatDate(redemption.redeemed_at)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            !mine.loading && (
              <EmptyState
                title="Belum ada voucher"
                description="Tukarkan poin Anda dengan voucher di samping."
                icon={<Icon name="ticket" size={26} />}
              />
            )
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Katalog Voucher"
          description={`Poin Anda saat ini: ${user?.balance ?? 0}`}
        />
        <CardBody className="space-y-4">
          {message && <Alert tone="success">{message}</Alert>}
          {error && <Alert tone="error">{error}</Alert>}
          {catalog.loading && <LoadingBlock />}

          {catalog.data && catalog.data.length > 0 ? (
            <div className="space-y-3">
              {catalog.data.map((voucher) => {
                const cost = voucher.point_cost ?? 0
                const affordable = (user?.balance ?? 0) >= cost
                return (
                  <div
                    key={voucher.id}
                    className="flex flex-col rounded-xl border border-parchment-200 p-4"
                  >
                    <span className="font-mono text-xs text-ink-400">{voucher.code}</span>
                    <p className="mt-2 text-sm font-medium text-ink-800">{voucher.description}</p>
                    <p className="mt-1 text-xs text-ink-500">
                      Min. belanja {formatCurrency(voucher.min_order_amount, currency)}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600">
                        <Icon name="star" size={14} /> {cost} poin
                      </span>
                      <Button
                        size="sm"
                        variant={affordable ? 'primary' : 'secondary'}
                        disabled={!affordable}
                        loading={busyId === voucher.id}
                        onClick={() => handleRedeem(voucher)}
                      >
                        {affordable ? 'Tukar' : 'Poin kurang'}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            !catalog.loading && (
              <EmptyState title="Katalog voucher kosong" icon={<Icon name="ticket" size={26} />} />
            )
          )}
        </CardBody>
      </Card>
    </div>
  )
}
