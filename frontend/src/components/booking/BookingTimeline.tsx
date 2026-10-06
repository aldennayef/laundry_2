import type { BookingStatusLog } from '../../lib/types'
import { statusMeta } from '../../lib/status'
import { formatDateTime } from '../../lib/format'

export function BookingTimeline({ logs }: { logs: BookingStatusLog[] }) {
  if (!logs || logs.length === 0) {
    return <p className="text-sm text-slate-500">Belum ada riwayat status.</p>
  }

  const ordered = [...logs].sort(
    (a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime(),
  )

  return (
    <ol className="relative space-y-5 border-l border-slate-200 pl-6">
      {ordered.map((log) => {
        const meta = statusMeta(log.status)
        return (
          <li key={log.id} className="relative">
            <span
              className={`absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full ring-4 ring-white ${meta.dot}`}
              aria-hidden="true"
            />
            <p className="text-sm font-semibold text-slate-800">{log.status_label}</p>
            <p className="text-xs text-slate-400">{formatDateTime(log.created_at)}</p>
            {log.note && <p className="mt-1 text-sm text-slate-500">{log.note}</p>}
          </li>
        )
      })}
    </ol>
  )
}
