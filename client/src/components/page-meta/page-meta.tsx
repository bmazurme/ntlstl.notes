import { Helmet } from 'react-helmet-async';

interface PageMetaProps {
  title: string;
  description?: string;
  /** Тип страницы для Open Graph. Заметки — 'article', остальное — 'website'. */
  type?: 'website' | 'article';
  /** Дата публикации в ISO-формате (для article:published_time). */
  publishedTime?: string;
  /** Рубрика/тип заметки (для article:section). */
  section?: string;
  /** Закрыть страницу от индексации (приватные/служебные разделы). */
  noindex?: boolean;
}

const SITE_NAME = 'NTLSTL';
const SITE_URL = 'https://ntlstl.ru';
const DEFAULT_DESCRIPTION = 'NTLSTL — платформа для ведения заметок';

/** Канонический URL текущей страницы без query-параметров и хэша. */
function getCanonicalUrl(): string {
  if (typeof window === 'undefined') return SITE_URL;
  return `${window.location.origin}${window.location.pathname}`;
}

export default function PageMeta({
  title,
  description,
  type = 'website',
  publishedTime,
  section,
  noindex = false,
}: PageMetaProps) {
  const fullTitle = `${title} — ${SITE_NAME}`;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const canonical = getCanonicalUrl();

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta
        name="description"
        content={metaDescription}
      />
      <link
        rel="canonical"
        href={canonical}
      />
      {noindex && (
        <meta
          name="robots"
          content="noindex, nofollow"
        />
      )}

      {/* Open Graph */}
      <meta
        property="og:site_name"
        content={SITE_NAME}
      />
      <meta
        property="og:type"
        content={type}
      />
      <meta
        property="og:title"
        content={fullTitle}
      />
      <meta
        property="og:description"
        content={metaDescription}
      />
      <meta
        property="og:url"
        content={canonical}
      />
      <meta
        property="og:locale"
        content="ru_RU"
      />
      {type === 'article' && publishedTime && (
        <meta
          property="article:published_time"
          content={publishedTime}
        />
      )}
      {type === 'article' && section && (
        <meta
          property="article:section"
          content={section}
        />
      )}

      {/* Twitter Card */}
      <meta
        name="twitter:card"
        content="summary"
      />
      <meta
        name="twitter:title"
        content={fullTitle}
      />
      <meta
        name="twitter:description"
        content={metaDescription}
      />
    </Helmet>
  );
}
