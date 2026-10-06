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
import { Icon } from '../../components/common/Icon'

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
            icon={<Icon name="sparkle" size={26} />}
          />
        </div>
      )}

      {articles && articles.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/blog/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-parchment-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="h-44 w-full overflow-hidden bg-parchment-100">
                {article.thumbnail_url ? (
                  <img
                    src={article.thumbnail_url}
                    alt={article.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-ink-300"><Icon name="sparkle" size={40} /></div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs text-ink-400">{formatDate(article.published_at)}</p>
                <h3 className="mt-2 text-base font-semibold text-ink-900 group-hover:text-gold-700">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-500">{article.excerpt}</p>
                <span className="mt-4 text-sm font-semibold text-gold-600">Baca selengkapnya →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Section>
  )
}
