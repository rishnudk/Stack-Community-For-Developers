// import './globals.css';
import { TrpcProvider } from '../src/providers/TrpcProvider';

export const metadata = {
  title: 'My App',
  description: 'Next.js + tRPC + Fastify',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TrpcProvider>{children}</TrpcProvider>
      </body>
    </html>
  );
}
