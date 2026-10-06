import type { ReactNode } from 'react'

type Tone = 'info' | 'success' | 'warning' | 'error'

const TONES: Record<Tone, { wrap: string; icon: string }> = {
  info: { wrap: 'bg-sky-50 text-sky-800 ring-sky-200', icon: 'ℹ️' },
  success: { wrap: 'bg-emerald-50 text-emerald-800 ring-emerald-200', icon: '✅' },
  warning: { wrap: 'bg-amber-50 text-amber-800 ring-amber-200', icon: '⚠️' },
  error: { wrap: 'bg-rose-50 text-rose-800 ring-rose-200', icon: '⛔' },
}

export function Alert({ tone = 'info', children }: { tone?: Tone; children: ReactNode }) {
  const meta = TONES[tone]
  return (
    <div className={`flex items-start gap-2 rounded-lg px-4 py-3 text-sm ring-1 ring-inset ${meta.wrap}`}>
      <span aria-hidden="true">{meta.icon}</span>
      <div className="flex-1">{children}</div>
    </div>
  )
}
