import type { Metadata } from 'next';
import { geistMono, geistSans } from '@/app/ui/fonts';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Lab 1',
  description: 'Lab 1 de Estructura de datos 2',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
