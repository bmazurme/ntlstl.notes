import { Helmet } from 'react-helmet-async';

interface PageMetaProps {
  title: string;
  description?: string;
}

const SITE_NAME = 'NTLSTL';

export default function PageMeta({ title, description }: PageMetaProps) {
  return (
    <Helmet>
      <title>{`${title} — ${SITE_NAME}`}</title>
      {description && (
        <meta
          name="description"
          content={description}
        />
      )}
    </Helmet>
  );
}
