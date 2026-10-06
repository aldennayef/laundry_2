import type {
  Address,
  AppSetting,
  Article,
  Banner,
  Booking,
  BookingPayload,
  CompanyProfile,
  Faq,
  Page,
  PointTransaction,
  Service,
  ServiceType,
  Store,
  User,
  Voucher,
  VoucherRedemption,
} from '../lib/types'

export interface ApiEnvelope<T> {
  data: T
  message?: string
}

export interface BookingStats {
  total_bookings: number
  active_bookings: number
}

export interface DashboardData {
  profile: User
  loyalty_balance: number
  total_bookings: number
  active_bookings: number
  recent_bookings: Booking[]
}

export interface AuthResult {
  user: User
  token: string
}

export interface LoyaltyData {
  balance: number
  spend_per_point: number | null
  transactions: PointTransaction[]
}

export interface RegisterPayload {
  email: string
  username?: string
  phone?: string
  password: string
  password_confirmation: string
}

export interface AddressPayload {
  address: string
  label?: string
  latitude?: number | null
  longitude?: number | null
  is_default?: boolean
}

export interface Catalog {
  settings: AppSetting | null
  stores: Store[]
  articles: Article[]
  faqs: Faq[]
  banners: Banner[]
  companyProfile: CompanyProfile | null
}

export type { Service, ServiceType, Store, Booking, BookingPayload, Voucher, VoucherRedemption, PointTransaction, User, Address, Article, Faq, Page, Banner, CompanyProfile, AppSetting }
