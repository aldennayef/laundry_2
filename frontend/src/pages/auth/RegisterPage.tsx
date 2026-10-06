import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Field'
import { Alert } from '../../components/common/Alert'
import { useAuth } from '../../context/AuthContext'
import { extractErrorMessage } from '../../api/client'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export function RegisterPage() {
  useDocumentTitle('Daftar')
  const { register } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('redirect') ?? '/dashboard'

  const [form, setForm] = useState({
    email: '',
    username: '',
    phone: '',
    password: '',
    password_confirmation: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function update(key: keyof typeof form) {
    return (e: { target: { value: string } }) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await register({
        email: form.email,
        username: form.username || undefined,
        phone: form.phone || undefined,
        password: form.password,
        password_confirmation: form.password_confirmation,
      })
      navigate(redirect, { replace: true })
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Buat akun baru"
      subtitle="Daftar gratis untuk mulai booking laundry."
      footer={
        <>
          Sudah punya akun?{' '}
          <Link
            to={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="font-semibold text-sky-600 hover:text-sky-700"
          >
            Masuk
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert tone="error">{error}</Alert>}
        <Input
          label="Nama Pengguna"
          placeholder="Nama Anda"
          value={form.username}
          onChange={update('username')}
        />
        <Input
          label="Email"
          type="email"
          required
          autoComplete="email"
          placeholder="nama@email.com"
          value={form.email}
          onChange={update('email')}
        />
        <Input
          label="Nomor Telepon"
          type="tel"
          placeholder="08xxxxxxxxxx"
          value={form.phone}
          onChange={update('phone')}
        />
        <Input
          label="Kata Sandi"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Min. 8 karakter, kombinasi huruf & angka"
          value={form.password}
          onChange={update('password')}
        />
        <Input
          label="Konfirmasi Kata Sandi"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Ulangi kata sandi"
          value={form.password_confirmation}
          onChange={update('password_confirmation')}
        />
        <Button type="submit" className="w-full" size="lg" loading={submitting}>
          Daftar
        </Button>
      </form>
    </AuthLayout>
  )
}
