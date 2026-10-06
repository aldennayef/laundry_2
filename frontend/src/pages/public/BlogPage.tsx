import { Link } from 'react-router-dom'
import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { getArticles } from '../../api/public'
import { PageHeader } from '../../components/common/PageHeader'
import { Section } from '../../components/common/Section'
import { LoadingBlock } from '../../components/common/Spinner'
import { EmptyState } from '../../components/common/EmptyState'
import { Alert } from '../../components/common/Alert'
import { formatDate } from '../../lib/format'

export function BlogPage() {
  useDocumentTitle('Artikel')
  const { data: articles, loading, error } = useAsync(() => getArticles(), [])

  return (
    <Section>
      <PageHeader
        eyebrow="Blog"
        title="Artikel & Tips"
        description="Tips merawat pakaian, berita, dan informasi seputar layanan kami."
      />

      {loading && <LoadingBlock />}
      {error && <div className="mt-6"><Alert tone="error">{error}</Alert></div>}

      {articles && articles.length === 0 && (
        <div className="mt-8">
          <EmptyState
            title="Belum ada artikel"
            description="Artikel dan tips akan segera dipublikasikan."
            icon="📝"
          />
        </div>
      )}

      {articles && articles.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/blog/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="h-44 w-full overflow-hidden bg-slate-100">
                {article.thumbnail_url ? (
                  <img
                    src={article.thumbnail_url}
                    alt={article.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-3xl text-slate-300">📰</div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs text-slate-400">{formatDate(article.published_at)}</p>
                <h3 className="mt-2 text-base font-semibold text-slate-900 group-hover:text-sky-700">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-500">{article.excerpt}</p>
                <span className="mt-4 text-sm font-semibold text-sky-600">Baca selengkapnya →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Section>
  )
}
