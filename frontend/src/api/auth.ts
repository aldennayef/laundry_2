import { api } from './client'
import type { ApiEnvelope, AuthResult, RegisterPayload } from './types'
import type { User } from '../lib/types'

export async function login(email: string, password: string): Promise<AuthResult> {
  const res = await api.post<ApiEnvelope<AuthResult>>('/auth/login', {
    email,
    password,
    device_name: 'web',
  })
  return res.data.data
}

export async function register(payload: RegisterPayload): Promise<AuthResult> {
  const res = await api.post<ApiEnvelope<AuthResult>>('/auth/register', payload)
  return res.data.data
}

export async function me(): Promise<User> {
  const res = await api.get<ApiEnvelope<User>>('/auth/me')
  return res.data.data
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}
