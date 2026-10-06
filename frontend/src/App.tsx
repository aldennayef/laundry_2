import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SettingsProvider } from './context/SettingsContext'
import { ScrollToTop } from './components/common/ScrollToTop'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { RequireGuest } from './components/common/RequireGuest'
import { PublicLayout } from './layouts/PublicLayout'
import { MemberLayout } from './layouts/MemberLayout'

import { HomePage } from './pages/public/HomePage'
import { ServicesPage } from './pages/public/ServicesPage'
import { StoresPage } from './pages/public/StoresPage'
import { StoreDetailPage } from './pages/public/StoreDetailPage'
import { PromoPage } from './pages/public/PromoPage'
import { BlogPage } from './pages/public/BlogPage'
import { BlogDetailPage } from './pages/public/BlogDetailPage'
import { AboutPage } from './pages/public/AboutPage'
import { ContactPage } from './pages/public/ContactPage'
import { StaticPage } from './pages/public/StaticPage'
import { NotFoundPage } from './pages/public/NotFoundPage'

import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'

import { MemberPage } from './pages/member/MemberPage'

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Publik */}
            <Route element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="layanan" element={<ServicesPage />} />
              <Route path="store" element={<StoresPage />} />
              <Route path="store/:id" element={<StoreDetailPage />} />
              <Route path="promo" element={<PromoPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/:slug" element={<BlogDetailPage />} />
              <Route path="tentang" element={<AboutPage />} />
              <Route path="kontak" element={<ContactPage />} />
              <Route path="p/:slug" element={<StaticPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Auth */}
            <Route element={<RequireGuest />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* Member — satu halaman dashboard yang mencakup semua tindakan.
                URL lama tetap dialihkan agar tautan/deep-link tidak rusak. */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<MemberLayout />}>
                <Route index element={<MemberPage />} />

                <Route path="booking/new" element={<Navigate to="/dashboard#booking" replace />} />
                <Route path="bookings" element={<Navigate to="/dashboard#pesanan" replace />} />
                <Route path="bookings/:id" element={<Navigate to="/dashboard#pesanan" replace />} />
                <Route path="loyalty" element={<Navigate to="/dashboard#poin" replace />} />
                <Route path="vouchers" element={<Navigate to="/dashboard#voucher" replace />} />
                <Route path="address" element={<Navigate to="/dashboard#alamat" replace />} />
                <Route path="profile" element={<Navigate to="/dashboard#profil" replace />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  )
}
