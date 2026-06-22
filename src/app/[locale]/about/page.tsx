import { getTranslations, setRequestLocale } from 'next-intl/server';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'AboutPage' });

  return (
    <section className="app-page about-page-panel" aria-label="About page">
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </section>
  );
}
