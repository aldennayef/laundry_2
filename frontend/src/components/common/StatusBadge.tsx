import { Badge } from './Badge'
import { statusMeta } from '../../lib/status'
import type { BookingStatus } from '../../lib/types'

export function StatusBadge({ status }: { status: BookingStatus }) {
  const meta = statusMeta(status)
  return (
    <Badge className={meta.className}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden="true" />
      {meta.label}
    </Badge>
  )
}
