import './global.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className={inter.className}>
      <body className="flex flex-col min-h-screen">{children}</body>
    </html>
  );
}
