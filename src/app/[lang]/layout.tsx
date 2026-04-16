import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import { i18n, localeDisplayNames } from '@/lib/i18n';

export const metadata: Metadata = {
  title: {
    default: 'BasisVR Docs',
    template: '%s | BasisVR Docs',
  },
  description: 'Documentation for BasisVR - Virtual Reality Framework',
  metadataBase: new URL('https://docs.basisvr.org'),
  openGraph: {
    title: 'BasisVR Docs',
    description: 'Documentation for BasisVR - Virtual Reality Framework',
    url: 'https://docs.basisvr.org',
    siteName: 'BasisVR Docs',
    images: [
      {
        url: '/img/basisvr-social-card.jpg',
        width: 1200,
        height: 630,
        alt: 'BasisVR',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BasisVR Docs',
    description: 'Documentation for BasisVR - Virtual Reality Framework',
    images: ['/img/basisvr-social-card.jpg'],
  },
  icons: {
    icon: '/img/BasisLogoSmall.png',
  },
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <RootProvider
      i18n={{
        locale: lang,
        locales: i18n.languages.map((l) => ({
          locale: l,
          name: localeDisplayNames[l] ?? l,
        })),
      }}
      search={{
        enabled: false,
      }}
      theme={{
        defaultTheme: 'dark',
      }}
    >
      {children}
    </RootProvider>
  );
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}
