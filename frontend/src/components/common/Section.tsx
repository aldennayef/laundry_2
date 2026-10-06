import type { ReactNode } from 'react'

/**
 * Section = pembungkus dengan ritme vertikal lega (banyak ruang putih).
 * Padding dibuat konsisten agar antar-section terasa tenang, bukan bertumpuk.
 */
export function Section({
  children,
  className = '',
  id,
  container = true,
}: {
  children: ReactNode
  className?: string
  id?: string
  container?: boolean
}) {
  return (
    <section id={id} className={className}>
      <div className={container ? 'mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28' : ''}>
        {children}
      </div>
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  center,
  light,
  action,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  center?: boolean
  light?: boolean
  action?: ReactNode
}) {
  return (
    <div
      className={`flex flex-wrap items-end gap-6 ${
        center ? 'flex-col items-center text-center' : 'justify-between'
      }`}
    >
      <div className={center ? 'mx-auto max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && (
          <div className={`flex items-center gap-3 ${center ? 'justify-center' : ''}`}>
            <span className="eyebrow text-accent-600">{eyebrow}</span>
          </div>
        )}
        <h2
          className={`font-display mt-3 text-3xl leading-[1.1] sm:text-4xl lg:text-[2.6rem] ${
            light ? 'text-white' : 'text-ink-900'
          }`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`mt-4 text-base leading-relaxed ${
              light ? 'text-ink-300' : 'text-ink-600'
            }`}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
