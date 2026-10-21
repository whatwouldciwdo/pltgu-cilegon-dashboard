import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dashboard Internal Unit - PT PLN Indonesia Power UBP Cilegon',
  description: 'Portal Navigasi Aplikasi Korporat, Aplikasi Unit, dan IT Area UBP Cilegon',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased bg-[#eef2f6] text-slate-800">{children}</body>
    </html>
  );
}
