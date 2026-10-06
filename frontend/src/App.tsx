import { BrowserRouter, Route, Routes } from 'react-router-dom'
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

import { DashboardHomePage } from './pages/member/DashboardHomePage'
import { BookingsPage } from './pages/member/BookingsPage'
import { BookingDetailPage } from './pages/member/BookingDetailPage'
import { NewBookingPage } from './pages/member/NewBookingPage'
import { LoyaltyPage } from './pages/member/LoyaltyPage'
import { VouchersPage } from './pages/member/VouchersPage'
import { AddressPage } from './pages/member/AddressPage'
import { ProfilePage } from './pages/member/ProfilePage'

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

            {/* Member */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<MemberLayout />}>
                <Route index element={<DashboardHomePage />} />
                <Route path="bookings" element={<BookingsPage />} />
                <Route path="bookings/:id" element={<BookingDetailPage />} />
                <Route path="booking/new" element={<NewBookingPage />} />
                <Route path="loyalty" element={<LoyaltyPage />} />
                <Route path="vouchers" element={<VouchersPage />} />
                <Route path="address" element={<AddressPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  )
}
