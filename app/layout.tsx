import type { Metadata } from 'next';
import { geistMono, geistSans } from '@/app/ui/fonts';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Treematric',
  description: 'Visualizador de datos de cambios de tempraturas de paises',
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
