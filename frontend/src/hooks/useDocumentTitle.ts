import { useEffect } from 'react'
import { useSettings } from '../context/SettingsContext'

export function useDocumentTitle(title?: string): void {
  const { siteName } = useSettings()
  useEffect(() => {
    document.title = title ? `${title} — ${siteName}` : siteName
  }, [title, siteName])
}
