import { ButtonLink } from '../../components/common/Button'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Halaman Tidak Ditemukan')
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-sky-600">404</p>
      <h1 className="mt-4 text-xl font-bold text-slate-900">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-sm text-slate-500">
        Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
      </p>
      <div className="mt-6 flex gap-3">
        <ButtonLink to="/">Kembali ke Beranda</ButtonLink>
        <ButtonLink to="/layanan" variant="secondary">
          Lihat Layanan
        </ButtonLink>
      </div>
    </div>
  )
}
