import type { Metadata } from 'next';
import ClientProviders from './providers/ClientProviders';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Next.js + tRPC + Fastify',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
