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
    <html suppressHydrationWarning className={`${inter.className} scroll-smooth`}>
      <body className="flex flex-col min-h-screen">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[40rem] w-[40rem] rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute top-[12%] left-[8%] h-56 w-56 rounded-full bg-pink-400/15 blur-3xl" />
          <div className="absolute bottom-[10%] right-[12%] h-80 w-80 rounded-full bg-purple-500/15 blur-3xl" />
          <div className="absolute top-[35%] right-[35%] h-44 w-44 rounded-full bg-sky-400/15 blur-3xl" />
        </div>
        {children}
      </body>
    </html>
  );
}
