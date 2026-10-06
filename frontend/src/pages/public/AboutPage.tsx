import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useSettings } from '../../context/SettingsContext'
import { PageHeader } from '../../components/common/PageHeader'
import { Section } from '../../components/common/Section'
import { Alert } from '../../components/common/Alert'

export function AboutPage() {
  useDocumentTitle('Tentang Kami')
  const { companyProfile, settings, stores } = useSettings()
  const name = companyProfile?.company_name ?? settings?.name ?? 'Washe'

  return (
    <Section>
      <PageHeader
        eyebrow="Tentang"
        title={`Tentang ${name}`}
        description={companyProfile?.description ?? undefined}
      />

      {!companyProfile && (
        <div className="mt-6">
          <Alert tone="info">
            Profil perusahaan belum diisi di backend. Konten akan muncul otomatis setelah data tersedia.
          </Alert>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-parchment-200 bg-white p-6">
          <h2 className="font-display text-2xl font-medium text-ink-900">Visi</h2>
          <p className="mt-2 text-sm text-ink-600">
            {companyProfile?.vision ?? 'Menjadi layanan laundry paling tepercaya dan mudah diakses di Indonesia.'}
          </p>
        </div>
        <div className="rounded-2xl border border-parchment-200 bg-white p-6">
          <h2 className="font-display text-2xl font-medium text-ink-900">Misi</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-ink-600">
            {companyProfile?.mission ??
              '1. Memberikan hasil cucian berkualitas.\n2. Menawarkan layanan antar-jemput yang praktis.\n3. Memberi pengalaman pelanggan terbaik dengan harga wajar.'}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-parchment-200 bg-white p-5">
          <p className="text-3xl font-bold text-gold-600">{stores.length}</p>
          <p className="mt-1 text-sm text-ink-500">Cabang aktif</p>
        </div>
        <div className="rounded-2xl border border-parchment-200 bg-white p-5">
          <p className="text-2xl font-bold text-gold-600">100%</p>
          <p className="mt-1 text-sm text-ink-500">Kepuasan pelanggan</p>
        </div>
        <div className="rounded-2xl border border-parchment-200 bg-white p-5">
          <p className="text-2xl font-bold text-gold-600">4</p>
          <p className="mt-1 text-sm text-ink-500">Kategori layanan</p>
        </div>
      </div>
    </Section>
  )
}
