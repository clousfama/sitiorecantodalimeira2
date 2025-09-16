
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sítio Recanto da Limeira - Locação para Eventos e Temporada',
  description: 'Sítio localizado em Minas Gerais, próximo a Itabirito e Eng. Correa. Capacidade para 20 pessoas, 8 quartos, piscina e natureza exuberante. Ideal para confraternizações e momentos especiais.',
  keywords: 'sitio, locação, temporada, eventos, Minas Gerais, Itabirito, natureza, piscina, confraternização',
  openGraph: {
    title: 'Sítio Recanto da Limeira',
    description: 'Refúgio perfeito para momentos inesquecíveis em meio à natureza exuberante de Minas Gerais',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
