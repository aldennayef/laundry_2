import axios, { AxiosError, type AxiosInstance } from 'axios'

export const TOKEN_KEY = 'washe_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export const api: AxiosInstance = axios.create({
  baseURL: '/api',
  headers: { Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      setToken(null)
      onUnauthorized?.()
    }
    return Promise.reject(error)
  },
)

/** Ambil pesan error dari response Laravel (`message` / error validasi pertama). */
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined
    if (data?.errors) {
      const first = Object.values(data.errors)[0]
      if (first && first[0]) return first[0]
    }
    if (data?.message) return data.message
    if (error.response?.status === 401) return 'Sesi Anda berakhir. Silakan login kembali.'
    if (!error.response) return 'Tidak dapat terhubung ke server. Coba lagi sebentar lagi.'
  }
  return 'Terjadi kesalahan. Silakan coba lagi.'
}
