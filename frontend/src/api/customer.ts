import { api } from './client'
import type {
  ApiEnvelope,
  AddressPayload,
  DashboardData,
  LoyaltyData,
} from './types'
import type {
  Address,
  Booking,
  BookingPayload,
  Voucher,
  VoucherRedemption,
} from '../lib/types'

export async function getDashboard(): Promise<DashboardData> {
  const res = await api.get<ApiEnvelope<DashboardData>>('/customer/dashboard')
  return res.data.data
}

export async function getBookings(): Promise<Booking[]> {
  const res = await api.get<ApiEnvelope<Booking[]>>('/customer/bookings')
  return res.data.data
}

export async function getBooking(id: number | string): Promise<Booking> {
  const res = await api.get<ApiEnvelope<Booking>>(`/customer/bookings/${id}`)
  return res.data.data
}

export async function createBooking(payload: BookingPayload): Promise<Booking> {
  const res = await api.post<ApiEnvelope<Booking>>('/customer/bookings', payload)
  return res.data.data
}

export async function cancelBooking(id: number): Promise<Booking> {
  const res = await api.post<ApiEnvelope<Booking>>(`/customer/bookings/${id}/cancel`)
  return res.data.data
}

export async function getAddresses(): Promise<Address[]> {
  const res = await api.get<ApiEnvelope<Address[]>>('/customer/addresses')
  return res.data.data
}

export async function createAddress(payload: AddressPayload): Promise<Address> {
  const res = await api.post<ApiEnvelope<Address>>('/customer/addresses', payload)
  return res.data.data
}

export async function updateAddress(id: number, payload: AddressPayload): Promise<Address> {
  const res = await api.put<ApiEnvelope<Address>>(`/customer/addresses/${id}`, payload)
  return res.data.data
}

export async function deleteAddress(id: number): Promise<void> {
  await api.delete(`/customer/addresses/${id}`)
}

export async function getLoyalty(): Promise<LoyaltyData> {
  const res = await api.get<ApiEnvelope<LoyaltyData>>('/customer/loyalty')
  return res.data.data
}

export async function getVoucherCatalog(): Promise<Voucher[]> {
  const res = await api.get<ApiEnvelope<Voucher[]>>('/customer/vouchers')
  return res.data.data
}

export async function getMyVouchers(): Promise<VoucherRedemption[]> {
  const res = await api.get<ApiEnvelope<VoucherRedemption[]>>('/customer/vouchers/mine')
  return res.data.data
}

export async function redeemVoucher(voucherId: number): Promise<VoucherRedemption> {
  const res = await api.post<ApiEnvelope<VoucherRedemption>>('/customer/vouchers/redeem', {
    voucher_id: voucherId,
  })
  return res.data.data
}
