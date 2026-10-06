import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Spinner } from './Spinner'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'whatsapp' | 'accent' | 'outlineLight' | 'gold'
type Size = 'sm' | 'md' | 'lg'

/**
 * Tombol bergaya "quiet premium": kontras tinggi, radius kecil, dan transisi halus.
 */
const VARIANTS: Record<Variant, string> = {
  primary: 'bg-ink-950 text-white shadow-[0_16px_30px_-22px_rgba(12,10,9,0.85)] hover:bg-ink-800 focus-visible:outline-ink-900',
  secondary:
    'bg-white/70 text-ink-900 ring-1 ring-inset ring-ink-300 hover:bg-white hover:ring-ink-900 focus-visible:outline-ink-900',
  ghost: 'bg-transparent text-ink-600 hover:text-ink-900 hover:bg-ink-50 focus-visible:outline-ink-500',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-rose-600',
  whatsapp: 'bg-sage-600 text-white hover:bg-sage-600/90 focus-visible:outline-sage-600',
  accent: 'bg-accent-600 text-white shadow-[0_16px_30px_-22px_rgba(96,70,45,0.8)] hover:bg-accent-700 focus-visible:outline-accent-600',
  // 'gold' dipertahankan sebagai alias historis.
  gold: 'bg-accent-600 text-white shadow-[0_16px_30px_-22px_rgba(96,70,45,0.8)] hover:bg-accent-700 focus-visible:outline-accent-600',
  outlineLight:
    'bg-transparent text-white ring-1 ring-inset ring-white/40 hover:bg-white hover:text-ink-900 focus-visible:outline-white',
}

const SIZES: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-sm',
}

const BASE =
  'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md font-medium tracking-wide transition duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  )
}

interface ButtonLinkProps {
  to: string
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
}: ButtonLinkProps) {
  return (
    <Link to={to} className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}>
      {children}
    </Link>
  )
}

interface ExternalButtonLinkProps {
  href: string
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

export function ExternalButtonLink({
  href,
  variant = 'whatsapp',
  size = 'md',
  className = '',
  children,
}: ExternalButtonLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {children}
    </a>
  )
}
