import type { ReactNode } from 'react';

import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { Providers } from '../providers';
import { LanguageSwitcher } from '../../components/LanguageSwitcher/LanguageSwitcher';
import { SelectedItemsFlyoutBridge } from '../../components/SelectedItemsFlyout/SelectedItemsFlyoutBridge';
import { ThemeSwitcher } from '../../components/ThemeSwitcher/ThemeSwitcher';
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
      <Providers>
        <div className="app-shell">
          <header className="app-header">
            <nav className="app-nav" aria-label="Main navigation">
              <Link href="/" className="app-nav-link">
                {t('home')}
              </Link>
              <Link href="/about" className="app-nav-link">
                {t('about')}
              </Link>
              <ThemeSwitcher />
              <LanguageSwitcher />
            </nav>
          </header>
          <main className="app-main">
            {children}
            <SelectedItemsFlyoutBridge />
          </main>
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
}
