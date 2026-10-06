import type { ReactNode } from 'react'

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string
  description?: string
  action?: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-parchment-300 bg-parchment-50 px-6 py-16 text-center">
      {icon && (
        <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-gold-500 ring-1 ring-parchment-200">
          {icon}
        </span>
      )}
      <h3 className="font-display mt-5 text-xl font-medium text-ink-900">{title}</h3>
      {description && <p className="mt-1.5 max-w-md text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
