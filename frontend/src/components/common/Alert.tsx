import type { ReactNode } from 'react'

type Tone = 'info' | 'success' | 'warning' | 'error'

const TONES: Record<Tone, { wrap: string; dot: string }> = {
  info: { wrap: 'bg-parchment-100 text-ink-800 ring-parchment-300', dot: 'bg-ink-500' },
  success: { wrap: 'bg-jade-600/5 text-jade-700 ring-jade-600/20', dot: 'bg-jade-600' },
  warning: { wrap: 'bg-gold-50 text-gold-800 ring-gold-200', dot: 'bg-gold-500' },
  error: { wrap: 'bg-rose-50 text-rose-800 ring-rose-200', dot: 'bg-rose-500' },
}

export function Alert({ tone = 'info', children }: { tone?: Tone; children: ReactNode }) {
  const meta = TONES[tone]
  return (
    <div
      className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm ring-1 ring-inset ${meta.wrap}`}
    >
      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`} aria-hidden="true" />
      <div className="flex-1 leading-relaxed">{children}</div>
    </div>
  )
}
