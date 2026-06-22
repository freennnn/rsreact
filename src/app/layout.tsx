import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

const THEME_BOOTSTRAP_SCRIPT = `(function () {
  try {
    var persistedTheme = localStorage.getItem('AppTheme');
    var theme = persistedTheme === 'light' || persistedTheme === 'dark'
      ? persistedTheme
      : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (_) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();`;

export const metadata: Metadata = {
  title: 'RS React Repositories',
  description: 'Migrating the repository browser from Vite to Next.js App Router.',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
