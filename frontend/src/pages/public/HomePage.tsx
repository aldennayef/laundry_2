import { Link } from 'react-router-dom'
import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { getBanners, getFaqs } from '../../api/public'
import { useSettings } from '../../context/SettingsContext'
import { useAuth } from '../../context/AuthContext'
import { ButtonLink } from '../../components/common/Button'
import { Card, CardBody } from '../../components/common/Card'
import { Section, SectionHeading } from '../../components/common/Section'
import { LoadingBlock } from '../../components/common/Spinner'
import { Price } from '../../components/common/Price'
import { EmptyState } from '../../components/common/EmptyState'
import type { Service } from '../../lib/types'

const FEATURES = [
  { icon: '🚚', title: 'Antar Jemput Gratis', desc: 'Kami menjemput dan mengantar laundry Anda di area layanan.' },
  { icon: '⏱️', title: 'Tepat Waktu', desc: 'Estimasi pengerjaan jelas dan bisa dipantau kapan saja.' },
  { icon: '🧼', title: 'Bersih & Wangi', desc: 'Dicuci dengan deterjen berkualitas dan peralatan modern.' },
  { icon: '⭐', title: 'Poin Loyalitas', desc: 'Kumpulkan poin setiap transaksi dan tukar dengan voucher.' },
  { icon: '🎟️', title: 'Voucher & Promo', desc: 'Nikmati potongan harga menarik untuk setiap pesanan.' },
  { icon: '💬', title: 'Konfirmasi WhatsApp', desc: 'Pesanan langsung terhubung ke WhatsApp cabang pilihan.' },
]

const STEPS = [
  { title: 'Pilih Layanan', desc: 'Tentukan cabang dan jenis layanan yang Anda butuhkan.' },
  { title: 'Isi Detail Penjemputan', desc: 'Lengkapi alamat, jadwal jemput, dan catatan khusus.' },
  { title: 'Konfirmasi via WhatsApp', desc: 'Booking tersimpan dan otomatis terkirim ke WhatsApp cabang.' },
]

function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="flex h-full flex-col">
      <CardBody className="flex flex-1 flex-col">
        <span className="inline-flex w-fit rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
          {service.category?.category_name ?? 'Layanan'}
        </span>
        <h3 className="mt-3 text-base font-semibold text-slate-900">{service.service_name}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-500">{service.description}</p>
        <div className="mt-4 flex items-baseline gap-1">
          <Price value={service.price} className="text-lg font-bold text-slate-900" />
          {service.unit && <span className="text-sm text-slate-500">/{service.unit}</span>}
        </div>
      </CardBody>
    </Card>
  )
}

export function HomePage() {
  useDocumentTitle('Beranda')
  const { settings, companyProfile, stores } = useSettings()
  const { isAuthenticated } = useAuth()
  const { data: banners } = useAsync(() => getBanners(), [])
  const { data: faqs } = useAsync(() => getFaqs(), [])

  const popularServices =
    stores.flatMap((store) => (store.services ?? []).slice(0, 3)).slice(0, 6)

  const banner = banners?.[0] ?? null
  const siteName = settings?.name ?? companyProfile?.company_name ?? 'Washe'

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-800 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              ✨ Laundry antar-jemput untuk hidup lebih mudah
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {banner?.title ?? `${siteName} — Bersih, Cepat, Terpercaya`}
            </h1>
            <p className="mt-4 max-w-lg text-base text-sky-100">
              {banner?.subtitle ??
                companyProfile?.description ??
                'Pesan layanan laundry dan dry cleaning favorit Anda. Kami jemput, cuci, dan antar kembali ke depan pintu.'}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {isAuthenticated ? (
                <ButtonLink to="/dashboard/booking/new" variant="secondary" size="lg">
                  Booking Sekarang
                </ButtonLink>
              ) : (
                <ButtonLink to="/register" variant="secondary" size="lg">
                  Mulai Booking
                </ButtonLink>
              )}
              <ButtonLink
                to="/layanan"
                size="lg"
                className="bg-white/10 text-white ring-1 ring-inset ring-white/30 hover:bg-white/20"
              >
                Lihat Layanan
              </ButtonLink>
            </div>
            <p className="mt-4 text-xs text-sky-200">
              Sudah punya akun?{' '}
              <Link to="/login" className="font-semibold underline">
                Masuk di sini
              </Link>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stores.slice(0, 2).map((store) => (
              <div key={store.id} className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/20">
                <p className="text-sm font-semibold">{store.store_name}</p>
                <p className="mt-1 text-xs text-sky-100">{store.city ?? store.address}</p>
                <p className="mt-3 text-xs text-sky-200">{store.operating_hours ?? 'Jam operasional menyesuaikan'}</p>
                <Link
                  to={`/store/${store.id}`}
                  className="mt-4 inline-block text-xs font-semibold text-white underline"
                >
                  Lihat cabang →
                </Link>
              </div>
            ))}
            {stores.length === 0 && (
              <div className="col-span-2 rounded-2xl bg-white/10 p-5 text-sm ring-1 ring-white/20">
                Cabang segera hadir di kota Anda.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <Section>
        <SectionHeading
          center
          eyebrow="Kenapa Washe"
          title="Layanan laundry yang bisa Anda andalkan"
          description="Kami menggabungkan kualitas, kecepatan, dan kemudahan dalam satu pengalaman."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-sky-50 text-xl">
                {feature.icon}
              </span>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Services */}
      <Section className="pt-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Layanan Populer" title="Pilihan layanan favorit" />
          <Link to="/layanan" className="text-sm font-semibold text-sky-600 hover:text-sky-700">
            Semua layanan →
          </Link>
        </div>
        <div className="mt-8">
          {popularServices.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {popularServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Belum ada layanan"
              description="Layanan akan segera ditampilkan di sini."
              icon="🧺"
            />
          )}
        </div>
      </Section>

      {/* Steps */}
      <div className="bg-white">
        <Section>
          <SectionHeading center eyebrow="Cara Kerja" title="Pesan dalam 3 langkah mudah" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <div key={step.title} className="relative rounded-2xl border border-slate-200 p-6">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-sky-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <ButtonLink to={isAuthenticated ? '/dashboard/booking/new' : '/register'} size="lg">
              {isAuthenticated ? 'Buat Booking Baru' : 'Daftar & Booking Sekarang'}
            </ButtonLink>
          </div>
        </Section>
      </div>

      {/* FAQ */}
      {faqs && faqs.length > 0 && (
        <Section>
          <SectionHeading center eyebrow="FAQ" title="Pertanyaan yang sering diajukan" />
          <div className="mx-auto mt-8 max-w-3xl space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.id}
                className="group rounded-xl border border-slate-200 bg-white px-5 py-4"
              >
                <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-slate-800">
                  {faq.question}
                  <span className="text-slate-400 transition group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-3 text-sm text-slate-500">{faq.answer}</p>
              </details>
            ))}
          </div>
        </Section>
      )}

      {/* CTA */}
      <Section>
        <div className="rounded-3xl bg-slate-900 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Siap menikmati laundry tanpa repot?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300">
            Daftar sekarang, pilih layanan, dan biarkan kami yang mengurus sisanya.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink to={isAuthenticated ? '/dashboard' : '/register'} variant="secondary" size="lg">
              {isAuthenticated ? 'Buka Dashboard' : 'Daftar Gratis'}
            </ButtonLink>
            <ButtonLink
              to="/kontak"
              size="lg"
              className="bg-white/10 text-white ring-1 ring-inset ring-white/30 hover:bg-white/20"
            >
              Hubungi Kami
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  )
}

export function PublicPageLoader() {
  return <LoadingBlock />
}

export { ServiceCard }
