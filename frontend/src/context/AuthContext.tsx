import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import * as authApi from '../api/auth'
import { getToken, setToken, setUnauthorizedHandler } from '../api/client'
import type { RegisterPayload } from '../api/types'
import type { User } from '../lib/types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<User>
  register: (payload: RegisterPayload) => Promise<User>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      return
    }
    try {
      const profile = await authApi.me()
      setUser(profile)
    } catch {
      setToken(null)
      setUser(null)
    }
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null))
    return () => setUnauthorizedHandler(null)
  }, [])

  useEffect(() => {
    void (async () => {
      await refresh()
      setLoading(false)
    })()
  }, [refresh])

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login(email, password)
    setToken(result.token)
    setUser(result.user)
    return result.user
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    const result = await authApi.register(payload)
    setToken(result.token)
    setUser(result.user)
    return result.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // Abaikan kegagalan jaringan saat logout — token tetap dibersihkan.
    }
    setToken(null)
    setUser(null)
  }, [])

  const updateUser = useCallback((next: User) => setUser(next), [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
      refresh,
      updateUser,
    }),
    [user, loading, login, register, logout, refresh, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>')
  return ctx
}
