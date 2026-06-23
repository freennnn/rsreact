import { getTranslations } from 'next-intl/server';

import { Link } from '../../i18n/navigation';

export default async function NotFoundPage() {
  const t = await getTranslations('NotFoundPage');

  return (
    <section className="app-page" aria-label="Not found page">
      <h1>{t('title')}</h1>
      <Link href="/">{t('back')}</Link>
    </section>
  );
}
