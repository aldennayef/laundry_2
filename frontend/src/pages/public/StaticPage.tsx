import { useParams } from 'react-router-dom'
import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { getPage } from '../../api/public'
import { Section } from '../../components/common/Section'
import { LoadingBlock } from '../../components/common/Spinner'
import { Alert } from '../../components/common/Alert'

/** Halaman statis dari CMS: /p/:slug (mis. syarat-ketentuan, kebijakan-privasi). */
export function StaticPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: page, loading, error } = useAsync(() => getPage(slug ?? ''), [slug])
  useDocumentTitle(page?.title ?? 'Halaman')

  return (
    <Section className="max-w-3xl">
      {loading && <LoadingBlock />}
      {error && <Alert tone="error">{error}</Alert>}
      {page && !loading && (
        <article>
          <h1 className="font-display text-3xl font-medium text-ink-900">{page.title}</h1>
          <div
            className="prose prose-slate mt-6 max-w-none text-ink-600"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </article>
      )}
    </Section>
  )
}
