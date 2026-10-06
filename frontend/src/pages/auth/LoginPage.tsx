import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Field'
import { Alert } from '../../components/common/Alert'
import { useAuth } from '../../context/AuthContext'
import { extractErrorMessage } from '../../api/client'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export function LoginPage() {
  useDocumentTitle('Masuk')
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('redirect') ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(redirect, { replace: true })
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Masuk ke akun Anda"
      subtitle="Anda harus masuk untuk membuat dan mengelola booking."
      footer={
        <>
          Belum punya akun?{' '}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="font-semibold text-sky-600 hover:text-sky-700"
          >
            Daftar sekarang
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert tone="error">{error}</Alert>}
        <Input
          label="Email"
          type="email"
          required
          autoComplete="email"
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Kata Sandi"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full" size="lg" loading={submitting}>
          Masuk
        </Button>
      </form>
      <p className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-500">
        Akun demo: <span className="font-medium">customer@washe.test</span> / <span className="font-medium">password</span>
      </p>
    </AuthLayout>
  )
}
