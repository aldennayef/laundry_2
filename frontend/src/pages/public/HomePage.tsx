import { Link } from 'react-router-dom'
import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useReveal } from '../../hooks/useReveal'
import { getBanners, getFaqs } from '../../api/public'
import { useSettings } from '../../context/SettingsContext'
import { useAuth } from '../../context/AuthContext'
import { ButtonLink } from '../../components/common/Button'
import { Section, SectionHeading } from '../../components/common/Section'
import { Price } from '../../components/common/Price'
import { Icon, type IconName } from '../../components/common/Icon'
import type { Service } from '../../lib/types'

/* -------------------------------------------------------------------------- */
/* Konten                                                                     */
/* -------------------------------------------------------------------------- */

const CAPABILITIES: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: 'truck',
    title: 'Antar jemput',
    desc: 'Penjemputan dan pengantaran dijadwalkan online, langsung dari rumah atau kantor.',
  },
  {
    icon: 'leaf',
    title: 'Wet cleaning',
    desc: 'Pencucian berbasis air yang lebih lembut untuk kain dan lebih ramah lingkungan.',
  },
  {
    icon: 'shirt',
    title: 'Dry cleaning',
    desc: 'Perawatan khusus untuk jas, gaun, dan bahan sensitif dengan hasil rapi.',
  },
  {
    icon: 'star',
    title: 'Poin & membership',
    desc: 'Setiap transaksi mengumpulkan poin dan membuka benefit keanggotaan.',
  },
]

const STEPS = [
  {
    title: 'Pilih cabang & layanan',
    desc: 'Tentukan outlet terdekat, jenis layanan, dan paket perawatan yang Anda butuhkan.',
  },
  {
    title: 'Atur jadwal jemput',
    desc: 'Isi alamat, jadwal antar-jemput, dan catatan khusus untuk tim kami.',
  },
  {
    title: 'Konfirmasi via WhatsApp',
    desc: 'Pesanan tersimpan dan tersambung langsung ke WhatsApp outlet pilihan Anda.',
  },
]

const TRUST_MARKS = ['Fabric-safe process', 'Scheduled pickup', 'Quality checked']

const CARE_NOTES = [
  'Dipilah berdasarkan bahan, warna, dan instruksi perawatan.',
  'Finishing dengan inspeksi akhir sebelum pengantaran.',
  'Catatan khusus tersimpan di booking agar tim outlet tidak menebak-nebak.',
]

/* -------------------------------------------------------------------------- */
/* Bagian UI                                                                  */
/* -------------------------------------------------------------------------- */

function ServiceRow({ service, index }: { service: Service; index: number }) {
  return (
    <article className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-6 gap-y-1 border-t border-ink-200 py-6 transition-colors hover:bg-ink-50/60">
      <span className="font-display text-sm tabular-nums text-ink-400">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <h3 className="font-display text-2xl leading-snug text-ink-900">
            {service.service_name}
          </h3>
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-400">
            {service.category?.category_name ?? 'Layanan'}
          </span>
        </div>
        {service.description && (
          <p className="mt-1 line-clamp-1 text-sm text-ink-500">{service.description}</p>
        )}
      </div>
      <div className="text-right">
        <Price value={service.price} className="font-display text-xl text-ink-900" />
        {service.unit && <span className="ml-1 text-sm text-ink-400">/ {service.unit}</span>}
      </div>
    </article>
  )
}

function Hero() {
  const { companyProfile, stores } = useSettings()
  const { isAuthenticated } = useAuth()
  const { data: banners } = useAsync(() => getBanners(), [])
  const banner = banners?.[0] ?? null

  const heroStore = stores.find((s) => s.whatsapp_number) ?? stores[0] ?? null
  const bookingHref = isAuthenticated ? '/dashboard#booking' : '/register'

  return (
    <section className="border-b border-ink-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-24">
        <div className="reveal">
          <span className="eyebrow text-accent-600">Laundry premium</span>

          <h1 className="font-display text-balance mt-5 max-w-2xl text-5xl leading-[0.98] text-ink-950 sm:text-6xl lg:text-7xl">
            {banner?.title ?? (
              <>
                Laundry bersih,
                <br />
                rapi, dan mudah.
              </>
            )}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-ink-600">
            {banner?.subtitle ??
              companyProfile?.description ??
              'Pesan laundry dan dry cleaning tanpa repot. Kami jemput, rawat, dan antar kembali pakaian Anda dengan proses yang jelas.'}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink to={bookingHref} size="lg">
              {isAuthenticated ? 'Buat booking' : 'Mulai booking'}
              <Icon name="arrowRight" size={16} />
            </ButtonLink>
            <ButtonLink to="/layanan" variant="secondary" size="lg">
              Lihat layanan
            </ButtonLink>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink-500">
            {TRUST_MARKS.map((mark) => (
              <span key={mark} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-accent-500" />
                {mark}
              </span>
            ))}
          </div>
        </div>

        <div className="reveal">
          <div className="border border-ink-200 bg-sand-50 p-6 sm:p-8">
            <div className="flex items-center justify-between gap-6">
              <div>
                <span className="eyebrow text-ink-400">Ringkasan</span>
                <h2 className="font-display mt-3 text-3xl leading-tight text-ink-950">
                  Antar jemput, dry clean, wet clean.
                </h2>
              </div>
              <Icon name="shirt" size={28} className="shrink-0 text-accent-600" />
            </div>

            <div className="mt-8 divide-y divide-ink-200 border-y border-ink-200">
              {[
                { label: 'Booking', value: 'Online' },
                { label: 'Konfirmasi', value: 'WhatsApp' },
                { label: 'Layanan', value: 'Laundry & dry cleaning' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-6 py-4 text-sm">
                  <span className="text-ink-500">{item.label}</span>
                  <span className="text-right font-medium text-ink-950">{item.value}</span>
                </div>
              ))}
            </div>

            {heroStore && (
              <div className="mt-6 flex items-center justify-between gap-4 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <Icon name="mapPin" size={15} className="text-accent-600" />
                  <span className="truncate text-ink-600">
                    Terdekat: <span className="font-medium text-ink-950">{heroStore.store_name}</span>
                  </span>
                </div>
                <Link to="/store" className="link-underline shrink-0 font-medium text-ink-900">
                  Lihat outlet
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function CareStandards() {
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="reveal lg:sticky lg:top-28">
          <span className="eyebrow text-accent-600">Care standards</span>
          <h2 className="font-display text-balance mt-4 text-4xl leading-none text-ink-950 sm:text-5xl">
            Bukan sekadar dicuci. Setiap pesanan punya standar handling.
          </h2>
          <p className="mt-5 text-base leading-8 text-ink-600">
            Tatanan layanan dibuat seperti workflow concierge: jelas, ringkas, dan mudah
            ditelusuri dari booking sampai pakaian kembali.
          </p>
        </div>

        <div className="grid gap-px bg-ink-200">
          {CAPABILITIES.map((cap, i) => (
            <article
              key={cap.title}
              className="reveal grid gap-5 bg-white p-6 sm:grid-cols-[auto_1fr] sm:p-8"
              style={{ transitionDelay: `${i * 45}ms` }}
            >
              <span className="grid h-12 w-12 place-items-center border border-ink-200 bg-sand-50 text-accent-600">
                <Icon name={cap.icon} size={21} />
              </span>
              <div>
                <h3 className="font-display text-3xl leading-none text-ink-950">{cap.title}</h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-ink-600">{cap.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  )
}

function ServiceConcierge({
  services,
  bookingHref,
}: {
  services: Service[]
  bookingHref: string
}) {
  const fallbackServices = [
    { name: 'Dry cleaning', desc: 'Perawatan kering untuk bahan sensitif dan pakaian formal.' },
    { name: 'Wet cleaning', desc: 'Pencucian berbasis air yang ramah kain dan lingkungan.' },
    { name: 'Shoe & bag care', desc: 'Perawatan khusus untuk sepatu dan tas kesayangan Anda.' },
    { name: 'Alteration', desc: 'Permak dan penyesuaian ukuran oleh penjahit berpengalaman.' },
  ]

  return (
    <Section className="border-y border-ink-200 bg-sand-50">
      <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div className="reveal">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow text-accent-600">Signature services</span>
              <h2 className="font-display text-balance mt-4 text-4xl leading-none text-ink-950 sm:text-5xl">
                Pilih treatment, kami urus detailnya.
              </h2>
            </div>
            <Link
              to="/layanan"
              className="link-underline inline-flex items-center gap-2 text-sm font-medium text-ink-900"
            >
              Semua layanan
              <Icon name="arrowRight" size={15} />
            </Link>
          </div>

          <div className="mt-10 border-y border-ink-200">
            {services.length > 0 ? (
              services.map((service, i) => (
                <div key={service.id} className="reveal" style={{ transitionDelay: `${i * 40}ms` }}>
                  <ServiceRow service={service} index={i} />
                </div>
              ))
            ) : (
              fallbackServices.map((item, i) => (
                <article
                  key={item.name}
                  className="reveal grid gap-2 border-t border-ink-200 py-6 first:border-t-0 sm:grid-cols-[0.7fr_1fr]"
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  <h3 className="font-display text-3xl text-ink-950">{item.name}</h3>
                  <p className="text-sm leading-7 text-ink-600">{item.desc}</p>
                </article>
              ))
            )}
          </div>
        </div>

        <aside className="reveal bg-ink-950 p-7 text-white sm:p-9 lg:sticky lg:top-28">
          <span className="eyebrow text-accent-300">Booking flow</span>
          <h3 className="font-display mt-4 text-4xl leading-none">Dari jadwal sampai konfirmasi.</h3>
          <ol className="mt-9 space-y-6">
            {STEPS.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[auto_1fr] gap-4 border-t border-white/12 pt-5">
                <span className="font-display text-3xl leading-none text-white/28">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h4 className="font-medium text-white">{step.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-white/58">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <ButtonLink to={bookingHref} variant="accent" size="lg" className="mt-9 w-full">
            Mulai booking
            <Icon name="arrowRight" size={16} />
          </ButtonLink>
        </aside>
      </div>
    </Section>
  )
}

function DetailNotes() {
  return (
    <Section>
      <div className="reveal grid gap-px bg-ink-200 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-white p-7 sm:p-10">
          <span className="eyebrow text-accent-600">The detail work</span>
          <h2 className="font-display text-balance mt-4 text-4xl leading-none text-ink-950 sm:text-5xl">
            Detail kecil yang membuat hasil akhir terasa berbeda.
          </h2>
        </div>
        <div className="grid gap-px bg-ink-200">
          {CARE_NOTES.map((note, i) => (
            <div key={note} className="bg-white p-6 sm:p-7">
              <span className="font-display text-3xl text-accent-600">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="mt-3 text-sm leading-7 text-ink-600">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

export function HomePage() {
  useDocumentTitle('Beranda')
  useReveal()
  const { stores, settings } = useSettings()
  const { isAuthenticated } = useAuth()
  const { data: faqs } = useAsync(() => getFaqs(), [])

  const popularServices = stores.flatMap((store) => (store.services ?? []).slice(0, 3)).slice(0, 6)
  const bookingHref = isAuthenticated ? '/dashboard#booking' : '/register'

  return (
    <>
      <Hero />

      <CareStandards />
      <ServiceConcierge services={popularServices} bookingHref={bookingHref} />
      <DetailNotes />

      <Section>
        <div className="reveal grid gap-px bg-ink-200 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-ink-950 p-7 text-white sm:p-10">
            <span className="eyebrow text-accent-300">Store locator</span>
            <h2 className="font-display mt-4 text-4xl leading-none sm:text-5xl">
              Outlet dekat, proses tetap rapi.
            </h2>
          </div>
          <div className="bg-white p-7 sm:p-10">
            <p className="max-w-2xl text-base leading-8 text-ink-600">
              Lihat daftar outlet lengkap dengan alamat, jam operasional, dan kontak. Setiap titik
              tersambung ke Google Maps agar penjemputan lebih mudah diatur.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/store">Lihat semua outlet</ButtonLink>
              <ButtonLink to="/kontak" variant="secondary">
                Hubungi kami
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {faqs && faqs.length > 0 && (
        <Section className="border-y border-ink-200 bg-sand-50">
          <div className="reveal grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <SectionHeading eyebrow="FAQ" title="Yang sering ditanyakan" />
            </div>
            <div className="divide-y divide-ink-200 border-y border-ink-200">
              {faqs.map((faq) => (
                <details key={faq.id} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-medium text-ink-900">
                    {faq.question}
                    <Icon
                      name="chevronDown"
                      size={18}
                      className="shrink-0 text-ink-400 transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Section>
      )}

      <Section className="bg-ink-950 text-white">
        <div className="reveal grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <span className="eyebrow text-accent-300">Ready when you are</span>
            <h2 className="font-display text-balance mt-4 text-4xl leading-none sm:text-6xl">
              Serahkan cucian Anda, nikmati waktu Anda.
            </h2>
          </div>
          <div>
            <p className="max-w-xl text-base leading-8 text-ink-300">
              Daftar sekarang, jadwalkan penjemputan, dan rasakan standar laundry premium dari{' '}
              {settings?.name ?? 'Washe'}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to={bookingHref} variant="accent" size="lg">
                {isAuthenticated ? 'Buka dashboard' : 'Mulai booking'}
                <Icon name="arrowRight" size={16} />
              </ButtonLink>
              <ButtonLink to="/kontak" variant="outlineLight" size="lg">
                Hubungi kami
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}

export { ServiceRow as ServiceCard }
