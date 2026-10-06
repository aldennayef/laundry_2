import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Mengembalikan posisi scroll ke atas setiap kali rute berubah.
 * Jika URL memiliki hash (mis. /dashboard#booking), gulir ke elemen
 * yang dituju alih-alih ke atas — dipakai oleh dashboard member single-page.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])

  return null
}
