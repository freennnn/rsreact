'use client';

import { useLocale, useTranslations } from 'next-intl';

import { usePathname, useRouter } from '../../i18n/navigation';
import { routing } from '../../i18n/routing';

export function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const onLocaleChange = (nextLocale: string) => {
    if (nextLocale === locale) {
      return;
    }

    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <label className="app-nav-locale">
      <span>{t('label')}</span>
      <select
        value={locale}
        onChange={(event) => onLocaleChange(event.target.value)}
      >
        {routing.locales.map((supportedLocale) => (
          <option key={supportedLocale} value={supportedLocale}>
            {t(supportedLocale)}
          </option>
        ))}
      </select>
    </label>
  );
}
