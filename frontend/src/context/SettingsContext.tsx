import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import * as publicApi from '../api/public'
import type { AppSetting, CompanyProfile, Store } from '../lib/types'

interface SettingsContextValue {
  settings: AppSetting | null
  companyProfile: CompanyProfile | null
  stores: Store[]
  loading: boolean
  siteName: string
  currency: string
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSetting | null>(null)
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null)
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      const [settingsResult, profileResult, storesResult] = await Promise.allSettled([
        publicApi.getSettings(),
        publicApi.getCompanyProfile(),
        publicApi.getStores(),
      ])
      if (settingsResult.status === 'fulfilled') setSettings(settingsResult.value)
      if (profileResult.status === 'fulfilled') setCompanyProfile(profileResult.value)
      if (storesResult.status === 'fulfilled') setStores(storesResult.value)
      setLoading(false)
    })()
  }, [])

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      companyProfile,
      stores,
      loading,
      siteName:
        settings?.name ?? companyProfile?.company_name ?? 'Washe',
      currency: settings?.currency ?? 'IDR',
    }),
    [settings, companyProfile, stores, loading],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings harus dipakai di dalam <SettingsProvider>')
  return ctx
}
