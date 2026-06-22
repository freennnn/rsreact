import { getTranslations, setRequestLocale } from 'next-intl/server';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'HomePage' });

  return (
    <section className="app-page" aria-label="Migration bootstrap page">
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </section>
  );
}
