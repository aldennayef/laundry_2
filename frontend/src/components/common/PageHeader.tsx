import type { ReactNode } from 'react'

/**
 * Header halaman publik/dashboard: eyebrow + judul besar + deskripsi.
 * Dipisah dari konten oleh hairline, tanpa kartu.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="border-b border-ink-200 pb-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          {eyebrow && <span className="eyebrow text-accent-600">{eyebrow}</span>}
          <h1 className="font-display mt-3 text-4xl leading-[1.08] text-ink-900 sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-600">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  )
}
