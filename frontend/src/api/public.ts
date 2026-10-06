import { api } from './client'
import type { ApiEnvelope } from './types'
import type {
  AppSetting,
  Article,
  Banner,
  CompanyProfile,
  Faq,
  Page,
  Service,
  Store,
} from '../lib/types'

export async function getSettings(): Promise<AppSetting | null> {
  const res = await api.get<ApiEnvelope<AppSetting | null>>('/public/settings')
  return res.data.data
}

export async function getStores(): Promise<Store[]> {
  const res = await api.get<ApiEnvelope<Store[]>>('/public/stores')
  return res.data.data
}

export async function getStore(id: number): Promise<Store> {
  const res = await api.get<ApiEnvelope<Store>>(`/public/stores/${id}`)
  return res.data.data
}

export async function getServices(storeId: number): Promise<Service[]> {
  const res = await api.get<ApiEnvelope<Service[]>>('/public/services', {
    params: { store_id: storeId },
  })
  return res.data.data
}

export async function getArticles(): Promise<Article[]> {
  const res = await api.get<ApiEnvelope<Article[]>>('/public/articles')
  return res.data.data
}

export async function getArticle(slug: string): Promise<Article> {
  const res = await api.get<ApiEnvelope<Article>>(`/public/articles/${slug}`)
  return res.data.data
}

export async function getFaqs(): Promise<Faq[]> {
  const res = await api.get<ApiEnvelope<Faq[]>>('/public/faqs')
  return res.data.data
}

export async function getPage(slug: string): Promise<Page> {
  const res = await api.get<ApiEnvelope<Page>>(`/public/pages/${slug}`)
  return res.data.data
}

export async function getBanners(position?: string): Promise<Banner[]> {
  const res = await api.get<ApiEnvelope<Banner[]>>('/public/banners', {
    params: position ? { position } : undefined,
  })
  return res.data.data
}

export async function getCompanyProfile(): Promise<CompanyProfile | null> {
  const res = await api.get<ApiEnvelope<CompanyProfile | null>>('/public/company-profile')
  return res.data.data
}
