import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { getFaqs } from '../../api/public'
import { useSettings } from '../../context/SettingsContext'
import { PageHeader } from '../../components/common/PageHeader'
import { Section } from '../../components/common/Section'
import { Alert } from '../../components/common/Alert'
import { LoadingBlock } from '../../components/common/Spinner'
import { normalizeWaNumber } from '../../lib/whatsapp'

export function ContactPage() {
  useDocumentTitle('Kontak')
  const { settings, companyProfile, stores } = useSettings()
  const { data: faqs, loading } = useAsync(() => getFaqs(), [])

  const phone = settings?.phone ?? companyProfile?.phone
  const email = settings?.email ?? companyProfile?.email
  const address = settings?.address ?? companyProfile?.address
  const waNumber = normalizeWaNumber(stores.find((s) => s.whatsapp_number)?.whatsapp_number)

  return (
    <Section>
      <PageHeader
        eyebrow="Kontak"
        title="Hubungi Kami"
        description="Ada pertanyaan atau butuh bantuan? Tim kami siap membantu Anda."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {address && (
            <div className="rounded-2xl border border-parchment-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase text-ink-400">Alamat</p>
              <p className="mt-1 text-sm text-ink-700">{address}</p>
            </div>
          )}
          {phone && (
            <div className="rounded-2xl border border-parchment-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase text-ink-400">Telepon</p>
              <a href={`tel:${phone}`} className="mt-1 block text-sm text-gold-600 hover:text-gold-700">
                {phone}
              </a>
            </div>
          )}
          {email && (
            <div className="rounded-2xl border border-parchment-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase text-ink-400">Email</p>
              <a href={`mailto:${email}`} className="mt-1 block text-sm text-gold-600 hover:text-gold-700">
                {email}
              </a>
            </div>
          )}
          {waNumber && (
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl bg-jade-600 p-5 text-white transition hover:bg-jade-700"
            >
              <p className="text-xs font-semibold uppercase text-emerald-100">WhatsApp</p>
              <p className="mt-1 text-sm font-medium">Chat dengan kami sekarang →</p>
            </a>
          )}
          {!phone && !email && !address && (
            <Alert tone="info">Informasi kontak belum tersedia.</Alert>
          )}
        </div>

        <div>
          <h2 className="font-display text-2xl font-medium text-ink-900">Pertanyaan Umum</h2>
          {loading && <LoadingBlock />}
          {faqs && faqs.length === 0 && (
            <p className="mt-3 text-sm text-ink-500">Belum ada FAQ yang dipublikasikan.</p>
          )}
          <div className="mt-4 space-y-3">
            {(faqs ?? []).map((faq) => (
              <details key={faq.id} className="group rounded-xl border border-parchment-200 bg-white px-5 py-4">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-ink-800">
                  {faq.question}
                  <span className="text-ink-400 transition group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-3 text-sm text-ink-500">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
