'use client';

import { RootProvider } from 'fumadocs-ui/provider/next';
import { useRouter, usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface LocaleProviderProps {
  lang: string;
  locales: { locale: string; name: string }[];
  children: ReactNode;
}

export function LocaleProvider({ lang, locales, children }: LocaleProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  function onLocaleChange(locale: string) {
    const segments = pathname.split('/');
    segments[1] = locale;
    router.push(segments.join('/'));
  }

  return (
    <RootProvider
      i18n={{ locale: lang, locales, onLocaleChange }}
      search={{ enabled: false }}
      theme={{ defaultTheme: 'dark' }}
    >
      {children}
    </RootProvider>
  );
}
