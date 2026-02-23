import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import './global.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
});

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
    locale: 'en',
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

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          search={{
            enabled: false,
          }}
          theme={{
            defaultTheme: 'dark',
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
