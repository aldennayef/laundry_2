import { useSettings } from '../../context/SettingsContext'
import { formatCurrency } from '../../lib/format'

export function Price({ value, className = '' }: { value: number | null | undefined; className?: string }) {
  const { currency } = useSettings()
  return <span className={className}>{formatCurrency(value, currency)}</span>
}
