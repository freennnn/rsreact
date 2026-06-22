import type { ReactNode } from 'react';

import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { LanguageSwitcher } from '../../components/LanguageSwitcher/LanguageSwitcher';
import { Link } from '../../i18n/navigation';
import { routing } from '../../i18n/routing';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Nav' });

  return (
    <NextIntlClientProvider>
      <div className="app-shell">
        <header className="app-header">
          <nav className="app-nav" aria-label="Main navigation">
            <Link href="/" className="app-nav-link">
              {t('home')}
            </Link>
            <Link href="/about" className="app-nav-link">
              {t('about')}
            </Link>
            <LanguageSwitcher />
          </nav>
        </header>
        <main className="app-main">{children}</main>
      </div>
    </NextIntlClientProvider>
  );
}
