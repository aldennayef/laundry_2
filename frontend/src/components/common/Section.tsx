import type { ReactNode } from 'react'

export function Section({
  children,
  className = '',
  id,
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16 ${className}`}>
      {children}
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  center,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  center?: boolean
}) {
  return (
    <div className={`${center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}`}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h2>
      {description && <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>}
    </div>
  )
}
