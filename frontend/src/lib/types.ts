// ---------------------------------------------------------------------------
// Tipe data — mencerminkan Resource backend Washe (lihat app/Http/Resources).
// ---------------------------------------------------------------------------

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'picked_up'
  | 'in_progress'
  | 'completed'
  | 'delivered'
  | 'cancelled'

export interface User {
  id: number
  email: string
  username: string | null
  phone: string | null
  balance: number
  total_spend: number
  is_active: boolean
  role?: string | null
  store?: { id: number; store_name: string } | null
  membership_tier?: MembershipTier | null
  created_at: string | null
}

export interface MembershipTier {
  id: number
  tier_name: string
  discount_percent: number
  bonus_point_multiplier: number
}

export interface Store {
  id: number
  store_name: string
  phone: string | null
  whatsapp_number: string | null
  email: string | null
  address: string | null
  city: string | null
  latitude: number | null
  longitude: number | null
  operating_hours: string | null
  is_active: boolean
  services?: Service[]
  categories?: ServiceCategory[]
  schedules?: OrderSchedule[]
}

export interface ServiceCategory {
  id: number
  store_id: number
  category_name: string
  description: string | null
  services?: Service[]
}

export interface Service {
  id: number
  service_category_id: number
  store_id: number
  service_unit_id: number
  service_name: string
  price: number
  description: string | null
  is_active: boolean
  unit?: string | null
  category?: ServiceCategory
  store?: Store
}

export interface ServiceType {
  id: number
  service_type_name: string
  processing_time: number | null
  processing_time_unit: string | null
  price: number
}

export interface OrderSchedule {
  id: number
  store_id: number
  day: string | null
  start_time: string | null
  end_time: string | null
  type: string | null
  is_active: boolean
}

export interface Voucher {
  id: number
  code: string
  store_id: number | null
  membership_tier_id: number | null
  service_id: number | null
  discount_type: 'fixed' | 'percent'
  discount_value: number
  min_order_amount: number
  max_discount_amount: number | null
  redeem_quota: number | null
  quota_per_user: number | null
  point_cost: number | null
  start_time: string | null
  end_time: string | null
  is_active: boolean
  description: string | null
  store?: Store
  membership_tier?: MembershipTier
  service?: Service
}

export interface Booking {
  id: number
  booking_code: string
  status: BookingStatus
  status_label: string
  cust_name: string
  cust_phone: string
  cust_address: string | null
  notes: string | null
  booking_date: string | null
  pickup_schedule: string | null
  delivery_schedule: string | null
  estimated_amount: number
  service_type_price: number
  discount_amount: number
  final_amount: number
  store?: Store
  service?: Service
  service_type?: ServiceType | null
  voucher?: Voucher | null
  customer?: User
  status_logs?: BookingStatusLog[]
  created_at: string | null
}

export interface BookingStatusLog {
  id: number
  status: BookingStatus
  status_label: string
  note: string | null
  changed_by: string | null
  created_at: string | null
}

export interface Address {
  id: number
  address: string
  latitude: number | null
  longitude: number | null
  label: string | null
  is_default: boolean
}

export interface PointTransaction {
  id: number
  type: string
  points: number
  balance_after: number
  note: string | null
  booking_code: string | null
  created_at: string | null
}

export interface VoucherRedemption {
  id: number
  voucher_id: number
  points_used: number
  status: string
  redeemed_at: string | null
  used_at: string | null
  voucher: Voucher
}

export interface Article {
  id: number
  title: string
  slug: string
  content?: string
  excerpt: string | null
  thumbnail_url: string | null
  published_at: string | null
  is_active: boolean
  author?: string | null
}

export interface Faq {
  id: number
  faq_category_id: number | null
  question: string
  answer: string
  sort_order: number
  is_active: boolean
  category?: string | null
}

export interface Page {
  id: number
  slug: string
  title: string
  content: string
  meta_title: string | null
  meta_description: string | null
  is_active: boolean
}

export interface Banner {
  id: number
  title: string | null
  subtitle: string | null
  image_url: string | null
  link_url: string | null
  position: string | null
  sort_order: number
  is_active: boolean
  start_date: string | null
  end_date: string | null
}

export interface CompanyProfile {
  id: number
  company_name: string
  description: string | null
  vision: string | null
  mission: string | null
  logo_url: string | null
  email: string | null
  phone: string | null
  address: string | null
  social_media: Record<string, string> | null
}

export interface AppSetting {
  id: number
  name: string | null
  title: string | null
  logo_url: string | null
  favicon_url: string | null
  address: string | null
  phone: string | null
  email: string | null
  currency: string | null
  service_fee_type: string | null
  service_fee_value: number
  tax_type: string | null
  tax_value: number
  include_service_fee: boolean
  maps: {
    provider: string
    provider_label: string
    requires_api_key: boolean
    api_key?: string | null
    default_lat: number | null
    default_lng: number | null
    zoom: number | null
  }
}

export interface BookingPayload {
  store_id: number
  service_id: number
  service_type_id?: number | null
  voucher_id?: number | null
  cust_name: string
  cust_phone: string
  cust_address?: string | null
  notes?: string | null
  booking_date: string
  pickup_schedule?: string | null
  delivery_schedule?: string | null
}
