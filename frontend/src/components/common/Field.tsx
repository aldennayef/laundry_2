import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const INPUT_CLASS =
  'block w-full rounded-xl border-0 bg-white px-4 py-2.5 text-sm text-ink-900 shadow-sm ring-1 ring-inset ring-parchment-300 placeholder:text-ink-400 focus:ring-2 focus:ring-inset focus:ring-gold-500 disabled:bg-parchment-100 disabled:text-ink-400'

interface FieldShellProps {
  label?: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactNode
}

export function FieldShell({ label, hint, error, required, children }: FieldShellProps) {
  return (
    <label className="block space-y-1.5">
      {label && (
        <span className="block text-sm font-medium text-ink-700">
          {label}
          {required && <span className="text-gold-600"> *</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="block text-xs text-ink-500">{hint}</span>}
      {error && <span className="block text-xs font-medium text-rose-600">{error}</span>}
    </label>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export function Input({ label, hint, error, className = '', ...props }: InputProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={props.required}>
      <input className={`${INPUT_CLASS} ${className}`} {...props} />
    </FieldShell>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
}

export function Textarea({ label, hint, error, className = '', ...props }: TextareaProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={props.required}>
      <textarea className={`${INPUT_CLASS} ${className}`} rows={3} {...props} />
    </FieldShell>
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  hint?: string
  error?: string
}

export function Select({ label, hint, error, className = '', children, ...props }: SelectProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={props.required}>
      <select className={`${INPUT_CLASS} ${className}`} {...props}>
        {children}
      </select>
    </FieldShell>
  )
}
