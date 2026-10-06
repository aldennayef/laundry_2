import { Link, useParams } from 'react-router-dom'
import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { getArticle } from '../../api/public'
import { Section } from '../../components/common/Section'
import { LoadingBlock } from '../../components/common/Spinner'
import { Alert } from '../../components/common/Alert'
import { formatDate } from '../../lib/format'

export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: article, loading, error } = useAsync(
    () => getArticle(slug ?? ''),
    [slug],
  )
  useDocumentTitle(article?.title ?? 'Artikel')

  return (
    <Section className="max-w-3xl">
      <Link to="/blog" className="text-sm font-medium text-gold-600 hover:text-gold-700">
        ← Kembali ke artikel
      </Link>

      {loading && <LoadingBlock />}
      {error && <div className="mt-6"><Alert tone="error">{error}</Alert></div>}

      {article && !loading && (
        <article className="mt-6">
          <h1 className="font-display text-3xl font-medium text-ink-900">{article.title}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-ink-400">
            <span>{formatDate(article.published_at)}</span>
            {article.author && <span>• oleh {article.author}</span>}
          </div>
          {article.thumbnail_url && (
            <img
              src={article.thumbnail_url}
              alt={article.title}
              className="mt-6 h-72 w-full rounded-2xl object-cover"
            />
          )}
          <div
            className="prose prose-slate mt-6 max-w-none text-ink-600"
            dangerouslySetInnerHTML={{ __html: article.content ?? article.excerpt ?? '' }}
          />
        </article>
      )}
    </Section>
  )
}
